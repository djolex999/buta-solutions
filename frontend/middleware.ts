import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (!isAdminRoute) return NextResponse.next();

  // Check auth by calling backend /api/auth/me with forwarded cookies
  let isAuthenticated = false;
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
    isAuthenticated = res.ok;
  } catch {
    isAuthenticated = false;
  }

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
