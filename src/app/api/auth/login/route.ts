import { NextRequest, NextResponse } from 'next/server';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { verifyPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { findUserByEmail, toUserDTO } from '@/lib/users';
import { loginSchema } from '@/lib/validation';



export const POST = withErrorHandling(async (request: NextRequest) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  const { email, password } = parsed.data;
  const row = await findUserByEmail(email);

  if (!row || !(await verifyPassword(password, row.passwordHash))) {
    return fail('Invalid email or password', 401);
  }

  if (!row.isActive) {
    return fail('This account has been deactivated. Please contact support.', 403);
  }

  const user = toUserDTO(row);
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    success: true,
    message: 'Signed in successfully',
    data: { user },
  });

  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);

  return response;
});
