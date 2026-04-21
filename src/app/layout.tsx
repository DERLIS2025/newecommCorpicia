import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloatingButton } from '@/components/WhatsAppButton';
import { BudgetDrawer } from '@/components/BudgetDrawer';

const inter = Inter({ subsets: ['latin'] });

// URL base - IMPORTANTE: debe coincidir con tu dominio canonical
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpicia.com';

// ============================================
// METADATA PRINCIPAL (SEO + Social)
// ============================================
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  
  // Títulos optimizados para CTR en Google
  title: {
    default: 'Corpicia | Césped Natural, Riego y Jardinería en Paraguay',
    template: '%s | Corpicia - Jardinería Premium',
  },
  
  // Description con keywords y CTA (máx 160 caracteres)
  description:
    'Venta e instalación de césped natural en Paraguay. Riego automático, paisajismo y asesoría experta. Presupuesto por WhatsApp. Envíos a todo el país.',
  
  // Keywords (Google ya no las usa mucho, pero otras sí)
  keywords: [
    'césped natural Paraguay',
    'jardinería Asunción',
    'riego automático',
    'paisajismo',
    'césped Esmeralda',
    'césped Kavaju',
    'instalación césped',
    'productos jardín',
  ],
  
  // Autor y publisher
  authors: [{ name: 'Corpicia', url: siteUrl }],
  creator: 'Corpicia',
  publisher: 'Corpicia',
  
  // Categoría para Google
  category: 'Ecommerce - Jardinería y Paisajismo',
  
  // Canonical base
  alternates: {
    canonical: '/',
  },
  
  // Robots: indexar todo, seguir links, mostrar snippets
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verificación Google Search Console (agregá tu código acá)
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    // yandex: 'tu-codigo',
    // bing: 'tu-codigo',
  },
  
  // Iconos para todos los dispositivos
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  
  // Manifest para PWA
  manifest: '/manifest.json',
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Corpicia | Césped Natural y Jardinería en Paraguay',
    description:
      'Especialistas en césped natural, riego automático y paisajismo. Envíos a todo Paraguay. Solicitá tu presupuesto.',
    type: 'website',
    locale: 'es_PY',
    url: siteUrl,
    siteName: 'Corpicia',
    // IMAGEN OG: Debe ser 1200x630px, máx 8MB
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Corpicia - Césped Natural Premium en Paraguay',
      },
    ],
  },
  
  // Twitter/X Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Corpicia | Césped Natural y Jardinería',
    description: 'Especialistas en césped natural y riego automático en Paraguay.',
    images: ['/og-image.jpg'],
    creator: '@corpicia', // Tu usuario de Twitter si tenés
    site: '@corpicia',
  },
  
  // Archivos RSS o alternativos
  // alternates: {
  //   types: {
  //     'application/rss+xml': `${siteUrl}/rss.xml`,
  //   },
  // },
};

// ============================================
// VIEWPORT (separado en Next.js 14+)
// ============================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Permitir zoom para accesibilidad
  themeColor: '#16a34a', // Color verde de tu marca (barra móvil)
  colorScheme: 'light',
};

// ============================================
// SCHEMAS JSON-LD (Structured Data)
// ============================================

// 1. ORGANIZATION (Marca)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'Corpicia',
  alternateName: 'Corpicia Jardinería',
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/icon-512.png`,
    width: 512,
    height: 512,
  },
  image: `${siteUrl}/og-image.jpg`,
  description:
    'Especialistas en césped natural, riego automático y paisajismo en Paraguay.',
  sameAs: [
    'https://www.facebook.com/corpicia', // Agregá tus redes
    'https://www.instagram.com/corpicia',
    'https://wa.me/595992588770',
    // 'https://www.linkedin.com/company/corpicia',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+595-992-588-770',
    contactType: 'customer service',
    availableLanguage: ['Spanish'],
    areaServed: 'PY',
  },
};

// 2. LOCAL BUSINESS (Google Maps / Local SEO)
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#localbusiness`,
  name: 'Corpicia',
  image: `${siteUrl}/og-image.jpg`,
  url: siteUrl,
  telephone: '+595-992-588-770',
  email: 'corpicia@gmail.com', // Agregá tu email real
  priceRange: '$$',
  currenciesAccepted: 'PYG',
  paymentAccepted: 'Efectivo, Transferencia',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tu calle y número', // COMPLETAR
    addressLocality: 'Asunción',
    addressRegion: 'Central',
    postalCode: '001001',
    addressCountry: 'PY',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-25.2637', // COMPLETAR con tu latitud real
    longitude: '-57.5759', // COMPLETAR con tu longitud real
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00',
    },
  ],
  areaServed: [
    {
      '@type': 'City',
      name: 'Asunción',
    },
    {
      '@type': 'Country',
      name: 'Paraguay',
    },
  ],
};

// 3. WEBSITE (Search Box en Google)
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Corpicia',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/buscar?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'es-PY',
};

// 4. WEBPAGE (Homepage específica)
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/#webpage`,
  url: siteUrl,
  name: 'Corpicia | Césped Natural y Jardinería en Paraguay',
  description:
    'Venta e instalación de césped natural, riego automático y paisajismo en Paraguay.',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
  about: {
    '@id': `${siteUrl}/#organization`,
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${siteUrl}/og-image.jpg`,
  },
  inLanguage: 'es-PY',
};

// ============================================
// COMPONENTE LAYOUT
// ============================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gadsId = process.env.NEXT_PUBLIC_GADS_ID;

  return (
    <html lang="es">
      <body className={inter.className}>
        
        {/* ========================================== */}
        {/* GOOGLE ADS (AW) - Conversión */}
        {/* ========================================== */}
        {gadsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gadsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gadsId}');
              `}
            </Script>
          </>
        )}

        {/* ========================================== */}
        {/* GOOGLE ANALYTICS 4 */}
        {/* ========================================== */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-script" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  send_page_view: true,
                  allow_google_signals: true,
                  allow_ad_personalization_signals: true,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `}
            </Script>
          </>
        )}

        {/* ========================================== */}
        {/* GOOGLE MERCHANT TAG */}
        {/* ========================================== */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GT-MJBJH7FQ"
          strategy="afterInteractive"
        />
        <Script id="google-merchant-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'GT-MJBJH7FQ');
          `}
        </Script>

        {/* ========================================== */}
        {/* GOOGLE TAG MANAGER */}
        {/* ========================================== */}
        {gtmId && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}

        {/* ========================================== */}
        {/* SCHEMAS JSON-LD (Structured Data) */}
        {/* ========================================== */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(organizationSchema)}
        </Script>

        <Script
          id="schema-localbusiness"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(localBusinessSchema)}
        </Script>

        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(websiteSchema)}
        </Script>

        <Script
          id="schema-webpage"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(webPageSchema)}
        </Script>

        {/* ========================================== */}
        {/* UI COMPONENTS */}
        {/* ========================================== */}
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
        <BudgetDrawer />
      </body>
    </html>
  );
}
