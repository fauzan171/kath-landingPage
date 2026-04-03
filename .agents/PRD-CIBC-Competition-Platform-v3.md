# 📄 Product Requirements Document (PRD)

## CIBC Competition Platform 2026
### Complete User Journey & Admin Management System

**Version:** 3.0.0  
**Last Updated:** 2026-04-02  
**Status:** Production Ready  
**Architecture:** Supabase FREE + n8n + Google Drive (Google One 100GB)

---

## 1. Executive Summary

### 1.1 Product Overview

**Product Name:** CIBC (CIBC Power by KATH) Business Model Canvas Competition  
**Product Type:** End-to-End Competition Management Platform  
**Competition Flow:** Registration → Payment Verification → Submission → Judging → Finalist Announcement → Offline Final Stage → Winner Announcement  
**Target Audience:** 5,000 participants (international: Indonesia, Malaysia, Singapore, Thailand, Philippines, Vietnam)  
**Competition Categories:** Student, Startup, Corporate  

**Mission:**  
Provide a seamless, professional, and transparent competition experience from initial awareness to winner announcement, with efficient admin management for organizers.

**Vision:**  
Become the benchmark for international business case competition platforms in Southeast Asia with zero-friction registration, transparent judging, and professional-grade administration tools.

---

### 1.2 Complete User Journey Overview (15 Stages)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────────┘

1.  AWARENESS          → Social media, website, email, campus partners
2.  LANDING PAGE       → KATH Company Profile → CIBC Competition Page
3.  REGISTRATION       → 6-step form with payment proof upload
4.  PAYMENT WAITING    → Pending admin verification (1-3 days)
5.  ACCOUNT ACTIVATION → Admin approves → Email notification → Dashboard access
6.  DASHBOARD          → Competition status, timeline, notifications
7.  TEAM COLLABORATION → Invite members (outside system)
8.  SUBMISSION         → Upload BMC PDF, pitch deck, video (optional)
9.  JUDGING PHASE      → Under review by 3 judges
10. RESULT             → Finalist announcement via PDF/notification
11. FINAL PREPARATION  → Upload revised pitch, view schedule
12. OFFLINE FINAL      → On-stage presentation (if qualified)
13. WINNER ANNOUNCEMENT → Ranking, prizes, certificates
14. POST-COMPETITION   → Download certificates, access feedback, portfolio
15. ALUMNI NETWORK     → Community, mentorship, next year competition
```

---

### 1.3 Admin Management Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN MANAGEMENT FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

1.  ADMIN LOGIN        → kath/admin/login → Dashboard access
2.  ADMIN ACCOUNT      → Created by IT team with role-based access
3.  USER MANAGEMENT    → Create admin accounts, manage roles
4.  REGISTRATION APPROVAL → Review & approve user registrations
5.  PAYMENT APPROVAL   → Verify payment proofs, approve/reject
6.  TIMELINE MANAGEMENT → Update competition stages, deadlines
7.  ANNOUNCEMENT       → Create notifications, cards, PDFs, images
8.  LANDING PAGE CONTROL → Toggle registration, update content
9.  JUDGING MANAGEMENT → Assign 3 judges per submission
10. SCORING & FEEDBACK → Collect scores & feedback from judges
11. FINALIST SELECTION → Announce qualified teams
12. RESULT PUBLISHING  → Winner ranking, certificates
```

---

## 2. Detailed User Flow (Peserta Kompetisi)

### 2.1 Stage 1: Awareness & Entry Point

**User Story:**  
*Sebagai calon peserta, saya pertama kali mengetahui kompetisi melalui berbagai channel, dan saya ingin memahami apakah kompetisi ini cocok untuk saya.*

**Touchpoints:**

| Channel | User Action | System Response |
|---------|-------------|-----------------|
| **Social Media** | See Instagram/LinkedIn post | Click link → Landing page |
| **Website** | Visit KATH company website | Navigate to Competition section |
| **Email Campaign** | Receive invitation email | Click CTA → Registration page |
| **Campus/Partner** | Get referral from university | Access via partner link |

