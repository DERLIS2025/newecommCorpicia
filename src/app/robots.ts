import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // ✅ CORREGIDO: Sin espacio, sin www (dominio principal)
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://corpicia.com').trim();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/productos/', '/og-image.jpg'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
