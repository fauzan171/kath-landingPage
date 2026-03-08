import { post } from './api';
import type { LoginCredentials, LoginResponse, AuthUser } from './types';
import type { ApiResponse } from './api';

const ENDPOINT = '/auth';

// Login
export async function login(
  credentials: LoginCredentials
): Promise<ApiResponse<LoginResponse>> {
  const response = await post<LoginResponse>(`${ENDPOINT}/login`, credentials);

  // Store tokens in localStorage
  if (response.success && response.data) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response;
}

// Logout
export async function logout(): Promise<ApiResponse<void>> {
  const response = await post<void>(`${ENDPOINT}/logout`);

  // Clear tokens from localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  return response;
}

// Refresh token
export async function refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
  const storedRefreshToken = localStorage.getItem('refreshToken');

  const response = await post<{ accessToken: string }>(`${ENDPOINT}/refresh`, {
    refreshToken: storedRefreshToken,
  });

  // Update access token in localStorage
  if (response.success && response.data) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }

  return response;
}

// Get current user from localStorage
export function getCurrentUser(): AuthUser | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}

// Auth Service Object (alternative export)
export const authService = {
  login,
  logout,
  refreshToken,
  getCurrentUser,
  isAuthenticated,
};