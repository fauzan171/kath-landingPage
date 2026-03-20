# 📋 Backend Detailed Specification - CIBC Admin Dashboard

## Overview
- **Kompetisi**: 1 active competition (CIBC Power by KATH 2026)
- **UI**: Custom design (match existing KATH brand)
- **Notifikasi**: Real-time dengan WebSocket / polling
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Runtime**: Cloudflare Workers

---

## 📁 Project Structure

```
cibc-admin-backend/
├── src/
│   ├── index.ts                    # Entry point Worker
│   ├── config/
│   │   ├── database.ts             # D1 schema & queries
│   │   ├── constants.ts            # App constants
│   │   └── env.ts                  # Environment validation
│   ├── middleware/
│   │   ├── auth.ts                 # JWT verification
│   │   ├── cors.ts                 # CORS handling
│   │   ├── rateLimit.ts            # Rate limiting
│   │   └── errorHandler.ts         # Global error handler
│   ├── controllers/
│   │   ├── auth.controller.ts      # Login, logout, refresh
│   │   ├── competition.controller.ts
│   │   ├── stage.controller.ts
│   │   ├── task.controller.ts
│   │   ├── team.controller.ts
│   │   ├── submission.controller.ts
│   │   ├── grading.controller.ts
│   │   ├── announcement.controller.ts
│   │   ├── notification.controller.ts
│   │   └── public.controller.ts    # Public API (untuk FE landing)
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── competition.service.ts
│   │   ├── stage.service.ts
│   │   ├── task.service.ts
│   │   ├── team.service.ts
│   │   ├── submission.service.ts
│   │   ├── storage.service.ts      # R2 upload/download
│   │   ├── notification.service.ts # WebSocket/notif logic
│   │   └── audit.service.ts        # Logging
│   ├── utils/
│   │   ├── jwt.ts                  # JWT helpers
│   │   ├── password.ts             # bcrypt hashing
│   │   ├── validation.ts           # Input validators
│   │   ├── response.ts             # API response format
│   │   └── helpers.ts              # Utility functions
│   └── types/
│       ├── api.ts                  # API types
│       ├── database.ts             # DB types
│       └── index.ts
├── migrations/
│   ├── 001_initial_schema.sql      # Initial tables
│   └── 002_seed_data.sql           # Default admin, competition
├── wrangler.toml                   # Cloudflare config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema Detail

### Tabel 1: users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- UUID v4
  email TEXT UNIQUE NOT NULL,             -- admin@kathevent.com
  password_hash TEXT NOT NULL,            -- bcrypt $2a$10$...
  name TEXT NOT NULL,                     -- "Super Admin"
  phone TEXT,                             -- Optional
  avatar_url TEXT,                        -- R2 URL
  is_active BOOLEAN DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 2: user_roles
```sql
CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_id TEXT REFERENCES competitions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'judge', 'observer')),
  -- super_admin: akses semua kompetisi
  -- admin: 1 kompetisi, full CRUD
  -- judge: 1 kompetisi, grading only
  -- observer: 1 kompetisi, read only
  permissions JSON,                       -- ["read", "write", "grade", "delete"]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 3: competitions
