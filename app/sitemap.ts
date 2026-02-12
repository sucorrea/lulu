import type { MetadataRoute } from 'next';
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://lulupage.vercel.app/';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/dashboard`, lastModified: new Date() },
    { url: `${baseUrl}/galeria`, lastModified: new Date() },
    { url: `${baseUrl}/historico`, lastModified: new Date() },
    { url: `${baseUrl}/auditoria`, lastModified: new Date() },
    { url: `${baseUrl}/sobre`, lastModified: new Date() },
  ];
}
