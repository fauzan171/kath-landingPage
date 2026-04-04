/**
 * CIBC - Ganti Password
 * Halaman ini muncul saat user login dengan password sementara dari admin.
 * User WAJIB mengganti ke password permanen sebelum bisa akses dashboard.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.change-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });

    // Pastikan user sudah login sebelum buka halaman ini
    const checkAuth = async () => {
      if (!supabase) { navigate('/cibc/login'); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/cibc/login'); return; }
    };
    checkAuth();
  }, [navigate]);

  const passwordRules = [
    { label: 'Minimal 8 karakter', ok: password.length >= 8 },
    { label: 'Ada huruf besar (A-Z)', ok: /[A-Z]/.test(password) },
    { label: 'Ada huruf kecil (a-z)', ok: /[a-z]/.test(password) },
    { label: 'Ada angka (0-9)', ok: /[0-9]/.test(password) },
  ];
  const isPasswordValid = passwordRules.every(r => r.ok);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Password belum memenuhi syarat.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      if (!supabase) throw new Error('Supabase tidak tersedia');

      // 1. Update password di Supabase Auth (user yang sedang login)
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;

      // 2. Tandai force_password_change = false di users table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({ force_password_change: false })
          .eq('id', user.id);
      }

      setIsDone(true);
      toast.success('Password berhasil diganti!');

      // 3. Redirect ke dashboard setelah 2 detik
      setTimeout(() => navigate('/cibc/dashboard'), 2000);
    } catch (err) {
      console.error('[ChangePassword] Error:', err);
      const msg = err instanceof Error ? err.message : 'Gagal mengganti password.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] to-white flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB22C]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB22C]/5 rounded-full blur-[100px]" />
      </div>

      <div className="change-card relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/CIBC-logo-white.png" alt="CIBC" className="h-12 mx-auto object-contain" style={{ filter: 'brightness(0)', opacity: 0.9 }} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 md:p-10">
          {!isDone ? (
            <>
              {/* Icon & Header */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-amber-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0F0F0F] text-center mb-2">
                Buat Password Baru
              </h1>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800 text-center">
                  🔐 Anda sedang menggunakan <strong>password sementara</strong> dari admin.<br />
                  Buat password permanen Anda sebelum melanjutkan.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password Baru */}
                <div>
                  <label className="block font-body font-semibold text-sm text-[#0F0F0F] mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Buat password baru"
                      className="w-full bg-[#F4F6F8] pl-11 pr-12 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Syarat Password */}
                {password && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className={`flex items-center gap-2 text-xs transition-colors ${rule.ok ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${rule.ok ? 'bg-green-100' : 'bg-gray-200'}`}>
                          {rule.ok && <CheckCircle className="w-3 h-3" />}
                        </div>
                        {rule.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Konfirmasi Password */}
                <div>
                  <label className="block font-body font-semibold text-sm text-[#0F0F0F] mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className={`w-full bg-[#F4F6F8] pl-11 pr-12 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm ${
                        confirmPassword && password !== confirmPassword ? 'border-red-300 bg-red-50' : ''
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Password tidak cocok</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isPasswordValid || password !== confirmPassword}
                  className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 disabled:opacity-50 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Simpan Password Baru</>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success */
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0F0F0F] mb-3">Password Berhasil Diganti!</h1>
              <p className="text-gray-500 text-sm">Mengalihkan ke dashboard...</p>
              <div className="mt-6 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
