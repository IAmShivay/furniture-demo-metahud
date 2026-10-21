import { NextRequest } from 'next/server';

import { ok, withErrorHandling } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Simple liveness probe, also used by the API client.
 */
export const GET = withErrorHandling(async (_request: NextRequest) => {
  return ok({ status: 'ok', timestamp: new Date().toISOString() });
});
