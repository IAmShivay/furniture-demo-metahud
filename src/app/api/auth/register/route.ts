import { NextRequest, NextResponse } from 'next/server';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { findUserByEmail, toUserDTO } from '@/lib/users';
import { registerSchema } from '@/lib/validation';



export const POST = withErrorHandling(async (request: NextRequest) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  const { name, email, password, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await findUserByEmail(normalizedEmail);

  if (existing) {
    return fail('An account with this email already exists', 409);
  }

  const [row] = await db
    .insert(users)
    .values({
      name,
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      role: 'customer',
      phone: phone ?? null,
      emailVerified: false,
    })
    .returning();

  const user = toUserDTO(row);
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    success: true,
    message: 'Account created successfully',
    data: { user },
  });

  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);

  return response;
});