**Landing Page Experience (KATH Company Profile):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    KATH COMPANY PROFILE - HOMEPAGE                       │
├─────────────────────────────────────────────────────────────────────────┤
│  [Hero Section]                                                          │
│  "Empowering Innovation Through Competition"                             │
│                                                                          │
│  [Navigation]                                                            │
│  Home | About | Competitions | Partners | Contact                        │
│                          ↑                                               │
│                    User clicks here                                      │
│                                                                          │
│  [Competitions Section]                                                  │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  CIBC Power by KATH 2026                                    │        │
│  │  Business Model Canvas Competition                          │        │
│  │  📅 Registration: Apr 1 - May 15, 2026                      │        │
│  │  💰 Total Prize: Rp 200 Juta                                │        │
│  │  🌏 International (6 Countries)                             │        │
│  │                                                             │        │
│  │  [Learn More →]                                             │        │
│  └─────────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────┘
```

**User Psychology:**
- ✅ **Curiosity:** "Apa ini kompetisi yang cocok buat gue?"
- ✅ **Initial Assessment:** Checking credibility, prize, timeline
- ⚠️ **Decision Point:** Will continue or bounce

**Success Metrics:**
- Landing page view duration: > 2 minutes
- Competition section click-through rate: > 30%
- Bounce rate: < 50%

---

### 2.2 Stage 2: CIBC Landing Page (Competition Detail)

**User Story:**  
*Sebagai calon peserta, saya ingin memahami detail kompetisi secara lengkap sebelum memutuskan untuk register.*

**Landing Page URL:** `cibc.kathevent.com`

**Landing Page Sections:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CIBC COMPETITION LANDING PAGE                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [Hero Banner]                                                           │
│  "CIBC Power by KATH 2026"                                              │
│  "Transform Your Business Ideas Into Reality"                           │
│  [Register Now] [Download Brochure]                                     │
│                                                                          │
│  [About Competition]                                                     │
│  - Background & Objectives                                               │
│  - Why Participate?                                                      │
│  - Who Can Join?                                                         │
│                                                                          │
│  [Timeline]                                                              │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │  Registration → Submission → Judging → Final → Winner  │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                          │
│  [Categories & Prizes]                                                   │
│  - Student/Startup/Corporate: Rp 50 Juta (1st), Rp 30 Juta (2nd), etc.  │
│                                                                          │
│  [Judges & Mentors]                                                      │
│  - Industry Experts, Entrepreneurs, VCs                                  │
│                                                                          │
│  [FAQ]                                                                   │
│  - Who can participate? How to register? Submission format?              │
│                                                                          │
│  [CTA Section]                                                           │
│  "Ready to Transform Your Idea?"                                        │
│  [Register Now →]                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**User Actions:**
- ✅ Read all sections thoroughly
- ✅ Download brochure (PDF)
- ✅ Check timeline compatibility
- ✅ Discuss with potential teammates
- ✅ Click "Register Now"

**User Psychology:**
- ✅ **Interest Growing:** "Ini kompetisi serius, worth it buat ikut"
- ✅ **Credibility Check:** Judges, partners, prizes look legitimate
- ✅ **Commitment Building:** Starting to think about team & idea
- ⚠️ **Final Decision Point:** Will register or not

**Success Metrics:**
- Time on page: > 5 minutes
- Brochure downloads: > 20% of visitors
- Register button CTR: > 15%

---

### 2.3 Stage 3: Registration (6-Step Form)

**User Story:**  
*Sebagai calon peserta, saya ingin mendaftar dengan mudah dan jelas, memahami setiap langkah yang harus saya lakukan.*

**Registration URL:** `cibc.kathevent.com/register`

**6-Step Progressive Form:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    REGISTRATION - 6 STEP PROGRESSIVE FORM                │
├─────────────────────────────────────────────────────────────────────────┤
│  Progress: [●━━━○━━━○━━━○━━━○━━━○]  Step 1 of 6: Account               │
│                                                                          │
│  STEP 1: ACCOUNT INFORMATION                                             │
│  - Email, Password, Confirm Password, Terms Agreement                   │
│                                                                          │
│  STEP 2: PERSONAL INFORMATION                                            │
│  - Full Name, Date of Birth, Phone, Country, City, Institution          │
│                                                                          │
│  STEP 3: COMPETITION CATEGORY                                            │
│  - Student/Startup/Corporate + Details (university/company info)        │
│                                                                          │
│  STEP 4: TEAM INFORMATION                                                │
│  - Create New Team OR Join Existing Team (with team code)               │
│                                                                          │
│  STEP 5: PROJECT INFORMATION                                             │
│  - Project Name, Description, Problem Statement, Solution, SDG          │
│                                                                          │
│  STEP 6: PAYMENT CONFIRMATION ⭐ CRITICAL                                │
│  - Bank Account Info Display                                             │
│  - Upload Payment Proof (PDF/Image, max 5MB)                            │
│  - Enter: Bank Used, Account Holder, Amount, Transfer Date              │
│  - Preview before submit                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

**Step 6: Payment Confirmation (Detailed):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 6: PAYMENT CONFIRMATION                          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💳 PAYMENT INSTRUCTIONS                                         │   │
│  │                                                                  │   │
│  │  Please transfer the registration fee to:                        │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  Bank:           BCA (Bank Central Asia)                  │  │   │
│  │  │  Account No:     1234567890                               │  │   │
│  │  │  Account Name:   PT KATH Event Organizer                  │  │   │
│  │  │  Amount:         Rp 500.000                               │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  Alternative Bank:                                               │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  Bank:           Mandiri                                  │  │   │
│  │  │  Account No:     9876543210                               │  │   │
│  │  │  Account Name:   PT KATH Event Organizer                  │  │   │
│  │  │  Amount:         Rp 500.000                               │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📤 PAYMENT CONFIRMATION                                         │   │
│  │                                                                  │   │
│  │  Bank Used * [Select Bank ▼] (BCA / Mandiri / BNI / Other)      │   │
│  │  Account Holder Name * [_________________________________]      │   │
│  │  Transfer Amount * [Rp 500.000] (auto-filled)                   │   │
│  │  Transfer Date * [DD/MM/YYYY] 📅                                │   │
│  │                                                                  │   │
│  │  Upload Payment Proof *                                          │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  📤 Drag & Drop or Click to Upload                        │  │   │
│  │  │  Accepted: PDF, JPG, PNG (Max 5MB)                        │  │   │
│  │  │  Screenshot or photo of transfer receipt                  │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  [Preview Area]                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  [Image Preview or PDF Icon]                              │  │   │
│  │  │  proof_transfer_001.jpg (1.2 MB)                     ✕    │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ☐ I confirm this payment is for CIBC 2026 registration         │   │
│  │                                                                  │   │
│  │                    [← Back]          [Submit Registration →]     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Payment Upload Validation:**
- File Type: PDF, JPG, JPEG, PNG only
- File Size: Max 5MB
- Image Quality: Must be readable
- Content: Must show bank logo, account number, amount, date

**User Psychology:**
- ✅ **Commitment Peak:** "Gue udah invest waktu dan uang, serius ini"
- ⚠️ **Anxiety:** "Jangan-jangan transfer gue gagal atau nggak kebaca"
- ⚠️ **Trust Moment:** "Apakah admin bakal verifikasi dengan adil?"
- ✅ **Completion Relief:** "Finally, selesai juga registrasinya"

**Success Metrics:**
- Registration completion rate: > 85%
- Payment proof upload success rate: > 95%
- Average time to complete: < 15 minutes

---

### 2.4 Stage 4: Payment Waiting Phase (Pending Verification)

**User Story:**  
*Sebagai peserta yang sudah register, saya ingin tahu status pendaftaran saya dan berapa lama harus menunggu.*

**Post-Submission Page:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    REGISTRATION SUBMITTED                                │
├─────────────────────────────────────────────────────────────────────────┤
│                          ⏳                                              │
│  Registration Submitted Successfully!                                    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  NEXT STEPS:                                                     │   │
│  │  1. ⏳ Waiting for Payment Verification (1-3 business days)      │   │
│  │  2. 📧 Email Notification (check spam folder)                    │   │
│  │  3. 🎯 Access Dashboard (after approval)                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Current Status: ⏳ PENDING VERIFICATION                                │
│                                                                          │
│  Registration Details:                                                   │
│  - Team Name: Innovation Squad                                          │
│  - Team Code: CIBC2026-ABC123                                           │
│  - Category: Student                                                    │
│  - Submitted: Apr 5, 2026 at 14:30                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

**User Psychology:**
- ⚠️ **Anxiety Peak:** "Udah bener belum ya upload gue?"
- ⚠️ **Impatience:** "Kapan sih kelar verifikasinya?"
- ✅ **Procrastination:** "Sambil nunggu, gue siap-siap materi aja"
- ⚠️ **Doubt:** "Jangan-jangan ditolak gimana?"

**Communication Strategy:**
- **Immediate:** Email confirmation of submission received
- **Day 1:** "Your payment is under review" notification
- **Day 2:** "Still reviewing" if takes longer
- **Day 3:** "Final reminder" or approval/rejection

---

### 2.5 Stage 5: Account Activation (Access Granted)

**User Story:**  
*Sebagai peserta, saya ingin segera tahu ketika akun saya disetujui agar bisa mulai mengakses dashboard dan kompetisi.*

**Admin Approval Process (Background):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN APPROVAL WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Admin receives notification: "New registration pending"             │
│  2. Admin logs in to kath/admin/login                                   │
│  3. Admin navigates to: User Approval Dashboard                         │
│  4. Admin reviews:                                                       │
│     ✓ User profile information                                           │
│     ✓ Payment proof (preview image/PDF)                                 │
│     ✓ Bank details match transfer amount                                │
│     ✓ File is clear and readable                                        │
│  5. Admin action:                                                        │
│     ✓ Click "Approve" OR "Reject"                                       │
│     ✓ If reject: Select reason from dropdown + custom note              │
│  6. System automatically:                                                │
│     ✓ Update user status: pending → approved/rejected                   │
│     ✓ Update payment status: pending → paid/rejected                    │
│     ✓ Update team status: pending → active/cancelled                    │
│     ✓ Send email notification to user                                   │
│     ✓ Log admin action (audit trail)                                    │
│  7. User receives email within 5 minutes                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

**Approval Email Template:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    EMAIL: ACCOUNT APPROVED                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Subject: 🎉 Your CIBC 2026 Registration is Approved!                   │
│                                                                          │
│  Dear [Team Name],                                                      │
│                                                                          │
│  Great news! Your registration for CIBC Power by KATH 2026 has been    │
│  approved. Welcome to the competition!                                  │
│                                                                          │
│  YOUR ACCOUNT DETAILS:                                                   │
│  - Team Name: Innovation Squad                                          │
│  - Team Code: CIBC2026-ABC123                                           │
│  - Category: Student                                                    │
│  - Dashboard: https://cibc.kathevent.com/dashboard                      │
│                                                                          │
│  NEXT STEPS:                                                             │
│  1. Login to your dashboard using your registered email                 │
│  2. Complete your team profile (add team members)                       │
│  3. Download competition guidelines                                     │
│  4. Start working on your Business Model Canvas                         │
│  5. Note the submission deadline: May 31, 2026                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**User Psychology:**
- ✅ **Relief:** "Finally, approved juga!"
- ✅ **Excitement:** "Let's gooo, saatnya kompetisi!"
- ✅ **Motivation:** "Gue harus mulai siap-siap sekarang"
- ✅ **Trust:** "Adminnya responsif, kompetisi ini profesional"

---

### 2.6 Stage 6: Dashboard Exploration (Orientation Phase)

**User Story:**  
*Sebagai peserta yang baru approved, saya ingin memahami semua fitur yang tersedia dan apa yang harus saya lakukan selanjutnya.*

**Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PARTICIPANT DASHBOARD                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  [Top Navigation]                                                        │
│  CIBC 2026 Logo | Dashboard | Submission | Team | Announcements | Profile│
│                                                                          │
│  [Welcome Banner]                                                        │
│  "Welcome back, Innovation Squad! 🎉"                                   │
│  "Your registration is approved. Let's start competing!"                │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 COMPETITION STATUS                                           │   │
│  │  Current Phase: SUBMISSION OPEN                                 │   │
│  │  [Registration✓] [Submission●] [Judging○] [Final○] [Winner○]   │   │
│  │  ⏰ Deadline: 25 days remaining (May 31, 2026)                  │   │
│  │  [Progress Bar: ████████░░░░░░░░ 60%]                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  📬 ANNOUNCEMENTS│  │  👥 TEAM STATUS  │  │  📁 SUBMISSION   │      │
│  │  3 new updates  │  │  Team: Active    │  │  Status: Not     │      │
│  │  [View All →]   │  │  Members: 1/5    │  │  Submitted       │      │
│  │                  │  │  [Invite →]      │  │  [Upload →]      │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                          │
│  [Quick Actions]                                                         │
│  [Upload Submission] [Invite Team Members] [Download Guidelines]        │
│                                                                          │
│  [Timeline Widget]                                                       │
│  - Team Formation: Apr 30, 2026 (5 days left)                           │
│  - Submission: May 31, 2026 (25 days left)                              │
│  - Judging: June 1-15, 2026                                             │
│  - Finalist Announcement: June 20, 2026                                 │
│                                                                          │
│  [Recent Activity]                                                       │
│  - Apr 10: Your account was approved                                    │
│  - Apr 5: Registration submitted                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Dashboard Sections:**

| Section | Content | User Action |
|---------|---------|-------------|
| **Competition Status** | Current phase, progress bar, countdown | Understand where they are |
| **Announcements** | Latest updates from admin | Click to read details |
| **Team Status** | Team formation progress | Invite members |
| **Submission** | Upload status, deadline | Upload BMC PDF |
| **Timeline** | All important dates | Plan accordingly |
| **Quick Actions** | Most common actions | One-click access |
| **Activity Log** | Personal timeline | Track progress |

**User Psychology:**
- ✅ **Orientation:** "Oke, ini dia dashboardnya, ada apa aja ya?"
- ✅ **Clarity:** "Jadi sekarang gue harus ngapain"
- ✅ **Urgency:** "Wah, deadline tinggal 25 hari lagi"
- ✅ **Control:** "Gue bisa manage semua dari sini"

---

### 2.7 Stage 7: Team Collaboration (Outside System but Triggered by System)

**User Story:**  
*Sebagai peserta, saya perlu berkolaborasi dengan tim untuk menyiapkan submission, walaupun tidak semua terjadi di dalam sistem.*

**Collaboration Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TEAM COLLABORATION FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Team Leader logs in to dashboard                                    │
│     ✓ Sees "Members: 1/5"                                               │
│     ✓ Clicks "Invite Members"                                           │
│  2. Team Leader invites members via:                                    │
│     ✓ Email invitation (sent from system)                               │
│     ✓ Share team code via WhatsApp/Line                                 │
│     ✓ Direct link: cibc.kathevent.com/join/CIBC2026-ABC123              │
│  3. Members receive invitation:                                         │
│     ✓ Click link → Login/Register → Auto-join team                      │
│     ✓ Enter team code → Confirm joining                                 │
│  4. Team formation complete (5/5 members)                               │
│  5. Team collaborates outside system:                                   │
│     ✓ WhatsApp group for daily communication                            │
│     ✓ Google Docs for BMC drafting                                      │
│     ✓ Zoom meetings for discussion                                      │
│  6. System serves as:                                                   │
│     ✓ Central deadline tracker                                          │
│     ✓ Official submission portal                                        │
│     ✓ Status updates & announcements                                    │
│     ✓ Final upload destination                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2.8 Stage 8: Submission Phase (Critical Moment)

**User Story:**  
*Sebagai peserta, saya ingin upload submission saya dengan mudah dan yakin bahwa file saya akan tersimpan dengan aman.*

**Submission Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUBMISSION UPLOAD FLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│  1. User navigates to: Dashboard → Submission                           │
│  2. User sees submission requirements:                                  │
│     ✓ BMC (Business Model Canvas) - PDF (Required)                     │
│     ✓ Pitch Deck - PDF (Optional)                                      │
│     ✓ Video Pitch - MP4/YouTube link (Optional)                        │
│  3. User clicks "Upload Submission"                                     │
│  4. Upload form appears:                                                │
│     ┌───────────────────────────────────────────────────────────────┐  │
│     │  UPLOAD YOUR SUBMISSION                                       │  │
│     │  Business Model Canvas (BMC) *                                │  │
│     │  📤 Drag & Drop or Click to Upload (PDF only, Max 10MB)       │  │
│     │  Pitch Deck (Optional)                                        │  │
│     │  📤 Drag & Drop or Click to Upload (PDF only, Max 20MB)       │  │
│     │  Video Pitch (Optional)                                       │  │
│     │  [ ] Upload video file (MP4, Max 100MB)                       │  │
│     │  [ ] Submit YouTube/Vimeo link                                │  │
│     │  Submission Statement *                                       │  │
│     │  "We confirm that this is our original work..." ☐ I agree *   │  │
│     │  [Cancel]  [Submit →]                                        │  │
│     └───────────────────────────────────────────────────────────────┘  │
│  5. User uploads files:                                                │
│     ✓ File validation (type, size)                                     │
│     ✓ Upload progress bar                                              │
│     ✓ Upload to n8n → Google Drive                                     │
│     ✓ Metadata saved to Supabase                                       │
│  6. Submission successful:                                             │
│     ✓ Success message                                                  │
│     ✓ Submission reference number                                      │
│     ✓ Email confirmation                                               │
│     ✓ Can download own submission                                      │
│  7. Status changes to: "Submitted - Under Review"                      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Submission Page UI:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUBMISSION STATUS                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ✅ SUBMISSION RECEIVED                                          │   │
│  │  Reference No: CIBC2026-SUB-ABC123                              │   │
│  │  Submitted: May 25, 2026 at 16:45                               │   │
│  │  Uploaded Files:                                                 │   │
│  │  📄 BMC_Innovation_Squad.pdf (3.2 MB) [⬇️]                     │   │
│  │  📄 Pitch_Deck.pdf (5.1 MB) [⬇️]                               │   │
│  │  Current Status: UNDER REVIEW                                   │   │
│  │  Expected Result: June 20, 2026 (Finalist Announcement)         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**User Psychology:**
- ⚠️ **Tension:** "Jangan-jangan file gue corrupt atau salah upload"
- ⚠️ **Vulnerability:** "Ini hasil kerja keras berbulan-bulan"
- ✅ **Relief:** "Finally, submitted juga!"
- ⚠️ **Anticipation:** "Kapan ya hasilnya keluar?"

---

### 2.9 Stage 9: Post-Submission Waiting (High Anxiety Phase)

**User Story:**  
*Sebagai peserta yang sudah submit, saya ingin tahu progress penilaian dan kapan hasilnya akan keluar.*

**Waiting Phase Experience:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    JUDGING PHASE - WAITING                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Dashboard Widget:                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 JUDGING PROGRESS                                             │   │
│  │  Status: UNDER REVIEW                                           │   │
│  │  [Registration✓] [Submission✓] [Judging●] [Final○] [Winner○]   │   │
│  │  Timeline:                                                       │   │
│  │  - Judging Start: June 1, 2026 ✓                                │   │
│  │  - Judging End: June 15, 2026 ⏳ (5 days left)                  │   │
│  │  - Result Announcement: June 20, 2026                           │   │
│  │  Your submission is being evaluated by 3 expert judges.         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Notifications During Waiting:                                           │
│  📬 June 2: "Judging has started! Our panel is reviewing..."           │
│  📬 June 10: "Judging is 50% complete. Hang tight!"                    │
│  📬 June 15: "Judging completed. Results coming soon!"                 │
│  📬 June 18: "Finalist announcement in 2 days. Stay tuned!"            │
└─────────────────────────────────────────────────────────────────────────┘
```

