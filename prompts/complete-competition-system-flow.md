# 🏆 CIBC Power by KATH - Complete Competition Management System

## 📋 Project Overview & Flow

**Project:** CIBC Power by KATH - International Competition Platform  
**Type:** Competition Management System (CMS)  
**Users:** Public → Participants → Admin  
**Flow:** Landing Page → Registration → Verification → Login → Dashboard  

---

## 🎯 COMPLETE USER FLOW (CRITICAL!)

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER JOURNEY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PHASE 1: DISCOVERY (Public)                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. KATH Landing Page                                     │   │
│  │     - Company profile (KATH Event Organizer)              │   │
│  │     - Services, Portfolio, Testimonials                   │   │
│  │     - Link to CIBC Competition                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  2. CIBC Competition Landing Page                         │   │
│  │     - Competition details (CIBC Power by KATH 2026)       │   │
│  │     - Timeline, Prizes, Categories                        │   │
│  │     - Requirements, FAQ                                   │   │
│  │     - CTA: "Register Now"                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  PHASE 2: REGISTRATION                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  3. Registration Page                                     │   │
│  │     - Fill personal data                                  │   │
│  │     - Team formation (optional)                           │   │
│  │     - Upload documents                                    │   │
│  │     - Payment confirmation                                │   │
│  │     - Submit → PENDING VERIFICATION                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  PHASE 3: VERIFICATION (Admin Action)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  4. Admin Verifies Registration                           │   │
│  │     - Check payment                                       │   │
│  │     - Verify documents                                    │   │
│  │     - Approve/Reject                                      │   │
│  │     - Send verification email                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  PHASE 4: PARTICIPATION                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  5. Participant Login                                     │   │
│  │     - Email + Password                                    │   │
│  │     - If verified → Dashboard                             │   │
│  │     - If pending → Wait message                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  6. Participant Dashboard                                 │   │
│  │     - Timeline (competition stages)                       │   │
│  │     - Notifications (real-time)                           │   │
│  │     - Submissions (upload PDF)                            │   │
│  │     - Team management                                     │   │
│  │     - Profile settings                                    │   │
│  │     - ALL CONTENT CONTROLLED BY ADMIN!                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  PHASE 5: ADMIN CONTROL (CRITICAL!)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  7. Admin Dashboard                                       │   │
│  │     - Control ALL content:                                │   │
│  │       • KATH Landing Page content                         │   │
│  │       • CIBC Landing Page content                         │   │
│  │       • Participant Dashboard content                     │   │
│  │       • Announcements & Notifications                     │   │
│  │       • Timeline & Stages                                 │   │
│  │       • Verify registrations                              │   │
│  │       • Grade submissions                                 │   │
│  │       • Manage users & teams                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 CRITICAL UNDERSTANDING

### **This is a COMPETITION MANAGEMENT SYSTEM**

**NOT just a landing page!** This is a **full CMS** for managing:

```
✅ Competition lifecycle (registration → submission → grading)
✅ User verification (payment, documents)
✅ Content management (landing pages, dashboards)
✅ Real-time notifications
✅ Admin control over ALL content
✅ Multi-role access (public, participant, admin)
```

---

## 🏗️ SYSTEM ARCHITECTURE

### **Three User Roles:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ROLES & ACCESS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. PUBLIC (Unauthenticated)                                     │
│     ✅ View KATH Landing Page                                    │
│     ✅ View CIBC Landing Page                                    │
│     ✅ Read competition info                                     │
│     ✅ Register                                                  │
│     ❌ Cannot access dashboard                                   │
│     ❌ Cannot submit                                             │
│                                                                  │
│  2. PARTICIPANT (Authenticated, Verified)                        │
│     ✅ All public access                                         │
│     ✅ Access Participant Dashboard                              │
│     ✅ View timeline                                             │
│     ✅ Receive notifications                                     │
│     ✅ Submit documents                                          │
│     ✅ Manage team                                               │
│     ✅ Update profile                                            │
│     ❌ Cannot admin content                                      │
│     ❌ Cannot grade                                              │
│                                                                  │
│  3. ADMIN (Authenticated, Super Admin)                           │
│     ✅ All participant access                                    │
│     ✅ Access Admin Dashboard                                    │
│     ✅ CONTROL ALL CONTENT:                                      │
│        • KATH Landing Page sections                              │
│        • CIBC Landing Page sections                              │
│        • Participant Dashboard content                           │
│        • Announcements                                           │
│        • Timeline & stages                                       │
│     ✅ Verify registrations                                      │
│     ✅ Grade submissions                                         │
│     ✅ Manage users & teams                                      │
│     ✅ Send notifications                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA (Competition-Focused)

