// ─────────────────────────────────────────────
//  Tasks Panel – extracted action items
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { CheckSquare, User, Calendar, CheckCircle2 } from 'lucide-react';
import type { ActionItem } from '../types';
import clsx from 'clsx';

interface TasksPanelProps {
  items: ActionItem[];
}

type FilterKey = 'all' | 'critical' | 'high' | 'medium' | 'low';

const priorityConfig: Record<string, { label: string; badgeCls: string; dotCls: string }> = {
  critical: { label: 'Critical', badgeCls: 'badge-critical', dotCls: 'bg-red-400' },
  high:     { label: 'High',     badgeCls: 'badge-high',     dotCls: 'bg-orange-400' },
  medium:   { label: 'Medium',   badgeCls: 'badge-medium',   dotCls: 'bg-yellow-400' },
  low:      { label: 'Low',      badgeCls: 'badge-low',      dotCls: 'bg-emerald-400' },
};

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'high',     label: 'High' },
  { key: 'medium',   label: 'Medium' },
  { key: 'low',      label: 'Low' },
];

export const TasksPanel: React.FC<TasksPanelProps> = ({ items }) => {
  const [filter, setFilter]         = useState<FilterKey>('all');
  const [checked, setChecked]       = useState<Set<string>>(new Set());

  const filtered = filter === 'all' ? items : items.filter(i => i.priority === filter);

  const toggle = (id: string) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const counts = {
    critical: items.filter(i => i.priority === 'critical').length,
    high:     items.filter(i => i.priority === 'high').length,
    total:    items.length,
    done:     checked.size,
  };

  return (
    <section className="glass-card p-5 animate-slide-up" aria-label="Extracted tasks">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
                          flex items-center justify-center flex-shrink-0">
            <CheckSquare size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 leading-tight">Action Items</h2>
            <p className="text-xs text-slate-500">
              {counts.done}/{counts.total} completed ·
              <span className="text-red-400 ml-1">{counts.critical} critical</span>
            </p>
          </div>
        </div>

        {/* Progress pill */}
        {counts.total > 0 && (
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-slate-500 mb-1">
              {Math.round((counts.done / counts.total) * 100)}% done
            </div>
            <div className="w-20 h-1.5 bg-surface-hover rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${(counts.done / counts.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {filterOptions.map(f => {
          const count = f.key === 'all' ? items.length : items.filter(i => i.priority === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-label={`Filter by ${f.label} priority (${count} items)`}
              aria-pressed={filter === f.key}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200',
                filter === f.key
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'bg-surface-hover text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
              )}
            >
              {f.label}
              <span className={clsx('ml-1.5', filter === f.key ? 'opacity-80' : 'opacity-40')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <ul className="space-y-2 max-h-[340px] overflow-y-auto no-scrollbar" role="list">
        {filtered.map(item => {
          const p    = priorityConfig[item.priority] ?? priorityConfig.medium;
          const done = checked.has(item.id);

          return (
            <li
              key={item.id}
              className={clsx(
                'flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer group',
                done
                  ? 'bg-surface-hover/30 border-surface-border/50 opacity-60'
                  : 'bg-surface-hover/60 border-surface-border hover:border-brand-600/30'
              )}
              onClick={() => toggle(item.id)}
              role="listitem"
              aria-label={`${item.task} – ${item.priority} priority`}
            >
              {/* Checkbox */}
              <div className={clsx(
                'w-4 h-4 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                done
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-600 group-hover:border-brand-500'
              )}>
                {done && <CheckCircle2 size={10} className="text-white" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm font-medium leading-snug',
                  done ? 'line-through text-slate-500' : 'text-slate-200'
                )}>
                  {item.task}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <User size={10} /> {item.owner}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar size={10} /> {item.deadline}
                  </span>
                </div>
              </div>

              {/* Priority badge */}
              <span className={clsx('badge flex-shrink-0', p.badgeCls)}>
                <span className={clsx('w-1.5 h-1.5 rounded-full', p.dotCls)} />
                {p.label}
              </span>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">No {filter === 'all' ? '' : filter + ' '}tasks found.</p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-xs text-brand-400 hover:text-brand-300 mt-2 underline underline-offset-2"
            >
              Show all tasks
            </button>
          )}
        </div>
      )}
    </section>
  );
};
