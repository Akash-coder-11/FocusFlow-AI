// ─────────────────────────────────────────────
//  Meeting Summary Panel
// ─────────────────────────────────────────────
import React from 'react';
import { FileText, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AIAnalysisResult } from '../types';
import clsx from 'clsx';

interface SummaryPanelProps {
  result: AIAnalysisResult;
}

const sentimentConfig = {
  positive: { label: 'Positive',  icon: <TrendingUp  size={14} />, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  neutral:  { label: 'Neutral',   icon: <Minus        size={14} />, cls: 'text-slate-400   bg-slate-500/10   border-slate-500/20'  },
  mixed:    { label: 'Mixed',     icon: <Minus        size={14} />, cls: 'text-yellow-400  bg-yellow-500/10  border-yellow-500/20' },
  negative: { label: 'Negative',  icon: <TrendingDown size={14} />, cls: 'text-red-400    bg-red-500/10    border-red-500/20'    },
};

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ result }) => {
  const sentiment = sentimentConfig[result.sentiment] ?? sentimentConfig.neutral;
  const score     = result.meeting_efficiency_score;
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <section className="glass-card p-5 animate-slide-up" aria-label="Meeting summary">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600
                          flex items-center justify-center flex-shrink-0">
            <FileText size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 leading-tight">Meeting Summary</h2>
            <p className="text-xs text-slate-500">AI-generated executive brief</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Sentiment badge */}
          <span className={clsx('badge border', sentiment.cls)}>
            {sentiment.icon}
            {sentiment.label}
          </span>
        </div>
      </div>

      {/* Efficiency score */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-surface-hover/60">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#2a2a3d" strokeWidth="3.5" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              className={`transition-all duration-1000`}
              stroke="url(#scoreGrad)" strokeWidth="3.5"
              strokeDasharray={`${(score / 100) * 87.96} 87.96`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx('text-sm font-bold', scoreColor)}>{score}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Meeting Efficiency Score</p>
          <p className={clsx('text-sm font-semibold', scoreColor)}>
            {score >= 80 ? 'Excellent — clear agenda and outcomes'
              : score >= 60 ? 'Good — most items were resolved'
              : 'Needs improvement — unclear ownership'}
          </p>
        </div>
      </div>

      {/* Summary text */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{result.summary}</p>

      {/* Key decisions */}
      {result.key_decisions?.length > 0 && (
        <div>
          <h3 className="section-label mb-2.5">Key Decisions</h3>
          <ul className="space-y-2">
            {result.key_decisions.map((dec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{dec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
