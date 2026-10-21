export interface ProductCustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
}

export interface ProductCustomization {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  type: 'single' | 'multiple';
  options: ProductCustomizationOption[];
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
  weight?: number;
  unit?: string;
}

export interface ProductShipping {
  weight: number;
  freeShipping?: boolean;
  estimatedDays?: number;
  shippingCost?: number;
}

export interface Product {
  id: string;
  _id: string;
  name: string;
  slug?: string;
  brand?: string;
  basePrice: number;
  price?: number;
  originalPrice?: number;
  images: string[];
  image?: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription?: string;
  specifications?: Record<string, string>;
  features?: string[];
  inStock?: boolean;
  rating?: { average: number; count: number };
  reviewCount?: number;
  colors?: string[];
  materials?: string[];
  styles?: string[];
  tags?: string[];
  customization?: ProductCustomization[];  inventory?: { quantity: number; reserved: number; lowStockThreshold: number };
  status?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
  dimensions?: ProductDimensions;
  shipping?: ProductShipping;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  materials: string[];
  inStock: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface BrandInfo {
  name: string;
  tagline: string;
  description: string;
  founded: string;
  location: string;
  values: string[];
}

export interface ContactInfo {
  phone: string;
  whatsapp?: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  hours: {
    weekdays: string;
    weekends: string;
  };
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  pinterest?: string;
  youtube?: string;
}