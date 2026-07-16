import { getAdminProduct, getAdminCategories } from '@/lib/repositories/admin';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getAdminProduct(params.id),
    getAdminCategories()
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} categories={categories} />;
}