```sql
CREATE TABLE competitions (
  id TEXT PRIMARY KEY,                    -- "comp_cibc_2026"
  code TEXT UNIQUE NOT NULL,              -- "cibc-2026" (URL friendly)
  name TEXT NOT NULL,                     -- "CIBC Power by KATH 2026"
  subtitle TEXT,                          -- "Inovasi untuk masa depan"
  description TEXT,                         -- Deskripsi panjang
  status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')),
  
  -- Timeline
  registration_start DATETIME,            -- 2025-11-01 00:00:00
  registration_end DATETIME,              -- 2025-12-31 23:59:59
  event_start DATETIME,                   -- 2026-01-15 00:00:00
  event_end DATETIME,                     -- 2026-05-17 00:00:00
  
  -- Configuration
  config JSON,                            -- {
                                          --   "totalPrize": "Rp 200 Juta",
                                          --   "maxTeamSize": 5,
                                          --   "minTeamSize": 2,
                                          --   "categories": [...]
                                          -- }
  
  -- Branding
  theme JSON,                             -- {
                                          --   "primaryColor": "#C4A35A",
                                          --   "heroImage": "r2-url",
                                          --   "logo": "r2-url"
                                          -- }
  
  -- Settings
  settings JSON,                          -- {
                                          --   "autoProgressStages": true,
                                          --   "publicLeaderboard": false,
                                          --   "blindGrading": true
                                          -- }
  
  created_by TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 4: stages
```sql
CREATE TABLE stages (
  id TEXT PRIMARY KEY,                    -- "stage_reg", "stage_bmc", etc
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                     -- "Registration", "BMC Submission"
  name_id TEXT,                           -- "Pendaftaran", "Pengumpulan BMC"
  description TEXT,                       -- Deskripsi stage
  order_index INTEGER NOT NULL,           -- 1, 2, 3, 4, 5
  
  -- Timeline
  start_date DATETIME NOT NULL,           -- Kapan stage mulai
  end_date DATETIME NOT NULL,             -- Kapan stage berakhir
  
  -- Status
  status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')),
  is_active BOOLEAN DEFAULT 0,            -- Stage yang sedang berjalan
  is_visible BOOLEAN DEFAULT 1,           -- Tampil di peserta?
  
  -- Behavior
  auto_progress BOOLEAN DEFAULT 0,      -- Auto ke stage berikutnya?
  requires_all_tasks BOOLEAN DEFAULT 1,   -- Harus selesai semua task?
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 5: tasks
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,                    -- "task_bmc_upload"
  stage_id TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,                     -- "Upload BMC"
  name_id TEXT,                           -- "Unggah BMC"
  description TEXT,                       -- HTML/markdown deskripsi
  instructions TEXT,                      -- Cara pengumpulan
  
  -- Type
  type TEXT CHECK(type IN ('file_upload', 'text_input', 'link_submit', 'quiz', 'attendance')),
  
  -- File Settings (untuk type = file_upload)
  max_file_size_mb INTEGER DEFAULT 10,    -- 10MB default
  allowed_extensions JSON,                  -- [".pdf", ".pptx", ".zip"]
  max_files INTEGER DEFAULT 1,              -- 1 file atau multiple
  
  -- Deadline
  deadline DATETIME,                        -- Bisa beda dari stage deadline
  allow_late_submission BOOLEAN DEFAULT 0,  -- Terima telat?
  late_penalty_percent INTEGER DEFAULT 0,   -- Potongan % jika telat
  
  -- Settings
  is_required BOOLEAN DEFAULT 1,          -- Wajib?
  is_published BOOLEAN DEFAULT 0,         -- Sudah publish?
  allow_edit BOOLEAN DEFAULT 1,           -- Bisa edit setelah submit?
  
  -- Grading
  rubric JSON,                            -- [{
                                          --   "id": "innovation",
                                          --   "name": "Inovasi",
                                          --   "maxScore": 25,
                                          --   "weight": 0.25
                                          -- }]
  
  -- Form Builder (custom fields)
  custom_fields JSON,                     -- [{
                                          --   "id": "project_name",
                                          --   "label": "Nama Proyek",
                                          --   "type": "text",
                                          --   "required": true,
                                          --   "placeholder": "Masukkan nama..."
                                          -- }]
  
  order_index INTEGER NOT NULL,             -- Urutan dalam stage
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 6: teams
```sql
CREATE TABLE teams (
  id TEXT PRIMARY KEY,                    -- "team_001"
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  
  -- Identity
  name TEXT NOT NULL,                       -- "Green Innovators"
  code TEXT UNIQUE,                         -- "GRN12345" (random)
  
  -- Category
  category TEXT,                            -- "startup" | "student" | "corporate"
  
  -- Status Workflow
  status TEXT CHECK(status IN (
    'draft',                                -- Belum submit form
    'pending_review',                       -- Menunggu approve admin
    'registered',                           -- Sudah approved
    'active',                               -- Sedang berkompetisi
    'disqualified',                         -- Dikeluarkan
    'withdrawn'                             -- Mundur
  )) DEFAULT 'draft',
  
  -- Registration
  registered_at DATETIME,
  registration_data JSON,                   -- Data form pendaftaran
  
  -- Stats
  total_score DECIMAL(5,2) DEFAULT 0,       -- Total nilai akhir
  rank INTEGER,                             -- Peringkat
  
  -- Metadata
  institution TEXT,                         -- Universitas/Perusahaan
  country TEXT DEFAULT 'Indonesia',
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 7: team_members
```sql
CREATE TABLE team_members (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  
  -- Could link to users table (optional)
  user_id TEXT REFERENCES users(id),
  
  -- Profile (copied from registration)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  student_id TEXT,                          -- NIM/NIS (untuk student)
  institution TEXT,                         -- Kampus/Sekolah/Perusahaan
  major TEXT,                               -- Jurusan
  position TEXT,                            -- Jabatan (CEO, etc)
  
  -- Role
  role TEXT CHECK(role IN ('leader', 'member', 'mentor')) DEFAULT 'member',
  
  -- Status
  is_active BOOLEAN DEFAULT 1,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 8: submissions
```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,                      -- "sub_001"
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  
  -- Submission Data
  submitted_by TEXT,                        -- team_member_id yang upload
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- File (untuk file_upload type)
  file_url TEXT,                            -- R2 URL
  file_name TEXT,
  file_size INTEGER,                        -- Bytes
  file_type TEXT,                           -- MIME type
  
  -- Content (untuk text_input, link_submit)
  content TEXT,                             -- JSON atau plaintext
  
  -- Custom Field Values
  field_values JSON,                        -- {"project_name": "XYZ", "description": "..."}
  
  -- Status
  status TEXT CHECK(status IN (
    'draft',                                -- Masih editing
    'submitted',                            -- Sudah submit final
    'under_review',                         -- Sedang dinilai
    'needs_revision',                       -- Perlu revisi
    'graded',                               -- Sudah dinilai
    'final'                                 -- Lock, tidak bisa edit
  )) DEFAULT 'draft',
  
  -- Grading
  total_score DECIMAL(5,2),
  graded_by TEXT REFERENCES users(id),      -- Admin/judge yang nilai
  graded_at DATETIME,
  feedback TEXT,                            -- Feedback overall
  
  -- Criteria Breakdown
  criteria_scores JSON,                     -- {"innovation": 20, "market": 18, ...}
  
  -- Late submission
  is_late BOOLEAN DEFAULT 0,
  penalty_applied INTEGER DEFAULT 0,        -- % potongan
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(task_id, team_id)                  -- 1 submission per task per team
);
```

### Tabel 9: announcements
```sql
CREATE TABLE announcements (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  created_by TEXT NOT NULL REFERENCES users(id),
  
  -- Content
  title TEXT NOT NULL,
  title_id TEXT,                            -- Judul Bahasa Indonesia
  content TEXT NOT NULL,                    -- HTML/markdown
  content_id TEXT,                          -- Konten BI
  
  -- Type
  type TEXT CHECK(type IN ('general', 'urgent', 'result', 'reminder', 'system')),
  
  -- Publishing
  is_published BOOLEAN DEFAULT 0,
  published_at DATETIME,
  scheduled_at DATETIME,                    -- Jadwal publish
  
  -- Targeting
  target_all BOOLEAN DEFAULT 1,             -- Kirim ke semua?
  target_teams JSON,                        -- ["team_001", "team_002"] atau null = all
  target_stages JSON,                       -- ["stage_bmc"] atau null = all
  target_categories JSON,                   -- ["startup", "student"]
  
  -- Engagement
  views_count INTEGER DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 10: notifications
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),          -- Untuk admin
  team_id TEXT REFERENCES teams(id),          -- Untuk peserta
  
  -- Source
  announcement_id TEXT REFERENCES announcements(id),
  related_entity_type TEXT,                   -- 'submission', 'stage', 'grading'
  related_entity_id TEXT,
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK(type IN ('info', 'success', 'warning', 'urgent')),
  
  -- Action
  action_url TEXT,                            -- Link saat diklik
  action_text TEXT,                           -- "Lihat Detail"
  
  -- Status
  is_read BOOLEAN DEFAULT 0,
  read_at DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel 11: audit_logs
```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  competition_id TEXT REFERENCES competitions(id),
  
  action TEXT NOT NULL,                       -- 'create', 'update', 'delete', 'grade', 'publish'
  entity_type TEXT NOT NULL,                  -- 'team', 'submission', 'stage', 'task'
  entity_id TEXT,
  
  old_values JSON,                            -- Sebelum perubahan
  new_values JSON,                            -- Sesudah perubahan
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints Detail

### AUTHENTICATION

#### POST /api/v1/auth/login
**Request:**
```json
{
  "email": "admin@kathevent.com",
  "password": "admin123"
}
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,                         // 15 menit
    "user": {
      "id": "user_001",
      "email": "admin@kathevent.com",
      "name": "Super Admin",
      "role": "super_admin",
      "permissions": ["read", "write", "delete", "grade"]
    },
    "competitions": [                         // Kompetisi yang diakses
      {
        "id": "comp_cibc_2026",
        "code": "cibc-2026",
        "name": "CIBC Power by KATH 2026",
        "role": "super_admin"
      }
    ]
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email atau password salah"
  }
}
```

#### POST /api/v1/auth/refresh
**Headers:** Cookie dengan refreshToken (httpOnly)

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

#### POST /api/v1/auth/logout
**Headers:** Authorization: Bearer {accessToken}

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### DASHBOARD

#### GET /api/v1/admin/dashboard/stats
**Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "success": true,
  "data": {
    "competition": {
      "id": "comp_cibc_2026",
      "name": "CIBC Power by KATH 2026",
      "status": "active",
      "daysRemaining": 45
    },
    "stats": {
      "totalTeams": 156,
      "activeTeams": 142,
      "pendingTeams": 14,
      "disqualified": 0,
      "totalSubmissions": 423,
      "pendingSubmissions": 89,
      "gradedSubmissions": 334,
      "avgScore": 78.5,
      "completionRate": 67.2
    },
    "currentStage": {
      "id": "stage_bmc",
      "name": "BMC Submission",
      "status": "active",
      "endsIn": "5 days 12 hours"
    },
    "upcomingDeadline": {
      "taskId": "task_bmc_upload",
      "taskName": "Upload BMC Document",
      "deadline": "2025-12-31T23:59:59Z",
      "teamsNotSubmitted": 23
    }
  }
}
```

#### GET /api/v1/admin/dashboard/activities
**Query:** `?limit=20&page=1`

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "act_001",
        "type": "submission",
        "description": "Team 'Green Innovators' submitted BMC document",
        "user": "Green Innovators",
        "userAvatar": null,
        "timestamp": "2025-12-20T14:30:00Z",
        "actionUrl": "/admin/submissions/sub_001"
      },
      {
        "id": "act_002",
        "type": "grading",
        "description": "Admin graded submission for team 'EcoTech'",
        "user": "John Doe (Admin)",
        "score": 85,
        "timestamp": "2025-12-20T13:15:00Z"
      },
      {
        "id": "act_003",
        "type": "stage_change",
        "description": "Stage changed to 'Semifinal Pitch'",
        "user": "System",
        "timestamp": "2025-12-20T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "hasNext": true
    }
  }
}
```

---

### COMPETITIONS

#### GET /api/v1/admin/competitions
**Query:** `?status=active&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": {
    "competitions": [
      {
        "id": "comp_cibc_2026",
        "code": "cibc-2026",
        "name": "CIBC Power by KATH 2026",
        "status": "active",
        "registrationStart": "2025-11-01T00:00:00Z",
        "registrationEnd": "2025-12-31T23:59:59Z",
        "totalTeams": 156,
        "totalPrize": "Rp 200 Juta",
        "createdAt": "2025-10-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}
```

#### POST /api/v1/admin/competitions
**Request:**
```json
{
  "code": "cibc-2026",
  "name": "CIBC Power by KATH 2026",
  "subtitle": "Inovasi untuk masa depan berkelanjutan",
  "description": "...",
  "status": "upcoming",
  "registrationStart": "2025-11-01T00:00:00Z",
  "registrationEnd": "2025-12-31T23:59:59Z",
  "eventStart": "2026-01-15T00:00:00Z",
  "eventEnd": "2026-05-17T00:00:00Z",
  "config": {
    "totalPrize": "Rp 200 Juta",
    "maxTeamSize": 5,
    "minTeamSize": 2,
    "categories": [
      { "id": "startup", "name": "Startup", "nameId": "Startup", "prize": "Rp 100 Juta" },
      { "id": "student", "name": "Student", "nameId": "Mahasiswa", "prize": "Rp 50 Juta" }
    ]
  },
  "theme": {
    "primaryColor": "#C4A35A",
    "secondaryColor": "#1A1A1A"
  }
}
```

#### GET /api/v1/admin/competitions/:id
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "comp_cibc_2026",
    "code": "cibc-2026",
    "name": "CIBC Power by KATH 2026",
    "subtitle": "Inovasi untuk masa depan berkelanjutan",
    "description": "Deskripsi lengkap...",
    "status": "active",
    "registrationStart": "2025-11-01T00:00:00Z",
    "registrationEnd": "2025-12-31T23:59:59Z",
    "eventStart": "2026-01-15T00:00:00Z",
    "eventEnd": "2026-05-17T00:00:00Z",
    "config": { ... },
    "theme": { ... },
    "settings": {
      "autoProgressStages": true,
      "publicLeaderboard": false,
      "blindGrading": true
    },
    "stats": {
      "totalTeams": 156,
      "totalSubmissions": 423,
      "avgScore": 78.5
    }
  }
}
```

#### PATCH /api/v1/admin/competitions/:id
**Request:** (partial update)
```json
{
  "name": "CIBC Power 2026 Updated",
  "status": "active",
  "config": {
    "totalPrize": "Rp 250 Juta"
  }
}
```

---

### STAGES

#### GET /api/v1/admin/stages
**Query:** `?competitionId=comp_cibc_2026`

**Response:**
```json
{
  "success": true,
  "data": {
    "stages": [
      {
        "id": "stage_reg",
        "name": "Registration",
        "nameId": "Pendaftaran",
        "description": "Daftar dan buat tim",
        "orderIndex": 1,
        "startDate": "2025-11-01T00:00:00Z",
        "endDate": "2025-12-31T23:59:59Z",
        "status": "completed",
        "isActive": false,
        "taskCount": 1,
        "completedTasks": 156
      },
      {
        "id": "stage_bmc",
        "name": "BMC Submission",
        "nameId": "Pengumpulan BMC",
        "description": "Submit Business Model Canvas",
        "orderIndex": 2,
        "startDate": "2026-01-01T00:00:00Z",
        "endDate": "2026-01-31T23:59:59Z",
        "status": "active",
        "isActive": true,
        "taskCount": 2,
        "completedTasks": 89
      }
    ]
  }
}
```

#### POST /api/v1/admin/stages
**Request:**
```json
{
  "competitionId": "comp_cibc_2026",
  "name": "Pitch Deck",
  "nameId": "Presentasi Pitch",
  "description": "Upload pitch deck dan video",
  "startDate": "2026-02-01T00:00:00Z",
  "endDate": "2026-02-28T23:59:59Z",
  "autoProgress": false,
  "requiresAllTasks": true
}
```

#### PATCH /api/v1/admin/stages/:id
**Request:**
```json
{
  "name": "Pitch Deck Updated",
  "startDate": "2026-02-05T00:00:00Z",
  "isVisible": true
}
```

#### POST /api/v1/admin/stages/:id/activate
**Response:**
```json
{
  "success": true,
  "message": "Stage activated successfully",
  "data": {
    "previousActiveStage": "stage_bmc",
    "newActiveStage": "stage_pitch"
  }
}
```

#### DELETE /api/v1/admin/stages/:id
**Notes:** Hanya bisa delete kalau belum ada submission

---

### TASKS

#### GET /api/v1/admin/tasks
**Query:** `?stageId=stage_bmc&isPublished=true`

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_bmc_upload",
        "stageId": "stage_bmc",
        "stageName": "BMC Submission",
        "name": "Upload BMC Document",
        "nameId": "Unggah Dokumen BMC",
        "description": "Upload BMC dalam format PDF",
        "type": "file_upload",
        "maxFileSizeMb": 10,
        "allowedExtensions": [".pdf"],
        "deadline": "2026-01-31T23:59:59Z",
        "isRequired": true,
        "isPublished": true,
        "submissionCount": 142,
        "gradedCount": 89
      }
    ]
  }
}
```

