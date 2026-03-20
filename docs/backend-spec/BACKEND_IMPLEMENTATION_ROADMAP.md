# 🗺️ Backend Implementation Roadmap - CIBC Admin Dashboard

**Dokumen ini** berisi detail lengkap semua fitur yang akan dibuat di backend, untuk referensi saat implementasi.

---

## 📌 PROJECT OVERVIEW

| Property | Value |
|----------|-------|
| **Nama** | CIBC Admin Dashboard Backend |
| **Stack** | Cloudflare Workers + D1 (SQLite) + R2 |
| **Language** | TypeScript |
| **Auth** | JWT (Access 15min, Refresh 7days) |
| **Real-time** | WebSocket + Polling Fallback |
| **Kompetisi** | 1 Active (CIBC Power by KATH 2026) |

---

## 🗓️ PHASE IMPLEMENTATION

### PHASE 1: FOUNDATION (Week 1)
**Goal:** Setup project, database, auth system

#### Day 1-2: Project Setup
- [ ] Inisialisasi Cloudflare Workers project
- [ ] Setup TypeScript, ESLint, Prettier
- [ ] Konfigurasi `wrangler.toml`
- [ ] Setup D1 database lokal
- [ ] Setup folder structure (controllers, services, middleware, utils, types)

#### Day 3-4: Database & Migrations
- [ ] Create migration: `001_initial_schema.sql`
  - Tabel: users, user_roles, competitions, stages, tasks, teams, team_members, submissions, announcements, notifications, audit_logs
- [ ] Create migration: `002_seed_data.sql`
  - Default admin user
  - CIBC 2026 competition skeleton
- [ ] Buat database service layer (D1 query helpers)

#### Day 5-7: Authentication System
- [ ] **POST /api/v1/auth/login**
  - Verify email/password (bcrypt)
  - Generate access token (15 min, JWT)
  - Generate refresh token (7 days, httpOnly cookie)
  - Return user data + available competitions
  
- [ ] **POST /api/v1/auth/refresh**
  - Verify refresh token from cookie
  - Generate new access token
  - Return new access token
  
- [ ] **POST /api/v1/auth/logout**
  - Clear refresh cookie
  - Invalidate token (blacklist optional)
  
- [ ] **GET /api/v1/auth/me**
  - Return current user profile
  - Include role & permissions

- [ ] **JWT Middleware**
  - Verify access token dari Authorization header
  - Extract user_id, role, permissions
  - Attach ke request context
  
- [ ] **Role Permission Middleware**
  - Check permission untuk setiap endpoint
  - super_admin: all access
  - admin: read/write/grade (no delete competition)
  - judge: read + grade only
  - observer: read only

---

### PHASE 2: COMPETITION & STAGE MANAGEMENT (Week 2)
**Goal:** CRUD kompetisi, manage flow kompetisi

#### Competition Module
- [ ] **GET /api/v1/admin/competitions**
  - List semua kompetisi
  - Filter: status (draft/upcoming/active/completed)
  - Pagination: page, limit
  - Return: id, code, name, status, registration dates, team count

- [ ] **POST /api/v1/admin/competitions**
  - Create kompetisi baru
  - Body: code, name, description, dates, config (JSON), theme (JSON)
  - Auto-create default admin role
  - Return: created competition object

- [ ] **GET /api/v1/admin/competitions/:id**
  - Detail kompetisi lengkap
  - Include: stats (total teams, submissions, avg score)
  - Include: current active stage
  - Return: full competition object

- [ ] **PATCH /api/v1/admin/competitions/:id**
  - Partial update kompetisi
  - Bisa update: name, description, status, dates, config, theme
  - Audit log: simpan old vs new values

- [ ] **DELETE /api/v1/admin/competitions/:id**
  - Soft delete (atau hard delete kalau belum ada teams)
  - Cek: kalau sudah ada submissions, tidak bisa delete
  - Require: super_admin permission

#### Stage Module
- [ ] **GET /api/v1/admin/stages**
  - Query: competitionId (required)
  - Return: array stages dengan order by order_index
  - Include: task count per stage, active status

- [ ] **POST /api/v1/admin/stages**
  - Create stage baru
  - Body: competitionId, name, nameId, description, order_index, startDate, endDate
  - Auto-set status: upcoming (kalau startDate > now)
  - Return: created stage

