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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { initializeCIBCData } from '../../services/cibcMockData';

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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    // Initialize CIBC data (creates test user if not exists)
    initializeCIBCData();
  }, []);

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check mock credentials
    const storedUsers = JSON.parse(localStorage.getItem('cibc_users') || '[]');
    const user = storedUsers.find(
      (u: { email: string; password: string }) =>
        u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Store session
      localStorage.setItem('cibc_current_user', JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        category: user.category,
        teamId: user.teamId,
      }));

      toast.success('Welcome back!', {
        description: 'Login successful. Redirecting to dashboard...',
      });

      navigate('/cibc/dashboard');
    } else {
      toast.error('Login failed', {
        description: 'Invalid email or password. Please try again.',
      });
    }

    setIsLoading(false);
  };

  const stats = [
    { icon: Trophy, value: '500+', label: 'Teams Registered' },
    { icon: Users, value: '2,000+', label: 'Participants' },
    { icon: Shield, value: '$100K+', label: 'Total Prizes' },
  ];

  return (
    <div className="min-h-screen bg-cibc-bgMain flex">
      {/* Left Side - Branding & Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cibc-primary/20 via-cibc-bgMain to-cibc-bgMain relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cibc-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cibc-primary/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <Link to="/cibc" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-cibc-primary rounded-xl flex items-center justify-center">
              <span className="text-cibc-textDark font-bold text-xl font-display">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-display">CIBC Power</h1>
              <p className="text-cibc-primary text-sm font-body">by KATH</p>
            </div>
          </Link>

          {/* Tagline */}
          <h2 className="text-4xl font-bold text-white mb-4 font-display">
            Innovate for a<br />
            <span className="text-cibc-primary">Sustainable Future</span>
          </h2>
          <p className="text-cibc-textSecondary text-lg mb-12 max-w-md font-body">
            Join thousands of innovators competing to solve real-world sustainability challenges.
          </p>

          {/* Stats */}
          <div className="space-y-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-item flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-cibc-primary/10 rounded-xl flex items-center justify-center border border-cibc-primary/20">
                  <stat.icon className="w-7 h-7 text-cibc-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                  <p className="text-cibc-textMuted text-sm font-body">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cibc-primary to-transparent" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cibc-bgCard">
        <div className="login-card w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-cibc-primary rounded-xl flex items-center justify-center">
              <span className="text-cibc-textDark font-bold text-lg font-display">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">CIBC Power</h1>
              <p className="text-cibc-primary text-xs font-body">by KATH</p>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 font-display">Welcome Back</h2>
            <p className="text-cibc-textSecondary font-body">Sign in to access your competition dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-body">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cibc-textMuted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-10 bg-cibc-bgSection border-cibc-border text-white placeholder:text-cibc-textMuted focus:border-cibc-primary focus:ring-cibc-primary/20 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm font-body">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-body">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cibc-textMuted" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={`pl-10 pr-10 bg-cibc-bgSection border-cibc-border text-white placeholder:text-cibc-textMuted focus:border-cibc-primary focus:ring-cibc-primary/20 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cibc-textMuted hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm font-body">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={checked =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                  className="border-cibc-border data-[state=checked]:bg-cibc-primary data-[state=checked]:border-cibc-primary"
                />
                <Label htmlFor="remember" className="text-cibc-textSecondary text-sm cursor-pointer font-body">
                  Remember me
                </Label>
              </div>
              <Link
                to="/cibc/forgot-password"
                className="text-cibc-primary text-sm hover:text-cibc-primaryDark transition-colors font-body"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cibc-primary hover:bg-cibc-primaryDark text-cibc-textDark font-semibold py-6 text-lg font-body"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-cibc-textDark/30 border-t-cibc-textDark rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cibc-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-cibc-bgCard text-cibc-textMuted font-body">New to CIBC?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/cibc/register"
            className="block w-full text-center py-3 px-4 border border-cibc-primary/40 text-cibc-primary rounded-lg hover:bg-cibc-primary/10 transition-colors font-body"
          >
            Create Your Team Account
          </Link>

          {/* Back to Landing */}
          <Link
            to="/cibc"
            className="block w-full text-center mt-4 text-cibc-textMuted hover:text-white transition-colors text-sm font-body"
          >
            ← Back to Competition Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CIBCLogin;