#### POST /api/v1/admin/stages/:stageId/tasks
**Request:**
```json
{
  "name": "Project Description",
  "nameId": "Deskripsi Proyek",
  "description": "Jelaskan proyek Anda dalam 500 kata",
  "type": "text_input",
  "deadline": "2026-01-31T23:59:59Z",
  "isRequired": true,
  "customFields": [
    {
      "id": "project_name",
      "label": "Nama Proyek",
      "labelId": "Project Name",
      "type": "text",
      "required": true,
      "placeholder": "Masukkan nama proyek"
    },
    {
      "id": "problem_statement",
      "label": "Problem Statement",
      "labelId": "Pernyataan Masalah",
      "type": "textarea",
      "required": true,
      "minLength": 100,
      "maxLength": 2000
    }
  ],
  "rubric": [
    {
      "id": "clarity",
      "name": "Kejelasan",
      "nameId": "Clarity",
      "description": "Seberapa jelas problem dijelaskan",
      "maxScore": 25,
      "weight": 0.25
    }
  ]
}
```

#### POST /api/v1/admin/tasks/:id/publish
#### POST /api/v1/admin/tasks/:id/unpublish

---

### TEAMS

#### GET /api/v1/admin/teams
**Query:** `?status=active&category=startup&search=green&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "team_001",
        "name": "Green Innovators",
        "code": "GRN12345",
        "category": "startup",
        "status": "active",
        "institution": "Universitas Indonesia",
        "memberCount": 4,
        "totalScore": 87.5,
        "rank": 3,
        "registeredAt": "2025-11-15T10:30:00Z",
        "progress": 67
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

#### GET /api/v1/admin/teams/:id
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team_001",
    "name": "Green Innovators",
    "code": "GRN12345",
    "category": "startup",
    "status": "active",
    "institution": "Universitas Indonesia",
    "country": "Indonesia",
    "registeredAt": "2025-11-15T10:30:00Z",
    "registrationData": {
      "howDidYouHear": "Instagram",
      "previousExperience": "Yes"
    },
    "members": [
      {
        "id": "mem_001",
        "fullName": "Ahmad Rizki",
        "email": "ahmad@example.com",
        "phone": "+6281234567890",
        "studentId": "1901234567",
        "institution": "Universitas Indonesia",
        "major": "Computer Science",
        "role": "leader",
        "isActive": true
      }
    ],
    "submissions": [
      {
        "taskId": "task_bmc_upload",
        "taskName": "Upload BMC",
        "status": "graded",
        "score": 85,
        "submittedAt": "2026-01-20T14:30:00Z"
      }
    ],
    "totalScore": 87.5,
    "rank": 3
  }
}
```

