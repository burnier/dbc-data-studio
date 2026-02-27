/**
 * Admin authentication helpers.
 * Uses HMAC-based token stored in an httpOnly cookie.
 */
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';

async function computeToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET || 'admin-fallback-secret';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const combined = `${password}:${secret}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(combined));
  return Buffer.from(sig).toString('hex');
}

/** Sets the admin session cookie after successful login. */
export async function setAdminCookie(response: NextResponse): Promise<void> {
  const token = await computeToken();
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

/** Returns true if the current request carries a valid admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const expected = await computeToken();
    return token === expected;
  } catch {
    return false;
  }
}

/** Returns a 401 response if the request is not authenticated. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
