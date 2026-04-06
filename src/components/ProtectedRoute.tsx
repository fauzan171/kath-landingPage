/**
 * Protected Route Component
 *
 * Provides authentication and role-based access control for routes.
 * Uses Supabase Auth for session management and checks user role/status.
 */

import { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// Allowed roles as defined in database schema
type UserRole = 'participant' | 'admin' | 'super_admin' | 'finance_admin' | 'judge';
type UserStatus = 'pending' | 'approved' | 'rejected';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireApproved?: boolean;
  redirectTo?: string;
}

interface UserAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  } | null;
  error: string | null;
}

/**
 * ProtectedRoute
 *
 * Wraps routes that require authentication and/or specific roles.
 *
 * @param children - The route content to render if authorized
 * @param requiredRoles - Array of roles that can access this route (empty = any authenticated user)
 * @param requireApproved - Whether user must have 'approved' status (default: true)
 * @param redirectTo - Where to redirect if unauthorized (default: '/login')
 *
 * Example usage:
 * <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin', 'super_admin']}><AdminLayout /></ProtectedRoute>}>
 */
const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requireApproved = true,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<UserAuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: 'Supabase not configured',
        });
        return;
      }

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
        });
        return;
      }

      // Get user details from users table (role, status)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, status')
        .eq('id', session.user.id)
        .single();

      if (userError || !userData) {
        // User exists in auth but not in users table
        // This could happen if trigger failed - do NOT grant access
        console.error('User found in auth but not in users table:', session.user.id);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: 'Account not properly configured. Please contact support.',
        });
        return;
      }

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role as UserRole,
          status: userData.status as UserStatus,
        },
        error: null,
      });
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: 'Failed to verify authentication',
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!authState.isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Check status approval if required
  if (requireApproved && authState.user?.status !== 'approved') {
    // Redirect pending/rejected users to pending approval page
    const statusRedirect = authState.user?.status === 'rejected'
      ? '/cibc/rejected'
      : '/cibc/pending-approval';
    return <Navigate to={statusRedirect} replace />;
  }

  // Check role if required roles specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(authState.user?.role as UserRole);

    if (!hasRequiredRole) {
      // User is authenticated but doesn't have required role
      // Redirect to their appropriate dashboard
      const roleRedirect = getRoleBasedRedirect(authState.user?.role as UserRole);
      return <Navigate to={roleRedirect} replace />;
    }
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

/**
 * Get redirect path based on user role
 */
const getRoleBasedRedirect = (role: UserRole): string => {
  switch (role) {
    case 'admin':
    case 'super_admin':
    case 'finance_admin':
      return '/admin';
    case 'judge':
      return '/judge';
    case 'participant':
    default:
      return '/cibc/dashboard';
  }
};

/**
 * Role-specific route wrappers for convenience
 */

// Admin routes - requires admin/super_admin/finance_admin role
export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute
    requiredRoles={['admin', 'super_admin', 'finance_admin']}
    requireApproved={true}
    redirectTo="/admin/login"
  >
    {children}
  </ProtectedRoute>
);

// Judge routes - requires judge role
export const JudgeRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute
    requiredRoles={['judge']}
    requireApproved={true}
    redirectTo="/judge/login"
  >
    {children}
  </ProtectedRoute>
);

// Participant routes - any approved user
export const ParticipantRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute
    requiredRoles={['participant']}
    requireApproved={true}
    redirectTo="/cibc/login"
  >
    {children}
  </ProtectedRoute>
);

// Any authenticated user (no role restriction)
export const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute
    requireApproved={true}
    redirectTo="/login"
  >
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;