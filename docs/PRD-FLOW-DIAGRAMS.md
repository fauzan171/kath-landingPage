# SYSTEM FLOW DIAGRAMS - KATH BMC Competition Platform
**Versi:** 7.0.0
**Tanggal:** 6 April 2026
**Companion:** `docs/PRD-REVISION-v7.md`

---

# FLOW 0: BIG PICTURE - Arsitektur Keseluruhan

```
Browser (React SPA)
  |
  +-- Landing KATH (/) ---- Hardcoded config.ts
  |
  +-- CIBC Landing (/cibc) ---- cibcData.ts + Supabase countdown
  |
  +-- Auth Flow ---- Supabase Auth
  |     |-- Register, Login, Password Reset, Session Management
  |
  +-- Protected Routes ---- ProtectedRoute.tsx
  |     |-- Session check, User lookup, Status check, Role check
  |
  +-- Service Layer ---- ServiceFactory (Singleton)
  |     |-- KATH Services -> localStorage
  |     |-- CIBC Services -> Supabase
  |     +-- Auth Service -> Supabase Auth
  |
  +-- File Upload ---- n8n Webhook -> Google Drive
  |
  +-- Database ---- Supabase PostgreSQL
        |-- RLS Policies, Triggers, Indexes
        +-- (planned) WA API -> Fonnte/Wablas
```

---

# FLOW 1: PUBLIC VISITOR
```
Pengunjung buka /
    |
    v
[ / (KATH Landing) ]-- Klik section -> Lihat layanan/portfolio/news/FAQ
    |                    Data: config.ts (100% hardcoded)
    |
    +-- Klik "Competition" / CTA BMC
    |
    v
[ /cibc (CIBC Landing) ]
    |-- Hero + Countdown (Supabase stages)
    |-- About, Stats, Themes, Timeline, Prizes (hardcoded cibcData.ts)
    |-- Judges (JudgesSection.tsx, 4 judges from cibcData.ts)
    |-- FAQ (13 items, hardcoded cibcData.ts)
    |-- CTA Buttons:
        |-- "Daftar Sekarang" -> /cibc/register
        |-- "Unduh Panduan" -> downloadBMCTemplate() -> HTML file download
        |-- "Lihat T&C" -> /cibc/terms (TermsAndConditions.tsx)
        |-- "Leaderboard" -> /cibc/leaderboard (PublicLeaderboard.tsx)
```

**Issues:**
- Semua konten hardcoded, harus dari Supabase
- Judges section data belum dari database (hardcoded in cibcData.ts)
- FAQ 13 items sudah cukup, tapi data masih hardcoded

---

# FLOW 2: REGISTRASI PESERTA
```
/cibc/register (CIBCRegister.tsx)
    |
    |-- Form: Nama, Email, Password, WA, Institusi, Kategori
    |-- Validasi: validate.ts (password, email, phone, name)
    |-- Checkbox T&C wajib
    |
    v [SUBMIT]
    |
Supabase Auth: supabase.auth.signUp()
    |
    |-- 1. Buat user di auth.users
    |-- 2. Kirim verification email
    |-- 3. Trigger: on_auth_user_created()
    |       +-> INSERT ke public.users
    |           { status: 'pending', role: 'participant' }
    |
    v
/cibc/verify-email (VerifyEmail.tsx)
    |-- "Cek email, klik link verifikasi"
    |-- [Resend Email] -> supabase.auth.resend()
    |
    v User klik link di email
    |
/cibc/pending-approval (PendingApproval.tsx)
    |-- "Menunggu approval admin"
    |-- [Cek Status] -> cek users.status
    |
    v ============= ADMIN SIDE =============
    |
/admin/user-approval (AdminUserApproval)
    |-- Lihat: Nama, Email, WA, Institusi, Kategori
    |-- [APPROVE] -> users.status = 'approved' -> WA: "Akun aktif!"
    |-- [REJECT]  -> users.status = 'rejected' -> WA: "Ditolak: {reason}"
    |
    v (setelah approved)
    |
/cibc/login (CIBCLogin.tsx)
    |-- Email + Password -> supabase.auth.signInWithPassword()
    |
    v
ProtectedRoute Check:
    |-- 1. Session valid? -> No -> /cibc/login
    |-- 2. User di users table? -> No -> error
    |-- 3. Status approved? -> No -> /cibc/pending-approval
    |-- 4. Role match? -> No -> redirect ke dashboard sesuai role
    |-- ALL PASS -> /cibc/dashboard
```

