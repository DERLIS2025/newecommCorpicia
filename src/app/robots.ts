import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // ✅ CORREGIDO: Sin espacio, con www
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://corpicia.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/productos/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
