import Link from 'next/link';
import { profile } from '@/lib/profile';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';

const links = [
  { href: '/#work', label: 'Work' },
  { href: '/#story', label: 'Story' },
  { href: '/#experience', label: 'Journey' },
  { href: '/#capabilities', label: 'Capabilities' },
  { href: '/#skills', label: 'Skills' },
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

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