**User Psychology:**
- ⚠️ **High Anxiety:** "Gue lolos nggak ya?"
- ⚠️ **Impatience:** "Kok lama banget sih?"
- ⚠️ **Hope & Fear:** "Semangat sih, tapi takut kecewa juga"
- ✅ **Preparation:** "Mumpung nunggu, gue latihan presentasi aja"

---

### 2.10 Stage 10: Judging Result (Turning Point)

**User Story:**  
*Sebagai peserta, saya ingin tahu hasil penilaian dengan jelas dan cepat, serta memahami langkah selanjutnya jika lolos.*

**Announcement Methods:**

**Method 1: Email Notification**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    EMAIL: FINALIST RESULT                                │
├─────────────────────────────────────────────────────────────────────────┤
│  Subject: 🎉 CONGRATULATIONS! You're a CIBC 2026 Finalist!             │
│  OR                                                                      │
│  Subject: CIBC 2026 Result Update                                       │
│                                                                          │
│  Dear [Team Name],                                                      │
│  We are excited to announce the results of CIBC Power by KATH 2026     │
│  preliminary judging.                                                   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🎉 CONGRATULATIONS!                                             │   │
│  │  Your team has been selected as a FINALIST!                     │   │
│  │  Team Name: Innovation Squad                                    │   │
│  │  Category: Student                                              │   │
│  │  You are now invited to the OFFLINE FINAL ROUND on June 30,     │   │
│  │  2026 at [Venue], Jakarta.                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  NEXT STEPS:                                                             │
│  1. Confirm your attendance by June 25, 2026                            │
│  2. Upload revised pitch deck by June 27, 2026                          │
│  3. Review final round guidelines (attached)                            │
│  4. Prepare for 10-minute presentation + 5-minute Q&A                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Method 2: Dashboard Announcement**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD - FINALIST ANNOUNCEMENT                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🎉 CONGRATULATIONS! YOU'RE A FINALIST! 🎉                      │   │
│  │  After careful evaluation by our panel of judges, we are        │   │
│  │  thrilled to inform you that your team has been selected as     │   │
│  │  one of the finalists for CIBC Power by KATH 2026!              │   │
│  │  Team: Innovation Squad                                         │   │
│  │  Category: Student                                              │   │
│  │  [Download Result Letter (PDF)]                                 │   │
│  │  [View Judge Feedback]                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📍 OFFLINE FINAL ROUND                                          │   │
│  │  Date: June 30, 2026                                            │   │
│  │  Time: 09:00 - 17:00 WIB                                        │   │
│  │  Venue: [Venue Name & Address]                                  │   │
│  │  Format: 10-minute pitch + 5-minute Q&A                         │   │
│  │  [Confirm Attendance]  [Upload Revised Pitch Deck]              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Method 3: Public Finalist List (PDF Download)**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CIBC 2026 - OFFICIAL FINALIST LIST                    │
├─────────────────────────────────────────────────────────────────────────┤
│  CIBC Power by KATH 2026                                                │
│  Business Model Canvas Competition                                      │
│  OFFICIAL FINALIST LIST                                                 │
│  Preliminary Round - June 2026                                          │
│                                                                          │
│  STUDENT CATEGORY (15 Teams)                                             │
│  1. Innovation Squad - Indonesia                                        │
│  2. Green Tech Warriors - Malaysia                                      │
│  3. EduTech Pioneers - Singapore                                        │
│  4. HealthCare Innovators - Thailand                                    │
│  5. FinTech Solutions - Philippines                                     │
│  ...                                                                     │
│                                                                          │
│  STARTUP CATEGORY (15 Teams)                                             │
│  1. AI Driven Co - Indonesia                                            │
│  2. Sustainable Energy - Malaysia                                       │
│  ...                                                                     │
│                                                                          │
│  CORPORATE CATEGORY (10 Teams)                                           │
│  1. Digital Transformation - Indonesia                                  │
│  2. Innovation Lab - Singapore                                          │
│  ...                                                                     │
│                                                                          │
│  Total Finalists: 40 Teams (from 500+ registrations)                    │
│  Selection Rate: 8%                                                     │
│  Download Full PDF: [Download Button]                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**User Psychology (If Qualified):**
- ✅ **Euphoria:** "GILA! KITA LOLOS!"
- ✅ **Pride:** "Hasil kerja keras kita terbayar!"
- ✅ **Excitement:** "Final round, here we come!"
- ⚠️ **Pressure:** "Sekarang ekspektasi makin tinggi"

