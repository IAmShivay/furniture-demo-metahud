'use client';

import { useCallback } from 'react';

import { useAppDispatch } from '../store/hooks';
import { useLocalStorage } from './useLocalStorage';
import { addNotification } from '../store/slices/uiSlice';





export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const [wishlist, setWishlist] = useLocalStorage<string[]>('wishlist', []);

  const addToWishlist = useCallback(
    async (productId: string, productName: string) => {
      if (!wishlist.includes(productId)) {
        setWishlist([...wishlist, productId]);

        dispatch(
          addNotification({
            type: 'success',
            title: 'Added to Wishlist',
            message: `${productName} has been added to your wishlist!`,
            duration: 3000,
          }),
        );
      }
    },
    [wishlist, setWishlist, dispatch],
  );

  const removeFromWishlist = useCallback(
    async (productId: string, productName: string) => {
      setWishlist(wishlist.filter((id) => id !== productId));

      dispatch(
        addNotification({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `${productName} has been removed from your wishlist.`,
          duration: 3000,
        }),
      );
    },
    [wishlist, setWishlist, dispatch],
  );

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [
    wishlist,
  ]);

  const toggleWishlist = useCallback(
    (productId: string, productName: string) => {
      if (isInWishlist(productId)) {
        removeFromWishlist(productId, productName);
      } else {
        addToWishlist(productId, productName);
      }
    },
    [addToWishlist, removeFromWishlist, isInWishlist],
  );

  const clearWishlist = useCallback(async () => {
    setWishlist([]);

    dispatch(
      addNotification({
        type: 'info',
        title: 'Wishlist Cleared',
        message: 'All items have been removed from your wishlist.',
        duration: 3000,
      }),
    );
  }, [setWishlist, dispatch]);

  return {
    wishlist,
    wishlistItems: wishlist.map((productId) => ({ productId })),
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
    isLoading: false,
  };
};
