import type { MetadataRoute } from 'next';
import { getAllCaseStudies } from '@/lib/case-studies';
import { absoluteUrl } from '@/lib/profile';

// Emitted as a static sitemap.xml at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/case-studies'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/about'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const studies: MetadataRoute.Sitemap = getAllCaseStudies().map((s) => ({
    url: absoluteUrl(`/case-studies/${s.slug}`),
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...studies];
}
