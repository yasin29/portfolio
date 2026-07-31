// Typed access to the site's editable content.
//
// The data itself lives in content/site.json, which is what the admin dashboard
// reads and writes. This module only adds types and the few derived values
// (basePath-prefixed asset URLs, absolute URLs) that depend on build config.
//
// To re-derive the JSON from an older hardcoded version, see
// scripts/extract-content.mjs.

import site from '../../content/site.json';

// Set at build time (e.g. "/portfolio" for GitHub Pages project sites); empty in dev/Vercel.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Canonical origin, used for canonical URLs, Open Graph, sitemap, and JSON-LD.
 * Override with NEXT_PUBLIC_SITE_URL when the site moves to a custom domain —
 * getting this wrong points every canonical tag at a page that does not exist.
 */
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yasin29.github.io'
).replace(/\/$/, '');

/** Absolute URL for a site-relative path, basePath included. */
export function absoluteUrl(pathname = '/'): string {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteOrigin}${basePath}${clean === '/' ? '' : clean}` || siteOrigin;
}

/* ---------- Types ---------- */

export type Profile = {
  name: string;
  role: string;
  roleSecondary: string;
  tagline: string;
  location: string;
  timezone: string;
  workMode: string;
  focus: string;
  email: string;
  phone: string;
  whatsapp: string;
  resume: string;
  photo: string;
  photoCutout: string;
  socials: { linkedin: string; github: string };
  currentlyAt: { company: string; url: string; note: string };
  availability: string;
  languages: string;
};

export type Language = { name: string; level: string; pct: number };
export type Highlight = { value: string; label: string };
export type Story = {
  statementLead: string;
  statementEm: string;
  statementTail: string;
  chips: string[];
  paragraphs: string[];
};
export type Principle = { title: string; body: string };
export type ProcessStage = {
  title: string;
  caption: string;
  body: string;
  methods: string[];
};
export type Capabilities = {
  intro: string;
  philosophy: { quote: string; name: string; role: string };
  openTo: { body: string; chips: string[] };
};
export type Competency = { title: string; items: string };
export type ImpactGroup = {
  category: string;
  icon: 'delivery' | 'growth' | 'scale';
  blurb: string;
  metrics: { label: string; value: string; detail: string }[];
};
export type Experience = {
  company: string;
  url?: string;
  role: string;
  period: string;
  context: string;
  blurb: string;
  current?: boolean;
  chips?: { label: string; href?: string }[];
  stats?: { value: string; label: string }[];
  projects?: { name: string; tagline: string; detail: string }[];
  portfolio?: { label: string; items: string }[];
  bullets: string[];
};
export type SkillGroup = { title: string; items: string[] };
export type Certification = { name: string; issuer?: string; id?: string; url?: string };
export type Education = {
  degree: string;
  school: string;
  period: string;
  note?: string;
  url?: string;
};
export type Publication = { title: string; venue: string };

/* ---------- Content ---------- */

const raw = site.profile as Profile;

/** Asset paths are stored bare in JSON; basePath is applied here. */
export const profile: Profile = {
  ...raw,
  resume: `${basePath}${raw.resume}`,
  photo: `${basePath}${raw.photo}`,
  photoCutout: `${basePath}${raw.photoCutout}`,
};

export const languages = site.languages as Language[];
export const highlights = site.highlights as Highlight[];
export const marqueeCompanies = site.marqueeCompanies as string[];
export const story = site.story as Story;
export const howIOperate = site.howIOperate as Principle[];
export const pmProcess = site.pmProcess as ProcessStage[];
export const capabilities = site.capabilities as Capabilities;
export const coreCompetencies = site.coreCompetencies as Competency[];
export const impact = site.impact as ImpactGroup[];
export const experience = site.experience as Experience[];
export const skillGroups = site.skillGroups as SkillGroup[];
export const certifications = site.certifications as Certification[];
export const education = site.education as Education[];
export const publication = site.publication as Publication;
export const principles = site.principles as Principle[];
