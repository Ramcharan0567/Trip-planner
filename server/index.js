import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDemoItinerary, inferDayCount, normalizeItinerary } from '../src/itinerary.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3006);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getActiveProvider() {
  dotenv.config({ override: true });
  const rawProvider = (process.env.LLM_PROVIDER || '').toLowerCase();

  if (rawProvider === 'gemini') {
    const key = (process.env.GEMINI_API_KEY || '').trim();
    if (!key) {
      return 'demo';
    }
    return 'gemini';
  }

  if (rawProvider && ['grok', 'openai', 'demo'].includes(rawProvider)) {
    return rawProvider;
  }

  return inferDefaultProvider();
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/health', (_request, response) => {
  const provider = getActiveProvider();
  response.json({ ok: true, provider });
});

// Live Place Photo Lookup API (Wikipedia / Wikimedia Media API)
async function fetchRealPlacePhoto(queryStr) {
  if (!queryStr || typeof queryStr !== 'string') return null;
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      queryStr.trim()
    )}&gsrlimit=1&prop=pageimages&pithumbsize=1000&format=json`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WanderAITripPlanner/1.0 (contact@wanderai.com)'
      }
    }).catch(() => null);

    clearTimeout(timer);

    if (!res || !res.ok) return null;
    const data = await res.json().catch(() => null);
    const pages = data?.query?.pages;
    if (!pages) return null;

    const firstPage = Object.values(pages)[0];
    const sourceUrl = firstPage?.thumbnail?.source;
    return sourceUrl || null;
  } catch {
    return null;
  }
}

async function enrichItineraryWithPhotos(itinerary) {
  if (!itinerary || !Array.isArray(itinerary.days)) return itinerary;

  try {
    const dest = itinerary.destination || '';
    const enrichedDays = await Promise.all(
      itinerary.days.map(async (day) => {
        if (!day || !Array.isArray(day.stops)) return day;
        const enrichedStops = await Promise.all(
          day.stops.map(async (stop) => {
            if (!stop || stop.image) return stop;
            try {
              const query = `${stop.name || ''} ${dest}`.trim();
              const photoUrl = await fetchRealPlacePhoto(query);
              if (photoUrl) {
                return { ...stop, image: photoUrl };
              }
            } catch {
              // ignore photo fetch error
            }
            return stop;
          })
        );
        return { ...day, stops: enrichedStops };
      })
    );

    return { ...itinerary, days: enrichedDays };
  } catch {
    return itinerary; // Safe fallback to original itinerary
  }
}

app.get('/api/place-photo', async (request, response) => {
  const query = typeof request.query?.q === 'string' ? request.query.q.trim() : '';
  if (!query) {
    response.status(400).json({ ok: false, error: 'Query parameter q is required' });
    return;
  }

  const photoUrl = await fetchRealPlacePhoto(query);
  if (photoUrl) {
    response.json({ ok: true, query, photoUrl });
  } else {
    response.json({ ok: false, query, photoUrl: null });
  }
});

app.post('/api/itinerary', async (request, response) => {
  const requestText = typeof request.body?.requestText === 'string' ? request.body.requestText.trim() : '';

  if (!requestText) {
    response.status(400).json({ ok: false, error: 'Describe the trip first.' });
    return;
  }

  const provider = getActiveProvider();

  try {
    let itinerary;
    let source = provider;
    let model = 'demo';
    let warning = '';

    if (provider === 'demo') {
      itinerary = buildDemoItinerary(requestText);
      source = 'demo';
      model = 'demo';
    } else {
      try {
        itinerary = await generateItineraryFromModel({ requestText, provider });
        model = getProviderConfig(provider)?.model || 'default';
        if (!itinerary || !Array.isArray(itinerary.days) || itinerary.days.length === 0) {
          throw new Error('Model returned empty itinerary');
        }
      } catch (modelError) {
        console.warn(`[TripPlanner API] ${provider} model failed (${modelError.message}). Falling back to demo mode.`);
        itinerary = buildDemoItinerary(requestText);
        source = `${provider} (fallback)`;
        model = 'demo-fallback';
        warning = `The ${provider.toUpperCase()} API model call fell back (${modelError.message}). Interactive itinerary generated.`;
      }
    }

    if (!itinerary) {
      itinerary = buildDemoItinerary(requestText);
    }

    // Enrich itinerary stops with real Wikipedia place photos (with safe fallback)
    let enrichedItinerary = itinerary;
    try {
      enrichedItinerary = await enrichItineraryWithPhotos(itinerary);
    } catch {
      enrichedItinerary = itinerary;
    }

    response.json({
      ok: true,
      source,
      model,
      warning: warning || undefined,
      itinerary: enrichedItinerary
    });
  } catch (error) {
    // Ultimate fallback guarantee: Always return a clean demo itinerary
    const fallbackItinerary = buildDemoItinerary(requestText);
    response.json({
      ok: true,
      source: 'fallback',
      model: 'demo',
      warning: `Notice: ${error instanceof Error ? error.message : 'Fallback itinerary generated'}`,
      itinerary: fallbackItinerary
    });
  }
});

// Serve React App index.html for all other routes
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Trip planner API listening on http://127.0.0.1:${port}`);
});

function inferDefaultProvider() {
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (geminiKey) {
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
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
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
    'You are a world-class travel planner API that returns ONLY valid raw JSON.',
    'CRITICAL RULES FOR PLACES AND SCHEDULE:',
    '1. You MUST provide specific, real-world named places, famous landmarks, exact temples, monuments, national parks, markets, and real dining venues for the requested destination.',
    '2. DO NOT use generic placeholder stop names like "Check in and settle in", "Local lunch", "Walking loop", "Morning anchor", "Main attraction", "Coffee break", or "Sunset overlook".',
    '3. Every stop name MUST be a real, identifiable, famous place name (e.g. "Golden Gate Bridge Overlook", "Yosemite Valley Tunnel View", "Sri Venkateswara Swamy Temple", "Dal Lake Shikara Ghat", "Eiffel Tower", "Fisherman\'s Wharf", "Munnar Tea Gardens", etc.).',
    '4. Every day title MUST specify the exact day number and tourist places to visit (e.g. "Day 1: Times Square & Midtown Landmarks", "Day 2: Central Park & Museum Mile"). DO NOT use vague day titles like "Local texture", "Flexible finale", "Signature highlights", or "Arrival and first impressions".',
    '5. Return a single JSON object with this EXACT structure:',
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
    `Create exactly ${dayCount} days based on the user request. Each day MUST have 3 to 4 detailed stops with real place names. Do not wrap the JSON in markdown fences.`
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

  const urlWithKey = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  let completion = await fetch(urlWithKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

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
