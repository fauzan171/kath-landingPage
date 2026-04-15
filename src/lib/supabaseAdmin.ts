/**
 * @deprecated DO NOT USE THIS MODULE.
 *
 * All admin operations have been migrated to the `admin-ops` Supabase Edge Function.
 * This file is kept only as a fallback reference.
 *
 * The VITE_SUPABASE_SERVICE_ROLE_KEY should be REMOVED from .env.
 * The service role key is now only accessible server-side via the edge function.
 *
 * If you need admin operations, use:
 *   supabase.functions.invoke('admin-ops', { body: { action: '...', ... } })
 */

// This module is intentionally left non-functional.
// Admin operations are handled by supabase/functions/admin-ops/index.ts

export const supabaseAdmin = null;
export const isAdminClientConfigured = (): boolean => false;
