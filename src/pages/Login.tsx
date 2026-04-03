import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ChevronLeft
} from '../icons';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Check for success message from registration
  useEffect(() => {
    const state = location.state as { message?: string };
    if (state?.message) {
      setSuccessMessage(state.message);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔍 Checking auth status:', { isAuthenticated, isLoading });

    if (!isLoading && isAuthenticated) {
      console.log('✅ User authenticated, redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    console.log('🔐 Login attempt:', { email: formData.email });

    try {
      const result = await login({ email: formData.email, password: formData.password });

      console.log('🔐 Login result:', result);

      if (result.success) {
        console.log('✅ Login success! Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        console.log('❌ Login failed:', result.message);
        setSubmitError(result.message);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setSubmitError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3.5 bg-white border rounded-xl font-body text-kath-text-primary
    placeholder-kath-text-muted focus:outline-none focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 transition-all
    ${errors[fieldName] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : 'border-kath-bg-section hover:border-kath-primary/30'}
  `;

  return (
    <div className="min-h-screen bg-kath-bg-main flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kath-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kath-gold/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-kath-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-kath-text-secondary hover:text-kath-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-body text-sm">Kembali</span>
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="font-body text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-kath-bg-section rounded-3xl p-8 shadow-xl shadow-kath-primary/5">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-kath-primary to-kath-primary-dark flex items-center justify-center shadow-lg shadow-kath-primary/25">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl text-kath-text-primary mb-2">
              Selamat Datang
            </h1>
            <p className="font-body text-kath-text-secondary">
              Login untuk mengakses dashboard peserta
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="font-body text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-body text-sm text-kath-text-primary mb-2">
                Email <span className="text-kath-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={`${inputClasses('email')} pl-12`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-body text-sm text-kath-text-primary mb-2">
                Password <span className="text-kath-primary">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className={`${inputClasses('password')} pl-12 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-kath-text-muted hover:text-kath-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-kath-bg-section text-kath-primary focus:ring-kath-primary/20"
                />
                <span className="font-body text-sm text-kath-text-secondary">Ingat saya</span>
              </label>
              <Link
                to="#"
                className="font-body text-sm text-kath-primary hover:text-kath-primary-dark transition-colors"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-kath-primary hover:bg-kath-primary-dark disabled:bg-kath-primary/50 text-kath-bg-dark font-body font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-kath-primary/25 hover:shadow-xl hover:shadow-kath-primary/30"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-kath-bg-section" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white font-body text-sm text-kath-text-muted">
                atau
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="font-body text-kath-text-secondary">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-kath-primary hover:text-kath-primary-dark font-medium transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 font-body text-sm text-kath-text-muted">
          © 2026 KATH Event Organizer. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
