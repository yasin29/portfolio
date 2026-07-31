// Structured data (JSON-LD) for search engines and AI answer engines.
//
// The audience for these pages is recruiters, clients, and other professionals,
// so the schema leads with the person and their work rather than treating the
// case studies as blog posts. Every value is drawn from real profile data.

import { profile, absoluteUrl, siteOrigin } from './profile';
import type { CaseStudy } from './case-studies';

const AUTHOR_ID = `${siteOrigin}/#yasin-billah`;

/** Person schema — the entity every other node points back to. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: profile.name,
    url: absoluteUrl('/'),
    image: absoluteUrl(profile.photo.replace(/^.*?(?=\/)/, '')),
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    worksFor: {
      '@type': 'Organization',
      name: profile.currentlyAt.company,
      url: profile.currentlyAt.url,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Bangladesh University of Professionals',
    },
    knowsAbout: [
      'Technical Project Management',
      'Technical Product Management',
      'Agile and Scrum delivery',
      'AI-native delivery workflows',
      'Software QA and UAT',
      'Release management',
      'Cross-border software delivery',
    ],
    sameAs: [profile.socials.linkedin, profile.socials.github],
  };
}

/** WebSite schema for the home page. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteOrigin}/#website`,
    url: absoluteUrl('/'),
    name: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    inLanguage: 'en',
    publisher: { '@id': AUTHOR_ID },
  };
}

/**
 * Case studies are creative works Yasin authored about products he delivered —
 * Article is the type search engines read most reliably for long-form pages.
 */
export function caseStudySchema(study: CaseStudy) {
  const url = absoluteUrl(`/case-studies/${study.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: `${study.solution} — case study`,
    description: study.summary,
    url,
    mainEntityOfPage: url,
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': AUTHOR_ID },
    inLanguage: 'en',
    ...(study.preview ? { image: absoluteUrl(study.preview) } : {}),
    about: {
      '@type': 'CreativeWork',
      name: study.solution,
      ...(study.link ? { url: study.link } : {}),
    },
    keywords: [
      study.category,
      study.role,
      ...(study.chips ?? []),
      ...(study.stack ?? []),
    ].join(', '),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.path),
    })),
  };
}

/** Renders a JSON-LD block. Next hoists this into <head> automatically. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is not HTML; escape the one sequence that could
      // break out of the script element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
