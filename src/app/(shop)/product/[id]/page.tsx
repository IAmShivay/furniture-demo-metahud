import type { Metadata } from 'next';
import ProductPage from '@/components/pages/ProductPage';

export const metadata: Metadata = {
  title: 'Product | LuxeHouse',
  description: 'Premium furniture crafted with exceptional materials and attention to detail.',
};

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductPage productId={id} />;
}
