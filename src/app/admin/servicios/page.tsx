import { getAdminServices } from '@/lib/repositories/admin-services';
import { ServicesTable } from '@/components/admin/ServicesTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminServiciosPage() {
  const services = await getAdminServices();

  return (
    <div className="space-y-6">
      <ServicesTable services={services} />
    </div>
  );
}
