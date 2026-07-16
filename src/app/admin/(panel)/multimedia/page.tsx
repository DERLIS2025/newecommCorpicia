import { getAdminMediaAssets } from '@/lib/repositories/admin-media';
import { MediaGrid } from '@/components/admin/MediaGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminMultimediaPage() {
  const assets = await getAdminMediaAssets();

  return (
    <div className="space-y-6">
      <MediaGrid assets={assets} />
    </div>
  );
}
