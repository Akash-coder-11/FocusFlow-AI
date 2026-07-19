// ─────────────────────────────────────────────
//  AI Service – Gemini API + graceful mock mode
// ─────────────────────────────────────────────
import type { AIAnalysisResult } from '../types';
import { MOCK_AI_RESULT } from '../data/mockData';

// Reads from Vite env: create .env → VITE_GEMINI_API_KEY=your_key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL   = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// ── Safe defaults ──────────────────────────────────────────────────────────
const SAFE_DEFAULTS: AIAnalysisResult = {
  summary: 'Summary could not be generated. The AI response was incomplete — please try again.',
  key_decisions: [],
  action_items: [],
  follow_up_email: {
    subject: 'Follow-up from our recent meeting',
    to: '',
    body: 'Hi team,\n\nThank you for the meeting. I will follow up shortly with a detailed summary.\n\nBest regards',
  },
  suggested_schedule: [],
  insights: ['Retry the analysis with a more structured input for best results.'],
  sentiment: 'neutral',
  meeting_efficiency_score: 0,
};

// ── Prompt ─────────────────────────────────────────────────────────────────
function buildPrompt(notes: string): string {
  return `You are an expert productivity AI. Analyze the text below and return ONLY a single valid JSON object — no markdown, no code fences, no explanation.

Required JSON schema (all fields mandatory):
{
  "summary": "2-3 sentence executive summary of decisions made and outcomes",
  "key_decisions": ["decision 1", "decision 2", "decision 3"],
  "action_items": [
    {
      "id": "t1",
      "task": "Specific, actionable task description",
      "owner": "Person Name",
      "deadline": "Human-readable date or timeframe",
      "priority": "critical",
      "status": "pending"
    }
  ],
  "follow_up_email": {
    "subject": "Concise, professional subject line",
    "to": "Comma-separated attendee names or emails",
    "body": "Professional follow-up email. Use **Bold** for section headers and → for action lines."
  },
  "suggested_schedule": [
    {
      "time": "9:00 AM",
      "duration": "30 min",
      "title": "Task or block title",
      "type": "focus"
    }
  ],
  "insights": ["Non-obvious pattern or risk 1", "Insight 2", "Insight 3"],
  "sentiment": "mixed",
  "meeting_efficiency_score": 74
}

Strict rules:
- priority must be exactly one of: critical, high, medium, low
- type must be exactly one of: meeting, focus, review, break
- sentiment must be exactly one of: positive, neutral, mixed, negative
- meeting_efficiency_score must be an integer 0-100
- Extract every action item mentioned, even implicit ones
- suggested_schedule covers the 4-6 hours immediately after the meeting
- insights surface risks, blockers, or patterns not immediately obvious
- Return ONLY the JSON object. Any other text will break the parser.

TEXT TO ANALYZE:
${notes}`;
}

// ── Response parser with safe fallback ──────────────────────────────────────
function parseAndValidate(raw: string): AIAnalysisResult {
  // Strip markdown code fences the model sometimes wraps output in
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  let parsed: Partial<AIAnalysisResult>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('The AI returned invalid JSON. Please try again.');
  }

  // Normalise and fill missing fields with safe defaults
  const result: AIAnalysisResult = {
    summary:                  typeof parsed.summary === 'string' && parsed.summary.trim()
                                ? parsed.summary
                                : SAFE_DEFAULTS.summary,
    key_decisions:            Array.isArray(parsed.key_decisions) ? parsed.key_decisions : [],
    action_items:             Array.isArray(parsed.action_items)
                                ? parsed.action_items.map((item, i) => ({
                                    id:       item.id        || `t${i + 1}`,
                                    task:     item.task      || 'Unnamed task',
                                    owner:    item.owner     || 'Unassigned',
                                    deadline: item.deadline  || 'TBD',
                                    priority: (['critical','high','medium','low'] as const).includes(item.priority)
                                                ? item.priority
                                                : 'medium',
                                    status:   (['pending','in-progress','done'] as const).includes(item.status)
                                                ? item.status
                                                : 'pending',
                                  }))
                                : [],
    follow_up_email: {
      subject: parsed.follow_up_email?.subject || SAFE_DEFAULTS.follow_up_email.subject,
      to:      parsed.follow_up_email?.to      || '',
      body:    parsed.follow_up_email?.body    || SAFE_DEFAULTS.follow_up_email.body,
    },
    suggested_schedule:       Array.isArray(parsed.suggested_schedule)
                                ? parsed.suggested_schedule.map(s => ({
                                    time:     s.time     || '9:00 AM',
                                    duration: s.duration || '30 min',
                                    title:    s.title    || 'Task',
                                    type:     (['meeting','focus','review','break'] as const).includes(s.type)
                                                ? s.type
                                                : 'focus',
                                  }))
                                : [],
    insights:                 Array.isArray(parsed.insights) && parsed.insights.length > 0
                                ? parsed.insights
                                : SAFE_DEFAULTS.insights,
    sentiment:                (['positive','neutral','mixed','negative'] as const).includes(parsed.sentiment as never)
                                ? (parsed.sentiment as AIAnalysisResult['sentiment'])
                                : 'neutral',
    meeting_efficiency_score: typeof parsed.meeting_efficiency_score === 'number'
                                ? Math.min(100, Math.max(0, Math.round(parsed.meeting_efficiency_score)))
                                : 0,
  };

  return result;
}

