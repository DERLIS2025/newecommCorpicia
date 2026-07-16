import { supabase } from '../supabase';
import { homeHeroBanners, homeSecondaryBanners } from '@/data/banners';

// Remove the DATA_SOURCE block so banners always try to read from Supabase first
// This allows the public home page to see banner updates without breaking product catalog which relies on DATA_SOURCE.

function logFallback(reason: string) {
  console.info(`[Repository: Banners] Using static fallback. Reason: ${reason}`);
}

export async function getBanners(type?: 'hero' | 'secondary') {
  if (!supabase) {
    logFallback('Supabase client is not configured');
    return {
      hero: homeHeroBanners,
      secondary: homeSecondaryBanners
    };
  }

  try {
    let query = supabase.from('banners').select('*').eq('is_active', true).order('order_index');
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await query;

    if (error) {
      logFallback('Supabase query error: ' + error.message);
      return {
        hero: homeHeroBanners,
        secondary: homeSecondaryBanners
      };
    }

    // If Supabase returned absolutely nothing, fallback to static so the site doesn't look empty
    if (!data || data.length === 0) {
      logFallback('Supabase returned empty array, falling back to static');
      return {
        hero: homeHeroBanners,
        secondary: homeSecondaryBanners
      };
    }

    if (type) {
      return data;
    }

    return {
      hero: data.filter(b => b.type === 'hero'),
      secondary: data.filter(b => b.type === 'secondary')
    };
  } catch (err: any) {
    logFallback('Unexpected exception during fetch: ' + err.message);
    return {
      hero: homeHeroBanners,
      secondary: homeSecondaryBanners
    };
  }
}
