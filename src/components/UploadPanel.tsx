// ─────────────────────────────────────────────
//  AI Input Panel – paste notes or upload file
// ─────────────────────────────────────────────
import React, { useRef, useState, useCallback } from 'react';
import {
  Sparkles, FileText, Upload, X, Lightbulb, ChevronDown, ChevronUp
} from 'lucide-react';
import { Spinner } from './LoadingState';
import { SAMPLE_NOTES } from '../data/mockData';
import clsx from 'clsx';

interface UploadPanelProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const PLACEHOLDERS = [
  "Paste meeting notes, document content, or project briefs here…",
  "Try: 'Q3 planning sync — key decisions: pause feature X, launch Y by Friday…'",
  "Works with meeting transcripts, Slack threads, email chains, or any text…",
];

export const UploadPanel: React.FC<UploadPanelProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText]         = useState('');
  const [isDragging, setDrag]   = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/text|plain|markdown|md/i) && !file.name.match(/\.(txt|md|text)$/i)) {
      alert('Please upload a plain text (.txt) or Markdown (.md) file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setText(e.target?.result as string ?? '');
      setFileName(file.name);
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const loadSample = () => {
    setText(SAMPLE_NOTES);
    setFileName('sample-meeting-notes.txt');
  };

  const charCount   = text.length;
  const canAnalyze   = text.trim().length > 20 && !isLoading;

  return (
    <section className="glass-card p-5 animate-fade-in" aria-label="AI input panel">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600
                          flex items-center justify-center shadow-glow-sm flex-shrink-0">
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 leading-tight">AI Analysis Engine</h2>
            <p className="text-xs text-slate-500 mt-0.5">Paste notes · Drop a file · Load sample</p>
          </div>
        </div>

        <button
          onClick={() => setShowTips(v => !v)}
          className="btn-ghost text-xs gap-1 py-1.5 px-2.5"
          aria-expanded={showTips}
        >
          <Lightbulb size={13} />
          Tips
          {showTips ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Tips */}
      {showTips && (
        <div className="mb-4 p-3 rounded-xl bg-brand-600/5 border border-brand-600/15 animate-fade-in">
          <p className="text-xs font-semibold text-brand-400 mb-2">What works best:</p>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>✓ Meeting notes with attendees, decisions, and action items</li>
            <li>✓ Project briefs, status updates, or email threads</li>
            <li>✓ Sprint retrospectives or product requirement docs</li>
            <li>✓ Any structured or semi-structured professional text</li>
          </ul>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={clsx(
          'relative rounded-xl border-2 border-dashed transition-all duration-200 mb-3',
          isDragging
            ? 'border-brand-500 bg-brand-500/5 scale-[1.01]'
            : 'border-surface-border hover:border-brand-600/40'
        )}
      >
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={PLACEHOLDERS[0]}
          className="input-base border-0 rounded-xl min-h-[160px] bg-transparent"
          aria-label="Meeting notes input"
          disabled={isLoading}
        />

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 rounded-xl bg-brand-500/10 flex items-center justify-center
                          pointer-events-none animate-fade-in">
            <div className="flex flex-col items-center gap-2 text-brand-400">
              <Upload size={28} />
              <p className="text-sm font-semibold">Drop file to analyze</p>
            </div>
          </div>
        )}
      </div>

      {/* Char count + clear */}
      {text.length > 0 && !isLoading && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] text-slate-600">
            {charCount.toLocaleString()} characters
          </span>
          <button
            onClick={() => { setText(''); setFileName(null); }}
            className="text-[11px] text-slate-600 hover:text-red-400 transition-colors"
            aria-label="Clear input"
          >
            Clear
          </button>
        </div>
      )}
      {/* File badge */}
      {fileName && (
        <div className="flex items-center gap-2 mb-3 animate-bounce-in">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-hover
                          border border-surface-border text-xs text-slate-400">
            <FileText size={12} className="text-brand-400" />
            <span className="font-medium text-slate-300">{fileName}</span>
            <button
              onClick={() => { setFileName(null); setText(''); }}
              className="hover:text-red-400 transition-colors ml-1"
              aria-label="Remove file"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Analyze button */}
        <button
          onClick={() => onAnalyze(text)}
          disabled={!canAnalyze}
          className="btn-primary flex-1 justify-center"
          aria-label="Analyze with AI"
        >
          {isLoading ? (
            <>
              <Spinner size={16} />
              Analyzing with Gemini…
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analyze with AI
            </>
          )}
        </button>

        {/* Upload */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isLoading}
          className="btn-ghost border border-surface-border px-4 py-2.5"
          aria-label="Upload text file"
        >
          <Upload size={15} />
          Upload File
        </button>

        {/* Sample */}
        <button
          onClick={loadSample}
          disabled={isLoading}
          className="btn-ghost border border-surface-border px-4 py-2.5 text-brand-400
                     hover:text-brand-300 hover:border-brand-600/40"
          aria-label="Load sample meeting notes"
        >
          <FileText size={15} />
          Sample
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.text"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          aria-hidden="true"
        />
      </div>

      {/* Progress bar */}
      {isLoading && (
        <div className="mt-3 animate-fade-in">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow" />
              Processing with Gemini 2.0 Flash…
            </span>
            <span>Structuring output</span>
          </div>
          <div className="h-1 bg-surface-hover rounded-full overflow-hidden">
            <div className="h-full progress-shimmer rounded-full" />
          </div>
        </div>
      )}
    </section>
  );
};
