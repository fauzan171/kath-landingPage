/**
 * useAuth Hook - Supabase Authentication
 *
 * This is the recommended auth hook for the application.
 * Uses Supabase Auth for all authentication operations.
 *
 * MIGRATION NOTE:
 * If you're migrating from AuthContext, replace:
 * - import { useAuth } from '@/contexts/AuthContext'
 * With:
 * - import { useAuth } from '@/hooks/useAuth'
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
  getCurrentUser,
  getCurrentUserAsync,
  isAuthenticatedAsync,
} from '../services/auth.service';
import type { LoginCredentials, AuthUser } from '../services/types';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUserAsync();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const currentUser = await getCurrentUserAsync();
            setUser(currentUser);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginService(credentials);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, message: response.message || 'Login berhasil' };
      } else {
        const errorMsg = response.message || 'Login gagal';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login gagal';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutService();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error instanceof Error ? error.message : error);
      // Still logout locally even if API fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerService(email, password, metadata);
      return { success: response.success, message: response.message || 'Registrasi berhasil' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registrasi gagal';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUserAsync();
      setUser(currentUser);
    } catch (err) {
      console.error('Refresh user failed:', err);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    register,
    refreshUser,
  };
}

// Simple hook to check if user is authenticated (async version)
export function useIsAuthenticated(): boolean {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const check = async () => {
      const result = await isAuthenticatedAsync();
      setAuthenticated(result);
    };
    check();
  }, []);

  return authenticated;
}

// Hook to get current user
export function useCurrentUser(): AuthUser | null {
  return getCurrentUser();
}