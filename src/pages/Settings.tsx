import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validatePassword } from '../utils/validate';
import { useCSRFToken } from '../components/CSRFProtectedForm';
import {
  ChevronLeft,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Smartphone,
  MessageSquare,
  Trash2,
  LogOut,
  ToggleLeft,
  ToggleRight
} from '../icons';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailUpdates: boolean;
  competitionReminders: boolean;
  submissionDeadlines: boolean;
  teamInvites: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { token: csrfToken, validateAndRefresh: validateCSRF } = useCSRFToken();
  const [activeTab, setActiveTab] = useState<'password' | 'notifications' | 'privacy'>('password');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailUpdates: true,
    competitionReminders: true,
    submissionDeadlines: true,
    teamInvites: true,
    marketingEmails: false,
    smsNotifications: false,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // CSRF validation for security
    const formElement = e.target as HTMLFormElement;
    const submittedToken = new FormData(formElement).get('csrfToken') as string;
    if (!validateCSRF(submittedToken)) {
      setError('Security validation failed. Please try again.');
      return;
    }

    // Validation
    if (!passwordForm.currentPassword) {
      setError('Password saat ini wajib diisi');
      return;
    }

    // Use proper password validation
    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Password baru dan konfirmasi tidak cocok');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

    setTimeout(() => setIsSuccess(false), 3000);
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
      alert('Fitur hapus akun akan segera hadir.');
    }
  };

  const inputClasses = `
    w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white 
    placeholder-white/50 focus:outline-none focus:border-kath-gold/50 transition-all
  `;

  const renderPasswordSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-kath-gold/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-kath-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg text-white">Change Password</h3>
          <p className="font-body text-white/50 text-sm">Update password untuk keamanan akun</p>
        </div>
      </div>

      {error && (
        <div id="password-error" className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl" role="alert">
          <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
          <p className="font-body text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        {/* CSRF Protection Token */}
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <div>
          <label className="block font-body text-sm text-white/70 mb-2">Password Saat Ini</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className={`${inputClasses} pl-12 pr-12`}
              placeholder="Masukkan password saat ini"
              aria-describedby={error ? 'password-error' : undefined}
              aria-invalid={!!error}
            />
            <button
              type="button"
              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showCurrentPassword}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-body text-sm text-white/70 mb-2">Password Baru</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className={`${inputClasses} pl-12 pr-12`}
              placeholder="Minimal 8 karakter"
              aria-describedby={error ? 'password-error' : undefined}
              aria-invalid={!!error}
            />
            <button
              type="button"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showNewPassword}
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-body text-sm text-white/70 mb-2">Konfirmasi Password Baru</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className={`${inputClasses} pl-12 pr-12`}
              placeholder="Ulangi password baru"
              aria-describedby={error ? 'password-error' : undefined}
              aria-invalid={!!error}
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="flex items-center gap-2 px-6 py-3 bg-kath-gold hover:bg-kath-gold-light disabled:bg-kath-gold/50 text-kath-bg-dark font-body font-medium rounded-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Updated!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-kath-gold/10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-kath-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg text-white">Notification Preferences</h3>
          <p className="font-body text-white/50 text-sm">Atur notifikasi yang ingin Anda terima</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'emailUpdates' as const,
            label: 'Email Updates',
            description: 'Terima update penting tentang kompetisi via email',
            icon: Mail,
          },
          {
            key: 'competitionReminders' as const,
            label: 'Competition Reminders',
            description: 'Pengingat jadwal kompetisi yang akan datang',
            icon: Bell,
          },
          {
            key: 'submissionDeadlines' as const,
            label: 'Submission Deadlines',
            description: 'Peringatan deadline pengumpulan karya',
            icon: AlertCircle,
          },
          {
            key: 'teamInvites' as const,
            label: 'Team Invitations',
            description: 'Notifikasi undangan bergabung dengan tim',
            icon: MessageSquare,
          },
          {
            key: 'marketingEmails' as const,
            label: 'Marketing & Promotions',
            description: 'Info tentang kompetisi baru dan promo',
            icon: Mail,
          },
          {
            key: 'smsNotifications' as const,
            label: 'SMS Notifications',
            description: 'Notifikasi penting via SMS',
            icon: Smartphone,
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-kath-gold/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-kath-gold" />
              </div>
              <div>
                <p className="font-body text-white font-medium">{item.label}</p>
                <p className="font-body text-white/50 text-sm">{item.description}</p>
              </div>
            </div>
            <button
              onClick={() => toggleNotification(item.key)}
              aria-label={`Toggle ${item.label}`}
              aria-pressed={notifications[item.key]}
              className={`transition-all ${notifications[item.key] ? 'text-kath-gold' : 'text-white/20'}`}
            >
              {notifications[item.key] ? (
                <ToggleRight className="w-12 h-7" aria-hidden="true" />
              ) : (
                <ToggleLeft className="w-12 h-7" aria-hidden="true" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button
          onClick={handleSaveNotifications}
          disabled={isLoading || isSuccess}
          className="flex items-center gap-2 px-6 py-3 bg-kath-gold hover:bg-kath-gold-light disabled:bg-kath-gold/50 text-kath-bg-dark font-body font-medium rounded-xl transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-kath-gold/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-kath-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg text-white">Privacy & Security</h3>
          <p className="font-body text-white/50 text-sm">Kelola privasi dan keamanan akun</p>
        </div>
      </div>

      {/* Privacy Options */}
      <div className="space-y-4">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-body text-white font-medium">Profile Visibility</h4>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
              Public
            </span>
          </div>
          <p className="font-body text-white/50 text-sm mb-4">
            Profil Anda dapat dilihat oleh pengguna lain dan tim pencari talenta
          </p>
          <button className="text-kath-gold hover:text-kath-gold-light font-body text-sm transition-colors">
            Change Visibility
          </button>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-body text-white font-medium">Two-Factor Authentication</h4>
            <span className="px-3 py-1 bg-white/5 text-white/40 rounded-full text-xs font-medium">
              Disabled
            </span>
          </div>
          <p className="font-body text-white/50 text-sm mb-4">
            Tambahkan lapisan keamanan ekstra untuk akun Anda
          </p>
          <button className="text-kath-gold hover:text-kath-gold-light font-body text-sm transition-colors">
            Enable 2FA
          </button>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-body text-white font-medium">Login History</h4>
          </div>
          <p className="font-body text-white/50 text-sm mb-4">
            Lihat riwayat login akun Anda
          </p>
          <button className="text-kath-gold hover:text-kath-gold-light font-body text-sm transition-colors">
            View History
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
        <h4 className="font-display text-lg text-red-400 mb-2">Danger Zone</h4>
        <p className="font-body text-white/50 text-sm mb-6">
          Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-body text-white font-medium">Logout from All Devices</h5>
              <p className="font-body text-white/50 text-sm">Keluar dari semua sesi aktif</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/70 hover:bg-white/5 rounded-lg font-body text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout All
            </button>
          </div>

          <div className="h-px bg-red-500/10" />

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-body text-white font-medium">Delete Account</h5>
              <p className="font-body text-white/50 text-sm">Hapus akun dan semua data permanen</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-body text-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-kath-bg-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-kath-bg-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-white/60 hover:text-kath-gold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-body text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="font-display text-xl text-white">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Tabs */}
          <div className="flex items-center gap-2 mb-8 bg-white/[0.02] border border-white/5 rounded-xl p-1" role="tablist" aria-label="Settings sections">
            {[
              { id: 'password', label: 'Password', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-body text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-kath-gold/20 text-kath-gold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div id={`tabpanel-${activeTab}`} role="tabpanel" className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            {activeTab === 'password' && renderPasswordSection()}
            {activeTab === 'notifications' && renderNotificationsSection()}
            {activeTab === 'privacy' && renderPrivacySection()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
