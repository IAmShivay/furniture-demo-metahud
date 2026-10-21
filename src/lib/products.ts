import { and, asc, count, desc, eq, gte, ilike, inArray, lte, or, sql, type SQL } from 'drizzle-orm';

import { db } from '@/db';
import { products } from '@/db/schema';
import { slugify, toProductDTO, type ProductDTO } from '@/lib/product';
import type { CreateProductInput, ProductQueryInput, UpdateProductInput } from '@/lib/validation';





const buildFilters = (query: ProductQueryInput): SQL | undefined => {
  const conditions: (SQL | undefined)[] = [];

  
  
  if (query.includeInactive) {
    if (query.status) {
      conditions.push(eq(products.status, query.status));
    }
  } else {
    conditions.push(eq(products.status, 'active'));
  }

  if (query.category) {
    conditions.push(eq(products.category, query.category));
  }

  if (query.ids && query.ids.length > 0) {
    conditions.push(inArray(products.id, query.ids));
  }

  if (query.subcategory) {
    conditions.push(eq(products.subcategory, query.subcategory));
  }

  if (query.search) {
    const term = `%${query.search}%`;
    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.description, term),
        ilike(products.brand, term),
        ilike(products.subcategory, term),
      ),
    );
  }

  const minPrice = query.minPrice ?? query.priceMin;
  const maxPrice = query.maxPrice ?? query.priceMax;

  if (typeof minPrice === 'number') {
    conditions.push(sql`${products.basePrice} >= ${minPrice}::numeric`);
  }

  if (typeof maxPrice === 'number') {
    conditions.push(sql`${products.basePrice} <= ${maxPrice}::numeric`);
  }

  if (query.featured !== undefined) {
    conditions.push(eq(products.featured, query.featured));
  }

  if (query.onSale !== undefined) {
    conditions.push(eq(products.onSale, query.onSale));
  }

  if (query.inStock !== undefined) {
    conditions.push(
      query.inStock
        ? sql`(${products.inventory}->>'quantity')::int > 0`
        : sql`(${products.inventory}->>'quantity')::int <= 0`,
    );
  }

  const filtered = conditions.filter((condition): condition is SQL => Boolean(condition));

  return filtered.length ? and(...filtered) : undefined;
};

const buildOrderBy = (query: ProductQueryInput): SQL[] => {
  switch (query.sortBy) {
    case 'price-low':
      return [asc(products.basePrice)];
    case 'price-high':
      return [desc(products.basePrice)];
    case 'rating':
      return [desc(sql`(${products.rating}->>'average')::numeric`), desc(products.createdAt)];
    case 'name':
      return [asc(products.name)];
    case 'newest':
    case 'createdAt':
      return [desc(products.createdAt)];
    case 'featured':
    default:
      return [desc(products.featured), desc(products.bestseller), desc(products.createdAt)];
  }
};





export interface ProductListResult {
  items: ProductDTO[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export async function listProducts(query: ProductQueryInput): Promise<ProductListResult> {
  const where = buildFilters(query);
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(...buildOrderBy(query))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(products).where(where),
  ]);

  return {
    items: rows.map(toProductDTO),
    pagination: {
      current: page,
      pages: Math.max(1, Math.ceil(total / limit)),
      total,
      limit,
    },
  };
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ? toProductDTO(rows[0]) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.status, 'active'))
    .orderBy(desc(products.featured), desc(products.createdAt))
    .limit(limit);

  return rows.map(toProductDTO);
}

export async function getCategorySummary() {
  const rows = await db
    .select({
      category: products.category,
      count: count(),
      subcategory: products.subcategory,
    })
    .from(products)
    .where(eq(products.status, 'active'))
    .groupBy(products.category, products.subcategory)
    .orderBy(asc(products.category));

  const grouped = new Map<
    string,
    { _id: string; count: number; subcategories: string[] }
  >();

  for (const row of rows) {
    const existing = grouped.get(row.category);
    if (existing) {
      existing.count += row.count;
      if (row.subcategory && !existing.subcategories.includes(row.subcategory)) {
        existing.subcategories.push(row.subcategory);
      }
    } else {
      grouped.set(row.category, {
        _id: row.category,
        count: row.count,
        subcategories: row.subcategory ? [row.subcategory] : [],
      });
    }
  }

  return Array.from(grouped.values());
}





