// Test setup file for Vitest
// Provides global test utilities and mocks

import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Global test utilities
declare global {
  var test: {
    createMockUser: (overrides?: Record<string, unknown>) => Record<string, unknown>;
    createMockSession: () => Record<string, unknown>;
  };
}

globalThis.test = {
  // Helper to create mock user
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    ...overrides,
  }),

  // Helper to create mock session
  createMockSession: () => ({
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600,
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
  }),
};