import { getFeaturedProducts } from '@/lib/products';
import { ok, withErrorHandling } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/featured
 * Featured products for the home page showcase.
 */
export const GET = withErrorHandling(async () => {
  const items = await getFeaturedProducts(8);
  return ok({ items });
});
