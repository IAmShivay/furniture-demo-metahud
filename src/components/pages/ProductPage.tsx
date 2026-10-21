'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Camera,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import AddToCartButton from '../product/AddToCartButton';
import { useWishlist } from '../../hooks/useWishlist';
import { useProduct } from '../../hooks/useProducts';
import SEOHead from '../../components/common/SEOHead';

const ProductPage: React.FC<{ productId?: string }> = ({ productId }) => {
  const params = useParams<{ id: string }>();
  const id = productId ?? params.id;
  const { product, loading, error } = useProduct(id || '');
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showARView, setShowARView] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;

  const handleWishlistToggle = () => {
    toggleWishlist(product.id, product.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead
        title={`${product.name} | LuxeHouse`}
        description={product.description.slice(0, 160)}
        keywords={`luxury furniture, ${product.name}, ${product.category}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images[0],
          brand: {
            '@type': 'Brand',
            name: product.brand
          },
          offers: {
            '@type': 'Offer',
            price: product.basePrice,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating.average,
            reviewCount: product.rating.count
          }
        }}
      />

      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-amber-600">Products</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 p-8">
            <div className="space-y-6">
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setShowARView(true)}
                    className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative bg-gray-100 rounded-lg overflow-hidden aspect-square transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-2 ring-amber-500'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isWishlisted
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={async () => {
                        const url = window.location.href;
                        if (navigator.share) {
                          try {
                            await navigator.share({ title: product.name, url });
                          } catch {}
                        } else {
                          await navigator.clipboard.writeText(url);
                        }
                      }}
                      className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating.average)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.average} ({product.rating.count} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.basePrice.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.originalPrice!.toLocaleString('en-IN')}
                      </span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Save ₹{(product.originalPrice! - product.basePrice).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-600 leading-relaxed font-playfair">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AddToCartButton
                  product={product as any}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {product.customization?.length > 0 ? 'Customize & Add to Cart' : `Add to Cart - ₹${(product.basePrice * quantity).toLocaleString('en-IN')}`}
                </AddToCartButton>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-600">2 Year Warranty</span>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-600">30 Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
