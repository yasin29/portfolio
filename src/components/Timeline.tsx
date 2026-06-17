import type { Experience } from '@/lib/profile';

export default function Timeline({ items }: { items: Experience[] }) {
  return (
    <div className="timeline space-y-10">
      {items.map((job) => (
        <div key={job.company} className="relative">
          <span className="timeline-dot" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-lg font-semibold tracking-tight">{job.role}</h3>
            <span className="text-xs font-medium text-[var(--muted-2)]">{job.period}</span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-[var(--accent)]">{job.company}</p>
          <p className="text-xs text-[var(--muted-2)]">{job.context}</p>
          <ul className="mt-3 space-y-2">
            {job.bullets.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--muted)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--border-strong)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
