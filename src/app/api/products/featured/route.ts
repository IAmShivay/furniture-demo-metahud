import { getFeaturedProducts } from '@/lib/products';
import { ok, withErrorHandling } from '@/lib/api';

export const dynamic = 'force-dynamic';





export const GET = withErrorHandling(async () => {
  const items = await getFeaturedProducts(8);
  return ok({ items });
});
