/**
 * Judge Login Page
 *
 * Separate login for judges
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Award } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';
import { useCSRFToken } from '@/components/CSRFProtectedForm';

const JudgeLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { token: csrfToken, validateAndRefresh: validateCSRF } = useCSRFToken();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if already logged in
    checkSession();

    // GSAP Animation
    gsap.fromTo(
      '.login-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const checkSession = async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase!.auth.getUser();
      if (user) {
        // Check if user is a judge - get role from users table
        const { data: userData } = await supabase!
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (userData?.role === 'judge') {
          navigate('/judge');
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
        // Check if user is a judge - get role from users table
        const { data: userData } = await supabase!
          .from('users')
          .select('role, name')
          .eq('id', data.user.id)
          .maybeSingle();

        const role = userData?.role;

        if (role !== 'judge') {
          await supabase!.auth.signOut();
          toast.error('Access denied', {
            description: 'This portal is for judges only. Please use the appropriate login page.',
          });
          setIsLoading(false);
          return;
        }

        // Store session - use userData we already fetched
        localStorage.setItem('cibc_current_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: userData?.name || data.user.email?.split('@')[0],
          role: 'judge',
        }));

        toast.success('Welcome, Judge!');
        navigate('/judge');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      toast.error('Login failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center px-4 py-12">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="login-card relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Judge Portal</h1>
          <p className="text-purple-200 text-sm mt-1">CIBC 2026 Competition</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Notice */}
          <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-800 font-medium">Restricted Access</span>
            </div>
            <p className="text-xs text-purple-700 mt-1">
              This portal is for judges only. Contact admin if you need access.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="csrfToken" value={csrfToken} />
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
                  placeholder="judge@email.com"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
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
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
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
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
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
              Need access?{' '}
              <a href="mailto:cibc@kathevent.com" className="text-purple-600 hover:underline font-medium">
                Contact Admin
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-purple-200 text-sm">
          <Link to="/" className="hover:text-white transition-colors">
            ← Back to Competition Site
          </Link>
        </p>
      </div>
    </div>
  );
};

export default JudgeLogin;