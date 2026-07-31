import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Cover from '@/components/Cover';
import Figure, { FigureRow } from '@/components/Figure';
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies';
import { basePath, absoluteUrl } from '@/lib/profile';
import { JsonLd, caseStudySchema, breadcrumbSchema } from '@/lib/seo';

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

  const title = `${study.solution} — ${study.role} Case Study`;
  const description =
    study.summary || `${study.client} · ${study.role} · ${study.period}`;
  const url = absoluteUrl(`/case-studies/${study.slug}`);
  const image = study.preview ? absoluteUrl(study.preview) : undefined;

  return {
    title,
    description,
    keywords: [
      study.solution,
      study.category,
      study.role,
      'Technical Project Manager',
      'case study',
      ...(study.chips ?? []),
      ...(study.stack ?? []),
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Yasin Billah',
      locale: 'en_US',
      ...(image ? { images: [{ url: image, alt: `${study.solution} preview` }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
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
      <JsonLd
        data={[
          caseStudySchema(study),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Case studies', path: '/case-studies' },
            { name: study.solution, path: `/case-studies/${study.slug}` },
          ]),
        ]}
      />

      <div className="container-prose pt-10">
        <Link href="/case-studies" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← All case studies
        </Link>
      </div>

      {/* Hero preview: contained and letterboxed rather than full-bleed. These
          are UI screenshots — cropping one to a 21:8 band shows an unreadable
          slice of a dashboard. Same framing as the in-body figures. */}
      <div className="cs-hero">
        <div className="cs-hero-frame">
          {study.preview ? (
            <>
              {/* Screenshots come in every aspect ratio. Rather than crop them
                  or leave dead bars, the same image fills the frame blurred
                  behind the contained one. */}
              <Image
                src={`${basePath}${study.preview}`}
                alt=""
                aria-hidden="true"
                fill
                className="cs-hero-blur object-cover"
                sizes="(min-width: 1100px) 62rem, 100vw"
              />
              <Image
                src={`${basePath}${study.preview}`}
                alt={`${study.solution} — product screenshot`}
                fill
                priority
                className="object-contain"
                sizes="(min-width: 1100px) 62rem, 100vw"
              />
            </>
          ) : (
            <Cover study={study} className="h-full w-full" />
          )}
        </div>
      </div>

      <div className="container-prose pb-12">
        <header className="mt-2 mb-8 border-b border-[var(--border)] pb-8">
          {study.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${basePath}${study.logo}`}
              alt={`${study.title.split(' — ')[0]} logo`}
              className="mb-4 h-8 w-auto"
            />
          )}
          <p className="text-xs uppercase tracking-wider text-[var(--muted-2)]">
            {study.category} · {study.period} · {study.status ?? 'In progress'}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {study.solution}
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            {study.client} · {study.role}
          </p>
          {study.link && (
            <a
              href={study.link}
              target="_blank"
              rel="noreferrer"
              className="btn-pill btn-pill-solid btn-sm mt-5"
            >
              Visit site →
            </a>
          )}
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
          <MDXRemote source={study.content} components={{ Figure, FigureRow }} />
        </div>

        <footer className="mt-16 flex items-center justify-between border-t border-[var(--border)] pt-8 text-sm">
          <Link href="/case-studies" className="text-[var(--muted)] hover:text-[var(--accent)]">
            ← All case studies
          </Link>
          {next && next.slug !== study.slug && (
            <Link href={`/case-studies/${next.slug}`} className="text-[var(--accent)] hover:underline">
              Next: {next.solution} →
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
}