**User Psychology (If Not Qualified):**
- ⚠️ **Disappointment:** "Yah, nggak lolos..."
- ⚠️ **Frustration:** "Padahal udah effort banget"
- ✅ **Learning:** "At least dapat feedback dari juri"
- ✅ **Resilience:** "Next time kita coba lagi"

---

### 2.11 Stage 11: Final Preparation (If Qualified)

**User Story:**  
*Sebagai finalis, saya ingin mempersiapkan presentasi final dengan baik dan memahami semua requirement untuk final round.*

**Final Preparation Dashboard:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FINAL ROUND PREPARATION                               │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🏆 FINAL ROUND CHECKLIST                                        │   │
│  │  ☑ Confirm attendance (Deadline: June 25)                       │   │
│  │  ☐ Upload revised pitch deck (Deadline: June 27)                │   │
│  │  ☐ Review final round guidelines                                 │   │
│  │  ☐ Prepare 10-minute presentation                               │   │
│  │  ☐ Prepare for 5-minute Q&A                                     │   │
│  │  ☐ Book travel & accommodation (if needed)                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Upload Revised Pitch Deck:                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📤 Upload Pitch Deck (PDF, Max 20MB)                           │   │
│  │  Requirements:                                                   │   │
│  │  ✓ Maximum 15 slides                                            │   │
│  │  ✓ Include: Problem, Solution, Market, Business Model, Team     │   │
│  │  ✓ Format: 16:9 aspect ratio                                    │   │
│  │  [Upload Button]                                                 │   │
│  │  Current Version: pitch_deck_v1.pdf (Uploaded: June 22)         │   │
│  │  [Download] [Replace]                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Final Round Schedule:                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  TIME          ACTIVITY                                         │   │
│  │  08:00-09:00   Registration & Check-in                          │   │
│  │  09:00-09:30   Opening Ceremony                                 │   │
│  │  09:30-12:00   Team Presentations (Session 1)                   │   │
│  │  12:00-13:00   Lunch & Networking                               │   │
│  │  13:00-15:30   Team Presentations (Session 2)                   │   │
│  │  15:30-16:30   Judge Deliberation                               │   │
│  │  16:30-17:00   Award Ceremony                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2.12 Stage 12: Offline Final Stage

