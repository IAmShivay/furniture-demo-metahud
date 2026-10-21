'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoppingCart from '@/components/ui/ShoppingCart';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useCart } from '@/hooks/useCart';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const {
    cartItems,
    itemCount: cartItemCount,
    isOpen: isCartOpen,
    openCartDrawer: handleCartClick,
    closeCartDrawer: handleCloseCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-white">
      <ErrorBoundary>
        <Header cartCount={cartItemCount} onCartClick={handleCartClick} />

        <main>{children}</main>

        <Footer />

        <ShoppingCart
          isOpen={isCartOpen}
          onClose={handleCloseCart}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
        />
      </ErrorBoundary>
    </div>
  );
}
