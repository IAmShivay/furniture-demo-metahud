import { NextRequest } from 'next/server';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { listProducts } from '@/lib/products';
import { productQuerySchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';





export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const rawQuery: Record<string, string> = {
    ...Object.fromEntries(searchParams.entries()),
  };

  if (searchParams.get('q') && !searchParams.get('search')) {
    rawQuery.search = searchParams.get('q') as string;
  }

  const parsed = productQuerySchema.safeParse(rawQuery);

  if (!parsed.success) {
    return fail('Invalid query parameters', 400, parsed.error.flatten());
  }

  if (!parsed.data.search) {
    return fail('Search query is required', 400);
  }

  const result = await listProducts(parsed.data);
  return ok(result);
});
