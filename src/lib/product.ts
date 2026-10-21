import type { ProductRow } from '@/db/schema';


export interface ProductDTO {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: string;
  category: string;
  subcategory: string;
  tags: string[];
  basePrice: number;
  price: number;
  originalPrice: number | null;
  costPrice: number | null;
  currency: string;
  images: string[];
  image: string;
  videos: string[];
  dimensions: {
    length: string;
    width: string;
    height: string;
    weight: string;
    unit: string;
  };
  materials: string[];
  colors: string[];
  styles: string[];
  features: string[];
  customization: unknown[];
  inventory: {
    quantity: number;
    reserved: number;
    lowStockThreshold: number;
    trackInventory: boolean;
  };
  shipping: unknown | null;
  rating: {
    average: number;
    count: number;
  };
  status: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  onSale: boolean;
  viewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};








export function toProductDTO(row: ProductRow): ProductDTO {
  const images = row.images ?? [];

  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.shortDescription ?? '',
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory ?? '',
    tags: row.tags ?? [],
    basePrice: toNumber(row.basePrice),
    price: toNumber(row.basePrice),
    originalPrice: row.originalPrice === null ? null : toNumber(row.originalPrice),
    costPrice: row.costPrice === null ? null : toNumber(row.costPrice),
    currency: row.currency,
    images,
    image: images[0] ?? '',
    videos: row.videos ?? [],
    dimensions: {
      length: row.dimensions?.length ?? '',
      width: row.dimensions?.width ?? '',
      height: row.dimensions?.height ?? '',
      weight: row.dimensions?.weight ?? '',
      unit: row.dimensions?.unit ?? 'inches',
    },
    materials: row.materials ?? [],
    colors: row.colors ?? [],
    styles: row.styles ?? [],
    features: row.features ?? [],
    customization: row.customization ?? [],
    inventory: row.inventory ?? {
      quantity: 0,
      reserved: 0,
      lowStockThreshold: 5,
      trackInventory: true,
    },
    shipping: row.shipping ?? null,
    rating: row.rating ?? { average: 0, count: 0 },
    status: row.status,
    featured: row.featured,
    bestseller: row.bestseller,
    newArrival: row.newArrival,
    onSale: row.onSale,
    viewCount: row.viewCount,
    salesCount: row.salesCount,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}


export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
