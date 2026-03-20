# Frontend Integration Guide - API-Driven Sections

Dokumen ini menjelaskan bagaimana mengubah section FE yang sekarang static menjadi API-driven dari backend dashboard.

---

## 🎯 Target Sections

Berikut section yang perlu diubah dari `config.ts` / static menjadi API-driven:

### 1. Competition Section (`src/sections/Competition.tsx`)

#### Current State
```typescript
// Sekarang dari config.ts - static
import { competitionConfig } from '@/config';
const { mainCompetition, categories, stages } = competitionConfig;
```

#### Target State
```typescript
// Dari API - dinamis
const { competition, stages, tasks, loading } = usePublicCompetition('cibc-2025');
```

#### Changes Needed

| Line | Current | New |
|------|---------|-----|
| 263 | `competitionConfig.mainCompetition.totalPrize` | `competition.config.totalPrize` |
| Hero | Static deadline | `competition.registrationEnd` |
| Categories | Static array | `competition.config.categories` |
| Stages | Static config | `stages[]` dari API |

---

### 2. Task/Submission Section

#### Current State
```typescript
// Sekarang tasks hardcoded di config
const submissionStages = [
  { id: 'stage-1', name: 'BMC', tasks: [...] },
  { id: 'stage-2', name: 'Pitch Deck', tasks: [...] },
];
```

#### Target State
```typescript
// Dari API
const { tasks } = useTasks(competitionId);
// Filter by stage
const stageTasks = tasks.filter(t => t.stageId === currentStageId);
```

---

## 🔌 API Services (Frontend)

### 1. Public API Service (Untuk Landing Page)

Buat file: `src/services/public-api.service.ts`

```typescript
import { ApiResponse, Competition, Stage, FAQ } from '@/types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.kathevent.com';

export const publicApi = {
  // Competitions
  getCompetitions: async (): Promise<ApiResponse<Competition[]>> => {
    const res = await fetch(`${API_BASE}/api/v1/public/competitions`);
    return res.json();
  },

  getCompetition: async (id: string): Promise<ApiResponse<Competition>> => {
    const res = await fetch(`${API_BASE}/api/v1/public/competitions/${id}`);
    return res.json();
  },

  getTimeline: async (competitionId: string): Promise<ApiResponse<Stage[]>> => {
    const res = await fetch(`${API_BASE}/api/v1/public/competitions/${competitionId}/timeline`);
    return res.json();
  },

  getFAQs: async (competitionId: string): Promise<ApiResponse<FAQ[]>> => {
    const res = await fetch(`${API_BASE}/api/v1/public/competitions/${competitionId}/faqs`);
    return res.json();
  },
};
```

### 2. React Hooks

Buat file: `src/hooks/usePublicCompetition.ts`

```typescript
import { useState, useEffect } from 'react';
import { publicApi } from '@/services/public-api.service';
import type { Competition, Stage, FAQ } from '@/types/api';

interface UsePublicCompetitionReturn {
  competition: Competition | null;
  stages: Stage[];
  faqs: FAQ[];
  loading: boolean;
  error: Error | null;
}

export function usePublicCompetition(competitionCode: string): UsePublicCompetitionReturn {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parallel fetch
        const [compRes, timelineRes, faqRes] = await Promise.all([
          publicApi.getCompetition(competitionCode),
          publicApi.getTimeline(competitionCode),
          publicApi.getFAQs(competitionCode),
        ]);

        if (compRes.success) setCompetition(compRes.data!);
        if (timelineRes.success) setStages(timelineRes.data!);
        if (faqRes.success) setFaqs(faqRes.data!);
        
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [competitionCode]);

  return { competition, stages, faqs, loading, error };
}
```

### 3. Admin API Service

Buat file: `src/services/admin-api.service.ts`

