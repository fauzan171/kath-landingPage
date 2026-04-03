# CIBC Competition Platform - Complete Fix Implementation Plan

## Role & Expectations

Anda adalah **Senior Full-Stack Engineer** dengan expertise:
- Supabase Authentication & Database
- React/TypeScript Architecture
- Security Best Practices (OWASP)
- Database Schema Design & RLS Policies

**TUGAS ANDA**: Memperbaiki SEMUA 47 issues yang ditemukan dalam review secara sistematis, teliti, dan terstruktur.

---

## Working Standards (WAJIB DIPATUHI)

### 1. Verification Protocol
Sebelum membuat SETIAP perubahan:
```
✅ BACA file yang akan dimodifikasi (read_file)
✅ CEK file terkait (dependencies, imports)
✅ VALIDASI perubahan tidak break existing functionality
✅ TEST secara mental edge cases
```

### 2. Code Quality Standards
- **Type Safety**: Semua fungsi HARUS punya type definitions
- **Error Handling**: Semua async operations HARUS punya try-catch
- **Comments**: Jelaskan WHY, bukan WHAT (code sudah self-explanatory)
- **Consistency**: Ikuti existing code style project

### 3. Security Checklist (WAJIB SETIAP FILE)
- [ ] No passwords in localStorage
- [ ] Input sanitization pada semua user inputs
- [ ] Role verification pada protected routes
- [ ] RLS policies membatasi akses dengan benar
- [ ] No hardcoded credentials/secrets

---

## Implementation Phases

### PHASE 1: CRITICAL SECURITY FIXES (P0) - MUST COMPLETE FIRST

#### Task 1.1: Consolidate Authentication Architecture
**Goal**: Deprecate `AuthContext.tsx`, unify ke Supabase Auth

**Files to Fix**:
1. `src/pages/Login.tsx` - Ganti dari AuthContext ke auth.service.ts
2. `src/pages/Register.tsx` - Ganti dari AuthContext ke auth.service.ts
3. `src/contexts/AuthContext.tsx` - ADD deprecation warning
4. `src/routes/cibcRoutes.tsx` - Update imports

**Validation Checklist**:
- [ ] Login flow menggunakan Supabase auth
- [ ] Register flow menggunakan Supabase auth
- [ ] Session persistence bekerja setelah refresh
- [ ] Logout membersihkan semua session data
- [ ] Tidak ada password disimpan di localStorage

**Expected Outcome**:
```typescript
// Login.tsx harus seperti ini:
import { login } from '@/services/auth.service'; // BUKAN useAuth

const handleLogin = async (email: string, password: string) => {
  const result = await login({ email, password });
  if (result.success) {
    // Redirect ke dashboard
  }
};
```

---

#### Task 1.2: Fix RLS Policies
**Goal**: Implement proper row-level security

**Files to Fix**:
1. `supabase-complete-setup.sql` - Update semua RLS policies
2. `supabase-schema.sql` - ADD missing policies

**Required Policies**:
```sql
-- Teams: Only team members can read/update own team
CREATE POLICY "Team members can read own team" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = id AND tm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM user_role_assignments ura
      WHERE ura.competition_id = competition_id
      AND ura.user_id = auth.uid()
      AND ura.role IN ('admin', 'super_admin', 'judge')
    )
  );

-- Submissions: Only team members and judges can read
CREATE POLICY "Team members and judges can read submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_id AND tm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM user_role_assignments ura
      WHERE ura.competition_id = competition_id
      AND ura.user_id = auth.uid()
      AND ura.role IN ('admin', 'super_admin', 'judge')
    )
  );

-- Users: Only own profile or admins can read
CREATE POLICY "Users can read own profile or admins" ON users
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM user_role_assignments ura
      WHERE ura.user_id = auth.uid()
      AND ura.role IN ('admin', 'super_admin')
    )
  );
```

**Validation Checklist**:
- [ ] User tidak bisa baca data tim lain
- [ ] User tidak bisa edit submission tim lain
- [ ] Admin bisa baca semua data
- [ ] Judge bisa baca submission yang di-assign
- [ ] Test dengan different user roles

---