**Not implemented:**
- WA notifikasi saat approved/rejected (0%)

---

# FLOW 3: TEAM MANAGEMENT
```
/cibc/dashboard -> /my-teams (MyTeam.tsx)
    |
    +-- SITUASI A: Belum punya tim
    |   |-- [BUAT TIM BARU] -> Isi nama, kategori, institusi
    |   |       |
    |   |       v Supabase:
    |   |           1. INSERT teams { code: auto-generated, status: pending }
    |   |           2. INSERT team_members { role: 'leader' }
    |   |           3. Tim terbuat! Copy kode tim ke clipboard
    |   |
    |   +-- SITUASI B: Gabung tim
    |       |-- Input kode tim -> [GABUNG]
    |           |
    |           v Supabase:
    |               1. SELECT teams WHERE code = input
    |               2. Cek slot (maxTeamSize)
    |               3. INSERT team_members { role: 'member' }
    |               4. Error jika: kode tidak ada / tim penuh / sudah di tim lain
    |
    v Tim terbentuk:
    |
    [Tim Lengkap]
    |-- Anggota: Leader + Members
    |-- Actions: [Hapus Anggota] (leader only), [Promote Ketua], [Leave Team]
    |-- Pembayaran: [Upload Bukti Bayar] -> payments bucket
    |   Status: unpaid -> pending -> verified/rejected
```

**Gaps:**
- Team capacity limits belum di-enforce di kode
- Invitation via email belum ada (hanya kode)
- Cross-university validation belum ada

- Payment flow hanya UI, belum ada integrasi gateway

---

# FLOW 4: SUBMISSION SYSTEM
```
/my-teams -> klik "Submit BMC"
    |
    v
/competition/:id/submit (SubmissionForm.tsx)
    |
    +-- Load: Fetch tasks, existing submission dari Supabase
    |
    +-- Form:
    |   |-- BMC Structured Form (9 blocks):
    |   |   |-- Customer Segments, Value Proposition, Channels
    |   |   |-- Customer Relationships, Revenue Streams, Key Resources
    |   |   |-- Key Activities, Key Partnerships, Cost Structure
    |   |   |-- STATUS: IMPLEMENTED (toggle between structured/freeform mode)
    |   |
    |   +-- File Upload:
    |       |-- Drag & drop area
    |       |-- Format: PDF, PPTX, DOCX, PNG, JPG
    |       |-- Max: 10MB per file, max 5 files
    |       |-- STATUS: IMPLEMENTED (upload via n8n -> Google Drive)
    |
    +-- Submit Process:
    |   |
    |   |-- CURRENT (IMPLEMENTED):
    |   |   1. Validasi file (format, size)
    |   |   2. uploadFileToDrive(file, taskId, teamId)
    |   |       |-- HTTP POST -> n8n webhook
    |   |           |-- n8n upload ke Google Drive
    |   |           |-- Return: { fileUrl, driveFileId, fileName, fileSize }
    |   |       |-- Fallback: mock URL jika n8n tidak dikonfigurasi
    |   |   3. Save submission ke Supabase:
    |   |       { file_url, file_name, file_size, drive_file_id,
    |   |         content, field_values (9 BMC blocks), status: 'submitted' }
    |   |   4. Tampilkan konfirmasi modal
    |   |
    |   |-- PENDING:
    |       1. WA notifikasi: "Submission berhasil diterima"
    |       2. Resubmit flow untuk needs_revision status
    |
    v Submission Status Lifecycle:
    |
    draft -> submitted -> under_review -> graded
                    |
                    +-> needs_revision -> draft (re-submit)
                    |
                    +-> late (penalty)
```

---

