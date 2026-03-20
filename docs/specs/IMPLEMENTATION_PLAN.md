# 🚀 KATH Landing Page - Implementation Plan

## 📋 Overview

Dokumen ini berisi **plan implementasi lengkap** untuk memperbaiki semua issue yang ditemukan selama code scanning, dengan menggunakan **skill-based agent workflow**.

---

## 🎯 Priority Matrix

| Priority | Category | Issues | Estimated Time |
|----------|----------|--------|----------------|
| 🔴 P0 | Critical Fixes | TypeScript errors, ESLint errors | 2-3 hours |
| 🔴 P0 | Security | Authentication system | 4-6 hours |
| 🟡 P1 | Architecture | Mock data vs API, State management | 3-4 hours |
| 🟡 P1 | Consistency | Theme colors, Code structure | 2-3 hours |
| 🟢 P2 | Optimization | Performance, Error handling | 3-4 hours |

---

## 🔄 Implementation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IMPLEMENTATION PHASES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: CRITICAL FIXES (P0)                                               │
│  ├── Task 1.1: Fix TypeScript Errors                                        │
│  ├── Task 1.2: Fix ESLint Errors                                            │
│  └── Task 1.3: Security Audit & Auth Fix                                    │
│                                                                              │
│  PHASE 2: ARCHITECTURE IMPROVEMENTS (P1)                                    │
│  ├── Task 2.1: API Integration Setup                                        │
│  ├── Task 2.2: State Management Refactor                                    │
│  ├── Task 2.3: Theme Color Standardization                                  │
│  └── Task 2.4: Code Structure Cleanup                                       │
│                                                                              │
│  PHASE 3: OPTIMIZATION & POLISH (P2)                                        │
│  ├── Task 3.1: Error Handling Implementation                                │
│  ├── Task 3.2: Loading States & Skeletons                                   │
│  ├── Task 3.3: Performance Optimization                                     │
│  └── Task 3.4: Testing & Validation                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 AGENT TASKS & PROMPTS

### **PHASE 1: CRITICAL FIXES (P0)**

---

#### **Task 1.1: Fix TypeScript Errors**

**Agent Role:** TypeScript Expert / Code Fixer

**Files to Fix:**
- `src/sections/Competition.tsx`

**Issues:**
1. Line 263: Property `totalPrize` does not exist on type
2. Line 405: Unused variable `index`

**Prompt for Agent:**

```markdown
## Task: Fix TypeScript Compilation Errors

### Context
Project: KATH Event Organizer Landing Page
Stack: React 19 + TypeScript + Vite + GSAP

### Issues Found

#### Issue 1: Missing Property in Config
**File:** `src/sections/Competition.tsx` (Line 263)
**Error:** Property 'totalPrize' does not exist on type '{ name: { id: string; en: string; }; deadline: string; description: { id: string; en: string; }; }'

**Current Code:**
```typescript
const totalPrize = competitionConfig.mainCompetition.totalPrize;
```

**Problem:** 
The `mainCompetition` object in config.ts doesn't have a `totalPrize` property.

**Solution Options:**
1. Add `totalPrize` property to `mainCompetition` in `src/config.ts`
2. Remove the code that references `totalPrize` if not needed
3. Calculate totalPrize from categories array

**Action Required:**
- Check how `totalPrize` is being used
- If needed: Add property to config with proper bilingual support
- If not needed: Remove the code

---

#### Issue 2: Unused Variable
**File:** `src/sections/Competition.tsx` (Line 405)
**Error:** Variable 'index' is declared but its value is never read

**Current Code:**
```typescript
// Find the line with .map() that has 'index' parameter
categories.map((category, index) => {  // ← index not used
```

**Solution:**
Remove unused `index` parameter:
```typescript
categories.map((category) => {
```

---

### Deliverables

1. ✅ Fix both TypeScript errors
2. ✅ Ensure build passes: `npm run build`
3. ✅ No new errors introduced
4. ✅ Keep bilingual support intact

### Testing
Run: `npm run build`
Expected: Build succeeds with 0 errors
```

---

#### **Task 1.2: Fix ESLint Errors**

**Agent Role:** ESLint / React Best Practices Expert

**Files to Fix:**
- `src/components/ui/sidebar.tsx`
- `src/contexts/AuthContext.tsx`
- `src/hooks/useApi.ts`
- `src/hooks/useAuth.ts`
- 7 UI component files (fast refresh issues)

**Prompt for Agent:**

```markdown
## Task: Fix ESLint Errors - React Best Practices

### Context
Project has 15+ ESLint errors that need to be fixed for code quality.

### Issues to Fix

#### 1. Impure Function in Render (CRITICAL)
**File:** `src/components/ui/sidebar.tsx` (Line 611)
**Error:** Cannot call impure function `Math.random` during render

**Current Code:**
```typescript
const width = React.useMemo(() => {
  return `${Math.floor(Math.random() * 40) + 50}%`
}, [])
```

**Problem:**
`Math.random()` is impure - should not be called during render, even in useMemo.

**Solution:**
Move random generation outside component or use useState:
```typescript
// Option 1: useState (recommended)
const [width] = useState(() => `${Math.floor(Math.random() * 40) + 50}%`)

// Option 2: Generate outside component
const generateRandomWidth = () => `${Math.floor(Math.random() * 40) + 50}%`;
```

---

#### 2. setState in useEffect (HIGH)
**File:** `src/contexts/AuthContext.tsx` (Line 62)
**Error:** Calling setState synchronously within an effect can trigger cascading renders

**Current Code:**
```typescript
useEffect(() => {
  const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);  // ← setState in effect
    } catch (error) {
      // ...
    }
  }
  setIsLoading(false);
}, []);
```

**Solution:**
This is actually acceptable for auth initialization, but we can improve:
```typescript
// Use lazy initial state instead
const [user, setUser] = useState<User | null>(() => {
  const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      return null;
    }
  }
  return null;
});

