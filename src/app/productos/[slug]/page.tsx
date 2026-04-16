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

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetailClient slug={params.slug} />;
}