#### PATCH /api/v1/admin/teams/:id/status
**Request:**
```json
{
  "status": "disqualified",
  "reason": "Plagiarism detected in submission"
}
```

#### POST /api/v1/admin/teams/:id/members
**Request:**
```json
{
  "fullName": "New Member",
  "email": "new@example.com",
  "phone": "+628...",
  "role": "member",
  "institution": "Universitas Indonesia"
}
```

---

### SUBMISSIONS

#### GET /api/v1/admin/submissions
**Query:** `?taskId=task_bmc&status=submitted&search=green&page=1`

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "sub_001",
        "taskId": "task_bmc_upload",
        "taskName": "Upload BMC",
        "teamId": "team_001",
        "teamName": "Green Innovators",
        "teamInstitution": "Universitas Indonesia",
        "status": "submitted",
        "submittedAt": "2026-01-20T14:30:00Z",
        "isLate": false,
        "fileName": "GreenInnovators_BMC.pdf",
        "fileSize": 2048576,
        "graded": false
      }
    ],
    "stats": {
      "total": 142,
      "draft": 14,
      "submitted": 89,
      "graded": 53
    }
  }
}
```

#### GET /api/v1/admin/submissions/:id
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sub_001",
    "task": {
      "id": "task_bmc_upload",
      "name": "Upload BMC",
      "rubric": [...]
    },
    "team": {
      "id": "team_001",
      "name": "Green Innovators",
      "members": [...]
    },
    "status": "submitted",
    "submittedAt": "2026-01-20T14:30:00Z",
    "isLate": false,
    "fileUrl": "https://r2.kathevent.com/...",
    "fileName": "GreenInnovators_BMC.pdf",
    "fileSize": 2048576,
    "fieldValues": {
      "project_name": "PlasticCycle",
      "problem_statement": "..."
    },
    "totalScore": null,
    "criteriaScores": null,
    "feedback": null
  }
}
```