**User Story:**  
*Sebagai finalis, saya ingin presentasi di final round dengan lancar dan memberikan yang terbaik.*

**Final Day Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    OFFLINE FINAL STAGE - EVENT DAY                       │
├─────────────────────────────────────────────────────────────────────────┤
│  Pre-Event (System Support):                                             │
│  ✓ Email reminder 1 day before                                          │
│  ✓ Venue map & parking info in dashboard                                │
│  ✓ Presentation order published                                         │
│                                                                          │
│  On-Site Experience:                                                     │
│  1. Registration & Check-in                                             │
│     ✓ Show ID & confirmation email                                      │
│     ✓ Receive name tag & goodie bag                                     │
│     ✓ Test presentation equipment                                       │
│  2. Opening Ceremony                                                    │
│     ✓ Welcome speech by organizer                                       │
│     ✓ Introduction of judges                                            │
│     ✓ Explanation of rules                                              │
│  3. Team Presentations                                                  │
│     ✓ 10 minutes per team                                               │
│     ✓ 5 minutes Q&A with judges                                         │
│     ✓ Live scoring by judges                                            │
│  4. Networking Session                                                  │
│     ✓ Lunch with other participants                                     │
│     ✓ Meet judges & mentors                                             │
│  5. Award Ceremony                                                      │
│     ✓ Announcement of winners                                           │
│     ✓ Prize distribution                                                │
│     ✓ Photo session                                                     │
│                                                                          │
│  Post-Event (System Updates):                                            │
│  ✓ Results published in dashboard (same day)                            │
│  ✓ Winner announcement email                                            │
│  ✓ Event photos uploaded to gallery                                     │
│  ✓ Certificate distribution (digital)                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2.13 Stage 13: Winner Announcement & Closure

**User Story:**  
*Sebagai peserta/pemenang, saya ingin tahu hasil akhir kompetisi dan mendapatkan pengakuan atas pencapaian saya.*

**Winner Announcement:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WINNER ANNOUNCEMENT                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  Dashboard Banner:                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🏆 CIBC 2026 WINNERS ANNOUNCED! 🏆                              │   │
│  │  Congratulations to all winners!                                │   │
│  │  [View Winners List] [Download Certificates]                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Winners List (PDF Download):                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CIBC POWER BY KATH 2026                                        │   │
│  │  OFFICIAL WINNER LIST                                           │   │
│  │  STUDENT CATEGORY:                                               │   │
│  │  🥇 1st Place: Innovation Squad (Indonesia) - Rp 50 Juta        │   │
│  │  🥈 2nd Place: Green Tech Warriors (Malaysia) - Rp 30 Juta      │   │
│  │  🥉 3rd Place: EduTech Pioneers (Singapore) - Rp 20 Juta        │   │
│  │  STARTUP CATEGORY:                                               │   │
│  │  🥇 1st Place: AI Driven Co (Indonesia) - Rp 50 Juta            │   │
│  │  🥈 2nd Place: Sustainable Energy (Malaysia) - Rp 30 Juta       │   │
│  │  CORPORATE CATEGORY:                                             │   │
│  │  🥇 1st Place: Digital Transform (Indonesia) - Rp 50 Juta       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  For All Participants:                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📜 CERTIFICATE OF PARTICIPATION                                 │   │
│  │  Thank you for participating in CIBC 2026!                      │   │
│  │  Your certificate is ready for download.                        │   │
│  │  [Download Certificate]                                         │   │
│  │  Judge Feedback (Your Submission):                              │   │
│  │  [Download Feedback PDF]                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2.14 Stage 14: Post-Competition Phase

**User Story:**  
*Sebagai alumni peserta, saya ingin mengakses dokumentasi kompetisi dan memanfaatkan ini untuk masa depan saya.*

**Post-Competition Features:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    POST-COMPETITION PORTAL                               │
├─────────────────────────────────────────────────────────────────────────┤
│  For All Participants:                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📜 CERTIFICATES                                                 │   │
│  │  - Certificate of Participation                                 │   │
│  │  - Finalist Certificate (if qualified)                          │   │
│  │  - Winner Certificate (if won)                                  │   │
│  │  [Download All]                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 YOUR SUBMISSION ARCHIVE                                      │   │
│  │  - Download your submitted BMC                                  │   │
│  │  - Download judge feedback                                      │   │
│  │  - Use for portfolio                                            │   │
│  │  [Access Archive]                                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🤝 ALUMNI NETWORK                                               │   │
│  │  - Join CIBC Alumni Community                                   │   │
│  │  - Connect with other participants                              │   │
│  │  - Access mentorship opportunities                              │   │
│  │  [Join Community]                                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📅 NEXT YEAR'S COMPETITION                                      │   │
│  │  - Early bird registration for alumni                           │   │
│  │  - Refer new teams                                              │   │
│  │  - Become mentor/volunteer                                      │   │
│  │  [Learn More]                                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Admin Flow

### 3.1 Admin Login & Access

