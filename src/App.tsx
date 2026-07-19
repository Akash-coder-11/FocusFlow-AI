// ─────────────────────────────────────────────
//  FocusFlow AI – Root Application
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
  const [view,   setView]   = useState<AppView>('dashboard');
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [state,  setState]  = useState<ProcessingState>({ status: 'idle' });
  const [menuOpen, setMenu] = useState(false);

  const handleAnalyze = useCallback(async (notes: string) => {
    setState({ status: 'loading' });
    try {
      const data = await analyzeNotes(notes);
      setResult(data);
      setState({ status: 'success' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred';
      setState({ status: 'error', error: msg });
    }
  }, []);

  const retry = () => {
    setState({ status: 'idle' });
    setResult(null);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar
        activeView={view}
        onViewChange={v => { setView(v); setMenu(false); }}
        hasResults={result !== null}
      />

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={() => setMenu(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      {menuOpen && (
        <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slide-up">
          <Sidebar
            activeView={view}
            onViewChange={v => { setView(v); setMenu(false); }}
            hasResults={result !== null}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeView={view} onMenuToggle={() => setMenu(v => !v)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* ── DASHBOARD VIEW ── */}
          {view === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-5">
              {/* Input panel always visible */}
              <UploadPanel
                onAnalyze={handleAnalyze}
                isLoading={state.status === 'loading'}
              />

              {/* States */}
              {state.status === 'loading' && <LoadingState />}

              {state.status === 'error' && (
                <ErrorState message={state.error ?? 'Analysis failed'} onRetry={retry} />
              )}

              {state.status === 'idle' && !result && <EmptyState />}

              {/* Results grid */}
              {result && state.status === 'success' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                  {/* Summary – spans 2 cols */}
                  <div className="lg:col-span-2">
                    <SummaryPanel result={result} />
                  </div>

                  {/* Insights */}
                  <div className="lg:col-span-1">
                    <InsightsPanel result={result} />
                  </div>

                  {/* Tasks – spans 2 cols on xl */}
                  <div className="lg:col-span-2 xl:col-span-2">
                    <TasksPanel items={result.action_items} />
                  </div>

                  {/* Schedule */}
                  <div className="xl:col-span-1">
                    <SchedulePanel schedule={result.suggested_schedule} />
                  </div>

                  {/* Email – full width */}
                  <div className="lg:col-span-2 xl:col-span-3">
                    <EmailPanel email={result.follow_up_email} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ASSISTANT VIEW ── */}
          {view === 'assistant' && (
            <div className="max-w-3xl mx-auto">
              <AssistantPanel context={result} />
            </div>
          )}

          {/* ── HISTORY VIEW (placeholder) ── */}
          {view === 'history' && (
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-10 text-center animate-fade-in">
                <p className="text-4xl mb-4">🗂️</p>
                <h2 className="text-xl font-bold text-slate-100 mb-2">History Coming Soon</h2>
                <p className="text-slate-400 text-sm">
                  Your past analyses will appear here. This feature is planned for the next release.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-surface-border flex items-center justify-between">
          <p className="text-[11px] text-slate-600">
            Built with Gemini 2.0 Flash · FocusFlow AI © 2026
          </p>
          <p className="text-[11px] text-slate-700">
            {!import.meta.env.VITE_GEMINI_API_KEY && '⚡ Demo mode – no API key required'}
          </p>
        </footer>
      </div>
    </div>
  );
}