// ── Main analysis function ──────────────────────────────────────────────────
export async function analyzeNotes(notes: string): Promise<AIAnalysisResult> {
  const trimmed = notes.trim();
  if (!trimmed) throw new Error('Please paste some text before analyzing.');

  // MOCK MODE – no API key, return demo data after a realistic delay
  if (!API_KEY) {
    console.info('[FocusFlow] Demo mode – no API key configured. Using sample AI response.');
    await new Promise(r => setTimeout(r, 1800));
    return MOCK_AI_RESULT;
  }

  // LIVE MODE – Gemini API
  let response: Response;
  try {
    response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(trimmed) }] }],
        generationConfig: {
          temperature:      0.2,   // deterministic structured output
          topP:             0.8,
          maxOutputTokens:  4096,
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
  } catch (networkErr) {
    throw new Error('Network error — check your internet connection and try again.');
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    if (response.status === 400) throw new Error('Invalid request. Check your API key format.');
    if (response.status === 403) throw new Error('API key rejected. Verify your Gemini API key in .env.');
    if (response.status === 429) throw new Error('Rate limit reached. Wait a moment and try again.');
    throw new Error(`Gemini API error (${response.status}): ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!text) {
    // API returned OK but empty — use safe defaults
    console.warn('[FocusFlow] Empty AI response, using safe fallback');
    return { ...SAFE_DEFAULTS, summary: 'The AI returned an empty response. Please try with a more detailed input.' };
  }

  return parseAndValidate(text);
}

// ── AI Assistant chat ──────────────────────────────────────────────────────
export async function askAssistant(
  question: string,
  context: AIAnalysisResult | null,
): Promise<string> {
  if (!API_KEY) {
    await new Promise(r => setTimeout(r, 600));
    return getMockAssistantReply(question, context);
  }

  const contextBlock = context
    ? `You have access to this meeting analysis:
Summary: ${context.summary}
Key decisions: ${context.key_decisions.join(' | ')}
Action items (${context.action_items.length}): ${context.action_items.map(a => `${a.task} (${a.priority}, owner: ${a.owner})`).join('; ')}
Insights: ${context.insights.join(' | ')}`
    : 'No meeting has been analyzed yet.';

  let response: Response;
  try {
    response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a concise productivity assistant for FocusFlow AI. Answer in 2-4 sentences max. Be specific and actionable.

${contextBlock}

User question: ${question}`,
          }],
        }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 300 },
      }),
    });
  } catch {
    return 'I could not reach the AI — please check your connection and try again.';
  }

  if (!response.ok) return 'The AI service returned an error. Please try again.';

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    ?? 'Sorry, I could not generate a response. Please rephrase and try again.';
}

// ── Mock replies (demo mode) ────────────────────────────────────────────────
function getMockAssistantReply(question: string, context: AIAnalysisResult | null): string {
  const q = question.toLowerCase();

  if (q.includes('urgent') || q.includes('first') || q.includes('priority')) {
    const critical = context?.action_items.find(a => a.priority === 'critical');
    return critical
      ? `Start with "${critical.task}" — it's marked critical and owned by ${critical.owner}, due ${critical.deadline}. Unblocking this will have the highest impact on the team.`
      : 'Focus on tasks that are blocking other people first. Delegate or defer anything that can wait 48+ hours.';
  }
  if (q.includes('email') || q.includes('send') || q.includes('follow')) {
    return 'Your follow-up email is ready in the Email panel. Review the action items list, personalize the sign-off, and send it within the hour — people retain meeting context for about 2-4 hours.';
  }
  if (q.includes('schedule') || q.includes('time') || q.includes('when')) {
    return 'Your AI schedule tackles the most time-sensitive items first. Block the first 45 minutes for quick administrative actions (tickets, escalations) so you clear blockers before deep work.';
  }
  if (q.includes('risk') || q.includes('concern') || q.includes('problem')) {
    const insight = context?.insights?.[0];
    return insight
      ? `Top risk from the analysis: "${insight}" — address this proactively before it becomes a blocker.`
      : 'Review the AI Insights card on the dashboard — it surfaces non-obvious risks and patterns from your meeting.';
  }
  if (q.includes('who') || q.includes('owner') || q.includes('team')) {
    const owners = context ? [...new Set(context.action_items.map(a => a.owner))] : [];
    return owners.length > 0
      ? `${owners.length} people have tasks: ${owners.join(', ')}. Everyone should have received the follow-up email with their specific items highlighted.`
      : 'Action item ownership is tracked in the Tasks panel. Make sure every task has a named owner before the follow-up email goes out.';
  }
  if (q.includes('summary') || q.includes('what happened') || q.includes('recap')) {
    return context?.summary
      ? context.summary
      : 'Paste your meeting notes and click "Analyze with AI" — I\'ll give you a concise executive summary instantly.';
  }

  return "I'm here to help you act on your meeting outcomes. Ask me about priorities, risks, who owns what, or how to handle any follow-up.";
}
