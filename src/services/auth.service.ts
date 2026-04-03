// ============================================
// Auth Service - Supabase Implementation
// ============================================
// FIXED: Now uses Supabase Auth instead of REST API
// Issue #1 from SERVICE-ANALYSIS-REPORT.md
// ============================================

import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';
import { loginRateLimiter, registrationRateLimiter } from '@/utils/security';
import type { AuthUser, LoginCredentials, LoginResponse, ApiResponse } from './types';

// ============================================
// Error Mapping - User-friendly messages
// ============================================

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Email atau password salah',
  'Email not confirmed': 'Email belum dikonfirmasi. Silakan cek email Anda.',
  'User already registered': 'Email sudah terdaftar. Silakan login.',
  'Password should be at least 6 characters': 'Password minimal 6 karakter',
  'Unable to validate email address: invalid format': 'Format email tidak valid',
  'Signups not allowed for this instance': 'Registrasi tidak diizinkan',
  'New password should be different from the old password': 'Password baru harus berbeda dengan password lama',
  'AuthApiError': 'Terjadi kesalahan autentikasi. Silakan coba lagi.',
  'AuthSessionMissingError': 'Sesi tidak ditemukan. Silakan login kembali.',
};

function mapAuthError(error: Error | { message: string }): string {
  const errorMessage = error.message || 'Unknown error';

  // Check for known error patterns
  for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // Default error message
  return errorMessage;
}

// ============================================
// Auth Service Functions
// ============================================

/**
 * Login with email and password
 * Uses Supabase Auth instead of REST API
 */
export async function login(
  credentials: LoginCredentials
): Promise<ApiResponse<LoginResponse>> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        data: {} as LoginResponse,
        message: 'Supabase tidak dikonfigurasi. Silakan setup environment variables.',
      };
    }

    // Rate limit check - prevent brute force attacks
    const rateLimit = loginRateLimiter.checkLimit(credentials.email);
    if (!rateLimit.allowed) {
      const retryMinutes = Math.ceil((rateLimit.retryAfter || 0) / 60);
      return {
        success: false,
        data: {} as LoginResponse,
        message: `Terlalu banyak percobaan login. Coba lagi dalam ${retryMinutes} menit.`,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('[AuthService.login]', error);
      return {
        success: false,
        data: {} as LoginResponse,
        message: mapAuthError(error),
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        data: {} as LoginResponse,
        message: 'Login gagal. Data user tidak ditemukan.',
      };
    }

    // Check if email is verified
    // Note: This depends on Supabase email confirmation settings
    // If email confirmation is disabled in Supabase, this check can be skipped
    if (!data.user.email_confirmed_at && !data.user.confirmed_at) {
      // Sign out the user immediately since email is not verified
      await supabase.auth.signOut();
      return {
        success: false,
        data: {} as LoginResponse,
        message: 'Email belum dikonfirmasi. Silakan cek email Anda untuk link konfirmasi.',
      };
    }

    // Successful login - reset rate limiter
    loginRateLimiter.reset(credentials.email);

    // Build user object
    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || credentials.email,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      role: data.user.user_metadata?.role || 'user',
    };

    // Store user info in localStorage for quick access
    localStorage.setItem('user', JSON.stringify(user));

    return {
      success: true,
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        user,
      },
      message: 'Login berhasil',
    };
  } catch (err) {
    console.error('[AuthService.login] Unexpected error:', err);
    return {
      success: false,
      data: {} as LoginResponse,
      message: err instanceof Error ? err.message : 'Terjadi kesalahan saat login',
    };
  }
}

/**
 * Register new user
 * Uses Supabase Auth signUp
 */
export async function register(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
): Promise<ApiResponse<{ user: AuthUser }>> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        data: { user: {} as AuthUser },
        message: 'Supabase tidak dikonfigurasi.',
      };
    }

    // Rate limit check - prevent registration spam/abuse
    const rateLimit = registrationRateLimiter.checkLimit(email);
    if (!rateLimit.allowed) {
      const retryMinutes = Math.ceil((rateLimit.retryAfter || 0) / 60);
      return {
        success: false,
        data: { user: {} as AuthUser },
        message: `Terlalu banyak percobaan registrasi. Coba lagi dalam ${retryMinutes} menit.`,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      console.error('[AuthService.register]', error);
      return {
        success: false,
        data: { user: {} as AuthUser },
        message: mapAuthError(error),
      };
    }

    if (!data.user) {
      return {
        success: false,
        data: { user: {} as AuthUser },
        message: 'Registrasi gagal.',
      };
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.name || email.split('@')[0],
      role: data.user.user_metadata?.role || 'user',
    };

    return {
      success: true,
      data: { user },
      message: 'Registrasi berhasil. Silakan cek email untuk konfirmasi.',
    };
  } catch (err) {
    console.error('[AuthService.register] Unexpected error:', err);
    return {
      success: false,
      data: { user: {} as AuthUser },
      message: err instanceof Error ? err.message : 'Terjadi kesalahan saat registrasi',
    };
  }
}

