import { supabase } from '../supabase/client';

export async function getSeoEntry(route: string) {
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
