import { NextRequest } from 'next/server';

import { fail, ok, withErrorHandling } from '@/lib/api';
import { createProduct, listProducts } from '@/lib/products';
import { createProductSchema, productQuerySchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Public catalogue listing with search, category filtering, price range,
 * sorting and pagination.
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const rawQuery = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = productQuerySchema.safeParse(rawQuery);

  if (!parsed.success) {
    return fail('Invalid query parameters', 400, parsed.error.flatten());
  }

  const result = await listProducts(parsed.data);
  return ok(result);
});

/**
 * POST /api/products
 * Creates a product (admin).
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten());
  }

  try {
    const product = await createProduct(parsed.data);
    return ok({ product }, 'Product created successfully');
  } catch (error) {
    console.error('[api] Failed to create product:', error);
    return fail('Failed to create product', 500);
  }
});
