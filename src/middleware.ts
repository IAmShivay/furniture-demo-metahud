import { NextResponse, type NextRequest } from 'next/server';

import { hasMinimumRole, isRole } from '@/lib/rbac';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

const ROLE_RULES: { prefix: string; minimum: 'support' | 'manager' | 'admin' }[] = [
  { prefix: '/admin/products', minimum: 'manager' },
  { prefix: '/admin', minimum: 'support' },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isAdminArea = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (!isAdminArea) {
    if (isAuthPage && session) {
      const url = request.nextUrl.clone();
      url.pathname = session.role === 'customer' ? '/account' : '/admin';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  const rule = ROLE_RULES.find((item) => pathname.startsWith(item.prefix));
  const role = isRole(session.role) ? session.role : 'customer';

  if (rule && !hasMinimumRole(role, rule.minimum)) {
    const url = request.nextUrl.clone();
    url.pathname = '/account';
    url.search = '';
    url.searchParams.set('error', 'forbidden');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
};
