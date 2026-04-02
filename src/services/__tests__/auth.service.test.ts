// ============================================
// Auth Service Tests
// ============================================
// Tests for auth.service.ts Supabase implementation
// Issue #1 from SERVICE-ANALYSIS-REPORT.md
// ============================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { LoginCredentials } from '../types';

// Mock Supabase - must be defined before import
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      refreshSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

// Mock environment config
vi.mock('@/config/environment', () => ({
  isSupabaseConfigured: vi.fn(() => true),
}));

// Import after mocking
import { authService, login, logout, getCurrentUser, isAuthenticated } from '../auth.service';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// ============================================
// Login Tests
// ============================================

describe('login', () => {
  it('should login successfully with valid credentials', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { name: 'Test User', role: 'admin' },
    };

    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    };

    vi.mocked(supabase!.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser as unknown, session: mockSession as unknown },
      error: null,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await login(credentials);

    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe('test@example.com');
    expect(result.data.accessToken).toBe('mock-access-token');
    expect(localStorage.getItem('user')).toBeTruthy();
  });

  it('should return error with invalid credentials', async () => {
    vi.mocked(supabase!.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' } as Error,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const credentials: LoginCredentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    };

    const result = await login(credentials);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Email atau password salah');
  });

  it('should return error when Supabase is not configured', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await login(credentials);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Supabase tidak dikonfigurasi');
  });

  it('should handle email not confirmed error', async () => {
    vi.mocked(supabase!.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email not confirmed' } as Error,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const result = await login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Email belum dikonfirmasi');
  });
});

// ============================================
// Logout Tests
// ============================================

describe('logout', () => {
  it('should logout successfully', async () => {
    // Setup: user is logged in
    localStorage.setItem('user', JSON.stringify({ id: '123', email: 'test@example.com' }));
    localStorage.setItem('accessToken', 'mock-token');

    vi.mocked(supabase!.auth.signOut).mockResolvedValue({ error: null });

    const result = await logout();

    expect(result.success).toBe(true);
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('should clear localStorage even if Supabase signOut fails', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    vi.mocked(supabase!.auth.signOut).mockResolvedValue({
      error: { message: 'Network error' } as Error,
    });

    const result = await logout();

    expect(result.success).toBe(true);
    expect(localStorage.getItem('user')).toBeNull();
  });
});

// ============================================
// getCurrentUser Tests
// ============================================

describe('getCurrentUser', () => {
  it('should return user from localStorage', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
    };

    localStorage.setItem('user', JSON.stringify(mockUser));

    const user = getCurrentUser();

    expect(user).toBeTruthy();
    expect(user?.email).toBe('test@example.com');
  });

  it('should return null when no user in localStorage', () => {
    const user = getCurrentUser();
    expect(user).toBeNull();
  });

  it('should return null and clear invalid JSON', () => {
    localStorage.setItem('user', 'invalid-json');

    const user = getCurrentUser();

    expect(user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});

// ============================================
// isAuthenticated Tests
// ============================================

describe('isAuthenticated', () => {
  it('should return true when user is in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    expect(isAuthenticated()).toBe(true);
  });

  it('should return true when accessToken is in localStorage', () => {
    localStorage.setItem('accessToken', 'mock-token');

    expect(isAuthenticated()).toBe(true);
  });

  it('should return false when no auth data in localStorage', () => {
    expect(isAuthenticated()).toBe(false);
  });
});

// ============================================
// register Tests
// ============================================

describe('register', () => {
  it('should register successfully', async () => {
    const mockUser = {
      id: 'new-user-123',
      email: 'newuser@example.com',
      user_metadata: { name: 'New User' },
    };

    vi.mocked(supabase!.auth.signUp).mockResolvedValue({
      data: { user: mockUser as unknown, session: null },
      error: null,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const result = await authService.register('newuser@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe('newuser@example.com');
  });

  it('should return error for duplicate email', async () => {
    vi.mocked(supabase!.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'User already registered' } as Error,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const result = await authService.register('existing@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.message).toContain('Email sudah terdaftar');
  });
});

// ============================================
// resetPassword Tests
// ============================================

describe('resetPassword', () => {
  it('should send reset email successfully', async () => {
    vi.mocked(supabase!.auth.resetPasswordForEmail).mockResolvedValue({ error: null });
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const result = await authService.resetPassword('test@example.com');

    expect(result.success).toBe(true);
    expect(result.message).toContain('Email reset password');
  });

  it('should handle reset password error', async () => {
    vi.mocked(supabase!.auth.resetPasswordForEmail).mockResolvedValue({
      error: { message: 'User not found' } as Error,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const result = await authService.resetPassword('nonexistent@example.com');

    expect(result.success).toBe(false);
  });
});

// ============================================
// Error Mapping Tests
// ============================================

describe('error mapping', () => {
  it('should map Invalid login credentials to Indonesian', async () => {
    vi.mocked(supabase!.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' } as Error,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const result = await login({ email: 'test@test.com', password: 'wrong' });

    expect(result.message).toBe('Email atau password salah');
  });

  it('should map Password should be at least 6 characters', async () => {
    vi.mocked(supabase!.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Password should be at least 6 characters' } as Error,
    });

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const result = await authService.register('test@test.com', 'short');

    expect(result.message).toBe('Password minimal 6 karakter');
  });
});