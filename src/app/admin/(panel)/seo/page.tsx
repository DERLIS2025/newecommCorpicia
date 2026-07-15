import { getAdminSeoEntries } from '@/lib/repositories/admin-seo';
import { SeoTable } from '@/components/admin/SeoTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSeoPage() {
  const entries = await getAdminSeoEntries();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SEO & Analytics</h1>
        <p className="text-gray-500">Gestioná los títulos, descripciones e imágenes SEO de las páginas principales.</p>
      </div>

      <SeoTable existingEntries={entries} />
    </div>
  );
}
