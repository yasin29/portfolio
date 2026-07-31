'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/lib/profile';

type Phase = 'idle' | 'loading' | 'out';

/**
 * First-entry intro overlay.
 *
 * Visibility is decided before paint by the inline script in the root layout,
 * which sets `data-intro="show"` when the `intro-seen-at` stamp is missing or
 * older than 30 minutes. CSS keys off that attribute, so:
 *   - a first visit, or a return after a break, shows the intro
 *   - reloads, in-site navigation, and new tabs during the visit do not
 *   - with JS off the attribute is never set, so the site is never gated
 *
 * On enter: a short YB loader, then the overlay fades out over the page.
 */
export default function Intro() {
  const [phase, setPhase] = useState<Phase>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function enter() {
    if (phase !== 'idle') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hold = reduce ? 300 : 1100;
    const fade = reduce ? 150 : 700;

    setPhase('loading');
    timers.current.push(window.setTimeout(() => setPhase('out'), hold));
    timers.current.push(
      window.setTimeout(() => {
        try {
          localStorage.setItem('intro-seen-at', String(Date.now()));
        } catch {
          /* storage blocked — the intro simply shows again next load */
        }
        document.documentElement.dataset.intro = 'done';
      }, hold + fade)
    );
  }

  return (
    <div
      className={`intro${phase === 'loading' ? ' is-loading' : ''}${phase === 'out' ? ' is-out' : ''}`}
      role="dialog"
      aria-label="Welcome"
      aria-modal="true"
    >
      <div className="intro-stage">
        <p className="intro-eyebrow">
          <span className="intro-rule" aria-hidden="true" />
          {profile.role}
        </p>

        <p className="intro-name">
          <span className="intro-first">Yasin</span>
          <span className="intro-last">Billah</span>
        </p>

        <p className="intro-keywords">Delivery · Product · Quality · AI-Native</p>

        <button type="button" onClick={enter} className="intro-btn" autoFocus>
          <span className="intro-btn-fill" aria-hidden="true" />
          <span className="intro-btn-label">
            Let&apos;s get introduced
            <span className="intro-btn-icon" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M3.5 8.5L8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </button>
      </div>

      {/* loader shown between the splash and the site */}
      <div className="intro-loader" aria-hidden={phase !== 'loading'}>
        <span className="yb-loader">
          <svg viewBox="0 0 72 72" className="yb-ring" aria-hidden="true">
            <circle cx="36" cy="36" r="32" className="yb-ring-track" />
            <circle cx="36" cy="36" r="32" className="yb-ring-arc" />
          </svg>
          <span className="yb-mark">YB</span>
        </span>
        <p className="intro-loading-text">Loading portfolio</p>
      </div>

      <p className="intro-footer">
        {profile.role} · AI-Native Delivery · {profile.location} · {profile.timezone}
      </p>
    </div>
  );
}
