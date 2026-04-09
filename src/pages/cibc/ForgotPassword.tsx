/**
 * CIBC Power by KATH - Forgot Password Page
 * Color Theme: Light Cream (#F9F8F6), White & Gold (#FFB22C)
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, ArrowLeft, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();
  useEffect(() => {
    // GSAP Animation
    gsap.fromTo(
      '.forgot-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  return (
    // Memastikan halaman full screen dan tidak bisa di-scroll
    <div className="h-screen w-full bg-[#F9F8F6] flex items-center justify-center px-4 overflow-hidden relative">
      
      {/* Background Decorations (Gold Theme) */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#FFB22C]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-[#FFB22C]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Card - Dikecilkan ukurannya (max-w-[400px]) */}
      <div className="forgot-card w-full max-w-[400px] bg-white rounded-[2rem] shadow-xl shadow-[#FFB22C]/5 border border-gray-100 p-6 md:p-8 relative z-10 flex flex-col">
        
        {/* Logo CIBC di dalam form */}
        <div className="text-center mb-4">
          <img
            src="/CIBC-logo-white.png"
            alt="CIBC Power Logo"
            className="h-10 mx-auto object-contain"
            style={{ filter: 'brightness(0)', opacity: 0.9 }}
          />
        </div>

        <h1 className="font-display text-xl md:text-2xl font-bold text-[#0F0F0F] text-center mb-2">
          {t('Lupa Password?', 'Forgot Password?')}
        </h1>
        <p className="font-body text-xs text-gray-500 text-center mb-5 leading-relaxed">
          {t('Silakan hubungi admin untuk reset password akun Anda.', 'Please contact admin to reset your account password.')}
        </p>

        {/* Info Steps - Dibuat lebih compact */}
        <div className="bg-[#F9F8F6] rounded-xl p-4 mb-5 border border-gray-50">
          <h3 className="font-body text-[13px] font-bold text-[#0F0F0F] mb-3">{t('Cara Reset Password:', 'How to Reset Password:')}</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FFB22C] text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
              <p className="font-body text-xs text-gray-600 mt-0.5">{t('Hubungi admin via Email atau WA', 'Contact admin via Email or WhatsApp')}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FFB22C] text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
              <p className="font-body text-xs text-gray-600 mt-0.5">{t('Admin akan memverifikasi akun Anda', 'Admin will verify your account')}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FFB22C] text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
              <p className="font-body text-xs text-gray-600 mt-0.5">{t('Menerima password baru (Max 1x24 jam)', 'Receive new password (Max 1x24 hours)')}</p>
            </div>
          </div>
        </div>

        {/* Contact Info - Tema Putih Emas (Compact) */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Email tetap bisa diklik */}
          <a
            href="mailto:cibc@kathevent.com"
            className="flex items-center gap-2 p-3 bg-white border border-[#FFB22C]/30 rounded-xl hover:bg-[#FFB22C]/5 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#FFB22C] flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-500">{t('Email Admin', 'Admin Email')}</p>
              <p className="text-[11px] font-bold text-[#0F0F0F] truncate">cibc@kathevent</p>
            </div>
          </a>

          {/* WA hanya berupa teks informasi (bukan link), menggunakan asset gambar */}
          <div className="flex items-center gap-2 p-3 bg-white border border-[#FFB22C]/30 rounded-xl">
            <img 
              src="/whatsapp-icon.png" 
              alt="WhatsApp" 
              className="w-4 h-4 object-contain flex-shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-500">{t('WA Admin', 'Admin WhatsApp')}</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#0F0F0F] truncate">+62 812-3456-7890</p>
            </div>
          </div>
        </div>

        {/* Notice Waktu Respon - Warna Merah sebagai Peringatan */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <Clock className="w-3.5 h-3.5 text-red-500" />
          <p className="font-body text-[10px] text-red-600 font-bold">
            {t('Admin akan merespon dalam waktu 1x24 jam kerja', 'Admin will respond within 1x24 business hours')}
          </p>
        </div>

        {/* Area Bawah - Masuk di dalam form */}
        <div className="mt-auto">
          <Link
            to="/cibc/login"
            className="w-full py-3 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-body font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Kembali ke Login', 'Back to Login')}
          </Link>

          {/* Tulisan Ingat Password ada di bawah button */}
          <p className="text-center text-xs text-gray-500 font-body">
            {t('Ingat password?', 'Remember your password?')}{' '}
            <Link to="/cibc/login" className="text-[#FFB22C] hover:underline font-bold">
              {t('Masuk', 'Sign In')}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