**Admin Entry Point:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN LOGIN FLOW                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  URL: kathevent.com/admin/login (or cibc.kathevent.com/admin/login)     │
│                                                                          │
│  Login Page:                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CIBC 2026 - ADMIN PORTAL                                        │   │
│  │  Email * [_________________________________]                     │   │
│  │  Password * [_________________________________] 👁️              │   │
│  │  [Login →]                                                       │   │
│  │  Note: Admin accounts are created by IT team only.              │   │
│  │  Contact: it-support@kathevent.com                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  After Login:                                                            │
│  ✓ Redirect to: /admin/dashboard                                        │
│  ✓ Session stored (JWT)                                                 │
│  ✓ Role-based access control applied                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Admin Account Creation (By IT Team):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CREATE ADMIN ACCOUNT (IT TEAM ONLY)                   │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Super Admin / IT navigates to: Settings → Admin Management          │
│  2. Click "Create New Admin"                                            │
│  3. Fill form:                                                           │
│     ┌───────────────────────────────────────────────────────────────┐  │
│     │  CREATE ADMIN ACCOUNT                                         │  │
│     │  Search User: [____________________] 🔍                      │  │
│     │  (Search existing user by email/name)                         │  │
│     │  Selected User: John Doe (john@email.com)                     │  │
│     │  Admin Role *                                                  │  │
│     │  ○ Super Admin (Full Access)                                  │  │
│     │  ○ Admin (User/Payment Approval + Content)                    │  │
│     │  ○ Finance Admin (Payment Approval Only)                      │  │
│     │  ○ Judge (Submission Access + Scoring)                        │  │
│     │  ○ Observer (Read-Only)                                       │  │
│     │  Permissions:                                                  │  │
│     │  ☑ Approve Users  ☑ Approve Payments  ☑ Manage Content       │  │
│     │  ☑ View Submissions  ☑ Score Submissions  ☑ Manage Admins    │  │
│     │  Temporary Password: [_____________________] 👁️               │  │
│     │  (User must change on first login)                            │  │
│     │  [Cancel]  [Create Admin →]                                   │  │
│     └───────────────────────────────────────────────────────────────┘  │
│  4. System:                                                             │
│     ✓ Create admin account                                             │
│     ✓ Send invitation email with temporary password                    │
│     ✓ Log action in audit trail                                        │
│  5. New Admin:                                                          │
│     ✓ Receive email                                                    │
│     ✓ Login with temporary password                                    │
│     ✓ Forced to change password                                        │
│     ✓ Access dashboard based on role                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Admin Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD OVERVIEW                              │
├─────────────────────────────────────────────────────────────────────────┤
│  [Top Navigation]                                                        │
│  CIBC Admin | Dashboard | Users | Payments | Submissions | Settings     │
│                                                                          │
│  [Welcome Banner]                                                        │
│  "Welcome back, Admin! 👋"                                              │
│  "Here's what's happening today."                                       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 QUICK STATS                                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │  👥      │  │  💳      │  │  📁      │  │  ⏳      │        │   │
│  │  │  5,234   │  │  123     │  │  456     │  │  45      │        │   │
│  │  │  Total   │  │  Pending │  │  Total   │  │  Pending │        │   │
│  │  │  Users   │  │  Payments│  │  Submiss.│  │  Reviews │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  ⚠️ ACTION NEEDED│  │  📈 TRENDING     │  │  📢 ANNOUNCEMENTS│      │
│  │  45 payments     │  │  Registration    │  │  3 drafts        │      │
│  │  awaiting review │  │  up 25% today    │  │  pending publish │      │
│  │  [Review →]      │  │  [Details →]     │  │  [Publish →]     │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                          │
│  [Quick Actions]                                                         │
│  [Approve Payments] [Create Announcement] [Export Data] [Manage Judges] │
│                                                                          │
│  [Recent Activity Log]                                                   │
│  - 5 min ago: Admin A approved payment from Team X                      │
│  - 15 min ago: Admin B rejected user registration                       │
│  - 1 hour ago: New submission received from Team Y                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Admin: User Management & Approval

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    USER APPROVAL DASHBOARD                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Filters:                                                                │
│  [Status: Pending ▼] [Category: All ▼] [Country: All ▼] [Search 🔍]     │
│                                                                          │
│  PENDING USER APPROVALS (123)                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  👤 Andi Pratama                       Apr 5, 2026              │   │
│  │     andi@email.com | Indonesia                                  │   │
│  │     Category: Student | Institution: UI                         │   │
│  │     Team: Innovation Squad (Code: CIBC2026-ABC123)              │   │
│  │     Payment: Rp 500.000 (BCA)                                   │   │
│  │     [👁️ View Profile] [✅ Approve] [❌ Reject]                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  👤 Siti Nurhaliza                     Apr 5, 2026              │   │
│  │     siti@email.com | Malaysia                                   │   │
│  │     Category: Startup | Company: GreenTech Sdn Bhd              │   │
│  │     Team: Green Warriors (Code: CIBC2026-XYZ789)                │   │
│  │     Payment: Rp 500.000 (Maybank)                               │   │
│  │     [👁️ View Profile] [✅ Approve] [❌ Reject]                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Bulk Actions:                                                           │
│  [Select All] [Approve Selected (25)] [Reject Selected (3)]             │
└─────────────────────────────────────────────────────────────────────────┘
```

**Admin Review Process:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN REVIEW MODAL                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  User Details:                                                           │
│  - Name: Andi Pratama                                                   │
│  - Email: andi@email.com                                                │
│  - Phone: +62-812-XXXX-XXXX                                             │
│  - Institution: Universitas Indonesia                                   │
│  - Category: Student                                                    │
│                                                                          │
│  Payment Proof Preview:                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [Image/PDF Preview]                                            │   │
│  │  proof_transfer_001.jpg (1.2 MB)                                │   │
│  │  Bank: BCA | Amount: Rp 500.000 | Date: Apr 5, 2026             │   │
│  │  [Zoom In] [Download]                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Decision:                                                               │
│  [✅ Approve User] [❌ Reject User]                                     │
│                                                                          │
│  If Reject:                                                              │
│  Reason: [Select from dropdown ▼]                                       │
│  - Payment proof unclear                                                │
│  - Wrong transfer amount                                                │
│  - Invalid bank account                                                 │
│  - Other (specify)                                                      │
│  Additional Notes: [_______________________]                            │
│  [Cancel]  [Confirm Decision →]                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Admin: Payment Approval

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PAYMENT APPROVAL DASHBOARD                            │
├─────────────────────────────────────────────────────────────────────────┤
│  Filters:                                                                │
│  [Status: Pending ▼] [Bank: All ▼] [Amount Range] [Search 🔍]           │
│                                                                          │
│  PENDING PAYMENT PROOFS (45)                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💳 Payment Proof #CIBC2026-PAY-001                             │   │
│  │  Team: Innovation Squad | Category: Student                     │   │
│  │  Bank: BCA | Account: Andi Pratama | Amount: Rp 500.000         │   │
│  │  Transfer Date: Apr 5, 2026 | Submitted: Apr 5, 2026 14:30      │   │
│  │  File: proof_001.jpg (1.2 MB)                                   │   │
│  │  [👁️ Preview Proof] [✅ Approve] [❌ Reject]                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💳 Payment Proof #CIBC2026-PAY-002                             │   │
│  │  Team: Green Warriors | Category: Startup                       │   │
│  │  Bank: Mandiri | Account: Siti Nurhaliza | Amount: Rp 500.000   │   │
│  │  Transfer Date: Apr 5, 2026 | Submitted: Apr 5, 2026 15:45      │   │
│  │  File: proof_002.pdf (0.8 MB)                                   │   │
│  │  [👁️ Preview Proof] [✅ Approve] [❌ Reject]                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Payment Proof Preview Modal:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PAYMENT PROOF PREVIEW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [Full-size Image/PDF Preview]                                  │   │
│  │  - Zoom controls (+/-)                                          │   │
│  │  - Rotate                                                       │   │
│  │  - Download                                                     │   │
│  │  - Open in new tab                                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Payment Details:                                                        │
│  - Bank: BCA                                                            │
│  - Account Holder: Andi Pratama                                         │
│  - Amount: Rp 500.000                                                   │
│  - Transfer Date: Apr 5, 2026                                           │
│  - Team: Innovation Squad                                               │
│  - User: andi@email.com                                                 │
│                                                                          │
│  Decision:                                                               │
│  [✅ Approve Payment] [❌ Reject Payment]                               │
│                                                                          │
│  If Reject:                                                              │
│  Reason: [Select from dropdown ▼]                                       │
│  - Payment proof unclear/blurry                                         │
│  - Wrong transfer amount                                                │
│  - Invalid bank account                                                 │
│  - Transfer date missing                                                │
│  - Other (specify)                                                      │
│  Additional Notes: [_______________________]                            │
│  [Cancel]  [Confirm Decision →]                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.5 Admin: Timeline Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TIMELINE MANAGEMENT                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  Competition Timeline Editor:                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📅 REGISTRATION PHASE                                           │   │
│  │  Start: [Apr 1, 2026 📅]  End: [May 15, 2026 📅]                │   │
│  │  Status: [Active ▼]                                             │   │
│  │  [Save Changes]                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📁 SUBMISSION PHASE                                             │   │
│  │  Start: [May 16, 2026 📅]  End: [May 31, 2026 📅]               │   │
│  │  Status: [Upcoming ▼]                                           │   │
│  │  [Save Changes]                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⚖️ JUDGING PHASE                                                │   │
│  │  Start: [June 1, 2026 📅]  End: [June 15, 2026 📅]              │   │
│  │  Status: [Upcoming ▼]                                           │   │
│  │  [Save Changes]                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🏆 FINAL ROUND                                                  │   │
│  │  Date: [June 30, 2026 📅]  Venue: [Jakarta 📍]                  │   │
│  │  Status: [Upcoming ▼]                                           │   │
│  │  [Save Changes]                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Quick Actions:                                                          │
│  [Extend Deadline] [Pause Registration] [Activate Phase]                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.6 Admin: Announcement Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ANNOUNCEMENT MANAGEMENT                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Create New Announcement:                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Title * [_______________________________________________]      │   │
│  │  Type * [● Urgent ○ General ○ Result ○ Reminder]                │   │
│  │                                                                  │   │
│  │  Content *                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │ [Rich Text Editor: Bold, Italic, Link, List, etc.]        │ │   │
│  │  │                                                           │ │   │
│  │  │ Type your announcement here...                            │ │   │
│  │  │                                                           │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │  Attachments:                                                    │   │
│  │  📤 Upload Image/PDF [Drag & Drop or Click]                     │   │
│  │  - brochure.pdf (2.3 MB)                                    ✕   │   │
│  │  - event_poster.jpg (1.5 MB)                                ✕   │   │
│  │                                                                  │   │
│  │  Target Audience:                                                │   │
│  │  ☑ All Participants  ☐ Finalists Only  ☐ Specific Categories   │   │
│  │                                                                  │   │
│  │  Publish Options:                                                │   │
│  │  ○ Publish Now                                                   │   │
│  │  ○ Schedule: [Jun 20, 2026 📅] [09:00 ⏰]                       │   │
│  │                                                                  │   │
│  │  [Save Draft]  [Preview]  [Publish →]                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Recent Announcements:                                                   │
│  - "Submission Deadline Extended" (Published, 234 views)               │
│  - "Finalist List Released" (Scheduled, Jun 20)                        │
│  - "Judging Guidelines" (Draft)                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Dashboard Notification Card (User View):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD NOTIFICATION                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📢 ANNOUNCEMENT                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │  [Header Image: 800x400px]                                │ │   │
│  │  │  CIBC 2026 Competition Update                             │ │   │
│  │  │                                                           │ │   │
│  │  │  Dear Participants,                                       │ │   │
│  │  │                                                           │ │   │
│  │  │  We are excited to announce that the submission deadline  │ │   │
│  │  │  has been extended until May 31, 2026. This gives you     │ │   │
│  │  │  additional time to perfect your Business Model Canvas.   │ │   │
│  │  │                                                           │ │   │
│  │  │  [Download Updated Guidelines PDF]                        │ │   │
│  │  │                                                           │ │   │
│  │  │  Best regards,                                            │ │   │
│  │  │  CIBC 2026 Committee                                      │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │  Posted: Apr 15, 2026 | Views: 1,234                          │   │
│  │  [Close] [Share]                                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.7 Admin: Judging Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    JUDGING MANAGEMENT                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  Assign Judges to Submissions:                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  SUBMISSION: Innovation Squad - BMC_Project.pdf                 │   │
│  │  Category: Student | Submitted: May 25, 2026                    │   │
│  │                                                                  │   │
│  │  Assigned Judges:                                                │   │
│  │  1. [Judge A (Industry Expert) ▼)] ✕                           │   │
│  │  2. [Judge B (VC Partner) ▼)] ✕                                │   │
│  │  3. [Judge C (Successful Entrepreneur) ▼)] ✕                   │   │
│  │  [+ Add Judge]                                                   │   │
│  │                                                                  │   │
│  │  Rubric:                                                         │   │
│  │  - Innovation (30%)                                              │   │
│  │  - Market Potential (25%)                                        │   │
│  │  - Business Model (20%)                                          │   │
│  │  - Feasibility (15%)                                             │   │
│  │  - Presentation (10%)                                            │   │
│  │                                                                  │   │
│  │  [Save Assignment]                                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Judging Progress:                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Total Submissions: 456                                         │   │
│  │  Assigned: 456 (100%)                                           │   │
│  │  Completed: 234 (51%)                                           │   │
│  │  Pending: 222 (49%)                                             │   │
│  │  [Progress Bar: ██████████░░░░░░ 51%]                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Judge Scoring Interface:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    JUDGE SCORING INTERFACE                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Submission: Innovation Squad - BMC_Project.pdf                         │
│  Category: Student | Team Members: 4                                    │
│  [📄 Download Submission PDF] [🎥 Watch Video Pitch]                    │
│                                                                          │
│  Scoring Rubric:                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  1. INNOVATION (30 points)                                       │   │
│  │  How novel and creative is the business idea?                   │   │
│  │  Score: [████████░░░░░░░░░░░░░░░] 24/30                        │   │
│  │  Feedback: [_______________________________________________]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  2. MARKET POTENTIAL (25 points)                                 │   │
│  │  Size of market opportunity and growth potential                │   │
│  │  Score: [████████████░░░░░░░░░░░] 20/25                        │   │
│  │  Feedback: [_______________________________________________]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  3. BUSINESS MODEL (20 points)                                   │   │
│  │  Clarity and viability of revenue model                         │   │
│  │  Score: [██████████████░░░░░░░░░] 16/20                        │   │
│  │  Feedback: [_______________________________________________]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  4. FEASIBILITY (15 points)                                      │   │
│  │  Practicality of implementation                                 │   │
│  │  Score: [████████████░░░░░░░░░░░] 12/15                        │   │
│  │  Feedback: [_______________________________________________]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  5. PRESENTATION (10 points)                                     │   │
│  │  Quality of pitch and communication                             │   │
│  │  Score: [████████░░░░░░░░░░░░░░░] 8/10                         │   │
│  │  Feedback: [_______________________________________________]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Overall Feedback:                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Strengths:                                                     │   │
│  │  [_______________________________________________]              │   │
│  │                                                                 │   │
│  │  Areas for Improvement:                                         │   │
│  │  [_______________________________________________]              │   │
│  │                                                                 │   │
│  │  Recommendation:                                                │   │
│  │  ○ Strong Accept  ○ Accept  ○ Borderline  ○ Reject             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Total Score: 80/100                                                     │
│  [Submit Score]  [Save Draft]                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Technical Architecture

### 4.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                         │
│                    Cloudflare Pages (FREE)                               │
│  - React 19 + TypeScript + Vite                                          │
│  - Tailwind CSS + shadcn/ui                                            │
│  - Unlimited bandwidth via CDN                                           │
│  - GSAP for animations                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND                                          │
│                    Supabase FREE Tier                                    │
│  - PostgreSQL Database (500 MB)                                          │
│  - Authentication (50K MAU)                                              │
│  - Row Level Security (RLS)                                              │
│  - Real-time subscriptions (optional)                                    │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ Webhook
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AUTOMATION                                          │
│                  n8n (Railway FREE tier)                                 │
│  - File upload webhook                                                   │
│  - Google Drive integration                                              │
│  - File validation                                                       │
│  - URL generation                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ OAuth 2.0
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        STORAGE                                           │
│              Google Drive (Google One 100 GB)                            │
│  - PDF file storage (submissions, payment proofs)                        │
│  - Public link generation                                                │
│  - 100 GB capacity (expandable to 200GB)                                 │
│  - $1.99/month                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Database Schema (Core Tables)

```sql
-- 1. users
id, email, name, phone, institution, country, category,
payment_status (unpaid/pending/paid),
status (pending/approved/rejected),
role (participant/admin/super_admin/finance_admin/judge),
created_at, updated_at

