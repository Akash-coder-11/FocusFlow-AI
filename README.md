# FocusFlow AI

**AI-powered productivity command center — turn messy meeting notes into structured actions in seconds.**

> Built with React, TypeScript, Tailwind CSS, and Google Gemini 2.0 Flash.

---

## The Problem

Knowledge workers spend ~47% of their workday in meetings, yet more than 60% of action items are never completed. The gap between "what was decided" and "what gets done" costs teams hours every week.

Summarizing notes, drafting follow-up emails, assigning tasks, and planning the rest of the day — all of this is still done manually. There's no reason it should be.

---

## The Solution

FocusFlow AI takes any unstructured input — meeting notes, project briefs, Slack threads, email chains — and returns a complete, structured action plan in under 3 seconds.

**Paste text in → organized productivity out.**

| Output | What you get |
|--------|-------------|
| 📝 **Meeting Summary** | Executive brief + key decisions |
| ✅ **Action Items** | Every task with owner, deadline, and priority |
| 📧 **Follow-Up Email** | Professional draft, ready to send or edit |
| 📅 **Suggested Schedule** | Time-blocked plan for the next 4-6 hours |
| 💡 **AI Insights** | Hidden risks, patterns, and recommendations |
| 📊 **Efficiency Score** | 0-100 rating of how productive the meeting was |

---

## Core Features

- **🤖 Gemini 2.0 Flash AI** — structured JSON output, low latency, reliable parsing
- **📋 Meeting Summarizer** — executive brief with key decisions and sentiment analysis
- **✅ Interactive Task Board** — filter by priority, mark complete, track progress
- **✉️ Email Generator** — editable draft with one-click "Open in Mail Client"
- **📅 Smart Scheduler** — color-coded timeline of post-meeting time blocks
- **💬 AI Assistant** — context-aware chat to ask follow-up questions
- **📤 File Upload** — drag-and-drop `.txt` / `.md` files directly
- **⚡ Demo Mode** — full app works without an API key using realistic sample data
- **📱 Responsive** — clean layout on desktop and mobile
- **♿ Accessible** — skip links, ARIA labels, visible focus rings, semantic HTML

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v3 |
| Build | Vite 8 |
| AI Model | Google Gemini 2.0 Flash |
| Icons | Lucide React |
| Utilities | clsx |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+

### 1. Clone
```bash
git clone https://github.com/yourusername/focusflow-ai.git
cd focusflow-ai
```

### 2. Install
```bash
npm install
```

### 3. Configure AI (optional)
```bash
cp .env.example .env
# Open .env and set your Gemini API key
# Get a free key → https://aistudio.google.com/app/apikey
```

> **No API key?** Skip this step. The app runs in **demo mode** automatically and shows realistic sample output. Perfect for trying the app or running demos.

### 4. Start
```bash
npm run dev
# → http://localhost:5173
```

### 5. Build for production
```bash
npm run build
npm run preview
```

---

## Demo Walkthrough (< 2 minutes)

1. Open the app at `http://localhost:5173`
2. Click **"Sample"** to load a realistic Q3 planning meeting transcript
3. Click **"Analyze with AI"** — watch the dashboard update in real time
4. Review the **Meeting Summary** card with efficiency score and sentiment
5. Check the **Action Items** panel — 7 tasks, filterable by priority, all interactive
6. Read the **Follow-Up Email** draft — click "Edit" to personalize, "Copy" to clipboard
7. Glance at the **Suggested Schedule** — time-blocked for the next 6 hours
8. Read **AI Insights** — non-obvious risks surfaced automatically
9. Click **"AI Assistant"** in the sidebar — ask "What's most urgent?" for a contextual reply

---

## How the AI Works

### Structured Output by Design
The prompt explicitly demands JSON-only output with a fixed schema. This means:
- No free-text parsing or regex hacks
- Predictable, type-safe results every time
- Every field has a safe fallback if the model omits it

### The Prompt Strategy
```
Analyze meeting notes → Return ONLY this JSON:
{
  summary, key_decisions,
  action_items[{ task, owner, deadline, priority, status }],
  follow_up_email{ subject, to, body },
  suggested_schedule[{ time, duration, title, type }],
  insights[], sentiment, meeting_efficiency_score
}
```

### Error Resilience
- Missing fields → filled with safe defaults (never crashes the UI)
- Invalid JSON → user-friendly error with retry option
- Network failure → specific message (not a generic 500)
- Rate limits / auth errors → actionable error copy
- Empty API key → seamless mock mode, no error

---

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Sticky top bar with skip link + AI status
│   ├── Sidebar.tsx         # Navigation + session status
│   ├── UploadPanel.tsx     # Text input, drag-drop, file upload, char count
│   ├── SummaryPanel.tsx    # Summary + efficiency score ring + decisions
│   ├── TasksPanel.tsx      # Interactive tasks with priority filters
│   ├── EmailPanel.tsx      # Editable email draft + mailto launch
│   ├── SchedulePanel.tsx   # Timeline schedule view
│   ├── InsightsPanel.tsx   # Stats grid + AI insight cards
│   ├── AssistantPanel.tsx  # Context-aware AI chat
│   ├── LoadingState.tsx    # Shimmer skeleton UI
│   └── EmptyState.tsx      # Idle and error states
├── services/
│   └── aiService.ts        # Gemini API + full validation + mock mode
├── data/
│   └── mockData.ts         # Realistic sample data for demo mode
├── types/
│   └── index.ts            # Shared TypeScript interfaces
├── App.tsx                 # Root layout, state management, view routing
├── main.tsx                # Entry point
└── index.css               # Design system, tokens, animations
```

---

## Environment Variables

| Variable | Required | Description |
|---------|---------|-------------|
| `VITE_GEMINI_API_KEY` | No | Gemini API key. App uses demo data if unset. |

---

## Productivity Impact

| Manual effort | With FocusFlow AI |
|--------------|------------------|
| 30-45 min to summarize meeting notes | < 3 seconds |
| 15-20 min to write follow-up email | Instant draft, 2 min to review |
| No systematic task tracking | All items extracted with owner + deadline |
| Ad-hoc scheduling after meeting | AI-generated time-blocked plan |
| Insights require manual review | Surfaced automatically |

---

*Built for the AI Productivity Hackathon · FocusFlow AI © 2026*
