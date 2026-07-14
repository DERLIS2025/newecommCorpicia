import { supabaseAdmin } from '../supabase/admin';

export async function getAdminServices() {
  const { data, error } = await (supabaseAdmin as any)
    .from('services')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin services:', error);
    return [];
  }

  return data || [];
}

export async function getAdminService(id: string) {
  const { data, error } = await (supabaseAdmin as any)
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin service:', error);
    return null;
  }

  return data;
}

export async function createAdminService(serviceData: any) {
  const { data, error } = await (supabaseAdmin as any)
    .from('services')
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }

  return data;
}

export async function updateAdminService(id: string, serviceData: any) {
  const { data, error } = await (supabaseAdmin as any)
    .from('services')
    .update(serviceData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }

  return data;
}

export async function deleteAdminService(id: string) {
  const { error } = await (supabaseAdmin as any)
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }

  return true;
}

export async function toggleAdminServiceStatus(id: string, currentStatus: boolean) {
  const { data, error } = await (supabaseAdmin as any)
    .from('services')
    .update({ is_active: !currentStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling service status:', error);
    throw error;
  }

  return data;
}
