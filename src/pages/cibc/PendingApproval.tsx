/**
 * CIBC Power by KATH - Pending Approval Page
 *
 * Shown when user is registered but not yet approved by admin
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mail, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';

const PendingApproval: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // GSAP Animation
    gsap.fromTo(
      '.pending-card',
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

      <div className="pending-card relative w-full max-w-lg">
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
            <Clock className="w-10 h-10 text-amber-600" />
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-4">
            Menunggu Persetujuan Admin
          </h1>

          {/* Message */}
          <p className="font-body text-gray-600 text-center mb-8 leading-relaxed">
            Terima kasih telah mendaftar! Akun Anda sedang dalam proses verifikasi oleh tim panitia.
            Anda akan menerima email konfirmasi setelah akun disetujui.
          </p>

          {/* Info Steps */}
          <div className="bg-[#F9F8F6] rounded-2xl p-6 mb-8">
            <h3 className="font-body font-semibold text-[#0F0F0F] mb-4">Langkah Selanjutnya:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-700">Tunggu email konfirmasi dari admin</p>
                  <p className="font-body text-xs text-gray-500">Biasanya diproses dalam 1-3 hari kerja</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-700">Cek folder spam jika email tidak masuk</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-700">Setelah disetujui, login untuk mengakses dashboard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-8">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm text-blue-800 font-medium">
                Konfirmasi Email
              </p>
              <p className="font-body text-xs text-blue-700 mt-1">
                Pastikan email Anda aktif dan dapat menerima pesan dari panitia.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/cibc/login"
              className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>

            <a
              href="mailto:cibc@kathevent.com"
              className="w-full py-3.5 border-2 border-gray-200 hover:border-[#FFB22C] text-gray-700 font-body font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Hubungi Panitia
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-500 text-sm font-body">
          Butuh bantuan?{' '}
          <a href="mailto:cibc@kathevent.com" className="text-[#FFB22C] hover:underline font-medium">
            Hubungi Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;