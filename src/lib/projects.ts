// The project roster behind the Work grid, filter chips, and drawer.
//
// Grouped on one axis — who the work was for and how much of it was Yasin's:
//   client   · delivered for an external client at an employer
//   owned    · products where he was Product Manager, not only Project Manager
//   inhouse  · internal products built for the company itself
//   personal · his own builds
//
// The data lives in content/site.json (what the admin dashboard reads and
// writes); this module supplies the types and the basePath-aware helpers.

import site from '../../content/site.json';
import { basePath } from './profile';

export type ProjectCategory = 'client' | 'owned' | 'inhouse' | 'personal';

export const CATEGORY_LABELS: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'client', label: 'Client work' },
  { id: 'owned', label: 'Products I owned' },
  { id: 'inhouse', label: 'In-house' },
  { id: 'personal', label: 'Personal AI builds' },
];

export type DrawerSection = {
  title: string;
  body: string;
  /** A single line worth pulling out — the insight, not a restatement. */
  quote?: string;
  chips?: string[];
  image?: { src: string; alt: string; caption?: string };
};

export type Project = {
  slug: string;
  name: string;
  /** What the product is, led with over the client brand. */
  solution: string;
  category: ProjectCategory;
  /** Card eyebrow, e.g. "B2B SaaS · Dental Tech". */
  domain: string;
  org: string;
  period: string;
  role: string;
  /** Delivery approach — the AI-native vs legacy contrast is part of the story. */
  approach?: 'AI-native' | 'Legacy';
  team?: string;
  /** One line for the card. */
  summary: string;
  /** Fallback drawer body when `sections` is absent. */
  contribution: string[];
  /** Numbered accordion sections in the drawer. */
  sections?: DrawerSection[];
  /** Screenshot shown in the drawer's live-product block. */
  livePreview?: { src: string; alt: string };
  /** Drawer stat tiles. Omitted where there is no defensible figure. */
  stats?: { value: string; label: string }[];
  stack?: string[];
  /** Public product URL, when there is one. */
  live?: string;
  /** Slug of the full case study, when one has been written. */
  caseStudy?: string;
  /** A real client quote. Only ever populated from something the client
   *  actually said — never written to fill the space. */
  feedback?: { quote: string; attribution?: string };
  /** Preview image path (basePath applied at render). */
  preview?: string;
};

export const projects = site.projects as Project[];

/** Public URL for a project preview, basePath-prefixed for GitHub Pages. */
export function previewUrl(p: Project): string | undefined {
  return p.preview ? `${basePath}${p.preview}` : undefined;
}

export function projectsByCategory(category: ProjectCategory | 'all'): Project[] {
  return category === 'all' ? projects : projects.filter((p) => p.category === category);
}
