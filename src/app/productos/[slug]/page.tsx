import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { productsData, productsCatalog } from './productsData';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

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

  return <ProductDetailClient slug={params.slug} />;
}
