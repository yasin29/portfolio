import type { CaseStudyMeta } from '@/lib/case-studies';

// Animated abstract cover used when a project has no real screenshot.
// Three CSS-only motifs (network / chat / bars) picked deterministically per slug,
// on dark gradient duos that fit the site's teal identity. Drop a screenshot at
// /public/case-studies/<slug>/preview.png and it replaces this automatically.
const PALETTES: [string, string][] = [
  ['#0f2e2a', '#134e4a'],
  ['#132c3a', '#0f766e'],
  ['#1d2440', '#155e75'],
  ['#2a1d3a', '#134e4a'],
  ['#0c3244', '#0e7490'],
  ['#193049', '#115e59'],
  ['#301d40', '#0f766e'],
  ['#22303c', '#334155'],
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/* --- motifs --- */

function Network() {
  return (
    <div className="relative h-24 w-36" aria-hidden="true">
      {/* connecting lines */}
      <div className="absolute left-1/2 top-1/2 h-px w-14 -translate-y-8 -rotate-[28deg] bg-white/25" />
      <div className="absolute left-1/2 top-1/2 h-px w-14 -translate-x-14 -translate-y-1 bg-white/25" />
      <div className="absolute left-1/2 top-1/2 h-px w-14 translate-y-6 -rotate-[-24deg] bg-white/25" />
      {/* hub */}
      <div className="cov-pulse absolute left-1/2 top-1/2 h-12 w-16 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/40 bg-white/15 backdrop-blur-sm">
        <div className="mx-3 mt-3 h-1.5 rounded bg-white/60" />
        <div className="mx-3 mt-1.5 h-1.5 w-2/3 rounded bg-white/40" />
      </div>
      {/* satellites */}
      <div className="cov-float absolute -top-2 right-0 h-7 w-7 rounded-lg border border-white/35 bg-white/10" />
      <div className="cov-drift absolute -left-4 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg border border-white/35 bg-white/10" />
      <div
        className="cov-float absolute -bottom-2 right-4 h-7 w-7 rounded-lg border border-white/35 bg-white/10"
        style={{ animationDelay: '1.4s' }}
      />
    </div>
  );
}

function Chat() {
  return (
    <div className="relative h-24 w-36" aria-hidden="true">
      <div className="cov-float absolute left-0 top-2 h-10 w-24 rounded-xl rounded-bl-sm border border-white/35 bg-white/12">
        <div className="mx-3 mt-3 h-1.5 rounded bg-white/55" />
        <div className="mx-3 mt-1.5 h-1.5 w-1/2 rounded bg-white/35" />
      </div>
      <div
        className="cov-float absolute bottom-0 right-0 h-9 w-20 rounded-xl rounded-br-sm border border-white/35 bg-white/20"
        style={{ animationDelay: '1.1s' }}
      >
        <div className="mx-3 mt-3 flex gap-1.5">
          <span className="cov-pulse h-1.5 w-1.5 rounded-full bg-white/80" />
          <span className="cov-pulse h-1.5 w-1.5 rounded-full bg-white/80" style={{ animationDelay: '0.4s' }} />
          <span className="cov-pulse h-1.5 w-1.5 rounded-full bg-white/80" style={{ animationDelay: '0.8s' }} />
        </div>
      </div>
      <div className="cov-drift absolute -right-2 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/15 text-xs text-white/80">
        ✦
      </div>
    </div>
  );
}

function Bars() {
  return (
    <div className="relative flex h-24 w-36 items-end justify-center gap-2.5" aria-hidden="true">
      {[0.5, 0.75, 1, 0.6].map((h, i) => (
        <div
          key={i}
          className="cov-rise w-5 rounded-t-md border border-white/35 bg-white/20"
          style={{ height: `${h * 5.5}rem`, animationDelay: `${i * 0.35}s` }}
        />
      ))}
      <div className="cov-drift absolute -right-1 top-1 h-9 w-9 rounded-full border-2 border-white/40" />
      <div className="cov-float absolute -left-2 top-3 h-px w-10 rotate-[-20deg] bg-white/40" />
    </div>
  );
}

const MOTIFS = [Network, Chat, Bars];

export default function Cover({
  study,
  className = '',
}: {
  study: CaseStudyMeta;
  className?: string;
}) {
  const h = hash(study.slug);
  const [from, to] = PALETTES[h % PALETTES.length];
  const Motif = MOTIFS[h % MOTIFS.length];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {/* subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* soft glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(60% 70% at 60% 35%, rgba(255,255,255,0.10), transparent 70%)',
        }}
      />
      <span className="absolute left-4 top-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/70">
        {study.category}
      </span>
      <Motif />
    </div>
  );
}
