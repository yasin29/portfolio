import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type CaseStudyMeta = {
  slug: string;
  title: string;
  client: string;
  role: string;
  period: string;
  status?: string;
  stack?: string[];
  chips?: string[];
  /** Public path to a logo (e.g. SVG), prefixed with basePath at render time. */
  logo?: string;
  /** External "visit site" URL. */
  link?: string;
  /** Public path to a real screenshot/preview, only set when the file exists on disk. */
  preview?: string;
  /** Short blurb shown on cards — first paragraph of the body if not given. */
  summary: string;
};

export type CaseStudy = CaseStudyMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'case-studies');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Curated display order (most relevant / recent first).
const ORDER = [
  'ivory',
  'artlive',
  'bside',
  'jtbs-erp',
  'lifeark-nihongo',
  'det-bridge',
  'findy-job',
  'insidemaps',
];

// Looks for a real preview image for a slug under /public/case-studies/<slug>/.
// Returns the public URL if one exists, otherwise undefined (card falls back to a cover).
function findPreview(slug: string, frontmatterHero?: string): string | undefined {
  const candidates = [
    frontmatterHero,
    `/case-studies/${slug}/preview.png`,
    `/case-studies/${slug}/preview.jpg`,
    `/case-studies/${slug}/preview.webp`,
    `/case-studies/${slug}/hero.png`,
    `/case-studies/${slug}/hero.jpg`,
  ].filter(Boolean) as string[];

  for (const url of candidates) {
    const abs = path.join(PUBLIC_DIR, url.replace(/^\//, ''));
    if (fs.existsSync(abs)) return url;
  }
  return undefined;
}

function firstParagraph(content: string): string {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#') || line.startsWith('---')) continue;
    return line.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  }
  return '';
}

export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .filter((f) => !f.startsWith('README') && !f.startsWith('_'));

  const studies = files.map((file) => {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    const slug = (data.slug as string) || file.replace(/\.mdx?$/, '');
    return {
      slug,
      title: data.title ?? slug,
      client: data.client ?? '',
      role: data.role ?? '',
      period: data.period ?? '',
      status: data.status,
      stack: data.stack,
      chips: data.chips,
      logo: data.logo as string | undefined,
      link: data.link as string | undefined,
      preview: findPreview(slug, data.hero as string | undefined),
      summary: (data.summary as string) || firstParagraph(content),
      content,
    } satisfies CaseStudy;
  });

  return studies.sort((a, b) => {
    const ia = ORDER.indexOf(a.slug);
    const ib = ORDER.indexOf(b.slug);
    if (ia === -1 && ib === -1) return a.slug.localeCompare(b.slug);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  return getAllCaseStudies().find((s) => s.slug === slug) ?? null;
}