```typescript
import { getAuthToken } from '@/utils/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.kathevent.com';

// Helper untuk request dengan auth
async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/admin/login';
    return;
  }

  return res.json();
}

export const adminApi = {
  // Auth
  login: (email: string, password: string) => 
    fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),

  setContext: (competitionId: string) =>
    adminFetch('/api/v1/admin/auth/context', {
      method: 'POST',
      body: JSON.stringify({ competitionId }),
    }),

  // Dashboard
  getStats: () => adminFetch('/api/v1/admin/dashboard/stats'),
  getActivities: () => adminFetch('/api/v1/admin/dashboard/activities'),
  
  // Stages
  getStages: () => adminFetch('/api/v1/admin/stages'),
  createStage: (data: any) => adminFetch('/api/v1/admin/stages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStage: (id: string, data: any) => adminFetch(`/api/v1/admin/stages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  activateStage: (id: string) => adminFetch(`/api/v1/admin/stages/${id}/activate`, {
    method: 'POST',
  }),

  // Tasks
  getTasks: (stageId?: string) => {
    const query = stageId ? `?stageId=${stageId}` : '';
    return adminFetch(`/api/v1/admin/tasks${query}`);
  },
  createTask: (stageId: string, data: any) => 
    adminFetch(`/api/v1/admin/stages/${stageId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (id: string, data: any) => 
    adminFetch(`/api/v1/admin/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  publishTask: (id: string) => 
    adminFetch(`/api/v1/admin/tasks/${id}/publish`, { method: 'POST' }),
  unpublishTask: (id: string) => 
    adminFetch(`/api/v1/admin/tasks/${id}/unpublish`, { method: 'POST' }),

  // Teams
  getTeams: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return adminFetch(`/api/v1/admin/teams?${params}`);
  },
  createTeam: (data: any) => adminFetch('/api/v1/admin/teams', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTeamStatus: (id: string, status: string) => 
    adminFetch(`/api/v1/admin/teams/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Submissions
  getSubmissions: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return adminFetch(`/api/v1/admin/submissions?${params}`);
  },
  getSubmission: (id: string) => adminFetch(`/api/v1/admin/submissions/${id}`),
  gradeSubmission: (id: string, data: any) => 
    adminFetch(`/api/v1/admin/submissions/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  exportSubmissions: () => adminFetch('/api/v1/admin/submissions/export'),
};
```

---

## 🔄 Migration Checklist

### Phase 1: Setup API Types & Services
- [ ] Install types dari `backend-api-types.ts`
- [ ] Buat `src/types/api.ts` dengan semua interfaces
- [ ] Buat `src/services/public-api.service.ts`
- [ ] Buat `src/services/admin-api.service.ts`
- [ ] Setup environment variable `VITE_API_URL`

### Phase 2: Update Public Sections
- [ ] Modify `Competition.tsx` → gunakan `usePublicCompetition`
- [ ] Update `AboutCompetition.tsx` → data dari API
- [ ] Update `FAQ.tsx` → FAQ dari API
- [ ] Update `Timeline.tsx` → stages dari API

### Phase 3: Update Participant Dashboard
- [ ] Update `MyCompetitions.tsx` → fetch active competitions
- [ ] Update `SubmissionForm.tsx` → tasks dari API
- [ ] Update `BMCCompetition.tsx` → stage data dari API

### Phase 4: Admin Dashboard UI
- [ ] Create `src/pages/admin/Login.tsx`
- [ ] Create `src/pages/admin/Dashboard.tsx`
- [ ] Create `src/pages/admin/Stages.tsx`
- [ ] Create `src/pages/admin/Tasks.tsx`
- [ ] Create `src/pages/admin/Teams.tsx`
- [ ] Create `src/pages/admin/Submissions.tsx`
- [ ] Create `src/pages/admin/Grading.tsx`

---

## 📁 File Structure (Target)

```
src/
├── components/
│   └── admin/
│       ├── Sidebar.tsx
│       ├── StageCard.tsx
│       ├── TaskCard.tsx
│       ├── TeamTable.tsx
│       ├── SubmissionCard.tsx
│       ├── GradingForm.tsx
│       └── StatsCard.tsx
├── hooks/
│   ├── usePublicCompetition.ts
│   ├── useAdminAuth.ts
│   ├── useAdminDashboard.ts
│   ├── useStages.ts
│   ├── useTasks.ts
│   ├── useTeams.ts
│   └── useSubmissions.ts
├── pages/
│   └── admin/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Stages.tsx
│       ├── Tasks.tsx
│       ├── Teams.tsx
│       ├── Submissions.tsx
│       ├── Grading.tsx
│       └── Settings.tsx
├── services/
│   ├── public-api.service.ts
│   └── admin-api.service.ts
└── types/
    └── api.ts
```

---

## 🔐 Auth Context (Admin)

Buat file: `src/contexts/AdminAuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useCallback } from 'react';
import { adminApi } from '@/services/admin-api.service';
import type { User, CompetitionContext } from '@/types/api';

