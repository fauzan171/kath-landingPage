/**
 * CIBC Power by KATH - Login Page
 *
 * Login page for competition participants
 * Color Theme: Cream (#E6DDC5) & Black
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Trophy, Users } from '../../icons';
import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
import { supabaseAuthService } from '@/services/supabase.service';
import { isSupabaseConfigured } from '@/config/environment';
import { useCSRFToken } from '@/components/CSRFProtectedForm';

const CIBCLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { token: csrfToken, validateAndRefresh: validateCSRF } = useCSRFToken();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if already logged in — also checks approval status to prevent loop
  useEffect(() => {
    const checkSession = async () => {
      if (!isSupabaseConfigured()) return;

      try {
        const user = await supabaseAuthService.getCurrentUser();
        if (!user) return;

        // Check status in users table before redirecting
        const { supabase } = await import('@/lib/supabase');
        if (!supabase) return;

        const { data: userData } = await supabase
          .from('users')
          .select('status, role')
          .eq('id', user.id)
          .maybeSingle();

        const userStatus = userData?.status || 'pending';
        const userRole = userData?.role || 'participant';

        // Admins go straight to admin dashboard
        if (userRole === 'admin' || userRole === 'super_admin') {
          navigate('/admin');
          return;
        }

        // For participants, check team payment status
        const { data: teamMember } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (teamMember?.team_id) {
          const { data: teamData } = await supabase
            .from('teams')
            .select('payment_status, status')
            .eq('id', teamMember.team_id)
            .maybeSingle();

          const teamPaymentStatus = teamData?.payment_status;

          if (teamPaymentStatus === 'verified') {
            navigate('/cibc/dashboard');
          } else {
            // Payment not verified yet
            navigate('/cibc/pending-approval');
          }
        } else if (userStatus === 'rejected') {
          // User rejected — stay on login
        } else {
          // No team or pending
          navigate('/cibc/pending-approval');
        }
      } catch {
        // No active session — stay on login page
      }
    };
    checkSession();
  }, [navigate]);

  // GSAP Animations
  useEffect(() => {
    gsap.fromTo(
      '.login-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.stat-item',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Supabase Auth only - no mock data
      if (!isSupabaseConfigured()) {
        toast.error('Supabase is not configured. Please check your .env file.');
        setIsLoading(false);
        return;
      }

      // Sign in with Supabase Auth
      const { user } = await supabaseAuthService.signIn(formData.email.trim(), formData.password);

      if (user) {
        // Get user details from users table
        const { supabase } = await import('@/lib/supabase');
        if (supabase) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          // Log for debugging (only errors, not user data)
          if (userError) {
            console.error('[Login] Error fetching user data');
          }

          // Get user role from users table (role column exists in users table)
          const userRole = userData?.role || 'participant';

          // ============================================
          // ADMIN APPROVAL CHECK
          // ============================================
          // Admins can always login
          if (userRole !== 'admin' && userRole !== 'super_admin') {
            // Check if user record exists
            if (!userData) {
              console.warn('[Login] No user record found in users table for:', user.id);
              // User record doesn't exist - this might happen if trigger didn't fire
              // Create the user record now
              await supabase
                .from('users')
                .insert({
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata?.name || user.email?.split('@')[0],
                  status: 'pending',
                  role: 'participant',
                });

              toast.warning('Account Pending Approval', {
                description: 'Your account is waiting for admin approval. Please check your email for confirmation.',
              });
              await supabaseAuthService.signOut();
              navigate('/cibc/pending-approval');
              return;
            }

            // Check if user is rejected
            const userStatus = userData.status || 'pending';
            if (userStatus === 'rejected') {
              await supabaseAuthService.signOut();
              toast.error('Account Rejected', {
                description: userData?.rejection_reason || 'Registrasi Anda tidak disetujui. Hubungi panitia.',
              });
              return;
            }

            // ✅ Check team payment status — user can only login after payment is verified
            const { data: teamMember } = await supabase
              .from('team_members')
              .select('team_id')
              .eq('user_id', user.id)
              .maybeSingle();

            if (teamMember?.team_id) {
              const { data: teamData } = await supabase
                .from('teams')
                .select('payment_status, status')
                .eq('id', teamMember.team_id)
                .maybeSingle();

              const teamPaymentStatus = teamData?.payment_status;
              const teamStatus = teamData?.status;

              if (teamPaymentStatus === 'pending' || (!teamPaymentStatus && teamStatus !== 'verified')) {
                // Payment not yet verified — user must wait
                await supabaseAuthService.signOut();
                toast.warning('Pembayaran Belum Diverifikasi', {
                  description: 'Bukti pembayaran Anda sedang diverifikasi oleh panitia. Silakan coba lagi nanti.',
                });
                navigate('/cibc/pending-approval');
                return;
              }

              if (teamPaymentStatus === 'rejected') {
                await supabaseAuthService.signOut();
                toast.error('Pembayaran Ditolak', {
                  description: 'Bukti pembayaran Anda ditolak. Silakan upload ulang bukti pembayaran yang valid.',
                });
                return;
              }

              // Update user status to approved if team is verified
              if (teamPaymentStatus === 'verified' && userStatus === 'pending') {
                await supabase
                  .from('users')
                  .update({ status: 'approved' })
                  .eq('id', user.id);
              }
            } else {
              // No team yet — check user status
              if (userStatus === 'pending') {
                await supabaseAuthService.signOut();
                toast.warning('Account Pending Approval', {
                  description: 'Akun Anda sedang menunggu persetujuan admin.',
                });
                navigate('/cibc/pending-approval');
                return;
              }
            }

            // ✅ Cek force_password_change — user pakai password sementara dari admin
            if (userData?.force_password_change === true) {
              toast.warning('Ganti Password', {
                description: 'Anda login dengan password sementara. Harap buat password permanen Anda.',
              });
              navigate('/cibc/change-password');
              return;
            }
          }

          toast.success('Welcome back!', {
            description: 'Login successful. Redirecting to dashboard...',
          });

          // Redirect based on role from Supabase query
          if (userRole === 'admin' || userRole === 'super_admin') {
            navigate('/admin');
          } else {
            navigate('/cibc/dashboard');
          }
        }
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
      toast.error('Login failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Trophy, value: '500+', label: 'Teams Registered' },
    { icon: Users, value: '2,000+', label: 'Participants' },
    { icon: Shield, value: '$100K+', label: 'Total Prizes' },
  ];

  return (
    <div className="min-h-screen bg-white flex font-body">
      {/* Left Side - Branding & Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F9F8F6] relative overflow-hidden border-r border-gray-100">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#FFB22C]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FFB22C]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 lg:px-24">
          {/* Logo Terupdate (Sama dengan Footer) */}
          <Link to="/cibc" className="flex flex-col items-start gap-2 mb-12 group">
            <img
              src="/CIBC-logo-white.png"
              alt="CIBC Power Logo"
              className="h-14 md:h-16 w-auto object-contain transition-all duration-300 transform-gpu"
              style={{
                filter: 'brightness(0)',
                opacity: 0.9
              }}
            />
            {/* <p className="font-body text-[10px] md:text-xs text-gray-500 font-semibold tracking-wider ml-1">
              by KATH Event Organizer
            </p> */}
          </Link>

          <h2 className="text-4xl font-bold text-[#0F0F0F] mb-4 font-display leading-tight">
            Innovate for a<br />
            <span className="text-[#FFB22C]">Sustainable Future</span>
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-md">
            Join thousands of innovators competing to solve real-world sustainability challenges.
          </p>

          <div className="space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-item flex items-center gap-5 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm"
              >
                <div className="w-12 h-12 bg-[#FFB22C]/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#FFB22C]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#0F0F0F] font-display">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="login-card w-full max-w-md z-10">
          {/* Mobile Logo Terupdate */}
          <div className="lg:hidden flex flex-col items-center justify-center gap-2 mb-10">
            <img
              src="/CIBC-logo-white.png"
              alt="CIBC Power Logo"
              className="h-12 w-auto object-contain"
              style={{
                filter: 'brightness(0)',
                opacity: 0.9
              }}
            />
            {/* <p className="font-body text-[9px] text-gray-500 font-semibold tracking-wider">
              by KATH Event Organizer
            </p> */}
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F0F0F] mb-3 font-display">Welcome Back</h2>
            <p className="text-gray-500 font-medium text-sm sm:text-base">Sign in to access your competition dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <div>
              <Label htmlFor="email" className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-[#F4F6F8] pl-11 pr-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : ''}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full bg-[#F4F6F8] pl-11 pr-12 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F0F0F] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.rememberMe}
                  onChange={e => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#FFB22C] focus:ring-[#FFB22C] cursor-pointer"
                />
                <Label htmlFor="remember" className="text-gray-500 text-sm cursor-pointer font-medium select-none">
                  Remember me
                </Label>
              </div>
              <Link to="/cibc/forgot-password" className="text-[#FFB22C] text-sm font-bold hover:text-[#FFB22C]/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFB22C] text-[#0F0F0F] rounded-full font-bold py-3.5 text-sm hover:bg-[#FFB22C]/90 shadow-md shadow-[#FFB22C]/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0F0F0F]/30 border-t-[#0F0F0F] rounded-full animate-spin" />
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium">New to CIBC?</span>
            </div>
          </div>

          <Link
            to="/cibc/register"
            className="flex items-center justify-center w-full py-3.5 px-4 border-2 border-[#F4F6F8] text-[#0F0F0F] font-bold text-sm rounded-xl hover:border-[#FFB22C] hover:bg-[#FFB22C]/5 transition-all"
          >
            Create Your Team Account
          </Link>

          <Link
            to="/cibc"
            className="block w-full text-center mt-6 text-gray-400 hover:text-[#0F0F0F] transition-colors text-sm font-medium"
          >
            ← Back to Competition Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CIBCLogin;