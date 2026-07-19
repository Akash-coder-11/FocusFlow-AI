// ─────────────────────────────────────────────
//  Sidebar navigation
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

const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string; disabled?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard',    icon: <LayoutDashboard size={18} /> },
  { id: 'assistant', label: 'AI Assistant', icon: <MessageSquare   size={18} />, badge: 'Live' },
  { id: 'history',   label: 'History',      icon: <History         size={18} />, badge: 'Soon', disabled: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, hasResults }) => {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-h-screen bg-surface-card border-r border-surface-border"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600
                        flex items-center justify-center shadow-glow-sm flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-100 leading-none tracking-tight">FocusFlow</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-semibold tracking-widest uppercase">AI Productivity</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Primary navigation">
        <p className="section-label px-3 mb-3">Menu</p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onViewChange(item.id)}
            disabled={item.disabled}
            title={item.disabled ? 'Coming in the next release' : undefined}
            className={clsx(
              'nav-item w-full',
              activeView === item.id && 'active',
              item.disabled && 'opacity-40 cursor-not-allowed'
            )}
            aria-current={activeView === item.id ? 'page' : undefined}
            aria-disabled={item.disabled}
          >
            <span className={clsx(
              'transition-colors',
              activeView === item.id ? 'text-brand-400' : 'text-slate-500'
            )}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className={clsx(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                item.badge === 'Live'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-slate-500/10 text-slate-600'
              )}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        {/* Session status */}
        {hasResults && (
          <div className="pt-4 border-t border-surface-border mt-4">
            <p className="section-label px-3 mb-3">Session</p>
            <div className="px-3 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                <span className="text-xs font-semibold text-emerald-400">Analysis ready</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-4">Dashboard updated with AI results</p>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-surface-border space-y-2">
        {/* AI engine pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600/5 border border-brand-600/10">
          <Cpu size={14} className="text-brand-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-brand-400">Gemini 2.0 Flash</p>
            <p className="text-[10px] text-slate-600 truncate">AI engine · structured JSON</p>
          </div>
        </div>

        {/* GitHub link */}
        <a
          href="https://github.com/yourusername/focusflow-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full text-xs justify-start gap-2 text-slate-500 hover:text-slate-300"
          aria-label="View source code on GitHub (opens in new tab)"
        >
          <ExternalLink size={13} />
          <span>View on GitHub</span>
        </a>
      </div>
    </aside>
  );
};
