import Link from 'next/link';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Story from '@/components/Story';
import Section from '@/components/Section';
import WorkGrid from '@/components/WorkGrid';
import WorkProcess from '@/components/WorkProcess';
import JourneyRail from '@/components/JourneyRail';
import Competencies from '@/components/Competencies';
import Impact from '@/components/Impact';
import { WhatsAppIcon } from '@/components/Story';
import CopyButton from '@/components/CopyButton';
import {
  profile,
  capabilities,
  skillGroups,
  certifications,
  education,
  publication,
  languages,
} from '@/lib/profile';

function GradIcon({ children }: { children: React.ReactNode }) {
  return <span className="cred-icon">{children}</span>;
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* ---------- Selected work ---------- */}
      <Section
        id="work"
        eyebrow="— Selected work"
        title={
          <>
            Products built on <em>shipped decisions.</em>
          </>
        }
        intro="Client builds, products I owned, internal tooling, and my own. Open any card for the short version — the full case study is one click further."
        action={
          <Link
            href="/case-studies"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            All case studies →
          </Link>
        }
      >
        <WorkGrid />
      </Section>

      {/* ---------- The story ---------- */}
      <Story />

      {/* ---------- Process & journey ---------- */}
      <Section
        id="experience"
        eyebrow="— How I work"
        title={
          <>
            A process, and the <em>road that built it.</em>
          </>
        }
        intro="Four years, four companies, one throughline — developer to QA to project manager, shipping software the whole way."
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          <div>
            <div className="lg:sticky lg:top-24">
              <WorkProcess />
            </div>
          </div>

          <div>
            <p className="jr-label">
              Journey
              <span className="sep">·</span>
              <span className="cue">Tap to expand</span>
            </p>
            <JourneyRail />
          </div>
        </div>
      </Section>

      {/* ---------- Capabilities ---------- */}
      <Section
        id="capabilities"
        eyebrow="— Capabilities"
        title={
          <>
            Core <em>competencies.</em>
          </>
        }
        intro={capabilities.intro}
      >
        <Competencies />

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* philosophy */}
          <div className="bento-card bento-sage lg:col-span-2">
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] opacity-70">
              ✦ Philosophy ✦
            </p>
            <p className="text-[0.98rem] leading-relaxed">{capabilities.philosophy.quote}</p>
            <p className="mt-4 text-sm font-semibold">
              {capabilities.philosophy.name}
              <span className="font-normal opacity-70">, {capabilities.philosophy.role}</span>
            </p>
          </div>

          {/* open to */}
          <div className="bento-card">
            <p className="eyebrow mb-4">Open to</p>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              {capabilities.openTo.body}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {capabilities.openTo.chips.map((c) => (
                <span key={c} className="chip chip-accent">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Impact by the numbers ---------- */}
      <Section
        id="numbers"
        eyebrow="— Quantified results"
        title={
          <>
            Impact by the <em>numbers.</em>
          </>
        }
        intro="Outcomes, not output — every figure below is one I can walk through end-to-end."
      >
        <Impact />
      </Section>

      {/* ---------- Skills ---------- */}
      <Section id="skills" eyebrow="— Skills" title="Skills & tools">
        <div className="grid gap-8 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div key={g.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
                {g.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span key={item} className="skill-box">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Education / certifications / publication ---------- */}
      <Section id="credentials" eyebrow="— Credentials" title="Education & certifications">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((e) => (
                <div key={e.school} className="cred-card">
                  <GradIcon>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 4L2 9l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </GradIcon>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{e.degree}</p>
                    {e.url ? (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 inline-block text-sm text-[var(--accent)] hover:underline"
                      >
                        {e.school}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-[var(--accent)]">{e.school}</p>
                    )}
                    {e.note && <p className="mt-0.5 text-xs text-[var(--muted-2)]">{e.note}</p>}
                  </div>
                  <span className="cred-year">{e.period}</span>
                </div>
              ))}
            </div>

            <h3 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Publication
            </h3>
            <div className="cred-card">
              <GradIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </GradIcon>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">{publication.title}</p>
                <p className="mt-0.5 text-xs text-[var(--muted-2)]">{publication.venue}</p>
              </div>
            </div>

            <h3 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Languages
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {languages.map((l) => (
                <div key={l.name} className="lang-card">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold">{l.name}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                      {l.level}
                    </p>
                  </div>
                  <div className="lang-bar">
                    <div className="lang-bar-fill" style={{ '--w': `${l.pct}%` } as React.CSSProperties} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((c) => (
                <div key={c.name} className="cred-card items-center">
                  <GradIcon>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M9 13l-1.5 7L12 17.5 16.5 20 15 13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </GradIcon>
                  <div className="min-w-0 flex-1">
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium leading-snug hover:text-[var(--accent)] hover:underline"
                      >
                        {c.name}
                      </a>
                    ) : (
                      <p className="text-sm font-medium leading-snug">{c.name}</p>
                    )}
                    {c.issuer && <p className="mt-0.5 text-xs text-[var(--muted-2)]">{c.issuer}</p>}
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-[var(--accent)]"
                  >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="section">
        <div className="container-page py-10 text-center md:py-16" data-reveal>
          <p className="eyebrow">— Let&apos;s build something</p>
          <h2 className="contact-title mx-auto mt-6 max-w-3xl">
            Have a role or product <em>worth shipping?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-[var(--muted)]">
            I&apos;m exploring Technical Project Manager roles — on-site or remote, with
            teams shipping internationally. Recruiters, founders, engineers — let&apos;s talk.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <a href={`mailto:${profile.email}`} className="btn-pill btn-pill-solid">
                {profile.email}
              </a>
              <CopyButton text={profile.email} label="email address" />
            </span>
            <span className="inline-flex items-center gap-1.5">
              <a
                href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="btn-pill btn-pill-outline"
              >
                {profile.phone}
              </a>
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] text-[#25d366] transition-colors hover:border-[#25d366]"
              >
                <WhatsAppIcon size={15} />
              </a>
              <CopyButton text={profile.phone} label="phone number" />
            </span>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn-pill btn-pill-outline"
            >
              LinkedIn
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="btn-pill btn-pill-outline"
            >
              GitHub
            </a>
          </div>
          <p className="mt-8 text-sm text-[var(--muted-2)]">
            {profile.location} · {profile.timezone}
          </p>
        </div>
      </section>
    </>
  );
}
