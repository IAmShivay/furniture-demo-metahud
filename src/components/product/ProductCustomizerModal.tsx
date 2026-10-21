'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingBag, Heart, Plus, Minus } from 'lucide-react';
import ProductCustomizer from './ProductCustomizer';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatPrice } from '../../utils/cartUtils';
import { Product } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  className?: string;
}

const ProductCustomizerModal: React.FC<Props> = ({ isOpen, onClose, product, className = '' }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const customRef = useRef<{ data: any; cost: number }>({ data: {}, cost: 0 });
  const [displayCost, setDisplayCost] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedImage(0);
      customRef.current = { data: {}, cost: 0 };
      setDisplayCost(0);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCustomizationChange = useCallback((data: any, cost: number) => {
    customRef.current = { data, cost };
    setDisplayCost(cost);
  }, []);

  const handleAddToCart = useCallback(() => {
    const price = (product.basePrice ?? product.price ?? 0) + customRef.current.cost;
    addToCart(product.id || product._id, product.name, price, product.images?.[selectedImage] || product.image || '', quantity, customRef.current.data);
    onClose();
  }, [product, selectedImage, quantity, addToCart, onClose]);

  const wishlisted = isInWishlist(product.id || product._id);
  const basePrice = product.basePrice || product.price || 0;
  const finalPrice = basePrice + displayCost;
  const hasCustomization = product.customization && product.customization.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col ${className}`}>
        {}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {}
            <div className="md:col-span-2 p-4 md:border-r border-gray-100">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                <img src={product.images?.[selectedImage] || ''} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 ${selectedImage === i ? 'border-amber-500' : 'border-gray-200'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
              {}
              <div className="mt-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
                  {product.originalPrice && product.originalPrice > basePrice && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                {displayCost > 0 && (
                  <p className="text-xs text-amber-600 font-medium mb-2">Includes +{formatPrice(displayCost)} in customizations</p>
                )}
                <p className="text-sm text-gray-500 line-clamp-3">{product.shortDescription || product.description}</p>
              </div>
            </div>

            {}
            <div className="md:col-span-3 p-4">
              {hasCustomization && (
                <ProductCustomizer
                  customization={product.customization!}
                  onCustomizationChange={handleCustomizationChange}
                />
              )}

              {}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-600">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2.5 py-1.5 hover:bg-gray-50" disabled={quantity <= 1}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-2.5 py-1.5 hover:bg-gray-50">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl shrink-0">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Total</p>
            <p className="text-xl font-bold text-gray-900">{formatPrice(finalPrice * quantity)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleWishlist(product.id || product._id, product.name)}
              className={`p-2.5 rounded-xl border-2 transition-colors ${wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-400'}`}>
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleAddToCart}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-colors text-sm">
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCustomizerModal);
