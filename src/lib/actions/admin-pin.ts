'use server';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import { generateRandomToken, hashString, verifyHash } from '@/lib/crypto';
import { 
  setDeviceCookie, 
  getDeviceCookie, 
  clearDeviceCookie, 
  setUnlockCookie, 
  clearUnlockCookie 
} from '@/lib/admin-device-cookie';
import { revalidatePath } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false }
  });
}

/**
 * Ensures the user is logged in via Supabase, has an active admin profile,
 * and returns the user object.
 */
async function getValidatedAdminUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role, is_active')
    .eq('user_id', user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== 'admin') {
    throw new Error('No autorizado');
  }

  return user;
}

export async function createAdminPin(pin: string, confirmPin: string) {
  try {
    if (pin !== confirmPin) return { success: false, message: 'Los PIN no coinciden' };
    if (!/^\d{6}$/.test(pin)) return { success: false, message: 'El PIN debe ser de 6 dígitos' };

    const user = await getValidatedAdminUser();
    const adminSupabase = getAdminSupabase();

    // 1. Generate device token and hash PIN
    const deviceToken = generateRandomToken(32);
    const deviceTokenHash = await hashString(deviceToken);
    const pinHash = await hashString(pin);

    // 2. Insert into DB
    const { error } = await adminSupabase
      .from('admin_trusted_devices')
      .insert({
        user_id: user.id,
        device_token_hash: deviceTokenHash,
        pin_hash: pinHash,
      });

    if (error) {
      console.error('Error creating trusted device', error);
      return { success: false, message: 'No se pudo configurar el dispositivo' };
    }

    // 3. Set cookies
    setDeviceCookie(deviceToken);
    setUnlockCookie(user.id);

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function verifyAdminPin(pin: string) {
  try {
    if (!/^\d{6}$/.test(pin)) return { success: false, message: 'Formato de PIN inválido' };

    const user = await getValidatedAdminUser();
    const deviceToken = getDeviceCookie();

    if (!deviceToken) {
      return { success: false, message: 'Dispositivo no confiable' };
    }

    const adminSupabase = getAdminSupabase();

    // Find the device by iterating. Since we only have the plaintext token, 
    // we need to find all active devices for this user and verify the hash.
    // However, scrypt is slow. Storing a device_id in the cookie is better for performance.
    // Since the prompt asks to save ONLY the hash of the token, we can split the token format: "deviceId.randomToken".
    // Wait, the prompt said: "Guardar en navegador solamente un identificador opaco... Guardar en bd únicamente el hash del device token".
    // If we just hash the token, we must fetch ALL devices for the user and check hashes. For a few devices, it's fine.
    
    const { data: devices } = await adminSupabase
      .from('admin_trusted_devices')
      .select('*')
      .eq('user_id', user.id)
      .is('revoked_at', null);

    if (!devices || devices.length === 0) {
      clearDeviceCookie();
      return { success: false, message: 'Dispositivo no configurado o revocado' };
    }

    let matchedDevice = null;
    for (const device of devices) {
      if (await verifyHash(deviceToken, device.device_token_hash)) {
        matchedDevice = device;
        break;
      }
    }

    if (!matchedDevice) {
      clearDeviceCookie();
      return { success: false, message: 'Dispositivo no confiable' };
    }

    // Check block
    if (matchedDevice.failed_attempts >= 5 || matchedDevice.locked_until > new Date().toISOString()) {
      clearDeviceCookie();
      clearUnlockCookie();
      return { success: false, message: 'Dispositivo bloqueado por demasiados intentos', locked: true };
    }

    // Check PIN
    const isValidPin = await verifyHash(pin, matchedDevice.pin_hash);

    if (!isValidPin) {
      const newAttempts = matchedDevice.failed_attempts + 1;
      
      const updateData: any = { failed_attempts: newAttempts, updated_at: new Date().toISOString() };
      
      if (newAttempts >= 5) {
        updateData.locked_until = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // lock 1 day or permanent
        updateData.revoked_at = new Date().toISOString(); // Revoke entirely as requested
      }

      await adminSupabase
        .from('admin_trusted_devices')
        .update(updateData)
        .eq('id', matchedDevice.id);

      if (newAttempts >= 5) {
        clearDeviceCookie();
        clearUnlockCookie();
        return { success: false, message: 'Demasiados intentos. Dispositivo revocado.', locked: true };
      }

      return { success: false, message: 'PIN incorrecto' };
    }

    // Success! Reset attempts
    await adminSupabase
      .from('admin_trusted_devices')
      .update({
        failed_attempts: 0,
        last_used_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', matchedDevice.id);

    setUnlockCookie(user.id);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function forgetDevice() {
  try {
    const user = await getValidatedAdminUser().catch(() => null);
    const deviceToken = getDeviceCookie();
    
    if (user && deviceToken) {
      const adminSupabase = getAdminSupabase();
      const { data: devices } = await adminSupabase
        .from('admin_trusted_devices')
        .select('*')
        .eq('user_id', user.id)
        .is('revoked_at', null);

      if (devices) {
        for (const device of devices) {
          if (await verifyHash(deviceToken, device.device_token_hash)) {
            await adminSupabase
              .from('admin_trusted_devices')
              .update({
                revoked_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', device.id);
            break;
          }
        }
      }
    }
    clearDeviceCookie();
    clearUnlockCookie();
    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function lockPanel() {
  clearUnlockCookie();
  revalidatePath('/admin', 'layout');
  return { success: true };
}

export async function verifyDeviceExistsForUser() {
  try {
    const user = await getValidatedAdminUser();
    const deviceToken = getDeviceCookie();
    if (!deviceToken) return false;

    const adminSupabase = getAdminSupabase();
    const { data: devices } = await adminSupabase
      .from('admin_trusted_devices')
      .select('*')
      .eq('user_id', user.id)
      .is('revoked_at', null);

    if (!devices || devices.length === 0) return false;

    for (const device of devices) {
      if (await verifyHash(deviceToken, device.device_token_hash)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export async function checkLoginState() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { loggedIn: false };

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('name, is_active, role')
      .eq('user_id', user.id)
      .single();

    if (!profile || !profile.is_active || profile.role !== 'admin') {
      return { loggedIn: false };
    }

    const deviceToken = getDeviceCookie();
    const adminSupabase = getAdminSupabase();
    let hasDevice = false;

    if (deviceToken) {
      const { data: devices } = await adminSupabase
        .from('admin_trusted_devices')
        .select('*')
        .eq('user_id', user.id)
        .is('revoked_at', null);

      if (devices && devices.length > 0) {
        for (const device of devices) {
          if (await verifyHash(deviceToken, device.device_token_hash)) {
            hasDevice = true;
            break;
          }
        }
      }
    }
    
    return { 
      loggedIn: true, 
      name: profile.name || 'Admin', 
      hasDevice 
    };
  } catch {
    return { loggedIn: false };
  }
}
