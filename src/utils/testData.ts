import type { User } from '../contexts/AuthContext';

const USERS_STORAGE_KEY = 'kath_users';
const CURRENT_USER_STORAGE_KEY = 'kath_current_user';

// Simple hash function using base64
const hashPassword = (password: string): string => {
  return btoa(password + 'kath_salt_2026');
};

export const createTestAccount = (): void => {
  const testUser: User = {
    id: 'usr_test_001',
    fullName: 'Budi Santoso',
    email: 'test@kath.com',
    phone: '081234567890',
    password: hashPassword('password123'),
    birthDate: '1998-05-15',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    city: 'Jakarta',
    institution: 'Universitas Indonesia',
    institutionType: 'Universitas',
    major: 'Manajemen Perhotelan',
    nim: '1801234567',
    competitionCategory: 'Wedding Concept Competition',
    teamName: 'Dream Team',
    teamMembers: '3',
    registrationDate: new Date().toISOString(),
    status: 'active',
  };

  // Check if test user already exists
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  let users: User[] = [];

  if (stored) {
    try {
      users = JSON.parse(stored);
      const exists = users.some(u => u.email === testUser.email);
      if (exists) {
        console.log('✅ Akun testing sudah ada');
        return;
      }
    } catch (error) {
      console.error('Error parsing users:', error);
    }
  }

  // Add test user
  users.push(testUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  console.log('✅ Akun testing berhasil dibuat!');
  console.log('📧 Email: test@kath.com');
  console.log('🔑 Password: password123');
};

export const autoLoginTestAccount = (): void => {
  const testUser: User = {
    id: 'usr_test_001',
    fullName: 'Budi Santoso',
    email: 'test@kath.com',
    phone: '081234567890',
    password: hashPassword('password123'),
    birthDate: '1998-05-15',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    city: 'Jakarta',
    institution: 'Universitas Indonesia',
    institutionType: 'Universitas',
    major: 'Manajemen Perhotelan',
    nim: '1801234567',
    competitionCategory: 'Wedding Concept Competition',
    teamName: 'Dream Team',
    teamMembers: '3',
    registrationDate: new Date().toISOString(),
    status: 'active',
  };

  // Set as current user
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(testUser));
  console.log('✅ Auto-login berhasil!');
};

// Clear all test data
export const clearTestData = (): void => {
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  console.log('🗑️  Data testing dihapus');
};
