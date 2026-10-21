import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { profileUpdateSchema } from '@/lib/validation';



export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return fail('Not authenticated', 401);
  }

  return ok({ user });
});





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

  const parsed = profileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
  if (parsed.data.addresses !== undefined) updates.addresses = parsed.data.addresses;
  if (parsed.data.preferences !== undefined) {
    updates.preferences = { ...user.preferences, ...parsed.data.preferences };
  }

  const [row] = await db.update(users).set(updates).where(eq(users.id, user.id)).returning();

  return ok({ user: { ...user, ...row } }, 'Profile updated successfully');
});