### **Core Tables:**

```sql
-- 1. USERS (All users: participants, admins, judges)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    phone TEXT,
    role TEXT CHECK(role IN ('participant', 'admin', 'judge')),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP
);

-- 2. REGISTRATIONS (Pending verifications)
CREATE TABLE registrations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    competition_id UUID REFERENCES competitions(id),
    status TEXT CHECK(status IN ('pending', 'verified', 'rejected')),
    payment_proof TEXT,
    documents JSONB,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP
);

-- 3. COMPETITIONS (CIBC 2026 only)
CREATE TABLE competitions (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE DEFAULT 'cibc-2026',
    name TEXT,
    description TEXT,
    timeline JSONB,
    config JSONB,
    is_active BOOLEAN DEFAULT true
);

-- 4. STAGES (Competition timeline)
CREATE TABLE stages (
    id UUID PRIMARY KEY,
    competition_id UUID,
    name TEXT,
    order_index INTEGER,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true
);

-- 5. TASKS (Submissions per stage)
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    stage_id UUID,
    name TEXT,
    type TEXT CHECK(type IN ('file_upload', 'text', 'link')),
    deadline TIMESTAMP,
    is_published BOOLEAN DEFAULT false
);

-- 6. TEAMS (Participant teams)
CREATE TABLE teams (
    id UUID PRIMARY KEY,
    competition_id UUID,
    name TEXT,
    status TEXT CHECK(status IN ('draft', 'registered', 'active')),
    created_at TIMESTAMP
);

-- 7. TEAM_MEMBERS
CREATE TABLE team_members (
    id UUID PRIMARY KEY,
    team_id UUID,
    user_id UUID,
    role TEXT CHECK(role IN ('leader', 'member')),
    joined_at TIMESTAMP
);

-- 8. SUBMISSIONS
CREATE TABLE submissions (
    id UUID PRIMARY KEY,
    task_id UUID,
    team_id UUID,
    file_url TEXT,
    file_size INTEGER,
    status TEXT CHECK(status IN ('draft', 'submitted', 'graded')),
    total_score DECIMAL,
    feedback TEXT,
    submitted_at TIMESTAMP
);

-- 9. ANNOUNCEMENTS (Admin-controlled content)
CREATE TABLE announcements (
    id UUID PRIMARY KEY,
    competition_id UUID,
    title TEXT,
    content TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- 10. NOTIFICATIONS (Real-time updates)
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID,
    title TEXT,
    message TEXT,
    type TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP
);

-- 11. LANDING_PAGE_CONTENT (Admin-controlled sections)
CREATE TABLE landing_page_content (
    id UUID PRIMARY KEY,
    page TEXT CHECK(page IN ('kath', 'cibc')),
    section TEXT,
    content JSONB,
    is_published BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP
);
```

---

## 🔌 API ENDPOINTS (Required)

### **Public Endpoints (No Auth)**

```typescript
// Landing Pages
GET  /api/v1/public/kath-landing        // KATH landing content
GET  /api/v1/public/cibc-landing        // CIBC landing content
GET  /api/v1/public/competition         // Competition details
GET  /api/v1/public/timeline            // Competition timeline
GET  /api/v1/public/faq                 // FAQ content

// Registration
POST /api/v1/auth/register              // Register new user
POST /api/v1/registrations              // Submit registration
GET  /api/v1/registrations/status       // Check verification status
```

### **Participant Endpoints (Auth Required)**