const [isLoading, setIsLoading] = useState(false);
```

---

#### 3. setState in useEffect - useApi.ts (HIGH)
**File:** `src/hooks/useApi.ts` (Line 49, 88)
**Error:** Calling fetchData() in useEffect with unstable dependencies

**Current Code:**
```typescript
useEffect(() => {
  fetchData();  // ← fetchData has dependencies that change
}, [fetchData]);
```

**Solution:**
Wrap fetchData in useCallback with proper dependencies:
```typescript
const fetchData = useCallback(async () => {
  // ... fetch logic
}, [/* stable dependencies only */]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

---

#### 4. Unused Variable (LOW)
**File:** `src/hooks/useAuth.ts` (Line 51)
**Error:** Variable 'err' is defined but never used

**Solution:**
Remove unused variable or use it:
```typescript
// Before
} catch (err) {
  console.error('Error:', err);
}

// After
} catch (error) {
  console.error('Login error:', error);
}
```

---

#### 5. Fast Refresh Issues (MEDIUM)
**Files:** 7 UI component files
**Error:** Fast refresh only works when a file only exports components

**Solution:**
Move non-component exports to separate files:
```typescript
// Before: button.tsx
export const variants = { ... };
export const Button = () => { ... };

// After:
// button.tsx
export const Button = () => { ... };

// button-variants.ts (new file)
export const variants = { ... };
```

---

### Deliverables

1. ✅ Fix all 15+ ESLint errors
2. ✅ Run: `npm run lint` - should pass with 0 errors
3. ✅ No warnings introduced
4. ✅ Keep functionality intact

### Testing
Run: `npm run lint`
Expected: 0 errors, 0 warnings
```

---

#### **Task 1.3: Security Fix - Authentication System**

**Agent Role:** Security Expert / Backend Engineer

**Files to Modify:**
- `src/contexts/AuthContext.tsx`
- `src/services/auth.ts` (create new)
- `src/utils/security.ts` (create new)

**Prompt for Agent:**

```markdown
## Task: Fix Critical Security Vulnerabilities in Authentication

### ⚠️ CRITICAL SECURITY ISSUES

**Current Implementation:**
```typescript
// ❌ INSECURE: Base64 is NOT hashing!
const hashPassword = (password: string): string => {
  return btoa(password + 'kath_salt_2026');
};

// ❌ Password stored in localStorage (vulnerable to XSS)
localStorage.setItem('kath_users', JSON.stringify(users));
```

### Security Vulnerabilities

1. **Base64 Encoding ≠ Hashing**
   - Base64 can be easily decoded
   - No computational cost to reverse
   - Not cryptographically secure

2. **Hardcoded Salt**
   - Salt is visible in client-side code
   - Same salt for all passwords
   - Useless against rainbow tables

3. **localStorage Storage**
   - Vulnerable to XSS attacks
   - No encryption at rest
   - Accessible by any script

4. **Client-Side Authentication**
   - All logic visible to attacker
   - No server-side validation
   - Easy to bypass

---

### Required Fixes

#### **Option A: Full Backend Auth (RECOMMENDED)**

**Create:** `src/services/auth.ts`

```typescript
// Secure authentication service
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  // ... other fields
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Use real API endpoints
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return handleResponse(response);
  },
};
```

**Update:** `src/contexts/AuthContext.tsx`

```typescript
// ✅ SECURE: Use backend authentication
import { authAPI } from '../services/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use secure token storage
  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await authAPI.refreshToken(refreshToken);
          setUser(response.user);
          // Store tokens securely
          localStorage.setItem('accessToken', response.accessToken);
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      // Store tokens securely
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return { success: true, message: 'Login berhasil' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  // ... rest of implementation
}
```

---

#### **Option B: Improved Client-Side Auth (TEMPORARY)**

If backend is not available yet, implement these security improvements:

**Create:** `src/utils/security.ts`

```typescript
// ⚠️ TEMPORARY: Better than btoa, but still not as secure as backend auth

// Use Web Crypto API for password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltedPassword = new Uint8Array(salt.length + data.length);
  saltedPassword.set(salt);
  saltedPassword.set(data, salt.length);
  
  // Hash with SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return salt + hash
  return Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('') + ':' + hashHex;
};

export const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  try {
    const [saltHex, storedHash] = hashed.split(':');
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const saltedPassword = new Uint8Array(salt.length + data.length);
    saltedPassword.set(salt);
    saltedPassword.set(data, salt.length);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex === storedHash;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};

// Secure storage helper
export const secureStorage = {
  set: (key: string, value: string) => {
    // In production, consider encryption
    localStorage.setItem(key, value);
  },
  get: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
};
```

---

### Additional Security Improvements

#### 1. Add Rate Limiting
```typescript
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

const checkRateLimit = (email: string): boolean => {
  const attempt = loginAttempts.get(email);
  if (!attempt) return true;
  
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  if (now - attempt.lastAttempt > fiveMinutes) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (attempt.count >= 5) {
    return false; // Block after 5 attempts
  }
  
  loginAttempts.set(email, { 
    count: attempt.count + 1, 
    lastAttempt: now 
  });
  return true;
};
```

#### 2. Add CSRF Protection
```typescript
// Generate CSRF token on login
const generateCSRFToken = (): string => {
  return crypto.getRandomValues(new Uint8Array(32))
    .reduce((memo, i) => memo + i.toString(16).padStart(2, '0'), '');
};

// Store and validate on each request
```

#### 3. Add Session Timeout
```typescript
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const checkSessionTimeout = () => {
  const lastActivity = localStorage.getItem('lastActivity');
  if (!lastActivity) return true;
  
  return Date.now() - parseInt(lastActivity) < SESSION_TIMEOUT;
};
```

---

### Deliverables

1. ✅ Implement Option A (Backend Auth) OR Option B (Improved Client-Side)
2. ✅ Remove all insecure code (btoa hashing)
3. ✅ Add rate limiting
4. ✅ Add session timeout
5. ✅ Add CSRF protection (if possible)
6. ✅ Update all auth-related components
7. ✅ Test login, register, logout flows

### Testing Checklist

- [ ] Login with correct credentials → Success
- [ ] Login with wrong password → Error
- [ ] Register new user → Success
- [ ] Register duplicate email → Error
- [ ] Logout → Session cleared
- [ ] Page refresh → Session persists
- [ ] Token expiration → Auto-logout
- [ ] XSS attempt → Tokens protected

### Documentation

Update `API_DOCUMENTATION.md` with:
- Auth endpoints
- Token format
- Security measures
- Error codes
```

---

### **PHASE 2: ARCHITECTURE IMPROVEMENTS (P1)**

---

#### **Task 2.1: API Integration Setup**

**Agent Role:** Backend Integration Specialist

**Files to Create/Modify:**
- `src/services/api.service.ts` (refactor existing)
- `src/services/competition.service.ts`
- `src/services/portfolio.service.ts`
- `src/services/news.service.ts`
- `src/config/environment.ts`

**Prompt for Agent:**

```markdown
## Task: Setup Complete API Integration Layer

### Current State
- Mock data service exists: `src/services/mockData.ts`
- Basic API helper exists: `src/services/api.ts`
- Environment variable: `VITE_API_URL`
- **Problem:** No switching mechanism between mock and real API

### Required Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Components                                                      │
│     │                                                            │
│     ▼                                                            │
│  ┌─────────────────┐                                            │
│  │ Service Layer   │ ← You are here                             │
│  │ (API + Mock)    │                                            │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ├──────────────┐                                      │
│           ▼              ▼                                      │
│  ┌────────────────┐ ┌──────────────┐                           │
│  │ API Service    │ │ Mock Service │                           │
│  │ (Production)   │ │ (Dev/Test)   │                           │
│  └────────┬───────┘ └──────┬───────┘                           │
│           │                │                                     │
│           └────────┬───────┘                                     │
│                    │                                             │
│                    ▼                                             │
│           ┌─────────────────┐                                   │
│           │ Config Switch   │                                   │
│           │ (env variable)  │                                   │
│           └─────────────────┘                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation Steps

#### Step 1: Create Environment Config

**File:** `src/config/environment.ts`

```typescript
export interface EnvironmentConfig {
  apiUrl: string;
  useMockData: boolean;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

const getEnvironment = (): EnvironmentConfig => {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  
  return {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
    environment: isProd ? 'production' : isDev ? 'development' : 'staging',
    debug: isDev,
  };
};

export const env = getEnvironment();
```

---

#### Step 2: Create Service Factory

**File:** `src/services/service.factory.ts`

```typescript
import { env } from '../config/environment';
import * as mockData from './mockData';
import * as api from './api';

export type ServiceType = 'competition' | 'portfolio' | 'news' | 'auth' | 'user';

export class ServiceFactory {
  private static instance: ServiceFactory;
  
  private constructor() {}
  
  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }
  
  getService<T extends ServiceType>(type: T) {
    const useMock = env.useMockData;
    
    switch (type) {
      case 'competition':
        return useMock ? mockCompetitionService : apiCompetitionService;
      case 'portfolio':
        return useMock ? mockPortfolioService : apiPortfolioService;
      case 'news':
        return useMock ? mockNewsService : apiNewsService;
      case 'auth':
        return useMock ? mockAuthService : apiAuthService;
      case 'user':
        return useMock ? mockUserService : apiUserService;
      default:
        throw new Error(`Unknown service type: ${type}`);
    }
  }
}

// Usage example:
// const competitionService = ServiceFactory.getInstance().getService('competition');
```

---

#### Step 3: Create Typed Services

**File:** `src/services/competition.service.ts`

```typescript
import { Competition } from './mockData';
import { api } from './api';
import * as mockData from './mockData';

export interface CompetitionFilters {
  status?: 'registered' | 'in_progress' | 'finished' | 'upcoming';
  category?: string;
  page?: number;
  limit?: number;
}

export class CompetitionService {
  // Mock implementation
  async getAll(filters?: CompetitionFilters): Promise<Competition[]> {
    const competitions = mockData.getCompetitions();
    
    if (filters?.status) {
      return competitions.filter(c => c.status === filters.status);
    }
    
    return competitions;
  }
  
  async getById(id: string): Promise<Competition | undefined> {
    return mockData.getCompetitionById(id);
  }
  
  async register(competitionId: string, userData: any): Promise<{ success: boolean; message: string }> {
    // Mock registration
    const competition = mockData.getCompetitionById(competitionId);
    if (!competition) {
      return { success: false, message: 'Competition not found' };
    }
    
    // Update mock data
    mockData.updateCompetition(competitionId, { 
      status: 'registered' 
    });
    
    return { success: true, message: 'Registration successful' };
  }
  
  // API implementation (for future)
  async getAllAPI(filters?: CompetitionFilters): Promise<Competition[]> {
    const params: Record<string, any> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.category) params.category = filters.category;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    
    const response = await api.get<Competition[]>('/competitions', params);
    return response.data;
  }
}

export const competitionService = new CompetitionService();
```

---

#### Step 4: Update Existing Components

**File:** `src/pages/Dashboard.tsx` (example update)

```typescript
// Before
import { getCompetitions, getDashboardStats } from '../services/mockData';

useEffect(() => {
  setNotifications(getNotifications());
  setCompetitions(getCompetitions());
  setStats(getDashboardStats());
}, []);

// After
import { competitionService } from '../services/competition.service';
import { statsService } from '../services/stats.service';

useEffect(() => {
  const loadData = async () => {
    try {
      const [competitions, stats] = await Promise.all([
        competitionService.getAll(),
        statsService.getDashboardStats(),
      ]);
      setCompetitions(competitions);
      setStats(stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Show error toast
    }
  };
  
  loadData();
}, []);
```

---

### Deliverables

1. ✅ Create environment config
2. ✅ Create service factory
3. ✅ Create typed services for:
   - Competition
   - Portfolio
   - News
   - Auth
   - User
4. ✅ Update all components to use new service layer
5. ✅ Ensure mock data still works for development
6. ✅ Add proper error handling
7. ✅ Add loading states

### Testing

```bash
# Test with mock data
VITE_USE_MOCK_DATA=true npm run dev

# Test with API (if backend available)
VITE_USE_MOCK_DATA=false npm run dev
```

### Documentation

Update `API_DOCUMENTATION.md` with:
- Service layer architecture
- How to switch between mock/API
- Service usage examples
- Error handling patterns
```

---

#### **Task 2.2: Theme Color Standardization**

**Agent Role:** UI/UX Designer + Tailwind CSS Expert

**Files to Modify:**
- `tailwind.config.js`
- `src/index.css`
- `src/config.ts` (color config section)

**Prompt for Agent:**

```markdown
## Task: Standardize Theme Colors - Choose ONE Theme

### Current Issue

**Documentation says:** Bright & Premium Theme (Blue + Gold)
- Primary: `#3B82F6` (Blue)
- Accent: `#F59E0B` (Gold)
- Background: `#F8FAFC` (Light)

**Implementation has:** Premium Gold & Black Theme
- Primary: `#AE8E1C` (Gold)
- Background: `#FAFAFA` (Light gray)

**Decision Required:** Which theme to use?

---

### Option A: Bright & Premium (Blue + Gold) ⭐ RECOMMENDED

**Rationale:** 
- More modern and professional
- Blue = Trust (good for competition platform)
- Gold = Premium/Excellence
- Better contrast and accessibility

**Color Palette:**

```javascript
// tailwind.config.js
colors: {
  // Primary - Vibrant Blue (Trust & Professional)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Main Primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Accent - Warm Gold (Premium & Award)
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // Main Accent
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Backgrounds (Light Theme)
  bg: {
    main: '#FFFFFF',
    card: '#FFFFFF',
    section: '#F8FAFC',
    elevated: '#FFFFFF',
  },
  
  // Text
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
  },
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
}
```

**CSS Variables:**

```css
/* src/index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  --accent: 38 92% 50%;
  --accent-foreground: 0 0% 100%;
  /* ... complete mapping */
}
```

---

### Option B: Premium Gold & Black (Current)

Keep existing gold theme but improve consistency.

---

### Implementation Steps (for Option A)

#### 1. Update Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Replace all kath colors with new palette
        primary: { /* ... as above */ },
        accent: { /* ... as above */ },
        bg: { /* ... as above */ },
        text: { /* ... as above */ },
      },
    },
  },
}
```

#### 2. Update CSS Variables

```css
/* src/index.css */
:root {
  /* Light theme */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  
  /* Primary Blue */
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  
  /* Accent Gold */
  --accent: 38 92% 50%;
  --accent-foreground: 0 0% 100%;
  
  /* Backgrounds */
  --bg-main: 0 0% 100%;
  --bg-card: 0 0% 100%;
  --bg-section: 210 40% 98%;
  
  /* Text */
  --text-primary: 222 47% 11%;
  --text-secondary: 215 16% 47%;
  --text-muted: 218 11% 65%;
}
```

#### 3. Update All Components

Search and replace:
- `bg-kath-bg-main` → `bg-bg-main`
- `text-kath-primary` → `text-primary`
- `bg-kath-gold` → `bg-accent`
- etc.

#### 4. Update Gradients

```css
/* Old */
.bg-gold-gradient {
  background: linear-gradient(135deg, #AE8E1C 0%, #C9A82F 50%, #AE8E1C 100%);
}

/* New */
.bg-accent-gradient {
  background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%);
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #3B82F6 100%);
}
```

---

### Deliverables

1. ✅ Decide on theme (recommend Option A)
2. ✅ Update `tailwind.config.js`
3. ✅ Update `src/index.css`
4. ✅ Update all component classes
5. ✅ Update gradients and effects
6. ✅ Test all pages for color consistency
7. ✅ Check accessibility (contrast ratios)
8. ✅ Update documentation

### Testing Checklist

- [ ] Hero section colors correct
- [ ] Navigation colors correct
- [ ] All buttons use new theme
- [ ] Cards use new theme
- [ ] Footer uses new theme
- [ ] Competition section uses new theme
- [ ] Dashboard uses new theme
- [ ] Mobile responsive colors
- [ ] Dark mode (if exists) updated
- [ ] Accessibility check (WCAG AA)

### Documentation

Update `info.md` and `AGENT_COLLABORATION.md` with:
- Final color palette
- Usage guidelines
- Do's and Don'ts
```

