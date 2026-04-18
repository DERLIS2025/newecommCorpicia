import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { productCategories, productsCatalog } from './[slug]/productsData';

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

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const initialQuery = typeof searchParams?.q === 'string' ? searchParams.q : '';

  return (
    <ProductsClient
      products={productsCatalog}
      categories={productCategories}
      initialQuery={initialQuery}
    />
  );
}