- [ ] **PATCH /api/v1/admin/stages/:id**
  - Update stage properties
  - Bisa update: name, dates, description, order_index
  - Kalau update order_index, reorder stages lain

- [ ] **DELETE /api/v1/admin/stages/:id**
  - Hanya bisa delete kalau belum ada tasks
  - Kalau sudah ada tasks, require force=true (delete cascade)

- [ ] **POST /api/v1/admin/stages/:id/activate**
  - Set stage jadi active
  - Deactivate stage sebelumnya (kalau ada)
  - Update status: active untuk stage ini, completed untuk sebelumnya
  - Broadcast WebSocket: stage_activated event
  - Create notification untuk semua teams

- [ ] **POST /api/v1/admin/stages/:id/deactivate**
  - Set stage jadi inactive
  - Update status ke completed atau draft

- [ ] **POST /api/v1/admin/stages/reorder**
  - Body: array stageIds dalam urutan baru
  - Update order_index untuk semua stages
  - Return: updated stages

---

### PHASE 3: TASK & SUBMISSION MANAGEMENT (Week 3)
**Goal:** Manage submission requirements, file uploads

#### Task Module
- [ ] **GET /api/v1/admin/tasks**
  - Query: stageId, competitionId, isPublished
  - Return: array tasks dengan deadline, submission count
  - Include: stage info (name, status)

- [ ] **POST /api/v1/admin/stages/:stageId/tasks**
  - Create task baru
  - Body:
    - name, nameId, description, instructions
    - type: file_upload | text_input | link_submit | quiz
    - maxFileSizeMb, allowedExtensions, maxFiles
    - deadline, isRequired, isPublished
    - customFields (array form fields)
    - rubric (array grading criteria)
  - Return: created task

- [ ] **GET /api/v1/admin/tasks/:id**
  - Detail task lengkap
  - Include: rubric details, custom fields
  - Include: submission stats (total, graded, pending)

- [ ] **PATCH /api/v1/admin/tasks/:id**
  - Partial update task
  - Bisa update semua field kecuali type (type locked setelah create)
  - Kalau update deadline, cek submissions yang sudah late

- [ ] **DELETE /api/v1/admin/tasks/:id**
  - Hanya bisa delete kalau belum ada submissions
  - Kalau sudah ada, soft delete (mark as deleted)

- [ ] **POST /api/v1/admin/tasks/:id/publish**
  - Set isPublished = true
  - Stage harus visible juga
  - Create notification untuk teams di stage ini

- [ ] **POST /api/v1/admin/tasks/:id/unpublish**
  - Set isPublished = false
  - Kalau sudah ada submissions, warning tapi tetap bisa

#### File Upload Service
- [ ] **POST /api/v1/admin/upload/presigned**
  - Generate presigned URL untuk upload ke R2
  - Body: filename, fileSize, contentType, taskId
  - Validate: file size limit, allowed extensions
  - Return: presigned URL, uploadId, finalUrl

- [ ] **POST /api/v1/admin/upload/complete**
  - Confirm upload complete
  - Body: uploadId, taskId, teamId
  - Validate file exists di R2
  - Create submission record (status: draft)

- [ ] **R2 Webhook Handler**
  - Handle upload complete events
  - Validate file size, type
  - Move file dari temp ke final location

---

### PHASE 4: TEAM & PARTICIPANT MANAGEMENT (Week 4)
**Goal:** Manage peserta, approvals, monitoring

#### Team Module
- [ ] **GET /api/v1/admin/teams**
  - Query params:
    - competitionId (required context)
    - status (draft/pending/registered/active/disqualified)
    - category (startup/student/corporate)
    - search (team name, institution)
    - page, limit
  - Return: array teams dengan member count, score, progress
  - Pagination: total, page, limit, totalPages

- [ ] **GET /api/v1/admin/teams/:id**
  - Detail team lengkap
  - Include: members (array), submissions (array), registration data
  - Include: activity log (recent actions)
  - Return: full team object

- [ ] **POST /api/v1/admin/teams**
  - Manual create team oleh admin
  - Body: name, category, institution, members (array)
  - Auto-generate team code
  - Set status: registered (skip pending review)
  - Return: created team

