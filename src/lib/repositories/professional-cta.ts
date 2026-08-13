import { supabase } from '@/lib/supabase';

export type ProfessionalCtaSettings = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  button_text: string;
  whatsapp_message: string;

  // Compatibilidad con la primera versión
  image_url: string;

  // Nuevas imágenes responsive
  desktop_image_url: string;
  mobile_image_url: string;
};

export const DEFAULT_PROFESSIONAL_CTA: ProfessionalCtaSettings = {
  enabled: true,
  eyebrow: 'Beneficios para profesionales',
  title: '¿Sos jardinero o profesional del paisajismo?',
  description:
    'Somos tu aliado para tus proyectos. Encontrá césped, piedras decorativas, sistemas de riego e insumos para jardinería con asesoramiento personalizado.',
  button_text: 'Quiero recibir asesoramiento',
  whatsapp_message:
    'Hola Corpicia, soy jardinero/profesional y quiero recibir información sobre productos y condiciones para profesionales.',
  image_url: '',
  desktop_image_url: '',
  mobile_image_url: '',
};

export async function getProfessionalCta(): Promise<ProfessionalCtaSettings> {
  if (!supabase) {
    return DEFAULT_PROFESSIONAL_CTA;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'professional_cta')
      .eq('is_public', true)
      .maybeSingle();

    if (error || !data?.value) {
      return DEFAULT_PROFESSIONAL_CTA;
    }

    const stored = data.value as Partial<ProfessionalCtaSettings>;

    return {
      ...DEFAULT_PROFESSIONAL_CTA,
      ...stored,

      // Si ya existía image_url, reutilizarla como desktop
      desktop_image_url:
        stored.desktop_image_url ||
        stored.image_url ||
        '',

      mobile_image_url:
        stored.mobile_image_url ||
        stored.desktop_image_url ||
        stored.image_url ||
        '',
    };
  } catch {
    return DEFAULT_PROFESSIONAL_CTA;
  }
}
