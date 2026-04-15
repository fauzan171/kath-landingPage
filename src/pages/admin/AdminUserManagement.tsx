/**
 * Admin User Management
 *
 * Manage users with password reset functionality
 */

import { useState, useEffect } from 'react';
import {
  Search, Users, Mail, Building, Loader2, Key, Copy, CheckCircle,
  RefreshCw, Eye, EyeOff, Shield, UserX, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// ============================================
// Types
// ============================================

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  institution?: string;
  category?: string;
  status: string;
  is_verified: boolean;
  created_at: string;
  last_login_at?: string;
}

interface ResetResult {
  userId: string;
  email: string;
  newPassword: string;
}

// ============================================
// Component
// ============================================

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  // Delete User Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !supabase) return;
    setIsDeleting(true);
    try {
      const userId = userToDelete.id;

      // Use edge function for admin delete (server-side service role)
      const { data, error: fnError } = await supabase.functions.invoke('admin-ops', {
        body: { action: 'delete-user', userId },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      // Optimistic update: remove from local state immediately
      setUsers(prev => prev.filter(u => u.id !== userId));

      toast.success(`User ${userToDelete.email} berhasil dihapus`);
      setShowDeleteModal(false);
      setUserToDelete(null);

      // Also re-fetch from server for consistency
      loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Gagal menghapus user: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetResult, setResetResult] = useState<ResetResult | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [customPassword, setCustomPassword] = useState('');
  const [useCustomPassword, setUseCustomPassword] = useState(false);
  // Mode: 'email' = kirim link reset ke user | 'generate' = generate password manual
  const [resetMode, setResetMode] = useState<'email' | 'generate'>('email');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  // ============================================
  // Load Users
  // ============================================

  const loadUsers = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        toast.error('Supabase not configured');
        return;
      }

      let query = supabase
        .from('users')
        .select('id, email, name, phone, avatar_url, is_active, last_login_at, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Generate Random Password
  // ============================================

  const generateRandomPassword = (): string => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = '';
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // ============================================
  // Open Reset Modal
  // ============================================

  const openResetModal = (user: User) => {
    setSelectedUser(user);
    setNewPassword(generateRandomPassword());
    setCustomPassword('');
    setUseCustomPassword(false);
    setResetResult(null);
    setResetMode('email');
    setEmailSent(false);
    setShowResetModal(true);
  };

  // ============================================
  // Set Temp Password via Admin API
  // ============================================

  const handleSetTempPassword = async () => {
    if (!selectedUser || !supabase) return;
    const passwordToUse = useCustomPassword ? customPassword : newPassword;
    if (!passwordToUse || passwordToUse.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }
    setIsResetting(true);
    try {
      // Use edge function for admin password update (server-side service role)
      const { data, error: fnError } = await supabase.functions.invoke('admin-ops', {
        body: {
          action: 'update-user-password',
          userId: selectedUser.id,
          email: selectedUser.email,
          password: passwordToUse,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      // Tandai force_password_change = true (always use selectedUser.id for public users table)
      await supabase
        .from('users')
        .update({
          force_password_change: true,
          temp_password_set_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id);

      // Update status request (jika ada)
      await supabase
        .from('password_reset_requests')
        .update({ status: 'processed', processed_at: new Date().toISOString() })
        .eq('user_id', selectedUser.id)
        .eq('status', 'pending');

      setResetResult({
        userId: selectedUser.id,
        email: selectedUser.email,
        newPassword: passwordToUse,
      });

      toast.success(`Password sementara berhasil diset untuk ${selectedUser.email}`);
    } catch (err) {
      console.error('Error setting temp password:', err);
      const msg = err instanceof Error ? err.message : 'Gagal set password.';
      toast.error(msg);
    } finally {
      setIsResetting(false);
    }
  };

  // ============================================
  // Generate & Show Password (manual delivery)
  // ============================================

  const handleGeneratePassword = async () => {
    if (!selectedUser) return;
    const passwordToUse = useCustomPassword ? customPassword : newPassword;
    if (!passwordToUse || passwordToUse.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }
    setIsResetting(true);
    try {
      // Store for display — admin must manually share this with the user
      // The user then uses Forgot Password flow or admin can use service_role
      setResetResult({
        userId: selectedUser.id,
        email: selectedUser.email,
        newPassword: passwordToUse,
      });
      toast.success('Password siap, berikan ke user secara manual.');
    } catch (err) {
      console.error('Error generating password:', err);
      toast.error('Gagal generate password.');
    } finally {
      setIsResetting(false);
    }
  };

  // ============================================
  // Copy to Clipboard
  // ============================================

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // ============================================
  // Close Modal
  // ============================================

  const closeModal = () => {
    setShowResetModal(false);
    setSelectedUser(null);
    setResetResult(null);
    setNewPassword('');
    setCustomPassword('');
    setUseCustomPassword(false);
    setResetMode('email');
    setEmailSent(false);
  };

  // ============================================
  // Filter Users
  // ============================================

  const filteredUsers = users.filter(user => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        user.email?.toLowerCase().includes(searchLower) ||
        user.name?.toLowerCase().includes(searchLower) ||
        user.institution?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // ============================================
  // Stats
  // ============================================

  const stats = {
    total: users.length,
    approved: users.filter(u => u.status === 'approved').length,
    pending: users.filter(u => u.status === 'pending').length,
    rejected: users.filter(u => u.status === 'rejected').length,
  };

  // ============================================
  // Status Badge
  // ============================================

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
            <UserX className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  // ============================================
  // Render
  // ============================================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Kelola user dan reset password</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <Shield className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-amber-800">{stats.approved} Active Users</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center bg-green-50">
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-green-600">Approved</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center bg-amber-50">
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-xs text-amber-600">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 text-center bg-red-50">
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-red-600">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {(['all', 'approved', 'pending', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, name, institution..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-600">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Institution</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Registered</th>
                <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-amber-700 font-medium text-sm">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name || '-'}</p>
                          {user.phone && (
                            <p className="text-xs text-gray-500">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600 capitalize">{user.category || '-'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{user.institution || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(user.status)}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Reset Password Button */}
                        <button
                          onClick={() => openResetModal(user)}
                          disabled={user.status !== 'approved'}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'approved'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title="Reset Password"
                        >
                          <Key className="w-5 h-5" />
                        </button>
                        {/* Delete User Button */}
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Key className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Reset Password User</h3>
                <p className="text-sm text-gray-500 break-all">{selectedUser.email}</p>
              </div>
            </div>

            {/* Mode Tabs */}
            {!resetResult && !emailSent && (
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5">
                <button
                  onClick={() => setResetMode('email')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    resetMode === 'email' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  📧 Kirim Email Link
                </button>
                <button
                  onClick={() => setResetMode('generate')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    resetMode === 'generate' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  ✏️ Custom Password
                </button>
              </div>
            )}

            {/* SET TEMP PASSWORD MODE — auto generate */}
            {resetMode === 'email' && !resetResult && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800 font-semibold mb-1">Cara Kerja:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>1. Admin set password sementara untuk user</li>
                    <li>2. Admin sampaikan password ke user (WA/chat)</li>
                    <li>3. User login → wajib buat password permanen</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Sementara (Auto-Generated)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 font-mono text-sm pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button onClick={() => setNewPassword(generateRandomPassword())}
                      className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" title="Generate Ulang">
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={closeModal} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Batal
                  </button>
                  <button
                    onClick={handleSetTempPassword}
                    disabled={isResetting}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isResetting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Proses...</>
                    ) : (
                      <><Key className="w-4 h-4" /> Set Password Sementara</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* GENERATE PASSWORD MODE */}
            {resetMode === 'generate' && !resetResult && (
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-sm text-amber-800">
                    ⚠️ Password ini <strong>hanya ditampilkan sekali</strong>. Admin harus menyampaikan password baru ini ke user secara manual (via WhatsApp/email/chat).
                  </p>
                </div>

                {/* Toggle auto/custom */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setUseCustomPassword(false)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                      !useCustomPassword ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Auto Generate
                  </button>
                  <button
                    onClick={() => setUseCustomPassword(true)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                      useCustomPassword ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {!useCustomPassword ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Generated Password</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 font-mono text-sm pr-12"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <button onClick={() => setNewPassword(generateRandomPassword())}
                        className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" title="Generate New">
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        placeholder="Min 8 karakter"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {customPassword && customPassword.length < 8 && (
                      <p className="text-xs text-red-500 mt-1">Password minimal 8 karakter</p>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button onClick={closeModal} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Batal
                  </button>
                  <button
                    onClick={handleGeneratePassword}
                    disabled={isResetting || (useCustomPassword && customPassword.length < 8)}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isResetting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Proses...</>
                    ) : (
                      <><Key className="w-4 h-4" /> Tampilkan Password</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* GENERATE PASSWORD RESULT */}
            {resetResult && (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Password Berhasil Dibuat</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">Salin dan sampaikan ke user via WhatsApp/email:</p>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-base font-mono font-bold text-gray-800 break-all">{resetResult.newPassword}</code>
                      <button onClick={() => copyToClipboard(resetResult.newPassword)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                        <Copy className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                  <p className="text-xs text-red-700">⚠️ <strong>Catatan:</strong> Fitur ini hanya menampilkan password. Admin perlu menyampaikannya ke user, dan user harus masuk ke Supabase Dashboard untuk mengupdate password mereka — ATAU gunakan mode "Kirim Email Link" untuk reset yang lebih aman dan otomatis.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => copyToClipboard(resetResult.newPassword)}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" /> Copy Password
                  </button>
                  <button onClick={closeModal}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hapus User</h3>
                <p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-5">
              <p className="text-sm text-red-800 mb-2">
                Anda akan menghapus user berikut:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>Email: {userToDelete.email}</li>
                <li>Nama: {userToDelete.name || '-'}</li>
                <li>Institution: {userToDelete.institution || '-'}</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 mb-5">
              <p className="text-xs text-amber-700">
                WARNING: User akan dihapus dari sistem. Semua data terkait user ini juga akan hilang.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Menghapus...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Hapus User</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;