/**
 * Environment Configuration
 *
 * Architecture: Supabase + Cloudflare R2 (100% FREE)
 * Storage: Cloudflare R2 for photos and PDFs via Supabase Edge Function
 * Controls switching between mock and real API
 */

export interface EnvironmentConfig {
  // API Configuration (legacy - kept for backward compatibility)
  apiUrl: string;
  useMockData: boolean;

  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;

  // App Configuration
  appName: string;
  appUrl: string;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0 && import.meta.env.VITE_USE_MOCK_DATA !== 'true') {
    console.warn(`[Environment] Missing required env vars: ${missing.join(', ')}`);
    console.warn('[Environment] Falling back to mock data mode');
    return false;
  }
  return true;
};

/**
 * Get current environment configuration
 */
const getEnvironment = (): EnvironmentConfig => {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  const hasValidConfig = validateEnv();

  return {
    // Legacy API config
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || !hasValidConfig,

    // Supabase config
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

    // App config
    appName: import.meta.env.VITE_APP_NAME || 'KATH Event Organizer',
    appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    environment: isProd ? 'production' : isDev ? 'development' : 'staging',
    debug: isDev,
  };
};

export const env = getEnvironment();

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
};

/**
 * Check if Cloudflare R2 storage is available
 * R2 is configured via Supabase Edge Function secrets (not client-side env vars)
 * Returns true if Supabase is configured (R2 secrets are set server-side)
 */
export const isR2StorageConfigured = (): boolean => {
  return isSupabaseConfigured();
};

/**
 * @deprecated Use isR2StorageConfigured() instead. n8n is no longer used.
 */
export const isN8nConfigured = (): boolean => {
  return isR2StorageConfigured();
};

/**
 * Log environment info in development
 */
if (env.debug) {
  console.log('[Environment]', {
    apiUrl: env.apiUrl,
    useMockData: env.useMockData,
    supabaseConfigured: isSupabaseConfigured(),
    r2StorageConfigured: isR2StorageConfigured(),
    environment: env.environment,
  });
}
