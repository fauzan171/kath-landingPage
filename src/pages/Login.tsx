import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ChevronLeft
} from 'lucide-react';

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
  const { login, isAuthenticated } = useAuth();
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
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setSubmitError(result.message);
      }
    } catch (error) {
      setSubmitError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white 
    placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors
    ${errors[fieldName] ? 'border-red-500' : 'border-kath-charcoal/50'}
  `;

  return (
    <div className="min-h-screen bg-kath-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kath-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kath-gold/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-kath-off-white/70 hover:text-kath-gold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-body text-sm">Kembali</span>
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="font-body text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-kath-dark-gray/50 border border-kath-charcoal/30 rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-kath-gold/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-kath-gold" />
            </div>
            <h1 className="font-display text-3xl text-kath-white mb-2">
              Selamat Datang
            </h1>
            <p className="font-body text-kath-off-white/60">
              Login untuk mengakses dashboard peserta
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="font-body text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block font-body text-sm text-kath-off-white mb-2">
                Email <span className="text-kath-gold">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-body text-sm text-kath-off-white mb-2">
                Password <span className="text-kath-gold">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-kath-off-white/40 hover:text-kath-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-kath-charcoal/50 bg-kath-black/50 text-kath-gold focus:ring-kath-gold focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-body text-sm text-kath-off-white/70 group-hover:text-kath-off-white transition-colors">
                  Ingat saya
                </span>
              </label>

              <button
                type="button"
                className="font-body text-sm text-kath-gold hover:underline"
                onClick={() => alert('Fitur lupa password akan segera hadir!')}
              >
                Lupa password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-kath-gold hover:bg-kath-gold-light disabled:bg-kath-gold/50 text-kath-black font-body font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-kath-black/30 border-t-kath-black rounded-full animate-spin" />
                  <span>Login...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Register Link */}
            <p className="text-center font-body text-sm text-kath-off-white/60">
              Belum punya akun?{' '}
              <Link to="/register" className="text-kath-gold hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </form>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-center font-body text-xs text-kath-off-white/40">
          Butuh bantuan? Hubungi kami di{' '}
          <a href="mailto:support@kathevent.com" className="text-kath-gold hover:underline">
            support@kathevent.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
