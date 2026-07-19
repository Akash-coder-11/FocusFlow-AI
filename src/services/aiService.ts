// ─────────────────────────────────────────────
//  AI Service – Gemini API + graceful mock mode
// ─────────────────────────────────────────────
import type { AIAnalysisResult } from '../types';
import { MOCK_AI_RESULT } from '../data/mockData';

// Reads from Vite env (create a .env file with VITE_GEMINI_API_KEY=your_key)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL   = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// ── Prompt ──────────────────────────────────────────────────────────────────
function buildPrompt(notes: string): string {
  return `You are an expert productivity AI assistant. Analyze the following meeting notes or document and return a single, valid JSON object with NO markdown, NO code fences, NO extra text — just raw JSON.

The JSON must match this exact schema:
{
  "summary": "2-3 sentence executive summary of what was discussed and decided",
  "key_decisions": ["decision 1", "decision 2", "decision 3"],
  "action_items": [
    {
      "id": "t1",
      "task": "clear, actionable task description",
      "owner": "Person Name",
      "deadline": "Human-readable date",
      "priority": "critical|high|medium|low",
      "status": "pending"
    }
  ],
  "follow_up_email": {
    "subject": "concise email subject line",
    "to": "comma-separated recipient names or emails mentioned",
    "body": "professional follow-up email with markdown formatting (bold headers, bullet points)"
  },
  "suggested_schedule": [
    {
      "time": "9:00 AM",
      "duration": "30 min",
      "title": "Task description",
      "type": "meeting|focus|review|break"
    }
  ],
  "insights": ["insight 1", "insight 2", "insight 3", "insight 4"],
  "sentiment": "positive|neutral|mixed|negative",
  "meeting_efficiency_score": 75
}

Rules:
- Extract ALL action items mentioned, even implicitly
- Assign realistic priorities based on urgency and business impact
- suggested_schedule should cover the next 4-6 hours post-meeting in chronological order
- insights should surface non-obvious patterns or risks
- meeting_efficiency_score: 0-100 (100 = clear agenda, all decisions made, all owners assigned)
- Return ONLY valid JSON, no other text

NOTES TO ANALYZE:
${notes}`;
}

// ── Parse helper ─────────────────────────────────────────────────────────────
function parseJSON(raw: string): AIAnalysisResult {
  // Strip markdown code fences if model ignores instructions
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  const parsed = JSON.parse(cleaned) as AIAnalysisResult;

  // Basic validation
  if (!parsed.summary || !Array.isArray(parsed.action_items)) {
    throw new Error('Incomplete AI response structure');
  }

  // Ensure IDs exist
  parsed.action_items = parsed.action_items.map((item, i) => ({
    ...item,
    id: item.id || `t${i + 1}`,
    status: item.status || 'pending',
  }));

  return parsed;
}

// ── Main function ─────────────────────────────────────────────────────────────
export async function analyzeNotes(notes: string): Promise<AIAnalysisResult> {
  // ── MOCK MODE: no API key configured ──────────────────────────────────────
  if (!API_KEY) {
    console.info('[FocusFlow] No API key found – using mock AI response for demo');
    // Simulate network latency for realism
    await new Promise(r => setTimeout(r, 1800));
    return MOCK_AI_RESULT;
  }

  // ── LIVE MODE: Gemini API call ─────────────────────────────────────────────
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(notes) }] }],
      generationConfig: {
        temperature: 0.3,       // low temp for structured output
        topP: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!text) throw new Error('Empty response from Gemini API');

  return parseJSON(text);
}

// ── Chat assistant helper ────────────────────────────────────────────────────
export async function askAssistant(
  question: string,
  context: AIAnalysisResult | null
): Promise<string> {
  if (!API_KEY) {
    await new Promise(r => setTimeout(r, 700));
    return getMockAssistantReply(question, context);
  }

  const systemContext = context
    ? `Context: You are analyzing meeting results. Summary: ${context.summary}. Action items: ${context.action_items.map(a => a.task).join(', ')}.`
    : 'You are a helpful productivity assistant.';

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemContext}\n\nUser question: ${question}\n\nProvide a concise, actionable response in 2-4 sentences.` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    }),
  });

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.';
}

function getMockAssistantReply(question: string, context: AIAnalysisResult | null): string {
  const q = question.toLowerCase();
  if (q.includes('priority') || q.includes('urgent')) {
    return context
      ? `Based on your meeting, the most critical item is: "${context.action_items.find(a => a.priority === 'critical')?.task ?? context.action_items[0]?.task}". Address this first today.`
      : "Focus on tasks that are both urgent and high-impact. Start with anything blocking others.";
  }
  if (q.includes('email') || q.includes('send')) {
    return "Your follow-up email draft is ready in the Email panel. Review it, personalize the sign-off, and send it within the hour while context is fresh.";
  }
  if (q.includes('schedule') || q.includes('time')) {
    return "Your suggested schedule starts with the most time-sensitive tasks. Block the first 30 minutes for quick wins — Jira tickets and the legal escalation call.";
  }
  if (q.includes('churn') || q.includes('retention')) {
    return "The mobile crash is your #1 churn driver per exit surveys. Resolving it by July 26 should immediately improve retention metrics in the following week.";
  }
  return "I'm here to help you action your meeting outcomes. Ask me about priorities, your schedule, or how to handle any specific follow-up.";
}