-- 2. admin_accounts
id, user_id, role, permissions (JSONB),
created_by, created_at, is_active

-- 3. teams
id, competition_id, name, code, category,
institution, country, payment_status,
leader_id, max_members, status,
created_at, updated_at

-- 4. team_members
id, team_id, user_id, full_name, email,
institution, role (leader/member),
status (active/pending/removed), joined_at

-- 5. competitions
id, code, name, subtitle, description, status,
registration_start, registration_end,
event_start, event_end,
config (JSONB), theme (JSONB), settings (JSONB)

-- 6. stages
id, competition_id, name, order_index,
start_date, end_date, status,
is_active, is_visible

-- 7. tasks
id, stage_id, competition_id, name, type,
instructions, max_file_size_mb, deadline,
is_required, is_published, rubric (JSONB)

-- 8. submissions ⭐ CRITICAL
id, task_id, team_id, competition_id,
file_url (TEXT), file_name, file_size, drive_file_id,
status (draft/submitted/graded),
total_score, feedback,
submitted_at, created_at

-- 9. payment_proofs ⭐ NEW
id, user_id, team_id, competition_id,
bank_name, account_holder, transfer_amount, transfer_date,
file_url (TEXT), file_name, file_size, drive_file_id,
status (pending/approved/rejected),
rejected_reason, verified_by, verified_at,
notes, created_at, updated_at

