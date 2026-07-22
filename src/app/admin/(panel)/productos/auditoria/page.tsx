import ProductAuditDashboard from '@/components/admin/ProductAuditDashboard';
import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { getProductAuditData } from '@/lib/repositories/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductAuditPage() {
  const products = await getProductAuditData();

  return (
    <div className="space-y-6">
      <ConnectionNotice />
      <ProductAuditDashboard products={products} />
    </div>
  );
}