# FLOW 5: JUDGE GRADING
```
/judge/login (JudgeLogin.tsx)
    |-- Email + Password (diberikan admin)
    |-- Force ganti password jika temporary
    |-- Role check: 'judge', Status check: 'approved'
    |
    v
/judge (JudgeDashboard)
    |-- FETCH: judge_assignments JOIN submissions WHERE judge_id = current
    |-- Daftar: submission ID, status (pending/in_progress/completed), deadline
    |
    v Klik submission
    |
/judge/grading/:submissionId (JudgeGrading.tsx)
    |
    +-- BLIND GRADING:
    |   |-- HIDDEN: Team name, institution, member names
    |   |-- SHOWN: Submission content, file, task name, rubric
    |
    +-- GRADING FORM:
    |   |-- Rubric dari task JSONB:
    |   |   |-- Customer Segments (15%) | Value Proposition (20%)
    |   |   |-- Channels (10%) | Customer Relationships (5%)
    |   |   |-- Revenue Streams (15%) | Key Resources (10%)
    |   |   |-- Key Activities (10%) | Key Partners (5%)
    |   |   |-- Cost Structure (10%)
    |   |   |-- TOTAL: 100%
    |   |-- General Feedback (REQUIRED)
    |   |-- [SAVE DRAFT] [SUBMIT PENILAIAN]
    |
    +-- SUBMIT SCORING:
        |-- Score ke judge_scores table (per criterion per judge)
        |-- completed_at timestamp di-set di judge_assignments
        |-- Aggregate: Average semua judge scores -> submissions.total_score
        |-- Per-criterion feedback stored alongside each score row
        |-- General feedback WAJIB before submit final
```

---

# FLOW 6: ADMIN PANEL
```
/admin (AdminLayout - tab-based)
    |
    +-- Dashboard: Stats (users, teams, submissions, competitions)
    |
    +-- KATH LANDING CONTENT:
    |   |-- Hero, Services, Portfolio, News, Testimonials
    |   |-- FAQ, Statistics, Contact, Settings
    |   |-- Storage: localStorage (BUKAN Supabase)
    |
    +-- COMPETITION MANAGEMENT:
    |   |-- Registrations Hub: User approval, registration list
    |   |-- Competition Setup:
    |   |   |-- Stages CRUD (real-time countdown)
    |   |   |-- Tasks CRUD (termasuk rubric JSONB)
    |   |   |-- Rubric Editor: IMPLEMENTED (in AdminStages task modal)
    |   |-- Judging Hub:
    |   |   |-- Judge assignment
    |   |   |-- Grading review
    |   |   |-- Scoring normalization: MISSING
    |   +-- Leaderboard:
    |       |-- Preview rankings
    |       |-- Publish/unpublish
    |       |-- Export PDF/Excel: MISSING
    |
    +-- USERS:
    |   |-- User List, Management, Role assignment
    |   |-- Judge Management
    |   |-- Payment Verification (upload, verify, reject)
    |
    +-- COMMUNICATIONS:
        |-- Announcements CRUD (publish/unpublish)
        |-- Manual notification send: MISSING
```

---

# FLOW 7: WHATSAPP NOTIFICATION (TARGET - NOT IMPLEMENTED)
```
EVENT TRIGGERS:
|-- Registrasi berhasil -> WA: "Pendaftaran berhasil! Cek email"
|-- Akun approved -> WA: "Akun aktif! Login di [link]"
|-- Akun rejected -> WA: "Ditolak: {reason}"
|-- Tim lengkap -> WA: "Tim sudah lengkap! Siap submit"
|-- Deadline H-7/H-3/H-1 -> WA: "Jangan lupa submit BMC!"
|-- Submission diterima -> WA: "Submission berhasil diterima"
|-- Feedback juri -> WA: "Ada feedback dari juri"
|-- Hasil publish -> WA: "Pengumuman bisa dilihat di [link]"

IMPLEMENTATION OPTIONS:
A. n8n Webhook (RECOMMENDED)
   Supabase Trigger -> n8n -> Fonnte API -> WhatsApp
   + Secure: API key tidak exposed
   + Reliable: retry mechanism

B. Supabase Edge Function
   DB Trigger -> pg_net -> Edge Function -> Fonnte API
   + No external dependency
   - More complex setup

C. Manual Blast (TEMPORARY)
   Tim Ops export nomor WA -> Manual send via WA Business
   + Simple, no code
   - Not scalable
```

---

# FLOW 8: LEADERBOARD & PENGUMUMAN
```
Semua judge submit scoring
    |
    v
/admin/leaderboard
    |-- Aggregate Query:
    |   SELECT teams.name, AVG(judge_scores.score), COUNT(judge_scores)
    |   FROM submissions JOIN teams JOIN judge_scores
    |   GROUP BY team ORDER BY avg_score DESC
    |
    |-- Admin review ranking
    |-- [PUBLISH] ->
    |       1. Set competition status = 'completed'
    |       2. Set leaderboard is_published = true
    |       3. Trigger notifikasi ke semua peserta
    |       4. WA blast: "Hasil bisa dilihat!"
    |
    v
/cibc/leaderboard (PublicLeaderboard.tsx)
    |-- Before publish: "Coming Soon" / "Sedang dinilai"
    |-- After publish: Ranking table (rank, team, institution, score, badge)
    |-- Per kategori filter (tab)
```

