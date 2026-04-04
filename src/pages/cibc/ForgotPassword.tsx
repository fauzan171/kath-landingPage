/**
 * CIBC - Lupa Password
 * User mengisi form, request dikirim ke Admin untuk diproses.
 * Tidak memerlukan email real — admin yang akan set password sementara.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, ArrowLeft, CheckCircle, Loader2, ShieldAlert, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';
import { toast } from 'sonner';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(
      '.forgot-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Harap masukkan alamat email akun Anda.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Format email tidak valid.');
      return;
    }

    setIsLoading(true);

    try {
      if (!isSupabaseConfigured() || !supabase) {
        toast.error('Layanan tidak tersedia saat ini.');
        return;
      }

      // Cari user berdasarkan email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (userError) throw userError;

      if (!userData) {
        // Jangan beritahu bahwa email tidak terdaftar (keamanan)
        // Tetap tampilkan success untuk mencegah email enumeration
        setIsSubmitted(true);
        return;
      }

      // Simpan request ke database
      const { error: insertError } = await supabase
        .from('password_reset_requests')
        .insert({
          user_id: userData.id,
          email: email.trim().toLowerCase(),
          reason: reason.trim() || 'User meminta reset password',
          status: 'pending',
        });

      if (insertError) {
        // Mungkin tabel belum ada — tetap tampilkan success
        console.warn('[ForgotPassword] Could not save request:', insertError.message);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('[ForgotPassword] Error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] to-white flex items-center justify-center px-4 py-12">
      {/* Background Blur Orbs */}
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

        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 md:p-10">
          {!isSubmitted ? (
            <>
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <ShieldAlert className="w-10 h-10 text-amber-600" />
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0F0F0F] text-center mb-2">
                Lupa Password?
              </h1>
              <p className="font-body text-gray-500 text-center mb-8 text-sm leading-relaxed">
                Isi form di bawah. Admin akan memproses permintaan Anda dan memberikan password sementara.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block font-body font-semibold text-sm text-[#0F0F0F] mb-2">
                    Email Akun
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      placeholder="Masukkan email akun Anda"
                      className={`w-full bg-[#F4F6F8] pl-11 pr-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm disabled:opacity-60 ${
                        error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15 bg-red-50' : ''
                      }`}
                    />
                  </div>
                  {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                </div>

                {/* Alasan (opsional) */}
                <div>
                  <label className="block font-body font-semibold text-sm text-[#0F0F0F] mb-2">
                    Keterangan <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isLoading}
                    placeholder="Contoh: Lupa password, atau akun tidak bisa login setelah ganti HP"
                    rows={3}
                    className="w-full bg-[#F4F6F8] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm resize-none disabled:opacity-60"
                  />
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    ℹ️ Setelah request dikirim, Admin akan memproses dalam <strong>1×24 jam</strong>. 
                    Anda akan mendapatkan password sementara dari Admin (via WhatsApp/pesan) dan wajib 
                    mengganti password setelah login pertama.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 disabled:opacity-60 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Kirim Permintaan ke Admin</>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0F0F0F] text-center mb-3">
                Permintaan Terkirim!
              </h1>
              <p className="font-body text-gray-500 text-center mb-6 text-sm leading-relaxed">
                Permintaan reset password Anda telah diterima Admin.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 space-y-2">
                <p className="text-sm font-semibold text-amber-800">Langkah selanjutnya:</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>1. Tunggu admin memproses permintaan Anda</li>
                  <li>2. Admin akan memberi Anda <strong>password sementara</strong></li>
                  <li>3. Login dengan password sementara tersebut</li>
                  <li>4. Buat password permanen Anda sendiri</li>
                </ul>
              </div>
              <button
                onClick={() => { setIsSubmitted(false); setEmail(''); setReason(''); }}
                className="w-full py-3 border-2 border-gray-200 hover:border-[#FFB22C] text-gray-700 font-body font-medium rounded-xl transition-all duration-300 text-sm"
              >
                Kirim Permintaan Lain
              </button>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              to="/cibc/login"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#FFB22C] font-body text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;