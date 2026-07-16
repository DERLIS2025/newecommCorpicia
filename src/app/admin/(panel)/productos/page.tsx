import { getAdminProducts } from '@/lib/repositories/admin';
import ProductsTable from '@/components/admin/ProductsTable';
import { ConnectionNotice } from '@/components/admin/ConnectionNotice';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductosPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <ConnectionNotice />
      <ProductsTable products={products} />
    </div>
  );
}