#### POST /api/v1/admin/submissions/:id/grade
**Request:**
```json
{
  "criteriaScores": {
    "innovation": 20,
    "market": 18,
    "business_model": 22,
    "sustainability": 14,
    "team": 9
  },
  "totalScore": 83,
  "feedback": "Great innovation! Market analysis could be deeper.",
  "status": "graded"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Submission graded successfully",
  "data": {
    "submissionId": "sub_001",
    "totalScore": 83,
    "gradedAt": "2026-01-21T10:15:00Z",
    "gradedBy": "admin_user"
  }
}
```

#### GET /api/v1/admin/submissions/export
**Query:** `?taskId=task_bmc&format=csv`

**Response:** File download (CSV/Excel)

---

### GRADING & REPORTS

#### GET /api/v1/admin/reports/standings
**Response:**
```json
{
  "success": true,
  "data": {
    "standings": [
      {
        "rank": 1,
        "teamId": "team_042",
        "teamName": "EcoTech Solutions",
        "institution": "ITB",
        "category": "startup",
        "totalScore": 94.5,
        "stageScores": {
          "stage_bmc": 92,
          "stage_pitch": 96
        },
        "lastSubmissionAt": "2026-01-25T09:00:00Z"
      },
      {
        "rank": 2,
        "teamId": "team_001",
        "teamName": "Green Innovators",
        "institution": "Universitas Indonesia",
        "category": "startup",
        "totalScore": 87.5,
        "stageScores": {
          "stage_bmc": 85,
          "stage_pitch": 90
        }
      }
    ],
    "generatedAt": "2026-01-26T00:00:00Z"
  }
}
```

