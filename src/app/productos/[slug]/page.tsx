import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ProductDetailClient from './ProductDetailClient';
import { productsData, productsCatalog } from './productsData';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

const siteUrl = 'https://corpicia.com';

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
      description: 'El producto solicitado no existe.',
    };
  }

  return {
    title: `${product.name} | Corpicia`,
    description: product.shortDescription || product.description,
    alternates: {
      canonical: `/productos/${product.slug}/`,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = productsData[params.slug];

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
      <Script
        id={`product-schema-${params.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(productSchema)}
      </Script>
      <ProductDetailClient slug={params.slug} />
    </>
  );
}