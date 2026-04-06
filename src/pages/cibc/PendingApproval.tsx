/**
 * CIBC Power by KATH - Pending Approval Page
 * Color Theme: Light Cream (#F9F8F6), White & Gold (#FFB22C)
 *
 * Shown when user is registered but not yet approved by admin
 */

import React, { useEffect } from 'react';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { supabaseAuthService } from '@/services/supabase.service';
import { appContactConfig } from '@/config';

const PendingApproval: React.FC = () => {
  useEffect(() => {
    // GSAP Animation
    gsap.fromTo(
      '.pending-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleBackToLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabaseAuthService.signOut();
    window.location.href = '/cibc/login';
  };

  return (
    // Memastikan halaman full screen dan tidak bisa di-scroll
    <div className="h-screen w-full bg-[#F9F8F6] flex items-center justify-center px-4 overflow-hidden relative">
      
      {/* Background Decorations (Gold Theme) */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#FFB22C]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-[#FFB22C]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Card - Dikecilkan ukurannya (max-w-[400px]) */}
      <div className="pending-card w-full max-w-[400px] bg-white rounded-[2rem] shadow-xl shadow-[#FFB22C]/5 border border-gray-100 p-6 md:p-8 relative z-10 flex flex-col">
        
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
          Menunggu Persetujuan
        </h1>
        <p className="font-body text-[11px] md:text-xs text-gray-500 text-center mb-5 leading-relaxed">
          Terima kasih telah mendaftar! Akun Anda sedang dalam proses verifikasi oleh tim panitia.
        </p>

        {/* Info Steps */}
        <div className="bg-[#F9F8F6] rounded-xl p-4 mb-4 border border-gray-50">
          <h3 className="font-body text-[13px] font-bold text-[#0F0F0F] mb-3">Langkah Selanjutnya:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FFB22C] text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
              <p className="font-body text-xs text-gray-600 mt-0.5">Tunggu konfirmasi via WhatsApp dari panitia (1-3 hari kerja)</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FFB22C] text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
              <p className="font-body text-xs text-gray-600 mt-0.5">Cek WhatsApp secara berkala untuk update status</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FFB22C] text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
              <p className="font-body text-xs text-gray-600 mt-0.5">Setelah disetujui, login ke dashboard</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Notice - Hijau WA */}
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100 mb-6">
          <MessageCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-xs text-green-800 font-bold">
              Konfirmasi via WhatsApp
            </p>
            <p className="font-body text-[10px] text-green-600 mt-1 leading-relaxed">
              Pastikan nomor WhatsApp Anda aktif. Panitia akan menghubungi via WhatsApp untuk konfirmasi pendaftaran dan pembayaran.
            </p>
            <a
              href={`${appContactConfig.whatsappUrl}?text=${encodeURIComponent('Halo panitia CIBC, saya sudah mendaftar dan ingin mengonfirmasi status pendaftaran saya.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              Chat Panitia via WA
            </a>
          </div>
        </div>

        {/* Area Bawah - Masuk di dalam form */}
        <div className="mt-auto">
          <button
            onClick={handleBackToLogin}
            className="w-full py-3 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-body font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </button>

          {/* Hubungi Panitia dipindah ke bawah */}
          <p className="text-center text-xs text-gray-500 font-body">
            Butuh bantuan?{' '}
            <a href="mailto:cibc@kathevent.com" className="text-[#FFB22C] hover:underline font-bold">
              Hubungi Panitia
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default PendingApproval;
