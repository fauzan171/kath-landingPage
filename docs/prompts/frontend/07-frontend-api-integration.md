# 07 - Frontend API Integration Fix

## 🎯 Objective
Memperbaiki koneksi API antara Frontend dan Backend, serta memperbaiki flow yang masih salah.

## 📋 Context
Project KATH Event Organizer memiliki:
- **Frontend**: React + Vite + TypeScript (Cloudflare Pages)
- **Backend**: Cloudflare Workers + D1 (dalam pengembangan)
- **Current Issue**: 
  - Services masih menggunakan mock data
  - API endpoints tidak sesuai dengan backend spec
  - Flow registration → verification → dashboard belum connect
  - Auth service masih localStorage-based tanpa proper token handling

---

## 🐛 Issues yang Ditemukan

### 1. API Base URL Configuration
**File**: `src/services/api.ts`

**Current**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

**Issue**: 
- Backend actual berjalan di `http://localhost:8787` (Cloudflare Workers)
- Production URL belum di-set dengan benar
- Missing error handling untuk network errors

**Fix Required**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api/v1';

// Add proper error handling
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Network error' } }));
    throw new Error(error.error?.message || 'An error occurred');
  }
  return response.json();
}
```

---

### 2. Auth Service Issues
**File**: `src/services/auth.service.ts`

**Current Issues**:
1. Token disimpan di localStorage (kurang secure)
2. Tidak ada refresh token mechanism
3. Tidak ada proper error handling
4. Response format tidak sesuai dengan backend spec

**Required Changes**:

```typescript
// IMPROVED: Auth service dengan proper token handling
import { post } from './api';
import type { ApiResponse } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  };
  competitions: Array<{
    id: string;
    code: string;
    name: string;
    role: string;
  }>;
}

// Token management
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static REFRESH_TIMEOUT = 60000; // 1 minute before expiry

  static setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    // Refresh token should be in httpOnly cookie, but we store temporarily
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    
    // Schedule token refresh
    this.scheduleRefresh();
  }

  static getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static async refresh(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refreshToken=${refreshToken}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data = await response.json();
      if (data.success) {
        this.setTokens(data.data.accessToken, refreshToken);
        return data.data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return null;
    }
  }

  private static scheduleRefresh(): void {
    // Refresh token after 14 minutes (access token expires in 15 minutes)
    setTimeout(async () => {
      await this.refresh();
    }, this.REFRESH_TIMEOUT);
  }
}

// Auth functions
export async function login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    if (data.success && data.data) {
      // Store tokens
      TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
}

export async function logout(): Promise<ApiResponse<void>> {
  try {
    const accessToken = TokenManager.getAccessToken();
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    TokenManager.clearTokens();
    
    return data;
  } catch (error: any) {
    TokenManager.clearTokens();
    throw new Error(error.message || 'Logout failed');
  }
}

export function getCurrentUser(): LoginResponse['user'] | null {
  // Get user info from token or session
  const token = TokenManager.getAccessToken();
  if (!token) return null;

  try {
    // Decode JWT token (optional: use jwt-decode library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name || '',
      role: payload.role || 'participant',
      permissions: payload.permissions || [],
    };
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!TokenManager.getAccessToken();
}

export const authService = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  refresh: TokenManager.refresh,
};
```

---

### 3. API Service Enhancement
**File**: `src/services/api.ts`

**Add interceptor-like functionality**:

```typescript
// Add request interceptor for auto token refresh
async function fetchWithRetry<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
  const accessToken = TokenManager.getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  // Handle 401 (token expired)
  if (response.status === 401) {
    const newToken = await TokenManager.refresh();
    if (newToken) {
      // Retry request with new token
      return fetchWithRetry(endpoint, options);
    }
    // Redirect to login
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return handleResponse<T>(response);
}

// Update get, post, put, del to use fetchWithRetry
export async function get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  return fetchWithRetry<T>(endpoint, {
    method: 'GET',
  });
}

export async function post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  return fetchWithRetry<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// ... same for put, del
```

---

### 4. Competition Service Fix
**File**: `src/services/competition.service.ts`

**Issue**: Endpoint tidak sesuai dengan backend spec

**Current**:
```typescript
const ENDPOINT = '/competitions';
```

**Should be**:
```typescript
const ENDPOINT = '/admin/competitions'; // For admin endpoints

// Add public endpoints
export async function getPublicCompetition(code: string): Promise<ApiResponse<Competition>> {
  return get<Competition>(`/public/competitions/${code}`);
}
```

---

### 5. Registration Flow Fix

**Files**: `src/pages/Register.tsx`, `src/services/cibc.service.ts`

**Current Issue**: Registration tidak connect ke backend

**Required Flow**:
```
1. User fills registration form
   ↓
2. POST /api/v1/teams (create team with status: pending_review)
   ↓
3. POST /api/v1/team-members (add members)
   ↓
4. Upload payment proof → GET presigned URL → Upload to R2
   ↓
5. Update team with payment_proof URL
   ↓
6. Show "Pending Verification" page
```

**Implementation**:

```typescript
// src/services/team.service.ts (NEW)

import { post, put, get } from './api';
import type { ApiResponse } from './api';

export interface RegisterTeamInput {
  name: string;
  category: 'student' | 'open';
  institution: string;
  members: {
    full_name: string;
    email: string;
    phone?: string;
    role: 'leader' | 'member';
    institution?: string;
  }[];
}

export interface Team {
  id: string;
  name: string;
  code: string;
  category: string;
  status: 'draft' | 'pending_review' | 'registered' | 'active' | 'disqualified';
  institution?: string;
  payment_proof?: string;
  created_at: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: 'leader' | 'member';
}

