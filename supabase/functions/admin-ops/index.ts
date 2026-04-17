/* eslint-disable */
// @ts-nocheck
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const getAllowedOrigin = (req: Request): string => {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigins = [
    'https://katheventorganizer.com',
    'https://www.katheventorganizer.com',
    'https://kath-cibc.andifauzan986.workers.dev',
    'http://localhost:5173',
    'http://localhost:4173',
  ];
  if (allowedOrigins.includes(origin)) return origin;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.workers\.dev$/)) return origin;
  return allowedOrigins[0];
};

const getCorsHeaders = (req: Request) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(req),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

/**
 * Verify JWT token and check if user has admin role.
 * Returns user info or null if unauthorized.
 */
async function verifyAdmin(req: Request): Promise<{ userId: string; email: string } | null> {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || '';

  if (!token || !token.includes('.') || token.split('.').length !== 3) {
    return null;
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }

    // Verify the JWT token
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth verification failed:', error?.message);
      return null;
    }

    // Check if user has admin role in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (userError || !userData) {
      console.error('Failed to fetch user role:', userError?.message);
      return null;
    }

    const adminRoles = ['admin', 'super_admin', 'finance_admin'];
    if (!adminRoles.includes(userData.role)) {
      console.error('User is not admin, role:', userData.role);
      return null;
    }

    return { userId: user.id, email: user.email || '' };
  } catch (e) {
    console.error('Admin verification error:', e);
    return null;
  }
}

/**
 * Get Supabase admin client using service role key (server-side only).
 */
function getAdminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // 1. Verify admin privileges
    const admin = await verifyAdmin(req);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    const adminClient = getAdminClient();

    // 2. Route to appropriate admin operation
    switch (action) {
      case 'delete-user': {
        const { userId } = body;
        if (!userId) {
          return new Response(JSON.stringify({ error: 'Missing userId' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Prevent admin from deleting themselves
        if (userId === admin.userId) {
          return new Response(JSON.stringify({ error: 'Cannot delete your own account' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Delete related records
        const relatedDeletes = [
          adminClient.from('submissions').delete().eq('submitted_by', userId),
          adminClient.from('submissions').delete().eq('graded_by', userId),
          adminClient.from('judge_scores').delete().eq('judge_id', userId),
          adminClient.from('notifications').delete().eq('user_id', userId),
          adminClient.from('team_members').delete().eq('user_id', userId),
          adminClient.from('judge_assignments').update({ assigned_by: null }).eq('assigned_by', userId),
          adminClient.from('password_reset_requests').update({ processed_by: null }).eq('processed_by', userId),
          adminClient.from('audit_logs').delete().eq('user_id', userId),
          adminClient.from('password_reset_requests').delete().eq('user_id', userId),
        ];

        const results = await Promise.allSettled(relatedDeletes);
        const failures = results.filter(r => r.status === 'rejected');
        if (failures.length > 0) {
          console.warn(`${failures.length} related deletes failed for user ${userId}`);
        }

        // Delete from auth.users
        const { error: authError } = await adminClient.auth.admin.deleteUser(userId);
        if (authError && !authError.message?.includes('User not found')) {
          console.warn('Auth deletion warning:', authError.message);
        }

        // Delete from public users table
        const { error: dbError } = await adminClient
          .from('users')
          .delete()
          .eq('id', userId);

        if (dbError) throw dbError;

        // Log to audit
        await adminClient.from('audit_logs').insert({
          user_id: admin.userId,
          action: 'delete_user',
          resource_type: 'user',
          resource_id: userId,
          details: { deleted_by: admin.userId },
        });

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update-user-password': {
        const { userId, password } = body;
        if (!userId || !password || password.length < 8) {
          return new Response(JSON.stringify({ error: 'Invalid parameters. Password must be at least 8 characters.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Try updating existing auth user
        const { error: updateError } = await adminClient.auth.admin.updateUserById(
          userId,
          { password }
        );

        let authUserId = userId;

        if (updateError) {
          if (updateError.message?.includes('User not found') || updateError.code === 'user_not_found') {
            // User doesn't exist in auth - create new auth account
            const { data: newAuthUser, error: createError } = await adminClient.auth.admin.createUser({
              email: body.email || '',
              password,
              email_confirm: true,
            });

            if (createError) throw createError;
            if (!newAuthUser?.user) throw new Error('Failed to create auth account');

            authUserId = newAuthUser.user.id;
          } else {
            throw updateError;
          }
        }

        // Log to audit
        await adminClient.from('audit_logs').insert({
          user_id: admin.userId,
          action: 'update_password',
          resource_type: 'user',
          resource_id: userId,
          details: { updated_by: admin.userId },
        });

        return new Response(JSON.stringify({ success: true, authUserId }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create-auth-user': {
        const { email, password } = body;
        if (!email || !password || password.length < 8) {
          return new Response(JSON.stringify({ error: 'Invalid parameters' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        if (createError) throw createError;

        // Log to audit
        await adminClient.from('audit_logs').insert({
          user_id: admin.userId,
          action: 'create_auth_user',
          resource_type: 'user',
          resource_id: data.user?.id,
          details: { created_by: admin.userId, email },
        });

        return new Response(JSON.stringify({ success: true, userId: data.user?.id }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Admin operation error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
