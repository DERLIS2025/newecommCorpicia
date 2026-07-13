import { supabase } from '../supabase';
import { productCategories } from '@/data/productsData';

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'supabase';

function logFallback(reason: string) {
  console.info(`[Repository: Categories] Using static fallback. Reason: ${reason}`);
}

export async function getCategories() {
  if (DATA_SOURCE === 'static') {
    logFallback('NEXT_PUBLIC_DATA_SOURCE is set to static');
    return productCategories;
  }

  if (!supabase) {
    logFallback('Supabase client is not configured');
    return productCategories;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (error) {
      logFallback('Supabase query error');
      return productCategories;
    }

    return data;
  } catch (err) {
    logFallback('Unexpected exception during fetch');
    return productCategories;
  }
}
