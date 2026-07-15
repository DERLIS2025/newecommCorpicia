export const runtime = 'nodejs';

import crypto from 'crypto';

export function generateRandomToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export async function hashString(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');
    // Use scrypt
    crypto.scrypt(text, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function verifyHash(text: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    if (!salt || !key) return resolve(false);

    crypto.scrypt(text, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      // Use timingSafeEqual to prevent timing attacks
      try {
        const keyBuffer = Buffer.from(key, 'hex');
        const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Creates an HMAC signature for a given payload to ensure it wasn't tampered with.
 * We use SUPABASE_SERVICE_ROLE_KEY or JWT secret as the HMAC secret.
 */
export function signPayload(payload: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}.${signature}`;
}

export function verifySignedPayload(signedPayload: string): string | null {
  const parts = signedPayload.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expectedSignature = signPayload(payload).split('.')[1];
  
  try {
    const sigBuf = Buffer.from(signature, 'hex');
    const expectedSigBuf = Buffer.from(expectedSignature, 'hex');
    if (sigBuf.length === expectedSigBuf.length && crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
      return payload;
    }
  } catch {
    return null;
  }
  return null;
}
