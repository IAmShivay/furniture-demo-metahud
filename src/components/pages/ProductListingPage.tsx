'use client';

import React, { useState } from 'react';
import {
  Heart,
  Star,
  Eye,
  Filter,
  Grid,
  List,
  ChevronDown,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '../../hooks/useProducts';
import { useGetCategoriesQuery } from '../../store/api/productsApi';
import { formatPrice } from '../../utils/cartUtils';
import SEOHead from '../../components/common/SEOHead';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  category: string;
  isNew: boolean;
  isBestseller: boolean;
}

const ProductListingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchQuery, setSearchQuery] = useState('');

  
  const { data: categoriesData } = useGetCategoriesQuery();

  
  const { products: apiProducts, loading, error } = useProducts({
    limit: 20,
    search: searchQuery,
    category: filterCategory !== 'all' ? filterCategory : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
    sortBy: sortBy,
  });

  const products: Product[] = (apiProducts || []).map((product: any) => ({
    id: product._id || product.id,
    name: product.name,
    brand: product.brand || 'LuxeHouse',
    price: product.basePrice || product.price,
    originalPrice: product.originalPrice,
    rating: product.rating?.average || 0,
    reviews: product.rating?.count || 0,
    image: product.images?.[0] || '',
    category: product.category,
    colors: product.colors || [],
    isNew: product.newArrival,
    isBestseller: product.bestseller,
  }));

  const categories = [
    { id: 'all', name: 'All Categories' },
    ...((categoriesData?.data || []) as any[]).map((c: any) => ({
      id: c._id,
      name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
    })),
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest First' },
  ];

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-105 transform-gpu">
      {}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {}
        <div className="absolute top-4 left-4 space-y-2">
          {product.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              BESTSELLER
            </span>
          )}
        </div>

        {}
        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200">
            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        {}
        {product.originalPrice > product.price && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      {}
      <div className="p-6 space-y-4">
        {}
        <div>
          <div className="text-sm text-amber-600 font-semibold uppercase tracking-wider">
            {product.brand}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat line-clamp-2">
            {product.name}
          </h3>
        </div>

        {}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Colors:</span>
          <div className="flex space-x-1">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-lg text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {}
        <Link
          href={`/product/${product.id}`}
          className="w-full bg-amber-500 text-white py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 hover:bg-amber-600 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Product</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead
        title="Premium Furniture Collection | LuxeHouse"
        description="Browse our curated collection of premium furniture. Shop sofas, chairs, tables, and more with free delivery."
        keywords="buy furniture online, premium furniture, sofas, chairs, tables, home decor"
      />
      {}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
              Premium Furniture Collection
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair">
              Discover our curated selection of luxury furniture pieces
            </p>
            <div className="flex items-center justify-center flex-wrap space-x-4 sm:space-x-6 lg:space-x-8 text-sm text-gray-600">
              <span>✓ Premium Quality</span>
              <span>✓ Free Shipping</span>
              <span>✓ Expert Curation</span>
              <span>✓ {products.length} Products Available</span>
            </div>
          </div>
        </div>
      </section>

      {}
      <div className="container mx-auto px-6 py-12">

        {}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            {}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            {}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600">
            Showing {products.length} of {products.length} products
          </span>
        </div>

        {}
        <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