#### GET /api/v1/admin/reports/progress
**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "teamId": "team_001",
        "teamName": "Green Innovators",
        "progress": {
          "stage_reg": { "completed": true, "tasksDone": 1, "tasksTotal": 1 },
          "stage_bmc": { "completed": true, "tasksDone": 2, "tasksTotal": 2 },
          "stage_pitch": { "completed": false, "tasksDone": 0, "tasksTotal": 2 }
        },
        "overallProgress": 60
      }
    ]
  }
}
```

---

### ANNOUNCEMENTS

#### GET /api/v1/admin/announcements
**Response:**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "ann_001",
        "title": "Deadline Extended",
        "titleId": "Deadline Diperpanjang",
        "type": "urgent",
        "isPublished": true,
        "publishedAt": "2026-01-15T10:00:00Z",
        "targetAll": true,
        "viewsCount": 142
      }
    ]
  }
}
```

#### POST /api/v1/admin/announcements
**Request:**
```json
{
  "title": "Semifinalist Announcement",
  "titleId": "Pengumuman Semifinalis",
  "content": "<p>Congratulations to all semifinalists...</p>",
  "contentId": "<p>Selamat kepada semifinalis...</p>",
  "type": "result",
  "targetAll": false,
  "targetStages": ["stage_bmc"],
  "scheduledAt": null
}
```

