import Image from 'next/image';
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
      <div className="container-page hero-inner">
        <div className="hero-grid">
          {/* ---------- copy ---------- */}
          <div>
            <span className="hero-avail">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-on-dark)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-on-dark)]" />
              </span>
              {profile.availability}
            </span>

            <h1 className="hero-name mt-5">{profile.name}</h1>

            <p className="hero-role mt-4">
              <strong>{profile.role}</strong> · AI-Native Delivery
            </p>

            {/* The whole lede lives in content, so it stays editable. */}
            <p className="hero-lede mt-5">{profile.tagline}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-pill btn-pill-solid">
                View work
                <ArrowRight />
              </a>
              <a href="#contact" className="btn-pill btn-pill-outline">
                Get in touch
              </a>
              <a href={profile.resume} download className="btn-pill btn-pill-outline">
                <DownloadIcon />
                Resume
              </a>
            </div>

            <p className="hero-contact mt-6">
              <a href={`mailto:${profile.email}`}>Email</a>
              <span className="sep" aria-hidden="true">
                ·
              </span>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <span className="sep" aria-hidden="true">
                ·
              </span>
              <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
            </p>
          </div>

          {/* ---------- portrait ---------- */}
          <div className="hero-photo-wrap">
            <span className="hero-photo-ring" aria-hidden="true" />
            <div className="hero-photo">
              <Image
                src={profile.photoCutout}
                alt={`${profile.name} — ${profile.role}`}
                fill
                priority
                sizes="(min-width: 1024px) 22rem, 15rem"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* ---------- metric panel ---------- */}
        <dl className="hero-panel mt-12 grid grid-cols-2 gap-y-6 p-6 sm:grid-cols-3 lg:grid-cols-6">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="cell sm:px-5 sm:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(6n+1))]:border-l"
            >
              <dt className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                <CountUp value={h.value} />
              </dt>
              <dd className="mt-1 text-xs leading-snug">{h.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---------- scroll cue ---------- */}
      <a href="#story" className="scroll-cue" aria-label="Scroll to content">
        <span />
      </a>
    </section>
  );
}
