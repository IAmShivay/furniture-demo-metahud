'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../lib/storage';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Modal {
  id: string;
  type: string;
  props?: any;
  isOpen: boolean;
}

interface UIState {
  
  globalLoading: boolean;
  pageLoading: boolean;
  
  
  notifications: Notification[];
  
  
  modals: Modal[];
  
  
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  
  searchOpen: boolean;
  searchQuery: string;
  
  
  filtersOpen: boolean;
  
  
  theme: 'light' | 'dark';
  
  
  layout: 'grid' | 'list';
  
  
  wishlistOpen: boolean;
  
  
  quickViewOpen: boolean;
  quickViewProduct: any;
}

const initialState: UIState = {
  globalLoading: false,
  pageLoading: false,
  notifications: [],
  modals: [],
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  searchQuery: '',
  filtersOpen: true,
  theme: 'light',
  layout: 'grid',
  wishlistOpen: false,
  quickViewOpen: false,
  quickViewProduct: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    hydrateUi: (state) => {
      const theme = storage.get('theme');
      const layout = storage.get('layout');

      if (theme === 'light' || theme === 'dark') state.theme = theme;
      if (layout === 'grid' || layout === 'list') state.layout = layout;
    },

    
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    
    
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    
    openModal: (state, action: PayloadAction<{ type: string; props?: any }>) => {
      const modal: Modal = {
        id: Date.now().toString(),
        type: action.payload.type,
        props: action.payload.props,
        isOpen: true,
      };
      state.modals.push(modal);
    },
    
    closeModal: (state, action: PayloadAction<string>) => {
      const modalIndex = state.modals.findIndex(modal => modal.id === action.payload);
      if (modalIndex >= 0) {
        state.modals[modalIndex].isOpen = false;
      }
    },
    
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(modal => modal.id !== action.payload);
    },
    
    closeAllModals: (state) => {
      state.modals.forEach(modal => {
        modal.isOpen = false;
      });
    },
    
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    
    
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
      if (!state.searchOpen) {
        state.searchQuery = '';
      }
    },
    
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
      if (!action.payload) {
        state.searchQuery = '';
      }
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    
    toggleFilters: (state) => {
      state.filtersOpen = !state.filtersOpen;
    },
    
    setFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.filtersOpen = action.payload;
    },
    
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      storage.set('theme', state.theme);
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      storage.set('theme', action.payload);
    },
    
    
    toggleLayout: (state) => {
      state.layout = state.layout === 'grid' ? 'list' : 'grid';
      storage.set('layout', state.layout);
    },
    
    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layout = action.payload;
      storage.set('layout', action.payload);
    },
    
    
    toggleWishlist: (state) => {
      state.wishlistOpen = !state.wishlistOpen;
    },
    
    setWishlistOpen: (state, action: PayloadAction<boolean>) => {
      state.wishlistOpen = action.payload;
    },
    
    
    openQuickView: (state, action: PayloadAction<any>) => {
      state.quickViewOpen = true;
      state.quickViewProduct = action.payload;
    },
    
    closeQuickView: (state) => {
      state.quickViewOpen = false;
      state.quickViewProduct = null;
    },
  },
});

export const {
  setGlobalLoading,
  setPageLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  removeModal,
  closeAllModals,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  setSearchQuery,
  toggleFilters,
  setFiltersOpen,
  toggleTheme,
  setTheme,
  toggleLayout,
  setLayout,
  toggleWishlist,
  setWishlistOpen,
  openQuickView,
  closeQuickView,
  hydrateUi,
} = uiSlice.actions;

export default uiSlice.reducer;


export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;
export const selectPageLoading = (state: { ui: UIState }) => state.ui.pageLoading;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen;
export const selectMobileMenuOpen = (state: { ui: UIState }) => state.ui.mobileMenuOpen;
export const selectSearchOpen = (state: { ui: UIState }) => state.ui.searchOpen;
export const selectSearchQuery = (state: { ui: UIState }) => state.ui.searchQuery;
export const selectFiltersOpen = (state: { ui: UIState }) => state.ui.filtersOpen;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectLayout = (state: { ui: UIState }) => state.ui.layout;
export const selectWishlistOpen = (state: { ui: UIState }) => state.ui.wishlistOpen;
export const selectQuickViewOpen = (state: { ui: UIState }) => state.ui.quickViewOpen;
export const selectQuickViewProduct = (state: { ui: UIState }) => state.ui.quickViewProduct;
