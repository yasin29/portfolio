import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudyMeta } from '@/lib/case-studies';
import { basePath } from '@/lib/profile';
import Cover from './Cover';

export default function ProjectCard({ study }: { study: CaseStudyMeta }) {
  return (
    <Link href={`/case-studies/${study.slug}`} className="card group flex flex-col">
      {/* animated illustration cover; real screenshot if one exists */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--border)]">
        {study.preview ? (
          <Image
            src={`${basePath}${study.preview}`}
            alt={`${study.solution} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <Cover study={study} className="h-full w-full" />
        )}
        {/* corner plus, Pratik-style */}
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md border border-white/20 bg-black/30 text-sm leading-none text-white/80 backdrop-blur-sm transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
          +
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
          {study.category}
        </p>

        <h3 className="mt-2 font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--accent)]">
          {study.solution}
        </h3>

        {study.metrics && (
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{study.metrics}</p>
        )}

        <p className="mt-auto pt-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
          View case study{' '}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
