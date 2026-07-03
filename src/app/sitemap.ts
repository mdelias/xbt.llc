import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://xbt.llc';
  const routes = ['', '/about', '/services', '/team', '/contact'];

  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: r === '' ? 1 : 0.8,
  }));
}