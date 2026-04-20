import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ProductDetailClient from './ProductDetailClient';
import { productsData, productsCatalog } from './productsData';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpicia.com';

export async function generateStaticParams() {
  return productsCatalog.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = productsData[params.slug];

  if (!product) {
    return {
      title: 'Producto no encontrado | Corpicia',
      description: 'El producto solicitado no existe en nuestro catálogo.',
      robots: { index: false, follow: true },
    };
  }

  const productUrl = `${siteUrl}/productos/${product.slug}/`;
  
  // ✅ CORREGIDO: product.images[0] en vez de product.image
  const productImage = product.images && product.images.length > 0
    ? `${siteUrl}${product.images[0]}`
    : `${siteUrl}/og-image.jpg`;

  return {
    title: `${product.name} - ${product.category} | Corpicia Paraguay`,
    description: product.shortDescription 
      ? `${product.shortDescription}. Precio: Gs. ${product.pricePerM2?.toLocaleString('es-PY')} por ${product.unit}. Envíos a todo Paraguay.`
      : `${product.description?.substring(0, 120)}... Precio: Gs. ${product.pricePerM2?.toLocaleString('es-PY')} por ${product.unit}.`,
    keywords: [
      product.name,
      product.category,
      'césped natural Paraguay',
      'jardinería Asunción',
      'riego automático',
      'paisajismo',
      'comprar césped',
      product.slug.replace(/-/g, ' '),
    ],
    alternates: {
      canonical: `/productos/${product.slug}/`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${product.name} | Corpicia`,
      description: product.shortDescription || product.description,
      type: 'website',
      locale: 'es_PY',
      url: productUrl,
      siteName: 'Corpicia',
      images: [
        {
          url: productImage,
          width: 800,
          height: 800,
          alt: `${product.name} - Corpicia Paraguay`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Corpicia`,
      description: product.shortDescription || product.description,
      images: [productImage],
    },
    category: product.category,
  };
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = productsData[params.slug];

  if (!product) {
    notFound();
  }

  const productUrl = `${siteUrl}/productos/${product.slug}/`;
  
  // ✅ CORREGIDO: product.images[0] en vez de product.image
  const productImage = product.images && product.images.length > 0
    ? `${siteUrl}${product.images[0]}`
    : `${siteUrl}/og-image.jpg`;
  
  const priceFormatted = product.pricePerM2?.toString() || '0';
  
  const priceValidUntil = new Date();
  priceValidUntil.setMonth(priceValidUntil.getMonth() + 6);
  const priceValidUntilStr = priceValidUntil.toISOString().split('T')[0];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    // ✅ CORREGIDO: product.images (array completo)
    image: product.images && product.images.length > 0
      ? product.images.map(img => `${siteUrl}${img}`)
      : [`${siteUrl}/og-image.jpg`],
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Corpicia',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'PYG',
      price: priceFormatted,
      priceValidUntil: priceValidUntilStr,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Corpicia',
        url: siteUrl,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'PYG',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'PY',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '1',
            maxValue: '2',
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '1',
            maxValue: '3',
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Productos',
        item: `${siteUrl}/productos/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category,
        item: `${siteUrl}/productos/?categoria=${encodeURIComponent(product.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Cuánto cuesta el ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `El ${product.name} tiene un precio de Gs. ${product.pricePerM2?.toLocaleString('es-PY')} por ${product.unit}. Ofrecemos descuentos por volumen para proyectos grandes.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Hacen envíos de ${product.name} a todo Paraguay?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, realizamos envíos a todo el territorio paraguayo. El tiempo de entrega varía entre 1 y 3 días hábiles dependiendo de la ubicación.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo se realiza la instalación del césped?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ofrecemos servicio de instalación profesional o podés instalarlo siguiendo nuestra guía. El césped se entrega en rollos listos para colocar.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué mantenimiento requiere el césped natural?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El césped natural requiere riego regular, corte periódico y fertilización cada 3 meses. Te asesoramos gratuitamente sobre el mantenimiento.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id={`product-schema-${params.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(productSchema)}
      </Script>

      <Script
        id={`breadcrumb-schema-${params.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <Script
        id={`faq-schema-${params.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(faqSchema)}
      </Script>

      <ProductDetailClient slug={params.slug} />
    </>
  );
}
