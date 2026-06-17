import Link from 'next/link';
import { profile } from '@/lib/profile';

const links = [
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills', label: 'Skills' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/#contact', label: 'Contact' },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-[var(--foreground)]">
              {l.label}
            </Link>
          ))}
        </nav>

        <a href={profile.resume} className="btn btn-primary text-sm">
          Resume
        </a>
      </div>
    </header>
  );
}
