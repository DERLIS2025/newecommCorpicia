import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloatingButton } from '@/components/WhatsAppButton';
import { BudgetDrawer } from '@/components/BudgetDrawer';

const inter = Inter({ subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://corpicia.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Corpicia - Césped Natural y Jardinería en Paraguay',
    template: '%s | Corpicia',
  },
  description: 'Especialistas en césped natural, instalación y mantenimiento de jardines en Paraguay. Solicita tu presupuesto por WhatsApp.',
  keywords: 'césped, jardinería, Paraguay, Asunción, césped natural, paisajismo',
  authors: [{ name: 'Corpicia' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Corpicia - Césped Natural y Jardinería',
    description: 'Especialistas en césped natural en Paraguay',
    type: 'website',
    locale: 'es_PY',
    url: siteUrl,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Corpicia',
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+595992588770',
    contactType: 'customer service',
    areaServed: 'PY',
    availableLanguage: ['es'],
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Corpicia',
  image: `${siteUrl}/icon.png`,
  url: siteUrl,
  telephone: '+595992588770',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Asunción',
    addressCountry: 'PY',
  },
  areaServed: ['Paraguay', 'Asunción'],
  priceRange: '$$',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="es">
      <body className={inter.className}>
        {gaId && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <Script id="ga4-script" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        )}

        {gtmId && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}

        <Script id="org-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(organizationSchema)}
        </Script>
        <Script id="local-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(localBusinessSchema)}
        </Script>

        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
        <BudgetDrawer />
      </body>
    </html>
  );
}
