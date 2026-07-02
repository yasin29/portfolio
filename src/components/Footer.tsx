import { profile } from '@/lib/profile';

export default function Footer() {
  const year = 2026; // build-time constant; avoids hydration drift

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="container-page flex flex-col items-center gap-4 py-9 text-sm text-[var(--muted)] sm:flex-row sm:justify-between">
        <span className="font-serif text-base text-[var(--foreground)]">{profile.name}</span>
        <span className="text-center text-[var(--muted-2)]">
          {profile.role} · {profile.focus} · {profile.location}
        </span>
        <span className="text-[var(--muted-2)]">© {year} · Built with intent</span>
      </div>
    </footer>
  );
}