#### Task 1.3: Add Role Verification to Protected Routes
**Goal**: Implement proper authorization

**Files to Create/Fix**:
1. `src/components/ProtectedRoute.tsx` - CREATE new component
2. `src/pages/admin/AdminLayout.tsx` - ADD role check
3. `src/pages/judge/JudgeLayout.tsx` - ADD role check

**Expected Code**:
```typescript
// ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: ('admin' | 'super_admin' | 'judge' | 'participant')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      if (requiredRole) {
        const { data: roleData } = await supabase
          .from('user_role_assignments')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!roleData || !requiredRole.includes(roleData.role as any)) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }
      }

      setIsAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) return <LoadingSpinner />;
  if (!isAuthorized) return <Navigate to="/cibc/login" replace />;

  return <>{children}</>;
};
```

**Validation Checklist**:
- [ ] Unauthenticated user redirect ke login
- [ ] Participant tidak bisa akses /admin
- [ ] Participant tidak bisa akses /judge
- [ ] Admin bisa akses /admin
- [ ] Judge bisa akses /judge

---

#### Task 1.4: Remove Password from localStorage
**Goal**: Eliminate all password storage in client

**Files to Fix**:
1. `src/contexts/AuthContext.tsx` - REMOVE password field
2. `src/services/cibcMockData.ts` - REMOVE hardcoded passwords

**Actions**:
- [ ] Hapus `password` dari User interface di AuthContext
- [ ] Hapus `hashPassword` dan `verifyPassword` functions
- [ ] Hapus semua `localStorage.setItem` yang menyimpan password
- [ ] Update register flow untuk tidak menyimpan password

---

### PHASE 2: HIGH PRIORITY FIXES (P1) - COMPLETE SECOND

#### Task 2.1: Implement CSRF Protection
**Goal**: Add CSRF tokens to all state-changing operations

**Files to Create/Fix**:
1. `src/utils/csrf.ts` - CREATE CSRF protection utility
2. Update semua API calls untuk include CSRF token

**Expected Code**:
```typescript
// src/utils/csrf.ts
export class CSRFProtection {
  private static TOKEN_KEY = 'csrf_token';

  static async generateToken(): Promise<string> {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    sessionStorage.setItem(this.TOKEN_KEY, token);
    return token;
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  static validate(token: string): boolean {
    const stored = this.getToken();
    return stored === token && token.length > 0;
  }

  static clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}
```

---

#### Task 2.2: Add Rate Limiting to Auth
**Goal**: Prevent brute force attacks

**Files to Fix**:
1. `src/services/auth.service.ts` - ADD rate limiting
2. `src/utils/security.ts` - INTEGRATE RateLimiter

