'use client';

import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  logout as logoutAction,
  selectError,
  selectIsAuthenticated,
  selectLoading,
  selectUser,
  setCredentials,
  setError,
  setLoading,
  type User,
} from '../store/slices/authSlice';
import {
  useGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '../store/api/authApi';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const userRole = user?.role;

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();

  useEffect(() => {
    if (profileData?.data?.user) {
      dispatch(setCredentials({ user: profileData.data.user }));
      return;
    }

    if (!isProfileLoading && !isAuthenticated) {
      dispatch(logoutAction());
    }
  }, [profileData, isProfileLoading, isAuthenticated, dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(setLoading(true));
        const result = await loginMutation({ email, password }).unwrap();

        if (result.success) {
          dispatch(setCredentials({ user: result.data.user }));
          return { success: true, user: result.data.user };
        }

        dispatch(setError(result.message));
        return { success: false, error: result.message };
      } catch (loginError: any) {
        const errorMessage = loginError?.data?.message || 'Login failed';
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, loginMutation],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      try {
        dispatch(setLoading(true));
        const result = await registerMutation({ name, email, password, phone }).unwrap();

        if (result.success) {
          dispatch(setCredentials({ user: result.data.user }));
          return { success: true, user: result.data.user };
        }

        dispatch(setError(result.message));
        return { success: false, error: result.message };
      } catch (registerError: any) {
        const errorMessage = registerError?.data?.message || 'Registration failed';
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, registerMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (logoutError) {
      console.error('Logout error:', logoutError);
    } finally {
      dispatch(logoutAction());
    }
  }, [dispatch, logoutMutation]);

  const hasRole = useCallback(
    (roles: string | string[]) => {
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(userRole as string);
    },
    [userRole],
  );

  const isAdmin = useCallback(() => hasRole('admin'), [hasRole]);
  const isManager = useCallback(() => hasRole(['admin', 'manager']), [hasRole]);
  const isSupport = useCallback(() => hasRole(['admin', 'manager', 'support']), [hasRole]);
  const isCustomer = useCallback(() => hasRole('customer'), [hasRole]);

  return {
    user,
    isAuthenticated,
    loading: loading || isProfileLoading,
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

export type { User };
