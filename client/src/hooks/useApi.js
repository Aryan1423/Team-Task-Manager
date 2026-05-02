import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const clearError = useCallback(() => {
    if (mountedRef.current) setError(null);
  }, []);

  const request = useCallback(async (method, url, data = null) => {
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }
    try {
      const response = await api({
        method,
        url,
        data,
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      if (mountedRef.current) setError(errorMsg);
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  return { loading, error, request, clearError };
};
