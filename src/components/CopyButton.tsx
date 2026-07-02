'use client';

import { useRef, useState } from 'react';

/**
 * Small icon button that copies `text` to the clipboard and flashes a
 * checkmark as confirmation.
 */
export default function CopyButton({
  text,
  label,
  className = '',
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently no-op.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : `Copy ${label}`}
      title={copied ? 'Copied!' : `Copy ${label}`}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] ${className}`}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[var(--accent)]">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )}
    </button>
  );
}
