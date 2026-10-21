'use client';

import Link from 'next/link';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { Loader2, Package, Layers, IndianRupee, Star } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetProductsQuery({ limit: 100, includeInactive: true });

  const items = data?.data?.items ?? [];
  const total = data?.data?.pagination?.total ?? 0;
  const active = items.filter((product) => product.status === 'active').length;
  const categories = new Set(items.map((product) => product.category)).size;
  const inventoryValue = items.reduce(
    (totalValue, product) => totalValue + (product.basePrice ?? 0) * (product.inventory?.quantity ?? 0),
    0,
  );
  const averageRating =
    items.length > 0
      ? items.reduce((sum, product) => sum + (product.rating?.average ?? 0), 0) / items.length
      : 0;

  const stats = [
    {
      label: 'Total Products',
      value: total,
      icon: Package,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      label: 'Active Listings',
      value: active,
      icon: Layers,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Categories',
      value: categories,
      icon: Layers,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Inventory Value',
      value: `₹${inventoryValue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500/10 text-yellow-600',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Catalogue overview</p>
        </div>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          Manage Products
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-5">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