---

#### **Task 2.3: Code Structure Cleanup**

**Agent Role:** Code Organization Specialist

**Prompt for Agent:**

```markdown
## Task: Clean Up Code Structure

### Current Issues

1. **Empty Folders:**
   - `/app` - Empty, should be deleted

2. **Misplaced Files:**
   - `src/components/BackgroundMusic.tsx` - Not a UI component
   - Should be: `src/components/music/` or `src/components/common/`

3. **Duplicate Routes:**
   - `/my-competitions` and `/competition` both point to same component

4. **Unused Code:**
   - Many functions in `mockData.ts` not used
   - API service complete but not integrated

---

### Required Structure

```
src/
├── assets/              # Images, fonts, etc.
├── components/
│   ├── ui/             # shadcn UI components
│   ├── common/         # Reusable components
│   │   ├── BackgroundMusic.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   └── layout/         # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
├── config/
│   ├── environment.ts
│   ├── site.ts
│   └── theme.ts
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Route pages
├── sections/           # Landing page sections
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── competition.service.ts
│   ├── portfolio.service.ts
│   ├── news.service.ts
│   └── mockData.ts
├── types/              # TypeScript types
│   ├── api.ts
│   ├── competition.ts
│   └── user.ts
├── utils/
│   ├── cn.ts
│   ├── testData.ts
│   └── helpers.ts
└── App.tsx
```

---

### Tasks

1. Delete empty `/app` folder
2. Move `BackgroundMusic.tsx` to `components/common/`
3. Remove duplicate route `/competition`
4. Remove unused functions from `mockData.ts`
5. Create `types/` folder for TypeScript interfaces
6. Create `config/` folder for configs
7. Update all imports

---

### Deliverables

1. ✅ Clean folder structure
2. ✅ All imports updated
3. ✅ Build passes
4. ✅ No broken imports
5. ✅ Documentation updated
```

