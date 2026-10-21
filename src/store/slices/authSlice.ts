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
  token: string | null;
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


const loadUserFromStorage = (): User | null => {
  try {
    const savedUser = storage.get('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

const loadTokenFromStorage = (): string | null => {
  try {
    return storage.get('token');
  } catch (error) {
    console.error('Error loading token from localStorage:', error);
    return null;
  }
};


export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    throw new Error('Invalid token');
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  token: loadTokenFromStorage(),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      storage.set('user', JSON.stringify(action.payload.user));
      storage.set('token', action.payload.token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storage.set('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      storage.remove('user');
      storage.remove('token');
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
} = authSlice.actions;


export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token);
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


export const selectTokenStatus = (state: RootState) => {
  const token = state.auth.token;
  if (!token) return { isValid: false, remainingTime: 0 };
  
  try {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return { isValid: false, remainingTime: 0 };
    
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const remainingTime = Math.max(0, Math.floor((expiresAt - now) / 1000));
    const isExpired = now >= expiresAt;
    
    return { 
      isValid: !isExpired, 
      remainingTime,
      expiresAt
    };
  } catch (error) {
    return { isValid: false, remainingTime: 0 };
  }
};


export const selectIsTokenExpiring = (state: RootState) => {
  const tokenStatus = selectTokenStatus(state);
  return tokenStatus.isValid && tokenStatus.remainingTime < 300;
};


export const selectIsTokenExpired = (state: RootState) => {
  const tokenStatus = selectTokenStatus(state);
  return !tokenStatus.isValid;
};

export default authSlice.reducer;
