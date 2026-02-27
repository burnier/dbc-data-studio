import { NextRequest, NextResponse } from 'next/server';
import { setAdminCookie } from '@/lib/admin-auth';

interface AttemptRecord {
  attempts: number;
  lockedUntil: number;
  lastAttemptAt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;  // 15 minutes
const WINDOW_MS   = 10 * 60 * 1000; // Reset counter after 10 min of inactivity

// Periodic cleanup to prevent memory leak (runs at most once per minute)
let lastCleanup = 0;
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [ip, record] of loginAttempts.entries()) {
    const isExpiredLock = record.lockedUntil && now > record.lockedUntil + WINDOW_MS;
    const isStale = !record.lockedUntil && now - record.lastAttemptAt > WINDOW_MS;
    if (isExpiredLock || isStale) loginAttempts.delete(ip);
  }
}

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

function recordFailedAttempt(ip: string): number {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  // Reset counter if no prior record, or if last attempt was outside the window and not locked
  const shouldReset = !record || (!record.lockedUntil && now - record.lastAttemptAt > WINDOW_MS);
  const attempts = shouldReset ? 1 : record!.attempts + 1;

  loginAttempts.set(ip, {
    attempts,
    lockedUntil: attempts >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0,
    lastAttemptAt: now,
  });

  return attempts;
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  maybeCleanup();

  const ip = getClientIp(request);
  const { allowed, retryAfterSecs } = checkRateLimit(ip);

  if (!allowed) {
    const mins = Math.ceil(retryAfterSecs! / 60);
    console.warn(`🔒 Admin login blocked — IP ${ip} locked out for ${retryAfterSecs}s`);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } }
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
      const attempts = recordFailedAttempt(ip);
      const remaining = MAX_ATTEMPTS - attempts;
      console.warn(`⚠️  Failed admin login from IP ${ip} — attempt ${attempts}/${MAX_ATTEMPTS}`);
      return NextResponse.json(
        {
          error: remaining > 0
            ? `Invalid password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
            : 'Too many failed attempts. Try again in 15 minutes.',
        },
        { status: 401 }
      );
    }

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
