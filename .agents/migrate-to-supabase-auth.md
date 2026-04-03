# 🚀 Task: Migrasi Auth dari Mock Data ke Supabase Auth

## 📋 Overview

**Goal:** Migrasi sistem autentikasi dari localStorage-based mock data ke Supabase Auth yang production-ready.

**Current State:**
- ❌ Login menggunakan localStorage (tidak aman, data hilang saat clear browser)
- ❌ Password hashing dilakukan di client-side
- ❌ Tidak ada email verification
- ❌ Tidak ada password reset
- ❌ Session tidak persist antar device

**Target State:**
- ✅ Login menggunakan Supabase Auth (JWT-based)
- ✅ Session management otomatis (auto-refresh token)
- ✅ Email verification support
- ✅ Password reset flow
- ✅ Multi-device session
- ✅ Row Level Security (RLS) untuk data protection

---

## 🎯 Objectives

### Primary Goals
1. Ganti `AuthContext.tsx` untuk menggunakan Supabase Auth client
2. Update `Login.tsx` untuk handle Supabase Auth errors
3. Update `Register.tsx` untuk create user di Supabase Auth
4. Tambah Protected Route component untuk auth guard
5. Pastikan semua fitur existing tetap bekerja

### Non-Goals (Out of Scope)
- Email verification flow (bisa ditambahkan nanti)
- Social login (Google, GitHub, etc.)
- Multi-factor authentication (MFA)

---

## 📁 Files to Modify

### Core Files
| File | Priority | Changes Required |
|------|----------|------------------|
| `src/contexts/AuthContext.tsx` | 🔴 HIGH | Refactor entire auth logic to use Supabase |
| `src/pages/Login.tsx` | 🔴 HIGH | Update error handling for Supabase errors |
| `src/pages/Register.tsx` | 🔴 HIGH | Implement Supabase signUp |
| `src/components/ProtectedRoute.tsx` | 🟡 MEDIUM | Create new auth guard component |
| `src/lib/supabase.ts` | 🟢 LOW | Verify auth helpers exist |

### Related Files (Review Only)
- `src/services/auth.service.ts` - Legacy auth service (keep for backward compat)
- `src/services/service.factory.ts` - Service switching logic
- `src/config/environment.ts` - Env config (already has Supabase support)

---

## 🛠️ Implementation Steps

### Step 1: Review Existing Supabase Client

**File:** `src/lib/supabase.ts`

**Check:**
- ✅ `supabase.auth.signInWithPassword()` exists
- ✅ `supabase.auth.signUp()` exists
- ✅ `supabase.auth.signOut()` exists
- ✅ `supabase.auth.getUser()` exists
- ✅ `supabase.auth.getSession()` exists

**Action:** Jika belum ada, tambahkan helper functions.

---

### Step 2: Refactor AuthContext.tsx

**File:** `src/contexts/AuthContext.tsx`

**Current Implementation:**
```typescript
// ❌ localStorage-based
const USERS_STORAGE_KEY = 'kath_users';
const CURRENT_USER_STORAGE_KEY = 'kath_current_user';

const login = async (email, password) => {
  const users = getAllUsers();  // ← localStorage
  const foundUser = users.find(u => u.email === email);
  const isValid = await verifyPassword(password, foundUser.password);
  setUser(foundUser);
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(foundUser));
};
```

**New Implementation:**
```typescript
// ✅ Supabase-based
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  // ... other fields from user_metadata
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // data.user contains user object
      // data.session contains JWT session
      return { success: true, message: 'Login berhasil' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan saat login' 
      };
    }
  }, []);

  const register = useCallback(async (
    userData: RegisterData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            phone: userData.phone,
            // ... other metadata
          },
        },
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan saat registrasi' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user) return;

    const { data, error } = await supabase.auth.updateUser({
      data: userData,
      // email, phone, etc.
    });

    if (error) throw error;

    setUser(data.user);
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <LoadingScreen />  // Show loading while checking auth
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
```

