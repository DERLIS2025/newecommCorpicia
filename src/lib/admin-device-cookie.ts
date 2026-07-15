export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { signPayload, verifySignedPayload, generateRandomToken } from './crypto';

const DEVICE_COOKIE_NAME = 'admin_device';
const UNLOCK_COOKIE_NAME = 'admin_unlock';

const DEVICE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const UNLOCK_MAX_AGE = 60 * 30; // 30 minutes (or use session cookie by omitting maxAge, but user said 'máximo 30 minutos')

export function setDeviceCookie(token: string) {
  cookies().set({
    name: DEVICE_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: DEVICE_MAX_AGE,
  });
}

export function getDeviceCookie(): string | undefined {
  return cookies().get(DEVICE_COOKIE_NAME)?.value;
}

export function clearDeviceCookie() {
  cookies().delete({
    name: DEVICE_COOKIE_NAME,
    path: '/admin',
  });
}

export function setUnlockCookie(userId: string) {
  const nonce = generateRandomToken(8);
  const payload = `${userId}:${nonce}:${Date.now()}`;
  const signedToken = signPayload(payload);
  
  cookies().set({
    name: UNLOCK_COOKIE_NAME,
    value: signedToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: UNLOCK_MAX_AGE,
  });
}

export function verifyUnlockCookie(userId: string): boolean {
  const token = cookies().get(UNLOCK_COOKIE_NAME)?.value;
  if (!token) return false;

  const payload = verifySignedPayload(token);
  if (!payload) return false;

  const [tokenUserId, nonce, timestamp] = payload.split(':');
  
  // Verify it belongs to this user
  if (tokenUserId !== userId) return false;

  // Verify it's not older than 30 minutes
  const timeDiff = Date.now() - parseInt(timestamp, 10);
  if (timeDiff > UNLOCK_MAX_AGE * 1000) {
    return false;
  }

  return true;
}

export function clearUnlockCookie() {
  cookies().delete({
    name: UNLOCK_COOKIE_NAME,
    path: '/admin',
  });
}
