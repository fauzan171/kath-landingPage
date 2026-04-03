/**
 * CIBC Power by KATH - Reset Password Page
 *
 * Handles password reset via Supabase Auth
 * User arrives here from the password reset email link
 */

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';
import { validatePassword } from '@/utils/validate';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);

    // GSAP Animation
    gsap.fromTo(
      '.reset-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // Check if we have a valid session from the reset link
    checkSession();
  }, []);

  const checkSession = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setStatus('error');
      setMessage('Password reset is not available at this time.');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // User has a valid session from the reset link
        setStatus('form');
      } else {
        // Check if there's an error in the URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Invalid or expired reset link.');
        } else {
          // Might be from email link - Supabase will handle the token
          setStatus('form');
        }
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to verify reset session.');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else {
        setStatus('success');
        setMessage('Your password has been reset successfully!');

        // Sign out and redirect to login after 3 seconds
        setTimeout(async () => {
          if (supabase) {
            await supabase.auth.signOut();
          }
          navigate('/cibc/login');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-[#FFB22C] animate-spin mx-auto mb-4" />
            <p className="font-body text-gray-600">Verifying reset link...</p>
          </div>
        );

      case 'form':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
              <Lock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
              Reset Password
            </h1>
            <p className="font-body text-gray-600 text-center mb-8">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-gray-800 transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-gray-800 transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-body text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                    • At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                    • At least one uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                    • At least one lowercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                    • At least one number
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 disabled:bg-[#FFB22C]/50 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        );

      case 'success':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
              Password Reset!
            </h1>
            <p className="font-body text-gray-600 text-center mb-6">
              {message}
            </p>
            <p className="font-body text-gray-500 text-center text-sm">
              Redirecting to login...
            </p>
          </>
        );

      case 'error':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
              Reset Failed
            </h1>
            <p className="font-body text-gray-600 text-center mb-6">
              {message}
            </p>
            <Link
              to="/cibc/forgot-password"
              className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
            >
              Request New Reset Link
            </Link>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] to-white flex items-center justify-center px-4 py-12">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB22C]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB22C]/5 rounded-full blur-[100px]" />
      </div>

      <div className="reset-card relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/CIBC-logo-white.png"
            alt="CIBC Power Logo"
            className="h-12 mx-auto object-contain"
            style={{ filter: 'brightness(0)', opacity: 0.9 }}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 md:p-10">
          {renderContent()}

          {status !== 'loading' && status !== 'success' && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to="/cibc/login"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-[#FFB22C] font-body text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-500 text-sm font-body">
          Need help?{' '}
          <a href="mailto:cibc@kathevent.com" className="text-[#FFB22C] hover:underline font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;