interface AdminAuthContextType {
  user: User | null;
  competitions: CompetitionContext[];
  currentCompetition: CompetitionContext | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentCompetition: (id: string) => Promise<void>;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [competitions, setCompetitions] = useState<CompetitionContext[]>([]);
  const [currentCompetition, setCurrentComp] = useState<CompetitionContext | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await adminApi.login(email, password);
      if (res.success) {
        localStorage.setItem('admin_token', res.data.accessToken);
        setUser(res.data.user);
        setCompetitions(res.data.competitions);
        // Auto-select first competition if only one
        if (res.data.competitions.length === 1) {
          await handleSetCompetition(res.data.competitions[0].competitionId);
        }
      } else {
        throw new Error(res.error?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetCompetition = async (id: string) => {
    const res = await adminApi.setContext(id);
    if (res.success) {
      localStorage.setItem('admin_token', res.data.accessToken);
      const comp = competitions.find(c => c.competitionId === id);
      setCurrentComp(comp || null);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setCompetitions([]);
    setCurrentComp(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{
      user,
      competitions,
      currentCompetition,
      login,
      logout,
      setCurrentCompetition: handleSetCompetition,
      loading,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
```

---

## ✅ Testing Checklist

### Public API
- [ ] GET /api/v1/public/competitions → Return list competitions
- [ ] GET /api/v1/public/competitions/:id → Return competition detail
- [ ] GET /api/v1/public/competitions/:id/timeline → Return stages
- [ ] GET /api/v1/public/competitions/:id/faqs → Return FAQs

### Admin API
- [ ] POST /api/v1/auth/login → Return tokens + user
- [ ] POST /api/v1/admin/auth/context → Return new token with competition context
- [ ] GET /api/v1/admin/dashboard/stats → Return stats
- [ ] CRUD stages works correctly
- [ ] CRUD tasks works correctly
- [ ] Team management works
- [ ] Submission grading works

### Multi-tenancy
- [ ] Admin A (CIBC 2025) can't see Admin B (Hackathon 2025) data
- [ ] Switching competition context changes visible data
- [ ] Super admin can see all competitions

---

## 🚀 Deployment Steps

### 1. Backend Deployment
```bash
# Setup backend project
cd admin-backend
npm install

# Setup D1 database
wrangler d1 create cibc-admin-db
wrangler d1 execute cibc-admin-db --file=../backend-schema.sql

# Deploy
wrangler deploy
```

### 2. Frontend Environment
```bash
# .env.production
VITE_API_URL=https://admin-api.kathevent.com
VITE_PUBLIC_API_URL=https://api.kathevent.com
```

### 3. First Admin Setup
```bash
# Create super admin via D1 query
# Hash password dengan bcrypt di local
# Insert ke users table
```

---

Siap? Mau gw lanjut bikin komponen-komponen admin dashboard-nya?
