import { supabaseAdmin } from '@/lib/supabase/admin';

export async function getAdminBanners() {
  if (!supabaseAdmin) return [];
  
  const { data, error } = await supabaseAdmin
    .from('banners')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin banners:', error.message);
    return [];
  }
  return data || [];
}