```typescript
// Dashboard
GET  /api/v1/participant/dashboard      // Dashboard overview
GET  /api/v1/participant/timeline       // Competition timeline
GET  /api/v1/participant/notifications  // Get notifications

// Submissions
GET  /api/v1/participant/submissions    // Get own submissions
POST /api/v1/participant/submissions    // Submit document
PUT  /api/v1/participant/submissions/:id // Update submission

// Team
GET  /api/v1/participant/team           // Get team info
POST /api/v1/participant/team           // Create team
PUT  /api/v1/participant/team/:id       // Update team
POST /api/v1/participant/team/invite    // Invite members

// Profile
GET  /api/v1/participant/profile        // Get profile
PUT  /api/v1/participant/profile        // Update profile
```

### **Admin Endpoints (Admin Auth Required)**

```typescript
// Content Management (CRITICAL!)
GET    /api/v1/admin/landing-content    // Get all landing content
PUT    /api/v1/admin/landing-content/:section  // Update section
POST   /api/v1/admin/landing-content    // Create new section

// Competition Management
GET    /api/v1/admin/competition        // Get competition details
PUT    /api/v1/admin/competition        // Update competition
PUT    /api/v1/admin/timeline           // Update timeline
PUT    /api/v1/admin/stages/:id/activate // Activate stage

// Registration Verification
GET    /api/v1/admin/registrations      // Get all registrations
PUT    /api/v1/admin/registrations/:id/verify   // Verify registration
PUT    /api/v1/admin/registrations/:id/reject   // Reject registration

// Submissions & Grading
GET    /api/v1/admin/submissions        // Get all submissions
PUT    /api/v1/admin/submissions/:id/grade      // Grade submission

// Announcements & Notifications
GET    /api/v1/admin/announcements      // Get all announcements
POST   /api/v1/admin/announcements      // Create announcement
PUT    /api/v1/admin/announcements/:id  // Update announcement
POST   /api/v1/admin/notifications      // Send notification

// Users & Teams
GET    /api/v1/admin/users              // Get all users
GET    /api/v1/admin/teams              // Get all teams
PUT    /api/v1/admin/teams/:id/status   // Update team status
```

---

## 🎨 FRONTEND PAGES STRUCTURE

### **1. Public Pages**

```
/ (KATH Landing Page)
├── Hero Section
├── About (Narrative Text)
├── Services
├── Portfolio
├── Statistics
├── Testimonials
├── FAQ
├── Contact
└── Link to CIBC Competition

/cibc (CIBC Competition Landing Page)
├── Hero (Competition branding)
├── About Competition
├── Timeline (stages)
├── Categories & Prizes
├── Requirements
├── FAQ (competition-specific)
└── Register CTA
```

### **2. Auth Pages**

```
/register (Registration)
├── Personal Information Form
├── Team Formation (optional)
├── Document Upload
├── Payment Confirmation
└── Submit → Pending Verification

/login (Login)
├── Email & Password
├── Remember Me
└── Redirect based on role:
    - Verified participant → /dashboard
    - Pending → /registration/status
    - Admin → /admin/dashboard
```

### **3. Participant Dashboard**

```
/dashboard (Participant Dashboard)
├── Overview Tab
│   ├── Welcome Banner
│   ├── Competition Status
│   ├── Quick Stats
│   └── Recent Notifications
│
├── Timeline Tab
│   ├── Competition Stages
│   ├── Current Stage (highlighted)
│   ├── Deadlines
│   └── Submission Status
│
├── Submissions Tab
│   ├── List of Tasks
│   ├── Upload PDF (via n8n → Google Drive)
│   ├── Submission History
│   └── Grades & Feedback
│
├── Team Tab
│   ├── Team Members
│   ├── Invite Members
│   └── Team Settings
│
├── Notifications Tab
│   ├── Real-time Updates
│   ├── Announcements
│   └── Mark as Read
│
└── Settings Tab
    ├── Profile
    ├── Password
    └── Preferences
```

### **4. Admin Dashboard**

