// ─────────────────────────────────────────────
//  Insights + Productivity Overview Card
// ─────────────────────────────────────────────
import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, BarChart3, Users, CheckSquare } from 'lucide-react';
import type { AIAnalysisResult } from '../types';
import clsx from 'clsx';

interface InsightsPanelProps {
  result: AIAnalysisResult;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ result }) => {
  const critical = result.action_items.filter(i => i.priority === 'critical').length;
  const high      = result.action_items.filter(i => i.priority === 'high').length;
  const total     = result.action_items.length;
  const owners    = [...new Set(result.action_items.map(i => i.owner))].length;

  const stats = [
    { label: 'Total Tasks',       value: total,                        icon: <CheckSquare size={14} />, cls: 'text-brand-400'   },
    { label: 'Critical / High',   value: `${critical} / ${high}`,     icon: <AlertTriangle size={14} />, cls: 'text-red-400'   },
    { label: 'Team Members',      value: owners,                       icon: <Users size={14} />,        cls: 'text-emerald-400' },
    { label: 'Efficiency Score',  value: `${result.meeting_efficiency_score}%`, icon: <BarChart3 size={14} />, cls: 'text-yellow-400' },
  ];

  return (
    <section className="glass-card p-5 animate-slide-up" aria-label="AI insights and productivity overview">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600
                        flex items-center justify-center flex-shrink-0">
          <Lightbulb size={17} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-100 leading-tight">AI Insights</h2>
          <p className="text-xs text-slate-500">Patterns and recommendations</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="p-3 rounded-xl bg-surface-hover/60 border border-surface-border">
            <div className={clsx('mb-1', s.cls)}>{s.icon}</div>
            <p className="text-lg font-bold text-slate-100 leading-none mb-0.5">{s.value}</p>
            <p className="text-[11px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Insights list */}
      <h3 className="section-label mb-3">Key Observations</h3>
      <ul className="space-y-2">
        {result.insights.map((insight, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-hover/60
                       border border-surface-border hover:border-brand-600/30 transition-all duration-200
                       animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <TrendingUp size={13} className="text-brand-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">{insight}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
