import { useState } from 'react';
import { Save, Loader2, Eye, EyeOff, AlertTriangle, User, Mail, Lock, Building } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { CurrentUser } from '../CIBCDashboard';

interface SettingsSectionProps {
  currentUser: CurrentUser | null;
  onRefresh: () => void;
}

const SettingsSection = ({ currentUser, onRefresh }: SettingsSectionProps) => {
  const { language } = useLanguage();

  // Form states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [isLoading, setIsLoading] = useState(false);

  // Password form
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error(language === 'id' ? 'Nama tidak boleh kosong' : 'Name cannot be empty');
      return;
    }

    setIsLoading(true);

    try {
      if (!supabase) throw new Error('Supabase not configured');

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      // Update users table if exists
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        await supabase
          .from('users')
          .update({ name: fullName, updated_at: new Date().toISOString() })
          .eq('id', user.data.user.id);
      }

      toast.success(language === 'id' ? 'Profil berhasil diperbarui' : 'Profile updated successfully');
      onRefresh();
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || (language === 'id' ? 'Gagal memperbarui profil' : 'Failed to update profile'));
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(language === 'id' ? 'Semua field harus diisi' : 'All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error(language === 'id' ? 'Password baru minimal 6 karakter' : 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(language === 'id' ? 'Password baru tidak cocok' : 'New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      if (!supabase) throw new Error('Supabase not configured');

      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        toast.error(language === 'id' ? 'Password saat ini salah' : 'Current password is incorrect');
        setIsChangingPassword(false);
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success(language === 'id' ? 'Password berhasil diubah' : 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error(error.message || (language === 'id' ? 'Gagal mengubah password' : 'Failed to change password'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#FFB22C]/10 rounded-xl">
            <User className="w-5 h-5 text-[#FFB22C]" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
            {language === 'id' ? 'Pengaturan Profil' : 'Profile Settings'}
          </h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Email (readonly) */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3 h-3" />
              {language === 'id' ? 'Email' : 'Email'}
            </label>
            <p className="font-body font-bold text-[#0F0F0F]/60 mt-1">{currentUser?.email || '-'}</p>
            <p className="font-body text-xs text-[#0F0F0F]/40 mt-1">
              {language === 'id' ? 'Email tidak dapat diubah' : 'Email cannot be changed'}
            </p>
          </div>

          {/* Full Name */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3 h-3" />
              {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-2 px-4 py-3 bg-white rounded-xl border border-[#0F0F0F]/10 focus:border-[#FFB22C] focus:ring-2 focus:ring-[#FFB22C]/20 outline-none font-body text-[#0F0F0F] transition-all"
              placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter your full name'}
            />
          </div>

          {/* Category (readonly) */}
          {currentUser?.category && (
            <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
              <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-3 h-3" />
                {language === 'id' ? 'Kategori' : 'Category'}
              </label>
              <p className="font-body font-bold text-[#0F0F0F] mt-1 capitalize">{currentUser.category}</p>
            </div>
          )}

          {/* Institution (readonly) */}
          {currentUser?.institution && (
            <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
              <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-3 h-3" />
                {language === 'id' ? 'Institusi' : 'Institution'}
              </label>
              <p className="font-body font-bold text-[#0F0F0F] mt-1">{currentUser.institution}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || fullName === currentUser?.fullName}
            className="w-full sm:w-auto px-8 py-3 bg-[#FFB22C] text-[#0F0F0F] rounded-xl font-body font-bold text-sm hover:bg-[#FFB22C]/90 shadow-md shadow-[#FFB22C]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === 'id' ? 'Menyimpan...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {language === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#FFB22C]/10 rounded-xl">
            <Lock className="w-5 h-5 text-[#FFB22C]" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
            {language === 'id' ? 'Ubah Password' : 'Change Password'}
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Password Saat Ini' : 'Current Password'}
            </label>
            <div className="relative mt-2">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white rounded-xl border border-[#0F0F0F]/10 focus:border-[#FFB22C] focus:ring-2 focus:ring-[#FFB22C]/20 outline-none font-body text-[#0F0F0F] transition-all"
                placeholder={language === 'id' ? 'Masukkan password saat ini' : 'Enter current password'}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F0F0F]/40 hover:text-[#0F0F0F] transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Password Baru' : 'New Password'}
            </label>
            <div className="relative mt-2">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white rounded-xl border border-[#0F0F0F]/10 focus:border-[#FFB22C] focus:ring-2 focus:ring-[#FFB22C]/20 outline-none font-body text-[#0F0F0F] transition-all"
                placeholder={language === 'id' ? 'Masukkan password baru' : 'Enter new password'}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F0F0F]/40 hover:text-[#0F0F0F] transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="font-body text-xs text-[#0F0F0F]/40 mt-2">
              {language === 'id' ? 'Minimal 6 karakter' : 'Minimum 6 characters'}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Konfirmasi Password Baru' : 'Confirm New Password'}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 bg-white rounded-xl border border-[#0F0F0F]/10 focus:border-[#FFB22C] focus:ring-2 focus:ring-[#FFB22C]/20 outline-none font-body text-[#0F0F0F] transition-all"
              placeholder={language === 'id' ? 'Konfirmasi password baru' : 'Confirm new password'}
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full sm:w-auto px-8 py-3 bg-[#0F0F0F] text-white rounded-xl font-body font-bold text-sm hover:bg-[#0F0F0F]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === 'id' ? 'Mengubah...' : 'Changing...'}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {language === 'id' ? 'Ubah Password' : 'Change Password'}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-100 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-display font-bold text-xl text-red-600">
            {language === 'id' ? 'Zona Bahaya' : 'Danger Zone'}
          </h3>
        </div>
        <p className="font-body text-sm text-[#0F0F0F]/60 mb-6">
          {language === 'id'
            ? 'Tindakan di bawah ini tidak dapat dibatalkan. Hubungi panitia jika ingin menghapus akun.'
            : 'Actions below cannot be undone. Contact the organizer if you want to delete your account.'}
        </p>
        <button
          disabled
          className="px-6 py-3 bg-red-50 text-red-400 border border-red-100 rounded-xl font-body font-bold text-sm cursor-not-allowed opacity-50"
        >
          {language === 'id' ? 'Hapus Akun (Hubungi Panitia)' : 'Delete Account (Contact Organizer)'}
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;