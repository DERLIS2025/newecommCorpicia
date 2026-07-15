import { supabaseAdmin } from '../supabase/admin';

export async function getAdminSeoEntries() {
  const { data, error } = await (supabaseAdmin as any)
    .from('seo_entries')
    .select('*')
    .order('route', { ascending: true });

  if (error) {
    console.error('Error fetching admin seo entries:', error);
    return [];
  }

  return data || [];
}

export async function getAdminSeoEntryByRoute(route: string) {
  const { data, error } = await (supabaseAdmin as any)
    .from('seo_entries')
    .select('*')
    .eq('route', route)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching admin seo entry for route ${route}:`, error);
    return null;
  }

  return data || null;
}

export async function upsertAdminSeoEntry(assetData: any) {
  const { data, error } = await (supabaseAdmin as any)
    .from('seo_entries')
    .upsert(assetData, { onConflict: 'route' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting seo entry:', error);
    throw error;
  }

  return data;
}
