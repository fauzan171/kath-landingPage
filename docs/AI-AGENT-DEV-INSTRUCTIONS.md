# AI Agent Dev Instructions
## Panduan untuk AI Developer Agent Membaca dan Mengimplementasi KATH BMC Competition Platform

**PENTING: BACA SELURUHNYA SEBELUM MULAI**

---

## Lokasi Dokumen

| Dokumen | Lokasi | Isi |
|-------|----------|----|
| PRD Utama (v6.4.0) | `/docs/PRD.md` | Lengkap, technical detail |
| PRD Revision (v7.1.0) | `/docs/PRD-REVISION-v7.md` | Gap analysis, sprint plan, risks |
| Flow Diagrams | `/docs/PRD-FLOW-DIAGRAMS.md` | Seluruh system flow visual |
| **INI FILE** | `/docs/AI-AGENT-DEV-INSTRUCTIONS.md` | **(FILE INI)** |
| Questionnaire Ops | `/QUESTIONNAIRE-OPS.md` | Template pertanyaan Tim Ops |

## Baca Urutan

1. **PRD v6.4.0** untuk memahami schema database dan routing, dan service layer
2. **PRD Revision v7.1.0** untuk memahami apa yang harus dikerjakan, apa yang baru
3. **Flow Diagrams** untuk memahami arah data dan setiap modul

---

## Struktur File Project

```
src/
  pages/                    # React page components
    admin/                  # Admin panel
    judge/                  # Judge panel
    cibc/                   # CIBC auth pages
    cibc-landing/           # CIBC landing page
    dashboard/              # CIBC participant dashboard
  components/               # Shared components (ProtectedRoute, SessionProvider, etc)
  services/                 # Service layer (Supabase, localStorage)
  lib/                      # Supabase client + helpers
  hooks/                    # Custom React hooks
  utils/                    # Security, validation utilities
  sections/                 # KATH landing page sections
  types/                    # TypeScript type definitions
  config/                   # Environment configuration
  config.ts                 # Landing page hardcoded content

supabase/
  migrations/               # SQL migration files
```

---

## Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 19.2.0 | UI Library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool |
| Supabase | Free | Database + Auth + Realtime |
| Tailwind CSS | 3.4.19 | Styling |
| GSAP | 3.14.2 | Animasi |
| shadcn/ui | Radix | Component library |
| Cloudflare Pages | Free | Hosting |
| n8n | Free | File upload proxy |

---

## Key Commands
```bash
npm run build    # Build production (wajib passing)
npm run dev      # Development server
npm run test     # Run tests
npm run lint     # ESLint check
```

---

## Environment Variables
```env
VITE_SUPABASE_URL=https://xxx.supabase.co        # REQUIRED
VITE_SUPABASE_ANON_KEY=eyJxxx                    # REQUIRED
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook # Required for file upload
VITE_WA_API_URL=https://api.fonnte.com            # Planned
VITE_WA_API_KEY=xxx                               # Planned
```

---

## Sprint 1 Task Details

### Task 1: Fix File Upload - DONE
**File:** `src/pages/SubmissionForm.tsx`
**Helper:** `src/lib/supabase.ts` (`uploadFileToDrive`)
**Service:** `src/services/supabase.service.ts`

**Yang sudah dilakukan:**
1. File upload via `uploadFileToDrive()` integrated ke `handleSubmit()`
2. File validation: format (PDF/PPTX/DOCX/PNG/JPG), size (max 10MB), count (max 5)
3. Drag & drop support
4. Error handling untuk upload gagal (fallback ke mock URL)
5. Draft save tetap berjalan
6. Submission confirmation modal

### Task 2: Fix Judge Scoring Aggregation - DONE
**File:** `src/pages/judge/JudgeGrading.tsx`

**Yang sudah dilakukan:**
1. Set completed_at saat update judge_assignments
2. Fix calculateAggregateScore (sum per judge, lalu average totals)
3. General feedback wajib sebelum submit
4. Blind grading di-enforce (team data tidak di-fetch ke client)
5. Per-criterion feedback wajib
6. Per-criterion scoring disimpan ke judge_scores table

### Task 3: Rubric Editor - DONE
**File:** `src/pages/admin/AdminStages.tsx` (task modal)

**Yang sudah dilakukan:**
1. Rubric editor UI di AdminStages task modal
2. Add/edit/delete criteria rows
3. Setiap criteria: criterion name, description, max_points
4. Save sebagai JSONB ke task
5. Load BMC default (9 blok) sebagai starting point

### Task 4: BMC Structured Form - DONE
**File:** `src/pages/SubmissionForm.tsx`

**Yang sudah dilakukan:**
1. 9 blok form fields (Customer Segments, Value Proposition, dll)
2. Setiap blok punya weight label dan placeholder
3. Toggle: structured vs freeform mode
4. Save field_values JSONB dengan 9 blok data
5. Progress indicator

### Task 5 & 6: Already Done
- TermsAndConditions.tsx: lengkap (10 sections)
- BMC Template: downloadBMCTemplate() sudah integrated ke HeroSection.tsx

---

## Database Schema Quick Reference

### Key Tables
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| users | User accounts | id, email, name, role, status |
| competitions | Competition config | id, code, name, config JSONB |
| teams | Team management | id, name, code, category, status |
| team_members | Team membership | team_id, user_id, role |
| stages | Competition stages | id, name, start_date, end_date |
| tasks | Tasks with rubric | id, name, type, rubric JSONB |
| submissions | User submissions | id, file_url, content, status |
| judge_scores | Per-judge scores | judge_id, submission_id, criterion_key, score |
| judge_assignments | Judge assignments | judge_id, submission_id, status |
| notifications | In-app notifications | user_id, title, message, type |
| announcements | Admin announcements | title, content, is_published |

### RLS Policies
- Public: announcements (published), competitions (active), stages (visible)
- Participant: read own data, own team, own submissions
- Judge: read own scores/assignments, own submissions
- Admin: full CRUD access
