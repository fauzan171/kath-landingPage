# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## KATH Event Organizer - BMC Competition Platform

**Versi:** 6.4.0
**Tanggal:** 6 April 2026
**Status:** Production (In Development - Sprint 1 Complete)
**Author:** Tim IT / Developer
**Stakeholder:** Tim Operasional Kompetisi (Lead: Jaz)

---

# DAFTAR ISI

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [System Architecture](#3-system-architecture)
4. [Database Schema](#4-database-schema)
5. [Routing & Navigation](#5-routing--navigation)
6. [Module 1: Landing Page KATH](#6-module-1-landing-page-kath)
7. [Module 2: CIBC Competition Landing](#7-module-2-cibc-competition-landing)
8. [Module 3: Authentication & Authorization](#8-module-3-authentication--authorization)
9. [Module 4: Participant Dashboard](#9-module-4-participant-dashboard)
10. [Module 5: Team Management](#10-module-5-team-management)
11. [Module 6: Submission System](#11-module-6-submission-system)
12. [Module 7: Judge System](#12-module-7-judge-system)
13. [Module 8: Admin Panel](#13-module-8-admin-panel)
14. [Module 9: Notification System (WhatsApp)](#14-module-9-notification-system-whatsapp)
15. [Service Layer](#15-service-layer)
16. [Security Implementation](#16-security-implementation)
17. [Environment & Deployment](#17-environment--deployment)
18. [E2E Gap Analysis & Roadmap](#18-e2e-gap-analysis--roadmap)
19. [Appendix: File Index](#19-appendix-file-index)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Produk
**KATH Event Organizer** adalah platform web yang berfungsi ganda:
1. **Corporate Landing Page** - Menampilkan layanan event organizer KATH (portfolio, services, testimonials, news)
2. **BMC Competition Platform** - Platform end-to-end untuk kompetisi Business Model Canvas (CIBC Competition) yang mencakup registrasi, tim, submission, penilaian juri, dan pengumuman hasil

## 1.2 Target User

| Role | Deskripsi | Akses |
|------|-----------|-------|
| **Public Visitor** | Pengunjung landing page | Landing page KATH + CIBC landing |
| **Participant** | Peserta kompetisi | Dashboard, tim, submission |
| **Judge** | Juri penilai | Grading dashboard |
| **Admin** | Admin platform | Full admin panel |
| **Super Admin** | Super administrator | Full admin panel + user management |
| **Finance Admin** | Admin keuangan | Verifikasi pembayaran |

## 1.3 Status Implementasi
- **Build:** PASSING (0 TypeScript errors, 37/37 tests passed)
- **Core Features:** ~80% E2E
- **Landing Page KATH:** 100% visual, 0% dynamic content (semua hardcoded)
- **CIBC Landing:** 70% (hardcoded data, T&C & BMC template done, judges section done, FAQ expanded to 13)
- **Auth & Security:** 90% selesai (Supabase Auth + RLS + CSRF + Rate Limiting)
- **Competition Flow:** 85% (registrasi, tim, submission dengan BMC structured form + file upload)
- **Judge System:** 80% (per-criterion scoring di judge_scores table, aggregate calculation, blind grading)
- **Admin Panel:** 85% (CRUD + rubric editor + countdown control done)

---

# 2. TECH STACK & ARCHITECTURE

## 2.1 Frontend Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | 19.2.0 | UI Library |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.2.4 | Build tool & dev server |
| **React Router DOM** | 7.13.1 | Client-side routing |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS |
| **GSAP** | 3.14.2 | Animasi landing page (ScrollTrigger) |
| **Framer Motion** | 12.38.0 | Animasi UI components |
| **Lenis** | 1.0.42 | Smooth scrolling |
| **shadcn/ui** | (via Radix UI) | Component library |
| **Recharts** | 2.15.4 | Charts & data visualization |
| **React Hook Form** | 7.70.0 | Form management |
| **Zod** | 4.3.5 | Schema validation |
| **date-fns** | 4.1.0 | Date utilities |
| **Lucide React** | 0.577.0 | Icon library |
| **Sonner** | 2.0.7 | Toast notifications |

## 2.2 Backend Stack

| Teknologi | Fungsi |
|-----------|--------|
| **Supabase** (Free tier - 500MB) | Database + Auth + Realtime |
| **Google Drive** (via n8n - Free 15GB) | File storage |
| **n8n Webhook** | Middleware upload file ke Google Drive |
| **Cloudflare Pages** | Hosting & deployment |

## 2.3 Dev Tools

| Tool | Versi | Fungsi |
|------|-------|--------|
| **Vitest** | 3.2.4 | Unit testing |
| **ESLint** | 9.39.1 | Linting |
| **Wrangler** | 4.71.0 | Cloudflare CLI |
| **jsdom** | 29.0.1 | DOM testing environment |

## 2.4 Total Cost: $0/month
- Supabase Free Tier: 500MB DB, 1GB Storage, 50K Auth MAU
- Google Drive: 15GB free
- Cloudflare Pages: Free (unlimited bandwidth)
- n8n: Self-hosted atau free tier

---

# 3. SYSTEM ARCHITECTURE

## 3.1 Architecture Diagram (Text)

```
[Browser/Client]
    |
    | React SPA (Vite + React Router)
    |
    +-- Landing Page (KATH) -----> Hardcoded (src/config.ts)
    |
    +-- CIBC Landing Page ------> Hardcoded (cibcData.ts)
    |                                |
    |                                +-- Countdown Timer --> Supabase (stages table, real-time)
    |                                +-- Judges Section --> Hardcoded (cibcData.ts judges array)
    |                                +-- FAQ (13 items) --> Hardcoded (cibcData.ts)
    |                                +-- BMC Template Download --> downloadBMCTemplate()
    |                                +-- T&C --> /cibc/terms (TermsAndConditions.tsx)
    |                                +-- Leaderboard --> /cibc/leaderboard (PublicLeaderboard.tsx)
    |
    +-- Auth Flow ---------------> Supabase Auth
    |                                |
    |                                +-- Register (email + password)
    |                                +-- Email Verification
    |                                +-- Login
    |                                +-- Password Reset
    |                                +-- Session Management
    |
    +-- Protected Routes --------> ProtectedRoute.tsx
    |                                |
    |                                +-- Role check (users table)
    |                                +-- Status check (approved/pending/rejected)
    |
    +-- Service Layer -----------> ServiceFactory
    |                                |
    |                                +-- KATH Services --> localStorage
    |                                +-- CIBC Services --> Supabase
    |                                +-- Auth Service --> Supabase Auth
    |
    +-- File Upload ------------> n8n Webhook --> Google Drive
    |                                |
    |                                +-- Return: file_url, drive_file_id
    |
    +-- Database ---------------> Supabase PostgreSQL
                                     |
                                     +-- RLS Policies (per table, per role)
                                     +-- Triggers (new user, updated_at)
                                     +-- Indexes (performance)
```

## 3.2 Data Flow

```
Peserta Register --> Supabase Auth --> Trigger: Insert ke users table (status: pending)
                                              |
Admin Approve --> Update users.status = 'approved'
                                              |
WA Notification --> (via Fonnte/Wablas/manual) --> "Akun kamu sudah aktif"
                                              |
Peserta Login --> ProtectedRoute check --> Dashboard
                                              |
Peserta Buat Tim --> teams table + team_members table
                                              |
Peserta Submit --> Upload file via n8n --> Google Drive URL
                                              |                |
                                       submissions table     file_url saved
                                              |
Judge Login --> ProtectedRoute (role: judge) --> Judge Dashboard
                                              |
Judge Grade --> judge_scores table (per-criterion, per-judge)
                                              |
                                       Aggregate: average all judges -> submissions.total_score
                                              |
Admin Lihat --> Admin Submissions + Leaderboard
                                              |
Pengumuman --> WA blast + website leaderboard
```

---

# 4. DATABASE SCHEMA

## 4.1 Entity Relationship

```
users (auth.users.id)
  |
  +-- teams (via team_members.user_id)
  |     |
  |     +-- team_members
  |     |
  |     +-- submissions
  |           |
  |           +-- judge_scores
  |           +-- judge_assignments
  |
  +-- judge_assignments (as judge_id)
  +-- judge_scores (as judge_id)
  +-- notifications
  +-- audit_logs

competitions
  |
  +-- stages
  |     |
  |     +-- tasks (with rubric JSONB)
  |
  +-- teams
  +-- submissions
  +-- announcements
  +-- judge_assignments

news (standalone)
password_reset_tokens
```

## 4.2 Table Definitions

### 4.2.1 `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,              -- References auth.users.id
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    institution TEXT,
    country TEXT DEFAULT 'Indonesia',
    category TEXT CHECK(category IN ('student', 'startup', 'corporate', 'open')),
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,
    role TEXT CHECK(role IN ('participant', 'admin', 'super_admin', 'finance_admin', 'judge')) DEFAULT 'participant',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Indexes: email, status, role
-- RLS: Read own data, Admin read all, Update own data, Admin update all
```

### 4.2.2 `competitions`
```sql
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    competition_start TIMESTAMPTZ,
    competition_end TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',         -- Stores: totalPrize, maxTeamSize, minTeamSize, categories
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS: Authenticated read, Admin manage all
```

### 4.2.3 `teams`
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    category TEXT,
    institution TEXT,
    status TEXT CHECK(status IN ('draft', 'pending', 'verified', 'rejected')) DEFAULT 'pending',
    payment_status TEXT CHECK(payment_status IN ('unpaid', 'pending', 'verified', 'rejected')) DEFAULT 'unpaid',
    payment_proof TEXT,
    payment_drive_id TEXT,
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Indexes: competition_id, status, payment_status
-- RLS: Admin + team members read, Team leader update, Admin update/delete
```

### 4.2.4 `team_members`
```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    institution TEXT,
    role TEXT CHECK(role IN ('leader', 'member', 'mentor')) DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);
-- Indexes: team_id, user_id
-- RLS: Admin + team members read, Leader insert/update/delete, Admin all
```

### 4.2.5 `stages`
```sql
CREATE TABLE stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id),
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS: Admin + team members of competition read, Admin manage
```

### 4.2.6 `tasks`
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID REFERENCES stages(id),
    competition_id UUID REFERENCES competitions(id),
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    type TEXT DEFAULT 'file_upload',         -- file_upload, text_input, link_submit, quiz, attendance
    is_required BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- NOTE: rubric dan custom_fields disimpan sebagai JSONB di kolom description atau separate JSONB column
-- RLS: Admin + team members of competition read, Admin manage
```

### 4.2.7 `submissions`
```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id),
    team_id UUID REFERENCES teams(id),
    competition_id UUID REFERENCES competitions(id),
    file_url TEXT,                            -- Google Drive URL
    file_name TEXT,
    file_size INTEGER,
    drive_file_id TEXT,                       -- Google Drive file ID
    link_url TEXT,
    content TEXT,
    field_values JSONB,
    status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'graded')) DEFAULT 'draft',
    total_score INTEGER,
    feedback TEXT,
    criteria_scores JSONB,                    -- Per-criteria scores
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Indexes: task_id, team_id, competition_id+status, task_id+status
-- RLS: Admin + Judge + team members read, Team members create, Team update (draft only), Admin all
```

### 4.2.8 `judge_assignments`
```sql
CREATE TABLE judge_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES users(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'recused')),
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(judge_id, submission_id)
);
```

### 4.2.9 `judge_scores`
```sql
CREATE TABLE judge_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES users(id),
    submission_id UUID REFERENCES submissions(id),
    score INTEGER,
    feedback TEXT,
    criterion_key TEXT DEFAULT 'total',    -- Per-criterion scoring (v6.4.0)
    max_score INTEGER DEFAULT 100,         -- Max score for this criterion (v6.4.0)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(judge_id, submission_id, criterion_key)  -- Changed from (judge_id, submission_id)
);
-- Index on criterion_key for per-criterion queries
```

### 4.2.10 `announcements`
```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id),
    title TEXT NOT NULL,
    title_id TEXT,
    content TEXT,
    content_id TEXT,
    type TEXT DEFAULT 'general',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2.11 `notifications`
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2.12 `news`
```sql
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_id TEXT,
    content TEXT,
    content_id TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2.13 `audit_logs`
```sql
CREATE TABLE audit_logs (
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
```

### 4.2.14 `password_reset_tokens`
```sql
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 4.3 Database Triggers

| Trigger | Table | Function |
|---------|-------|----------|
| `on_auth_user_created` | auth.users | Insert ke `users` table (status: pending, role: participant) |
| `update_users_updated_at` | users | Auto-update `updated_at` |
| `update_teams_updated_at` | teams | Auto-update `updated_at` |
| `update_submissions_updated_at` | submissions | Auto-update `updated_at` |

## 4.4 RLS Policies Summary

| Table | Public | Participant | Judge | Admin |
|-------|--------|-------------|-------|-------|
| users | - | Read own | Read own | Read/Update all |
| competitions | Read active | Read | Read | CRUD |
| teams | - | Read own team | - | CRUD |
| team_members | - | Read own team | - | CRUD |
| stages | Read visible | Read own competition | - | CRUD |
| tasks | - | Read own competition | - | CRUD |
| submissions | - | Read/Create own | Read/Update | CRUD |
| judge_scores | - | - | Read/Create/Update own | CRUD |
| judge_assignments | - | - | Read own | CRUD |
| announcements | Read published | Read published | Read published | CRUD |
| news | Read published | - | - | CRUD |
| notifications | - | Read/Update own | Read/Update own | - |
| audit_logs | - | - | - | Read |

**Note:** Public read for `competitions` (active only) and `stages` (visible only) was added in migration `v6.3.0-public-read-stages.sql` to support landing page countdown for anonymous visitors.

## 4.5 Storage Buckets

| Bucket | Public | Access |
|--------|--------|--------|
| `payments` | Yes (read) | Authenticated upload |

---

# 5. ROUTING & NAVIGATION

## 5.1 Route Map

### Public Routes

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/` | LandingPage | Landing page utama KATH |
| `/register` | Register | Registrasi akun KATH |
| `/login` | Login | Login akun KATH |
| `/cibc` | CIBCLanding | Landing page kompetisi CIBC |
| `/cibc/leaderboard` | PublicLeaderboard | Leaderboard/publik hasil kompetisi |
| `/cibc/terms` | TermsAndConditions | Syarat & Ketentuan kompetisi |
| `/cibc/login` | CIBCLogin | Login peserta CIBC |
| `/cibc/register` | CIBCRegister | Registrasi peserta CIBC |
| `/cibc/verify-email` | VerifyEmail | Verifikasi email |
| `/cibc/pending-approval` | PendingApproval | Menunggu approval |
| `/cibc/forgot-password` | ForgotPassword | Lupa password |
| `/cibc/reset-password` | ResetPassword | Reset password |
| `/cibc/change-password` | ChangePassword | Ganti password (wajib setelah temporary) |

### Authenticated Routes (Any approved user)

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/dashboard` | Dashboard | Dashboard peserta |
| `/my-competitions` | MyCompetitions | Daftar kompetisi |
| `/competition/:id` | CompetitionDetail | Detail kompetisi |
| `/competition/:id/submit` | SubmissionForm | Form submission |
| `/edit-profile` | EditProfile | Edit profil |
| `/settings` | Settings | Pengaturan akun |
| `/my-teams` | MyTeam | Manajemen tim |
| `/bmc-competition` | BMCCompetition | Info BMC competition |

### Participant Routes

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/cibc/dashboard` | CIBCDashboard | Dashboard CIBC peserta |

### Admin Routes

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/admin/login` | AdminLogin | Login admin |
| `/admin` | AdminDashboard | Dashboard admin |
| `/admin/hero` | AdminHero | Kelola hero section |
| `/admin/services` | AdminServices | Kelola layanan |
| `/admin/portfolio` | AdminPortfolio | Kelola portfolio |
| `/admin/news` | AdminNews | Kelola berita |
| `/admin/testimonials` | AdminTestimonials | Kelola testimoni |
| `/admin/faq` | AdminFAQ | Kelola FAQ |
| `/admin/statistics` | AdminStatistics | Kelola statistik |
| `/admin/contact` | AdminContact | Kelola kontak |
| `/admin/settings` | AdminSettings | Pengaturan situs |
| `/admin/registrations-hub` | AdminRegistrationsHub | Hub pendaftaran |
| `/admin/competition-setup` | AdminCompetitionSetup | Setup kompetisi |
| `/admin/judging` | AdminJudgingHub | Hub penilaian |
| `/admin/users-hub` | AdminUsersHub | Hub pengguna |
| `/admin/communications` | AdminCommunicationsHub | Hub komunikasi |
| `/admin/stages` | AdminStages | Kelola tahapan |
| `/admin/tasks` | AdminTasks | Kelola tugas |
| `/admin/submissions` | AdminSubmissions | Kelola submission |
| `/admin/grading` | AdminGrading | Penilaian admin |
| `/admin/leaderboard` | AdminLeaderboard | Leaderboard |
| `/admin/announcements` | AdminAnnouncements | Pengumuman |
| `/admin/users` | AdminUsers | Daftar pengguna |
| `/admin/user-approval` | AdminUserApproval | Approval pengguna |
| `/admin/user-management` | AdminUserManagement | Manajemen pengguna |
| `/admin/payments` | AdminPayments | Verifikasi pembayaran |
| `/admin/judges` | AdminJudges | Manajemen juri |

### Judge Routes

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/judge/login` | JudgeLogin | Login juri |
| `/judge` | JudgeDashboard | Dashboard juri |
| `/judge/grading/:submissionId` | JudgeGrading | Penilaian submission |

---

# 6. MODULE 1: LANDING PAGE KATH

## 6.1 Overview
Landing page utama KATH Event Organizer. Menampilkan profil perusahaan, layanan, portfolio, dan info kompetisi.

## 6.2 Sections

| Section | File | Data Source | Status |
|---------|------|-------------|--------|
| Navigation | `src/sections/Navigation.tsx` | `src/config.ts` | Hardcoded |
| Hero | `src/sections/Hero.tsx` | `src/config.ts` | Hardcoded |
| NarrativeText/About | `src/sections/NarrativeText.tsx` | `src/config.ts` | Hardcoded |
| Statistics | `src/sections/Statistics.tsx` | `src/config.ts` | Hardcoded |
| Services | `src/sections/Services.tsx` | `src/config.ts` | Hardcoded |
| Portfolio | `src/sections/Portfolio.tsx` | `src/config.ts` | Hardcoded |
| CardStack | `src/sections/CardStack.tsx` | `src/config.ts` | Hardcoded |
| Competition | `src/sections/Competition.tsx` | `src/config.ts` + Supabase countdown | Partial dynamic |
| News | `src/sections/News.tsx` | `src/config.ts` | Hardcoded |
| Testimonials | `src/sections/Testimonials.tsx` | `src/config.ts` | Hardcoded |
| ZigZagGrid | `src/sections/ZigZagGrid.tsx` | `src/config.ts` | Hardcoded |
| FAQ | `src/sections/FAQ.tsx` | `src/config.ts` | Hardcoded |
| Contact | `src/sections/Contact.tsx` | `src/config.ts` | Hardcoded |
| Footer | `src/sections/Footer.tsx` | `src/config.ts` | Hardcoded |

## 6.3 Animations
- **GSAP ScrollTrigger** - Pin sections, parallax, reveal animations
- **Framer Motion** - Component-level animations
- **Lenis** - Smooth scrolling

## 6.4 Admin Content Management
Admin dapat mengelola konten landing page melalui:
- `/admin/hero` - Hero section
- `/admin/services` - Layanan
- `/admin/portfolio` - Portfolio
- `/admin/news` - Berita
- `/admin/testimonials` - Testimoni
- `/admin/faq` - FAQ
- `/admin/statistics` - Statistik
- `/admin/contact` - Kontak

**Note:** Saat ini konten KATH landing page disimpan di `localStorage` via `competition.service.ts`, `portfolio.service.ts`, `news.service.ts`. BUKAN dari Supabase.

---

# 7. MODULE 2: CIBC COMPETITION LANDING

## 7.1 Overview
Landing page khusus untuk kompetisi CIBC. Entry point untuk peserta sebelum mendaftar.

## 7.2 File Structure
```
src/pages/cibc-landing/
  CIBCLanding.tsx           -- Main page component
  data/cibcData.ts          -- All static content (including judges array, 13 FAQ items)
  data/bmcTemplate.ts       -- BMC Canvas template generator (downloadable HTML)
  sections/
    HeroSection.tsx          -- Hero + countdown + "Unduh Panduan" download
    TimelineSection.tsx      -- Animated timeline
    AboutSection.tsx         -- About competition
    StatsSection.tsx         -- Statistics
    ThemesSection.tsx        -- Competition themes/categories
    PrizesSection.tsx        -- Prize pool
    TestimonialsSection.tsx  -- Testimonials
    JudgesSection.tsx        -- Judge profiles (from cibcData.ts judges array)
    FAQSection.tsx           -- FAQ (13 items from cibcData.ts)
    CTASection.tsx           -- Call to action
    Footer.tsx               -- Footer with links to /cibc/terms and /cibc/leaderboard
  components/
    CountdownTimer.tsx       -- Real-time countdown (via useCountdownDeadline hook)
```

## 7.3 Sections

| Section | Deskripsi | Data Source | Status |
|---------|-----------|-------------|--------|
| Hero | Judul, tagline, countdown, CTA | `cibcData.ts` + Supabase | Partial dynamic |
| About | Deskripsi kompetisi | `cibcData.ts` | Hardcoded |
| Stats | Statistik (peserta, universitas, dll) | `cibcData.ts` | Hardcoded |
| Themes | Topik/kategori kompetisi | `cibcData.ts` | Hardcoded |
| Timeline | Tahapan kompetisi | `cibcData.ts` | Hardcoded |
| Prizes | Hadiah per kategori | `cibcData.ts` | Hardcoded |
| Testimonials | Testimoni peserta | `cibcData.ts` | Hardcoded |
| Judges | Profil juri (4 judges) | `cibcData.ts` | Hardcoded |
| FAQ | FAQ (13 items) | `cibcData.ts` | Hardcoded |
| CTA | Call to action | `cibcData.ts` | Hardcoded |
| Footer | Links ke T&C, Leaderboard, social | Internal routes | Done |

## 7.4 CTA Buttons
1. **"Daftar Sekarang"** -> Navigate ke `/cibc/register`
2. **"Unduh Panduan"** -> `downloadBMCTemplate()` -> Download HTML BMC Canvas template
3. **Footer "Terms & Conditions"** -> `/cibc/terms`
4. **Footer "Leaderboard"** -> `/cibc/leaderboard`

## 7.5 Additional Pages
| Page | Route | File | Status |
|------|-------|------|--------|
| Terms & Conditions | `/cibc/terms` | `src/pages/TermsAndConditions.tsx` | Done |
| Public Leaderboard | `/cibc/leaderboard` | `src/pages/PublicLeaderboard.tsx` | Done |

## 7.6 Known Issue: Duplikasi Data
Ada dua sumber data kompetisi yang **tidak sinkron**:
- `src/pages/cibc-landing/data/cibcData.ts` (CIBC Landing)
- `src/pages/BMCCompetition.tsx` (BMC Competition page, hardcoded)

Perbedaan: prize pool, timeline, max team size, kategori, biaya pendaftaran.

---

# 8. MODULE 3: AUTHENTICATION & AUTHORIZATION

## 8.1 Auth Provider
**Supabase Auth** - Email + Password authentication

## 8.2 Registration Flow

```
1. User isi form registrasi (nama, email, password, no. WA, institusi)
   File: src/pages/cibc/CIBCRegister.tsx
   API: supabase.auth.signUp()
   |
2. Supabase kirim verification email
   |
3. User klik link di email
   File: src/pages/cibc/VerifyEmail.tsx
   |
4. Trigger: handle_new_user() -> Insert ke users table
   Status: 'pending', Role: 'participant'
   |
5. User redirect ke Pending Approval page
   File: src/pages/cibc/PendingApproval.tsx
   |
6. Admin approve di /admin/user-approval
   -> Update users.status = 'approved'
   |
7. WA notifikasi: "Akun kamu sudah aktif"
   |
8. User bisa login dan akses dashboard
```

## 8.3 Login Flow

```
1. User isi form login (email, password)
   File: src/pages/cibc/CIBCLogin.tsx
   API: supabase.auth.signInWithPassword()
   |
2. ProtectedRoute check:
   a. Session valid?
   b. User exists in users table?
   c. Status approved?
   d. Role match?
   File: src/components/ProtectedRoute.tsx
   |
3. Redirect berdasarkan role:
   - participant -> /cibc/dashboard
   - admin/super_admin/finance_admin -> /admin
   - judge -> /judge
```

## 8.4 Password Management

| Fitur | File | Status |
|-------|------|--------|
| Forgot Password | `src/pages/cibc/ForgotPassword.tsx` | Implemented |
| Reset Password | `src/pages/cibc/ResetPassword.tsx` | Implemented |
| Change Password (mandatory) | `src/pages/cibc/ChangePassword.tsx` | Implemented |
| Password Validation | `src/utils/validate.ts` | Min 8 chars, uppercase, lowercase, number, no common patterns |

## 8.5 Role-Based Access Control

| Route Wrapper | Required Roles | Redirect |
|---------------|---------------|----------|
| `AuthenticatedRoute` | Any approved user | `/login` |
| `ParticipantRoute` | participant | `/cibc/login` |
| `AdminRoute` | admin, super_admin, finance_admin | `/admin/login` |
| `JudgeRoute` | judge | `/judge/login` |

## 8.6 User Roles

| Role | Permissions |
|------|-------------|
| `participant` | Dashboard, tim, submission |
| `admin` | Full admin panel |
| `super_admin` | Full admin panel + user management |
| `finance_admin` | Payment verification |
| `judge` | Grading dashboard |

## 8.7 User Status Flow

```
pending -> approved (by admin)
pending -> rejected (by admin, with reason)
```

---

# 9. MODULE 4: PARTICIPANT DASHBOARD

## 9.1 KATH Dashboard (`/dashboard`)
File: `src/pages/Dashboard.tsx`

| Fitur | Status | Detail |
|-------|--------|--------|
| User profile display | Implemented | Name, email, institution |
| Competition stats | Implemented | Active, completed, upcoming |
| Current competition card | Implemented | Card dengan status badge |
| Document upload section | **UI Only** | Tidak ada upload ke storage |
| Timeline display | Implemented | Menampilkan stages |
| Notifications | Implemented | Via Supabase notifications |
| Quick actions | Implemented | Navigate ke fitur lain |

## 9.2 CIBC Dashboard (`/cibc/dashboard`)
File: `src/pages/dashboard/CIBCDashboard.tsx`

Dashboard khusus peserta CIBC yang menampilkan:
- Kompetisi aktif
- Tahapan saat ini
- Status tim
- Submission progress

---

# 10. MODULE 5: TEAM MANAGEMENT

## 10.1 Overview
File: `src/pages/MyTeam.tsx`

## 10.2 Features

| Fitur | Status | API Call |
|-------|--------|----------|
| Buat tim | Implemented | `supabaseTeams.create()` |
| Join via kode tim | Implemented | `supabaseTeams.addMember()` |
| Lihat anggota tim | Implemented | `supabaseTeams.getById()` |
| Hapus anggota | Implemented | `supabaseTeams.removeMember()` |
| Promote ketua | Implemented | Update member role |
| Leave team | Implemented | Deactivate member |
| Copy kode tim | Implemented | Copy to clipboard |

## 10.3 Team Data Model
```typescript
interface Team {
  id: string;
  competition_id: string;
  name: string;
  code: string;              // Kode join unik
  category: string;          // student/startup/corporate/open
  institution: string;
  status: 'draft' | 'pending' | 'verified' | 'rejected';
  payment_status: 'unpaid' | 'pending' | 'verified' | 'rejected';
  payment_proof: string;     // URL bukti pembayaran
}
```

## 10.4 Known Gaps
- [ ] Team capacity limits (max/min anggota) belum di-enforce
- [ ] Invitation via email belum ada (hanya kode)
- [ ] Anggota dari universitas berbeda belum di-validasi

---

# 11. MODULE 6: SUBMISSION SYSTEM

## 11.1 Overview
File: `src/pages/SubmissionForm.tsx`

## 11.2 Current Implementation

| Fitur | Status | Detail |
|-------|--------|--------|
| Load existing submission | Implemented | Fetch dari Supabase |
| Content textarea | Implemented | Freeform text mode |
| File upload UI | Implemented | Drag & drop + click to browse |
| File upload ke storage | **Implemented** | Via `uploadFileToDrive()` -> n8n -> Google Drive |
| File validation | **Implemented** | PDF/PPTX, max 10MB, max 5 files |
| Create submission | **Implemented** | File upload + content + field_values |
| Update submission | **Implemented** | File upload + content + field_values |
| BMC structured form | **Implemented** | 9-block form with toggle (structured/freeform) |
| Draft save | **Implemented** | Save tanpa file upload |
| Submission receipt | **Implemented** | Confirmation modal setelah berhasil |

## 11.3 File Upload Architecture

```
Peserta pilih file (drag & drop / click)
    |
    v
Validasi: format (PDF/PPTX), ukuran (max 10MB), jumlah (max 5)
    |
    v
handleSubmit() dipanggil
    |
    v
1. uploadFileToDrive(file, taskId, teamId)
   -> n8n webhook -> Google Drive
   -> Return: { file_url, drive_file_id, fileName, fileSize }
   (Fallback: mock URL jika n8n tidak dikonfigurasi)
    |
    v
2. Save ke submissions table:
   { file_url, file_name, file_size, drive_file_id,
     content, field_values (9 BMC blocks), status: 'submitted' }
    |
    v
3. Tampilkan konfirmasi modal
```

### 11.3.1 Helper yang tersedia (di `src/lib/supabase.ts`):
```typescript
uploadFileToDrive(file, taskId, teamId) -> { fileUrl, driveFileId, fileName, fileSize }
createSubmission(taskId, teamId, competitionId, file) -> Submission
```

### 11.3.2 Environment yang dibutuhkan:
```
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

## 11.4 Submission Status Flow

```
draft -> submitted -> under_review -> graded
                     |
                     +-> needs_revision -> draft (re-submit)
                     |
                     +-> late (penalty)
```

## 11.5 Known Gaps
- [x] ~~File upload tidak berfungsi~~ - FIXED: Integrated with `uploadFileToDrive()`
- [x] ~~Tidak ada validasi format file~~ - FIXED: PDF/PPTX, max 10MB, max 5 files
- [x] ~~Tidak ada BMC structured form~~ - FIXED: 9-block form with toggle
- [ ] Resubmit setelah needs_revision belum ada UI
- [ ] BMC field_values restore saat edit existing submission perlu testing

---

# 12. MODULE 7: JUDGE SYSTEM

## 12.1 Overview

| File | Fungsi |
|------|--------|
| `src/pages/judge/JudgeLogin.tsx` | Login juri |
| `src/pages/judge/JudgeDashboard.tsx` | Dashboard - daftar submission yang harus dinilai |
| `src/pages/judge/JudgeGrading.tsx` | Form penilaian |
| `src/pages/judge/JudgeLayout.tsx` | Layout wrapper |

## 12.2 Judge Login Flow
```
1. Juri login via /judge/login
   - Email + password (diberikan oleh admin)
   - Force ganti password jika masih temporary
   - Role check: harus 'judge'
   - Status check: harus 'approved'
```

## 12.3 Grading Flow

```
1. Judge buka dashboard
   -> Lihat daftar submission yang assigned
   -> Status: pending / in_progress / completed

2. Judge klik submission
   -> Lihat BMC + dokumen pendamping
   -> **BLIND GRADING**: Team name ditampilkan sebagai "Hidden (Blind Grading)"
   -> BMC structured content viewer (9 blocks) jika field_values.mode === 'structured'

3. Judge beri nilai
   -> Per kriteria rubric (dari task.rubric)
   -> Score per kriteria (0-max_points) disimpan ke judge_scores table
   -> Per-criterion feedback (stored per row in judge_scores)
   -> General feedback (WAJIB, stored in judge_assignments.notes)
   -> Total score otomatis dihitung

4. Submit grading
   -> Save ke judge_scores table (per criterion per judge)
   -> Update judge_assignments.status = 'completed' with completed_at timestamp
   -> Calculate aggregate: average all judges' total scores
   -> Update submissions.total_score with aggregate
```

## 12.4 Scoring Architecture (v6.4.0)

### Per-Criterion Storage
Setiap judge menyimpan **satu row per criterion** di `judge_scores`:
```
judge_scores:
  { judge_id, submission_id, criterion_key: "criterion_0", score: 15, max_score: 15 }
  { judge_id, submission_id, criterion_key: "criterion_1", score: 18, max_score: 20 }
  ...
```

### Aggregate Calculation
```
1. Per Judge Total = SUM of all criterion scores for that judge
2. Final Score = AVERAGE of all judges' totals
3. Update submissions.total_score = final_score
```

## 12.5 Resolved Issues

| Issue | Status | Fix |
|-------|--------|-----|
| Score disimpan di `submissions.criteria_scores` | **FIXED** | Sekarang di `judge_scores` table per criterion per judge |
| Blind grading tidak sempurna | **FIXED** | Team name/institution hidden from judge UI |
| Feedback opsional | **FIXED** | General feedback WAJIB sebelum submit |
| Tidak ada rubric editor | **FIXED** | Rubric editor di AdminStages task modal |
| Aggregate calculation salah | **FIXED** | Sum per judge -> average totals |

## 12.6 Remaining Gaps
- [ ] Scoring normalization (drop highest/lowest) - Nice to have
- [ ] Judge assignment UI di admin panel - Manual via database

## 12.7 Rubric Structure (dari Task JSONB)
```typescript
// Legacy format (currently used by AdminStages and JudgeGrading)
interface LegacyRubricCriterion {
  criterion: string;      // e.g., "Customer Segments"
  description: string;    // Description of what to evaluate
  max_points: number;     // Max score for this criterion
}

// New format (defined in supabase.ts, not yet used by UI)
interface RubricCriterion {
  id: string;
  name: string;
  nameId?: string;
  maxScore: number;
  weight: number;
  description?: string;
}

// Task.rubric accepts both formats via union type
rubric?: Array<RubricCriterion | LegacyRubricCriterion>;
```

---

# 13. MODULE 8: ADMIN PANEL

## 13.1 Overview
Admin panel menggunakan tab-based layout yang di-merge menjadi hub pages.

## 13.2 Admin Hub Pages

| Hub | Route | Sub-features |
|-----|-------|-------------|
| Registrations Hub | `/admin/registrations-hub` | User approval, registration list |
| Competition Setup | `/admin/competition-setup` | Stages, tasks, rubric |
| Judging Hub | `/admin/judging` | Judge assignment, grading review |
| Users Hub | `/admin/users-hub` | User management, roles |
| Communications Hub | `/admin/communications` | Announcements, notifications |

## 13.3 Admin Features Matrix

### 13.3.1 Content Management

| Fitur | Route | Status |
|-------|-------|--------|
| Kelola Hero | `/admin/hero` | Implemented (localStorage) |
| Kelola Services | `/admin/services` | Implemented (localStorage) |
| Kelola Portfolio | `/admin/portfolio` | Implemented (localStorage) |
| Kelola News | `/admin/news` | Implemented (localStorage + Supabase) |
| Kelola Testimonials | `/admin/testimonials` | Implemented (localStorage) |
| Kelola FAQ | `/admin/faq` | Implemented (localStorage) |
| Kelola Statistics | `/admin/statistics` | Implemented (localStorage) |
| Kelola Contact | `/admin/contact` | Implemented |

### 13.3.2 Competition Management

| Fitur | Route | Status | Notes |
|-------|-------|--------|-------|
| CRUD Stages | `/admin/stages` | Implemented | Real-time countdown integration |
| CRUD Tasks | `/admin/stages` (task modal) | Implemented | Termasuk rubric JSONB |
| Rubric Editor | `/admin/stages` (task modal) | **Implemented** | Per-criterion editor with BMC default template |
| Stage dependency | - | **MISSING** | Stage tidak bisa auto-transition |
| Countdown Control | `/admin/stages` | Implemented | Real-time via Supabase subscription |

### 13.3.3 Submission Management

| Fitur | Route | Status | Notes |
|-------|-------|--------|-------|
| Lihat semua submission | `/admin/submissions` | Implemented | |
| Grading sederhana | `/admin/grading` | Implemented | Score 0-100 + feedback |
| Rubric-based grading | `/admin/grading` | **Partial** | Rubric loaded but admin grading simplified |
| Batch operations | - | **MISSING** | |
| Leaderboard preview | `/admin/leaderboard` | Implemented | |
| Public leaderboard | `/cibc/leaderboard` | **Implemented** | PublicLeaderboard.tsx |
| Export (Excel/PDF) | - | **MISSING** | |
| Plagiarism check | - | **MISSING** | |

### 13.3.4 User Management

| Fitur | Route | Status |
|-------|-------|--------|
| Approve/Reject user | `/admin/user-approval` | Implemented |
| Manage users | `/admin/user-management` | Implemented |
| Role assignment | `/admin/users` | Implemented |
| Judge management | `/admin/judges` | Implemented |
| Payment verification | `/admin/payments` | Implemented |

### 13.3.5 Communications

| Fitur | Route | Status |
|-------|-------|--------|
| Announcements CRUD | `/admin/announcements` | Implemented |
| Notification sending | - | **MISSING** |

## 13.4 Admin Dashboard
Route: `/admin`
File: `src/pages/admin/AdminDashboard.tsx`

Menampilkan:
- Total users count
- Total teams count
- Total submissions count
- Active competitions count
- Recent registrations
- Recent submissions

---

# 14. MODULE 9: NOTIFICATION SYSTEM (WHATSAPP)

## 14.1 Strategy
Semua konfirmasi dan notifikasi ke peserta dikirim via **WhatsApp**, bukan email.

## 14.2 In-App Notifications
File: Tabel `notifications` di Supabase

| Fitur | Status |
|-------|--------|
| Create notification | Implemented (Supabase insert) |
| Read notifications | Implemented |
| Mark as read | Implemented |
| Mark all as read | Implemented |
| Notification bell UI | Implemented (NotificationBell component) |

## 14.3 WhatsApp Notification Triggers

| Event | Kirim WA? | Status Implementasi |
|-------|-----------|---------------------|
| Konfirmasi registrasi berhasil | Ya | **NOT IMPLEMENTED** |
| Akun sudah aktif (setelah approval) | Ya | **NOT IMPLEMENTED** |
| Pengingat lengkapi profil/tim | Ya | **NOT IMPLEMENTED** |
| Pengingat submit (H-7, H-3, H-1) | Ya | **NOT IMPLEMENTED** |
| Konfirmasi submission diterima | Ya | **NOT IMPLEMENTED** |
| Feedback dari juri tersedia | Ya | **NOT IMPLEMENTED** |
| Pengumuman hasil | Ya | **NOT IMPLEMENTED** |
| Perubahan jadwal/timeline | Ya | **NOT IMPLEMENTED** |

## 14.4 WA Integration Options
1. **Fonnte** - WA API Indonesia (recommended, murah)
2. **Wablas** - WA API Indonesia
3. **Twilio WhatsApp API** - International
4. **Manual blast** - Via WhatsApp Business app

## 14.5 Required Environment
```env
VITE_WA_API_URL=https://api.fonnte.com  # atau layanan lain
VITE_WA_API_KEY=your-api-key
```

---

# 15. SERVICE LAYER

## 15.1 Architecture

```
ServiceFactory (Singleton)
    |
    +-- KATH Landing Page Services
    |     +-- competition.service.ts (localStorage)
    |     +-- portfolio.service.ts (localStorage)
    |     +-- news.service.ts (localStorage)
    |
    +-- CIBC Competition Services
    |     +-- supabase.service.ts (Supabase)
    |           +-- supabaseAuthService
    |           +-- supabaseCompetitionService
    |           +-- supabaseStageService
    |           +-- supabaseTaskService
    |           +-- supabaseTeamService
    |           +-- supabaseSubmissionService
    |           +-- supabaseNotificationService
    |           +-- supabaseAnnouncementService
    |
    +-- Auth Service
          +-- auth.service.ts (Supabase Auth)
```

## 15.2 Service Factory API

```typescript
// Get service via factory
const authService = await getService('auth');
const teamService = await getService('team');
const submissionService = await getService('submission');
const notificationService = await getService('notification');
const stageService = await getService('stage');
const taskService = await getService('task');
const announcementService = await getService('announcement');
const profileService = await getService('profile');    // -> authService
const settingsService = await getService('settings');   // -> authService
const competitionService = await getService('competition'); // -> localStorage
const portfolioService = await getService('portfolio');     // -> localStorage
const newsService = await getService('news');               // -> localStorage
```

## 15.3 Key Service Methods

### 15.3.1 SupabaseAuthService
```typescript
signUp(email, password, metadata)
signIn(email, password)
signOut()
getCurrentUser()
getSession()
resetPassword(email)
updatePassword(newPassword)
```

### 15.3.2 SupabaseCompetitionService
```typescript
getActive()
getById(id)
getByCode(code)
getStats()
create(data)
update(id, data)
```

### 15.3.3 SupabaseStageService
```typescript
getByCompetition(competitionId)
getActive(competitionId)
create(data)
update(id, data)
delete(id)
subscribe(callback)  // Real-time subscription
```

### 15.3.4 SupabaseTaskService
```typescript
getByStage(stageId)
getByCompetition(competitionId)
create(data)
update(id, data)
delete(id)
```

### 15.3.5 SupabaseTeamService
```typescript
create(competitionId, name, category)
getByCompetition(competitionId)
getById(id)
addMember(teamId, member)
removeMember(teamId, memberId)
updateMemberRole(teamId, memberId, role)
getTeamCode(teamId)
```

### 15.3.6 SupabaseSubmissionService
```typescript
create(data)
update(id, data)
getByCompetition(competitionId)
getByTeam(teamId)
getById(id)
```

### 15.3.7 SupabaseNotificationService
```typescript
getMy()
markRead(id)
markAllRead()
create(userId, title, message, type)
```

---

# 16. SECURITY IMPLEMENTATION

## 16.1 Security Stack

| Layer | Implementasi | File |
|-------|-------------|------|
| Authentication | Supabase Auth | `src/lib/supabase.ts` |
| Authorization | RLS Policies | Database migrations |
| Route Protection | ProtectedRoute component | `src/components/ProtectedRoute.tsx` |
| CSRF Protection | Token-based | `src/utils/csrf.ts` |
| Rate Limiting | Login attempt tracking | `src/utils/security.ts` |
| Input Validation | Zod + custom validators | `src/utils/validate.ts` |
| XSS Prevention | Input sanitization | `src/utils/security.ts` |

## 16.2 Rate Limiting

```typescript
// Login rate limiting
MAX_ATTEMPTS: 5
WINDOW_MINUTES: 5
LOCKOUT_MINUTES: 15
```

## 16.3 Password Requirements
- Minimum 8 karakter
- Harus ada uppercase
- Harus ada lowercase
- Harus ada angka
- Tidak boleh mengandung common patterns (password, 123456, qwerty, dll)

## 16.4 Validation Rules

| Field | Rule |
|-------|------|
| Email | Valid email format |
| Phone | Indonesian format (+62/62/0) 8[1-9]xx |
| Name | 2-100 chars, letters only |
| Team Name | 3-50 chars |
| Institution | 2-100 chars |

## 16.5 RLS Helper Functions

```sql
is_admin()           -- Check if current user is admin/super_admin
is_judge()           -- Check if current user is judge
is_team_member(uuid) -- Check if current user is member of team
is_team_leader(uuid) -- Check if current user is leader of team
```

---

# 17. ENVIRONMENT & DEPLOYMENT

## 17.1 Environment Variables

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx

# n8n File Upload (Required for file upload)
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook

# App Config (Optional)
VITE_APP_NAME=KATH Event Organizer
VITE_APP_URL=https://kath-event.pages.dev

# WhatsApp API (Planned)
VITE_WA_API_URL=https://api.fonnte.com
VITE_WA_API_KEY=your-api-key

# Feature Flags (Optional)
VITE_USE_MOCK_DATA=false
```

## 17.2 Build & Deploy

```bash
# Development
npm run dev           # Start dev server

# Build
npm run build         # TypeScript check + Vite build

# Preview
npm run preview       # Preview via Wrangler

# Deploy
npm run deploy        # Build + deploy to Cloudflare Pages
npm run deploy:staging  # Deploy to staging

# Testing
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report

# Linting
npm run lint          # ESLint check
```

## 17.3 Deployment Target
**Cloudflare Pages** via Wrangler CLI
- Production: Auto-deploy dari main branch
- Staging: Manual atau dari dev branch

## 17.4 Migration Files

| File | Versi | Deskripsi |
|------|-------|-----------|
| `v6.0.0-final-schema.sql` | 6.0.0 | Schema lengkap (CANONICAL) |
| `v6.1.0-fix-rls-policies.sql` | 6.1.0 | Fix RLS policies |
| `v6.1.1-fix-notification-policy.sql` | 6.1.1 | Fix notification RLS |
| `v6.1.2-add-unique-constraints.sql` | 6.1.2 | Unique constraints |
| `v6.1.3-seed-competition.sql` | 6.1.3 | Seed data CIBC competition |
| `v6.1.4-fix-teams-insert-rls.sql` | 6.1.4 | Fix teams insert RLS |
| `v6.2.0-password-reset-flow.sql` | 6.2.0 | Password reset tokens |
| `v6.2.1-add-order-index-columns.sql` | 6.2.1 | Order index columns + rubric JSONB |
| `v6.3.0-public-read-stages.sql` | 6.3.0 | Public read stages & competitions (for anonymous landing page) |
| `v6.4.0-judge-scores-criterion.sql` | 6.4.0 | Per-criterion judge scoring (criterion_key, max_score columns) |

---

# 18. E2E GAP ANALYSIS & ROADMAP

## 18.1 Current E2E Status: ~80%

| Module | E2E % | Status |
|--------|-------|--------|
| Landing Page KATH | 40% | Visual jalan, konten hardcoded |
| CIBC Landing | 70% | Hardcoded, T&C & guide download done, judges done, FAQ 13 items |
| Auth & Registration | 90% | Lengkap, tinggal WA notif |
| Team Management | 80% | CRUD jalan, validasi kurang |
| Submission | 85% | File upload + BMC structured form done |
| Judge System | 80% | Per-criterion scoring done, aggregate calculation done |
| Admin Panel | 85% | CRUD + rubric editor + countdown control done |
| Notifications (WA) | 5% | In-app ada, WA belum |
| Pengumuman/Leaderboard | 60% | Public + admin leaderboard done, publish flow partial |

## 18.2 Priority Roadmap

### PHASE 1: CRITICAL (Sebelum launch) - STATUS: COMPLETE

| # | Task | Module | Effort | Status |
|---|------|--------|--------|--------|
| 1 | Fix file upload di SubmissionForm | Submission | M | **DONE** |
| 2 | Satukan data landing page | CIBC Landing | M | DEFERRED (Sprint 2) |
| 3 | Buat rubric editor di AdminStages | Admin | M | **DONE** |
| 4 | Fix judge scoring ke judge_scores table | Judge | S | **DONE** |
| 5 | Buat halaman leaderboard/pengumuman | Participant | M | **DONE** |
| 6 | Buat halaman Terms & Conditions | CIBC Landing | S | **DONE** |
| 7 | Buat BMC template download | CIBC Landing | S | **DONE** |
| 8 | Tambah BMC structured submission form | Submission | L | **DONE** |

### PHASE 2: IMPORTANT (Sebelum final event)

| # | Task | Module | Effort | Status |
|---|------|--------|--------|--------|
| 9 | Tambah judge profile section | CIBC Landing | S | **DONE** |
| 10 | Tambah FAQ jadi 12+ items | CIBC Landing | S | **DONE** (13 items) |
| 11 | Integrasikan timeline dengan database | CIBC Landing | M | Pending |
| 12 | Structured feedback per kriteria | Judge | M | **DONE** |
| 13 | Revision flow (needs_revision -> resubmit) | Submission | M | Pending |
| 14 | Payment/bukti pembayaran flow | Team | M | Pending |
| 15 | WhatsApp notification integration | Notification | L | Pending |

### PHASE 3: NICE TO HAVE (Post-launch)

| # | Task | Module | Effort |
|---|------|--------|--------|
| 16 | Certificate generation | Pengumuman | L |
| 17 | Sponsors/partners section | CIBC Landing | S |
| 18 | Analytics dashboard dengan charts | Admin | L |
| 19 | Batch grading untuk admin | Admin | M |
| 20 | Plagiarism check integration | Admin | XL |
| 21 | Landing page konten dari Supabase | KATH Landing | L |

---

# 19. APPENDIX: FILE INDEX

## 19.1 Project Structure

```
kath-laddingpage/
  public/                           # Static assets (images, icons)
  src/
    components/                     # Shared components
      BackgroundMusic.tsx
      CompetitionForm.tsx
      CSRFProtectedForm.tsx
      LanguageSwitcher.tsx
      NotificationBell.tsx
      PaymentUpload.tsx
      ProtectedRoute.tsx            # Route protection (role-based)
      SessionProvider.tsx           # Supabase session management
      ui/                           # shadcn/ui components

    config/
      environment.ts                # Environment configuration
    config.ts                       # Landing page content (hardcoded)

    hooks/
      useCountdownDeadline.ts       # Countdown from Supabase stages
      useLenis.ts                   # Smooth scrolling
      useAuth.ts                    # Auth hook (jika ada)
      useCompetition.ts             # Competition data hook
      useNews.ts                    # News data hook
      usePortfolio.ts               # Portfolio data hook

    lib/
      supabase.ts                   # Supabase client + type definitions + helpers

    pages/
      admin/                        # Admin panel
        index.ts                    # Barrel exports
        AdminLayout.tsx             # Tab-based layout
        AdminLogin.tsx
        AdminDashboard.tsx
        AdminHero.tsx
        AdminServices.tsx
        AdminPortfolio.tsx
        AdminNews.tsx
        AdminTestimonials.tsx
        AdminFAQ.tsx
        AdminStatistics.tsx
        AdminContact.tsx
        AdminSettings.tsx
        AdminRegistrations.tsx
        AdminRegistrationsHub.tsx
        AdminCompetitionSetup.tsx
        AdminStages.tsx
        AdminTasks.tsx
        AdminSubmissions.tsx
        AdminGrading.tsx
        AdminLeaderboard.tsx
        AdminJudgingHub.tsx
        AdminAnnouncements.tsx
        AdminCommunicationsHub.tsx
        AdminUsers.tsx
        AdminUsersHub.tsx
        AdminUserApproval.tsx
        AdminUserManagement.tsx
        AdminPayments.tsx
        AdminJudges.tsx

      cibc/                         # CIBC auth pages
        CIBCLogin.tsx
        CIBCRegister.tsx
        VerifyEmail.tsx
        PendingApproval.tsx
        ForgotPassword.tsx
        ResetPassword.tsx
        ChangePassword.tsx

      cibc-landing/                 # CIBC landing page
        CIBCLanding.tsx
        data/cibcData.ts            # All static content (including judges array, 13 FAQ items)
        data/bmcTemplate.ts         # BMC Canvas template generator
        sections/
          HeroSection.tsx
          TimelineSection.tsx
          AboutSection.tsx
          StatsSection.tsx
          ThemesSection.tsx
          PrizesSection.tsx
          TestimonialsSection.tsx
          JudgesSection.tsx         # Judge profiles section
          FAQSection.tsx
          CTASection.tsx
          Footer.tsx
        components/
          CountdownTimer.tsx

      dashboard/
        CIBCDashboard.tsx           # CIBC participant dashboard

      judge/                        # Judge pages
        index.ts
        JudgeLayout.tsx
        JudgeLogin.tsx
        JudgeDashboard.tsx
        JudgeGrading.tsx

      Dashboard.tsx                 # KATH dashboard
      Login.tsx
      Register.tsx
      EditProfile.tsx
      Settings.tsx
      MyTeam.tsx
      MyCompetitions.tsx
      CompetitionDetail.tsx
      SubmissionForm.tsx
      BMCCompetition.tsx
      PublicLeaderboard.tsx           # Public leaderboard page
      TermsAndConditions.tsx          # Terms & Conditions page

    sections/                       # Landing page sections
      Navigation.tsx
      Hero.tsx
      NarrativeText.tsx
      Statistics.tsx
      Services.tsx
      Portfolio.tsx
      CardStack.tsx
      Competition.tsx
      News.tsx
      Testimonials.tsx
      ZigZagGrid.tsx
      FAQ.tsx
      Contact.tsx
      Footer.tsx
      BreathSection.tsx

    services/
      auth.service.ts               # Supabase Auth integration
      supabase.service.ts           # All Supabase CRUD services
      service.factory.ts            # Service factory pattern
      competition.service.ts        # KATH competitions (localStorage)
      portfolio.service.ts          # KATH portfolio (localStorage)
      news.service.ts               # KATH news (localStorage)

    types/
      index.ts                      # All TypeScript type definitions

    utils/
      security.ts                   # Rate limiting, sanitization
      csrf.ts                       # CSRF token management
      validate.ts                   # Input validation (password, email, phone, name)

    App.tsx                         # Main app with routing
    main.tsx                        # Entry point
    index.css                       # Global styles + Tailwind

  supabase/
    migrations/                     # SQL migration files
    config.toml                     # Supabase config

  package.json
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
  postcss.config.js
  index.html
  wrangler.toml                     # Cloudflare config
```

## 19.2 Key Metrics

| Metric | Value |
|--------|-------|
| Total Routes | 42+ |
| Total Pages/Components | 55+ |
| Database Tables | 14 |
| SQL Migrations | 10 |
| RLS Policies | 30+ |
| TypeScript Types | 30+ interfaces/types |
| Service Methods | 50+ |
| Environment Variables | 8 |
| Test Suite | 37 tests (all passing) |

---

**END OF PRD**

*Dokumen ini akan di-update seiring perkembangan project dan feedback dari Tim Operasional.*
