'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store';
import { hydrateCart } from '@/store/slices/cartSlice';
import { hydrateUser } from '@/store/slices/authSlice';
import { hydrateUi } from '@/store/slices/uiSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateCart());
    store.dispatch(hydrateUser());
    store.dispatch(hydrateUi());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
