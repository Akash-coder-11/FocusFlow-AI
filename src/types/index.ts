// ─────────────────────────────────────────────
//  FocusFlow AI  –  Shared TypeScript types
// ─────────────────────────────────────────────

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'done';
}

export interface ScheduleSlot {
  time: string;
  duration: string;
  title: string;
  type: 'meeting' | 'focus' | 'review' | 'break';
}

export interface AIAnalysisResult {
  summary: string;
  key_decisions: string[];
  action_items: ActionItem[];
  follow_up_email: {
    subject: string;
    to: string;
    body: string;
  };
  suggested_schedule: ScheduleSlot[];
  insights: string[];
  sentiment: 'positive' | 'neutral' | 'mixed' | 'negative';
  meeting_efficiency_score: number; // 0-100
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type AppView = 'dashboard' | 'assistant' | 'history';

export interface ProcessingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}
