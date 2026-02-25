import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://luluzinha.web.app';

const robots = (): MetadataRoute.Robots => {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/participantes/'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
};
export default robots;
