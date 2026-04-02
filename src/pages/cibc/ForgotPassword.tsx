/**
 * CIBC Power by KATH - Forgot Password Page
 *
 * Info page directing users to contact admin for password reset
 * Color Theme: Light Cream (#F9F8F6) & Dark Text (#0F0F0F) & Gold (#FFB22C)
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, ArrowLeft, MessageCircle, Clock } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // GSAP Animation
    gsap.fromTo(
      '.forgot-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] to-white flex items-center justify-center px-4 py-12">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB22C]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB22C]/5 rounded-full blur-[100px]" />
      </div>

      <div className="forgot-card relative w-full max-w-lg">
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
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <Mail className="w-10 h-10 text-amber-600" />
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
            Lupa Password?
          </h1>

          {/* Message */}
          <p className="font-body text-gray-600 text-center mb-8 leading-relaxed">
            Jika Anda lupa password, silakan hubungi admin untuk reset password.
          </p>

          {/* Info Steps */}
          <div className="bg-[#F9F8F6] rounded-2xl p-6 mb-8">
            <h3 className="font-body font-semibold text-[#0F0F0F] mb-4">Cara Reset Password:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-700">Hubungi admin via email atau WhatsApp</p>
                  <p className="font-body text-xs text-gray-500">Sertakan email akun Anda</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-700">Admin akan memverifikasi akun Anda</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-700">Admin akan memberikan password baru</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 mb-8">
            <a
              href="mailto:cibc@kathevent.com"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-body font-medium text-blue-800">Email Admin</p>
                <p className="font-body text-sm text-blue-600">cibc@kathevent.com</p>
              </div>
            </a>

            <a
              href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20reset%20password%20akun%20CIBC%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-body font-medium text-green-800">WhatsApp Admin</p>
                <p className="font-body text-sm text-green-600">+62 812-3456-7890</p>
              </div>
            </a>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-8">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm text-amber-800 font-medium">
                Waktu Respon
              </p>
              <p className="font-body text-xs text-amber-700 mt-1">
                Admin akan merespon dalam 1x24 jam kerja.
              </p>
            </div>
          </div>

          {/* Back to Login */}
          <Link
            to="/cibc/login"
            className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-500 text-sm font-body">
          Ingat password?{' '}
          <Link to="/cibc/login" className="text-[#FFB22C] hover:underline font-medium">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;