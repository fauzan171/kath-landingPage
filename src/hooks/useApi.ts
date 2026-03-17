import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse } from '../services/api';

// Generic hook state interface
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic hook return type
interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  reset: () => void;
}

// Base hook for API calls
export function useApi<T>(
  fetchFunction: () => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetchFunction();

        if (!cancelled) {
          if (response.success) {
            setState({ data: response.data, loading: false, error: null });
          } else {
            setState({ data: null, loading: false, error: 'Failed to fetch data' });
          }
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          setState({ data: null, loading: false, error: errorMessage });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchFunction();

      if (response.success) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: 'Failed to fetch data' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [fetchFunction]);

  return { ...state, refetch, reset };
}

// Hook with params
export function useApiWithParams<T, P>(
  fetchFunction: (params: P) => Promise<ApiResponse<T>>,
  params: P
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetchFunction(params);

        if (!cancelled) {
          if (response.success) {
            setState({ data: response.data, loading: false, error: null });
          } else {
            setState({ data: null, loading: false, error: 'Failed to fetch data' });
          }
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          setState({ data: null, loading: false, error: errorMessage });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchFunction(params);

      if (response.success) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: 'Failed to fetch data' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [fetchFunction, params]);

  return { ...state, refetch, reset };
}

// Mutation hook for create/update/delete operations
interface UseMutationReturn<T, D> {
  mutate: (data: D) => Promise<ApiResponse<T>>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useMutation<T, D>(
  mutationFunction: (data: D) => Promise<ApiResponse<T>>
): UseMutationReturn<T, D> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (data: D): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFunction(data);
        setLoading(false);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [mutationFunction]
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}