/**
 * Logout - clears Supabase session and localStorage
 */
export async function logout(): Promise<ApiResponse<void>> {
  try {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthService.logout]', error);
      }
    }

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return {
      success: true,
      data: undefined as void,
      message: 'Logout berhasil',
    };
  } catch (err) {
    console.error('[AuthService.logout] Unexpected error:', err);

    // Still clear localStorage even if Supabase fails
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return {
      success: true,
      data: undefined as void,
      message: 'Logout berhasil (local)',
    };
  }
}

/**
 * Refresh token - uses Supabase session refresh
 */
export async function refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        data: { accessToken: '' },
        message: 'Supabase tidak dikonfigurasi.',
      };
    }

    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('[AuthService.refreshToken]', error);
      return {
        success: false,
        data: { accessToken: '' },
        message: mapAuthError(error),
      };
    }

    if (!data.session) {
      return {
        success: false,
        data: { accessToken: '' },
        message: 'Sesi tidak ditemukan.',
      };
    }

    return {
      success: true,
      data: { accessToken: data.session.access_token },
      message: 'Token berhasil diperbarui',
    };
  } catch (err) {
    console.error('[AuthService.refreshToken] Unexpected error:', err);
    return {
      success: false,
      data: { accessToken: '' },
      message: err instanceof Error ? err.message : 'Gagal memperbarui token',
    };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<ApiResponse<void>> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        data: undefined as void,
        message: 'Supabase tidak dikonfigurasi.',
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('[AuthService.resetPassword]', error);
      return {
        success: false,
        data: undefined as void,
        message: mapAuthError(error),
      };
    }

    return {
      success: true,
      data: undefined as void,
      message: 'Email reset password telah dikirim.',
    };
  } catch (err) {
    console.error('[AuthService.resetPassword] Unexpected error:', err);
    return {
      success: false,
      data: undefined as void,
      message: err instanceof Error ? err.message : 'Gagal mengirim email reset password',
    };
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<ApiResponse<void>> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        data: undefined as void,
        message: 'Supabase tidak dikonfigurasi.',
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('[AuthService.updatePassword]', error);
      return {
        success: false,
        data: undefined as void,
        message: mapAuthError(error),
      };
    }

    return {
      success: true,
      data: undefined as void,
      message: 'Password berhasil diperbarui.',
    };
  } catch (err) {
    console.error('[AuthService.updatePassword] Unexpected error:', err);
    return {
      success: false,
      data: undefined as void,
      message: err instanceof Error ? err.message : 'Gagal memperbarui password',
    };
  }
}

/**
 * Get current user from Supabase session
 * Returns user data from localStorage for quick access (synchronous)
 */
export function getCurrentUser(): AuthUser | null {
  // First check localStorage for quick access
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      // Invalid JSON, clear and return null
      localStorage.removeItem('user');
    }
  }
  return null;
}

/**
 * Get current user from Supabase (async)
 * Use this for fresh user data from Supabase
 */
export async function getCurrentUserAsync(): Promise<AuthUser | null> {
  try {
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const authUser: AuthUser = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      role: user.user_metadata?.role || 'user',
    };

    // Update localStorage
    localStorage.setItem('user', JSON.stringify(authUser));

    return authUser;
  } catch (err) {
    console.error('[AuthService.getCurrentUserAsync]', err);
    return null;
  }
}

/**
 * Get current session from Supabase
 */
export async function getSession(): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return null;

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  } catch (err) {
    console.error('[AuthService.getSession]', err);
    return null;
  }
}

/**
 * Check if user is authenticated
 * Checks Supabase session (async)
 */
export async function isAuthenticatedAsync(): Promise<boolean> {
  try {
    if (!supabase) return false;

    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch {
    return false;
  }
}

/**
 * Check if user is authenticated (synchronous)
 * Checks localStorage for quick access
 * Note: This may not reflect actual Supabase session state
 */
export function isAuthenticated(): boolean {
  // Check localStorage first
  const user = getCurrentUser();
  if (user) return true;

  // Also check for session token
  return !!localStorage.getItem('accessToken');
}

// ============================================
// Auth Service Object (exported for convenience)
// ============================================

export const authService = {
  login,
  register,
  logout,
  refreshToken,
  resetPassword,
  updatePassword,
  getCurrentUser,
  getCurrentUserAsync,
  getSession,
  isAuthenticated,
  isAuthenticatedAsync,
};