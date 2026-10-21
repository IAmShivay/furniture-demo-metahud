import { Product } from '../types';
import { CartItem } from '../store/slices/cartSlice';




export const addProductToCart = (
  product: Product,
  quantity: number = 1,
  customization?: any
): Omit<CartItem, 'id'> => {
  return {
    productId: product.id,
    name: product.name,
    price: product.basePrice ?? product.price ?? 0,
    image: product.images[0],
    quantity,
    customization,
  };
};




export const calculateItemTotal = (item: CartItem): number => {
  const basePrice = item.price;
  const customizationCost = item.customization?.customizationCost || 0;
  return (basePrice + customizationCost) * item.quantity;
};




export const calculateCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
};




export const calculateTax = (subtotal: number, taxRate: number = 0.08): number => {
  return subtotal * taxRate;
};




export const calculateShipping = (subtotal: number, freeShippingThreshold: number = 500): number => {
  return subtotal >= freeShippingThreshold ? 0 : 50;
};




export const calculateCartTotal = (
  items: CartItem[],
  taxRate: number = 0.08,
  freeShippingThreshold: number = 500
): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} => {
  const subtotal = calculateCartSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShipping(subtotal, freeShippingThreshold);
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};




export const formatPrice = (price: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(price);
};




export const areCartItemsEqual = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.productId === item2.productId &&
    JSON.stringify(item1.customization) === JSON.stringify(item2.customization)
  );
};




export const generateCartItemId = (productId: string, customization?: any): string => {
  const customizationHash = customization 
    ? btoa(JSON.stringify(customization)).slice(0, 8)
    : 'default';
  return `${productId}-${customizationHash}-${Date.now()}`;
};




export const validateQuantity = (quantity: number, maxQuantity?: number): boolean => {
  if (quantity < 1) return false;
  if (maxQuantity && quantity > maxQuantity) return false;
  return true;
};




export const getCartItemDisplayName = (item: CartItem): string => {
  let displayName = item.name;
  
  if (item.customization) {
    const customizations = [];
    
    if (item.customization.woodType) {
      customizations.push(item.customization.woodType);
    }
    
    if (item.customization.finish) {
      customizations.push(item.customization.finish);
    }
    
    if (item.customization.color) {
      customizations.push(item.customization.color);
    }
    
    if (customizations.length > 0) {
      displayName += ` (${customizations.join(', ')})`;
    }
  }
  
  return displayName;
};




export const calculateSavings = (originalPrice: number, salePrice: number): number => {
  return Math.max(0, originalPrice - salePrice);
};




export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};




export const isProductOnSale = (product: Product): boolean => {
  return !!(product.originalPrice && product.originalPrice > (product.basePrice ?? product.price ?? 0));
};




export const getProductSaleInfo = (product: Product) => {
  if (!isProductOnSale(product)) {
    return null;
  }
  
  const savings = calculateSavings(product.originalPrice!, product.basePrice ?? product.price ?? 0);
  const discountPercentage = calculateDiscountPercentage(product.originalPrice!, product.basePrice ?? product.price ?? 0);
  
  return {
    savings,
    discountPercentage,
    originalPrice: product.originalPrice!,
    salePrice: product.price,
  };
};
