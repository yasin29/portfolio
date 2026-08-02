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

function Card({
  job,
  open,
  onToggle,
}: {
  job: Experience;
  open: boolean;
  onToggle: () => void;
}) {
  const hasDetails = Boolean(job.stats?.length || job.projects?.length);
  const panelId = `jr-panel-${job.company.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

  // The header doubles as the toggle, so it needs the keyboard behaviour a
  // real button would have given us for free. It can't be a <button>: the
  // company name inside it is a link, and nesting those is invalid.
  const headProps = hasDetails
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-expanded': open,
        'aria-controls': panelId,
        onClick: onToggle,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        },
      }
    : {};

  return (
    <article className={`jr-card${job.current ? ' is-current' : ''}`}>
      <span className="jr-dot" aria-hidden="true" />

      <div className={`jr-head${hasDetails ? ' is-clickable' : ''}`} {...headProps}>
        <div className="min-w-0">
          <p className="jr-period">[{job.period}]</p>
          <h3 className="jr-company">
            {job.url ? (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
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
        <div className="jr-details" id={panelId}>
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
        <button
          type="button"
          onClick={onToggle}
          className="jr-toggle"
          aria-expanded={open}
          aria-controls={panelId}
        >
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

/**
 * Vertical career rail. Work history only — education lives in Credentials.
 *
 * One card open at a time: the expanded cards are long enough that two of
 * them push the rest of the timeline off-screen, and the point of the rail
 * is that you can still see where the roles sit relative to each other.
 */
export default function JourneyRail() {
  const [openCompany, setOpenCompany] = useState<string | null>(null);

  return (
    <div className="jr-rail">
      {experience.map((job) => (
        <Card
          key={job.company}
          job={job}
          open={openCompany === job.company}
          onToggle={() =>
            setOpenCompany((current) => (current === job.company ? null : job.company))
          }
        />
      ))}
    </div>
  );
}
