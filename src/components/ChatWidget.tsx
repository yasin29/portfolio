'use client';

import { useEffect, useRef, useState } from 'react';
import CoverLetter from './CoverLetter';

type Attachment = { kind: 'resume'; title: string; subtitle: string; url: string };
type Msg = { role: 'user' | 'model'; text: string; attachment?: Attachment };

const SUGGESTIONS = [
  'What has Yasin actually shipped?',
  'How big were the teams he managed?',
  'What does "AI-native delivery" mean?',
  'Write a cover letter for Yasin',
];

/** Asking for a cover letter opens the form rather than answering in prose. */
const LETTER_INTENT = /(cover|covering)\s+letter|write.*letter.*(role|job|position)/i;

/** Set to the deployed API origin, e.g. https://<project>.vercel.app */
const API = process.env.NEXT_PUBLIC_CHAT_API ?? '';

/** Preview + download for a file the assistant hands over. */
function FileCard({ file }: { file: Attachment }) {
  const [preview, setPreview] = useState(false);
  return (
    <div className="chat-file">
      <div className="chat-file-head">
        <span className="chat-file-icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="chat-file-meta">
          <strong>{file.title}</strong>
          <em>{file.subtitle}</em>
        </span>
      </div>
      <div className="chat-file-actions">
        <button type="button" onClick={() => setPreview((v) => !v)}>
          {preview ? 'Hide preview' : 'Preview'}
        </button>
        <a href={file.url} download target="_blank" rel="noreferrer">
          Download
        </a>
      </div>
      {preview && (
        <object data={file.url} type="application/pdf" className="chat-file-preview">
          <p>
            Your browser cannot preview PDFs.{' '}
            <a href={file.url} target="_blank" rel="noreferrer">
              Open it instead
            </a>
            .
          </p>
        </object>
      )}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [letterMode, setLetterMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    inputRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // keep the newest message in view
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;

    setError(null);
    setInput('');

    // A cover letter needs inputs a chat turn cannot supply, so this switches
    // to a small form instead of guessing the company and role.
    if (LETTER_INTENT.test(q)) {
      setMsgs((m) => [...m, { role: 'user', text: q }]);
      setLetterMode(true);
      return;
    }

    const history = msgs.slice(-8);
    setMsgs((m) => [...m, { role: 'user', text: q }]);
    setBusy(true);

    if (!API) {
      setBusy(false);
      setError('The assistant is not connected yet.');
      return;
    }

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setMsgs((m) => [...m, { role: 'model', text: data.answer, attachment: data.attachment }]);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'Could not reach the assistant. Email yasinbillah46@gmail.com instead.'
      );
    } finally {
      setBusy(false);
    }
  }

  // Without a configured API the assistant cannot answer, and a button that
  // does nothing is worse than no button. The deployed build has no API URL
  // until the service is live, so it simply does not render.
  if (!API) return null;

  return (
    <>
      <button
        type="button"
        className={`chat-fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Ask about Yasin'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="17" height="17" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 11.5a8.4 8.4 0 01-9 8.4 9.5 9.5 0 01-2.8-.4L4 21l1.4-4a8.2 8.2 0 01-1.4-4.6 8.4 8.4 0 018.5-8.4 8.4 8.4 0 018.5 8.4z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <section className={`chat-panel${open ? ' is-open' : ''}`} aria-hidden={!open} aria-label="Ask about Yasin">
        <header className="chat-head">
          <div>
            <p className="chat-title">Ask about Yasin</p>
            <p className="chat-sub">Answers come from Yasin&apos;s case studies and CV</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="chat-close" aria-label="Close">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="chat-body" ref={bodyRef}>
          {msgs.length === 0 && (
            <div className="chat-intro">
              <p>
                Ask about Yasin&apos;s work — projects, process, team sizes, stack, or how to reach
                him. Questions outside his portfolio are not answered. If something is not in his
                case studies, the assistant says so rather than guessing.
              </p>
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((m, i) => (
            <div key={i} className="chat-turn">
              <div className={`chat-msg is-${m.role}`}>{m.text}</div>
              {m.attachment && <FileCard file={m.attachment} />}
            </div>
          ))}

          {busy && (
            <div className="chat-msg is-model chat-typing" aria-live="polite">
              <span />
              <span />
              <span />
            </div>
          )}

          {letterMode && <CoverLetter onClose={() => setLetterMode(false)} />}

          {error && <p className="chat-error">{error}</p>}
        </div>

        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Yasin…"
            maxLength={500}
            aria-label="Your question"
            disabled={busy}
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </section>
    </>
  );
}
