'use client';

import { useState, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiOptions {
  showSuccessNotification?: boolean;
  showErrorNotification?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = unknown>(options: ApiOptions = {}) {
  const { addNotification } = useNotifications();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    customOptions: ApiOptions = {}
  ) => {
    const finalOptions = { ...options, ...customOptions };

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();

      setState({
        data,
        loading: false,
        error: null,
      });

      if (finalOptions.showSuccessNotification && finalOptions.successMessage) {
        addNotification({
          title: 'Success',
          message: finalOptions.successMessage,
          type: 'success',
          isRead: false
        });
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      if (finalOptions.showErrorNotification !== false) {
        addNotification({
          title: 'Error',
          message: finalOptions.errorMessage || errorMessage,
          type: 'error',
          isRead: false
        });
      }

      return { data: null, error: errorMessage };
    }
  }, [addNotification, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
