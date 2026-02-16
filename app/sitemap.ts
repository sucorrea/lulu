import type { MetadataRoute } from 'next';
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://lulupage.vercel.app/';

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified },
    { url: `${baseUrl}/dashboard`, lastModified },
    { url: `${baseUrl}/galeria`, lastModified },
    { url: `${baseUrl}/historico`, lastModified },
    { url: `${baseUrl}/auditoria`, lastModified },
    { url: `${baseUrl}/sobre`, lastModified },
  ];
}
