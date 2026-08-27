export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { getProducts } from '@/lib/repositories/products';
import { getCategories } from '@/lib/repositories/categories';

import { getSeoEntry } from '@/lib/repositories/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoEntry('/productos');

  const defaultMeta = {
    title: 'Productos de césped y jardinería en Paraguay | Corpicia',
    description: 'Catálogo de productos Corpicia: césped natural, riego, pisos, decorativos y servicios de jardinería en Asunción y todo Paraguay.',
    alternates: { canonical: '/productos/' },
  };

  if (!seo) return defaultMeta;

  const seoTitle = seo.title || defaultMeta.title;
  const seoDescription = seo.description || defaultMeta.description;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seo.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined,
    alternates: defaultMeta.alternates,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: seo.og_image ? [{ url: seo.og_image }] : undefined,
    },
    twitter: {
      title: seoTitle,
      description: seoDescription,
      images: seo.og_image ? [seo.og_image] : undefined,
    }
  };
}

type ProductsPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const initialQuery = typeof searchParams?.q === 'string' ? searchParams.q : '';

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  const activeCategoryIds = new Set(
    products
      .map((product: any) => product.categoryId)
      .filter(Boolean)
  );

  const categoriesWithProducts = categories.filter((category: any) =>
    activeCategoryIds.has(category.id)
  );

  return (
    <ProductsClient
      products={products}
      categories={categoriesWithProducts}
      initialQuery={initialQuery}
    />
  );
}