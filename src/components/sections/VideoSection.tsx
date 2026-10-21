'use client';

import React, { useState } from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useGetFeaturedProductsQuery } from '../../store/api/productsApi';

const VideoSection: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const { data, isLoading } = useGetFeaturedProductsQuery();
  const products = data?.data?.items?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded-xl w-1/3 mx-auto" />
            <div className="h-6 bg-gray-200 rounded-xl w-1/2 mx-auto" />
            <div className="h-96 bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const active = products[activeProduct] as any;

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Eye className="w-6 h-6 text-amber-600" />
            <span className="text-amber-600 font-medium">Spotlight</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Featured Pieces</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A closer look at our most sought-after furniture, crafted for those who demand excellence
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Link href={`/product/${active?.id || active?._id}`} className="group block relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/3]">
                <img src={active?.images?.[0]} alt={active?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{active?.category}</span>
                  <h3 className="text-3xl font-bold text-white mt-3 mb-2">{active?.name}</h3>
                  <p className="text-gray-200 mb-4 line-clamp-2">{active?.shortDescription || active?.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">₹{active?.basePrice?.toLocaleString('en-IN')}</span>
                      {active?.originalPrice && active.originalPrice > active.basePrice && (
                        <span className="text-gray-400 line-through text-lg">₹{active.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Details</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {products.map((p: any, idx: number) => (
                <button
                  key={p.id || p._id}
                  onClick={() => setActiveProduct(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 ${
                    idx === activeProduct
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg scale-[1.02]'
                      : 'bg-white border-2 border-transparent shadow-md hover:shadow-lg hover:scale-[1.01]'
                  }`}
                >
                  <img src={p.images?.[0]} alt={p.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">{p.category}</p>
                    <h4 className="font-bold text-gray-900 truncate">{p.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-gray-900">₹{p.basePrice?.toLocaleString('en-IN')}</span>
                      {p.originalPrice && p.originalPrice > p.basePrice && (
                        <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                          {Math.round(((p.originalPrice - p.basePrice) / p.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                View All Products <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