- [ ] **PATCH /api/v1/admin/teams/:id**
  - Update team info
  - Bisa update: name, category, institution
  - Tidak bisa update code (immutable)

- [ ] **PATCH /api/v1/admin/teams/:id/status**
  - Update team status
  - Body: status, reason (kalau disqualify/reject)
  - Status flow:
    - draft → pending (submit registration)
    - pending → registered (admin approve)
    - pending → rejected (admin reject)
    - registered → active (start participating)
    - active → disqualified (violation)
    - any → withdrawn (mundur)
  - Send notification ke team leader
  - Audit log: record status change dengan reason

- [ ] **DELETE /api/v1/admin/teams/:id**
  - Soft delete (mark as deleted)
  - Cascade: delete members, submissions (atau archive)

#### Team Member Module
- [ ] **POST /api/v1/admin/teams/:teamId/members**
  - Add member ke team
  - Body: fullName, email, phone, role (leader/member/mentor), institution
  - Validate: tidak melebihi max team size
  - Cek: email unique dalam competition
  - Return: created member

- [ ] **PATCH /api/v1/admin/teams/:teamId/members/:memberId**
  - Update member info
  - Bisa update role (promote/demote leader)
  - Cek: minimal 1 leader dalam team

- [ ] **DELETE /api/v1/admin/teams/:teamId/members/:memberId**
  - Remove member dari team
  - Cek: tidak bisa remove leader tanpa assign leader baru
  - Soft delete (mark inactive)

---

### PHASE 5: SUBMISSION & GRADING SYSTEM (Week 5)
**Goal:** Handle submissions, grading workflow, leaderboard

#### Submission Module
- [ ] **GET /api/v1/admin/submissions**
  - Query params:
    - taskId (filter per task)
    - teamId (filter per team)
    - status (draft/submitted/under_review/graded)
    - stageId (filter per stage)
    - isLate (true/false)
    - search (team name)
    - page, limit
  - Return: array submissions dengan team info, task info
  - Include: file metadata (size, type), submittedAt

- [ ] **GET /api/v1/admin/submissions/:id**
  - Detail submission lengkap
  - Include: task details, rubric, team details
  - Include: file download URL (presigned, expire 1 jam)
  - Include: field values (jika ada custom fields)
  - Return: full submission object

- [ ] **GET /api/v1/admin/submissions/:id/download**
  - Generate download URL untuk file submission
  - Return: presigned URL (valid 1 jam)

- [ ] **PATCH /api/v1/admin/submissions/:id/status**
  - Update submission status
  - Body: status, feedback (kalau return for revision)
  - Status: submitted → under_review → needs_revision → submitted → graded
  - Send notification ke team

- [ ] **POST /api/v1/admin/submissions/:id/grade**
  - Submit grading
  - Body:
    - criteriaScores: { criteriaId: score, ... }
    - totalScore: number (auto-calculate dari criteria)
    - feedback: string
    - status: "graded" atau "needs_revision"
  - Validate: semua criteria diisi
  - Update: total_score, criteria_scores, feedback, graded_by, graded_at
  - Update team total score (recalculate)
  - Update submission status: "graded"
  - Send notification ke team (score published)
  - Audit log: record grading

- [ ] **POST /api/v1/admin/submissions/:id/ungrade**
  - Reset grading (kalau salah input)
  - Hapus: total_score, criteria_scores, feedback, graded_by
  - Update status: "submitted" atau "under_review"
  - Recalculate team total score
  - Require: admin permission (judge tidak bisa ungrade)

- [ ] **GET /api/v1/admin/submissions/export**
  - Query: taskId, format (csv/excel)
  - Generate file export
  - Columns: team_name, institution, category, submitted_at, is_late, scores, total
  - Return: download URL atau stream file

#### Grading Criteria Module
- [ ] **GET /api/v1/admin/tasks/:taskId/rubric**
  - Get rubric/criteria untuk task
  - Return: array criteria (id, name, description, maxScore, weight)

- [ ] **PUT /api/v1/admin/tasks/:taskId/rubric**
  - Update rubric (full replacement)
  - Body: array criteria
  - Validate: total weight = 100%
  - Kalau sudah ada grading, warning tapi tetap bisa update

