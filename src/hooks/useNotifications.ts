'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addNotification,
  removeNotification,
  clearNotifications,
  selectNotifications
} from '../store/slices/uiSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  const showNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    duration?: number,
    action?: { label: string; onClick: () => void }
  ) => {
    dispatch(addNotification({
      type,
      title,
      message,
      duration,
      action,
    }));
  }, [dispatch]);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    showNotification('success', title, message, duration);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    showNotification('error', title, message, duration);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    showNotification('warning', title, message, duration);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    showNotification('info', title, message, duration);
  }, [showNotification]);

  const dismissNotification = useCallback((id: string) => {
    dispatch(removeNotification(id));
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissNotification,
    clearAll,
  };
};