**Key Changes:**
1. ✅ Remove localStorage logic
2. ✅ Add Supabase auth client
3. ✅ Add `onAuthStateChange` listener for real-time auth updates
4. ✅ Add loading state for initial session check
5. ✅ Update all auth methods to use Supabase

---

### Step 3: Update Login.tsx

**File:** `src/pages/Login.tsx`

**Current:** Sudah menggunakan `useAuth().login()`

**Changes Required:**
```typescript
// ✅ Update error handling untuk Supabase-specific errors

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // ✅ Supabase auto-redirects to callback URL
      // ✅ Or manually navigate
      navigate('/dashboard');
    } else {
      // ✅ Handle Supabase error messages
      setSubmitError(mapSupabaseError(result.message));
    }
  } catch (error) {
    setSubmitError('Terjadi kesalahan. Silakan coba lagi.');
  }
};

// ✅ Helper function untuk map Supabase errors
function mapSupabaseError(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email atau password salah',
    'Email not confirmed': 'Email belum diverifikasi. Silakan cek inbox Anda.',
    'User not found': 'Email tidak terdaftar',
    'Weak password': 'Password terlalu lemah. Minimal 6 karakter.',
  };

  // Check for known errors
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  // Default message
  return message || 'Terjadi kesalahan. Silakan coba lagi.';
}
```

**UI Improvements:**
- ✅ Tambah link "Lupa password?" (opsional)
- ✅ Tambah info "Belum verifikasi email?" (opsional)

---

### Step 4: Update Register.tsx

**File:** `src/pages/Register.tsx`

**Implementation:**
```typescript
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const registerData = {
    email: formData.email,
    password: formData.password,
    fullName: formData.fullName,
    phone: formData.phone,
    // ... other fields
  };

  const result = await register(registerData);

  if (result.success) {
    // ✅ Show success message
    // ✅ Redirect to login or show verification info
    navigate('/login', { 
      state: { message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.' }
    });
  } else {
    setSubmitError(result.message);
  }
};
```

**Form Fields to Collect:**
- ✅ Email
- ✅ Password (min 6 characters)
- ✅ Full Name
- ✅ Phone (optional)
- ✅ Birth Date (optional, store in user_metadata)
- ✅ Institution (optional, store in user_metadata)

**Store in `user_metadata`:**
```typescript
options: {
  data: {
    full_name: 'John Doe',
    phone: '+628123456789',
    birth_date: '1990-01-01',
    institution: 'University of Indonesia',
    // ... custom fields
  }
}
```

---

### Step 5: Create ProtectedRoute Component

**File:** `src/components/ProtectedRoute.tsx` (NEW)

**Implementation:**
```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireEmailVerification = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification if required
  if (requireEmailVerification && !user?.email_confirmed_at) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

**Usage in App.tsx:**
```typescript
// ✅ Wrap protected routes
<Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

### Step 6: Update App.tsx (if needed)

**File:** `src/App.tsx`

**Check:**
- ✅ AuthProvider is wrapping the app
- ✅ ProtectedRoute is used for protected pages
- ✅ Loading state is handled properly

