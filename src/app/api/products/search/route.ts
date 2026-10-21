import { NextRequest } from 'next/server';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { listProducts } from '@/lib/products';
import { productSearchQuerySchema } from '@/lib/validation';






export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const rawQuery: Record<string, string> = {
    ...Object.fromEntries(searchParams.entries()),
  };

  if (searchParams.get('q') && !searchParams.get('search')) {
    rawQuery.search = searchParams.get('q') as string;
  }

  const parsed = productSearchQuerySchema.safeParse(rawQuery);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  const result = await listProducts(parsed.data);
  return ok(result);
});
