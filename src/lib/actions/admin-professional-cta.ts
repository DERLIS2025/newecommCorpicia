'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ProfessionalCtaSettings } from '@/lib/repositories/professional-cta';

export async function saveProfessionalCta(
  data: ProfessionalCtaSettings
) {
  if (!supabaseAdmin) {
    return {
      success: false,
      error: 'Supabase Admin no está configurado.',
    };
  }

  try {
    const payload: ProfessionalCtaSettings = {
      ...data,

      // Mantener compatibilidad con la versión anterior
      image_url:
        data.desktop_image_url ||
        data.image_url ||
        '',
    };

    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert(
        {
          key: 'professional_cta',
          value: payload,
          is_public: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'key',
        }
      );

    if (error) {
      console.error(
        'Professional CTA save error:',
        error
      );

      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/');
    revalidatePath('/admin/cta-profesionales');

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error:
        'No se pudo guardar la configuración.',
    };
  }
}
