'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  toggleCart,
  openCart,
  closeCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartIsOpen,
  selectCartLoading,
  selectCartError,
  type CartItem
} from '../store/slices/cartSlice';
import { addNotification } from '../store/slices/uiSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();

  
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);
  const isOpen = useAppSelector(selectCartIsOpen);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);

  
  const addToCart = useCallback((
    productId: string,
    name: string,
    price: number,
    image: string,
    quantity: number = 1,
    customization?: any
  ) => {
    const cartItem: Omit<CartItem, 'id'> & { quantity?: number } = {
      productId,
      name,
      price,
      image,
      quantity,
      customization,
    };

    dispatch(addToCartAction({
      ...cartItem,
      id: `${productId}-${Date.now()}`,
    }));

    
    dispatch(addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${name} has been added to your cart!`,
      duration: 3000,
    }));
  }, [dispatch]);

  const removeFromCart = useCallback((id: string) => {
    dispatch(removeFromCartAction(id));

    dispatch(addNotification({
      type: 'info',
      title: 'Removed from Cart',
      message: 'Item has been removed from your cart.',
      duration: 3000,
    }));
  }, [dispatch]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch(updateQuantityAction({ id, quantity }));
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());

    dispatch(addNotification({
      type: 'info',
      title: 'Cart Cleared',
      message: 'All items have been removed from your cart.',
      duration: 3000,
    }));
  }, [dispatch]);

  const toggleCartDrawer = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const openCartDrawer = useCallback(() => {
    dispatch(openCart());
  }, [dispatch]);

  const closeCartDrawer = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const isInCart = useCallback((productId: string, customization?: any) => {
    return cartItems.some(item =>
      item.productId === productId &&
      JSON.stringify(item.customization) === JSON.stringify(customization)
    );
  }, [cartItems]);

  const getCartItem = useCallback((productId: string, customization?: any) => {
    return cartItems.find(item =>
      item.productId === productId &&
      JSON.stringify(item.customization) === JSON.stringify(customization)
    );
  }, [cartItems]);

  return {
    
    cartItems,
    total,
    itemCount,
    isOpen,
    loading,
    error,

    
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCartDrawer,
    openCartDrawer,
    closeCartDrawer,

    
    isInCart,
    getCartItem,
  };
};