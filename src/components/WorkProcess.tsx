'use client';

import { useState } from 'react';
import { pmProcess } from '@/lib/profile';

/**
 * The four stages of how Yasin runs a project. Click a stage to read it —
 * stage 1 is open on load so the panel is never empty, and the buttons are a
 * real tablist so arrow keys and screen readers work.
 */
export default function WorkProcess() {
  const [active, setActive] = useState(0);
  const stage = pmProcess[active];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next =
      e.key === 'ArrowRight'
        ? (active + 1) % pmProcess.length
        : (active - 1 + pmProcess.length) % pmProcess.length;
    setActive(next);
    document.getElementById(`stage-${next}`)?.focus();
  }

  return (
    <div className="process-card">
      <p className="process-label">How I run projects</p>
      <p className="process-hint">·· Select any stage ··</p>

      <div className="process-steps" role="tablist" aria-label="Project delivery stages" onKeyDown={onKeyDown}>
        {pmProcess.map((s, i) => (
          <div key={s.title} className="process-step-wrap">
            <button
              id={`stage-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="stage-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`process-step${i === active ? ' is-active' : ''}`}
            >
              <span className={`process-num tone-${i + 1}`}>{i + 1}</span>
              <span className="process-step-title">{s.title}</span>
              <span className="process-step-caption">{s.caption}</span>
            </button>
            {i < pmProcess.length - 1 && (
              <span className="process-arrow" aria-hidden="true">
                <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
                  <path d="M0 5h23M19 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>

      <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-${active}`} className="process-panel">
        <h3>{stage.title}</h3>
        <p>{stage.body}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {stage.methods.map((m) => (
            <span key={m} className="chip">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
