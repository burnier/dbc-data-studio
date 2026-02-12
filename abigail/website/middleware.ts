import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'de', 'pt', 'hu'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;

  if (acceptLanguage) {
    for (const loc of locales) {
      if (acceptLanguage.toLowerCase().includes(loc)) {
        locale = loc;
        break;
      }
    }
  }

  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
  ],
};




