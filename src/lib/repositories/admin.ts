import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Gets all categories from Supabase (including inactive ones), bypassing static fallback.
 * Uses the authenticated user client with RLS.
 */
export async function getAdminCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_index');

  if (error) {
    console.error('Error fetching admin categories:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Gets all products from Supabase (including inactive ones), bypassing static fallback and RLS.
 * Uses the service role client.
 */
export async function getAdminProducts() {
  if (!supabaseAdmin) {
    console.error('No admin client configured. Check SUPABASE_SERVICE_ROLE_KEY.');
    return [];
  }
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, categories(name, slug), product_images(image_url, order_index)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin products:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Gets a single product fully hydrated with relations for the edit form.
 * Uses the service role client.
 */
export async function getAdminProduct(id: string) {
  if (!supabaseAdmin) {
    console.error('No admin client configured. Check SUPABASE_SERVICE_ROLE_KEY.');
    return null;
  }
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, product_price_tiers(*), product_images(*), product_features(*), product_specifications(*), product_recommendations(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin product:', error.message);
    return null;
  }
  return data;
}