---

### NOTIFICATIONS (Real-time)

#### GET /api/v1/admin/notifications
**Query:** `?unreadOnly=true&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_001",
        "title": "New Submission",
        "message": "Team 'Green Innovators' just submitted BMC document",
        "type": "info",
        "isRead": false,
        "actionUrl": "/admin/submissions/sub_123",
        "createdAt": "2026-01-20T14:30:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

#### POST /api/v1/admin/notifications/:id/read
Mark as read

#### POST /api/v1/admin/notifications/read-all
Mark all as read

#### WebSocket Endpoint
```
WS /api/v1/ws/notifications

Events:
- "new_submission": { teamId, teamName, taskId, submittedAt }
- "grading_completed": { submissionId, teamId, score }
- "stage_activated": { stageId, stageName }
- "announcement_published": { announcementId, title }
```

---

### PUBLIC API (Untuk Landing Page FE)

#### GET /api/v1/public/competitions/:code
**No Auth Required**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "comp_cibc_2026",
    "code": "cibc-2026",
    "name": "CIBC Power by KATH 2026",
    "subtitle": "Inovasi untuk masa depan berkelanjutan",
    "description": "...",
    "status": "active",
    "registrationStart": "2025-11-01T00:00:00Z",
    "registrationEnd": "2025-12-31T23:59:59Z",
    "config": {
      "totalPrize": "Rp 200 Juta",
      "categories": [...]
    },
    "theme": {
      "primaryColor": "#C4A35A",
      "heroImage": "https://r2.../hero.jpg"
    }
  }
}
```

