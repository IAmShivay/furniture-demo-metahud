'use client';

import { useMemo } from 'react';
import {
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useSearchProductsQuery,
  type ProductFilters
} from '../store/api/productsApi';

const normalizeProduct = (p: any) => {
  if (!p) return null;
  return { ...p, id: p.id || p._id };
};

export const useProducts = (filters: ProductFilters = {}) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery(filters);

  const products = useMemo(() => (data?.data?.items || []).map(normalizeProduct), [data]);
  const pagination = useMemo(() => data?.data?.pagination || {
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  }, [data]);

  return {
    products,
    pagination,
    loading: isLoading,
    error: error ? 'Failed to fetch products' : null,
    refetch,
  };
};

export const useProduct = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetProductQuery(id, {
    skip: !id,
  });

  const product = useMemo(() => normalizeProduct(data?.data?.product || null), [data]);

  return {
    product,
    loading: isLoading,
    error: error ? 'Failed to fetch product' : null,
    refetch,
  };
};

export const useFeaturedProducts = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetFeaturedProductsQuery();

  const products = useMemo(() => (data?.data?.items || []).map(normalizeProduct), [data]);

  return {
    products,
    loading: isLoading,
    error: error ? 'Failed to fetch featured products' : null,
    refetch,
  };
};

export const useProductSearch = (query: string, filters: ProductFilters = {}) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useSearchProductsQuery(
    { query, filters },
    {
      skip: !query || query.trim().length < 2,
    }
  );

  const products = useMemo(() => (data?.data?.items || []).map(normalizeProduct), [data]);
  const pagination = useMemo(() => data?.data?.pagination || {
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  }, [data]);

  return {
    products,
    pagination,
    loading: isLoading,
    error: error ? 'Search failed' : null,
    refetch,
  };
};
