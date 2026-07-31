'use client';

import { useState } from 'react';
import Link from 'next/link';
import { experience, type Experience } from '@/lib/profile';

function ExternalArrow() {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="ml-1 shrink-0">
      <path d="M3.5 8.5L8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Card({ job }: { job: Experience }) {
  const [open, setOpen] = useState(false);
  const hasDetails = Boolean(job.stats?.length || job.projects?.length);

  return (
    <article className={`jr-card${job.current ? ' is-current' : ''}`}>
      <span className="jr-dot" aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="jr-period">[{job.period}]</p>
          <h3 className="jr-company">
            {job.url ? (
              <a href={job.url} target="_blank" rel="noreferrer">
                {job.company}
              </a>
            ) : (
              job.company
            )}
          </h3>
          <p className="jr-role">{job.role}</p>
        </div>
        <span className={`jr-badge${job.current ? ' is-current' : ''}`}>
          {job.current ? 'Current' : 'Complete'}
        </span>
      </div>

      {job.chips && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.chips.map((c) =>
            c.href ? (
              <Link key={c.label} href={c.href} className="jr-chip">
                {c.label}
                <ExternalArrow />
              </Link>
            ) : (
              <span key={c.label} className="jr-chip is-static">
                {c.label}
              </span>
            )
          )}
        </div>
      )}

      {open && hasDetails && (
        <div className="jr-details">
          {job.stats && (
            <div className="jr-stats">
              {job.stats.map((s) => (
                <div key={s.label} className="jr-stat">
                  <p className="jr-stat-value">{s.value}</p>
                  <p className="jr-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {job.projects?.map((p) => (
            <div key={p.name} className="jr-project">
              <p className="jr-project-head">
                <span className="jr-project-name">{p.name}</span>
                <span className="jr-project-sep"> · </span>
                <span className="jr-project-tagline">{p.tagline}</span>
              </p>
              <p className="jr-project-detail">{p.detail}</p>
            </div>
          ))}
        </div>
      )}

      {hasDetails && (
        <button type="button" onClick={() => setOpen((v) => !v)} className="jr-toggle" aria-expanded={open}>
          {open ? 'Collapse details' : 'Expand details'}
          <svg
            width="10"
            height="7"
            viewBox="0 0 10 7"
            fill="none"
            aria-hidden="true"
            className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
          >
            <path d="M1 1.5L5 5.5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </article>
  );
}

/** Vertical career rail. Work history only — education lives in Credentials. */
export default function JourneyRail() {
  return (
    <div className="jr-rail">
      {experience.map((job) => (
        <Card key={job.company} job={job} />
      ))}
    </div>
  );
}
