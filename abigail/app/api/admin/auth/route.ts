import { NextRequest, NextResponse } from 'next/server';
import { setAdminCookie } from '@/lib/admin-auth';

// In-memory store: IP → { attempts, lockedUntil }
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_MS = 10 * 60 * 1000;  // Reset attempt count after 10 minutes of inactivity

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSecs?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record?.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, retryAfterSecs: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - (record.lockedUntil || 0) > WINDOW_MS) {
    loginAttempts.set(ip, { attempts: 1, lockedUntil: 0 });
    return;
  }

  const attempts = record.attempts + 1;
  loginAttempts.set(ip, {
    attempts,
    lockedUntil: attempts >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0,
  });
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Check if IP is locked out
  const { allowed, retryAfterSecs } = checkRateLimit(ip);
  if (!allowed) {
    console.warn(`🔒 Admin login blocked for IP ${ip} — locked out for ${retryAfterSecs}s`);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil(retryAfterSecs! / 60)} minutes.` },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSecs) },
      }
    );
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (password !== adminPassword) {
      recordFailedAttempt(ip);
      const record = loginAttempts.get(ip);
      const remaining = MAX_ATTEMPTS - (record?.attempts ?? 0);

      console.warn(`⚠️  Failed admin login from IP ${ip} — ${remaining} attempt(s) remaining`);

      return NextResponse.json(
        { error: remaining > 0 ? `Invalid password. ${remaining} attempt(s) remaining.` : 'Too many failed attempts. Try again in 15 minutes.' },
        { status: 401 }
      );
    }

    // Success — clear any previous failed attempts
    clearAttempts(ip);

    const response = NextResponse.json({ success: true });
    await setAdminCookie(response);
    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', { maxAge: 0, path: '/' });
  return response;
}