**Expected Code**:
```typescript
// auth.service.ts
import { loginRateLimiter } from '@/utils/security';

export async function login(credentials: LoginCredentials) {
  // Check rate limit BEFORE attempting login
  const rateLimit = loginRateLimiter.checkLimit(credentials.email);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil(rateLimit.retryAfter! / 60)} menit.`,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  
  if (error) {
    // Rate limit counter already incremented by checkLimit
    return { success: false, message: mapAuthError(error) };
  }

  // Reset rate limit on successful login
  loginRateLimiter.reset(credentials.email);

  // Fetch user role from database
  const { data: roleData } = await supabase
    .from('user_role_assignments')
    .select('role')
    .eq('user_id', data.user.id)
    .maybeSingle();

  return {
    success: true,
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
        role: roleData?.role || 'participant',
      },
    },
  };
}
```

---

#### Task 2.3: Add Missing Database Tables
**Goal**: Complete schema per PRD requirements

**Files to Create**:
1. `supabase-missing-tables.sql` - CREATE missing tables

**Required Tables**:
```sql
-- Judge Assignments
CREATE TABLE IF NOT EXISTS judge_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES stages(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(judge_id, submission_id)
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Verification Tokens (if not using Supabase built-in)
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_judge_assignments_judge ON judge_assignments(judge_id);
CREATE INDEX idx_judge_assignments_submission ON judge_assignments(submission_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_email_verification_tokens_user ON email_verification_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
```

---

#### Task 2.4: Fix Login.tsx to Use Supabase Auth
**Goal**: Migrate from AuthContext to auth.service

**Files to Fix**:
1. `src/pages/Login.tsx` - COMPLETE rewrite

**Expected Changes**:
```typescript
// BEFORE (WRONG):
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const handleLogin = async (email, password) => {
    await login(email, password); // Uses localStorage auth!
  };
};

// AFTER (CORRECT):
import { login } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const handleLogin = async (email: string, password: string) => {
    const result = await login({ email, password });
    
    if (result.success) {
      navigate('/cibc/dashboard');
    } else {
      toast.error(result.message);
    }
  };
};
```

---

#### Task 2.5: Remove Plain Text Mock Login
**Goal**: Secure development environment

**Files to Fix**:
1. `src/pages/cibc/CIBCLogin.tsx` - REMOVE or SECURE mock login

**Expected Changes**:
```typescript
// ONLY allow mock login in development with explicit env flag
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Mock login ONLY in development
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true') {
    console.warn('⚠️ MOCK AUTH MODE - DO NOT USE IN PRODUCTION');
    // Mock login logic with warnings
  }
  
  // Production: Always use Supabase
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured');
    return;
  }
  
  const result = await login({ email: formData.email, password: formData.password });
  // ...
};
```

---

#### Task 2.6: Implement Input Sanitization
**Goal**: Prevent XSS attacks

**Files to Create/Fix**:
1. `src/utils/sanitize.ts` - CREATE sanitization utility
2. Update semua forms untuk sanitize input

**Expected Code**:
```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags
    ALLOWED_ATTR: [],
  }).trim();
};

export const sanitizeEmail = (email: string): string => {
  return sanitizeInput(email.toLowerCase());
};

export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  return sanitized;
};

// Usage in forms:
import { sanitizeInput, sanitizeEmail } from '@/utils/sanitize';

