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
  /** Solution-oriented display title (what was built, not the client brand). */
  solution: string;
  /** Card eyebrow, e.g. "B2B SAAS · DENTAL TECH". */
  category: string;
  /** One-line defensible outcome/metrics string for cards. */
  metrics: string;
};

// Display-level naming: cards and headings lead with what the solution IS,
// not the client's brand name (per owner preference). Client names stay in
// frontmatter/body for the detail context. All metrics defensible from case studies.
const DISPLAY: Record<string, { solution: string; category: string; metrics: string }> = {
  ivory: {
    solution: 'Dental-Restoration Production Lab & Management Platform',
    category: 'B2B SaaS · Dental Tech',
    metrics: '$138K US & Canada sales in H1 2026 · two phases, kickoff → handover',
  },
  artlive: {
    solution: 'Art-Appraisal Marketplace',
    category: 'Marketplace · Payments',
    metrics: 'Two-sided platform · 3 service flows · Stripe Connect + PayPal architecture',
  },
  bside: {
    solution: 'AI Artwork-Recognition & Exhibition App',
    category: 'Mobile · AI / Computer Vision',
    metrics: 'iOS & Android · PyTorch recognition pipeline on AWS ECS',
  },
  'jtbs-erp': {
    solution: 'Apparel-Industry ERP on a Low-Code Platform',
    category: 'ERP · Apparel · Low-Code',
    metrics: 'Claris FileMaker · 4 integrated modules · 10+ privilege sets',
  },
  'lifeark-nihongo': {
    solution: 'Gamified Language-Learning LMS',
    category: 'EdTech · SaaS',
    metrics: '+25% MAU after relaunch · JLPT-mapped · multilingual',
  },
  'det-bridge': {
    solution: 'English-Test Prep SaaS',
    category: 'EdTech · AI',
    metrics: 'Japan-market first for DET prep · 1 of 2 SaaS launches',
  },
  'findy-team': {
    solution: 'Engineering-Intelligence Platform',
    category: 'DevEx · Data Product',
    metrics: 'DORA & SPACE · 20+ tool integrations · offshore delivery for Japan',
  },
  trustix: {
    solution: 'Sports-Ticket Supplier Management Dashboard',
    category: 'B2B · Operations Dashboard',
    metrics: 'Supplier, inventory & fulfilment in one system · team of 4',
  },
  thrll: {
    solution: 'Personalised Adventure Platform',
    category: 'Mobile · Consumer',
    metrics: 'iOS & Android · personalised matching on a short onboarding',
  },
  'cart-traders': {
    solution: 'Trading-Card Marketplace App',
    category: 'Mobile · Marketplace',
    metrics: 'Camera-first listing flow · structured condition data',
  },
  elite4print: {
    solution: 'Print-Production Commerce Platform',
    category: 'E-commerce · Project Recovery',
    metrics: 'Inherited mid-flight · stabilised quality & scope control',
  },
  ktalk: {
    solution: 'Korean Language-Learning Platform',
    category: 'EdTech · Product Ownership',
    metrics: 'Product Manager · owned direction through a mid-flight handover',
  },
  'pm-dashboard': {
    solution: 'In-House AI Delivery-Ops Platform',
    category: 'Internal Tooling · AI Ops',
    metrics: 'Product Owner · Slack, Meet, GitHub & Notion in one source of truth',
  },
  brandaid: {
    solution: 'AI Campaign Simulation Engine',
    category: 'Personal · AI / RAG / ML',
    metrics: 'Built solo in one week · 7-stage AI pipeline with RAG & ML forecasting',
  },
  futurenation: {
    solution: 'National Skills & Employment Platform',
    category: 'GovTech · EdTech',
    metrics: 'UNDP & ICT Division partnership · live national platform',
  },
  takapay: {
    solution: 'Social-Listening Dashboard with an AI Assistant',
    category: 'Personal · AI Product',
    metrics: '660 posts audited · 37 mislabels caught · assistant computes, never estimates',
  },
  'hrm-ats': {
    solution: 'AI-Assisted Applicant Tracking System',
    category: 'HR-Tech · Explainable AI',
    metrics: 'Thousands of CVs per batch · every score explainable · no auto-rejection',
  },
  'estate-crm': {
    solution: 'Dual-Experience Property App',
    category: 'Real Estate · Mobile · Regulated',
    metrics: 'One Flutter binary, two products · never holds or moves money',
  },
  'moto-brand': {
    solution: 'Motorcycle Brand Platform',
    category: 'Automotive · Brand + Conversion',
    metrics: 'Phased launch · mobile-first · brand and conversion as separate paths',
  },
  'apparel-group': {
    solution: 'Apparel Group Marketing Site',
    category: 'B2B · Manufacturing',
    metrics: 'Built for sourcing buyers · sustainability carried by the design',
  },
  'petnest': {
    solution: 'Pet-Shop Storefront',
    category: 'E-commerce · Repeat Purchase',
    metrics: 'Tuned for re-finding a known product, not for discovery',
  },
  'estate-developer': {
    solution: 'Property Developer Portfolio',
    category: 'Real Estate · Portfolio',
    metrics: 'Projects lead with location and completion stage, not renders',
  },
  insidemaps: {
    solution: '3D Real-Estate Tour QA',
    category: 'QA · 3D / Spatial',
    metrics: 'Nightly regression sweeps on a 3D capture pipeline',
  },
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
  'brandaid',
  'takapay',
  'pm-dashboard',
  'trustix',
  'thrll',
  'cart-traders',
  'elite4print',
  'jtbs-erp',
  'lifeark-nihongo',
  'det-bridge',
  'ktalk',
  'findy-team',
  'futurenation',
  'hrm-ats',
  'estate-crm',
  'moto-brand',
  'apparel-group',
  'petnest',
  'estate-developer',
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
    const display = DISPLAY[slug];
    return {
      slug,
      title: data.title ?? slug,
      solution: display?.solution ?? ((data.title as string) ?? slug).split(' — ')[0],
      category: display?.category ?? (data.chips?.[0] as string) ?? '',
      metrics: display?.metrics ?? '',
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
