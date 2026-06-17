import Link from 'next/link';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import Timeline from '@/components/Timeline';
import { getAllCaseStudies } from '@/lib/case-studies';
import {
  profile,
  experience,
  skillGroups,
  certifications,
  education,
  principles,
} from '@/lib/profile';

export default function Home() {
  const studies = getAllCaseStudies();
  const featured = studies.slice(0, 6);

  return (
    <>
      <Hero />

      {/* ---------- Selected work ---------- */}
      <Section
        id="work"
        eyebrow="Selected work"
        title="Products I've shipped"
        intro="Eight case studies across marketplaces, EdTech, ERP, mobile-AI, and HR-tech — each one I owned end-to-end."
        action={
          <Link href="/case-studies" className="text-sm font-medium text-[var(--accent)] hover:underline">
            All case studies →
          </Link>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <ProjectCard key={s.slug} study={s} />
          ))}
        </div>
      </Section>

      {/* ---------- About ---------- */}
      <Section id="about" eyebrow="About" title="How I work">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4 text-[var(--muted)] leading-relaxed">
            <p>
              I&apos;m a Technical Project Manager based in Dhaka, Bangladesh (GMT+6), with 4 years of
              experience. I started in software as a front-end developer, moved through QA, and grew
              into project management — so I can read the code, debate scope with engineers, and
              translate cleanly between technical and non-technical stakeholders.
            </p>
            <p>
              At{' '}
              <a href={profile.currentlyAt.url} target="_blank" rel="noreferrer" className="text-[var(--accent)] underline underline-offset-2">
                Potential Inc.
              </a>
              , I&apos;ve shipped 6 web and mobile products end-to-end in 11 months for JP, KOR, US,
              and EU clients. The AI-augmented delivery workflows I build in Claude Code — with n8n and
              Notion — cut average client delivery 3x, from three months to one, without dropping the
              quality bar.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="text-sm font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- Experience ---------- */}
      <Section
        id="experience"
        eyebrow="Career"
        title="Experience"
        intro="Four years of cross-border delivery across Bangladesh, Japan, and Korea."
      >
        <Timeline items={experience} />
      </Section>

      {/* ---------- Skills ---------- */}
      <Section id="skills" eyebrow="Toolkit" title="Skills & tools">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div key={g.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
                {g.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Certifications & education ---------- */}
      <Section id="credentials" eyebrow="Credentials" title="Certifications & education">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Certifications
            </h3>
            <ul className="space-y-3">
              {certifications.map((c) => (
                <li key={c.name} className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-[var(--muted-2)]">{c.issuer}</p>
                  </div>
                  {c.id && <span className="shrink-0 font-mono text-[0.7rem] text-[var(--muted-2)]">ID {c.id}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Education
            </h3>
            <ul className="space-y-5">
              {education.map((e) => (
                <li key={e.school}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-medium">{e.degree}</p>
                    <span className="shrink-0 text-xs text-[var(--muted-2)]">{e.period}</span>
                  </div>
                  <p className="text-sm text-[var(--accent)]">{e.school}</p>
                  {e.note && <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{e.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------- Contact ---------- */}
      <Section id="contact" eyebrow="Contact" title="Let's talk">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-12">
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            I&apos;m open to senior Technical PM roles at teams shipping a product I&apos;d use.
            Comfortable across US, EU, JP, and KR timezones. The fastest way to reach me is email.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              {profile.email}
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
              LinkedIn
            </a>
            <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
              GitHub
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Resume (PDF)
            </a>
          </div>
          <p className="mt-6 text-sm text-[var(--muted-2)]">
            {profile.location} · {profile.timezone} · {profile.phone}
          </p>
        </div>
      </Section>
    </>
  );
}
