import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { changePasswordSchema } from '@/lib/validation';


export const PUT = withErrorHandling(async (request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return fail('Not authenticated', 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = changePasswordSchema.safeParse(body);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  const row = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  if (!row[0] || !(await verifyPassword(parsed.data.currentPassword, row[0].passwordHash))) {
    return fail('Current password is incorrect', 401);
  }

  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(parsed.data.newPassword),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return ok({}, 'Password updated successfully');
});
