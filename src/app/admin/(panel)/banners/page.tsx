import { getAdminBanners } from '@/lib/repositories/admin-banners';
import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { BannerListClient } from '@/components/admin/BannerListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div className="space-y-6">
      <ConnectionNotice />
      <BannerListClient banners={banners} />
    </div>
  );
}
