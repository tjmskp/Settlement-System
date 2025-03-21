import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { JWT } from 'next-auth/jwt';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token: JWT | null }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/documents/:path*',
    '/appointments/:path*',
    '/messages/:path*',
    '/billing/:path*',
    '/analytics/:path*',
  ],
}; 