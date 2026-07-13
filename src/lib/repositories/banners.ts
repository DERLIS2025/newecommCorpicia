import { supabase } from '../supabase';
import { homeHeroBanners, homeMiddleBanners } from '@/data/banners';

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'supabase';

function logFallback(reason: string) {
  console.info(`[Repository: Banners] Using static fallback. Reason: ${reason}`);
}

export async function getBanners(type?: 'hero' | 'secondary') {
  if (DATA_SOURCE === 'static') {
    logFallback('NEXT_PUBLIC_DATA_SOURCE is set to static');
    return {
      hero: homeHeroBanners,
      secondary: homeMiddleBanners
    };
  }

  if (!supabase) {
    logFallback('Supabase client is not configured');
    return {
      hero: homeHeroBanners,
      secondary: homeMiddleBanners
    };
  }

  try {
    let query = supabase.from('banners').select('*').eq('is_active', true).order('order_index');
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await query;

    if (error) {
      logFallback('Supabase query error');
      return {
        hero: homeHeroBanners,
        secondary: homeMiddleBanners
      };
    }

    if (type) {
      return data;
    }

    return {
      hero: data.filter(b => b.type === 'hero'),
      secondary: data.filter(b => b.type === 'secondary')
    };
  } catch (err) {
    logFallback('Unexpected exception during fetch');
    return {
      hero: homeHeroBanners,
      secondary: homeMiddleBanners
    };
  }
}