```
/admin/dashboard (Admin Dashboard)
├── Overview Tab
│   ├── Competition Stats
│   ├── Registrations Pending
│   ├── Submissions Overview
│   └── Recent Activity
│
├── Content Management Tab (CRITICAL!)
│   ├── KATH Landing Page Sections
│   │   ├── Hero Content
│   │   ├── About Content
│   │   ├── Services Content
│   │   └── ... (all sections)
│   │
│   ├── CIBC Landing Page Sections
│   │   ├── Hero Content
│   │   ├── Timeline Content
│   │   ├── FAQ Content
│   │   └── ... (all sections)
│   │
│   └── Edit/Publish Controls
│
├── Registrations Tab
│   ├── Pending Verifications
│   ├── Verify Payment
│   ├── Approve/Reject
│   └── Send Email
│
├── Timeline Management Tab
│   ├── Edit Stages
│   ├── Activate/Deactivate
│   ├── Set Deadlines
│   └── Update Progress
│
├── Submissions Tab
│   ├── All Submissions
│   ├── Grade Submissions
│   ├── Download Files
│   └── Give Feedback
│
├── Announcements Tab
│   ├── Create Announcement
│   ├── Edit/Publish
│   └── Send to Participants
│
├── Users & Teams Tab
│   ├── All Users
│   ├── All Teams
│   ├── Verify/Disqualify
│   └── Export Data
│
└── Settings Tab
    ├── Competition Settings
    ├── Email Templates
    └── Admin Users
```

---

## 🔄 CRITICAL FLOWS

### **Flow 1: Registration → Verification → Dashboard**

```
1. User fills registration form
   ↓
2. Uploads payment proof & documents
   ↓
3. Submits → Status: PENDING
   ↓
4. Admin receives notification
   ↓
5. Admin checks payment & documents
   ↓
6. Admin clicks "Verify" or "Reject"
   ↓
7. System sends email to user
   ↓
8. User logs in:
   - If verified → Access Dashboard ✅
   - If pending → "Waiting for verification"
   - If rejected → "Registration rejected" + reason
```

### **Flow 2: Admin Updates Content → Live on Landing/Dashboard**

```
1. Admin logs in to Admin Dashboard
   ↓
2. Goes to "Content Management" tab
   ↓
3. Selects section to edit:
   - KATH Landing → Hero Section
   - CIBC Landing → Timeline
   - Dashboard → Announcement
   ↓
4. Edits content (WYSIWYG editor)
   ↓
5. Clicks "Publish"
   ↓
6. Content updated in database
   ↓
7. Real-time update on:
   - KATH Landing Page (public)
   - CIBC Landing Page (public)
   - Participant Dashboard (real-time)
   ↓
8. Notifications sent to participants
```

### **Flow 3: Submission → Grading → Feedback**

```
1. Participant uploads PDF via dashboard
   ↓
2. n8n webhook → Upload to Google Drive
   ↓
3. Save URL to database (submissions table)
   ↓
4. Admin receives notification
   ↓
5. Admin downloads PDF from Drive URL
   ↓
6. Admin grades submission:
   - Score per criteria
   - Overall feedback
   ↓
7. Admin submits grade
   ↓
8. Participant receives notification
   ↓
9. Participant views grade & feedback in dashboard
```

---

## 🎯 ADMIN CONTROL POINTS (CRITICAL!)

### **What Admin Can Control:**

```
✅ LANDING PAGES:
   • All KATH Landing sections (Hero, About, Services, etc)
   • All CIBC Landing sections (Timeline, FAQ, Prizes, etc)
   • Publish/Unpublish sections
   • Edit content in real-time

✅ PARTICIPANT DASHBOARD:
   • Timeline content (stages, deadlines)
   • Announcements
   • Notifications (send to all/specific users)
   • Task requirements

✅ REGISTRATIONS:
   • View all registrations
   • Verify payment
   • Approve/Reject
   • Send email notifications

✅ SUBMISSIONS:
   • View all submissions
   • Download files (from Google Drive)
   • Grade with rubric
   • Give feedback
   • Export grades

✅ USERS & TEAMS:
   • View all users
   • View all teams
   • Disqualify teams
   • Export participant data

✅ COMPETITION SETTINGS:
   • Competition dates
   • Prize information
   • Categories
   • Rules & requirements
```

---

