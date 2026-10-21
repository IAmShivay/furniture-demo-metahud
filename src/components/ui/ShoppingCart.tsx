'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Truck, Shield, ArrowRight } from 'lucide-react';
import { CartItem } from '../../store/slices/cartSlice';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!isOpen) return null;

  return (
    <>
      {}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      {}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto">
        {}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
              Shopping Cart
            </h2>
            <p className="text-sm text-gray-600 font-playfair">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center h-96 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 font-montserrat">Your cart is empty</h3>
            <p className="text-gray-600 text-center mb-8 font-playfair leading-relaxed">
              Discover our amazing furniture collection and find something you love
            </p>
            <button
              onClick={onClose}
              className="bg-amber-600 text-white px-8 py-3 rounded-xl hover:bg-amber-700 transition-colors duration-200 font-semibold font-montserrat"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {}
            <div className="flex-1 p-6 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4 border-b border-gray-100 pb-6">
                  {}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-sm"
                    />
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate font-montserrat">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1 font-playfair">{item.variant || 'Standard'}</p>
                    <p className="text-sm text-gray-600 font-playfair">SKU: {item.sku || item.productId}</p>
                    
                    {item.customization && (
                      <div className="text-sm text-gray-600 font-playfair space-y-1">
                        {item.customization.color && (
                          <p>Color: {String(item.customization.color)}</p>
                        )}
                        {item.customization.woodType && (
                          <p>Wood: {String(item.customization.woodType)}</p>
                        )}
                        {item.customization.finish && (
                          <p>Finish: {String(item.customization.finish)}</p>
                        )}
                        {item.customization.assembly && (
                          <p>Assembly: {String(item.customization.assembly)}</p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {}
                      <div className="flex items-center space-x-3 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-2 hover:bg-gray-50 transition-colors duration-200 rounded-l-lg"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 py-2 text-gray-900 font-medium font-montserrat">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors duration-200 rounded-r-lg"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      
                      {}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 font-montserrat">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200 font-playfair"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="border-t border-gray-200 p-6 space-y-6 bg-gray-50">
              {}
              {subtotal < 1000 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <p className="text-sm font-medium text-amber-800 font-montserrat">
                      Add ₹{(1000 - subtotal).toFixed(2)} more for free white-glove delivery!
                    </p>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600 font-playfair">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-playfair">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-playfair">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900 font-montserrat">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {}
              <div className="flex items-center justify-center space-x-6 py-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-playfair">Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-playfair">Free Returns</span>
                </div>
              </div>

              {}
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-amber-600 text-white py-4 rounded-xl font-semibold hover:bg-amber-700 transition-colors duration-200 text-lg font-montserrat flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 font-montserrat"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;