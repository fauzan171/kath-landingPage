# 🏗️ Backend Admin Dashboard - Architecture Document

## 📋 Overview

Dokumen ini berisi arsitektur lengkap untuk backend admin dashboard yang mengontrol:
- Kegiatan acara (Competition Events)
- Flow acara (Timeline, Stages, Phases)
- Submission tugas peserta (Submissions & Grading)
- Multi-tenant: Beda akun = Beda data dashboard (per kompetisi)

---

## 🎯 Architecture Principles

| Principle | Decision | Reason |
|-----------|----------|--------|
| **Serverless** | Cloudflare Workers | Udah setup, scalable, murah |
| **Database** | D1 SQLite + R2 Storage | Edge-native, murah, cukup untuk lomba |
| **Auth** | JWT + Role-Based Access | Stateless, bisa beda role per kompetisi |
| **API Style** | REST + WebSocket (optional) | Simpel, frontend-friendly |

---

## 🏛️ Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYERS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐    │
│   │  Admin Web App  │    │  Public Website │    │  Peserta Dashboard  │    │
│   │  (React/Vue)    │    │   (KATH Site)   │    │   (Existing CIBC)   │    │
│   └────────┬────────┘    └────────┬────────┘    └──────────┬──────────┘    │
│            │                      │                        │              │
│            │  /api/admin/*          │  /api/public/*         │  /api/user/* │
│            └────────────┬───────────┴────────────┬───────────┘              │
│                         │                      │                           │
└─────────────────────────┼──────────────────────┼───────────────────────────┘
                          │                      │
┌─────────────────────────┼──────────────────────┼───────────────────────────┐
│                         ▼                      ▼                           │
│                    CLOUDFLARE EDGE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    Cloudflare Workers (API Gateway)                  │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │  │
│   │  │ Auth Worker  │  │ Admin Worker │  │ Public Worker│              │  │
│   │  │ - JWT Verify │  │ - CRUD Admin │  │ - Read Only  │              │  │
│   │  │ - Rate Limit │  │ - Validate   │  │ - Cache      │              │  │
│   │  └──────────────┘  └──────────────┘  └──────────────┘              │  │
│   └──────────────────────────┬────────────────────────────────────────┘  │
│                              │                                             │
│   ┌──────────────────────────┼────────────────────────────────────────┐   │
│   │                          ▼                                         │   │
│   │              ┌─────────────────────┐                             │   │
│   │              │   Middleware Layer  │                             │   │
│   │              │ - Auth Check        │                             │   │
│   │              │ - Role Validation   │                             │   │
│   │              │ - Competition ACL   │                             │   │
│   │              └──────────┬──────────┘                             │   │
│   │                         │                                        │   │
│   │            ┌────────────┼────────────┐                           │   │
│   │            ▼            ▼            ▼                           │   │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐                       │   │
│   │   │D1 SQLite │  │ R2 Object│  │ KV Cache │                       │   │
│   │   │Database  │  │ Storage  │  │ (Redis)  │                       │   │
│   │   └──────────┘  └──────────┘  └──────────┘                       │   │
│   │                                                                   │   │
│   └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (D1 SQLite)

### Core Tables

```sql
-- ============================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ============================================

CREATE TABLE users (
    id TEXT PRIMARY KEY,              -- UUID v4
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,      -- bcrypt hash
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'judge', 'observer')),
    permissions JSON,                  -- Flexible permissions object
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, competition_id, role)
);

-- ============================================
-- 2. COMPETITION MANAGEMENT (Multi-tenant)
-- ============================================

CREATE TABLE competitions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,         -- Unique code: "cibc-2025", "hackathon-2025"
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')),
    
    -- Timeline
    registration_start DATETIME,
    registration_end DATETIME,
    event_start DATETIME,
    event_end DATETIME,
    
    -- Configuration
    config JSON,                       -- Flexible settings (max_team_size, etc)
    theme JSON,                        -- Branding colors, logos
    
    created_by TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. COMPETITION FLOW & STAGES
-- ============================================

CREATE TABLE stages (
    id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,     -- Urutan stage
    
    -- Waktu stage
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    
    -- Konfigurasi
    is_active BOOLEAN DEFAULT 0,
    auto_progress BOOLEAN DEFAULT 0,   -- Auto next stage when time reached
    requires_submission BOOLEAN DEFAULT 1,
    
    -- Criteria for judging (JSON array)
    criteria JSON,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    stage_id TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('submission', 'quiz', 'manual_review', 'attendance')),
    
    -- Deadline & Requirements
    deadline DATETIME,
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_extensions JSON,           -- [".pdf", ".pptx", ".zip"]
    
    -- Rubrik penilaian
    rubric JSON,                       -- Array of {criteria, weight, max_score}
    
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT 1,
    is_published BOOLEAN DEFAULT 0,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. PARTICIPANTS & TEAMS
-- ============================================

CREATE TABLE teams (
    id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,                         -- Kode unik team (opsional)
    
    -- Status
    status TEXT CHECK(status IN ('pending', 'registered', 'active', 'disqualified', 'withdrawn')),
    
    -- Metadata
    institution TEXT,
    category TEXT,                     -- Kategori lomba (jika ada)
    
    -- Registration
    registered_at DATETIME,
    registration_data JSON,            -- Data dari form pendaftaran
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT,                      -- Bisa null jika external participant
    
    -- Data peserta (bisa copy dari user atau isi manual)
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    student_id TEXT,                   -- NIM/NIS
    institution TEXT,
    
    -- Role dalam team
    role TEXT CHECK(role IN ('leader', 'member', 'mentor')),
    
    is_active BOOLEAN DEFAULT 1,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. SUBMISSIONS & GRADING
-- ============================================

CREATE TABLE submissions (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    
    -- Submission data
    submitted_by TEXT REFERENCES users(id),  -- Yang upload (biasanya leader)
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- File/Content
    file_url TEXT,                     -- URL ke R2
    file_name TEXT,
    file_size INTEGER,
    
    -- Content (jika text submission)
    content TEXT,                      -- JSON atau markdown
    
    -- Status workflow
    status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'graded', 'returned')),
    
    -- Grading
    total_score DECIMAL(5,2),
    graded_by TEXT REFERENCES users(id),
    graded_at DATETIME,
    feedback TEXT,
    
    -- Individual criteria scores
    criteria_scores JSON,              -- {criteria_id: score}
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(task_id, team_id)           -- 1 submission per task per team
);

CREATE TABLE submission_reviews (
    id TEXT PRIMARY KEY,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_id TEXT NOT NULL REFERENCES users(id),
    
    criteria_id TEXT,                  -- Bisa null jika overall review
    score DECIMAL(5,2),
    feedback TEXT,
    
    reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. AUDIT LOG (Untuk tracking semua aksi)
-- ============================================

CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    competition_id TEXT REFERENCES competitions(id),
    
    action TEXT NOT NULL,              -- 'create', 'update', 'delete', 'grade'
    entity_type TEXT NOT NULL,           -- 'task', 'submission', 'team', etc
    entity_id TEXT,
    
    old_values JSON,
    new_values JSON,
    ip_address TEXT,
    user_agent TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. ANNOUNCEMENTS & NOTIFICATIONS
-- ============================================

CREATE TABLE announcements (
    id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK(type IN ('general', 'urgent', 'result', 'reminder')),
    
    is_published BOOLEAN DEFAULT 0,
    published_at DATETIME,
    
    -- Target audience
    target_teams JSON,                 -- null = all, atau array team_id
    target_stages JSON,                  -- null = all, atau array stage_id
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_competition ON user_roles(competition_id);
CREATE INDEX idx_stages_competition ON stages(competition_id);
CREATE INDEX idx_tasks_stage ON tasks(stage_id);
CREATE INDEX idx_teams_competition ON teams(competition_id);
CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_submissions_team ON submissions(team_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_audit_logs_competition ON audit_logs(competition_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
```

---

## 🔐 Authentication & Authorization Flow

### JWT Token Structure

```typescript
// Access Token Payload
interface AccessTokenPayload {
  sub: string;           // user_id
  email: string;
  name: string;
  
  // Context-specific claims
  competition_id?: string;  // Aktif di kompetisi mana
  role?: string;            // Role di kompetisi tersebut
  permissions: string[];    // ["read", "write", "grade", "delete"]
  
  iat: number;
  exp: number;
}

// Refresh Token (simpan di httpOnly cookie)
interface RefreshTokenPayload {
  sub: string;           // user_id
  token_version: number; // Untuk invalidate batch
  iat: number;
  exp: number;           // Long expiry (7-30 hari)
}
```

### Auth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. POST /api/auth/login                                        │
│     { email, password }                                         │
│                                                                 │
│  2. Verify password (bcrypt)                                  │
│                                                                 │
│  3. Cek active competitions untuk user                          │
│     - Super Admin: All competitions                             │
│     - Admin/Judge: Assigned competitions only                   │
│                                                                 │
│  4. Generate Tokens                                           │
│     - Access Token (15 menit, Bearer)                           │
│     - Refresh Token (7 hari, httpOnly cookie)                   │
│                                                                 │
│  5. Return: { accessToken, user, competitions[] }               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    COMPETITION CONTEXT                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Setelah login, user pilih competition:                         │
│                                                                 │
│  POST /api/auth/context                                         │
│  { competition_id }                                             │
│                                                                 │
│  Return: New Access Token dengan claims:                        │
│  { sub, competition_id, role, permissions[] }                  │
│                                                                 │
│  Sekarang semua request admin scoped ke competition ini       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Permission Matrix

| Role | Create Task | Edit Task | Delete Task | Grade | View All Submissions | Manage Teams | Settings |
|------|-------------|-----------|-------------|-------|---------------------|--------------|----------|
| **super_admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **admin** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ⚠️ |
| **judge** | ❌ | ❌ | ❌ | ✅ | ⚠️* | ❌ | ❌ |
| **observer** | ❌ | ❌ | ❌ | ❌ | ⚠️* | ❌ | ❌ |

\* Judge: Hanya submission yang di-assign ke mereka (atau semua jika public judging)
\* Observer: Read-only, bisa filter by stage

---

## 🔌 API Endpoints Structure

### Base URL: `/api/v1/admin`

```
Authentication
├── POST   /auth/login
├── POST   /auth/logout
├── POST   /auth/refresh
├── POST   /auth/context          # Set competition context
└── GET    /auth/me               # Current user info

Competitions (Super Admin Only)
├── GET    /competitions
├── POST   /competitions
├── GET    /competitions/:id
├── PATCH  /competitions/:id
└── DELETE /competitions/:id

Dashboard (Context: competition_id dari JWT)
├── GET    /dashboard/stats       # Overview stats
├── GET    /dashboard/activities    # Recent activities
└── GET    /dashboard/timeline      # Stage progress

Stages & Tasks
├── GET    /stages                  # List semua stage
├── POST   /stages                  # Buat stage baru
├── PATCH  /stages/:id/activate     # Aktivasi stage
├── GET    /stages/:id/tasks        # Tasks di stage
├── POST   /stages/:id/tasks        # Tambah task
├── PATCH  /tasks/:id               # Edit task
├── PATCH  /tasks/:id/publish       # Publish/unpublish
└── DELETE /tasks/:id

Teams Management
├── GET    /teams                   # List teams (filter, search)
├── GET    /teams/:id               # Detail team + members
├── POST   /teams                   # Manual create (admin)
├── PATCH  /teams/:id/status        # Update status
├── DELETE /teams/:id
├── POST   /teams/:id/members       # Tambah member
└── DELETE /teams/:id/members/:userId

Submissions & Grading
├── GET    /submissions             # List submissions (filter by task, status)
├── GET    /submissions/:id         # Detail submission
├── POST   /submissions/:id/grade   # Submit grading
├── PATCH  /submissions/:id/status  # Update status (return, etc)
├── GET    /submissions/export      # Export to CSV/Excel
└── GET    /tasks/:id/submissions   # All submissions for task

Announcements
├── GET    /announcements
├── POST   /announcements
├── PATCH  /announcements/:id/publish
└── DELETE /announcements/:id

Reports
├── GET    /reports/standings       # Leaderboard/standings
├── GET    /reports/submissions     # Submission statistics
├── GET    /reports/progress        # Team progress by stage
└── GET    /reports/export          # Full export

Settings
├── GET    /settings                # Competition settings
├── PATCH  /settings                # Update settings
├── GET    /settings/judges         # List judges
├── POST   /settings/judges         # Assign judge
└── DELETE /settings/judges/:id     # Remove judge
```

---

## 🎨 Frontend Integration: API-Controllable Sections

Berikut bagian-bagian di FE yang bisa dijadikan API-driven:

### 1. Competition Sections (Semua dinamis dari API)

```typescript
// src/sections/Competition.tsx - Jadikan data-driven
interface CompetitionData {
  id: string;
  name: { id: string; en: string };
  description: { id: string; en: string };
  totalPrize: string;           // Dari config.totalPrize
  deadline: string;             // Dari registration_end
  stages: Stage[];              // Dari API /stages
  categories: Category[];       // Dari config.categories
}
```

**Bagian yang bisa dikontrol dari Dashboard:**

| Section | Current | Jadi API-Driven |
|---------|---------|-----------------|
| Hero prize text | Static dari config.ts | `competition.config.totalPrize` |
| Deadline countdown | Static | `competition.registration_end` |
| Competition categories | Static array | `competition.config.categories` |
| Stage timeline | Static | `stages[]` dari API |
| Task requirements | Static markdown | `tasks[]` dengan `description`, `rubric` |

### 2. Dynamic Content yang Bisa Diedit Admin

```typescript
// Bagian FE yang perlu API endpoint:

// 1. Hero Section
// API: GET /api/public/competitions/:id/hero
{
  title: { id: string; en: string };
  subtitle: { id: string; en: string };
  backgroundImage: string;      // URL ke R2
  prizeText: string;
  ctaButton: { text: string; link: string };
}

// 2. About Competition
// API: GET /api/public/competitions/:id/about
{
  title: { id: string; en: string };
  description: { id: string; en: string };
  videoUrl?: string;
  images: string[];             // Gallery
}

// 3. Timeline/Flow
// API: GET /api/public/competitions/:id/timeline
{
  stages: [
    {
      id: string;
      name: { id: string; en: string };
      description: { id: string; en: string };
      dateRange: string;
      status: 'upcoming' | 'active' | 'completed';
      icon: string;
      tasks: Task[];
    }
  ]
}

// 4. FAQ Section
// API: GET /api/public/competitions/:id/faqs
{
  faqs: [
    {
      question: { id: string; en: string };
      answer: { id: string; en: string };
      category: string;
      order: number;
    }
  ]
}
```

### 3. Submission Form (Dinamis berdasarkan Task)

```typescript
// Task dari API menentukan form fields
interface TaskFormConfig {
  taskId: string;
  name: string;
  description: string;
  type: 'file' | 'text' | 'link' | 'mixed';
  
  // Validasi
  maxFileSize: number;
  allowedTypes: string[];
  
  // Custom fields (untuk lomba spesifik)
  customFields: [
    {
      id: string;
      label: string;
      type: 'text' | 'textarea' | 'select' | 'number' | 'url';
      required: boolean;
      options?: string[];  // Untuk select
    }
  ];
}
```

### 4. Real-time Updates (Optional WebSocket)

```typescript
// Untuk fitur real-time di dashboard:
// - Live submission count
// - Notification saat ada submission baru
// - Live grading updates

// WebSocket events:
{
  'submission:new': { teamId, taskId, submittedAt }
  'submission:graded': { submissionId, score, gradedBy }
  'stage:activated': { stageId, activatedAt }
  'announcement:new': { announcementId, title }
}
```

---

## 📁 File Storage (R2) Structure

```
/competitions/{competition_id}/
  ├── /submissions/
  │   └── /{stage_id}/
  │       └── /{task_id}/
  │           └── /{team_id}/
  │               └── {timestamp}_{filename}
  ├── /assets/
  │   ├── hero-bg.jpg
  │   ├── logo.png
  │   └── /gallery/
  ├── /exports/
  │   └── submissions_{date}.csv
  └── /temp/
      └── {upload_session_id}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Core Setup (Week 1)
- [ ] Setup Cloudflare Workers project baru
- [ ] Setup D1 database + migrations
- [ ] Setup R2 buckets
- [ ] Auth system (JWT + bcrypt)
- [ ] Basic CRUD untuk Competitions

### Phase 2: Competition Management (Week 2)
- [ ] Stages & Tasks CRUD
- [ ] Team management
- [ ] Submission upload & storage
- [ ] Basic grading system

### Phase 3: Dashboard Features (Week 3)
- [ ] Dashboard stats API
- [ ] Filtering & search
- [ ] Export functionality
- [ ] Audit logging

### Phase 4: Frontend Integration (Week 4)
- [ ] Admin Dashboard UI
- [ ] Public API endpoints untuk FE
- [ ] Replace mock data dengan API calls
- [ ] Testing & refinement

---

## 💰 Estimasi Biaya (Cloudflare)

| Service | Usage | Estimasi/Bulan |
|---------|-------|----------------|
| **Workers** | 100k requests/hari | FREE (10M/bulan) |
| **D1** | 500k queries/hari | FREE (5M/bulan) |
| **R2** | 50GB storage, 100k reads | ~$1-2 |
| **KV** | Caching | FREE |
| **Total** | | **FREE - $2** |

---

## 🔗 Next Steps

1. **Setup Repo Backend**: `npm create cloudflare@latest admin-backend`
2. **Design UI/UX**: Buat wireframe dashboard admin
3. **Database Migration**: Jalankan schema SQL di D1
4. **API Development**: Mulai dari auth + competitions
5. **Frontend Wiring**: Hubungkan section FE ke API public

Mau gw lanjut bikin implementasi code-nya atau ada yang mau didiskusin dulu?
