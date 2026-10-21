'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, Star, Award, Truck } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { openQuickView } from '../../store/slices/uiSlice';
import { useWishlist } from '../../hooks/useWishlist';
import { useFeaturedProducts } from '../../hooks/useProducts';

interface ProductShowcaseProps {
  
}

const ProductShowcase: React.FC<ProductShowcaseProps> = () => {
  const dispatch = useAppDispatch();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products: featuredProducts, loading, error } = useFeaturedProducts();

  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  
  const products = featuredProducts || [];




  const handleWishlist = (productId: string, productName: string) => {
    toggleWishlist(productId, productName);
  };

  const handleQuickView = (product: any) => {
    dispatch(openQuickView(product));
  };

  
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-montserrat">
              Featured Products
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-montserrat">
              Featured Products
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">Failed to load products. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Award className="w-6 h-6 text-amber-600" />
            <span className="text-amber-600 font-medium font-montserrat">Featured Products</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Handpicked Excellence
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-playfair">
            Every piece in our collection is carefully selected for its exceptional quality, design innovation, and lasting beauty
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02]"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {}
              <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
                {product.onSale && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Sale
                  </span>
                )}
                {product.newArrival && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    New
                  </span>
                )}
                {product.bestseller && (
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Bestseller
                  </span>
                )}
                {product.featured && (
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Featured
                  </span>
                )}
              </div>

              {}
              <button
                onClick={() => handleWishlist((product as any).id || (product as any)._id, product.name)}
                className="absolute top-4 right-4 z-20 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 group/heart"
              >
                <Heart className={`w-5 h-5 transition-colors ${
                  isInWishlist((product as any).id || (product as any)._id)
                    ? 'text-red-500 fill-current'
                    : 'text-gray-600 group-hover/heart:text-red-500'
                }`} />
              </button>

              {}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {product.images[1] && hoveredProduct === product.id && (
                  <img
                    src={product.images[1]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  />
                )}

                {}
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Link
                    href={`/product/${product.id}`}
                    className="bg-amber-600 text-white p-3 rounded-full hover:bg-amber-700 transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>

                {}
                {(product.inventory?.quantity === 0) && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="bg-white px-6 py-3 rounded-full">
                      <span className="text-gray-900 font-semibold">Out of Stock</span>
                    </div>
                  </div>
                )}

                {}
                {(product.basePrice || product.price || 0) >= 599 && (
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>Free Shipping</span>
                  </div>
                )}
              </div>

              {}
              <div className="p-6">
                {}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-amber-600 font-medium font-montserrat">{product.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{product.rating?.average || 0}</span>
                    <span className="text-sm text-gray-400">({product.rating?.count || 0})</span>
                  </div>
                </div>

                {}
                <Link href={`/product/${(product as any).id || (product as any)._id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-montserrat hover:text-amber-600 transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                </Link>

                {}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-playfair leading-relaxed">
                  {product.description}
                </p>

                {}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900 font-montserrat">₹{(product.basePrice || product.price || 0).toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  {product.colors && (
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 3).map((color: string, idx: number) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
                          style={{ 
                            backgroundColor: color === 'Navy' ? '#1e3a8a' : 
                                           color === 'Emerald' ? '#059669' : 
                                           color === 'Blush' ? '#f3e8ff' : '#9ca3af' 
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {}
                {(product as any).sku && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-montserrat">SKU: {(product as any).sku}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center space-x-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group font-montserrat"
          >
            <span>View All Products</span>
            <Eye className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;