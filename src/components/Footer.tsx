import { profile } from '@/lib/profile';

export default function Footer() {
  const year = 2026; // build-time constant; avoids hydration drift

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {profile.name} · Built with Next.js & Tailwind
        </span>
        <div className="flex gap-5">
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
            LinkedIn
          </a>
          <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-[var(--accent)]">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
