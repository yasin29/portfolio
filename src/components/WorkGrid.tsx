'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import {
  projects,
  previewUrl,
  CATEGORY_LABELS,
  type Project,
  type ProjectCategory,
  type DrawerSection,
} from '@/lib/projects';
import { basePath } from '@/lib/profile';

function Arrow({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3.5 8.5L8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- card ---------------- */

function Card({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const src = previewUrl(project);

  return (
    <button type="button" onClick={onOpen} className="wk-card" aria-label={`Open ${project.name}`}>
      <span className="wk-thumb">
        {src ? (
          <Image src={src} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        ) : (
          <span className="wk-thumb-fallback" aria-hidden="true">
            {project.name.charAt(0)}
          </span>
        )}
        <span className="wk-badges">
          {project.live && <span className="wk-badge is-live">Live</span>}
          {project.approach === 'AI-native' && <span className="wk-badge">AI-native</span>}
        </span>
      </span>

      <span className="wk-body">
        <span className="wk-domain">{project.domain}</span>
        <span className="wk-name">{project.solution}</span>
        <span className="wk-meta">
          {project.org} · {project.role}
        </span>
        <span className="wk-open">
          Quick look <Arrow />
        </span>
      </span>
    </button>
  );
}

/* ---------------- accordion ---------------- */

/**
 * Numbered, collapsible sections. Projects that have authored `sections` get
 * the full breakdown; the rest fall back to their contribution bullets so no
 * project shows an empty accordion. Section 1 is open on load.
 */
function Accordion({ project }: { project: Project }) {
  const sections: DrawerSection[] =
    project.sections ??
    project.contribution.map((body, i) => ({
      title: i === 0 ? 'What I did' : `Step ${i + 1}`,
      body,
    }));

  const [open, setOpen] = useState(0);

  return (
    <div className="wk-acc">
      {sections.map((s, i) => {
        const isOpen = i === open;
        return (
          <div key={`${s.title}-${i}`} className={`wk-acc-item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="wk-acc-head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="wk-acc-n">{i + 1}</span>
              <span className="wk-acc-title">{s.title}</span>
              <svg width="10" height="7" viewBox="0 0 10 7" fill="none" aria-hidden="true" className="wk-acc-caret">
                <path d="M1 1.5L5 5.5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isOpen && (
              <div className="wk-acc-body">
                <p>{s.body}</p>

                {s.quote && <blockquote className="wk-acc-quote">{s.quote}</blockquote>}

                {s.chips && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.chips.map((c) => (
                      <span key={c} className="chip chip-accent">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {s.image && (
                  <figure className="wk-acc-figure">
                    <div className="wk-acc-frame">
                      <Image
                        src={`${basePath}${s.image.src}`}
                        alt={s.image.alt}
                        fill
                        loading="lazy"
                        sizes="40rem"
                        className="object-contain"
                      />
                    </div>
                    {s.image.caption && <figcaption>{s.image.caption}</figcaption>}
                  </figure>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- drawer ---------------- */

function Drawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <div className={`wk-drawer-root${project ? ' is-open' : ''}`} aria-hidden={!project}>
      <div className="wk-scrim" onClick={onClose} />

      <aside
        className="wk-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={project ? `${project.name} summary` : undefined}
      >
        {project && (
          <>
            <header className="wk-drawer-head">
              <span className="wk-drawer-title">{project.name}</span>
              <button type="button" onClick={onClose} className="wk-close" aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="wk-drawer-body">
              <p className="wk-drawer-eyebrow">
                <span className="rule" aria-hidden="true" />
                {project.org} · {project.domain}
              </p>

              <h2 className="wk-drawer-h">{project.solution}</h2>
              <p className="wk-drawer-sub">
                {project.role} · {project.period}
                {project.team ? ` · ${project.team}` : ''}
              </p>

              <p className="wk-drawer-summary">{project.summary}</p>

              {project.stats && (
                <div className="wk-stats">
                  {project.stats.map((s) => (
                    <div key={s.label} className="wk-stat">
                      <p className="wk-stat-value">{s.value}</p>
                      <p className="wk-stat-label">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="wk-section-label">What I did</h3>
              <Accordion key={project.slug} project={project} />

              {project.stack && (
                <>
                  <h3 className="wk-section-label">Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {project.feedback && (
                <>
                  <p className="wk-preview-label">
                    <span className="rule" aria-hidden="true" />
                    Client feedback
                  </p>
                  <figure className="wk-quote">
                    <blockquote>{project.feedback.quote}</blockquote>
                    {project.feedback.attribution && (
                      <figcaption>{project.feedback.attribution}</figcaption>
                    )}
                  </figure>
                </>
              )}

              {project.livePreview && (
                <>
                  <p className="wk-preview-label">
                    <span className="rule" aria-hidden="true" />
                    {project.live ? 'Live product' : 'Product preview'}
                  </p>
                  <div className="wk-preview">
                    <Image
                      src={`${basePath}${project.livePreview.src}`}
                      alt={project.livePreview.alt}
                      fill
                      loading="lazy"
                      sizes="42rem"
                      className="object-contain"
                    />
                  </div>
                </>
              )}

              <div className="wk-drawer-actions">
                {project.caseStudy ? (
                  <Link
                    href={`/case-studies/${project.caseStudy}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-pill btn-pill-solid"
                  >
                    Read full case study
                    <Arrow size={13} />
                  </Link>
                ) : (
                  <span className="wk-soon">Full case study in progress</span>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noreferrer" className="btn-pill btn-pill-outline">
                    Visit live
                    <Arrow size={13} />
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ---------------- grid ---------------- */

/** How many cards the landing grid shows before "show all". */
const PAGE_SIZE = 6;

export default function WorkGrid() {
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const [open, setOpen] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  const visible = showAll ? shown : shown.slice(0, PAGE_SIZE);
  const hiddenCount = shown.length - visible.length;

  function pick(next: ProjectCategory | 'all') {
    setFilter(next);
    setShowAll(false); // a new filter starts collapsed again
  }

  // Hide a chip entirely rather than let it reveal an empty grid.
  const chips = CATEGORY_LABELS.filter(
    (c) => c.id === 'all' || projects.some((p) => p.category === c.id)
  );

  return (
    <>
      <div className="wk-filters" role="group" aria-label="Filter projects">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pick(c.id)}
            aria-pressed={filter === c.id}
            className={`wk-chip${filter === c.id ? ' is-on' : ''}`}
          >
            {c.label}
            <span className="wk-chip-n">
              {c.id === 'all' ? projects.length : projects.filter((p) => p.category === c.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="wk-grid">
        {visible.map((p) => (
          <Card key={p.slug} project={p} onOpen={() => setOpen(p)} />
        ))}
      </div>

      {shown.length > PAGE_SIZE && (
        <div className="wk-more">
          <button type="button" onClick={() => setShowAll((v) => !v)} className="btn-pill btn-pill-outline">
            {showAll ? 'Show fewer' : `Show all ${shown.length}`}
            <svg
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
              aria-hidden="true"
              className={showAll ? 'rotate-180 transition-transform' : 'transition-transform'}
            >
              <path d="M1 1.5L5 5.5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {!showAll && <span className="wk-more-note">{hiddenCount} more</span>}
        </div>
      )}

      {/* Portalled to <body>: the scroll-reveal wrapper sets will-change:
          transform, which creates a containing block and would otherwise pin
          this fixed overlay inside the section instead of the viewport. */}
      {mounted && createPortal(<Drawer project={open} onClose={() => setOpen(null)} />, document.body)}
    </>
  );
}
