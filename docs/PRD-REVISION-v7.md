# PRD REVISION v7.0
## KATH Event Organizer - BMC Competition Platform

**Versi:** 7.1.0
**Tanggal:** 6 April 2026
**Status:** Sprint 1 Complete, Sprint 2 In Progress
**Author:** PM Agent (berdasarkan PM Skills framework)
**Baseline:** PRD v6.4.0
**Stakeholder:** Tim Operasional Kompetisi (Lead: Jaz)
---

# DAFTAR ISI

1. [Revision Summary](#1-revision-summary)
2. [Problem Statement (BARU)](#2-problem-statement)
3. [Target Users & Personas (BARU)](#3-target-users--personas)
4. [Strategic Context (BARU)](#4-strategic-context)
5. [Success Metrics (BARU)](#5-success-metrics)
6. [Out of Scope (BARU)](#6-out-of-scope)
7. [User Stories & Acceptance Criteria (BARU)](#7-user-stories--acceptance-criteria)
8. [Gap Analysis per Module](#8-gap-analysis-per-module)
9. [Critical Bugs](#9-critical-bugs)
10. [Sprint Plan](#10-sprint-plan)
11. [Dependencies & Risks](#11-dependencies--risks)
12. [Blockers](#12-blockers)

---

# 1. REVISION SUMMARY

## 1.1 Apa yang Berubah dari v6.3.0 ke v7.0

| Area | v6.3.0 | v7.0 (Revisi) |
|------|--------|---------------|
| Problem Statement | Tidak ada | BARU - Business justification |
| Target Users & Personas | Daftar role saja | BARU - Detail persona dengan pain points |
| Strategic Context | Tidak ada | BARU - Why now, business goals |
| Success Metrics | Tidak ada | BARU - KPI terukur |
| Out of Scope | Tidak ada | BARU - Batasan jelas |
| User Stories | File mapping saja | BARU - Formal stories + acceptance criteria |
| Gap Analysis | Bagian dari E2E section | Diperluas per-module |
| Sprint Plan | Phase 1/2/3 | Diperhalus jadi Sprint 1/2/3 |

## 1.2 Apa yang TIDAK Berubah

Semua technical detail di PRD v6.3.0 sections berikut tetap valid:
- Tech Stack & Architecture (Section 2)
- System Architecture (Section 3)
- Database Schema (Section 4)
- Routing & Navigation (Section 5)
- Module 1-9 detail (Sections 6-14)
- Service Layer (Section 15)
- Security Implementation (Section 16)
- Environment & Deployment (Section 17)
- Appendix: File Index (Section 19)

**Dokumen ini adalah SUPLEMEN, bukan pengganti PRD v6.4.0.**

---

# 2. PROBLEM STATEMENT

## 2.1 Masalah Utama

Tim Operasional KATH Event Organizer menyelenggarakan kompetisi BMC (Business Model Canvas) pertama mereka (CIBC 2026). Tanpa platform digital yang terintegrasi:

- **Registrasi peserta tidak terkontrol** - Manual via spreadsheet/WhatsApp, rentan data ganda dan human error
- **Penilaian juri tidak transparan** - Tidak ada audit trail, scoring bisa dipertanyakan, sulit di-justify ke peserta
- **Pengumuman hasil manual** - Rentan error, tidak real-time, pengalaman peserta kurang profesional
- **Komunikasi peserta tersebar** - Email, WA group, Instagram - tidak ada single source of truth
- **Data kompetisi tidak terarsip** - Tidak bisa dianalisis untuk edisi berikutnya

## 2.2 Evidence

- Kompetisi ini adalah **edisi pertama** - belum ada sistem yang pernah dibuat
- Tim Ops (lead: Jaz) masih menggunakan **manual process** untuk semua hal
- QUESTIONNAIRE-OPS dikirim ke Tim Ops tapi **belum dijawab** - konten kompetisi belum final

## 2.3 Impact

- **User impact:** Peserta mengalami pengalaman yang kurang profesional, bingung flow kompetisi, tidak tahu status submission
- **Business impact:** KATH reputasi sebagai Event Organizer dipertaruhkan; jika kompetisi pertama gagal, sulit menarik peserta di edisi selanjutnya

---

# 3. TARGET USERS & PERSONAS

## 3.1 Persona 1: Peserta Mahasiswa (Primary)

| Attribute | Detail |
|-----------|--------|
| **Nama** | Rina (22, Mahasiswa S1) |
| **Role** | Participant |
| **Tech savviness** | Medium (pakai Instagram, Google Docs, WhatsApp) |
| **Goals** | Ikut kompetisi BMC pertama, menang hadiah, tambah portofolio |
| **Pain points** | Bingung cara daftar, tidak tahu timeline, takut salah format submission |
| **Current behavior** | Cari info via Instagram/teman, daftar last-minute, submit di menit terakhir |
| **Success metric** | Menyelesaikan registrasi + submit BMC sebelum deadline |

## 3.2 Persona 2: Ketua Tim

| Attribute | Detail |
|-----------|--------|
| **Nama** | Andi (24, Mahasiswa S1 semester akhir) |
| **Role** | Participant (Team Leader) |
| **Goals** | Mengelola tim, memastikan semua anggota berkontribusi, submit tepat waktu |
| **Pain points** | Sulit koordinasi anggota, tidak tahu status anggota tim, harus ingat deadline |
| **Current behavior** | Buat WA group, assign tugas manual, ping anggota berkali-kali |

## 3.3 Persona 3: Juri

| Attribute | Detail |
|-----------|--------|
| **Nama** | Dr. Sarah (45, Dosen Bisnis) |
| **Role** | Judge |
| **Tech savviness** | Low-medium |
| **Goals** | Menilai submission secara adil, memberi feedback yang berguna |
| **Pain points** | Harus menilai banyak submission, tidak mau kelihatan bias, butuh sistem yang mudah |
| **Current behavior** | Biasanya menilai manual pakai paper/excel |
| **Key requirement** | Blind grading, rubric yang jelas, UI yang simple |

## 3.4 Persona 4: Admin Operasional

| Attribute | Detail |
|-----------|--------|
| **Nama** | Jaz (28, Tim Ops KATH) |
| **Role** | Admin |
| **Goals** | Mengelola seluruh kompetisi end-to-end dari satu dashboard |
| **Pain points** | Data peserta tersebar, harus manual approve, tidak bisa track progress real-time |
| **Current behavior** | Spreadsheet + WA group + email |

---

# 4. STRATEGIC CONTEXT

## 4.1 Business Goals

| Goal | KPI | Target |
|------|-----|--------|
| Sukseskan edisi pertama CIBC | Jumlah peserta terdaftar | 100+ peserta |
| Reputasi KATH sebagai EO profesional | Peserta puas rating | >80% positive |
| Bisa diulang di edisi berikutnya | Platform reusable | Yes |
| Efisiensi operasional | Waktu manage peserta | 50% faster vs manual |

## 4.2 Why Now

- Kompetisi CIBC 2026 sudah di-announce ke publik
- Timeline pendaftaran sudah berjalan
- Tanpa platform digital, Tim Ops akan kewalahan menangani peserta
- Platform perlu live sebelum deadline submission pertama

## 4.3 Market Context

- Kompetisi BMC populer di kalangan mahasiswa Indonesia
- Kompetitor lain (seperti Kompetisi Bisnis Mahasiswa Indonesia) sudah punya platform digital
- KATH perlu menunjukkan profesionalisme untuk membedakan diri

---

# 5. SUCCESS METRICS

## 5.1 Primary Metric

**Submission completion rate** - Persentase peserta yang berhasil submit BMC sebelum deadline

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Registration completion rate | N/A (new) | >80% | Launch +30 days |
| Submission success rate | ~40% (upload broken) | >95% | Launch +7 days |
| Judge grading completion | Unknown | 100% on-time | Per competition |
| Time-to-approve registration | Unknown | <24 hours | Ongoing |
| Admin task efficiency | Unknown | 50% faster vs manual | Post-launch |

## 5.2 Guardrail Metrics

| Metric | Constraint |
|--------|-----------|
| Platform uptime | >99% during competition period |
| Page load time | <3 seconds |
| Build errors | 0 TypeScript errors |
| Security incidents | 0 |

## 5.3 How We Measure

- **Supabase Analytics** - Registration count, submission count, user activity
- **Admin Dashboard** - Real-time stats (already implemented)
- **Judge Dashboard** - Grading completion tracking
- **Manual feedback** - Post-competition survey ke peserta

---

# 6. OUT OF SCOPE

## 6.1 TIDAK Dibangun di v7.0

| Feature | Alasan |
|---------|--------|
| Payment gateway integration | Verifikasi manual dulu |
| Multi-competition support | Hanya CIBC 2026 |
| Mobile app | Responsive web sudah cukup |
| Real-time chat peserta-juri | Tidak ada use case |
| Automated plagiarism detection | Budget $0, terlalu kompleks |
| Video pitch upload | Phase 2, bukan launch critical |
| Multi-language CMS | Manual bilingual di hardcoded data OK |
| Email notifications | WhatsApp saja dulu |
| Social login (Google, etc) | Email+password cukup |
| Admin audit trail UI | Data tersimpan, tapi tidak ada UI khusus |

## 6.2 Future Considerations

- Multi-competition (CIBC 2027 + kompetisi lain)
- Supabase storage untuk file upload (ganti Google Drive)
- Certificate generation otomatis
- AI-powered scoring assistant
- Public API untuk integrasi pihak ketiga

---

# 7. USER STORIES & ACCEPTANCE CRITERIA

## Story 1: Submit BMC dengan File Upload

**As a** participant (team leader)
**I want to** upload my BMC file dan isi structured form
**So that** my submission lengkap sebelum deadline

**Acceptance Criteria:**
- [x] File upload berfungsi (PDF/PPTX, max 10MB per file, max 5 files)
- [x] BMC 9-block structured form tersedia sebagai alternatif input
- [x] Submission receipt ditampilkan setelah berhasil submit
- [x] Error state ditampilkan jika upload gagal (network error, format salah)
- [ ] Bisa resubmit jika status 'needs_revision' (UI belum ada, flow berjalan)
- [x] Draft bisa disimpan tanpa file
- [x] File tersimpan di Google Drive via n8n webhook

**Files:** `SubmissionForm.tsx`, `supabase.ts`
**Priority:** CRITICAL
**Sprint:** 1
**Status:** DONE

---

## Story 2: Judge Scoring tanpa Overwrite

**As a** judge
**I want to** score setiap rubric criteria secara independen
**So that** penilaian saya tidak menimpa penilaian judge lain

**Acceptance Criteria:**
- [x] Scores disimpan ke judge_scores table (per criterion per judge, NOT submissions.criteria_scores)
- [x] Aggregate score dihitung dari average semua judges' totals
- [x] Blind grading di-enforce (team name TIDAK di-fetch ke client)
- [x] Feedback field WAJIB diisi sebelum submit
- [x] judge_assignments.status update ke 'completed' dengan completed_at timestamp
- [x] submissions.total_score di-update dengan aggregate score
- [x] Per-criterion feedback wajib
- [x] General feedback WAJIB diisi sebelum submit final
- [x] Save & resume (score yang sudah disimpan bisa dilanjutkan nanti)

**Files:** `JudgeGrading.tsx`
**Priority:** CRITICAL
**Sprint:** 1
**Status:** DONE

---

## Story 3: Admin Manage Rubric

**As an** admin
**I want to** create dan edit rubric criteria per task
**So that** scoring criteria jelas dan konsisten untuk semua judge

**Acceptance Criteria:**
- [x] Rubric editor UI tersedia di admin tasks management
- [x] Bisa add/edit/delete criteria rows
- [x] Setiap criteria punya: name, max score, description
- [ ] Validasi: total weight harus 100% (belum di-enforce)
- [x] Rubric disimpan sebagai JSONB di task record
- [x] Template BMC default (9 blocks) bisa di-load sebagai starting point

**Files:** `AdminStages.tsx` (task modal)
**Priority:** HIGH
**Sprint:** 1
**Status:** DONE

---

## Story 4: Lihat Hasil Kompetisi (Leaderboard)

**As a** public visitor / participant
**I want to** melihat ranking hasil kompetisi
**So that** saya tahu posisi tim saya dan pemenangnya

**Acceptance Criteria:**
- [x] Leaderboard page accessible di `/cibc/leaderboard`
- [x] Sebelum publish: tampilkan "Coming Soon"
- [x] Setelah publish: ranking berdasarkan aggregate score
- [x] Tampilkan: rank, team name, institution, score, badge
- [x] Filter per kategori (student/startup/corporate)
- [x] Admin bisa preview sebelum publish (`/admin/leaderboard`)

**Files:** `PublicLeaderboard.tsx`, `AdminLeaderboard.tsx`
**Priority:** HIGH
**Sprint:** 2
**Status:** DONE

---

## Story 5: BMC Template Download

**As a** prospective participant
**I want to** download template BMC canvas
**So that** saya tahu format yang benar untuk submission

**Acceptance Criteria:**
- [x] Button "Unduh Panduan" di CIBC landing berfungsi
- [x] Download file HTML yang bisa dibuka di browser dan print
- [x] Template berisi 9 blok BMC dengan deskripsi bilingual
- [x] File name: CIBC-2026-BMC-Template.html

**Files:** `HeroSection.tsx`, `bmcTemplate.ts`
**Priority:** MEDIUM
**Status:** DONE (sudah diimplementasi)

---

## Story 6: Terms & Conditions

**As a** prospective participant
**I want to** membaca syarat dan ketentuan kompetisi
**So that** saya paham aturan sebelum mendaftar

**Acceptance Criteria:**
- [x] Halaman T&C accessible di `/cibc/terms`
- [x] Link dari CIBC landing page
- [ ] Checkbox "Saya setuju T&C" di form registrasi mengarah ke halaman ini
- [x] Konten lengkap: eligibility, submission rules, judging, IP, plagiarism, disqualification

**Files:** `TermsAndConditions.tsx`
**Priority:** MEDIUM
**Status:** DONE (sudah diimplementasi)

---

## Story 7: WhatsApp Notification

**As a** participant
**I want to** menerima notifikasi via WhatsApp tentang status akun dan submission
**So that** saya tidak ketinggalan info penting

**Acceptance Criteria:**
- [ ] WA terkirim saat: registrasi berhasil, akun approved, submission diterima, feedback tersedia, hasil diumumkan
- [ ] Deadline reminder: H-7, H-3, H-1
- [ ] Template pesan parameterized (nama, link, deadline)
- [ ] API key TIDAK exposed di frontend
- [ ] Rate limit: max 1 WA per event per user per 5 menit

**Files:** BARU `src/services/whatsapp.service.ts`
**Priority:** HIGH
**Sprint:** 3

---

# 8. GAP ANALYSIS PER MODULE

## Module Status Matrix

| Module | E2E % | Critical Gaps | Action Required |
|--------|-------|---------------|-----------------|
| Landing Page KATH | 40% | 100% hardcoded, admin ke localStorage | Content dari Supabase (Sprint 3) |
| CIBC Landing | 70% | Data duplikat, hardcoded | Unify data source (Sprint 2) |
| Auth & Registration | 90% | WA notif belum ada | WA integration (Sprint 3) |
| Team Management | 80% | Capacity limits tidak di-enforce | Add validation (Sprint 2) |
| Submission System | 85% | File upload done, BMC form done | Revision flow UI (Sprint 2) |
| Judge System | 80% | Per-criterion scoring done, aggregate done | Scoring normalization (nice to have) |
| Admin Panel | 85% | Rubric editor done, analytics missing | Analytics dashboard (Sprint 3) |
| Notifications (WA) | 5% | Hanya in-app, WA 0% | WA service (Sprint 3) |
| Leaderboard | 60% | Public + admin leaderboard done, publish flow partial | Full publish flow (Sprint 2) |

---

# 9. CRITICAL BUGS

## Bug 1: File Upload Tidak Berfungsi - FIXED

| Field | Detail |
|-------|--------|
| **Module** | Submission System |
| **File** | `src/pages/SubmissionForm.tsx` |
| **Description** | File dipilih di UI tapi tidak di-upload ke Google Drive. Hanya text content yang di-save ke Supabase |
| **Root cause** | `handleSubmit()` tidak memanggil `uploadFileToDrive()` |
| **Fix** | Integrate `uploadFileToDrive()`, add file validation (format/size), add error handling untuk upload gagal |
| **Depends on** | `VITE_N8N_WEBHOOK_URL` harus diset (fallback ke mock URL jika tidak) |
| **Status** | DONE |
| **Severity** | CRITICAL |

## Bug 2: Judge Scoring Aggregation Salah - FIXED

| Field | Detail |
|-------|--------|
| **Module** | Judge System |
| **File** | `src/pages/judge/JudgeGrading.tsx` |
| **Description** | Aggregate score dihitung dari average per-criterion, bukan average total score per judge. completed_at tidak di-set |
| **Root cause** | `calculateAggregateScore` salah formula |
| **Fix** | Sum per judge, lalu average totals. Set completed_at timestamp. Enforce mandatory feedback |
| **Status** | DONE |
| **Severity** | HIGH |

## Bug 3: Data Kompetisi Duplikat - OPEN

| Field | Detail |
|-------|--------|
| **Module** | CIBC Landing |
| **Files** | `src/pages/cibc-landing/data/cibcData.ts`, `src/pages/BMCCompetition.tsx` |
| **Description** | Dua file berisi data kompetisi yang BEDA (prize pool, timeline, max team size, kategori, biaya) |
| **Fix** | Single source dari Supabase competitions table |
| **Depends on** | Tim Ops belum menjawab content questionnaire |
| **Status** | OPEN |
| **Severity** | MEDIUM |
---

# 10. SPRINT PLAN

## Sprint 1: Critical Path (Week 1)

| # | Task | Module | Impact | Effort | Target File |
|---|------|--------|--------|--------|-------------|
| 1 | Fix file upload submission | Submission | CRITICAL | M | `SubmissionForm.tsx`, `supabase.ts` |
| 2 | Fix judge scoring aggregation | Judge | CRITICAL | S | `JudgeGrading.tsx` |
| 3 | Rubric editor admin | Admin | HIGH | M | `AdminTasks.tsx` |
| 4 | BMC structured form (9 blocks) | Submission | HIGH | L | `SubmissionForm.tsx` |
| 5 | Terms & Conditions page | Landing | MEDIUM | S | `TermsAndConditions.tsx` |
| 6 | BMC template download | Landing | MEDIUM | S | `HeroSection.tsx` + `bmcTemplate.ts` |

**Status Sprint 1:**
- #1 DONE (File upload + BMC structured form + validation working)
- #2 DONE (Judge scoring aggregation fixed, per-criterion scoring in judge_scores table)
- #3 DONE (Rubric editor in AdminStages task modal)
- #4 DONE (BMC structured form integrated into SubmissionForm)
- #5 DONE (TermsAndConditions.tsx)
- #6 DONE (bmcTemplate.ts + HeroSection.tsx)

## Sprint 2: E2E Completion (Week 2)

| # | Task | Module | Impact | Effort | Status |
|---|------|--------|--------|--------|--------|
| 7 | Leaderboard page (public + admin) | Leaderboard | HIGH | M | **DONE** |
| 8 | Unify CIBC landing data source | CIBC Landing | HIGH | M | Pending |
| 9 | Revision flow UI (needs_revision -> resubmit) | Submission | MEDIUM | M | Pending |
| 10 | Judge profiles section di landing | CIBC Landing | MEDIUM | S | **DONE** |
| 11 | FAQ expansion (3 -> 12+ items) | CIBC Landing | LOW | S | **DONE** (13 items) |
| 12 | Timeline dari database (bukan hardcoded) | CIBC Landing | MEDIUM | M | Pending |
| 13 | Team capacity validation | Team | MEDIUM | S | Pending |
| 14 | Payment verification flow | Team | MEDIUM | M | Pending |

## Sprint 3: Polish & Notifications (Week 3)

| # | Task | Module | Impact | Effort |
|---|------|--------|--------|--------|
| 15 | WhatsApp notification service | Notification | HIGH | L |
| 16 | Admin analytics dashboard | Admin | LOW | L |
| 17 | Export PDF/Excel leaderboard | Admin | LOW | M |
| 18 | Landing page content dari Supabase | KATH Landing | LOW | L |
| 19 | Certificate generation | Announcement | LOW | L |

---

# 11. DEPENDENCIES & RISKS

## 11.1 Dependencies

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| QUESTIONNAIRE-OPS dijawab Tim Ops | Content | BLOCKED | Konten kompetisi belum final |
| n8n webhook disetup | Infrastructure | PENDING | File upload tidak bisa di-test E2E |
| WhatsApp API (Fonnte/Wablas) | Infrastructure | PENDING | Notifikasi WA tidak bisa berjalan |
| Supabase free tier (500MB) | Infrastructure | ACTIVE | Bisa limit jika peserta banyak |
| Google Drive (15GB free) | Infrastructure | ACTIVE | Cukup untuk CIBC 2026 |

## 11.2 Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tim Ops tidak jawab questionnaire | HIGH | HIGH | Buat konten placeholder, ready to swap |
| n8n webhook down saat demo | MEDIUM | HIGH | Fallback ke direct Supabase Storage upload |
| Supabase free tier limit tercapai | LOW | CRITICAL | Monitor storage; upgrade plan jika perlu |
| WhatsApp API belum disetup | HIGH | MEDIUM | Phase 1: manual blast, Phase 2: automated |
| Judge belum ditentukan | HIGH | LOW | Admin bisa assign kapan saja |
| Deadline kompetisi mendekat | HIGH | HIGH | Sprint 1 harus selesai minggu ini |

---

# 12. BLOCKERS

## Active Blockers

| Blocker | Owner | Resolution | ETA |
|---------|-------|------------|-----|
| QUESTIONNAIRE-OPS belum dijawab | Tim Ops (Jaz) | Follow up | Unknown |
| n8n webhook belum disetup | Tim IT / Dev | Setup n8n instance | Before Sprint 1 complete |
| WA API belum ada | Tim Ops / Dev | Pilih Fonnte/Wablas | Sprint 3 |

## Mitigation

Jika blocker tidak resolved:
1. **Questionnaire:** Gunakan placeholder content dari cibcData.ts yang ada
2. **n8n:** Fallback ke Supabase Storage upload langsung (tanpa Google Drive)
3. **WA API:** Manual blast via WhatsApp Business untuk edisi pertama

---

**END OF PRD REVISION v7.0**

*Dokumen ini adalah suplemen dari PRD v6.4.0. Untuk technical detail lengkap, lihat `docs/PRD.md`.*
*Untuk flow diagrams, lihat `docs/PRD-FLOW-DIAGRAMS.md`.*
