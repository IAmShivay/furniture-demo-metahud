import { apiSlice } from './apiSlice';
import { Product } from './productsApi';

export interface DashboardStats {
  overview: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    lowStockProducts: number;
    inventoryValue: number;
    averageRating: number;
  };
  topProducts: Product[];
  recentProducts: Product[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<
      { success: boolean; data: DashboardStats },
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => {
        if (!params) return '/admin/dashboard';
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        const query = queryParams.toString();
        return query ? `/admin/dashboard?${query}` : '/admin/dashboard';
      },
      providesTags: ['Admin', 'Product'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminApi;