const handleSubmit = async () => {
  const sanitizedData = {
    fullName: sanitizeInput(formData.fullName),
    email: sanitizeEmail(formData.email),
    institution: sanitizeInput(formData.institution),
  };
  await register(sanitizedData);
};
```

---

#### Task 2.7: Enforce Email Verification
**Goal**: Prevent fake accounts

**Files to Fix**:
1. `src/services/auth.service.ts` - ADD email verification check
2. `src/pages/cibc/CIBCLogin.tsx` - SHOW verification pending message

**Expected Code**:
```typescript
// auth.service.ts
export async function login(credentials: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  
  if (error) {
    return { success: false, message: mapAuthError(error) };
  }

  // Check email confirmation
  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut(); // Sign out immediately
    return {
      success: false,
      message: 'Email belum dikonfirmasi. Silakan cek email Anda.',
    };
  }

  // Fetch role...
}
```

---

### PHASE 3: MEDIUM PRIORITY FIXES (P2) - COMPLETE THIRD

#### Task 3.1: Consolidate SQL Schemas
**Goal**: One canonical schema file

**Actions**:
1. Review semua `supabase-*.sql` files
2. Merge ke `supabase-final-schema.sql`
3. Mark other files as DEPRECATED
4. ADD migration guide

---

#### Task 3.2: Add Database Indexes
**Goal**: Improve query performance

**SQL to Add**:
```sql
-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_submissions_competition_status ON submissions(competition_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_task_status ON submissions(task_id, status);
CREATE INDEX IF NOT EXISTS idx_teams_competition_status ON teams(competition_id, status);
CREATE INDEX IF NOT EXISTS idx_teams_payment_status ON teams(payment_status);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_competition ON user_role_assignments(competition_id);
CREATE INDEX IF NOT EXISTS idx_announcements_competition_published ON announcements(competition_id, is_published);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_stages_competition ON stages(competition_id);
CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage_id);
```

---

#### Task 3.3: Add Password Strength Validation
**Goal**: Enforce strong passwords

**Files to Fix**:
1. `src/utils/validate.ts` - CREATE password validation
2. `src/pages/Register.tsx` - ADD validation
3. `src/pages/cibc/CIBCLogin.tsx` - ADD validation

**Expected Code**:
```typescript
// src/utils/validate.ts
export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password harus minimal 8 karakter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password harus mengandung huruf kapital';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password harus mengandung huruf kecil';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password harus mengandung angka';
  }
  return null;
};
```

---

#### Task 3.4: Consolidate Type Definitions
**Goal**: Single source of truth for types

**Files to Fix**:
1. `src/types/auth.ts` - CREATE centralized types
2. Update semua files untuk import dari centralized types

**Expected Code**:
```typescript
// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'admin' | 'super_admin' | 'judge';
  institution?: string;
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  institution?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
```

---

#### Task 3.5: Create Missing Pages
**Goal**: Complete user flows

**Files to Create**:
1. `src/pages/cibc/PendingApproval.tsx` - CREATE page
2. `src/pages/cibc/VerifyEmail.tsx` - CREATE page
3. `src/pages/cibc/ResetPassword.tsx` - CREATE page

---

### PHASE 4: LOW PRIORITY FIXES (P3) - COMPLETE FOURTH

#### Task 4.1: Add Error Boundaries
**Files to Create**: `src/components/ErrorBoundary.tsx`

#### Task 4.2: Add Loading States
**Files to Fix**: All admin pages, dashboard pages

#### Task 4.3: Add Pagination
**Files to Fix**: `src/pages/admin/AdminUsers.tsx`, `AdminSubmissions.tsx`

#### Task 4.4: Remove Console Logs
**Action**: Remove all `console.log()` from production code

#### Task 4.5: Add JSDoc Comments
**Action**: Add documentation to all public functions

---

## Quality Assurance Protocol

### Before Marking Task Complete:

1. **Code Review Checklist**:
   - [ ] Type safety maintained
   - [ ] Error handling complete
   - [ ] No console.log in production code
   - [ ] Follows existing code style
   - [ ] No hardcoded values

2. **Security Checklist**:
   - [ ] No passwords in localStorage
   - [ ] Input sanitization implemented
   - [ ] Role verification in place
   - [ ] RLS policies correct
   - [ ] No sensitive data in client

3. **Testing Checklist**:
   - [ ] Happy path tested
   - [ ] Error cases handled
   - [ ] Edge cases considered
   - [ ] Different user roles tested

4. **Documentation Checklist**:
   - [ ] Code comments explain WHY
   - [ ] Complex logic documented
   - [ ] API changes documented

---

## Working Instructions

### For EACH Task:

1. **READ** all related files first
2. **ANALYZE** dependencies and impacts
3. **PLAN** the changes step by step
4. **IMPLEMENT** changes incrementally
5. **VERIFY** changes don't break existing functionality
6. **DOCUMENT** what was changed and why

### Communication Protocol:

Setelah menyelesaikan SETIAP task, berikan update:
```
✅ Task X.Y Completed: [Task Name]

Files Modified:
- file1.ts: [brief description of changes]
- file2.ts: [brief description of changes]

Validation:
- [ ] Checklist item 1
- [ ] Checklist item 2

Next Task: [Task X.Y+1 Name]
```

### If You Find Issues:

Jika menemukan issue tambahan saat mengerjakan task:
1. FLAG issue tersebut
2. Lanjutkan task current
3. Document di akhir sebagai "Additional Issues Found"

---

## Final Deliverables

Setelah semua phases complete, provide:

1. **Summary Report**:
   - Total issues fixed
   - Files modified
   - Breaking changes

2. **Migration Guide**:
   - Database migration steps
   - Code migration steps
   - Rollback procedure

3. **Testing Guide**:
   - Manual test cases
   - Automated test recommendations
   - Security test checklist

4. **Known Issues**:
   - Remaining technical debt
   - Future improvements needed

---

## START COMMAND

**Mulai dari PHASE 1, Task 1.1: Consolidate Authentication Architecture**

Ikuti protocol:
1. BACA `src/pages/Login.tsx`
2. BACA `src/services/auth.service.ts`
3. BACA `src/contexts/AuthContext.tsx`
4. ANALYZE dependencies
5. IMPLEMENT changes
6. VERIFY tidak break functionality

**KERJAKAN SATU PER SATU dengan TELITI. Jangan terburu-buru. Quality over speed.**
