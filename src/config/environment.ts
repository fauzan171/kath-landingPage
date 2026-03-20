/**
 * Environment Configuration
 *
 * Architecture: Supabase + Google Drive + n8n (100% FREE)
 * Controls switching between mock and real API
 */

export interface EnvironmentConfig {
  // API Configuration (legacy - kept for backward compatibility)
  apiUrl: string;
  useMockData: boolean;

  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  n8nWebhookUrl: string;

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
    n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || '',

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
 * Check if n8n webhook is configured
 */
export const isN8nConfigured = (): boolean => {
  return Boolean(env.n8nWebhookUrl);
};

/**
 * Log environment info in development
 */
if (env.debug) {
  console.log('[Environment]', {
    apiUrl: env.apiUrl,
    useMockData: env.useMockData,
    supabaseConfigured: isSupabaseConfigured(),
    n8nConfigured: isN8nConfigured(),
    environment: env.environment,
  });
}