'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export type ActionState = {
  success: boolean;
  message: string;
};

export async function updateCalculatorSettings(
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

    const settings = [
      {
        key: 'budget_note_1',
        value: { text: (formData.get('budget_note_1') as string) || '' },
      },
      {
        key: 'budget_note_2',
        value: { text: (formData.get('budget_note_2') as string) || '' },
      },
      {
        key: 'whatsapp_greeting',
        value: { text: (formData.get('whatsapp_greeting') as string) || '' },
      },
      {
        key: 'whatsapp_goodbye',
        value: { text: (formData.get('whatsapp_goodbye') as string) || '' },
      },
    ];

    const { error } = await (supabaseAdmin as any)
      .from('calculator_settings')
      .upsert(settings, { onConflict: 'key' });

    if (error) throw error;

    revalidatePath('/admin/calculadora');

    return { success: true, message: 'Configuración de calculadora guardada correctamente.' };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error al guardar la configuración de calculadora.',
    };
  }
}
