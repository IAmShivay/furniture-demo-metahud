'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../lib/storage';
import type { RootState } from '../index';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'support' | 'manager' | 'admin';
  avatar?: string;
  emailVerified: boolean;
  isActive?: boolean;
  phoneVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  phone?: string;
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}


export const permissionMap: Record<string, string[]> = {
  
  'products:read': ['customer', 'support', 'manager', 'admin'],
  'products:create': ['manager', 'admin'],
  'products:update': ['manager', 'admin'],
  'products:delete': ['admin'],
  
  
  'orders:read': ['customer', 'support', 'manager', 'admin'],
  'orders:create': ['customer', 'support', 'manager', 'admin'],
  'orders:update': ['support', 'manager', 'admin'],
  'orders:delete': ['admin'],
  'orders:read_all': ['support', 'manager', 'admin'],
  
  
  'users:read': ['customer', 'support', 'manager', 'admin'],
  'users:create': ['manager', 'admin'],
  'users:update': ['customer', 'support', 'manager', 'admin'],
  'users:delete': ['admin'],
  'users:read_all': ['support', 'manager', 'admin'],
  'users:manage_roles': ['admin'],
  
  
  'admin:dashboard': ['support', 'manager', 'admin'],
  'admin:analytics': ['manager', 'admin'],
  'admin:settings': ['admin'],
  'admin:system': ['admin'],
  
  
  'support:tickets': ['support', 'manager', 'admin'],
  'support:respond': ['support', 'manager', 'admin'],
  'support:escalate': ['support', 'manager', 'admin'],
  
  
  'inventory:read': ['support', 'manager', 'admin'],
  'inventory:update': ['manager', 'admin'],
  
  
  'finance:read': ['manager', 'admin'],
  'finance:reports': ['manager', 'admin'],
  'finance:refunds': ['manager', 'admin']
};


const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateUser: (state) => {
      const savedUser = storage.get('user');

      if (!savedUser) return;

      try {
        state.user = JSON.parse(savedUser) as User;
      } catch {
        state.user = null;
      }
    },

    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      storage.set('user', JSON.stringify(action.payload.user));
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storage.set('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      storage.remove('user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        storage.set('user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  setLoading,
  setError,
  clearError,
  updateProfile,
  hydrateUser,
} = authSlice.actions;


export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;


export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.role === 'admin';
export const selectIsManager = (state: RootState) =>
  state.auth.user?.role === 'manager';
export const selectIsSupport = (state: RootState) =>
  state.auth.user?.role === 'support';
export const selectIsCustomer = (state: RootState) =>
  state.auth.user?.role === 'customer';
export const selectIsManagerOrAdmin = (state: RootState) =>
  ['admin', 'manager'].includes(state.auth.user?.role || '');
export const selectIsSupportOrAbove = (state: RootState) =>
  ['admin', 'manager', 'support'].includes(state.auth.user?.role || '');


export const selectHasPermission = (state: RootState, permission: string) => {
  const user = state.auth.user;
  if (!user) return false;
  
  const allowedRoles = permissionMap[permission];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(user.role);
};


export const selectOwnerOrAdmin = (state: RootState, resourceUserId: string) => {
  const user = state.auth.user;
  if (!user) return false;
  
  
  if (['admin', 'manager'].includes(user.role)) {
    return true;
  }
  
  
  return user.id === resourceUserId;
};


export default authSlice.reducer;
