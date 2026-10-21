import { NextRequest } from 'next/server';
import { z } from 'zod';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';


const subscribeSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
});




export const POST = withErrorHandling(async (request: NextRequest) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email: parsed.data.email.toLowerCase() })
      .onConflictDoNothing();

    return ok({ email: parsed.data.email.toLowerCase() }, 'Thanks for subscribing!');
  } catch (error) {
    console.error('[api] Failed to subscribe to newsletter:', error);
    return fail('Failed to subscribe', 500);
  }
});
