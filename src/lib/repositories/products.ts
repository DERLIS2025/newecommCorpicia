import { supabase } from '../supabase';
import { productsCatalog, ProductDetail } from '@/data/productsData';

// Fallback configuration
const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'supabase';

function logFallback(reason: string) {
  // Silent log to prevent exposing sensitive errors to the client
  console.info(`[Repository: Products] Using static fallback. Reason: ${reason}`);
}

export async function getProducts() {
  if (DATA_SOURCE === 'static') {
    logFallback('NEXT_PUBLIC_DATA_SOURCE is set to static');
    return productsCatalog;
  }

  if (!supabase) {
    logFallback('Supabase client is not configured');
    return productsCatalog;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      logFallback('Supabase query error');
      return productsCatalog;
    }

    // A valid empty array should remain empty
    return data;
  } catch (err) {
    logFallback('Unexpected exception during fetch');
    return productsCatalog;
  }
}
