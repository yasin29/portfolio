import { profile, highlights } from '@/lib/profile';

export default function Hero() {
  return (
    <section className="container-page pt-20 pb-12 md:pt-28">
      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
        </span>
        {profile.availability}
      </div>

      <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
        {profile.tagline}
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        {profile.intro}{' '}
        Currently at{' '}
        <a
          href={profile.currentlyAt.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--accent)] underline underline-offset-2"
        >
          {profile.currentlyAt.company}
        </a>
        , {profile.currentlyAt.note}.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/#work" className="btn btn-primary">
          View work
        </a>
        <a href={profile.resume} className="btn btn-ghost">
          Download resume (PDF)
        </a>
        <a href={`mailto:${profile.email}`} className="btn btn-ghost">
          Get in touch
        </a>
      </div>

      {/* metric strip */}
      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--border)] pt-10 sm:grid-cols-3 lg:grid-cols-6">
        {highlights.map((h) => (
          <div key={h.label}>
            <dt className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              {h.value}
            </dt>
            <dd className="mt-1 text-xs leading-snug text-[var(--muted)]">{h.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
