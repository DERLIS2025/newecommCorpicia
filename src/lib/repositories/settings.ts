import { supabase } from '../supabase';

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'supabase';

// Datos por defecto (fallback estático)
const defaultSettings: Record<string, any> = {
  'whatsapp_number': '595982123456',
  'contact_email': 'contacto@corpicia.com',
  'address': 'Asunción, Paraguay',
  'topbar_message': '¡Bienvenidos a Corpicia! La mejor calidad en césped y paisajismo.',
  'social_instagram': 'https://instagram.com/corpicia',
  'social_facebook': 'https://facebook.com/corpicia'
};

function logFallback(reason: string) {
  console.info(`[Repository: Settings] Using static fallback. Reason: ${reason}`);
}

export async function getSetting(key: string) {
  if (DATA_SOURCE === 'static') {
    logFallback('NEXT_PUBLIC_DATA_SOURCE is set to static');
    return defaultSettings[key] || null;
  }

  if (!supabase) {
    logFallback('Supabase client is not configured');
    return defaultSettings[key] || null;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .eq('is_public', true)
      .single();

    if (error) {
      logFallback(`Supabase query error for key ${key}`);
      return defaultSettings[key] || null;
    }

    return data?.value || null;
  } catch (err) {
    logFallback('Unexpected exception during fetch');
    return defaultSettings[key] || null;
  }
}
