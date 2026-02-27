import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://abigail.dbcdatastudio.com';
  const langs = ['en', 'de', 'pt', 'hu'];
  const legal = ['privacy', 'terms', 'refund'];

  const langPages: MetadataRoute.Sitemap = langs.map(lang => ({
    url: `${base}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }));

  const legalPages: MetadataRoute.Sitemap = langs.flatMap(lang =>
    legal.map(type => ({
      url: `${base}/${lang}/${type}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }))
  );

  return [...langPages, ...legalPages];
}
