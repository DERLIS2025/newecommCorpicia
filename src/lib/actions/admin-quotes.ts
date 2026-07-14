'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateQuoteStatus(id: string, status: string, notes?: string) {
  if (!supabaseAdmin) {
    return { success: false, message: 'Servicio no configurado' };
  }

  try {
    const { error: updateError } = await (supabaseAdmin as any)
      .from('quotes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating quote status:', updateError);
      return { success: false, message: 'Error al actualizar el estado' };
    }

    // Insert history
    await (supabaseAdmin as any)
      .from('quote_status_history')
      .insert({
        quote_id: id,
        status,
        notes: notes || `Estado cambiado a ${status} desde el panel admin.`,
      });

    revalidatePath('/admin/presupuestos');
    revalidatePath(`/admin/presupuestos/${id}`);
    
    return { success: true, message: 'Estado actualizado correctamente' };
  } catch (error) {
    console.error('Error in updateQuoteStatus action:', error);
    return { success: false, message: 'Ocurrió un error inesperado' };
  }
}
