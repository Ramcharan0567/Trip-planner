# Structured AI Trip Planner

An interactive, stateful web application that turns natural language trip descriptions into structured, day-by-day itineraries that users can edit, reorder, filter, and export.

> **Core Constraint**: This is **not a chatbot**. The AI returns validated JSON data rendered as interactive React UI components.

---

## 🚀 Quick Setup & Running Locally

1. **Install dependencies and start the app**:
   ```bash
   npm install
   npm start
   ```

2. Open **[http://localhost:5173](http://localhost:5173)** in your browser.

> `npm start` concurrently launches the Express API server (port 3001) and Vite client (port 5173).

---

## 🔑 LLM API Configuration (`.env`)

The app supports **xAI Grok**, **Google Gemini**, **OpenAI**, and a **Fallback Demo Mode**. Configure provider credentials in `.env`:

```env
# Choose provider: grok, gemini, openai, or demo
LLM_PROVIDER=grok

# --- GROK (xAI) ---
XAI_API_KEY=xai-YOUR_API_KEY_HERE
GROK_MODEL=grok-2-latest
GROK_BASE_URL=https://api.x.ai/v1

# --- GEMINI (Google AI Studio) ---
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.0-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta

# --- OPENAI ---
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

If an API key is missing or invalid, the backend automatically catches authentication and network errors, falling back seamlessly to **Interactive Demo Mode** so the app never crashes.

---

## 🛠️ Architecture & Features

### 1. Frontend (React 18 + Vite)
- **Stateful Board**: Render day-by-day trip cards with stops, timing, and category badges.
- **Interactive Editing**:
  - **Reorder Stops**: Move stops up (`↑`) or down (`↓`) within a day.
  - **Prune Stops**: Remove unwanted activities (`✕`).
  - **Expand / Collapse**: Toggle individual days, stops, or all days at once.
- **Filtering & Search**: Filter itinerary view by specific Day or Category (Food, Culture, Sightseeing, Scenic, Shopping).
- **1-Click Export**: Export formatted markdown of the current itinerary to clipboard.

### 2. Backend API Proxy (Express)
- **Key Protection**: API keys are securely stored server-side and never exposed to the client browser.
- **JSON Schema Enforcement**: Sends strict system instructions requiring valid JSON output formatted as a structured object (`tripTitle`, `destination`, `summary`, `days`).

---

## 🛡️ Failure Handling & Robustness

Handling AI output failure gracefully is a core priority of this application:

| Failure Mode | Mitigation Strategy |
| :--- | :--- |
| **Malformed JSON** | `parsePossiblyWrappedJson()` strips markdown code fences and extracts raw JSON bounds before parsing. |
| **Schema Mismatch / Empty Output** | `normalizeItinerary()` validates and normalizes days/stops, supplying safe default structures if fields are missing. |
| **API Auth or Network Failures** | Backend catches HTTP errors (e.g. invalid keys) and returns a fallback demo itinerary with an inline warning badge so the user experience is uninterrupted. |
| **Stale Responses / Race Conditions** | `submitPrompt()` tracks request IDs and uses `AbortController` to cancel pending HTTP requests when new prompts are submitted. |
| **Preservation of User State** | When regenerating a trip, if the API call fails, the UI retains the existing itinerary without wiping user progress. |

---

## 🤖 AI Usage Note

AI coding tools (Gemini / Claude) were used for boilerplate layout scaffolding, CSS styling polish, and sanity-checking API payload parsing. All data normalization logic, failure handling routines, state management, and component architectures were designed and authored specifically for this project.

---

## ⚠️ Known Limitations

- **Stop-level Reordering**: Reordering is implemented via explicit Up/Down buttons rather than HTML drag-and-drop to ensure maximum touch accessibility across mobile viewports.
- **Session Storage**: Current itinerary state is maintained in-memory during the browser session.

---

## ⏱️ Time Spent

~4 hours total (planning schema contracts, Express proxy endpoint, failure handling pipelines, and frontend React UI).
