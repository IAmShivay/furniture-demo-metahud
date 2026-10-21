import type { Metadata } from 'next';
import ProductListingPage from '@/components/pages/ProductListingPage';

export const metadata: Metadata = {
  title: 'Premium Furniture Collection | LuxeHouse',
  description:
    'Browse our curated collection of premium furniture. Shop sofas, chairs, tables, and more with free delivery.',
};

export default function ProductsPage() {
  return <ProductListingPage />;
}
