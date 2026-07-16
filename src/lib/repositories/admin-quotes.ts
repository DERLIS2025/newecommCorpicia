import { supabaseAdmin } from '@/lib/supabase/admin';

export async function getAdminQuotes() {
  if (!supabaseAdmin) return [];
  
  const { data, error } = await (supabaseAdmin as any)
    .from('quotes')
    .select('*, clients(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin quotes:', error.message);
    return [];
  }
  return data || [];
}

export async function getAdminQuote(id: string) {
  if (!supabaseAdmin) return null;
  
  const { data, error } = await (supabaseAdmin as any)
    .from('quotes')
    .select('*, clients(*), quote_items(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin quote detail:', error.message);
    return null;
  }
  return data;
}