#### GET /api/v1/public/competitions/:code/timeline
**Response:**
```json
{
  "success": true,
  "data": {
    "currentStage": {
      "id": "stage_bmc",
      "name": "BMC Submission",
      "nameId": "Pengumpulan BMC",
      "status": "active",
      "endsIn": "12 days 5 hours"
    },
    "stages": [
      {
        "id": "stage_reg",
        "name": "Registration",
        "nameId": "Pendaftaran",
        "description": "...",
        "status": "completed",
        "startDate": "2025-11-01T00:00:00Z",
        "endDate": "2025-12-31T23:59:59Z",
        "isActive": false
      },
      {
        "id": "stage_bmc",
        "name": "BMC Submission",
        "nameId": "Pengumpulan BMC",
        "description": "...",
        "status": "active",
        "startDate": "2026-01-01T00:00:00Z",
        "endDate": "2026-01-31T23:59:59Z",
        "isActive": true,
        "tasks": [
          { "id": "task_bmc", "name": "Upload BMC", "deadline": "2026-01-31T23:59:59Z" }
        ]
      }
    ]
  }
}
```

---

## 🔐 Authentication & Security

### JWT Token Structure
```typescript
// Access Token (15 menit)
interface AccessTokenPayload {
  sub: string;           // user_id
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'judge' | 'observer';
  permissions: string[];
  competitionId?: string;
  iat: number;
  exp: number;         // 15 menit dari iat
}

// Refresh Token (7 hari, httpOnly cookie)
interface RefreshTokenPayload {
  sub: string;         // user_id
  tokenVersion: number;
  iat: number;
  exp: number;         // 7 hari
}
```

### Permission Middleware
```typescript
const PERMISSIONS = {
  'super_admin': ['read', 'write', 'delete', 'grade', 'manage_users'],
  'admin': ['read', 'write', 'grade', 'manage_teams'],
  'judge': ['read', 'grade'],
  'observer': ['read']
};
```

---

## 💾 Storage (R2) Structure

```
cibc-2026/
├── submissions/
│   ├── task_bmc/
│   │   ├── team_001/
│   │   │   └── 20260120_143000_GreenInnovators_BMC.pdf
│   │   └── team_002/
│   │       └── 20260121_101500_EcoTech_BMC.pdf
│   └── task_pitch/
│       └── ...
├── assets/
│   ├── hero-bg.jpg
│   ├── logo.png
│   └── brochure.pdf
└── exports/
    ├── submissions_2026-01-26.csv
    └── standings_2026-01-26.xlsx
```

---

## 📊 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/auth/login` | 5 requests / minute |
| `/auth/refresh` | 10 requests / minute |
| API General | 100 requests / minute |
| File Upload | 10 uploads / minute |

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Create Cloudflare account
- [ ] Create D1 database
- [ ] Run migrations
- [ ] Create R2 bucket
- [ ] Set environment variables (JWT_SECRET, etc)
- [ ] Create default admin user
- [ ] Seed competition data

### Deployment
- [ ] Install wrangler CLI
- [ ] Configure wrangler.toml
- [ ] Deploy Worker
- [ ] Test all endpoints
- [ ] Configure custom domain

### Post-deployment
- [ ] Setup monitoring
- [ ] Configure alerts
- [ ] Test backup/restore

---

## ❓ Pertanyaan untuk Konsul

1. **Password Default Admin**: Mau set password default apa untuk admin pertama?

2. **JWT Secret**: Mau generate random atau ada preferensi?

3. **Notification Channel**: 
   - A. WebSocket real-time
   - B. Server-Sent Events (SSE)
   - C. Polling saja
   - D. Kombinasi (WebSocket + fallback polling)

4. **File Upload**: Max file size? (default gw set 10MB)

5. **Grading**: 
   - Blind grading (juri gak tau tim mana)?
   - Public leaderboard (peserta bisa lihat ranking)?

6. **Multi-language**: Dashboard cukup Bahasa Indonesia atau bilingual juga?

7. **Email Notification**: Butuh kirim email juga atau notifikasi in-app saja?

---

Siap buat dikonsul! 🎯
