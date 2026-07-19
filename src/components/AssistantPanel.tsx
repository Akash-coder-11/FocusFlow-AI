// ─────────────────────────────────────────────
//  AI Assistant Chat Panel
// ─────────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Zap } from 'lucide-react';
import type { ChatMessage, AIAnalysisResult } from '../types';
import { askAssistant } from '../services/aiService';
import { Spinner } from './LoadingState';
import clsx from 'clsx';

interface AssistantPanelProps {
  context: AIAnalysisResult | null;
}

function getWelcomeMessage(context: AIAnalysisResult | null): string {
  if (!context) {
    return "Hi! I'm your FocusFlow AI assistant. Analyze a meeting first, then ask me anything — priorities, risks, blockers, next steps, or who's responsible for what.";
  }
  const critical = context.action_items.filter(a => a.priority === 'critical').length;
  const high     = context.action_items.filter(a => a.priority === 'high').length;
  return `Meeting analyzed ✓ — **${context.action_items.length} action items** found (${critical} critical, ${high} high priority), efficiency score **${context.meeting_efficiency_score}/100**. What would you like to dig into?`;
}

// Context-aware suggested questions
function getSuggestedQuestions(context: AIAnalysisResult | null): string[] {
  if (!context) {
    return [
      "What makes a good meeting follow-up?",
      "How do I prioritize action items?",
      "What should I analyze first?",
    ];
  }
  return [
    "What's the most urgent task to tackle first?",
    "Summarize the key risks from this meeting",
    "Who has the most tasks and could be overloaded?",
    "What should be delegated or deferred?",
  ];
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [{
    id:        'welcome',
    role:      'assistant',
    content:   getWelcomeMessage(context),
    timestamp: new Date(),
  }]);
  const [input,   setInput]  = useState('');
  const [loading, setLoad]   = useState(false);
  const bottomRef            = useRef<HTMLDivElement>(null);
  const prevContextRef       = useRef(context);

  // Update welcome message when context arrives (e.g. user analyzes after opening panel)
  useEffect(() => {
    if (prevContextRef.current === null && context !== null) {
      setMessages(prev => {
        const withoutWelcome = prev.filter(m => m.id !== 'welcome');
        return [
          { id: 'welcome', role: 'assistant', content: getWelcomeMessage(context), timestamp: new Date() },
          ...withoutWelcome,
        ];
      });
    }
    prevContextRef.current = context;
  }, [context]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id:        Date.now().toString(),
      role:      'user',
      content:   text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoad(true);

    try {
      const reply = await askAssistant(text.trim(), context);
      setMessages(prev => [...prev, {
        id:        `${Date.now()}r`,
        role:      'assistant',
        content:   reply,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id:        `${Date.now()}e`,
        role:      'assistant',
        content:   'Sorry, I ran into an issue. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoad(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const suggestedQuestions = getSuggestedQuestions(context);
  const showSuggestions    = messages.length <= 2;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 9rem)', maxHeight: '720px' }}>
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600
                        flex items-center justify-center shadow-glow-sm">
          <MessageSquare size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-slate-100">AI Assistant</h2>
          <p className="text-xs text-slate-500 truncate">
            {context
              ? `Context: ${context.action_items.length} tasks · score ${context.meeting_efficiency_score}/100`
              : 'Analyze a meeting to unlock full context'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                        bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-[11px] font-semibold text-emerald-400">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar glass-card p-4 mb-3 space-y-4 min-h-0">
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
                ? <Bot  size={15} className="text-white" />
                : <User size={15} className="text-white" />
              }
            </div>

            {/* Bubble */}
            <div className={clsx(
              'max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
              msg.role === 'assistant'
                ? 'bg-surface-hover border border-surface-border text-slate-200 rounded-tl-sm'
                : 'bg-brand-600 text-white rounded-tr-sm'
            )}>
              {/* Minimal bold markdown renderer */}
              {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
                  : <span key={i}>{part}</span>
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
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-surface-hover
                            border border-surface-border flex items-center gap-2">
              <Spinner size={14} className="text-brand-400" />
              <span className="text-xs text-slate-500">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Suggested questions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-3 animate-fade-in flex-shrink-0">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              disabled={loading}
              aria-label={`Ask: ${q}`}
              className="px-3 py-1.5 rounded-xl bg-surface-hover border border-surface-border
                         text-xs text-slate-400 hover:text-slate-100 hover:border-brand-600/40
                         disabled:opacity-50 transition-all duration-200 text-left"
            >
              <Zap size={10} className="inline mr-1 text-brand-500" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="glass-card p-3 flex gap-3 items-end flex-shrink-0">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about priorities, risks, ownership, next steps… (Enter to send)"
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
