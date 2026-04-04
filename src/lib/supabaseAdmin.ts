import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client — menggunakan service_role key
 * HANYA digunakan di halaman Admin (di belakang AdminRoute)
 * Dibutuhkan untuk: update password user lain, bypass RLS
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = serviceRoleKey && serviceRoleKey !== 'your-service-role-key-here'
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
