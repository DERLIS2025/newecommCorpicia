import { supabaseAdmin } from '@/lib/supabase/admin';

export async function getAdminClients() {
  if (!supabaseAdmin) return [];
  
  // We'll also fetch the quote count for each client if possible.
  const { data, error } = await (supabaseAdmin as any)
    .from('clients')
    .select('*, quotes(id, created_at)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin clients:', error.message);
    return [];
  }
  return data || [];
}
