import { NextResponse } from 'next/server';

/** Consistent success envelope used by every API route. */
export function ok<T>(data: T, message?: string) {
  return NextResponse.json({ success: true, data, ...(message ? { message } : {}) });
}

/** Consistent failure envelope used by every API route. */
export function fail(message: string, status = 400, errors?: unknown) {
  return NextResponse.json(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status },
  );
}

/**
 * Wraps a route handler so that unexpected errors are turned into a proper
 * JSON response instead of an HTML error page.
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>,
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('[api] Unhandled error:', error);
      return fail(
        error instanceof Error ? error.message : 'Something went wrong',
        500,
      );
    }
  };
}
