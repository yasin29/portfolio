'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_CHAT_API ?? '';

type Result = {
  letter: string;
  words: number;
  tailored: boolean;
  pdf: string | null;
  tailorError?: string | null;
  filename: string;
};

/**
 * Collects the few things a tailored letter actually needs, then renders the
 * result with a PDF preview and download.
 *
 * The PDF comes back base64 in the same response as the text, so there is no
 * second round trip; it is turned into an object URL here and revoked on
 * unmount so the blob is not leaked.
 */
export default function CoverLetter({ onClose }: { onClose: () => void }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!result?.pdf) return;
    const bytes = Uint8Array.from(atob(result.pdf), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [result]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return setErr('Company and role are both needed.');
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`${API}/api/chat/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, jobDescription }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error ?? 'Could not write the letter.');
      setResult(d);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Could not write the letter.');
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="cl-panel">
        <div className="cl-head">
          <span>
            Cover letter — {company}
            <em>
              {result.words} words
              {result.tailored
                ? ' · tailored to the role'
                : /429|quota|limit/i.test(result.tailorError ?? '')
                  ? ' · generic opening (AI limit hit — try again in a minute)'
                  : ' · generic opening'}
            </em>
          </span>
          <button type="button" className="adm-mini" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="cl-letter">{result.letter}</div>

        {!result.pdf && (
          <p className="adm-note">PDF export is not available on this host — copy the text above.</p>
        )}

        <div className="chat-file-actions" hidden={!result.pdf}>
          <button type="button" onClick={() => setPreview((v) => !v)} disabled={!pdfUrl}>
            {preview ? 'Hide preview' : 'Preview PDF'}
          </button>
          {pdfUrl && (
            <a href={pdfUrl} download={result.filename}>
              Download
            </a>
          )}
        </div>

        {preview && pdfUrl && (
          <object data={pdfUrl} type="application/pdf" className="chat-file-preview">
            <p>
              Your browser cannot preview PDFs.{' '}
              <a href={pdfUrl} download={result.filename}>
                Download it instead
              </a>
              .
            </p>
          </object>
        )}

        <button type="button" className="cl-again" onClick={() => { setResult(null); setPreview(false); }}>
          Write another
        </button>
      </div>
    );
  }

  return (
    <form className="cl-panel" onSubmit={submit}>
      <div className="cl-head">
        <span>
          Cover letter
          <em>Paste the job post and it will be tailored to it</em>
        </span>
        <button type="button" className="adm-mini" onClick={onClose}>
          Close
        </button>
      </div>

      <label className="cl-field">
        <span>Company</span>
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Gigalogy" required />
      </label>
      <label className="cl-field">
        <span>Role</span>
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Technical Project Manager" required />
      </label>
      <label className="cl-field">
        <span>Job post (optional)</span>
        <textarea
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the description — it decides which proof points get used."
        />
      </label>

      {err && <p className="chat-error">{err}</p>}

      <button type="submit" className="btn-pill btn-pill-solid btn-sm" disabled={busy}>
        {busy ? 'Writing…' : 'Write the letter'}
      </button>
    </form>
  );
}