export async function createProduct(input: CreateProductInput): Promise<ProductDTO> {
  const slug = slugify(input.slug || input.name);
  const onSale =
    typeof input.originalPrice === 'number' && input.originalPrice > input.basePrice;

  const [row] = await db
    .insert(products)
    .values({
      name: input.name,
      slug,
      description: input.description,
      shortDescription: input.shortDescription ?? null,
      brand: input.brand,
      category: input.category,
      subcategory: input.subcategory ?? '',
      tags: input.tags ?? [],
      basePrice: input.basePrice.toFixed(2),
      originalPrice:
        typeof input.originalPrice === 'number' ? input.originalPrice.toFixed(2) : null,
      costPrice: typeof input.costPrice === 'number' ? input.costPrice.toFixed(2) : null,
      currency: input.currency ?? 'INR',
      images: input.images,
      videos: input.videos ?? [],
      dimensions: input.dimensions,
      materials: input.materials ?? [],
      colors: input.colors ?? [],
      styles: input.styles ?? [],
      features: input.features ?? [],
      customization: input.customization ?? [],
      inventory: input.inventory,
      shipping: input.shipping ?? null,
      rating: { average: 0, count: 0 },
      status: input.status ?? 'draft',
      featured: input.featured ?? false,
      bestseller: input.bestseller ?? false,
      newArrival: input.newArrival ?? false,
      onSale,
    })
    .returning();

  return toProductDTO(row);
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<ProductDTO | null> {
  const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!existing[0]) return null;

  const current = existing[0];
  const basePrice =
    typeof input.basePrice === 'number' ? input.basePrice : Number(current.basePrice);
  const originalPrice =
    typeof input.originalPrice === 'number'
      ? input.originalPrice
      : current.originalPrice === null
        ? undefined
        : Number(current.originalPrice);

  const [row] = await db
    .update(products)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: slugify(input.slug) } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.shortDescription !== undefined
        ? { shortDescription: input.shortDescription }
        : {}),
      ...(input.brand !== undefined ? { brand: input.brand } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.subcategory !== undefined ? { subcategory: input.subcategory } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.basePrice !== undefined ? { basePrice: input.basePrice.toFixed(2) } : {}),
      ...(input.originalPrice !== undefined
        ? { originalPrice: input.originalPrice.toFixed(2) }
        : {}),
      ...(input.costPrice !== undefined
        ? { costPrice: input.costPrice.toFixed(2) }
        : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.images !== undefined ? { images: input.images } : {}),
      ...(input.videos !== undefined ? { videos: input.videos } : {}),
      ...(input.dimensions !== undefined ? { dimensions: input.dimensions } : {}),
      ...(input.materials !== undefined ? { materials: input.materials } : {}),
      ...(input.colors !== undefined ? { colors: input.colors } : {}),
      ...(input.styles !== undefined ? { styles: input.styles } : {}),
      ...(input.features !== undefined ? { features: input.features } : {}),
      ...(input.customization !== undefined ? { customization: input.customization } : {}),
      ...(input.inventory !== undefined ? { inventory: input.inventory } : {}),
      ...(input.shipping !== undefined ? { shipping: input.shipping } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
      ...(input.bestseller !== undefined ? { bestseller: input.bestseller } : {}),
      ...(input.newArrival !== undefined ? { newArrival: input.newArrival } : {}),
      onSale: typeof originalPrice === 'number' && originalPrice > basePrice,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  return row ? toProductDTO(row) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const deleted = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ id: products.id });

  return deleted.length > 0;
}

export interface CatalogueStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  lowStockProducts: number;
  inventoryValue: number;
  averageRating: number;
  topProducts: ProductDTO[];
  recentProducts: ProductDTO[];
  trend: { date: string; revenue: number; orders: number }[];
}

export async function getCatalogueStats(days = 30): Promise<CatalogueStats> {
  const rows = await db.select().from(products);

  let activeProducts = 0;
  let draftProducts = 0;
  let lowStockProducts = 0;
  let inventoryValue = 0;
  let ratingSum = 0;
  let ratedProducts = 0;

  for (const row of rows) {
    if (row.status === 'active') activeProducts += 1;
    if (row.status === 'draft') draftProducts += 1;

    const quantity = row.inventory?.quantity ?? 0;
    const threshold = row.inventory?.lowStockThreshold ?? 0;

    if (quantity <= threshold) lowStockProducts += 1;

    inventoryValue += Number(row.basePrice) * quantity;

    const average = row.rating?.average ?? 0;
    if (average > 0) {
      ratingSum += average;
      ratedProducts += 1;
    }
  }

  const mapped = rows.map(toProductDTO);

  const topProducts = mapped
    .slice()
    .sort((first, second) => second.salesCount - first.salesCount || second.rating.average - first.rating.average)
    .slice(0, 5);

  const recentProducts = mapped
    .slice()
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    .slice(0, 5);

  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const trend = rows
    .filter((row) => new Date(row.createdAt).getTime() >= since)
    .reduce<{ date: string; revenue: number; orders: number }[]>((accumulator, row) => {
      const date = new Date(row.createdAt).toISOString().slice(0, 10);
      const existing = accumulator.find((entry) => entry.date === date);

      if (existing) {
        existing.revenue += Number(row.basePrice) * (row.inventory?.quantity ?? 0);
        existing.orders += 1;
      } else {
        accumulator.push({
          date,
          revenue: Number(row.basePrice) * (row.inventory?.quantity ?? 0),
          orders: 1,
        });
      }

      return accumulator;
    }, [])
    .sort((first, second) => first.date.localeCompare(second.date));

  return {
    totalProducts: rows.length,
    activeProducts,
    draftProducts,
    lowStockProducts,
    inventoryValue,
    averageRating: ratedProducts > 0 ? ratingSum / ratedProducts : 0,
    topProducts,
    recentProducts,
    trend,
  };
}
