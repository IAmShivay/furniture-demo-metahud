





import './env';

import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { db } from '../src/db';
import { products, users } from '../src/db/schema';

const IMG = (id: string, width = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const seedProducts = [
  {
    name: 'Velvet Accent Chair',
    slug: 'velvet-accent-chair',
    description:
      'Luxurious velvet accent chair with solid hardwood frame and premium cushioning. Perfect for adding a touch of elegance to any living space.',
    shortDescription: 'Elegant velvet chair with hardwood frame',
    brand: 'LuxeHouse',
    category: 'chairs',
    subcategory: 'accent-chairs',
    tags: ['bestseller', 'premium', 'velvet'],
    basePrice: 899,
    originalPrice: 1199,
    images: [IMG('2082090', 600), IMG('1080696', 600)],
    dimensions: { length: '32"', width: '30"', height: '35"', weight: '45 lbs', unit: 'inches' },
    materials: ['Premium Velvet', 'Hardwood'],
    colors: ['Navy', 'Emerald', 'Blush'],
    styles: ['Modern', 'Contemporary'],
    features: ['Premium cushioning', 'Solid hardwood frame', 'Easy assembly'],
    inventory: { quantity: 25, reserved: 0, lowStockThreshold: 5, trackInventory: true },
    rating: { average: 4.8, count: 126 },
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    name: 'Scandinavian Dining Table',
    slug: 'scandinavian-dining-table',
    description:
      'Minimalist solid oak dining table with clean lines and sustainable finish. Seats 6 comfortably.',
    shortDescription: 'Solid oak dining table with clean lines',
    brand: 'LuxeHouse',
    category: 'tables',
    subcategory: 'dining-tables',
    tags: ['eco-friendly', 'handcrafted', 'oak'],
    basePrice: 1299,
    originalPrice: null,
    images: [IMG('1395967', 600)],
    dimensions: { length: '72"', width: '36"', height: '30"', weight: '85 lbs', unit: 'inches' },
    materials: ['Solid Oak'],
    colors: ['Natural Oak', 'Walnut'],
    styles: ['Scandinavian', 'Minimalist'],
    features: ['Sustainable finish', 'Seats 6', 'Easy assembly'],
    inventory: { quantity: 15, reserved: 0, lowStockThreshold: 3, trackInventory: true },
    rating: { average: 4.6, count: 84 },
    status: 'active',
    featured: true,
    bestseller: false,
    newArrival: true,
  },
  {
    name: 'Modern Sectional Sofa',
    slug: 'modern-sectional-sofa',
    description:
      'Contemporary L-shaped sectional with premium fabric and modular design. Perfect for large living spaces.',
    shortDescription: 'L-shaped sectional with premium fabric',
    brand: 'LuxeHouse',
    category: 'sofas',
    subcategory: 'sectionals',
    tags: ['bestseller', 'modular', 'premium'],
    basePrice: 2199,
    originalPrice: 2799,
    images: [IMG('1571460', 600), IMG('1571463', 600)],
    dimensions: { length: '108"', width: '75"', height: '32"', weight: '180 lbs', unit: 'inches' },
    materials: ['Performance Fabric', 'Steel Frame'],
    colors: ['Charcoal', 'Cream', 'Navy'],
    styles: ['Modern', 'Contemporary'],
    features: ['Modular design', 'Premium fabric', 'Steel frame'],
    inventory: { quantity: 8, reserved: 0, lowStockThreshold: 2, trackInventory: true },
    rating: { average: 4.9, count: 212 },
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    name: 'Executive Office Chair',
    slug: 'executive-office-chair',
    description:
      'Ergonomic office chair with premium leather and advanced lumbar support. Perfect for long work sessions.',
    shortDescription: 'Ergonomic chair with premium leather',
    brand: 'LuxeHouse',
    category: 'office',
    subcategory: 'office-chairs',
    tags: ['ergonomic', 'professional', 'leather'],
    basePrice: 649,
    originalPrice: 799,
    images: [IMG('534151', 600)],
    dimensions: { length: '26"', width: '26"', height: '42"', weight: '35 lbs', unit: 'inches' },
    materials: ['Premium Leather', 'Mesh'],
    colors: ['Black', 'Brown', 'White'],
    styles: ['Professional', 'Modern'],
    features: ['Adjustable height', 'Lumbar support', 'Ergonomic design'],
    inventory: { quantity: 20, reserved: 0, lowStockThreshold: 5, trackInventory: true },
    rating: { average: 4.4, count: 97 },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    name: 'Glass Coffee Table',
    slug: 'glass-coffee-table',
    description:
      'Elegant tempered glass coffee table with brushed steel frame. Modern design perfect for contemporary spaces.',
    shortDescription: 'Tempered glass table with steel frame',
    brand: 'LuxeHouse',
    category: 'tables',
    subcategory: 'coffee-tables',
    tags: ['modern', 'minimalist', 'glass'],
    basePrice: 599,
    originalPrice: null,
    images: [IMG('1350789', 600)],
    dimensions: { length: '48"', width: '24"', height: '18"', weight: '55 lbs', unit: 'inches' },
    materials: ['Tempered Glass', 'Steel'],
    colors: ['Clear', 'Smoked'],
    styles: ['Modern', 'Minimalist'],
    features: ['Tempered glass', 'Brushed steel frame', 'Easy assembly'],
    inventory: { quantity: 12, reserved: 0, lowStockThreshold: 3, trackInventory: true },
    rating: { average: 4.3, count: 61 },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  {
    name: 'Industrial Bookshelf',
    slug: 'industrial-bookshelf',
    description:
      'Industrial-style bookshelf with reclaimed wood and steel construction. Five tiers for ample storage.',
    shortDescription: 'Industrial bookshelf with reclaimed wood',
    brand: 'LuxeHouse',
    category: 'storage',
    subcategory: 'bookcases',
    tags: ['vintage', 'eco-friendly', 'handcrafted'],
    basePrice: 1199,
    originalPrice: null,
    images: [IMG('1112598', 600)],
    dimensions: { length: '36"', width: '12"', height: '72"', weight: '75 lbs', unit: 'inches' },
    materials: ['Reclaimed Wood', 'Steel'],
    colors: ['Natural', 'Dark Walnut'],
    styles: ['Industrial', 'Vintage'],
    features: ['Five tiers', 'Reclaimed wood', 'Steel construction'],
    inventory: { quantity: 10, reserved: 0, lowStockThreshold: 2, trackInventory: true },
    rating: { average: 4.5, count: 38 },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    name: 'Brass Arc Floor Lamp',
    slug: 'brass-arc-floor-lamp',
    description:
      'Sculptural brass arc floor lamp with a linen drum shade. A statement piece that casts a warm glow over reading corners.',
    shortDescription: 'Sculptural brass arc lamp with linen shade',
    brand: 'LuxeHouse',
    category: 'lighting',
    subcategory: 'floor-lamps',
    tags: ['statement', 'brass', 'warm'],
    basePrice: 429,
    originalPrice: 549,
    images: [IMG('1123262', 600)],
    dimensions: { length: '15"', width: '15"', height: '84"', weight: '22 lbs', unit: 'inches' },
    materials: ['Brass', 'Linen'],
    colors: ['Brass', 'Matte Black'],
    styles: ['Modern', 'Mid-Century'],
    features: ['Adjustable height', 'Linen drum shade', 'Foot switch'],
    inventory: { quantity: 18, reserved: 0, lowStockThreshold: 4, trackInventory: true },
    rating: { average: 4.7, count: 45 },
    status: 'active',
    featured: true,
    bestseller: false,
    newArrival: true,
  },
  {
    name: 'Marble Top Console',
    slug: 'marble-top-console',
    description:
      'Elegant console table with a genuine marble top and slim brass legs. Ideal for hallways and entryways.',
    shortDescription: 'Marble console table with brass legs',
    brand: 'LuxeHouse',
    category: 'decor',
    subcategory: 'console-tables',
    tags: ['marble', 'elegant', 'brass'],
    basePrice: 749,
    originalPrice: null,
    images: [IMG('1571468', 600)],
    dimensions: { length: '44"', width: '16"', height: '30"', weight: '48 lbs', unit: 'inches' },
    materials: ['Marble', 'Brass'],
    colors: ['White Marble', 'Green Marble'],
    styles: ['Contemporary', 'Classic'],
    features: ['Genuine marble top', 'Brass legs', 'Two storage drawers'],
    inventory: { quantity: 9, reserved: 0, lowStockThreshold: 3, trackInventory: true },
    rating: { average: 4.6, count: 29 },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    name: 'Upholstered Platform Bed',
    slug: 'upholstered-platform-bed',
    description:
      'King size platform bed with a tufted linen headboard and solid wood slat base. No box spring required.',
    shortDescription: 'Tufted linen platform bed with wood slats',
    brand: 'LuxeHouse',
    category: 'bedroom',
    subcategory: 'beds',
    tags: ['linen', 'tufted', 'king'],
    basePrice: 1899,
    originalPrice: 2399,
    images: [IMG('1743229', 600)],
    dimensions: { length: '84"', width: '80"', height: '48"', weight: '120 lbs', unit: 'inches' },
    materials: ['Linen', 'Solid Wood'],
    colors: ['Oatmeal', 'Charcoal', 'Navy'],
    styles: ['Contemporary', 'Minimalist'],
    features: ['Solid wood slat base', 'Tufted headboard', 'No box spring needed'],
    inventory: { quantity: 6, reserved: 0, lowStockThreshold: 2, trackInventory: true },
    rating: { average: 4.9, count: 73 },
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    name: 'Oak Dining Chair Set',
    slug: 'oak-dining-chair-set',
    description:
      'Set of four solid oak dining chairs with woven paper cord seats. Ergonomic curved backrest for long dinners.',
    shortDescription: 'Set of 4 solid oak dining chairs',
    brand: 'LuxeHouse',
    category: 'dining',
    subcategory: 'dining-chairs',
    tags: ['set-of-4', 'oak', 'scandinavian'],
    basePrice: 959,
    originalPrice: null,
    images: [IMG('1080696', 600)],
    dimensions: { length: '20"', width: '21"', height: '32"', weight: '18 lbs', unit: 'inches' },
    materials: ['Solid Oak', 'Paper Cord'],
    colors: ['Natural Oak', 'Black'],
    styles: ['Scandinavian', 'Japanese'],
    features: ['Set of four', 'Woven paper cord seat', 'Curved backrest'],
    inventory: { quantity: 14, reserved: 0, lowStockThreshold: 4, trackInventory: true },
    rating: { average: 4.5, count: 52 },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  {
    name: 'Lounge Loveseat',
    slug: 'lounge-loveseat',
    description:
      'Compact two-seater loveseat with deep seat cushions and tapered wooden legs. Ideal for apartments and reading nooks.',
    shortDescription: 'Compact two-seater loveseat',
    brand: 'LuxeHouse',
    category: 'sofas',
    subcategory: 'loveseats',
    tags: ['compact', 'apartment', 'fabric'],
    basePrice: 1349,
    originalPrice: null,
    images: [IMG('1571460', 600)],
    dimensions: { length: '62"', width: '34"', height: '31"', weight: '95 lbs', unit: 'inches' },
    materials: ['Performance Fabric', 'Rubberwood'],
    colors: ['Sage', 'Sand', 'Slate'],
    styles: ['Scandinavian', 'Modern'],
    features: ['Deep seat cushions', 'Tapered wooden legs', 'Removable covers'],
    inventory: { quantity: 11, reserved: 0, lowStockThreshold: 3, trackInventory: true },
    rating: { average: 4.4, count: 66 },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    name: 'Oak Storage Bench',
    slug: 'oak-storage-bench',
    description:
      'Solid oak bench with a hinged lift-up seat that hides generous storage space. Works as a shoe bench or coffee table.',
    shortDescription: 'Solid oak bench with lift-up storage',
    brand: 'LuxeHouse',
    category: 'storage',
    subcategory: 'benches',
    tags: ['storage', 'entryway', 'oak'],
    basePrice: 549,
    originalPrice: 649,
    images: [IMG('6585598', 600)],
    dimensions: { length: '42"', width: '16"', height: '18"', weight: '40 lbs', unit: 'inches' },
    materials: ['Solid Oak'],
    colors: ['Natural Oak', 'Espresso'],
    styles: ['Modern', 'Rustic'],
    features: ['Lift-up storage', 'Solid oak construction', 'Soft-close hinges'],
    inventory: { quantity: 7, reserved: 0, lowStockThreshold: 2, trackInventory: true },
    rating: { average: 4.2, count: 21 },
    status: 'draft',
    featured: false,
    bestseller: false,
    newArrival: true,
  },
];

async function main() {
  console.log('🌱 Seeding demo accounts…');

  await db.execute(sql`DELETE FROM users`);

  const demoUsers = [
    {
      name: 'Admin User',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@luxehouse.in',
      password: process.env.SEED_ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone: '+91 9547587246',
    },
    {
      name: 'Store Manager',
      email: process.env.SEED_MANAGER_EMAIL || 'manager@luxehouse.in',
      password: process.env.SEED_MANAGER_PASSWORD || 'manager123',
      role: 'manager',
      phone: '+91 9547587247',
    },
    {
      name: 'Support Agent',
      email: process.env.SEED_SUPPORT_EMAIL || 'support@luxehouse.in',
      password: process.env.SEED_SUPPORT_PASSWORD || 'support123',
      role: 'support',
      phone: '+91 9547587248',
    },
    {
      name: 'Happy Customer',
      email: process.env.SEED_CUSTOMER_EMAIL || 'customer@luxehouse.in',
      password: process.env.SEED_CUSTOMER_PASSWORD || 'customer123',
      role: 'customer',
      phone: '+91 9547587249',
    },
  ];

  await db.insert(users).values(
    await Promise.all(
      demoUsers.map(async (user) => ({
        name: user.name,
        email: user.email,
        passwordHash: await bcrypt.hash(user.password, 10),
        role: user.role,
        phone: user.phone,
        emailVerified: true,
        isActive: true,
      })),
    ),
  );

  console.log(`✅ Seeded ${demoUsers.length} demo accounts.`);

  console.log('🌱 Seeding products…');

  await db.execute(sql`DELETE FROM products`);

  await db.insert(products).values(
    seedProducts.map((product, index) => ({
      ...product,
      originalPrice:
        product.originalPrice === null ? null : product.originalPrice.toFixed(2),
      basePrice: product.basePrice.toFixed(2),
      onSale:
        product.originalPrice !== null && product.originalPrice > product.basePrice,
      currency: 'INR',
      tags: product.tags ?? [],
      videos: [],
      styles: product.styles ?? [],
      features: product.features ?? [],
      customization: [],
      shipping: null,
      costPrice: null,
      createdAt: new Date(Date.now() - index * 2 * 24 * 60 * 60 * 1000),
    })),
  );

  console.log(`✅ Seeded ${seedProducts.length} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
