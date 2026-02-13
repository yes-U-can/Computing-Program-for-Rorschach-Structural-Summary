import { MetadataRoute } from 'next';
import { getAllDocRoutes } from '@/lib/docsCatalog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rorschach-calculator.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/chat`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/account`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const docRoutes = getAllDocRoutes()
    .filter((item) => item.kind === 'entry')
    .map((item) => ({
      url: `${siteUrl}/docs/${item.slug.join('/')}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }));

  return [...staticRoutes, ...docRoutes];
}
