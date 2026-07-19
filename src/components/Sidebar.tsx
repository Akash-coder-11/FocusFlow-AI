// ─────────────────────────────────────────────
//  Sidebar navigation component
// ─────────────────────────────────────────────
import React from 'react';
import { Zap, LayoutDashboard, MessageSquare, History, Cpu, ExternalLink } from 'lucide-react';
import type { AppView } from '../types';
import clsx from 'clsx';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (v: AppView) => void;
  hasResults: boolean;
}

const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={18} /> },
  { id: 'assistant', label: 'AI Assistant', icon: <MessageSquare size={18} />, badge: 'Live' },
  { id: 'history',   label: 'History',    icon: <History size={18} />, badge: 'Soon' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, hasResults }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-surface-card border-r border-surface-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow-sm flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-100 leading-none">FocusFlow</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-wide">AI PRODUCTIVITY</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="section-label px-3 mb-3">Navigation</p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            disabled={item.badge === 'Soon'}
            className={clsx('nav-item w-full', activeView === item.id && 'active')}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            <span className={clsx(activeView === item.id ? 'text-brand-400' : 'text-slate-500')}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className={clsx(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                item.badge === 'Live' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-500'
              )}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        {hasResults && (
          <div className="pt-4 border-t border-surface-border mt-4">
            <p className="section-label px-3 mb-3">Session</p>
            <div className="px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                <span className="text-xs font-semibold text-emerald-400">Analysis Complete</span>
              </div>
              <p className="text-[11px] text-slate-500">Dashboard updated with AI results</p>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-surface-border space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600/5 border border-brand-600/10">
          <Cpu size={14} className="text-brand-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-brand-400">Gemini 2.0 Flash</p>
            <p className="text-[10px] text-slate-600 truncate">AI Engine Active</p>
          </div>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full text-xs justify-between"
        >
          <span>View on GitHub</span>
          <ExternalLink size={12} className="text-slate-600" />
        </a>
      </div>
    </aside>
  );
};
