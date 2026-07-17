import ProductBulkImport from '@/components/admin/ProductBulkImport';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ImportarProductosPage() {
  return <ProductBulkImport />;
}