export async function registerTeam(data: RegisterTeamInput): Promise<ApiResponse<Team>> {
  // 1. Create team
  const teamResponse = await post<Team>('/admin/teams', {
    name: data.name,
    category: data.category,
    institution: data.institution,
    status: 'pending_review',
  });

  if (!teamResponse.success || !teamResponse.data) {
    throw new Error('Failed to create team');
  }

  const team = teamResponse.data;

  // 2. Add members
  for (const member of data.members) {
    await post(`/admin/teams/${team.id}/members`, member);
  }

  return teamResponse;
}

export async function uploadPaymentProof(teamId: string, file: File): Promise<ApiResponse<{ url: string }>> {
  // 1. Get presigned URL
  const presignedResponse = await post<{ url: string; key: string }>('/admin/upload/presigned', {
    filename: `payment-${teamId}-${file.name}`,
    fileSize: file.size,
    contentType: file.type,
    folder: 'payment-proofs',
  });

  if (!presignedResponse.success) {
    throw new Error('Failed to get upload URL');
  }

  // 2. Upload to R2
  await fetch(presignedResponse.data.url, {
    method: 'PUT',
    body: file,
  });

  // 3. Return final URL
  return {
    success: true,
    data: {
      url: presignedResponse.data.url.split('?')[0], // Remove query params
    },
  };
}

export async function updateTeamPayment(teamId: string, paymentProofUrl: string): Promise<ApiResponse<Team>> {
  return put<Team>(`/admin/teams/${teamId}`, {
    payment_proof: paymentProofUrl,
  });
}

export async function getMyTeam(competitionId: string): Promise<ApiResponse<Team | null>> {
  return get<Team | null>(`/admin/teams/my?competitionId=${competitionId}`);
}

export const teamService = {
  registerTeam,
  uploadPaymentProof,
  updateTeamPayment,
  getMyTeam,
};
```

---

### 6. Update Registration Page

**File**: `src/pages/Register.tsx`

**Key Changes**:

```typescript
import { useState } from 'react';
import { teamService } from '@/services/team.service';
import { toast } from 'sonner'; // or your toast library

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    category: 'student',
    institution: '',
    members: [{
      full_name: '',
      email: '',
      phone: '',
      role: 'leader' as const,
    }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register team
      const teamResponse = await teamService.registerTeam({
        name: formData.teamName,
        category: formData.category as any,
        institution: formData.institution,
        members: formData.members,
      });

      if (!teamResponse.success) {
        throw new Error(teamResponse.message || 'Registration failed');
      }

      const team = teamResponse.data!;

      // 2. Upload payment proof (if file selected)
      const paymentFile = (document.getElementById('payment-proof') as HTMLInputElement)?.files?.[0];
      if (paymentFile) {
        const uploadResponse = await teamService.uploadPaymentProof(team.id, paymentFile);
        if (uploadResponse.success) {
          await teamService.updateTeamPayment(team.id, uploadResponse.data.url);
        }
      }

      toast.success('Registration successful! Please wait for admin verification.');
      
      // 3. Redirect to status page
      setTimeout(() => {
        window.location.href = '/registration/status';
      }, 2000);

    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your form JSX
  );
}
```

---

### 7. Environment Variables

**File**: `.env.example` (update)

```bash
# API Configuration
VITE_API_URL=http://localhost:8787/api/v1

# Production URL (set ini setelah deploy backend)
# VITE_API_URL=https://cibc-admin-backend.your-subdomain.workers.dev/api/v1

# Supabase (for fallback or specific features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_NAME=KATH Event Organizer
VITE_APP_URL=http://localhost:5173

# Competition ID
VITE_COMPETITION_CODE=cibc-2026
```

**File**: `.env` (create from .env.example)

---

## ✅ Action Items

### Immediate Fixes (Priority 1)
- [ ] Update `API_BASE_URL` di `src/services/api.ts` ke `http://localhost:8787/api/v1`
- [ ] Fix auth service dengan proper token handling (sessionStorage, refresh mechanism)
- [ ] Add fetch retry logic untuk handle 401 responses
- [ ] Update competition service endpoints

### Registration Flow (Priority 2)
- [ ] Create `team.service.ts` dengan registerTeam, uploadPaymentProof functions
- [ ] Update `Register.tsx` untuk connect ke backend
- [ ] Create registration status page (`/registration/status`)
- [ ] Add loading states & error handling

### Dashboard Connection (Priority 3)
- [ ] Update dashboard to fetch from `/api/v1/admin/dashboard/stats`
- [ ] Connect real-time notifications (polling every 30s)
- [ ] Add team management features

---

## 🧪 Testing Checklist

```bash
# 1. Test login
- [ ] Login dengan credentials benar → dapat token
- [ ] Login dengan credentials salah → error message
- [ ] Token auto-refresh setelah 14 menit

# 2. Test registration
- [ ] Submit registration form → team created
- [ ] Upload payment proof → file uploaded to R2
- [ ] Show pending verification status

# 3. Test protected routes
- [ ] Access /dashboard tanpa login → redirect ke /login
- [ ] Access /dashboard dengan login → success
- [ ] Token expired → auto refresh → retry request

# 4. Test API calls
- [ ] GET /admin/competitions → list competitions
- [ ] GET /admin/teams/my → get user's team
- [ ] POST /admin/teams → create team
```

---

## 📚 References

- Backend spec: `docs/backend-spec/BACKEND_DETAILED_SPECIFICATION.md`
- API endpoints: `docs/backend-spec/backend-api-types.ts`
- Current services: `src/services/`

---

**Next Prompt**: `08-frontend-registration-flow.md` - Detailed registration flow implementation
