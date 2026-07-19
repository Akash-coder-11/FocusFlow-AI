// ─────────────────────────────────────────────
//  AI Assistant Chat Panel
// ─────────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import type { ChatMessage, AIAnalysisResult } from '../types';
import { askAssistant } from '../services/aiService';
import { Spinner } from './LoadingState';
import clsx from 'clsx';

interface AssistantPanelProps {
  context: AIAnalysisResult | null;
}

const SUGGESTED_QUESTIONS = [
  "What's the most urgent task I should do first?",
  "Summarize the key risks from this meeting",
  "How should I handle the churn issue?",
  "Which items are blocking the team?",
];

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: context
        ? `I've analyzed your meeting. You have **${context.action_items.length} action items** and a **${context.meeting_efficiency_score}% efficiency score**. What would you like to dig into?`
        : "Hi! I'm your FocusFlow AI assistant. Analyze a meeting first, then ask me anything about the results — priorities, risks, team workload, or next steps.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoad]  = useState(false);
  const bottomRef           = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoad(true);

    try {
      const reply = await askAssistant(text.trim(), context);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'r',
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'e',
        role: 'assistant',
        content: 'Sorry, I ran into an issue. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoad(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[700px]">
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600
                        flex items-center justify-center shadow-glow-sm">
          <MessageSquare size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-slate-100">AI Assistant</h2>
          <p className="text-xs text-slate-500">
            {context ? 'Context loaded from your meeting analysis' : 'Analyze a meeting to unlock full context'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-[11px] font-semibold text-emerald-400">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar glass-card p-4 mb-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={clsx(
              'flex gap-3 animate-fade-in',
              msg.role === 'user' && 'flex-row-reverse'
            )}
          >
            {/* Avatar */}
            <div className={clsx(
              'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-brand-500 to-violet-600'
                : 'bg-gradient-to-br from-slate-600 to-slate-700'
            )}>
              {msg.role === 'assistant'
                ? <Bot size={15} className="text-white" />
                : <User size={15} className="text-white" />
              }
            </div>

            {/* Bubble */}
            <div className={clsx(
              'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
              msg.role === 'assistant'
                ? 'bg-surface-hover border border-surface-border text-slate-200'
                : 'bg-brand-600 text-white rounded-tr-sm'
            )}>
              {/* Render simple bold markdown */}
              {msg.content.split(/\*\*(.*?)\*\*/).map((part, i) =>
                i % 2 === 0
                  ? <span key={i}>{part}</span>
                  : <strong key={i} className="font-semibold">{part}</strong>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600
                            flex items-center justify-center">
              <Bot size={15} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-surface-hover border border-surface-border
                            flex items-center gap-2">
              <Spinner size={14} className="text-brand-400" />
              <span className="text-xs text-slate-500">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              className="px-3 py-1.5 rounded-xl bg-surface-hover border border-surface-border
                         text-xs text-slate-400 hover:text-slate-100 hover:border-brand-600/40
                         transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card p-3 flex gap-3 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about priorities, risks, team workload…"
          rows={1}
          className="input-base flex-1 min-h-0 py-2.5 resize-none"
          aria-label="Chat input"
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          className="btn-primary flex-shrink-0 px-4 py-2.5"
          aria-label="Send message"
        >
          {loading ? <Spinner size={16} /> : <Send size={15} />}
        </button>
      </div>
    </div>
  );
};
