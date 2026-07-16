'use server';

import { revalidatePath } from 'next/cache';
import { upsertAdminSeoEntry } from '../repositories/admin-seo';

const ADMIN_WRITES_ENABLED = process.env.ADMIN_WRITES_ENABLED === 'true';

export async function saveSeoEntryAction(formData: FormData) {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, error: 'La edición de SEO está deshabilitada en este entorno.' };
  }

  try {
    const route = formData.get('route') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const keywords = formData.get('keywords') as string;
    const og_image = formData.get('og_image') as string;
    const is_active = formData.get('is_active') === 'true';

    if (!route || !title || !description) {
      return { success: false, error: 'La ruta, título y descripción son obligatorios.' };
    }

    const assetData = {
      route,
      title,
      description,
      keywords: keywords || null,
      og_image: og_image || null,
      is_active,
    };

    await upsertAdminSeoEntry(assetData);
    
    // Revalidar admin panel y la ruta pública asociada
    revalidatePath('/admin/seo');
    revalidatePath(route);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al guardar la configuración SEO' };
  }
}
