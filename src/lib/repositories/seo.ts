import { supabase } from '../supabase';

export async function getSeoEntry(route: string) {
  if (!supabase) {
    console.warn('[Repository: SEO] Supabase client is not configured, falling back to static metadata.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('seo_entries')
      .select('*')
      .eq('route', route)
      .eq('is_active', true)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching SEO entry for ${route}:`, error);
    return null;
  }
}
