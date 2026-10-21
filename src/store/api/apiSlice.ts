'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';






const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Product',
    'Order',
    'Cart',
    'Wishlist',
    'Review',
    'Category',
    'Admin',
    'BlogPost',
    'Gallery',
    'Invoice',
  ],
  endpoints: (builder) => ({
    
    healthCheck: builder.query<{ status: string }, void>({
      query: () => '/health',
    }),
  }),
});

export const { useHealthCheckQuery } = apiSlice;
