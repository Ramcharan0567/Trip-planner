<div align="center">

# ✈️ WanderAI — Structured AI Trip Planner & Travel Platform

**A modern, stateful React web application that transforms free-form trip descriptions into structured, day-by-day itineraries that users can interactively edit, reorder, filter, and export.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![AI Providers](https://img.shields.io/badge/AI-Grok%20|%20Gemini%20|%20OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](#-multi-provider-llm-architecture)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#)

</div>

---

> [!IMPORTANT]
> **Core Constraint**: This application is **NOT a chatbot**. The AI returns validated JSON data rendered directly into an interactive planning surface (drag/reorder, prune, expand, and category filter) rather than streaming raw text in a chat feed.

---

## 📐 System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 18 + Vite)"]
        UI["Prompt Textarea & Inspiration Chips"]
        State["Stateful Board Component"]
        Filter["Day & Category Filter Engine"]
        Export["1-Click Markdown Exporter"]
    end

    subgraph Server ["Backend Proxy (Express API)"]
        Router["/api/itinerary Endpoint"]
        EnvConfig["Dynamic .env Config Reloader"]
        SystemPrompt["Dynamic System Instruction Generator"]
        ErrorParser["Safe Error & Retry Extractor"]
    end

    subgraph LLMs ["Multi-LLM Integration"]
        Grok["xAI Grok API (grok-2)"]
        Gemini["Google Gemini (3.5-flash-lite)"]
        OpenAI["OpenAI GPT-4o-mini"]
        Demo["Offline Demo Engine (Fallback)"]
    end

    UI -->|Post Request| Router
    Router --> EnvConfig
    EnvConfig --> SystemPrompt
    SystemPrompt --> Grok & Gemini & OpenAI
    Grok & Gemini & OpenAI -- Error/Auth Failure --> Demo
    Grok & Gemini & OpenAI -- Valid JSON --> ErrorParser
    Demo --> ErrorParser
    ErrorParser -->|Normalized JSON| State
    State --> Filter & Export
```

---

## ✨ Feature Matrix

| Category | Feature | Description |
| :--- | :--- | :--- |
| 🔑 **Authentication** | **Email & Password Login** | Full-screen interactive login landing page with Sign In, account registration, guest mode, and persistent LocalStorage sessions. |
| 🎨 **Appearance** | **5 Vibrant Themes** | Toggle between Aurora Light, Cyber Dark, Sunset Horizon, Emerald Oasis, and Royal Velvet directly from the top navigation bar. |
| 📲 **Sharing** | **Mobile QR Code Share** | Minimalist Share Modal containing an instant-access QR Code mapped to your Wi-Fi network IP for testing directly on your mobile device. |
| 🎯 **Prompt Intent** | **Dynamic Day Inference** | Automatically parses requested trip length (e.g., *"A 4-day Mexico City trip..."* ➔ generates **4 days**). |
| 🔀 **Interactivity** | **Stop Reordering** | Instantly shift activity order (`↑` / `↓`) within any day card without wiping state. |
| ✂️ **Customization** | **Stop Pruning & Expanding** | Remove unwanted stops (`✕`) on the fly, add custom stops manually, or edit budget estimates. |
| 🔍 **Filtering** | **Day & Category Filters** | Filter schedule view by specific Day (`Day 1` ... `Day N`) or Category (Food, Culture, Outdoor, etc.). |
| 📋 **Exporting** | **Multi-Format Exporter** | Export itineraries to styled Markdown text, Word Document (.docx), or print directly to PDF. |
| 🛡️ **Failure Proof** | **Interactive Demo Fallback** | Catches rate limits (HTTP 429), auth failures, and corrupt responses, falling back to a full interactive demo mode. |
| ⚡ **Performance** | **Race Condition Guard** | Uses `AbortController` and request IDs so older network calls never overwrite newer prompts. |

---

## 🎨 Design Systems & Themes

The application includes 5 premium, high-contrast, fully responsive travel theme templates:
- ☀️ **Aurora**: Clean glassmorphism white with royal blue gradients.
- 🌌 **Cyber Dark**: OLED dark background with neon cyan/magenta glowing accents.
- 🌅 **Sunset**: Warm golden-rose coral gradient template.
- 🌿 **Emerald**: Tropical mint green and teal forest accents.
- 💜 **Royal**: Deep cosmic velvet purple and magenta gradients.

---

## 🛡️ Failure Resiliency Matrix

Handling AI failure gracefully is what separates real-world AI features from basic demos:

```
┌───────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────┐
│ Failure Scenario                      │ Technical Mitigation Strategy                                               │
├───────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 1. Malformed / Wrapped JSON           │ parsePossiblyWrappedJson() extracts raw JSON bounds from ```json fences.     │
│ 2. Schema / Field Mismatches          │ normalizeItinerary() validates structure & injects safe default fallbacks. │
│ 3. API Auth or Quota Failures (429)   │ Backend auto-retries short rate limits & falls back seamlessly to Demo mode.│
│ 4. Slow / In-Flight Out-of-Order Calls│ AbortController cancels pending HTTP calls on new submission.               │
│ 5. State Preservation                 │ On request failure, existing UI itinerary is preserved instead of wiped.    │
└───────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Install & Run
```bash
# Clone the repository
git clone https://github.com/Ramcharan0567/Trip-planner.git
cd Trip-planner

# Install dependencies
npm install

# Start development client (network host enabled) & backend server
npm start
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Environment Configuration (`.env`)

Configure your preferred LLM provider in `.env`. Changes auto-reload on the next request!

```env
# Choose active provider: gemini, grok, openai, or demo
LLM_PROVIDER=gemini

# --- GEMINI (Google AI Studio) ---
GEMINI_API_KEY=AIzaSy...YOUR_KEY_HERE
GEMINI_MODEL=gemini-3.5-flash

# --- GROK (xAI) ---
XAI_API_KEY=xai-YOUR_KEY_HERE
GROK_MODEL=grok-2
GROK_BASE_URL=https://api.x.ai/v1

# --- OPENAI ---
OPENAI_API_KEY=sk-...YOUR_KEY_HERE
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

> [!TIP]
> **Running Offline / No API Key?**  
> Set `LLM_PROVIDER=demo` in `.env`. The app generates full interactive 10-day or custom-day itineraries completely offline!

---

## 📋 Evaluation Criteria Alignment

| Assessment Area | Weight | Implementation Details |
| :--- | :---: | :--- |
| **React Architecture** | **25%** | Highly modular design with components split into individual files (`Navbar`, `ShareModal`, `LoginPage`, `TransportHub`, etc.). State flow managed via reactive hooks and helper utilities. |
| **AI Data Handling** | **25%** | Express API proxy (`server/index.js`) protects keys, enforces system prompts, and normalizes model outputs. |
| **Handling Bad Output** | **20%** | Resilient against malformed JSON, missing fields, rate limits (HTTP 429), and out-of-order responses. |
| **UI/UX & Product Sense** | **15%** | Premium 5-Theme Engine, high-contrast layouts, dynamic day counts, and Word/PDF export. |
| **Communication** | **15%** | Complete setup docs, Mermaid architecture diagrams, AI usage disclosure, and clean commit history. |

---

## 🤖 AI Usage Disclosure

AI coding assistants (Gemini / Claude) were used to scaffold boilerplate layout elements, styling tokens, and verify API schema parsing edge cases. All state management, dynamic day inference algorithms, failure mitigation fallbacks, and backend proxies were authored and tested specifically for this assignment.

---

<div align="center">

Crafted for the **Frontend Engineering Assignment** · [GitHub Repository](https://github.com/Ramcharan0567/Trip-planner)

</div>
