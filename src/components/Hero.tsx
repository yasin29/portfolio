import { profile, highlights } from '@/lib/profile';
import CountUp from './CountUp';

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero-banner">
      <div className="container-page pt-16 pb-16 md:pt-24 md:pb-20">
        {/* availability */}
        <span className="hero-avail">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-on-dark)] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-on-dark)]" />
          </span>
          {profile.availability}
        </span>

        {/* eyebrow */}
        <p className="hero-eyebrow mt-6 flex-wrap">
          <span className="hero-tick" aria-hidden="true" />
          <strong>{profile.role}</strong>
          <span>· AI-Native Delivery</span>
        </p>

        {/* name */}
        <h1 className="hero-name mt-5">{profile.name}</h1>

        {/* tagline */}
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#cfd6d4]">
          {profile.tagline} 4 years in the software industry — the last 3 as
          project manager, from kickoff to launch for clients internationally:
          Korea, Japan, the US, and Europe.
        </p>

        {/* metric panel */}
        <dl className="hero-panel mt-10 grid grid-cols-2 gap-y-6 p-6 sm:grid-cols-3 md:mt-12 lg:grid-cols-6">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="sm:px-5 sm:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(6n+1))]:border-l sm:[&:not(:nth-child(3n+1))]:border-white/10 lg:[&:not(:nth-child(6n+1))]:border-white/10"
            >
              <dt className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                <CountUp value={h.value} />
              </dt>
              <dd className="mt-1 text-xs leading-snug">{h.label}</dd>
            </div>
          ))}
        </dl>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#work" className="btn-dark btn-dark-primary">
            View work
            <ArrowRight />
          </a>
          <a href={profile.resume} download className="btn-dark btn-dark-ghost">
            <DownloadIcon />
            Resume
          </a>
          <a href="#contact" className="link-dark ml-1">
            Let&apos;s talk
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
