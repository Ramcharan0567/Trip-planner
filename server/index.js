import dotenv from 'dotenv';
import express from 'express';
import { buildDemoItinerary, inferDayCount, normalizeItinerary } from '../src/itinerary.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

function getActiveProvider() {
  dotenv.config({ override: true });
  return (process.env.LLM_PROVIDER || inferDefaultProvider()).toLowerCase();
}

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  const provider = getActiveProvider();
  response.json({ ok: true, provider });
});

app.post('/api/itinerary', async (request, response) => {
  const requestText = typeof request.body?.requestText === 'string' ? request.body.requestText.trim() : '';

  if (!requestText) {
    response.status(400).json({ ok: false, error: 'Describe the trip first.' });
    return;
  }

  const provider = getActiveProvider();

  try {
    if (provider === 'demo') {
      const itinerary = buildDemoItinerary(requestText);
      response.json({ ok: true, source: 'demo', model: 'demo', itinerary });
      return;
    }

    try {
      const itinerary = await generateItineraryFromModel({ requestText, provider });
      response.json({ ok: true, source: provider, model: getProviderConfig(provider).model, itinerary });
    } catch (modelError) {
      console.warn(`[TripPlanner API] ${provider} model failed (${modelError.message}). Falling back to demo mode.`);
      const itinerary = buildDemoItinerary(requestText);
      response.json({
        ok: true,
        source: `${provider} (fallback)`,
        isFallback: true,
        warning: `The ${provider.toUpperCase()} API request failed (${modelError.message}). Fallback demo itinerary generated.`,
        model: 'demo-fallback',
        itinerary
      });
    }
  } catch (error) {
    response.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'The planner could not build an itinerary.'
    });
  }
});

app.listen(port, () => {
  console.log(`Trip planner API listening on http://127.0.0.1:${port}`);
});

function inferDefaultProvider() {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  if (geminiKey.startsWith('AIza')) {
    return 'gemini';
  }

  if (process.env.XAI_API_KEY || process.env.GROK_API_KEY) {
    return 'grok';
  }

  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }

  return 'demo';
}

function getProviderConfig(selectedProvider) {
  dotenv.config({ override: true });
  switch (selectedProvider) {
    case 'gemini':
      return {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
        baseUrl: (process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, ''),
        kind: 'gemini'
      };
    case 'grok':
      return {
        apiKey: process.env.XAI_API_KEY || process.env.GROK_API_KEY,
        model: process.env.GROK_MODEL || 'grok-2',
        baseUrl: (process.env.GROK_BASE_URL || 'https://api.x.ai/v1').replace(/\/$/, ''),
        kind: 'chat-completions'
      };
    case 'openai':
      return {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        baseUrl: (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, ''),
        kind: 'chat-completions'
      };
    default:
      return null;
  }
}

async function generateItineraryFromModel({ requestText, provider }) {
  const config = getProviderConfig(provider);

  if (!config?.apiKey) {
    throw new Error(`${provider.toUpperCase()} API key is not set. Switch LLM_PROVIDER to demo or add the right key.`);
  }

  if (config.kind === 'gemini') {
    return generateWithGemini({ requestText, apiKey: config.apiKey, model: config.model, baseUrl: config.baseUrl });
  }

  return generateWithChatCompletions({ requestText, apiKey: config.apiKey, model: config.model, baseUrl: config.baseUrl });
}

function createSystemPrompt(requestText = '') {
  const dayCount = inferDayCount(requestText);
  return [
    'You are a travel planner that returns only valid JSON.',
    'Return a single object with this shape:',
    '{',
    '  "tripTitle": string,',
    '  "destination": string,',
    '  "summary": string,',
    '  "days": [',
    '    {',
    '      "title": string,',
    '      "focus": string,',
    '      "overview": string,',
    '      "stops": [',
    '        {',
    '          "name": string,',
    '          "time": string,',
    '          "category": string,',
    '          "description": string,',
    '          "notes": string',
    '        }',
    '      ]',
    '    }',
    '  ]',
    '}',
    `Create exactly ${dayCount} days based on the user request. Each day needs 3 to 5 stops. Do not wrap the JSON in markdown fences.`
  ].join('\n');
}