#### Reports & Leaderboard
- [ ] **GET /api/v1/admin/reports/standings**
  - Query: stageId (filter per stage), category
  - Return: array teams sorted by totalScore desc
  - Include: rank, team info, stage breakdown scores
  - Cek: publicLeaderboard setting (kalau false, require admin auth)

- [ ] **GET /api/v1/admin/reports/progress**
  - Query: teamId (optional, kalau tidak ada = all teams)
  - Return: progress per team per stage
  - Format: { teamId, teamName, stages: [{ stageId, completedTasks, totalTasks, percentage }] }

- [ ] **GET /api/v1/admin/reports/statistics**
  - Dashboard stats endpoint
  - Return:
    - totalTeams, activeTeams, pendingTeams
    - totalSubmissions, pendingSubmissions, gradedSubmissions
    - avgScore, completionRate
    - currentStage info
    - upcoming deadline

---

### PHASE 6: ANNOUNCEMENTS & NOTIFICATIONS (Week 6)
**Goal:** Communication system, real-time notifications

#### Announcement Module
- [ ] **GET /api/v1/admin/announcements**
  - Query: isPublished, type, page, limit
  - Return: array announcements
  - Include: views count, target info

- [ ] **POST /api/v1/admin/announcements**
  - Create announcement
  - Body:
    - title, titleId (bilingual)
    - content, contentId (bilingual, HTML/markdown)
    - type: general/urgent/result/reminder/system
    - targetAll: boolean
    - targetTeams: array teamIds (kalau targetAll=false)
    - targetStages: array stageIds
    - targetCategories: array categories
    - scheduledAt: datetime (null = publish now)
  - Kalau scheduledAt null, auto-publish
  - Return: created announcement

- [ ] **GET /api/v1/admin/announcements/:id**
  - Detail announcement
  - Include: view stats (read count, read by teams)

- [ ] **PATCH /api/v1/admin/announcements/:id**
  - Update announcement (hanya kalau belum published atau force update)
  - Body: partial update

- [ ] **POST /api/v1/admin/announcements/:id/publish**
  - Publish announcement
  - Set isPublished=true, publishedAt=now
  - Create notifications untuk target audiences
  - Broadcast WebSocket: announcement_published event

- [ ] **POST /api/v1/admin/announcements/:id/unpublish**
  - Unpublish (hide dari public)
  - Set isPublished=false

- [ ] **DELETE /api/v1/admin/announcements/:id**
  - Soft delete

#### Notification Module
- [ ] **GET /api/v1/admin/notifications**
  - Return: notifications untuk current user
  - Query: unreadOnly, limit
  - Include: related entity info (announcement, submission, etc)

- [ ] **POST /api/v1/admin/notifications/:id/read**
  - Mark single notification as read

- [ ] **POST /api/v1/admin/notifications/read-all**
  - Mark all notifications as read

- [ ] **GET /api/v1/admin/notifications/unread-count**
  - Return: { count: number }

#### WebSocket Real-time
- [ ] **WS /api/v1/ws/notifications**
  - Connection handler untuk WebSocket
  - Authenticate dengan JWT (query param atau header)
  - Subscribe user ke channel: `user:{userId}`
  - Subscribe ke channel: `competition:{competitionId}` (admin/judge)

- [ ] **Events to Broadcast:**
  - `new_submission`: { submissionId, teamId, teamName, taskId, taskName, submittedAt }
  - `submission_graded`: { submissionId, teamId, score, gradedBy }
  - `stage_activated`: { stageId, stageName, activatedAt }
  - `announcement_published`: { announcementId, title, type }
  - `team_status_changed`: { teamId, teamName, oldStatus, newStatus }

- [ ] **WebSocket Service:**
  - Durable Object atau KV-based pub/sub
  - Store connections
  - Broadcast ke relevant channels
  - Heartbeat/ping-pong

---

### PHASE 7: PUBLIC API (For Landing Page) (Week 7)
**Goal:** API untuk FE landing page (tanpa auth)

- [ ] **GET /api/v1/public/competitions/:code**
  - Return: competition public info
  - Include: name, description, dates, config (prize, categories), theme
  - Hide: internal settings, team counts (kalau private)

- [ ] **GET /api/v1/public/competitions/:code/timeline**
  - Return: stages array (hanya visible stages)
  - Include: tasks (hanya published tasks)
  - Include: current active stage
  - Hide: internal fields, submission counts

