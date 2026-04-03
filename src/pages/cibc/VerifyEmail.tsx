/**
 * CIBC Power by KATH - Email Verification Page
 *
 * Shown when user needs to verify their email address
 */

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resent'>('loading');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email') || '';

  useEffect(() => {
    window.scrollTo(0, 0);

    // GSAP Animation
    gsap.fromTo(
      '.verify-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // Check if we have a token in the URL (from email link)
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (token && type === 'signup') {
      verifyEmail(token);
    } else if (!email) {
      // No email and no token - show instructions
      setStatus('error');
      setMessage('No email address provided. Please check your verification email.');
    } else {
      // Just show the "check your email" message
      setStatus('loading');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      setStatus('error');
      setMessage('Email verification is not available at this time.');
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/cibc/login');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('An unexpected error occurred during verification.');
    }
  };

  const handleResendEmail = async () => {
    if (!email || !isSupabaseConfigured() || !supabase) {
      setMessage('Please provide your email address.');
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setStatus('resent');
        setMessage('Verification email has been resent!');
      }
    } catch (err) {
      setMessage('Failed to resend verification email.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              {email ? (
                <Mail className="w-10 h-10 text-blue-600" />
              ) : (
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
              Check Your Email
            </h1>
            <p className="font-body text-gray-600 text-center mb-6">
              We've sent a verification link to:
            </p>
            <p className="font-body font-semibold text-[#0F0F0F] text-center mb-6 bg-gray-100 py-2 px-4 rounded-lg">
              {email || 'your@email.com'}
            </p>
            <p className="font-body text-gray-500 text-center text-sm mb-8">
              Click the link in the email to verify your account. The link will expire in 24 hours.
            </p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
              Email Verified!
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
              Verification Failed
            </h1>
            <p className="font-body text-gray-600 text-center mb-6">
              {message}
            </p>
          </>
        );

      case 'resent':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
              Email Resent!
            </h1>
            <p className="font-body text-gray-600 text-center mb-6">
              {message}
            </p>
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

      <div className="verify-card relative w-full max-w-lg">
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

          {/* Actions */}
          <div className="space-y-3 mt-8">
            <Link
              to="/cibc/login"
              className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            {email && status !== 'success' && (
              <button
                onClick={handleResendEmail}
                className="w-full py-3.5 border-2 border-gray-200 hover:border-[#FFB22C] text-gray-700 font-body font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Resend Verification Email
              </button>
            )}
          </div>
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

export default VerifyEmail;