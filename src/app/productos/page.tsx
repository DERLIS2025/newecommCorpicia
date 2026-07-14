import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { getProducts } from '@/lib/repositories/products';
import { getCategories } from '@/lib/repositories/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Productos de césped y jardinería en Paraguay | Corpicia',
  description:
    'Catálogo de productos Corpicia: césped natural, riego, pisos, decorativos y servicios de jardinería en Asunción y todo Paraguay.',
  alternates: {
    canonical: '/productos/',
  },
};

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

  return (
    <ProductsClient
      products={products}
      categories={categories}
      initialQuery={initialQuery}
    />
  );
}