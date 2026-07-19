// ─────────────────────────────────────────────
//  Top header bar
// ─────────────────────────────────────────────
import React from 'react';
import { Zap, Menu, Bell, Sparkles } from 'lucide-react';
import type { AppView } from '../types';


interface HeaderProps {
  activeView: AppView;
  onMenuToggle: () => void;
}

const viewTitles: Record<AppView, { title: string; subtitle: string }> = {
  dashboard: { title: 'AI Productivity Dashboard', subtitle: 'Transform messy notes into structured actions' },
  assistant: { title: 'AI Assistant',              subtitle: 'Ask follow-up questions about your meeting' },
  history:   { title: 'Analysis History',          subtitle: 'Review past meeting analyses' },
};

export const Header: React.FC<HeaderProps> = ({ activeView, onMenuToggle }) => {
  const { title, subtitle } = viewTitles[activeView];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3.5
                       bg-surface-card/80 border-b border-surface-border backdrop-blur-xl">
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          <button
            onClick={onMenuToggle}
            className="btn-ghost p-2 -ml-1"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="font-bold text-slate-100 text-base lg:text-lg leading-tight truncate">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* AI status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        bg-brand-600/10 border border-brand-600/20">
          <Sparkles size={12} className="text-brand-400" />
          <span className="text-xs font-semibold text-brand-400">Gemini 2.0</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
        </div>

        <button className="btn-ghost p-2 relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-600
                        flex items-center justify-center text-white text-xs font-bold
                        cursor-pointer hover:ring-2 hover:ring-brand-500/50 transition-all">
          FF
        </div>
      </div>
    </header>
  );
};
