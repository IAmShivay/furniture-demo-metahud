import { NextRequest, NextResponse } from 'next/server';

import { ok, withErrorHandling } from '@/lib/api';
import { SESSION_COOKIE } from '@/lib/session';


export const POST = withErrorHandling(async (_request: NextRequest) => {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully',
    data: {},
  });

  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
});