async function generateWithChatCompletions({ requestText, apiKey, model, baseUrl }) {
  const payload = {
    model,
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: createSystemPrompt(requestText)
      },
      {
        role: 'user',
        content: `Plan this trip: ${requestText}`
      }
    ]
  };

  const completion = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!completion.ok) {
    const errorDetails = await safeReadErrorDetails(completion);
    throw new Error(errorDetails);
  }

  const result = await completion.json();
  const content = result?.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('The model returned an empty response.');
  }

  const parsed = parsePossiblyWrappedJson(content);
  return normalizeItinerary(parsed);
}

async function generateWithGemini({ requestText, apiKey, model, baseUrl }) {
  const payload = {
    systemInstruction: {
      parts: [
        {
          text: createSystemPrompt(requestText)
        }
      ]
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Plan this trip: ${requestText}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    }
  };

  // Strategy 1: Standard API key query param + x-goog-api-key header
  const urlWithKey = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  let completion = await fetch(urlWithKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  // Automatic retry for short 429 rate limit cooldowns
  if (completion.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    completion = await fetch(urlWithKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });
  }

  // Strategy 2: If 401/403, try Authorization Bearer header
  if (!completion.ok && (completion.status === 401 || completion.status === 403)) {
    const urlNoKey = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`;
    const bearerCompletion = await fetch(urlNoKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    if (bearerCompletion.ok) {
      completion = bearerCompletion;
    }
  }

  if (!completion.ok) {
    const errorDetails = await safeReadErrorDetails(completion);
    throw new Error(errorDetails);
  }

  const result = await completion.json();
  const content = extractGeminiText(result);

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('The model returned an empty response.');
  }

  const parsed = parsePossiblyWrappedJson(content);
  return normalizeItinerary(parsed);
}

function extractGeminiText(result) {
  const parts = result?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
}

async function safeReadErrorDetails(response) {
  try {
    const rawText = await response.text();
    try {
      const json = JSON.parse(rawText);
      if (typeof json?.error === 'string') return json.error;
      if (typeof json?.error?.message === 'string') return json.error.message;
      if (typeof json?.message === 'string') return json.message;
      return rawText.slice(0, 300) || `HTTP ${response.status} ${response.statusText}`;
    } catch {
      return rawText.slice(0, 300) || `HTTP ${response.status} ${response.statusText}`;
    }
  } catch {
    return `HTTP ${response.status} ${response.statusText}`;
  }
}

function parsePossiblyWrappedJson(content) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const firstBrace = candidate.indexOf('{');
  
  if (firstBrace === -1) {
    throw new Error('The model response did not contain JSON.');
  }

  const lastBrace = candidate.lastIndexOf('}');
  const jsonText = lastBrace > firstBrace ? candidate.slice(firstBrace, lastBrace + 1) : candidate.slice(firstBrace);

  try {
    return JSON.parse(jsonText);
  } catch (initialError) {
    try {
      const repaired = repairTruncatedJson(jsonText);
      return JSON.parse(repaired);
    } catch {
      throw initialError;
    }
  }
}

function repairTruncatedJson(str) {
  let cleaned = str.trim();
  cleaned = cleaned.replace(/,\s*"[^"]*"?\s*:?\s*[^,}\]]*$/, '');
  cleaned = cleaned.replace(/,\s*$/, '');
  
  let openBraces = 0;
  let openBracket = 0;
  let inString = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '"' && cleaned[i - 1] !== '\\') {
      inString = !inString;
    } else if (!inString) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      if (char === '[') openBracket++;
      if (char === ']') openBracket--;
    }
  }

  if (inString) cleaned += '"';
  while (openBracket > 0) { cleaned += ']'; openBracket--; }
  while (openBraces > 0) { cleaned += '}'; openBraces--; }

  return cleaned;
}
