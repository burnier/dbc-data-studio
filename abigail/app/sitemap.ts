import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://abigail.dbcdatastudio.com';

  return [
    { url: `${base}/en`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/de`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/pt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/hu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/refund`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
