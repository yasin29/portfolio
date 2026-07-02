import { experience, type Experience } from '@/lib/profile';

function JobCard({ job }: { job: Experience }) {
  return (
    <div className="journey-card">
      <h3 className="font-semibold leading-snug">
        {job.url ? (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[var(--accent)] hover:underline"
          >
            {job.company}
          </a>
        ) : (
          job.company
        )}
      </h3>
      <p className="mt-0.5 text-sm text-[var(--accent)]">{job.role}</p>
      <p className="mt-1 text-xs text-[var(--muted-2)]">{job.context}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{job.blurb}</p>
      {job.portfolio && (
        <div className="mt-3 space-y-1.5 border-t border-[var(--border)] pt-3">
          {job.portfolio.map((p) => (
            <p key={p.label} className="text-xs leading-relaxed">
              <span className="font-semibold text-[var(--foreground)]">{p.label}: </span>
              <span className="text-[var(--muted-2)]">{p.items}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Pratik-style horizontal career timeline. Desktop: one shared rail, cards
 * alternating above/below it (even indexes above, odd below), with the period
 * label on the opposite side of the rail. Mobile: vertical stack.
 */
export default function Journey() {
  return (
    <>
      {/* desktop: alternating rail */}
      <div className="hidden md:block">
        {/* above the rail */}
        <div className="grid grid-cols-4 items-end gap-x-5">
          {experience.map((job, i) => (
            <div key={job.company} className="flex flex-col justify-end">
              {i % 2 === 0 ? (
                <JobCard job={job} />
              ) : (
                <p className="journey-period pb-2 text-center">{job.period}</p>
              )}
            </div>
          ))}
        </div>

        {/* rail with dots */}
        <div className="journey-rail-full">
          {experience.map((job, i) => (
            <span
              key={job.company}
              className="journey-dot"
              style={{ left: `${(i + 0.5) * 25}%` }}
            />
          ))}
        </div>

        {/* below the rail */}
        <div className="grid grid-cols-4 items-start gap-x-5">
          {experience.map((job, i) => (
            <div key={job.company}>
              {i % 2 === 1 ? (
                <JobCard job={job} />
              ) : (
                <p className="journey-period pt-2 text-center">{job.period}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* mobile: vertical stack */}
      <div className="space-y-5 md:hidden">
        {experience.map((job) => (
          <div key={job.company}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              {job.period}
            </p>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </>
  );
}