- [ ] **GET /api/v1/public/competitions/:code/faqs**
  - Return: FAQ array (bilingual)
  - Caching: 1 hour

- [ ] **GET /api/v1/public/competitions/:code/announcements**
  - Return: published announcements (hanya public)
  - Pagination: page, limit
  - Caching: 5 minutes

---

### PHASE 8: AUDIT & SYSTEM (Week 8)
**Goal:** Logging, monitoring, utilities

#### Audit Log Module
- [ ] **Middleware: Audit Logger**
  - Log semua write operations (POST, PUT, PATCH, DELETE)
  - Simpan: userId, action, entityType, entityId, oldValues, newValues, timestamp, IP, userAgent
  - Async: tidak blocking response

- [ ] **GET /api/v1/admin/audit-logs**
  - Query: entityType, entityId, userId, dateFrom, dateTo, page, limit
  - Require: super_admin permission
  - Return: array audit logs

#### System Utilities
- [ ] **GET /api/v1/admin/health**
  - Health check endpoint
  - Check: D1 connection, R2 connection, WebSocket status
  - Return: { status: "healthy" | "degraded", checks: {...} }

- [ ] **Middleware: Rate Limiting**
  - /auth/*: 5 req/minute
  - /api/*: 100 req/minute
  - /upload: 10 req/minute
  - Storage: KV atau D1

- [ ] **Middleware: Error Handler**
  - Catch all errors
  - Format error response: { success: false, error: { code, message, details } }
  - Log error untuk monitoring

---

## 📊 DATA FLOW DIAGRAM

### 1. Team Registration Flow
```
User (FE)                    Backend                    Database
   |                            |                           |
   |  POST /teams (register)    |                           |
   | -------------------------->|                           |
   |                            |  INSERT teams (status:    |
   |                            |  pending_review)          |
   |                            | ------------------------->|
   |                            |                           |
   |  { teamId, status }        |                           |
   | <--------------------------|                           |
   |                            |                           |
   |                            |  WebSocket Broadcast      |
   |                            |  "new_team_pending"       |
   |                            | ------------------------->|
   |                            |                           |
   |                            |  CREATE notification      |
   |                            |  untuk admin              |
   |                            | ------------------------->|

Admin Dashboard
   |
   |  GET /admin/teams?status=pending
   |  (lihat list team pending)
   |
   |  PATCH /teams/:id/status
   |  { status: "registered" }
   |
   |  (Backend: update DB,
   |   send notif ke team)
```

### 2. Submission & Grading Flow
```
Team (FE)
   |
   |  POST /upload (file)
   |  atau POST /submissions (text)
   |
   v
Backend
   |
   |  1. Validate file size, type
   |  2. Upload ke R2
   |  3. INSERT submissions (status: draft/submitted)
   |  4. WebSocket: "new_submission"
   |  5. Notification ke admin/judge
   |
   v
Admin/Judge (Dashboard)
   |
   |  GET /admin/submissions
   |  (real-time update via WS)
   |
   |  POST /submissions/:id/grade
   |  { criteriaScores, feedback }
   |
   v
Backend
   |
   |  1. UPDATE submissions (status: graded)
   |  2. UPDATE teams (total_score)
   |  3. Recalculate rankings
   |  4. WebSocket: "submission_graded"
   |  5. Notification ke team
```

### 3. Stage Activation Flow
```
Admin
   |
   |  POST /stages/:id/activate
   |
   v
Backend
   |
   |  1. UPDATE stages (isActive=true)
   |     untuk stage baru
   |  2. UPDATE stages (isActive=false,
   |     status=completed) untuk stage lama
   |  3. WebSocket: "stage_activated"
   |  4. CREATE notifications
   |     untuk semua teams
   |  5. (Opsional) Send email blast
```

---

## 🔧 UTILITIES & HELPERS

### 1. JWT Utilities
```typescript
// utils/jwt.ts

export function generateAccessToken(payload: AccessTokenPayload): string;
export function generateRefreshToken(userId: string): string;
export function verifyAccessToken(token: string): AccessTokenPayload;
export function verifyRefreshToken(token: string): RefreshTokenPayload;
```

### 2. Password Utilities
```typescript
// utils/password.ts

export async function hashPassword(password: string): Promise<string>;
export async function verifyPassword(password: string, hash: string): Promise<boolean>;
```

### 3. Validation Utilities
```typescript
// utils/validation.ts

export function validateEmail(email: string): boolean;
export function validatePassword(password: string): { valid: boolean, errors: string[] };
export function validateUUID(id: string): boolean;
export function validateDateRange(start: Date, end: Date): boolean;
```

### 4. Response Utilities
```typescript
// utils/response.ts

export function successResponse<T>(data: T, meta?: PaginationMeta): Response;
export function errorResponse(code: string, message: string, details?: any, status?: number): Response;
export function paginatedResponse<T>(items: T[], total: number, page: number, limit: number): Response;
```

### 5. Storage Utilities
```typescript
// utils/storage.ts

export async function generatePresignedUploadUrl(
  filename: string,
  contentType: string,
  size: number,
  bucket: R2Bucket
): Promise<{ url: string, key: string }>;

export async function getDownloadUrl(key: string, bucket: R2Bucket, expireMinutes?: number): Promise<string>;
export async function deleteFile(key: string, bucket: R2Bucket): Promise<void>;
```

---

## 🧪 TESTING CHECKLIST

### Unit Tests (Optional but recommended)
- [ ] Auth service tests
- [ ] Password hashing/verification
- [ ] JWT generation/verification
- [ ] Validation functions
- [ ] Score calculation

### Integration Tests
- [ ] Full auth flow (login → access protected → refresh → logout)
- [ ] Competition CRUD
- [ ] Stage activation flow
- [ ] Task create + publish
- [ ] Team registration → approval flow
- [ ] Submission upload → grading flow
- [ ] Announcement publish + notification

### E2E Tests
- [ ] Complete competition lifecycle
- [ ] Concurrent submissions (race condition)
- [ ] File upload large files
- [ ] WebSocket connection stability
- [ ] Rate limiting enforcement

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-deployment
- [ ] Run all migrations
- [ ] Seed default admin
- [ ] Configure environment variables
- [ ] Test locally dengan wrangler dev

### Deployment
- [ ] Deploy ke Cloudflare Workers
- [ ] Configure custom domain
- [ ] Setup CORS origins (FE URL)
- [ ] Configure D1 production
- [ ] Configure R2 bucket

### Post-deployment
- [ ] Health check endpoint test
- [ ] Auth flow test
- [ ] Database connection test
- [ ] File upload test
- [ ] WebSocket test
- [ ] Setup monitoring (optional)

---

## 📁 FINAL FILE STRUCTURE

```
cibc-admin-backend/
├── src/
│   ├── index.ts                    # Worker entry point
│   ├── config/
│   │   ├── constants.ts
│   │   └── database.ts
│   ├── controllers/
│   │   ├── auth.controller.ts      # 4 endpoints
│   │   ├── competition.controller.ts # 5 endpoints
│   │   ├── stage.controller.ts     # 7 endpoints
│   │   ├── task.controller.ts      # 6 endpoints
│   │   ├── team.controller.ts      # 7 endpoints
│   │   ├── submission.controller.ts # 7 endpoints
│   │   ├── grading.controller.ts   # 5 endpoints
│   │   ├── announcement.controller.ts # 6 endpoints
│   │   ├── notification.controller.ts # 4 endpoints
│   │   └── public.controller.ts    # 4 endpoints
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── competition.service.ts
│   │   ├── stage.service.ts
│   │   ├── task.service.ts
│   │   ├── team.service.ts
│   │   ├── submission.service.ts
│   │   ├── storage.service.ts
│   │   ├── notification.service.ts
│   │   ├── websocket.service.ts
│   │   └── audit.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── audit.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── validation.ts
│   │   ├── response.ts
│   │   ├── storage.ts
│   │   └── helpers.ts
│   └── types/
│       ├── api.ts
│       ├── database.ts
│       └── index.ts
├── migrations/
│   ├── 001_initial_schema.sql      # 11 tables
│   └── 002_seed_data.sql           # Default admin + CIBC 2026
├── tests/                          # (optional)
├── wrangler.toml
├── package.json
├── tsconfig.json
└── README.md
```

---

**Total Endpoints:** 55 endpoints
**Estimated Development Time:** 8 weeks (1 developer, part-time)
**Ready untuk dikonsul!** 🎯
