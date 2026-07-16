import { supabaseAdmin } from '../supabase/admin';

export async function getAdminMediaAssets() {
  const { data, error } = await (supabaseAdmin as any)
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin media assets:', error);
    return [];
  }

  return data || [];
}

export async function getAdminMediaAsset(id: string) {
  const { data, error } = await (supabaseAdmin as any)
    .from('media_assets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin media asset:', error);
    return null;
  }

  return data;
}

export async function createAdminMediaAsset(assetData: any) {
  const { data, error } = await (supabaseAdmin as any)
    .from('media_assets')
    .insert([assetData])
    .select()
    .single();

  if (error) {
    console.error('Error creating media asset:', error);
    throw error;
  }

  return data;
}

export async function updateAdminMediaAsset(id: string, assetData: any) {
  const { data, error } = await (supabaseAdmin as any)
    .from('media_assets')
    .update(assetData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating media asset:', error);
    throw error;
  }

  return data;
}

export async function deleteAdminMediaAsset(id: string) {
  const { error } = await (supabaseAdmin as any)
    .from('media_assets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting media asset:', error);
    throw error;
  }

  return true;
}
