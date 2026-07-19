// ─────────────────────────────────────────────
//  Top header bar
// ─────────────────────────────────────────────
import React from 'react';
import { Zap, Menu, Sparkles } from 'lucide-react';
import type { AppView } from '../types';

interface HeaderProps {
  activeView: AppView;
  onMenuToggle: () => void;
}

const viewTitles: Record<AppView, { title: string; subtitle: string }> = {
  dashboard: {
    title:    'AI Productivity Dashboard',
    subtitle: 'Paste notes → get structured actions, tasks, email, and schedule',
  },
  assistant: {
    title:    'AI Assistant',
    subtitle: 'Ask follow-up questions about your meeting analysis',
  },
  history: {
    title:    'Analysis History',
    subtitle: 'Review and revisit past meeting analyses',
  },
};

export const Header: React.FC<HeaderProps> = ({ activeView, onMenuToggle }) => {
  const { title, subtitle } = viewTitles[activeView];

  return (
    <>
      {/* Skip to content – keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
                   focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white
                   focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3.5
                   bg-surface-card/85 border-b border-surface-border backdrop-blur-xl"
        role="banner"
      >
        {/* Left: mobile menu + page title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile: hamburger + mini logo */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            <button
              onClick={onMenuToggle}
              className="btn-ghost p-2 -ml-1"
              aria-label="Open navigation menu"
              aria-expanded={false}
            >
              <Menu size={20} />
            </button>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600
                            flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
          </div>

          {/* Page title */}
          <div className="min-w-0">
            <h1 className="font-bold text-slate-100 text-base lg:text-lg leading-tight truncate">
              {title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: status + avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Gemini status pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-brand-600/10 border border-brand-600/20"
            title="AI engine active"
          >
            <Sparkles size={12} className="text-brand-400" />
            <span className="text-xs font-semibold text-brand-400">Gemini 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          </div>

          {/* User avatar (decorative) */}
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-600
                       flex items-center justify-center text-white text-[11px] font-bold
                       select-none"
            aria-hidden="true"
          >
            FF
          </div>
        </div>
      </header>
    </>
  );
};
