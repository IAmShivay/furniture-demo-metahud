import { NextRequest } from 'next/server';

import { ok, withErrorHandling } from '@/lib/api';

export const dynamic = 'force-dynamic';





export const GET = withErrorHandling(async (_request: NextRequest) => {
  return ok({ status: 'ok', timestamp: new Date().toISOString() });
});
