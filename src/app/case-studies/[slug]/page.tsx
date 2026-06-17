import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Cover from '@/components/Cover';
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies';

export async function generateStaticParams() {
  return getAllCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: `${study.title} — Yasin Billah`,
    description: study.summary || `${study.client} · ${study.role} · ${study.period}`,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return notFound();

  const all = getAllCaseStudies();
  const idx = all.findIndex((s) => s.slug === slug);
  const next = all[(idx + 1) % all.length];

  return (
    <article>
      {/* hero preview */}
      <div className="relative aspect-[21/8] w-full overflow-hidden border-b border-[var(--border)] bg-[var(--surface)]">
        {study.preview ? (
          <Image src={study.preview} alt={`${study.title} preview`} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <Cover study={study} className="h-full w-full" />
        )}
      </div>

      <div className="container-prose py-12">
        <Link href="/case-studies" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← All case studies
        </Link>

        <header className="mt-6 mb-8 border-b border-[var(--border)] pb-8">
          <p className="text-xs uppercase tracking-wider text-[var(--muted-2)]">
            {study.period} · {study.status ?? 'In progress'}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {study.title}
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            {study.client} · {study.role}
          </p>
          {study.chips && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {study.chips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          )}
          {study.stack && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {study.stack.map((s) => (
                <span key={s} className="chip chip-accent">
                  {s}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose-custom">
          <MDXRemote source={study.content} />
        </div>

        <footer className="mt-16 flex items-center justify-between border-t border-[var(--border)] pt-8 text-sm">
          <Link href="/case-studies" className="text-[var(--muted)] hover:text-[var(--accent)]">
            ← All case studies
          </Link>
          {next && next.slug !== study.slug && (
            <Link href={`/case-studies/${next.slug}`} className="text-[var(--accent)] hover:underline">
              Next: {next.title.split(' — ')[0]} →
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
}
