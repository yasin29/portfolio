import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudyMeta } from '@/lib/case-studies';
import { basePath } from '@/lib/profile';
import Cover from './Cover';

export default function ProjectCard({ study }: { study: CaseStudyMeta }) {
  return (
    <Link href={`/case-studies/${study.slug}`} className="card group flex flex-col">
      {/* preview: real screenshot if present, otherwise a branded gradient cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--border)]">
        {study.preview ? (
          <Image
            src={`${basePath}${study.preview}`}
            alt={`${study.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <Cover study={study} className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-semibold tracking-tight transition-colors group-hover:text-[var(--accent)]">
            {study.title.split(' — ')[0]}
          </h3>
          <span className="shrink-0 text-xs text-[var(--muted-2)]">{study.period}</span>
        </div>

        <p className="mt-1 text-xs text-[var(--muted)]">
          {study.client.split(' — ')[0]} · {study.role}
        </p>

        {study.summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
            {study.summary}
          </p>
        )}

        {study.chips && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {study.chips.slice(0, 3).map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
