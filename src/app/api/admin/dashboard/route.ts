import { ok, withErrorHandling } from '@/lib/api';
import { getCatalogueStats } from '@/lib/products';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(async () => {
  const stats = await getCatalogueStats();

  return ok({
    overview: {
      totalProducts: stats.totalProducts,
      activeProducts: stats.activeProducts,
      draftProducts: stats.draftProducts,
      lowStockProducts: stats.lowStockProducts,
      inventoryValue: stats.inventoryValue,
      averageRating: stats.averageRating,
    },
    topProducts: stats.topProducts,
    recentProducts: stats.recentProducts,
    revenueByDay: stats.trend,
  });
});
