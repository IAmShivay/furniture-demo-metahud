'use client';

import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  logout as logoutAction,
  selectError,
  selectIsAuthenticated,
  selectLoading,
  selectUser,
  setUser,
  type User,
} from '../store/slices/authSlice';







const DEMO_ADMIN: User = {
  id: 'demo-admin',
  name: 'Admin User',
  email: 'admin@luxehouse.in',
  role: 'admin',
  emailVerified: true,
  phoneVerified: true,
  createdAt: new Date().toISOString(),
};

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const storedUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const user = storedUser ?? DEMO_ADMIN;
  const userRole = user.role;

  const login = useCallback(
    async (email: string) => {
      dispatch(setUser({ ...DEMO_ADMIN, email }));
      return { success: true, user: { ...DEMO_ADMIN, email } };
    },
    [dispatch],
  );

  const register = useCallback(
    async (name: string, email: string) => {
      const registered = { ...DEMO_ADMIN, name, email };
      dispatch(setUser(registered));
      return { success: true, user: registered };
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    dispatch(logoutAction());
  }, [dispatch]);

  const hasRole = useCallback(
    (roles: string | string[]) => {
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(userRole);
    },
    [userRole],
  );

  const isAdmin = useCallback(() => hasRole('admin'), [hasRole]);
  const isManager = useCallback(() => hasRole(['admin', 'manager']), [hasRole]);
  const isSupport = useCallback(() => hasRole(['admin', 'manager', 'support']), [hasRole]);
  const isCustomer = useCallback(() => hasRole('customer'), [hasRole]);

  return {
    
    user,
    isAuthenticated: true,
    loading,
    error,
    userRole,

    
    login,
    register,
    logout,

    
    hasRole,
    isAdmin,
    isManager,
    isSupport,
    isCustomer,
  };
};
