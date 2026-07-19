// ─────────────────────────────────────────────
//  Root Application – FocusFlow AI
// ─────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { Sidebar }        from './components/Sidebar';
import { Header }         from './components/Header';
import { UploadPanel }    from './components/UploadPanel';
import { SummaryPanel }   from './components/SummaryPanel';
import { TasksPanel }     from './components/TasksPanel';
import { EmailPanel }     from './components/EmailPanel';
import { SchedulePanel }  from './components/SchedulePanel';
import { InsightsPanel }  from './components/InsightsPanel';
import { AssistantPanel } from './components/AssistantPanel';
import { LoadingState }   from './components/LoadingState';
import { EmptyState, ErrorState } from './components/EmptyState';
import { analyzeNotes }   from './services/aiService';
import type { AIAnalysisResult, AppView, ProcessingState } from './types';

export default function App() {
  const [view,     setView]    = useState<AppView>('dashboard');
  const [result,   setResult]  = useState<AIAnalysisResult | null>(null);
  const [state,    setState]   = useState<ProcessingState>({ status: 'idle' });
  const [menuOpen, setMenu]    = useState(false);

  const handleAnalyze = useCallback(async (notes: string) => {
    setState({ status: 'loading' });
    try {
      const data = await analyzeNotes(notes);
      setResult(data);
      setState({ status: 'success' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setState({ status: 'error', error: msg });
    }
  }, []);

  const handleRetry = useCallback(() => {
    setState({ status: 'idle' });
    setResult(null);
  }, []);

  const handleViewChange = useCallback((v: AppView) => {
    setView(v);
    setMenu(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <Sidebar activeView={view} onViewChange={handleViewChange} hasResults={result !== null} />

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm"
          onClick={() => setMenu(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      {menuOpen && (
        <div className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-2xl animate-fade-in">
          <Sidebar activeView={view} onViewChange={handleViewChange} hasResults={result !== null} />
        </div>
      )}

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header activeView={view} onMenuToggle={() => setMenu(v => !v)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-8" id="main-content">

          {/* ── DASHBOARD ── */}
          {view === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-4 lg:space-y-5">
              <UploadPanel
                onAnalyze={handleAnalyze}
                isLoading={state.status === 'loading'}
              />

              {state.status === 'loading' && <LoadingState />}

              {state.status === 'error' && (
                <ErrorState
                  message={state.error ?? 'Analysis failed. Please try again.'}
                  onRetry={handleRetry}
                />
              )}

              {state.status === 'idle' && !result && <EmptyState />}

              {result && state.status === 'success' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                  {/* Row 1: Summary (wide) + Insights */}
                  <div className="lg:col-span-2">
                    <SummaryPanel result={result} />
                  </div>
                  <div className="lg:col-span-1 lg:row-span-1">
                    <InsightsPanel result={result} />
                  </div>

                  {/* Row 2: Tasks (wide) + Schedule */}
                  <div className="lg:col-span-2">
                    <TasksPanel items={result.action_items} />
                  </div>
                  <div className="lg:col-span-1">
                    <SchedulePanel schedule={result.suggested_schedule} />
                  </div>

                  {/* Row 3: Email (full width) */}
                  <div className="lg:col-span-2 xl:col-span-3">
                    <EmailPanel email={result.follow_up_email} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AI ASSISTANT ── */}
          {view === 'assistant' && (
            <div className="max-w-3xl mx-auto">
              <AssistantPanel context={result} />
            </div>
          )}

          {/* ── HISTORY (placeholder) ── */}
          {view === 'history' && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-700/50 border border-surface-border
                                flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl" role="img" aria-label="History">🗂️</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Analysis History</h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                  Your past analyses will be saved here automatically. Coming in the next release.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-surface-border flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] text-slate-600">
            FocusFlow AI © 2026 · Powered by Gemini 2.0 Flash
          </p>
          {!import.meta.env.VITE_GEMINI_API_KEY && (
            <p className="text-[11px] text-brand-600 font-medium">
              ⚡ Demo mode — works without API key
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
