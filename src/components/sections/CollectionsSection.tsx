'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useGetCategoriesQuery } from '../../store/api/productsApi';
import { categoryImages, categoryDescriptions, capitalize } from '../../constants/categoryMapping';

const CollectionsSection: React.FC = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data ?? [];

  const collections = categories.slice(0, 4).map((cat) => ({
    id: cat._id,
    name: capitalize(cat._id),
    description: categoryDescriptions[cat._id] || 'Explore our curated selection',
    image: categoryImages[cat._id] || 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    productCount: cat.count,
    slug: cat._id,
  }));

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <span className="text-amber-600 font-medium font-montserrat">Curated Collections</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Signature Collections
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-playfair">
            Each collection tells a story of craftsmanship, design excellence, and the art of living beautifully
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`transform ${i % 2 === 0 ? 'md:translate-y-8' : ''}`}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
                  <div className="h-96 lg:h-[500px] bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 font-playfair">No collections available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {collections.map((collection, index) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className={`group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] block ${
                  index % 2 === 0 ? 'md:translate-y-8' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-96 lg:h-[500px] overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="text-sm font-semibold text-gray-900 font-montserrat">
                        {collection.productCount} pieces
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-montserrat">
                        {collection.name}
                      </h3>
                      <p className="text-gray-200 text-lg mb-6 leading-relaxed font-playfair">
                        {collection.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <span className="text-lg font-semibold font-montserrat">Explore Collection</span>
                          <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center space-x-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group font-montserrat"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
