import { getCategorySummary } from '@/lib/products';
import { ok, withErrorHandling } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/categories
 * Categories (with product counts) used by the filter dropdowns.
 */
export const GET = withErrorHandling(async () => {
  const categories = await getCategorySummary();
  return ok(categories);
});
