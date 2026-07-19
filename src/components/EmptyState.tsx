// ─────────────────────────────────────────────
//  Empty state – no results yet
// ─────────────────────────────────────────────
import React from 'react';
import { Sparkles, ArrowDown, FileText, Zap, MessageSquare } from 'lucide-react';

export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
    {/* Glow orb */}
    <div className="relative mb-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-violet-600
                      flex items-center justify-center shadow-glow">
        <Sparkles size={36} className="text-white" />
      </div>
      <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" />
    </div>

    <h2 className="text-2xl font-bold text-slate-100 mb-3">
      Transform Your Notes Into
      <span className="text-gradient block mt-1">Structured Actions</span>
    </h2>

    <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
      Paste meeting notes, project briefs, or any work document above.
      Gemini 2.0 Flash will instantly extract tasks, draft your follow-up email,
      suggest your schedule, and surface key insights.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 mb-10">
      {[
        { icon: <FileText size={16} />, label: 'Meeting notes summarized' },
        { icon: <Zap size={16} />,      label: 'Tasks extracted instantly' },
        { icon: <MessageSquare size={16} />, label: 'Follow-up email drafted' },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-surface-card border border-surface-border text-sm text-slate-400"
        >
          <span className="text-brand-400">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>

    <div className="flex items-center gap-2 text-slate-600 animate-bounce">
      <ArrowDown size={16} />
      <span className="text-xs">Paste your notes in the panel above</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────
//  Error state
// ─────────────────────────────────────────────
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20
                    flex items-center justify-center mb-6">
      <span className="text-3xl">⚠️</span>
    </div>
    <h2 className="text-lg font-bold text-slate-100 mb-2">Analysis Failed</h2>
    <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">{message}</p>
    <button onClick={onRetry} className="btn-primary">
      <Sparkles size={15} />
      Try Again
    </button>
    <p className="text-xs text-slate-600 mt-4">
      No API key? The app runs in demo mode automatically.
    </p>
  </div>
);
