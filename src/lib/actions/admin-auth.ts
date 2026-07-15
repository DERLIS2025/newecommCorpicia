'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { setUnlockCookie, clearUnlockCookie, getDeviceCookie } from '@/lib/admin-device-cookie';
import { verifyDeviceExistsForUser } from '@/lib/actions/admin-pin';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email y contraseña son obligatorios' };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, message: 'Credenciales inválidas' };
  }

  // Verificar si es admin activo
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role, is_active')
    .eq('user_id', data.user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== 'admin') {
    await supabase.auth.signOut();
    return { success: false, message: 'Usuario no autorizado' };
  }

  // Verificar si existe dispositivo de confianza (para ofrecer setup si no existe)
  const hasDevice = await verifyDeviceExistsForUser();

  if (hasDevice) {
    // Si ya tiene dispositivo, pero inició con contraseña (ej. eligió usar correo en vez de PIN),
    // desbloqueamos la sesión para que entre directo
    setUnlockCookie(data.user.id);
    return { success: true, message: 'Inicio de sesión exitoso' };
  } else {
    // Si no tiene dispositivo, lo enviamos al panel de configuración de PIN (estado B)
    return { success: true, message: 'Inicio de sesión exitoso', requirePinSetup: true };
  }
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  clearUnlockCookie();
  revalidatePath('/admin', 'layout');
}
