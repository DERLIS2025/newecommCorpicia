'use server';

import { revalidatePath } from 'next/cache';
import { 
  createAdminProject, 
  updateAdminProject, 
  deleteAdminProject, 
  toggleAdminProjectStatus 
} from '../repositories/admin-projects';

const ADMIN_WRITES_ENABLED = process.env.ADMIN_WRITES_ENABLED === 'true';

export async function createProjectAction(formData: FormData) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La creación de proyectos está deshabilitada en este entorno.' };
  }

  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;
    const project_date_raw = formData.get('project_date') as string;
    const is_active = formData.get('is_active') === 'true';

    if (!title || !slug) {
      return { success: false, error: 'El título y el slug son obligatorios.' };
    }

    const projectData = {
      title,
      slug,
      category,
      location,
      description,
      image_url,
      project_date: project_date_raw ? new Date(project_date_raw).toISOString() : null,
      is_active,
    };

    await createAdminProject(projectData);
    revalidatePath('/admin/proyectos');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al crear el proyecto' };
  }
}

export async function updateProjectAction(id: string, formData: FormData) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La edición de proyectos está deshabilitada en este entorno.' };
  }

  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;
    const project_date_raw = formData.get('project_date') as string;
    const is_active = formData.get('is_active') === 'true';

    if (!title || !slug) {
      return { success: false, error: 'El título y el slug son obligatorios.' };
    }

    const projectData = {
      title,
      slug,
      category,
      location,
      description,
      image_url,
      project_date: project_date_raw ? new Date(project_date_raw).toISOString() : null,
      is_active,
    };

    await updateAdminProject(id, projectData);
    revalidatePath('/admin/proyectos');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar el proyecto' };
  }
}

export async function deleteProjectAction(id: string) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La eliminación de proyectos está deshabilitada en este entorno.' };
  }

  try {
    await deleteAdminProject(id);
    revalidatePath('/admin/proyectos');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar el proyecto' };
  }
}

export async function toggleProjectStatusAction(id: string, currentStatus: boolean) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La edición de proyectos está deshabilitada en este entorno.' };
  }

  try {
    await toggleAdminProjectStatus(id, currentStatus);
    revalidatePath('/admin/proyectos');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al cambiar el estado' };
  }
}