---

# FLOW 9: DATABASE RELATIONS
```
auth.users (Supabase managed)
    | 1:1
    v
users --- role: participant/admin/judge/super_admin/finance_admin
    |     status: pending/approved/rejected
    |     |
    |     | 1:N
    |     +-----------------+
    |     |                 |
    |     v                 v
team_members         judge_assignments
    | team_id (FK)        | judge_id (FK)
    | user_id (FK)        | submission_id (FK)
    | role: leader/member  | status: pending/completed
    |                     |
    | N:1                | N:1
    v                     v
teams                 submissions
    | competition_id (FK)  | team_id (FK)
    | code (unique)        | task_id (FK)
    | category             | file_url, drive_file_id
    | payment_status       | content, field_values (JSONB)
    | status               | criteria_scores (JSONB)
                        | status: draft/submitted/under_review/graded
                        | total_score, feedback

competitions
    | code (unique)
    | config JSONB: { totalPrize, maxTeamSize, minTeamSize, categories }
    | 1:N stages -> 1:N tasks (rubric JSONB)

judge_scores (per judge per submission)
    | judge_id (FK) -> users.id
    | submission_id (FK) -> submissions.id
    | score, feedback
    | UNIQUE(judge_id, submission_id)

Standalone: notifications, news, audit_logs
```

---

# FLOW 10: AUTH GATEWAY (ProtectedRoute)
```
Setiap request ke protected route
    |
    v
STEP 1: Session Check
    supabase.auth.getSession()
    |-- null/error -> Redirect to login
    +-- session exists -> STEP 2

STEP 2: User Lookup
    SELECT id, email, role, status FROM users WHERE id = session.user.id
    |-- Not found -> "Account not configured"
    +-- Found -> STEP 3

STEP 3: Status Check
    |-- pending -> /cibc/pending-approval
    |-- rejected -> /cibc/rejected
    +-- approved -> STEP 4

STEP 4: Role Check
    |-- AdminRoute: perlu [admin, super_admin, finance_admin]
    |-- JudgeRoute: perlu [judge]
    |-- ParticipantRoute: perlu [participant]
    |-- AuthenticatedRoute: any approved user
    +-- Match -> RENDER HALAMAN
    +-- No match -> Redirect ke dashboard sesuai role

STEP 5: Auto-redirect by role
    admin/super_admin/finance_admin -> /admin
    judge -> /judge
    participant -> /cibc/dashboard
```

---

# DATA FLOW SUMMARY
```
INPUT                  PROCESSING              OUTPUT
-----------            ----------              ------
Peserta Form -----> ServiceFactory -------> Supabase DB
Admin CRUD -------> ServiceFactory -------> Supabase DB
Judge Scoring ----> ServiceFactory -------> Supabase DB

Supabase DB ------> Realtime Sub --------> Countdown UI
Supabase DB ------> ProtectedRoute -----> Auth Gate
Supabase DB ------> Service Layer -----> Dashboard Data

File Upload ------> n8n Webhook -------> Google Drive
Google Drive ----> Return URL -----------> Supabase DB

Supabase Trigger -> (planned) -----------> WA API
Admin Publish ----> (planned) -----------> Leaderboard

config.ts -------> Hardcoded ------------> KATH Landing
cibcData.ts -----> Hardcoded ------------> CIBC Landing
localStorage ----> Admin Edit -----------> KATH Landing
```

**Legend:**
- IMPLEMENTED & WORKING
- BUG / NEEDS FIX
- NOT IMPLEMENTED

**E2E Status per flow:**
- Registration: 90% (WA notif missing)
- Team Management: 80% (validation gaps)
- Submission: 85% (file upload done, BMC form done, revision flow pending)
- Judge Grading: 80% (per-criterion scoring done, aggregate done)
- Admin Panel: 85% (rubric editor done, analytics missing)
- Leaderboard: 60% (public + admin leaderboard done, publish flow partial)
- WA Notification: 5% (in-app only)
- Landing KATH: 100% visual / 0% dynamic
- CIBC Landing: 70% (hardcoded, judges/FAQ/T&C/BMC template done)

**END OF FLOW DIAGRAMS**
