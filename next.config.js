/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 🔒 Seguridad: Ocultar versión de Next.js
  poweredByHeader: false,
  
  // 🌐 SEO: Trailing slash consistente (evita contenido duplicado)
  trailingSlash: true,
  
  // 📦 Compresión para Core Web Vitals
  compress: true,
  
  // 🖼️ Imágenes: Dominios permitidos (NO uses '**')
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'corpicia.com',
      },
      {
        protocol: 'https',
        hostname: 'www.corpicia.com',
      },
      // Agregá acá si usás CDN externo (ej: Cloudinary, AWS S3)
      // {
      //   protocol: 'https',
      //   hostname: 'tu-cdn.com',
      // },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 🌍 Internacionalización (para SEO global)
  i18n: {
    locales: ['es'],
    defaultLocale: 'es',
    // Cuando expandas a otros países:
    // locales: ['es', 'es-AR', 'es-UY', 'pt-BR'],
    // defaultLocale: 'es',
  },

  // 🔀 Redirects críticos para SEO
  async redirects() {
    return [
      // Redirect www ↔ non-www (elegí uno y mantenelo)
      // Si tu dominio principal es www.corpicia.com:
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'corpicia.com',
          },
        ],
        destination: 'https://www.corpicia.com/:path*',
        permanent: true,
      },
      // Redirect HTTP → HTTPS (si Vercel no lo hace automático)
      // Vercel ya lo hace, pero por las dudas:
    ];
  },

  // 📋 Headers de seguridad y SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          // CSP básico (ajustar según scripts de terceros)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://www.google-analytics.com https://www.googletagmanager.com",
              "font-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
              "frame-src https://www.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
      {
        // Cache para assets estáticos
        source: '/(.*\\.(js|css|svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 🔧 Experimental (Next.js 14+)
  experimental: {
    // Optimización de imágenes
    optimizePackageImports: ['lucide-react'],
    // Server Actions (si los usás)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
