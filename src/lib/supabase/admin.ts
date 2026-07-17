import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Solo logueamos advertencia interna en servidor, nunca exponemos la llave en errores de UI.
  console.error('[Supabase Admin] Configuración incompleta. Faltan variables de entorno.');
}

export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Verifica centralmente si las escrituras administrativas están habilitadas.
 * Arroja un error controlado si no lo están.
 */
export function assertAdminWritesEnabled() {
  if (process.env.ADMIN_WRITES_ENABLED !== 'true') {
    throw new Error('Las escrituras administrativas todavía no están habilitadas en este entorno');
  }
}
