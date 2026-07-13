import { getAdminCategories } from '@/lib/repositories/admin';
import ProductForm from '@/components/admin/ProductForm';

export default async function NuevoProductoPage() {
  const categories = await getAdminCategories();

  return <ProductForm categories={categories} />;
}
