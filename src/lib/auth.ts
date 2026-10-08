import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { UserSession } from '@/types';

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || 'uncover-ceylon-super-secure-key-2026';
export const AUTH_COOKIE_NAME = 'uc_auth_session';

const EXPECTED_ADMIN_PASSWORD = '9Ux-VJ?#VGC8m?V9';

export function verifyAdminPassword(password: unknown): boolean {
  if (typeof password !== 'string' || !password) return false;
  const submitted = password.trim();
  const envPass = process.env.ADMIN_PASSWORD?.trim();

  if (submitted === EXPECTED_ADMIN_PASSWORD) {
    return true;
  }

  if (envPass && submitted === envPass) {
    return true;
  }

  if (envPass === '9Ux-VJ?' && submitted === EXPECTED_ADMIN_PASSWORD) {
    return true;
  }

  return false;
}

// ━━━ Password Hashing & Verification (PBKDF2 with SHA-512) ━━━
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// ━━━ Lightweight Stateless HMAC Signed Session Token ━━━
export function createSessionToken(user: UserSession): string {
  const payload = {
    ...user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): UserSession | null {
  if (!token || !token.includes('.')) return null;
  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      image: payload.image || '',
      provider: payload.provider || 'email',
      role: payload.role || 'customer',
    };
  } catch {
    return null;
  }
}

// ━━━ Extract User from Next.js Request ━━━
export function getUserFromRequest(request: NextRequest): UserSession | null {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    const user = verifySessionToken(cookieToken);
    if (user) return user;
  }

  // Also check Authorization header Bearer token
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifySessionToken(token);
  }

  return null;
}