---

### **PHASE 3: OPTIMIZATION & POLISH (P2)**

---

#### **Task 3.1: Error Handling Implementation**

**Agent Role:** Error Handling Specialist

**Prompt for Agent:**

```markdown
## Task: Implement Comprehensive Error Handling

### Current Issues

```typescript
// ❌ Current: Silent failures
try {
  await someFunction();
} catch (error) {
  console.error('Error:', error);  // Only logs, no user feedback
}
```

### Required Implementation

#### 1. Create Error Boundary

**File:** `src/components/common/ErrorBoundary.tsx`

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-section">
          <div className="text-center p-8 bg-card rounded-xl shadow-lg max-w-md">
            <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
            <h1 className="text-2xl font-display font-semibold mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-text-secondary mb-6">
              We're sorry for the inconvenience. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

#### 2. Create Error Hook

**File:** `src/hooks/useErrorHandler.ts`

```typescript
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorOptions {
  title?: string;
  message?: string;
  showToast?: boolean;
  logError?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, options?: ErrorOptions) => {
    const {
      title = 'Error',
      message,
      showToast = true,
      logError = true,
    } = options || {};

    // Log error
    if (logError) {
      console.error('[Error Handler]:', error);
    }

    // Show toast
    if (showToast) {
      const errorMessage = message || (error instanceof Error ? error.message : 'An unexpected error occurred');
      
      toast.error(title, {
        description: errorMessage,
        duration: 5000,
      });
    }

    // TODO: Send to error tracking service
    // sendToSentry(error);
  }, []);

  const handleApiError = useCallback(async (response: Response, options?: ErrorOptions) => {
    try {
      const errorData = await response.json();
      handleError(errorData, options);
    } catch {
      handleError(new Error('Network error'), options);
    }
  }, [handleError]);

  return { handleError, handleApiError };
};
```

---

#### 3. Update All API Calls

```typescript
// Before
const loadData = async () => {
  const data = await api.get('/data');
  setData(data);
};

