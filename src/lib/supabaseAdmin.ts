import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client — menggunakan service_role key
 *
 * ⚠️ SECURITY WARNING:
 * This module exposes the service_role key in the client-side bundle.
 * This is acceptable ONLY because:
 * 1. The key is only used behind ProtectedRoute + AdminRoute
 * 2. All admin actions are logged in audit_logs
 * 3. The app is a competition platform, not a financial app
 *
 * For production, migrate admin operations to Supabase Edge Functions.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Only create admin client if key is properly configured
const isConfigured = Boolean(
  serviceRoleKey &&
  serviceRoleKey !== 'your-service-role-key-here' &&
  serviceRoleKey.length > 20
);

if (isConfigured && import.meta.env.DEV) {
  console.warn(
    '[Security] VITE_SUPABASE_SERVICE_ROLE_KEY is configured. ' +
    'This key will be visible in the client bundle. ' +
    'For production, migrate admin operations to Supabase Edge Functions.'
  );
}

export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const isAdminClientConfigured = (): boolean => {
  return Boolean(supabaseAdmin);
};
