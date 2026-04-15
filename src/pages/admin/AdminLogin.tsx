/**
 * Admin Login Page
 *
 * Separate login for administrators (admin, super_admin, finance_admin)
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';
import { useCSRFToken } from '@/components/CSRFProtectedForm';
import { loginRateLimiter } from '@/utils/security';

const ADMIN_ROLES = ['admin', 'super_admin', 'finance_admin'];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertError, setAlertError] = useState<string | null>(null);
  const { token: csrfToken, validateAndRefresh: validateCSRF } = useCSRFToken();
  const gsapCtx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if already logged in
    checkSession();

    // GSAP Animation with cleanup
    gsapCtx.current = gsap.context(() => {
      gsap.fromTo(
        '.login-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    });

    return () => {
      gsapCtx.current?.revert();
    };
  }, []);

  const checkSession = async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase!.auth.getUser();
      if (user) {
        // Check if user is an admin - get role from users table
        const { data: userData } = await supabase!
          .from('users')
          .select('role, status')
          .eq('id', user.id)
          .maybeSingle();

        if (ADMIN_ROLES.includes(userData?.role || '') && userData?.status === 'approved') {
          navigate('/admin');
        }
      }
    } catch {
      // No active session
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CSRF Token validation
    const formElement = e.target as HTMLFormElement;
    const submittedToken = new FormData(formElement).get('csrfToken') as string;
    if (!validateCSRF(submittedToken)) {
      toast.error('Security validation failed. Please try again.');
      setIsLoading(false);
      return;
    }

    if (!validateForm()) return;

    // Rate limiting check
    const rateLimitResult = loginRateLimiter.checkLimit(formData.email);
    if (!rateLimitResult.allowed) {
      const retryMinutes = Math.ceil((rateLimitResult.retryAfter || 300000) / 60000);
      toast.error('Too many login attempts', {
        description: `Please try again in ${retryMinutes} minute(s).`,
      });
      setIsLoading(false);
      return;
    }

    setAlertError(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        toast.error('Supabase is not configured');
        setIsLoading(false);
        return;
      }

      // Sign in
      const { data, error } = await supabase!.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user is an admin - get role and status from users table
        const { data: userData } = await supabase!
          .from('users')
          .select('role, status, name')
          .eq('id', data.user.id)
          .maybeSingle();

        const role = userData?.role;
        const status = userData?.status;

        // Check role
        if (!ADMIN_ROLES.includes(role || '')) {
          await supabase!.auth.signOut();
          toast.error('Access denied', {
            description: 'This portal is for administrators only. Please use the appropriate login page.',
          });
          setIsLoading(false);
          return;
        }

        // Check status
        if (status !== 'approved') {
          await supabase!.auth.signOut();
          toast.error('Account pending approval', {
            description: 'Your admin account is not yet approved. Please contact the super admin.',
          });
          setIsLoading(false);
          return;
        }

        toast.success('Welcome, Admin!');
        navigate('/admin');
      }
    } catch (error) {
      // Don't log sensitive error details in production
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
      setAlertError(errorMessage);
      toast.error('Login failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 flex items-center justify-center px-4 py-12">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="login-card relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-amber-200 text-sm mt-1">KATH Event Organizer</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Notice */}
          <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-amber-800 font-medium">Restricted Access</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              This portal is for administrators only. Unauthorized access is prohibited.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            {/* Error Alert */}
            {alertError && (
              <div className="mb-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">Login Failed</p>
                  <p className="text-xs text-red-600 mt-0.5">{alertError}</p>
                </div>
                <button onClick={() => setAlertError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@kathevent.com"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Need admin access?{' '}
              <a href="mailto:admin@kathevent.com" className="text-amber-600 hover:underline font-medium">
                Contact Super Admin
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-amber-200 text-sm">
          <Link to="/" className="hover:text-white transition-colors">
            ← Back to Website
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;