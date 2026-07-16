'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const ADMIN_WRITES_ENABLED = process.env.ADMIN_WRITES_ENABLED === 'true';

export type ActionState = {
  success: boolean;
  message: string;
};

export async function createBanner(prevState: any, formData: FormData): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, message: 'La escritura de datos está deshabilitada en este entorno.' };
  }

  if (!supabaseAdmin) {
    return { success: false, message: 'Servicio Supabase no configurado.' };
  }

  try {
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const image_desktop = formData.get('image_desktop') as string;
    const image_mobile = formData.get('image_mobile') as string;
    const cta_text = formData.get('cta_text') as string;
    const cta_link = formData.get('cta_link') as string;
    const order_index = parseInt(formData.get('order_index') as string) || 0;
    const is_active = formData.get('is_active') === 'true';

    if (!image_desktop) {
      return { success: false, message: 'La imagen desktop es obligatoria.' };
    }
    
    if (type !== 'hero' && type !== 'secondary') {
      return { success: false, message: 'El tipo de banner es inválido.' };
    }

    const { error } = await supabaseAdmin.from('banners').insert({
      type,
      title: title || null,
      subtitle: subtitle || null,
      image_desktop,
      image_mobile: image_mobile || null,
      cta_text: cta_text || null,
      cta_link: cta_link || null,
      order_index,
      is_active,
    });

    if (error) {
      console.error('Error creating banner:', error);
      return { success: false, message: 'Error al crear el banner en la base de datos.' };
    }

    revalidatePath('/admin/banners');
    revalidatePath('/');
    
    return { success: true, message: 'Banner creado exitosamente.' };
  } catch (error) {
    console.error('Exception creating banner:', error);
    return { success: false, message: 'Error inesperado al crear el banner.' };
  }
}

export async function updateBanner(prevState: any, formData: FormData): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, message: 'La escritura de datos está deshabilitada.' };
  }

  if (!supabaseAdmin) {
    return { success: false, message: 'Servicio no configurado.' };
  }

  try {
    const id = formData.get('id') as string;
    if (!id) return { success: false, message: 'Falta el ID del banner.' };

    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const image_desktop = formData.get('image_desktop') as string;
    const image_mobile = formData.get('image_mobile') as string;
    const cta_text = formData.get('cta_text') as string;
    const cta_link = formData.get('cta_link') as string;
    const order_index = parseInt(formData.get('order_index') as string) || 0;
    const is_active = formData.get('is_active') === 'true';

    if (!image_desktop) {
      return { success: false, message: 'La imagen desktop es obligatoria.' };
    }
    
    if (type !== 'hero' && type !== 'secondary') {
      return { success: false, message: 'El tipo de banner es inválido.' };
    }

    const { error } = await supabaseAdmin
      .from('banners')
      .update({
        type,
        title: title || null,
        subtitle: subtitle || null,
        image_desktop,
        image_mobile: image_mobile || null,
        cta_text: cta_text || null,
        cta_link: cta_link || null,
        order_index,
        is_active,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating banner:', error);
      return { success: false, message: 'Error al actualizar el banner.' };
    }

    revalidatePath('/admin/banners');
    revalidatePath('/');
    
    return { success: true, message: 'Banner actualizado exitosamente.' };
  } catch (error) {
    console.error('Exception updating banner:', error);
    return { success: false, message: 'Error inesperado al actualizar el banner.' };
  }
}

export async function deleteBanner(id: string): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, message: 'La escritura de datos está deshabilitada.' };
  }

  if (!supabaseAdmin) {
    return { success: false, message: 'Servicio no configurado.' };
  }

  try {
    const { error } = await supabaseAdmin.from('banners').delete().eq('id', id);

    if (error) {
      console.error('Error deleting banner:', error);
      return { success: false, message: 'Error al eliminar el banner.' };
    }

    revalidatePath('/admin/banners');
    revalidatePath('/');
    
    return { success: true, message: 'Banner eliminado exitosamente.' };
  } catch (error) {
    console.error('Exception deleting banner:', error);
    return { success: false, message: 'Error inesperado al eliminar el banner.' };
  }
}

export async function toggleBannerStatus(id: string, currentStatus: boolean): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, message: 'La escritura de datos está deshabilitada.' };
  }

  if (!supabaseAdmin) {
    return { success: false, message: 'Servicio no configurado.' };
  }

  try {
    const { error } = await supabaseAdmin
      .from('banners')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error toggling banner status:', error);
      return { success: false, message: 'Error al cambiar estado del banner.' };
    }

    revalidatePath('/admin/banners');
    revalidatePath('/');
    
    return { success: true, message: 'Estado del banner actualizado.' };
  } catch (error) {
    console.error('Exception toggling banner status:', error);
    return { success: false, message: 'Error inesperado al cambiar estado del banner.' };
  }
}
