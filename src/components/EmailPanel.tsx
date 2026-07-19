// ─────────────────────────────────────────────
//  Email Panel – generated follow-up email
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { Mail, Copy, Check, Edit3, Send } from 'lucide-react';
import type { AIAnalysisResult } from '../types';

interface EmailPanelProps {
  email: AIAnalysisResult['follow_up_email'];
}

export const EmailPanel: React.FC<EmailPanelProps> = ({ email }) => {
  const [copied, setCopied]   = useState(false);
  const [editing, setEditing] = useState(false);
  const [body, setBody]       = useState(email.body);

  const copyAll = () => {
    const full = `To: ${email.to}\nSubject: ${email.subject}\n\n${body}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Simple markdown-ish renderer for the email body preview
  const renderBody = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-slate-200 mt-3 mb-1">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('→')) {
        return <p key={i} className="text-slate-300 pl-3 border-l-2 border-brand-600/40 my-0.5 text-sm">{line}</p>;
      }
      if (line.startsWith('•')) {
        return <p key={i} className="text-slate-300 pl-3 my-0.5 text-sm">{line}</p>;
      }
      if (line === '') return <br key={i} />;
      return <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <section className="glass-card p-5 animate-slide-up" aria-label="Generated follow-up email">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600
                          flex items-center justify-center flex-shrink-0">
            <Mail size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 leading-tight">Follow-Up Email</h2>
            <p className="text-xs text-slate-500">AI-generated, ready to send</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(v => !v)}
            className="btn-ghost text-xs py-1.5 px-2.5"
            aria-label={editing ? 'View preview' : 'Edit email'}
          >
            <Edit3 size={13} />
            {editing ? 'Preview' : 'Edit'}
          </button>
          <button
            onClick={copyAll}
            className="btn-ghost text-xs py-1.5 px-2.5"
            aria-label="Copy email to clipboard"
          >
            {copied
              ? <><Check size={13} className="text-emerald-400" /> Copied!</>
              : <><Copy size={13} /> Copy</>
            }
          </button>
        </div>
      </div>

      {/* Email metadata */}
      <div className="space-y-2 mb-4 p-3 rounded-xl bg-surface-hover/60 border border-surface-border">
        <div className="flex gap-2 items-start">
          <span className="text-[11px] font-semibold text-slate-500 w-12 flex-shrink-0 pt-0.5">TO</span>
          <span className="text-xs text-slate-300 flex-1">{email.to}</span>
        </div>
        <div className="h-px bg-surface-border" />
        <div className="flex gap-2 items-center">
          <span className="text-[11px] font-semibold text-slate-500 w-12 flex-shrink-0">SUBJ</span>
          <span className="text-xs text-slate-200 font-medium flex-1">{email.subject}</span>
        </div>
      </div>

      {/* Email body */}
      <div className="relative">
        {editing ? (
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="input-base min-h-[220px] font-mono text-xs"
            aria-label="Edit email body"
          />
        ) : (
          <div className="bg-surface-hover/40 rounded-xl border border-surface-border p-4
                          max-h-[260px] overflow-y-auto no-scrollbar">
            {renderBody(body)}
          </div>
        )}
      </div>

      {/* Send button */}
      <button
        className="btn-primary w-full justify-center mt-4"
        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(body)}`)}
        aria-label="Open email in mail client"
      >
        <Send size={15} />
        Open in Mail Client
      </button>
    </section>
  );
};
