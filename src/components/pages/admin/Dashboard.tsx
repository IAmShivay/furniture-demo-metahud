'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../store/hooks';
import SEOHead from '../../common/SEOHead';
import { selectHasPermission } from '../../../store/slices/authSlice';
import { useGetDashboardStatsQuery } from '../../../store/api/adminApi';
import { Loader2, AlertCircle, Users, Package, DollarSign, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  loading: boolean;
}> = ({ title, value, icon, gradient, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
        {icon}
      </div>
      <ArrowUpRight className="w-5 h-5 text-green-500" />
    </div>
    {loading ? (
      <div className="animate-pulse space-y-2">
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        <div className="h-4 w-16 bg-gray-100 rounded" />
      </div>
    ) : (
      <>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </>
    )}
  </div>
);

const RevenueChart: React.FC<{ data: any[]; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Catalogue Value Added</h3>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>Active</span>
        </div>
      </div>
      {data.length > 0 ? (
        <div className="flex items-end gap-1 h-48">
          {data.slice(-30).map((day: any, idx: number) => {
            const height = Math.max(4, (day.revenue / maxRevenue) * 100);
            return (
              <div key={idx} className="flex-1 h-full group relative flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-sm hover:from-amber-600 hover:to-orange-500 transition-all cursor-pointer"
                  style={{ height: `${height}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {formatCurrency(day.revenue)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-400">No catalogue data for this period</div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const hasAccess = useAppSelector((state) => selectHasPermission(state, 'admin:dashboard'));
  const { data, error, isLoading, isFetching } = useGetDashboardStatsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  React.useEffect(() => {
    if (!hasAccess) router.push('/');
  }, [hasAccess, router]);

  if (!hasAccess) return null;

  const loading = isLoading || isFetching;
  const overview = data?.data?.overview;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <SEOHead title="Admin Dashboard | LuxeHouse" noIndex={true} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back. Here's what's happening with your store.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input type="date" value={dateRange.startDate} onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="text-sm text-gray-700 border-none outline-none bg-transparent w-28 sm:w-32" />
          <span className="text-gray-300">—</span>
          <input type="date" value={dateRange.endDate} onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="text-sm text-gray-700 border-none outline-none bg-transparent w-28 sm:w-32" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>Error loading dashboard data.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard title="Inventory Value" value={formatCurrency(overview?.inventoryValue || 0)}
          icon={<DollarSign className="w-6 h-6 text-white" />} gradient="bg-gradient-to-br from-green-500 to-emerald-600" loading={loading} />
        <StatCard title="Active Listings" value={overview?.activeProducts || 0}
          icon={<ShoppingBag className="w-6 h-6 text-white" />} gradient="bg-gradient-to-br from-amber-500 to-orange-600" loading={loading} />
        <StatCard title="Total Products" value={overview?.totalProducts || 0}
          icon={<Users className="w-6 h-6 text-white" />} gradient="bg-gradient-to-br from-blue-500 to-indigo-600" loading={loading} />
        <StatCard title="Low Stock" value={overview?.lowStockProducts || 0}
          icon={<AlertCircle className="w-6 h-6 text-white" />} gradient="bg-gradient-to-br from-red-500 to-rose-600" loading={loading} />
      </div>

      <div className="mb-8">
        <RevenueChart data={data?.data?.revenueByDay || []} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recently Added Products</h3>
            <button onClick={() => router.push('/admin/products')} className="text-sm text-amber-600 hover:text-amber-700 font-semibold">View All</button>
          </div>
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-amber-600" /></div>
          ) : (data?.data?.recentProducts || []).length === 0 ? (
            <div className="p-8 text-center text-gray-400">No products found</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(data?.data?.recentProducts || []).map((product: any) => (
                <div key={product.id || product._id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm truncate max-w-[160px]">{product.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{product.status}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{formatCurrency(product.basePrice)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
            <button onClick={() => router.push('/admin/products')} className="text-sm text-amber-600 hover:text-amber-700 font-semibold">View All</button>
          </div>
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-amber-600" /></div>
          ) : (data?.data?.topProducts || []).length === 0 ? (
            <div className="p-8 text-center text-gray-400">No products found</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(data?.data?.topProducts || []).map((product: any) => (
                <div key={product.id || product._id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm truncate max-w-[160px]">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.salesCount || 0} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{formatCurrency(product.basePrice)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