## 💾 DATA MODEL (Simplified)

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA RELATIONSHIPS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  users (role: participant)                                       │
│  │                                                               │
│  ├──→ registrations (status: pending/verified)                  │
│  │                                                               │
│  ├──→ teams (role: leader/member)                               │
│  │   │                                                           │
│  │   └──→ submissions (file_url → Google Drive)                 │
│  │                                                               │
│  └──→ notifications (is_read: true/false)                       │
│                                                                  │
│  users (role: admin)                                             │
│  │                                                               │
│  ├──→ landing_page_content (CRUD all sections)                  │
│  │                                                               │
│  ├──→ announcements (create/publish)                            │
│  │                                                               │
│  ├──→ registrations (verify/reject)                             │
│  │                                                               │
│  └──→ submissions (grade/feedback)                              │
│                                                                  │
│  competitions (cibc-2026 only)                                   │
│  │                                                               │
│  ├──→ stages (timeline)                                          │
│  │   │                                                           │
│  │   └──→ tasks (submissions)                                    │
│  │                                                               │
│  └──→ teams (participants)                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTATION REQUIREMENTS

### **Must-Have Features:**

```
✅ Multi-role authentication (participant, admin, judge)
✅ Registration with verification workflow
✅ Payment verification (manual by admin)
✅ Email notifications (verification, updates)
✅ Real-time dashboard updates
✅ Admin content management (all landing pages)
✅ PDF upload via n8n → Google Drive
✅ Grading system with rubric
✅ Team management
✅ Announcement system
✅ Timeline management
```

### **Nice-to-Have Features:**

```
⚪ Live leaderboard
⚪ Real-time chat (admin ↔ participant)
⚪ Video submission support
⚪ Plagiarism check
⚪ Automated email reminders
⚪ Export to Excel/PDF
⚪ Analytics dashboard
```

---

## 📝 PROMPT FOR AI IMPLEMENTATION

**Copy this to your AI assistant:**

```
You are building a **Competition Management System** for CIBC Power by KATH 2026.

**CRITICAL UNDERSTANDING:**
This is NOT just a landing page. This is a FULL CMS with:
1. Public landing pages (KATH + CIBC)
2. Registration with admin verification
3. Participant Dashboard (timeline, submissions, notifications)
4. Admin Dashboard (control ALL content, verify users, grade submissions)

**USER FLOW:**
1. Public views KATH Landing → CIBC Landing
2. Registers → Pending verification
3. Admin verifies payment & documents → Sends email
4. User logs in → If verified, access Dashboard
5. Participant submits PDFs, views timeline, gets notifications
6. Admin controls ALL content, grades submissions, manages users

**TECH STACK:**
- Frontend: React (Cloudflare Pages)
- Backend: Supabase (PostgreSQL + Auth + Storage)
- File Upload: n8n → Google Drive
- Cost: $0/month (all FREE tiers)

**DATABASE SCHEMA:**
[Copy schema from above]

**API ENDPOINTS:**
[Copy endpoints from above]

**PAGES STRUCTURE:**
[Copy pages structure from above]

**ADMIN CONTROL:**
Admin must be able to control ALL content:
- KATH Landing Page sections
- CIBC Landing Page sections
- Participant Dashboard content
- Announcements & notifications
- Timeline & stages
- Registration verification
- Submission grading

Implement this system with proper:
- Row Level Security (RLS)
- Role-based access control
- Real-time updates
- Email notifications
- File upload workflow

Start with database schema, then services, then pages.
```

---

## ✅ SUCCESS CRITERIA

```
✅ Public can view KATH & CIBC landing pages
✅ Users can register & upload payment proof
✅ Admin can verify/reject registrations
✅ Verified users can login to dashboard
✅ Dashboard shows timeline, notifications, submissions
✅ Admin can control ALL content from admin dashboard
✅ PDF upload works (n8n → Google Drive)
✅ Admin can grade submissions
✅ Real-time notifications work
✅ Email notifications sent on verification
✅ Mobile responsive
✅ Secure (RLS, auth, proper access control)
```

---

**This is the COMPLETE flow of a competition management system!** 🏆

**Ready to implement?** 🚀
