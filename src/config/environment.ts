/**
 * Environment Configuration
 *
 * Controls switching between mock and real API
 * Based on environment variables
 */

export interface EnvironmentConfig {
  apiUrl: string;
  useMockData: boolean;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

/**
 * Get current environment configuration
 */
const getEnvironment = (): EnvironmentConfig => {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;

  return {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
    environment: isProd ? 'production' : isDev ? 'development' : 'staging',
    debug: isDev,
  };
};

export const env = getEnvironment();

/**
 * Log environment info in development
 */
if (env.debug) {
  console.log('[Environment]', {
    apiUrl: env.apiUrl,
    useMockData: env.useMockData,
    environment: env.environment,
  });
}