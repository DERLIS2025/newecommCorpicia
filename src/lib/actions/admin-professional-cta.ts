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


export async function uploadProfessionalCtaImage(
  formData: FormData
) {
  if (!supabaseAdmin) {
    return {
      success: false,
      error: 'Supabase Admin no está configurado.',
    };
  }

  try {
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return {
        success: false,
        error: 'No se recibió una imagen válida.',
      };
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Solo se permiten imágenes JPG, PNG o WebP.',
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'La imagen supera el máximo permitido de 5 MB.',
      };
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'webp';

    const filePath =
      `professional-cta/${crypto.randomUUID()}.${extension}`;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const { error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) {
      console.error('Professional CTA upload error:', error);

      return {
        success: false,
        error: error.message,
      };
    }

    const { data } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      publicUrl: data.publicUrl,
    };

  } catch (error) {
    console.error('Professional CTA upload exception:', error);

    return {
      success: false,
      error: 'No se pudo subir la imagen.',
    };
  }
}
