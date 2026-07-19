import React, { useState } from 'react';
import { Calendar, Clock, Coffee, Users, Eye, Zap, AlertCircle } from 'lucide-react';
import type { ScheduleSlot } from '../types';
import clsx from 'clsx';

interface SchedulePanelProps {
  schedule: ScheduleSlot[];
}

const typeConfig = {
  meeting: { icon: <Users  size={13} />, cls: 'bg-blue-500/15   text-blue-400   border-blue-500/20',   bar: 'bg-blue-500'   },
  focus:   { icon: <Zap    size={13} />, cls: 'bg-violet-500/15 text-violet-400 border-violet-500/20', bar: 'bg-violet-500' },
  review:  { icon: <Eye    size={13} />, cls: 'bg-brand-500/15  text-brand-400  border-brand-500/20',  bar: 'bg-brand-500'  },
  break:   { icon: <Coffee size={13} />, cls: 'bg-slate-500/15  text-slate-400  border-slate-500/20',  bar: 'bg-slate-500'  },
};

export const SchedulePanel: React.FC<SchedulePanelProps> = ({ schedule }) => {
  const [showStatus, setShowStatus] = useState<string | null>(null);

  const handleExport = () => {
    setShowStatus('Calendar integration is planned for the next release.');
    setTimeout(() => setShowStatus(null), 3000);
  };

  return (
    <section className="glass-card p-5 animate-slide-up" aria-label="Suggested schedule">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600
                        flex items-center justify-center flex-shrink-0">
          <Calendar size={17} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-100 leading-tight">Suggested Schedule</h2>
          <p className="text-xs text-slate-500">AI-optimized post-meeting plan</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.entries(typeConfig) as [string, typeof typeConfig.meeting][]).map(([key, cfg]) => (
          <span key={key} className={clsx('badge border', cfg.cls)}>
            {cfg.icon}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative pl-5">
        {/* Vertical line */}
        <div className="absolute left-[8px] top-0 bottom-0 w-px bg-surface-border" />

        <div className="space-y-3">
          {schedule.map((slot, i) => {
            const cfg = typeConfig[slot.type] ?? typeConfig.review;

            return (
              <div key={i} className="relative flex items-start gap-3 group">
                {/* Timeline dot */}
                <div className={clsx(
                  'absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-surface-card',
                  cfg.bar
                )} />

                {/* Card */}
                <div className={clsx(
                  'flex-1 p-3 rounded-xl border transition-all duration-200',
                  'bg-surface-hover/60 border-surface-border hover:border-brand-600/30',
                  'group-hover:bg-surface-hover'
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200 leading-snug flex-1">
                      {slot.title}
                    </p>
                    <span className={clsx('badge border flex-shrink-0', cfg.cls)}>
                      {cfg.icon}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock size={10} /> {slot.time}
                    </span>
                    <span className="text-[11px] text-slate-600">·</span>
                    <span className="text-[11px] text-slate-500">{slot.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add to calendar CTA */}
      <div className="mt-4">
        {showStatus ? (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-600/10 border border-brand-600/20 text-xs text-brand-400 animate-fade-in">
            <AlertCircle size={13} className="flex-shrink-0" />
            <span>{showStatus}</span>
          </div>
        ) : (
          <button
            className="btn-ghost w-full justify-center text-xs border border-surface-border"
            aria-label="Export schedule to calendar"
            onClick={handleExport}
          >
            <Calendar size={13} />
            Export to Calendar
          </button>
        )}
      </div>
    </section>
  );
};