// After
import { useErrorHandler } from '../hooks/useErrorHandler';

const loadData = async () => {
  try {
    setIsLoading(true);
    const data = await api.get('/data');
    setData(data);
  } catch (error) {
    handleError(error, {
      title: 'Failed to load data',
      message: 'Please check your connection and try again.',
    });
  } finally {
    setIsLoading(false);
  }
};
```

---

#### 4. Create Loading States

**File:** `src/components/common/LoadingStates.tsx`

```typescript
import { Skeleton } from '../ui/skeleton';

export const DashboardLoading = () => (
  <div className="space-y-6">
    <Skeleton className="h-32 w-full" />
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);

export const CompetitionCardLoading = () => (
  <div className="space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
```

---

### Deliverables

1. ✅ Create ErrorBoundary component
2. ✅ Create useErrorHandler hook
3. ✅ Update all API calls with error handling
4. ✅ Create loading state components
5. ✅ Add toast notifications for errors
6. ✅ Test error scenarios

### Testing

- [ ] Network error → Error toast shown
- [ ] API error → User-friendly message
- [ ] Component crash → Error boundary catches
- [ ] Loading states → Shown during fetch
- [ ] Success → No errors shown
```

---

## 📊 IMPLEMENTATION TRACKING

### Phase 1: Critical Fixes

| Task | Status | Assigned To | Completed |
|------|--------|-------------|-----------|
| 1.1 Fix TypeScript Errors | ⏳ Pending | TypeScript Agent | ☐ |
| 1.2 Fix ESLint Errors | ⏳ Pending | ESLint Agent | ☐ |
| 1.3 Security Auth Fix | ⏳ Pending | Security Agent | ☐ |

### Phase 2: Architecture

| Task | Status | Assigned To | Completed |
|------|--------|-------------|-----------|
| 2.1 API Integration | ⏳ Pending | Backend Agent | ☐ |
| 2.2 Theme Standardization | ⏳ Pending | UI/UX Agent | ☐ |
| 2.3 Code Cleanup | ⏳ Pending | Refactor Agent | ☐ |

### Phase 3: Optimization

| Task | Status | Assigned To | Completed |
|------|--------|-------------|-----------|
| 3.1 Error Handling | ⏳ Pending | Error Agent | ☐ |
| 3.2 Loading States | ⏳ Pending | UI Agent | ☐ |
| 3.3 Performance | ⏳ Pending | Performance Agent | ☐ |
| 3.4 Testing | ⏳ Pending | QA Agent | ☐ |

---

## 🚀 GETTING STARTED

### Step 1: Copy Prompts

Copy each prompt above to separate markdown files:
- `prompts/1.1-typescript-fix.md`
- `prompts/1.2-eslint-fix.md`
- `prompts/1.3-security-fix.md`
- etc.

### Step 2: Run Agents

Use Qwen Code agents or custom skill agents:

```bash
# Example (adjust based on your agent setup)
qwen-agent --prompt prompts/1.1-typescript-fix.md
qwen-agent --prompt prompts/1.2-eslint-fix.md
```

### Step 3: Verify

After each phase:
```bash
npm run build
npm run lint
npm run dev
```

---

## 📞 SUPPORT

For questions about this implementation plan:
1. Check each prompt's "Deliverables" section
2. Run tests after each task
3. Commit changes after each phase

---

**Last Updated:** March 17, 2026
**Version:** 1.0.0
