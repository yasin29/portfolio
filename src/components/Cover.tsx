import type { CaseStudyMeta } from '@/lib/case-studies';

// Deterministic gradient cover used when a project has no real screenshot yet.
// Drop a screenshot at /public/case-studies/<slug>/preview.png and it replaces this automatically.
const PALETTES: [string, string][] = [
  ['#0f766e', '#155e75'],
  ['#1e3a8a', '#0f766e'],
  ['#7c2d12', '#9a3412'],
  ['#3730a3', '#6d28d9'],
  ['#0c4a6e', '#0e7490'],
  ['#164e63', '#115e59'],
  ['#581c87', '#9d174d'],
  ['#1f2937', '#374151'],
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export default function Cover({
  study,
  className = '',
}: {
  study: CaseStudyMeta;
  className?: string;
}) {
  const [from, to] = PALETTES[hash(study.slug) % PALETTES.length];
  const tag = study.chips?.[0] ?? study.role;
  const initial = study.title.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden="true"
    >
      {/* subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <span className="absolute top-3 left-4 text-[0.7rem] font-medium uppercase tracking-widest text-white/80">
        {tag}
      </span>
      <span className="text-6xl font-bold text-white/90 drop-shadow-sm">
        {initial}
      </span>
    </div>
  );
}
