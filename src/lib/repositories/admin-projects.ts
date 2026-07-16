import { supabaseAdmin } from '../supabase/admin';

export async function getAdminProjects() {
  const { data, error } = await (supabaseAdmin as any)
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin projects:', error);
    return [];
  }

  return data || [];
}

export async function getAdminProject(id: string) {
  const { data, error } = await (supabaseAdmin as any)
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin project:', error);
    return null;
  }

  return data;
}

export async function createAdminProject(projectData: any) {
  const { data, error } = await (supabaseAdmin as any)
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data;
}

export async function updateAdminProject(id: string, projectData: any) {
  const { data, error } = await (supabaseAdmin as any)
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
}

export async function deleteAdminProject(id: string) {
  const { error } = await (supabaseAdmin as any)
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }

  return true;
}

export async function toggleAdminProjectStatus(id: string, currentStatus: boolean) {
  const { data, error } = await (supabaseAdmin as any)
    .from('projects')
    .update({ is_active: !currentStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling project status:', error);
    throw error;
  }

  return data;
}
