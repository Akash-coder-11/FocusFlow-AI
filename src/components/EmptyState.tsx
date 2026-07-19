// ─────────────────────────────────────────────
//  Empty state – no analysis yet
// ─────────────────────────────────────────────
import React from 'react';
import { Sparkles, FileText, Zap, Mail, Calendar, ChevronUp } from 'lucide-react';

export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-14 px-6 text-center animate-fade-in">
    {/* Icon orb – single pulse, not aggressive ping */}
    <div className="relative mb-7">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600
                      flex items-center justify-center shadow-glow">
        <Sparkles size={32} className="text-white" />
      </div>
      <div className="absolute -inset-2 rounded-2xl bg-brand-500/10 animate-pulse-slow -z-10" />
    </div>

    <h2 className="text-xl font-bold text-slate-100 mb-2">
      Paste your notes above to get started
    </h2>
    <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-8">
      Gemini 2.0 Flash reads your raw text and returns a structured action plan —
      tasks, email draft, schedule, and insights — in under 3 seconds.
    </p>

    {/* Feature chips */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8 w-full max-w-xl">
      {[
        { icon: <FileText size={14} />,  label: 'Summary',     sub: 'Executive brief'     },
        { icon: <Zap size={14} />,       label: 'Tasks',       sub: 'With owner & date'   },
        { icon: <Mail size={14} />,      label: 'Email draft', sub: 'Ready to send'       },
        { icon: <Calendar size={14} />,  label: 'Schedule',    sub: 'Time-blocked plan'   },
      ].map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                     bg-surface-card border border-surface-border text-center"
        >
          <span className="text-brand-400">{item.icon}</span>
          <span className="text-xs font-semibold text-slate-300">{item.label}</span>
          <span className="text-[10px] text-slate-600">{item.sub}</span>
        </div>
      ))}
    </div>

    <div className="flex items-center gap-1.5 text-slate-600">
      <ChevronUp size={14} className="animate-bounce" />
      <span className="text-xs">Use the Sample button for an instant demo</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────
//  Error state
// ─────────────────────────────────────────────
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div
    className="glass-card p-8 flex flex-col items-center text-center animate-fade-in"
    role="alert"
    aria-live="assertive"
  >
    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20
                    flex items-center justify-center mb-4">
      <AlertTriangle size={24} className="text-red-400" />
    </div>
    <h2 className="text-base font-bold text-slate-100 mb-2">Analysis Failed</h2>
    <p className="text-slate-400 text-sm max-w-sm mb-5 leading-relaxed">{message}</p>

    <div className="flex flex-col sm:flex-row gap-3">
      <button onClick={onRetry} className="btn-primary">
        <Sparkles size={15} />
        Try Again
      </button>
    </div>

    {!import.meta.env.VITE_GEMINI_API_KEY && (
      <p className="text-xs text-slate-600 mt-4">
        No API key configured — the app runs in demo mode automatically.
      </p>
    )}
  </div>
);
