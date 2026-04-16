import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ProductDetailClient from './ProductDetailClient';
import { productsData } from './productsData';

type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return Object.keys(productsData).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ProductDetailPageProps): Metadata {
  const product = productsData[params.slug];

  if (!product) {
    return {
      title: 'Producto no encontrado | Corpicia',
      description: 'El producto solicitado no está disponible en el catálogo de Corpicia.',
      alternates: { canonical: `/productos/${params.slug}/` },
    };
  }

  return {
    title: `${product.name} en Paraguay | Corpicia`,
    description: `${product.shortDescription || product.description} Comprá en Corpicia con cobertura en Asunción y todo Paraguay.`,
    alternates: {
      canonical: `/productos/${product.slug}/`,
    },
    openGraph: {
      title: `${product.name} | Corpicia`,
      description: product.shortDescription || product.description,
      type: 'website',
      locale: 'es_PY',
      url: `/productos/${product.slug}/`,
    },
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = productsData[params.slug];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://corpicia.com';

  if (!product) {
    notFound();
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    sku: product.id,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Corpicia',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PYG',
      price: product.pricePerM2,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/productos/${product.slug}/`,
    },
  };

  return (
    <>
      <Script id={`product-schema-${params.slug}`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(productSchema)}
      </Script>
      <ProductDetailClient slug={params.slug} />
    </>
  );
}
