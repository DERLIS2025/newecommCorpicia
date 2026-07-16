'use server';

import { revalidatePath } from 'next/cache';
import { 
  createAdminService, 
  updateAdminService, 
  deleteAdminService, 
  toggleAdminServiceStatus 
} from '../repositories/admin-services';

const ADMIN_WRITES_ENABLED = process.env.ADMIN_WRITES_ENABLED === 'true';

export async function createServiceAction(formData: FormData) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La creación de servicios está deshabilitada en este entorno.' };
  }

  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);
    const is_active = formData.get('is_active') === 'true';

    if (!title || !slug) {
      return { success: false, error: 'El título y el slug son obligatorios.' };
    }

    const serviceData = {
      title,
      slug,
      description,
      image_url,
      order_index,
      is_active,
    };

    await createAdminService(serviceData);
    revalidatePath('/admin/servicios');
    revalidatePath('/servicios');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al crear el servicio' };
  }
}

export async function updateServiceAction(id: string, formData: FormData) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La edición de servicios está deshabilitada en este entorno.' };
  }

  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);
    const is_active = formData.get('is_active') === 'true';

    if (!title || !slug) {
      return { success: false, error: 'El título y el slug son obligatorios.' };
    }

    const serviceData = {
      title,
      slug,
      description,
      image_url,
      order_index,
      is_active,
    };

    await updateAdminService(id, serviceData);
    revalidatePath('/admin/servicios');
    revalidatePath('/servicios');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar el servicio' };
  }
}

export async function deleteServiceAction(id: string) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La eliminación de servicios está deshabilitada en este entorno.' };
  }

  try {
    await deleteAdminService(id);
    revalidatePath('/admin/servicios');
    revalidatePath('/servicios');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar el servicio' };
  }
}

export async function toggleServiceStatusAction(id: string, currentStatus: boolean) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La edición de servicios está deshabilitada en este entorno.' };
  }

  try {
    await toggleAdminServiceStatus(id, currentStatus);
    revalidatePath('/admin/servicios');
    revalidatePath('/servicios');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al cambiar el estado' };
  }
}
