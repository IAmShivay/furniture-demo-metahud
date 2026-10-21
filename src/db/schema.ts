import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';





export interface ProductDimensions {
  length: string;
  width: string;
  height: string;
  weight: string;
  unit?: string;
}

export interface ProductInventory {
  quantity: number;
  reserved: number;
  lowStockThreshold: number;
  trackInventory: boolean;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductShipping {
  weight: number;
  dimensions?: { length: number; width: number; height: number };
  freeShipping: boolean;
  shippingClass: 'standard' | 'white-glove' | 'freight';
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
}

export interface CustomizationSection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  type: 'single' | 'multiple';
  options: CustomizationOption[];
}





export const products = pgTable(
  'products',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description').notNull(),
    shortDescription: text('short_description'),
    brand: text('brand').notNull().default('LuxeHouse'),

    category: text('category').notNull(),
    subcategory: text('subcategory').notNull().default(''),
    tags: text('tags')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    basePrice: numeric('base_price', { precision: 12, scale: 2 }).notNull(),
    originalPrice: numeric('original_price', { precision: 12, scale: 2 }),
    costPrice: numeric('cost_price', { precision: 12, scale: 2 }),
    currency: text('currency').notNull().default('INR'),

    images: text('images')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    videos: text('videos')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    dimensions: jsonb('dimensions').$type<ProductDimensions>().notNull(),
    materials: text('materials')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    colors: text('colors')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    styles: text('styles')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    features: text('features')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    customization: jsonb('customization')
      .$type<CustomizationSection[]>()
      .notNull()
      .default([]),

    inventory: jsonb('inventory').$type<ProductInventory>().notNull(),
    shipping: jsonb('shipping').$type<ProductShipping>(),
    rating: jsonb('rating').$type<ProductRating>().notNull().default({ average: 0, count: 0 }),

    status: text('status').notNull().default('draft'),
    featured: boolean('featured').notNull().default(false),
    bestseller: boolean('bestseller').notNull().default(false),
    newArrival: boolean('new_arrival').notNull().default(false),
    onSale: boolean('on_sale').notNull().default(false),

    viewCount: integer('view_count').notNull().default(0),
    salesCount: integer('sales_count').notNull().default(0),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex('products_slug_unique').on(table.slug),
    categoryIdx: index('products_category_idx').on(table.category),
    statusIdx: index('products_status_idx').on(table.status),
    priceIdx: index('products_price_idx').on(table.basePrice),
    createdAtIdx: index('products_created_at_idx').on(table.createdAt),
    nameIdx: index('products_name_idx').on(table.name),
  }),
);

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;





export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex('newsletter_email_unique').on(table.email),
  }),
);

export type NewsletterSubscriberRow = typeof newsletterSubscribers.$inferSelect;





export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  notifications?: { email?: boolean; sms?: boolean };
  newsletter?: boolean;
}

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    name: text('name').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),

    role: text('role').notNull().default('customer'),
    phone: text('phone'),
    avatar: text('avatar'),

    isActive: boolean('is_active').notNull().default(true),
    emailVerified: boolean('email_verified').notNull().default(false),

    addresses: jsonb('addresses').$type<UserAddress[]>().notNull().default([]),
    preferences: jsonb('preferences').$type<UserPreferences>().notNull().default({}),

    lastLogin: timestamp('last_login', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex('users_email_unique').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  }),
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
