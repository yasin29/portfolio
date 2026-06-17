import Image from 'next/image';
import { profile, highlights, basePath } from '@/lib/profile';

export default function Hero() {
  const tel = `tel:${profile.phone.replace(/\s+/g, '')}`;

  return (
    <section className="container-page pt-14 pb-12 md:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-14">
        {/* intro text */}
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            {profile.availability}
          </div>

          <h1 className="mt-5 text-5xl font-bold tracking-tight md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-[var(--accent)] md:text-xl">
            {profile.role}
          </p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            {profile.tagline}{' '}
            <span className="text-[var(--foreground)]">4 years of experience</span>{' '}
            across Japan, Korea, US, and EU clients — currently at{' '}
            <a
              href={profile.currentlyAt.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--accent)] underline underline-offset-2"
            >
              {profile.currentlyAt.company}
            </a>
            .
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-primary">
              View work
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Resume (PDF)
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost">
              Get in touch
            </a>
          </div>

          {/* contact details from CV */}
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
            <span>{profile.location}</span>
            <span aria-hidden className="text-[var(--border-strong)]">·</span>
            <a href={tel} className="hover:text-[var(--accent)]">
              {profile.phone}
            </a>
            <span aria-hidden className="text-[var(--border-strong)]">·</span>
            <a href={`mailto:${profile.email}`} className="hover:text-[var(--accent)]">
              {profile.email}
            </a>
            <span aria-hidden className="text-[var(--border-strong)]">·</span>
            <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
              GitHub
            </a>
            <span aria-hidden className="text-[var(--border-strong)]">·</span>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
              LinkedIn
            </a>
          </div>
        </div>

        {/* photo */}
        <div className="order-1 justify-self-center md:order-2 md:justify-self-end">
          <div className="relative h-60 w-60 overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm sm:h-72 sm:w-72 md:h-80 md:w-72">
            <Image
              src={`${basePath}/yasin-billah.png`}
              alt={`${profile.name} — ${profile.role}`}
              fill
              priority
              sizes="(max-width: 768px) 15rem, 18rem"
              className="object-cover object-top"
            />
          </div>
        </div>
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
