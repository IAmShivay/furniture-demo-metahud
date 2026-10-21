import { z } from 'zod';





export const PRODUCT_CATEGORIES = [
  'sofas',
  'chairs',
  'tables',
  'storage',
  'lighting',
  'decor',
  'bedroom',
  'dining',
  'office',
] as const;

export const PRODUCT_STATUSES = ['draft', 'active', 'inactive', 'discontinued'] as const;

export const SORT_OPTIONS = [
  'featured',
  'newest',
  'price-low',
  'price-high',
  'rating',
  'name',
  'createdAt',
] as const;









const imageUrl = z
  .string()
  .trim()
  .min(1, 'Image URL is required')
  .refine(
    (value) => {
      if (value.startsWith('/')) return true;
      try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid URL (http/https) or a path starting with "/"' },
  );


const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value === '' ? undefined : value));

export const dimensionsSchema = z.object({
  length: z.string().trim().max(40).optional().default(''),
  width: z.string().trim().max(40).optional().default(''),
  height: z.string().trim().max(40).optional().default(''),
  weight: z.string().trim().max(40).optional().default(''),
  unit: z.string().trim().max(20).optional().default('inches'),
});

export const inventorySchema = z.object({
  quantity: z.coerce.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  reserved: z.coerce.number().int().min(0).optional().default(0),
  lowStockThreshold: z.coerce.number().int().min(0).optional().default(5),
  trackInventory: z.boolean().optional().default(true),
});

export const customizationOptionSchema = z.object({
  id: z.string().trim().min(1, 'Option ID is required'),
  name: z.string().trim().min(1, 'Option name is required'),
  price: z.coerce.number().min(0, 'Option price cannot be negative').optional().default(0),
  description: optionalText(200),
  image: optionalText(500),
  available: z.boolean().optional().default(true),
});

export const customizationSectionSchema = z.object({
  id: z.string().trim().min(1, 'Section ID is required'),
  title: z.string().trim().min(1, 'Section title is required'),
  description: optionalText(200),
  required: z.boolean().optional().default(false),
  type: z.enum(['single', 'multiple']).optional().default('single'),
  options: z.array(customizationOptionSchema).min(1, 'At least one option is required'),
});





export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),

  slug: optionalText(120),

  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),

  shortDescription: optionalText(500),
  brand: z.string().trim().min(1, 'Brand is required').max(80),

  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: 'Please choose a valid category' }),
  }),

  subcategory: z.string().trim().max(80).optional().default(''),
  tags: z.array(z.string().trim().max(40)).optional().default([]),

  basePrice: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(100_000_000, 'Price is unrealistically high'),

  originalPrice: z.coerce.number().min(0, 'Original price cannot be negative').optional(),
  costPrice: z.coerce.number().min(0, 'Cost price cannot be negative').optional(),
  currency: z.string().trim().max(8).optional().default('INR'),

  images: z
    .array(imageUrl)
    .min(1, 'At least one image is required')
    .max(10, 'A product can have up to 10 images'),

  videos: z.array(z.string().trim().max(500)).optional().default([]),

  dimensions: dimensionsSchema.optional().default({
    length: '',
    width: '',
    height: '',
    weight: '',
    unit: 'inches',
  }),

  materials: z.array(z.string().trim().min(1)).max(20).optional().default([]),
  colors: z.array(z.string().trim().min(1)).max(20).optional().default([]),
  styles: z.array(z.string().trim().min(1)).max(20).optional().default([]),
  features: z.array(z.string().trim().max(300)).max(30).optional().default([]),

  customization: z.array(customizationSectionSchema).max(20).optional().default([]),

  inventory: inventorySchema.optional().default({
    quantity: 0,
    reserved: 0,
    lowStockThreshold: 5,
    trackInventory: true,
  }),

  shipping: z
    .object({
      weight: z.coerce.number().min(0).optional().default(0),
      dimensions: z
        .object({
          length: z.coerce.number().min(0).optional().default(0),
          width: z.coerce.number().min(0).optional().default(0),
          height: z.coerce.number().min(0).optional().default(0),
        })
        .optional(),
      freeShipping: z.boolean().optional().default(false),
      shippingClass: z.enum(['standard', 'white-glove', 'freight']).optional().default('standard'),
    })
    .optional(),

  status: z.enum(PRODUCT_STATUSES).optional().default('draft'),
  featured: z.boolean().optional().default(false),
  bestseller: z.boolean().optional().default(false),
  newArrival: z.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();





const booleanParam = z
  .enum(['true', 'false', '1', '0'])
  .transform((value) => value === 'true' || value === '1');

const optionalNumberParam = z
  .string()
  .trim()
  .regex(/^\d+(\.\d+)?$/, 'Must be a number')
  .transform(Number)
  .optional();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').optional().default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional().default(20),
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(40).optional(),
  subcategory: z.string().trim().max(40).optional(),
  minPrice: optionalNumberParam,
  maxPrice: optionalNumberParam,
  priceMin: optionalNumberParam,
  priceMax: optionalNumberParam,
  sortBy: z.enum(SORT_OPTIONS).optional().default('featured'),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  featured: booleanParam.optional(),
  onSale: booleanParam.optional(),
  inStock: booleanParam.optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  includeInactive: booleanParam.optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
