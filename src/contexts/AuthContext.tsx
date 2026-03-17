import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { hashPassword, verifyPassword, generateSecureId } from '../utils/security';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  birthDate: string;
  address: string;
  city: string;
  institution: string;
  institutionType: string;
  major?: string;
  nim?: string;
  competitionCategory: string;
  teamName?: string;
  teamMembers?: string;
  registrationDate: string;
  status: 'pending' | 'active' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: Omit<User, 'id' | 'registrationDate' | 'status'>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getAllUsers: () => User[];
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'kath_users';
const CURRENT_USER_STORAGE_KEY = 'kath_current_user';

// Generate unique ID
const generateId = (): string => {
  return 'usr_' + generateSecureId();
};

// Helper function to get stored user (used for lazy initialization)
const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use lazy initialization for user state to avoid setState in effect
  const [user, setUser] = useState<User | null>(getStoredUser);
  const isLoading = false; // No async loading needed with lazy initialization

  const getAllUsers = useCallback((): User[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing users:', error);
        return [];
      }
    }
    return [];
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    console.log('🔑 AuthContext.login called:', { email });
    
    try {
      const users = getAllUsers();
      console.log('📋 Found users:', users.length);
      
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        console.log('❌ User not found');
        return { success: false, message: 'Email tidak terdaftar' };
      }

      console.log('✅ User found, verifying password...');

      const isValid = await verifyPassword(password, foundUser.password);
      console.log('🔐 Password valid:', isValid);

      if (!isValid) {
        return { success: false, message: 'Password salah' };
      }

      // Store current user (without password for security)
      const userWithoutPassword = { ...foundUser };
      delete (userWithoutPassword as Partial<User>).password;

      console.log('✅ Setting user:', userWithoutPassword.email);
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(foundUser));

      console.log('✅ Login successful!');
      return { success: true, message: 'Login berhasil' };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: 'Terjadi kesalahan saat login' };
    }
  }, [getAllUsers]);

  const register = useCallback(async (
    userData: Omit<User, 'id' | 'registrationDate' | 'status'>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const users = getAllUsers();

      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, message: 'Email sudah terdaftar' };
      }

      // Create new user with secure password hashing
      const hashedPassword = await hashPassword(userData.password);
      const newUser: User = {
        ...userData,
        id: generateId(),
        registrationDate: new Date().toISOString(),
        status: 'pending',
        password: hashedPassword,
      };

      // Save to localStorage
      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      return { success: true, message: 'Registrasi berhasil' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Terjadi kesalahan saat registrasi' };
    }
  }, [getAllUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in users list too
    const users = getAllUsers();
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...userData } : u);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  }, [user, getAllUsers]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    getAllUsers,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