**Example:**
```typescript
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes here */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 🔐 Security Considerations

### Do's ✅
1. ✅ Use Supabase anon key (NOT service_role key) in frontend
2. ✅ Enable Row Level Security (RLS) on all tables
3. ✅ Validate user input before sending to Supabase
4. ✅ Handle auth errors gracefully (don't expose internal errors)
5. ✅ Use HTTPS in production (enforced by Cloudflare)

### Don'ts ❌
1. ❌ Never expose service_role key in frontend
2. ❌ Don't store sensitive data in localStorage
3. ❌ Don't bypass RLS with client-side queries
4. ❌ Don't log sensitive user data (passwords, tokens)

---

## 🧪 Testing Checklist

### Manual Testing

#### Login Flow
- [ ] Login dengan email & password yang benar → ✅ Success
- [ ] Login dengan email salah → ✅ Error: "Email tidak terdaftar"
- [ ] Login dengan password salah → ✅ Error: "Email atau password salah"
- [ ] Login dengan email belum verifikasi → ✅ Error: "Email belum diverifikasi"
- [ ] Session persist setelah refresh page → ✅ Still logged in
- [ ] Logout → ✅ Redirect to login, session cleared

#### Register Flow
- [ ] Register dengan email baru → ✅ Success
- [ ] Register dengan email sudah ada → ✅ Error: "Email sudah terdaftar"
- [ ] Register dengan password < 6 karakter → ✅ Error: "Password terlalu lemah"
- [ ] Email verification email terkirim → ✅ Check inbox

#### Protected Routes
- [ ] Akses /dashboard tanpa login → ✅ Redirect to /login
- [ ] Akses /dashboard dengan login → ✅ Can access
- [ ] Logout, lalu akses /dashboard → ✅ Redirect to /login

#### Session Management
- [ ] Login di browser A → ✅ Session created
- [ ] Refresh page → ✅ Session persists
- [ ] Logout di browser A → ✅ Session cleared
- [ ] Login di browser B dengan akun sama → ✅ Both sessions work

---

## 📝 Environment Variables

**Required in `.env`:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Disable mock data
VITE_USE_MOCK_DATA=false

# App Configuration
VITE_APP_NAME=KATH Event Organizer
VITE_APP_URL=http://localhost:5173
```

**Optional:**
```env
# n8n Webhook (for file upload)
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook
```

---

## 🚨 Rollback Plan

Jika ada masalah, rollback dengan cara:

1. **Revert code changes:**
   ```bash
   git checkout HEAD -- src/contexts/AuthContext.tsx
   git checkout HEAD -- src/pages/Login.tsx
   git checkout HEAD -- src/pages/Register.tsx
   ```

2. **Enable mock data again:**
   ```env
   VITE_USE_MOCK_DATA=true
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

## 📚 References

### Documentation
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/react)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Existing Project Files
- `src/lib/supabase.ts` - Supabase client
- `src/services/supabase.service.ts` - Supabase services
- `supabase/schema.sql` - Database schema with RLS

---

## ✅ Definition of Done

Task ini dianggap DONE ketika:

- [ ] ✅ AuthContext menggunakan Supabase Auth (bukan localStorage)
- [ ] ✅ Login flow bekerja dengan Supabase
- [ ] ✅ Register flow bekerja dengan Supabase
- [ ] ✅ ProtectedRoute component dibuat & berfungsi
- [ ] ✅ Session persist setelah page refresh
- [ ] ✅ Logout berfungsi dengan benar
- [ ] ✅ Error handling untuk Supabase errors
- [ ] ✅ Loading state saat check auth
- [ ] ✅ Semua existing tests pass (jika ada)
- [ ] ✅ Manual testing checklist completed
- [ ] ✅ Code review passed
- [ ] ✅ No console errors
- [ ] ✅ Environment variables documented

---

## 🎯 Success Metrics

Setelah migrasi:

1. **Security:**
   - ✅ JWT-based authentication
   - ✅ Server-side session management
   - ✅ RLS enabled pada database

2. **User Experience:**
   - ✅ Session persist antar device
   - ✅ Email verification support
   - ✅ Password reset support (opsional)

3. **Reliability:**
   - ✅ Data tidak hilang saat clear browser
   - ✅ Auto token refresh
   - ✅ Graceful error handling

---

## 📞 Need Help?

Jika ada pertanyaan atau blocker:

1. Check Supabase dashboard: https://app.supabase.com
2. Check existing code: `src/lib/supabase.ts`
3. Check docs: Links di atas
4. Ask for clarification

---

**Good luck! 🚀**

Mulai dengan **Step 1** dan lanjutkan secara sequential. Jangan skip steps!
