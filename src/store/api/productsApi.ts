'use client';

import { apiSlice } from './apiSlice';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: string;
  category: string;
  subcategory: string;
  basePrice: number;
  originalPrice?: number;
  images: string[];
  dimensions: {
    length: string;
    width: string;
    height: string;
    weight: string;
    unit?: string;
  };
  materials: string[];
  colors: string[];
  styles: string[];
  features: string[];
  customization: any[];
  inventory: {
    quantity: number;
    reserved: number;
    lowStockThreshold: number;
  };
  rating: {
    average: number;
    count: number;
  };
  status: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  onSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  colors?: string[];
  styles?: string[];
  brands?: string[];
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  includeInactive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  success: boolean;
  data: {
    items: Product[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getProducts: builder.query<ProductsResponse, ProductFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });
        
        return `/products?${params.toString()}`;
      },
      providesTags: (result) =>
        result && result.data && result.data.items
          ? [
              ...result.data.items.map((product: any) => ({ type: 'Product' as const, id: product._id || product.id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    
    
    getProduct: builder.query<ProductResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    
    getFeaturedProducts: builder.query<ProductsResponse, void>({
      query: () => '/products/featured',
      providesTags: [{ type: 'Product', id: 'FEATURED' }],
    }),
    
    
    getProductsByCategory: builder.query<ProductsResponse, string>({
      query: (category) => `/products/category/${category}`,
      providesTags: (result, error, category) => [{ type: 'Product', id: `CATEGORY_${category}` }],
    }),
    
    
    searchProducts: builder.query<ProductsResponse, { query: string; filters?: ProductFilters }>({
      query: ({ query, filters = {} }) => {
        const params = new URLSearchParams({ search: query });
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });
        
        return `/products/search?${params.toString()}`;
      },
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),
    
    
    getProductReviews: builder.query<any, { productId: string; page?: number; limit?: number }>({
      query: ({ productId, page = 1, limit = 10 }) => 
        `/products/${productId}/reviews?page=${page}&limit=${limit}`,
      providesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
    }),
    
    
    addProductReview: builder.mutation<any, { 
      productId: string; 
      rating: number; 
      title: string; 
      comment: string; 
      images?: string[] 
    }>({
      query: ({ productId, ...review }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId },
        { type: 'Product', id: productId },
      ],
    }),
    
    
    getCategories: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => '/products/categories',
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    
    
    getFiltersData: builder.query<any, void>({
      query: () => '/products/filters',
      providesTags: [{ type: 'Category', id: 'FILTERS' }],
    }),

    
    createProduct: builder.mutation<{ success: boolean; data: Product }, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'FEATURED' }, { type: 'Category', id: 'LIST' }],
    }),

    
    updateProduct: builder.mutation<{ success: boolean; data: Product }, { id: string; updates: Partial<Product> }>({
      query: ({ id, updates }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'FEATURED' },
      ],
    }),

    
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'FEATURED' }, { type: 'Category', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetProductReviewsQuery,
  useAddProductReviewMutation,
  useGetCategoriesQuery,
  useGetFiltersDataQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
