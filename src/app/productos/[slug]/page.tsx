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

// ============================================
// GENERACIÓN DE RUTAS ESTÁTICAS
// ============================================
export async function generateStaticParams() {
  return productsCatalog.map((product) => ({
    slug: product.slug,
  }));
}

// ============================================
// METADATA DINÁMICA POR PRODUCTO
// ============================================
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
  const productImage = product.image 
    ? `${siteUrl}${product.image}` 
    : `${siteUrl}/og-image.jpg`;

  return {
    // Title optimizado: Nombre del producto + marca + categoría
    title: `${product.name} - ${product.category} | Corpicia Paraguay`,
    
    // Description con precio y CTA (máx 160 chars)
    description: product.shortDescription 
      ? `${product.shortDescription}. Precio: Gs. ${product.pricePerM2?.toLocaleString('es-PY')} por m². Envíos a todo Paraguay.`
      : `${product.description?.substring(0, 120)}... Precio: Gs. ${product.pricePerM2?.toLocaleString('es-PY')} por m².`,
    
    // Keywords específicas del producto
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
    
    // Canonical absoluto
    alternates: {
      canonical: `/productos/${product.slug}/`,
    },
    
    // Robots: indexar y seguir
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
    
    // Open Graph para compartir producto (WhatsApp, Facebook)
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
    
    // Twitter/X Cards
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Corpicia`,
      description: product.shortDescription || product.description,
      images: [productImage],
    },
    
    // Category para Google
    category: product.category,
  };
}

// Viewport específico (hereda del layout pero puede sobreescribir)
export const viewport: Viewport = {
  themeColor: '#16a34a',
};

// ============================================
// COMPONENTE PDP
// ============================================
export default function ProductPage({ params }: ProductPageProps) {
  const product = productsData[params.slug];

  if (!product) {
    notFound();
  }

  const productUrl = `${siteUrl}/productos/${product.slug}/`;
  const productImage = product.image ? `${siteUrl}${product.image}` : `${siteUrl}/og-image.jpg`;
  
  // Precio formateado
  const priceFormatted = product.pricePerM2?.toString() || '0';
  
  // Fecha límite de precio (6 meses desde hoy)
  const priceValidUntil = new Date();
  priceValidUntil.setMonth(priceValidUntil.getMonth() + 6);
  const priceValidUntilStr = priceValidUntil.toISOString().split('T')[0];

  // ==========================================
  // SCHEMA.ORG - PRODUCT (Ecommerce completo)
  // ==========================================
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: [
      productImage,
      // Si tenés más imágenes, agregalas acá:
      // `${siteUrl}/productos/${product.slug}/imagen-2.jpg`,
    ],
    sku: product.id,
    mpn: product.mpn || product.id, // Código de fabricante
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Corpicia',
    },
    category: product.category,
    // Reviews/Rating (cuando tengas sistema de reviews)
    // aggregateRating: product.rating ? {
    //   '@type': 'AggregateRating',
    //   ratingValue: product.rating.toString(),
    //   reviewCount: product.reviewsCount?.toString() || '0',
    //   bestRating: '5',
    //   worstRating: '1',
    // } : undefined,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'PYG',
      price: priceFormatted,
      priceValidUntil: priceValidUntilStr,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      // Vendedor
      seller: {
        '@type': 'Organization',
        name: 'Corpicia',
        url: siteUrl,
      },
      // Envío
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
      // Política de devolución
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        // Cuando tengas política de devolución, cambiar a:
        // returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        // merchantReturnDays: 7,
        // returnMethod: 'https://schema.org/ReturnByMail',
        // returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };

  // ==========================================
  // SCHEMA.ORG - BREADCRUMB LIST
  // ==========================================
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

  // ==========================================
  // SCHEMA.ORG - FAQ PAGE (Preguntas frecuentes)
  // ==========================================
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Cuánto cuesta el ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `El ${product.name} tiene un precio de Gs. ${product.pricePerM2?.toLocaleString('es-PY')} por metro cuadrado. Ofrecemos descuentos por volumen para proyectos grandes.`,
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
      {/* SCHEMA: Producto */}
      <Script
        id={`product-schema-${params.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(productSchema)}
      </Script>

      {/* SCHEMA: Breadcrumbs */}
      <Script
        id={`breadcrumb-schema-${params.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      {/* SCHEMA: FAQ */}
      <Script
        id={`faq-schema-${params.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(faqSchema)}
      </Script>

      {/* CLIENT COMPONENT */}
      <ProductDetailClient slug={params.slug} />
    </>
  );
}
