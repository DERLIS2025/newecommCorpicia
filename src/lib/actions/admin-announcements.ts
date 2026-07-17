'use server';

import { supabaseAdmin, assertAdminWritesEnabled } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { topBarItemSchema, popupSettingsSchema } from '@/lib/validation/announcement';
import type { TopBarItem, PopupSettings } from '@/types/announcement';
import { createClient } from '@/lib/supabase/server';

const ADMIN_WRITES_ENABLED = process.env.ADMIN_WRITES_ENABLED === 'true';

async function checkAdminAuth(): Promise<ActionState | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: 'No estás autenticado.' };
  }
  
  const { data: profile, error } = await supabase
    .from('admin_profiles')
    .select('user_id, is_active, role')
    .eq('user_id', user.id)
    .maybeSingle();
    
  if (error || !profile || profile.is_active !== true) {
    return { success: false, message: 'No tenés permisos de administrador activo.' };
  }
  
  return null;
}

export type ActionState = {
  success: boolean;
  message: string;
};

// ==========================================
// TOP BAR ACTIONS
// ==========================================

export async function createTopBarItem(prevState: any, formData: FormData): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) {
    return { success: false, message: 'La escritura de datos está deshabilitada en este entorno.' };
  }
  if (!supabaseAdmin) {
    return { success: false, message: 'Servicio Supabase no configurado.' };
  }

  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    assertAdminWritesEnabled();
    
    const parsed = topBarItemSchema.safeParse({
      text: formData.get('text'),
      emoji: formData.get('emoji') || null,
      url: formData.get('url') || null,
      buttonText: formData.get('buttonText') || null,
      order: parseInt(formData.get('order') as string) || 0,
      enabled: formData.get('enabled') === 'true',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    const dbPayload = {
      text: data.text,
      emoji: data.emoji,
      url: data.url,
      button_text: data.buttonText,
      order_index: data.order,
      is_active: data.enabled,
    };

    const { error } = await supabaseAdmin.from('top_bar_items').insert(dbPayload);

    if (error) {
      console.error('Error creating top bar item:', error);
      return { success: false, message: 'Error al crear el mensaje.' };
    }

    revalidatePath('/admin/announcements');
    revalidatePath('/');
    
    return { success: true, message: 'Mensaje creado exitosamente.' };
  } catch (error) {
    console.error('Exception creating top bar item:', error);
    return { success: false, message: 'Error inesperado al crear el mensaje.' };
  }
}

export async function updateTopBarItem(prevState: any, formData: FormData): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) return { success: false, message: 'Escritura deshabilitada.' };
  if (!supabaseAdmin) return { success: false, message: 'Servicio no configurado.' };

  try {
    assertAdminWritesEnabled();
    
    const id = formData.get('id') as string;
    if (!id) return { success: false, message: 'Falta el ID del mensaje.' };

    const parsed = topBarItemSchema.safeParse({
      id,
      text: formData.get('text'),
      emoji: formData.get('emoji') || null,
      url: formData.get('url') || null,
      buttonText: formData.get('buttonText') || null,
      order: parseInt(formData.get('order') as string) || 0,
      enabled: formData.get('enabled') === 'true',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    const dbPayload = {
      text: data.text,
      emoji: data.emoji,
      url: data.url,
      button_text: data.buttonText,
      order_index: data.order,
      is_active: data.enabled,
    };

    const { error } = await supabaseAdmin.from('top_bar_items').update(dbPayload).eq('id', id);

    if (error) {
      console.error('Error updating top bar item:', error);
      return { success: false, message: 'Error al actualizar el mensaje.' };
    }

    revalidatePath('/admin/announcements');
    revalidatePath('/');
    
    return { success: true, message: 'Mensaje actualizado exitosamente.' };
  } catch (error) {
    console.error('Exception updating top bar item:', error);
    return { success: false, message: 'Error inesperado.' };
  }
}

export async function deleteTopBarItem(id: string): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) return { success: false, message: 'Escritura deshabilitada.' };
  if (!supabaseAdmin) return { success: false, message: 'Servicio no configurado.' };

  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    assertAdminWritesEnabled();
    const { error } = await supabaseAdmin.from('top_bar_items').delete().eq('id', id);
    if (error) {
      console.error('Error deleting top bar item:', error);
      return { success: false, message: 'Error al eliminar el mensaje.' };
    }
    revalidatePath('/admin/announcements');
    revalidatePath('/');
    return { success: true, message: 'Mensaje eliminado exitosamente.' };
  } catch (error) {
    console.error('Exception deleting top bar item:', error);
    return { success: false, message: 'Error inesperado.' };
  }
}

export async function reorderTopBarItems(items: Pick<TopBarItem, 'id' | 'order'>[]): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) return { success: false, message: 'Escritura deshabilitada.' };
  if (!supabaseAdmin) return { success: false, message: 'Servicio no configurado.' };

  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    assertAdminWritesEnabled();
    const updates = items.map((it) =>
      supabaseAdmin.from('top_bar_items').update({ order_index: it.order }).eq('id', it.id)
    );
    const results = await Promise.all(updates);
    for (const res of results) {
      if (res.error) throw res.error;
    }
    revalidatePath('/admin/announcements');
    revalidatePath('/');
    return { success: true, message: 'Orden actualizado.' };
  } catch (error) {
    console.error('Exception reordering top bar items:', error);
    return { success: false, message: 'Error al ordenar.' };
  }
}

// ==========================================
// POPUP ACTIONS
// ==========================================

export async function updatePopupSettings(prevState: any, formData: FormData): Promise<ActionState> {
  if (!ADMIN_WRITES_ENABLED) return { success: false, message: 'Escritura deshabilitada.' };
  if (!supabaseAdmin) return { success: false, message: 'Servicio no configurado.' };

  try {
    assertAdminWritesEnabled();

    const startAtStr = formData.get('start_at') as string;
    const endAtStr = formData.get('end_at') as string;

    const parsed = popupSettingsSchema.safeParse({
      id: formData.get('id') || undefined,
      enabled: formData.get('enabled') === 'true',
      image_url: formData.get('image_url') || null,
      title: formData.get('title') || null,
      description: formData.get('description') || null,
      button_text: formData.get('button_text') || null,
      button_url: formData.get('button_url') || null,
      show_after_seconds: parseInt(formData.get('show_after_seconds') as string) || 0,
      frequency_days: parseInt(formData.get('frequency_days') as string) || 0,
      start_at: startAtStr ? new Date(startAtStr).toISOString() : null,
      end_at: endAtStr ? new Date(endAtStr).toISOString() : null,
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    
    // Upsert since there might be only 1 row or none
    const { error } = await supabaseAdmin.from('popup_settings').upsert(data);

    if (error) {
      console.error('Error updating popup settings:', error);
      return { success: false, message: 'Error al actualizar popup.' };
    }

    revalidatePath('/admin/announcements');
    revalidatePath('/');
    
    return { success: true, message: 'Configuración de popup actualizada.' };
  } catch (error) {
    console.error('Exception updating popup settings:', error);
    return { success: false, message: 'Error inesperado.' };
  }
}
