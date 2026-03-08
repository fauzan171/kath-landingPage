import { useState, useEffect, useCallback } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/auth.service';
import type { LoginCredentials, AuthUser } from '../services/types';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && isAuthenticated()) {
      setUser(currentUser);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginService(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setError('Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
    } catch (err) {
      // Still logout locally even if API fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    error,
  };
}

// Simple hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
  return isAuthenticated();
}

// Hook to get current user
export function useCurrentUser(): AuthUser | null {
  return getCurrentUser();
}