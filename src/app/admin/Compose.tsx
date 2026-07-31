'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_CHAT_API ?? '';

/**
 * Drafts a full case study from the project's own fields plus free-form notes.
 * The draft is always shown for review before it can be written to disk — an
 * AI-written case study going live unread is exactly the failure to avoid.
 */
export default function Compose({
  project,
  token,
}: {
  project: Record<string, unknown>;
  token: string;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function call(save: boolean) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch(`${API}/api/admin/compose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ project, notes, save, markdown: draft }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error ?? 'Compose failed');
      setDraft(d.markdown);
      if (d.saved) setMsg(`Written to ${d.file}. Rebuild to publish it.`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Compose failed');
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="adm-ai-open" onClick={() => setOpen(true)}>
        ✦ Write the case study with AI
      </button>
    );
  }

  return (
    <div className="adm-ai">
      <div className="adm-group-head">
        <span className="adm-label">
          AI case study
          <em>Uses the fields above. Add anything they do not capture.</em>
        </span>
        <button type="button" className="adm-mini" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>

      <label className="adm-field">
        <span className="adm-label">
          Your notes
          <em>Context, decisions, numbers — treated as authoritative</em>
        </span>
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What was hard about this one? What did you decide, and what did you turn down?"
        />
      </label>

      <div className="adm-ai-actions">
        <button type="button" className="btn-pill btn-pill-outline btn-sm" onClick={() => call(false)} disabled={busy}>
          {busy ? 'Writing…' : draft ? 'Rewrite draft' : 'Generate draft'}
        </button>
        {draft && (
          <button type="button" className="btn-pill btn-pill-solid btn-sm" onClick={() => call(true)} disabled={busy}>
            Save as case study
          </button>
        )}
      </div>

      {err && <p className="adm-err">{err}</p>}
      {msg && <p className="adm-ok">{msg}</p>}

      {draft && (
        <label className="adm-field">
          <span className="adm-label">
            Draft
            <em>Read it before saving. Edit freely — what is here is what gets written.</em>
          </span>
          <textarea className="adm-json" rows={20} value={draft} onChange={(e) => setDraft(e.target.value)} />
        </label>
      )}
    </div>
  );
}
