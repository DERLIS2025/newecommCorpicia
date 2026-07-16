'use server';

import { revalidatePath } from 'next/cache';
import { 
  createAdminMediaAsset, 
  updateAdminMediaAsset, 
  deleteAdminMediaAsset
} from '../repositories/admin-media';

const ADMIN_WRITES_ENABLED = process.env.ADMIN_WRITES_ENABLED === 'true';

export async function createMediaAssetAction(formData: FormData) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La creación de multimedia está deshabilitada en este entorno.' };
  }

  try {
    const file_name = formData.get('file_name') as string;
    const url = formData.get('url') as string;
    const alt_text = formData.get('alt_text') as string;
    const file_type = formData.get('file_type') as string || 'image';

    if (!file_name || !url) {
      return { success: false, error: 'El título y la URL son obligatorios.' };
    }

    const assetData = {
      file_name,
      url,
      alt_text,
      file_type,
      file_size_bytes: 0,
      dimensions: ''
    };

    await createAdminMediaAsset(assetData);
    revalidatePath('/admin/multimedia');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al crear el recurso multimedia' };
  }
}

export async function updateMediaAssetAction(id: string, formData: FormData) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La edición de multimedia está deshabilitada en este entorno.' };
  }

  try {
    const file_name = formData.get('file_name') as string;
    const url = formData.get('url') as string;
    const alt_text = formData.get('alt_text') as string;
    const file_type = formData.get('file_type') as string || 'image';

    if (!file_name || !url) {
      return { success: false, error: 'El título y la URL son obligatorios.' };
    }

    const assetData = {
      file_name,
      url,
      alt_text,
      file_type,
    };

    await updateAdminMediaAsset(id, assetData);
    revalidatePath('/admin/multimedia');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar el recurso multimedia' };
  }
}

export async function deleteMediaAssetAction(id: string) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La eliminación de multimedia está deshabilitada en este entorno.' };
  }

  try {
    await deleteAdminMediaAsset(id);
    revalidatePath('/admin/multimedia');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar el recurso multimedia' };
  }
}