-- 10. announcements
id, competition_id, created_by, title, content,
type (urgent/general/result), is_published,
published_at, views_count

-- 11. judge_scores
id, submission_id, judge_id,
scores (JSONB), feedback,
recommendation, created_at, updated_at
```

---

### 4.3 File Upload Flow (Payment Proof & Submissions)

```
1. User selects file in browser (PDF/Image, max 5MB)
2. Frontend validates (type, size)
3. Frontend POST to n8n webhook (FormData)
4. n8n validates file
5. n8n uploads to Google Drive
6. Google Drive returns file ID & URL
7. n8n sets "Anyone with link can view" permission
8. n8n returns URL to frontend
9. Frontend saves URL + metadata to Supabase
10. Supabase confirms save
11. Frontend shows success message

Data Stored:
- Google Drive: PDF/Image file (binary) ~2-5 MB per file
- Supabase: file_url (TEXT) ~60 bytes
- Supabase: file_name (TEXT) ~30 bytes
- Supabase: file_size (INTEGER) 4 bytes
- Supabase: drive_file_id (TEXT) ~20 bytes
- Total Supabase: Per file ~200 bytes

Storage Calculation:
5,000 participants × 2 files each (payment + submission) = 10,000 files
10,000 files × 200 bytes = 2,000,000 bytes = ~2 MB
Supabase FREE: 500 MB
Usage: 0.4% ✅

Google Drive:
10,000 files × 3 MB average = 30 GB
Google One: 100 GB
Usage: 30% ✅
```

---

## 5. Infrastructure & Cost

### 5.1 Infrastructure Components

| Service | Tier | Cost/month | Includes |
|---------|------|------------|----------|
| **Supabase** | FREE | $0 | 50K MAU, 500 MB DB, 5 GB egress |
| **Google Drive** | Google One | $1.99 | 100 GB storage |
| **n8n** | Railway FREE | $0 | 500 hours/month, 512 MB RAM |
| **Cloudflare Pages** | FREE | $0 | Unlimited bandwidth, CDN |
| **Domain** | Namecheap | $10/year | Optional (.com) |
| **Email (SendGrid)** | FREE | $0 | 100 emails/day |
| **TOTAL** | | **$1.99/month** | ~Rp 31,000 |

---

### 5.2 Capacity Planning

| Participants | MAU | DB Size | File Storage | Cost |
|--------------|-----|---------|--------------|------|
| 5,000 | 5K | 2 MB | 30 GB | $1.99 |
| 10,000 | 10K | 4 MB | 60 GB | $1.99 |
| 20,000 | 20K | 8 MB | 100 GB | $1.99 (at limit) |
| 50,000 | 50K | 20 MB | 250 GB | $21.99* |

*Requires Google One upgrade to 200 GB ($2.99) + Supabase Pro ($25) if MAU > 50K

---

## 6. Success Metrics

### 6.1 Key Performance Indicators (KPIs)

| KPI | Target | Measurement |
|-----|--------|-------------|
| **Total Registrations** | 5,000 | Supabase users table |
| **Active Teams** | 1,000-2,000 | Supabase teams table |
| **Registration Completion Rate** | > 85% | Step 1 started → Step 6 completed |
| **Payment Approval Time** | < 48 hours | Upload → Approve timestamp |
| **Upload Success Rate** | > 99% | Successful uploads / attempts |
| **Average Upload Time** | < 5 seconds | Frontend timing |
| **User Satisfaction** | > 4.5/5 | Post-event survey |
| **Support Ticket Volume** | < 50 tickets | Support system |
| **System Uptime** | > 99.9% | Uptime monitoring |
| **Admin Efficiency** | 50 approvals/hour | Admin actions log |

---

## 7. Testing Scenarios

### 7.1 Critical Paths (Must Test)

```
1. Registration (6 steps) → Payment Upload → Pending → Admin Approve → Login
2. Upload payment proof (valid PDF) → Preview → Save to Supabase → View in Google Drive
3. Upload payment proof (invalid: wrong type) → Error message
4. Upload payment proof (invalid: too large) → Error message
5. Admin approve user → User can login
6. Admin reject user → User sees reason
7. Admin approve payment → User notified
8. Admin reject payment → User can re-upload
9. Create admin account → New admin can access dashboard
10. Concurrent uploads (10 users) → All succeed
11. Judge scoring → Total score calculation → Winner ranking
12. Announcement publish → Appears in user dashboard
13. Timeline update → Reflected in landing page
14. Export data → CSV/PDF download
15. Role-based access control → Proper restrictions
```

---

## 8. Deployment Plan

### 8.1 Phased Rollout (14 Days)

**Phase 1: Development (Day 1-3)**
```
□ Setup Supabase project
□ Run database migration
□ Setup n8n workflow
□ Configure Google Drive OAuth
□ Local development
□ Test registration flow
□ Test payment upload
```

**Phase 2: Staging (Day 4-7)**
```
□ Deploy to staging (Cloudflare Pages)
□ Connect to Supabase production
□ Test end-to-end flow
□ Admin dashboard testing
□ Payment approval testing
□ Load testing (100 concurrent users)
□ Bug fixes
```

**Phase 3: Production (Day 8-14)**
```
□ Deploy to production
□ DNS configuration
□ SSL certificate
□ Final testing
□ Admin training
□ Go live!
□ Monitor for 48 hours
```

---

## 9. Risks & Mitigation

### 9.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Supabase downtime** | High | Low | Monitor status page, have backup plan |
| **Google Drive API rate limit** | Medium | Medium | Implement queue system in n8n |
| **n8n instance crash** | High | Medium | Auto-restart, backup instance ready |
| **Database corruption** | Critical | Low | Daily backups, test restore monthly |
| **File upload failure** | High | Medium | Retry logic, clear error messages |
| **DDoS attack** | Critical | Low | Cloudflare DDoS protection |

---

### 9.2 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Traffic spike during deadline** | High | High | Auto-scaling, queue system |
| **Support overload** | Medium | High | FAQ, automated responses |
| **Data privacy violation** | Critical | Low | RLS, minimal data collection |
| **Budget overrun** | Medium | Low | Monitor usage, set alerts |
| **Admin error (wrong approval)** | Medium | Medium | Audit log, undo capability |

---

## 10. Appendix

### 10.1 Glossary

| Term | Definition |
|------|------------|
| **MAU** | Monthly Active Users |
| **RLS** | Row Level Security (Supabase feature) |
| **n8n** | Workflow automation tool (nodemation) |
| **OAuth** | Open Authorization (authentication protocol) |
| **CDN** | Content Delivery Network |
| **BMC** | Business Model Canvas |
| **RBAC** | Role-Based Access Control |
| **JWT** | JSON Web Token |

---

### 10.2 References

**Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [n8n Docs](https://docs.n8n.io)
- [Google Drive API](https://developers.google.com/drive)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [React Docs](https://react.dev)

**Tools:**
- Supabase: https://supabase.com
- n8n: https://n8n.io
- Railway: https://railway.app
- Google Cloud: https://console.cloud.google.com
- Cloudflare: https://dash.cloudflare.com

---

**PRD Status:** ✅ **READY FOR DEVELOPMENT**

**Next Steps:**
1. ✅ Review PRD with stakeholders
2. ✅ Get approval signatures
3. ✅ Create technical specifications
4. ✅ Start development sprint
5. ✅ Implement according to this PRD

---

**End of Document**
