'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';

export type ActionState = {
  success: boolean;
  message: string;
};

type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export async function createCategory(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'No autorizado. Inicie sesión.' };
    }

    if (process.env.ADMIN_WRITES_ENABLED !== 'true') {
      return { success: false, message: 'Las escrituras están deshabilitadas en este entorno.' };
    }

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string | null;
    const image_url = formData.get('image_url') as string | null;
    const order_index = parseInt((formData.get('order_index') as string) || '0', 10);
    const is_active = formData.get('is_active') === 'true';

    if (!name || !slug) {
      return { success: false, message: 'El nombre y el slug son obligatorios' };
    }

    const payload: CategoryInsert = {
      name,
      slug,
      description,
      image_url,
      order_index,
      is_active,
    };

    const categoriesTable = supabaseAdmin.from('categories') as any;
    const { error } = await categoriesTable.insert(payload);

    if (error) {
      if (error.code === '23505') { // unique violation
        return { success: false, message: 'Ya existe una categoría con este slug' };
      }
      throw error;
    }

    revalidatePath('/admin/categorias');
    revalidatePath('/productos');
    return { success: true, message: 'Categoría creada exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al crear la categoría' };
  }
}

export async function updateCategory(
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'No autorizado. Inicie sesión.' };
    }

    if (process.env.ADMIN_WRITES_ENABLED !== 'true') {
      return { success: false, message: 'Las escrituras están deshabilitadas en este entorno.' };
    }

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = (formData.get('description') as string) || null;
    const image_url = (formData.get('image_url') as string) || null;
    const order_index = parseInt(formData.get('order_index') as string) || 0;
    const is_active = formData.get('is_active') === 'true';

    if (!id || !name || !slug) {
      return { success: false, message: 'ID, nombre y slug son obligatorios' };
    }

    const payload: CategoryUpdate = {
      name,
      slug,
      description,
      image_url,
      order_index,
      is_active,
    };

    const categoriesTable = supabaseAdmin.from('categories') as any;
    const { error } = await categoriesTable
      .update(payload)
      .eq('id', id);

    if (error) {
      if (error.code === '23505') {
        return { success: false, message: 'Ya existe una categoría con este slug' };
      }
      throw error;
    }

    revalidatePath('/admin/categorias');
    revalidatePath('/productos');
    return { success: true, message: 'Categoría actualizada exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al actualizar la categoría' };
  }
}

export async function deleteCategory(id: string): Promise<ActionState> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'No autorizado. Inicie sesión.' };
    }

    if (process.env.ADMIN_WRITES_ENABLED !== 'true') {
      return { success: false, message: 'Las escrituras están deshabilitadas en este entorno.' };
    }

    // Check dependencies
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) {
      console.error('Error checking category dependencies:', countError);
      return { success: false, message: 'Error al verificar productos asociados' };
    }

    if (count && count > 0) {
      return { 
        success: false, 
        message: `No se puede eliminar la categoría porque contiene ${count} productos.` 
      };
    }

    const categoriesTable = supabaseAdmin.from('categories') as any;
    const { error } = await categoriesTable.delete().eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/categorias');
    revalidatePath('/productos');
    return { success: true, message: 'Categoría eliminada exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al eliminar la categoría' };
  }
}

export async function toggleCategoryStatus(id: string, newStatus: boolean): Promise<ActionState> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'No autorizado. Inicie sesión.' };
    }

    if (process.env.ADMIN_WRITES_ENABLED !== 'true') {
      return { success: false, message: 'Las escrituras están deshabilitadas en este entorno.' };
    }

    const categoriesTable = supabaseAdmin.from('categories') as any;
    const { error } = await categoriesTable
      .update({ is_active: newStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/categorias');
    revalidatePath('/productos');
    return { success: true, message: 'Estado de categoría actualizado' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al actualizar el estado' };
  }
}
