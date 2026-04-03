# 📄 Product Requirements Document (PRD)

## CIBC Competition Platform 2026

**Version:** 2.0.0  
**Last Updated:** 2026-04-02  
**Status:** Ready for Development  
**Architecture:** Supabase FREE + n8n + Google Drive (Google One 100GB)

---

## 1. Executive Summary

### 1.1 Product Overview

**Product Name:** CIBC (CIBC Power by KATH) Competition Platform  
**Product Type:** Competition Management System with Payment Verification  
**Target Users:** 5,000 participants (international competition)  
**Competition Type:** Business Case Competition (BMC)  
**Geographic Scope:** International (Indonesia, Malaysia, Singapore, etc.)

**Mission:**  
Provide a scalable, reliable, and cost-effective platform for managing international competition with seamless registration, team management, payment verification, and submission processes.

**Vision:**  
Become the benchmark for competition management platforms in Southeast Asia with zero-friction registration and professional-grade administration tools.

---

### 1.2 Key Objectives

| Objective | Success Metric | Target |
|-----------|---------------|--------|
| **Scalability** | Handle concurrent registrations | 5,000 participants |
| **Performance** | Page load time | < 2 seconds |
| **Performance** | API response time | < 200ms (normal), < 1000ms (peak) |
| **Reliability** | System uptime | 99.9% |
| **Cost** | Monthly infrastructure cost | < $5/month |
| **Conversion** | Registration completion rate | > 85% |
| **Payment** | Payment verification time | < 48 hours |
| **User Experience** | Registration satisfaction | > 4.5/5 |
| **Security** | Data protection | RLS enabled, HTTPS enforced |

---

### 1.3 Constraints & Assumptions

**Constraints:**
- **Budget:** Maximum $5/month infrastructure cost
- **Timeline:** Must be production-ready within 2 weeks
- **Team:** Limited DevOps resources (no dedicated DevOps engineer)
- **Storage:** Cannot use Cloudflare R2 (not available)
- **Payment:** Manual bank transfer only (no payment gateway)

**Assumptions:**
- Participants have stable internet connection (min. 5 Mbps)
- Participants use modern browsers (Chrome, Firefox, Safari, Edge)
- Google One 100 GB subscription is already active ($1.99/month)
- n8n can be hosted on Railway/Render FREE tier
- Cloudflare Pages is available for frontend hosting
- Bank transfer is the primary payment method in target markets

---

## 2. Product Scope

### 2.1 In Scope (MVP - Phase 1)

| Module | Feature | Priority | Description |
|--------|---------|----------|-------------|
| **Auth & Registration** | Multi-step Registration | P0 | 6-step registration with payment upload |
| **Auth & Registration** | Login/Logout | P0 | Email-password authentication |
| **Auth & Registration** | Admin Approval Workflow | P0 | Manual approval for all new users |
| **Auth & Registration** | Payment Proof Upload | P0 | Upload bank transfer receipt |
| **Auth & Registration** | Pending Approval Page | P0 | Status page while waiting approval |
| **User Dashboard** | Overview Dashboard | P0 | Competition info, timeline, status |
| **User Dashboard** | Team Management | P0 | Create/join team, manage members |
| **User Dashboard** | Submission Management | P0 | Upload proposals, view status |
| **User Dashboard** | Profile Management | P1 | Edit personal information |
| **Admin Dashboard** | Admin Account Management | P0 | Create/manage admin accounts |
| **Admin Dashboard** | User Approval | P0 | Approve/reject user registrations |
| **Admin Dashboard** | Payment Approval | P0 | Review and approve payment proofs |
| **Admin Dashboard** | User Management | P1 | View, search, filter all users |
| **Admin Dashboard** | Team Management | P1 | View all teams, export data |
| **Admin Dashboard** | Submission Management | P1 | View all submissions, download |
| **Admin Dashboard** | Competition Control | P1 | Open/close registration, manage stages |
| **Admin Dashboard** | Announcements | P1 | Post competition updates |
| **Admin Dashboard** | Reports & Analytics | P2 | Statistics, export reports |
| **File Management** | File Upload via n8n | P0 | Upload to Google Drive via webhook |
| **File Management** | File Preview | P1 | Preview images/PDFs in admin |
| **Notifications** | Email Notifications | P2 | Approval/rejection notifications |

---

### 2.2 Out of Scope (Post-MVP)

| Feature | Reason | Future Consideration |
|---------|--------|---------------------|
| **Payment Gateway** | Complexity, integration time | Phase 3 (Midtrans, Stripe) |
| **Social Login** | Not critical for MVP | Phase 2 (Google, GitHub) |
| **Email Verification** | Can use manual approval | Phase 2 |
| **Mobile App** | Web-first approach | Phase 3 (React Native) |
| **Real-time Notifications** | Complexity | Phase 2 (WebSocket, Push) |
| **Video Submission** | Storage intensive | Phase 3 |
| **Multi-competition** | Single competition for now | Phase 3 |
| **Advanced Analytics** | Not critical for MVP | Phase 3 |
| **Judging System** | Can use offline judging | Phase 2 |
| **Certificate Generation** | Manual for now | Phase 2 |

---

## 3. User Personas

### 3.1 Primary Personas

#### **Persona 1: Participant (Peserta)**

**Name:** Andi Pratama  
**Age:** 22  
**Occupation:** University Student  
**Location:** Jakarta, Indonesia  

**Goals:**
- Register for competition easily (under 10 minutes)
- Understand payment process clearly
- Form a team with friends from different universities
- Upload competition proposal without technical issues
- Track payment and submission status
- Receive timely updates from organizers

**Frustrations:**
- Complicated multi-step forms without progress indication
- Unclear payment instructions
- File upload failures without clear error messages
- Long waiting time for approval without communication
- Lack of visibility into application status

**Technical Proficiency:** Intermediate  
**Device:** Laptop (primary) + Smartphone (secondary)  
**Browser:** Chrome, Safari  
**Internet:** 20-50 Mbps (campus WiFi)

**Quote:**  
*"Saya mau daftar kompetisi yang gampang, nggak ribet. Transfer bank oke, tapi jangan sampe nunggu lama nggak ada kabar."*

---

#### **Persona 2: Team Leader**

**Name:** Siti Nurhaliza  
**Age:** 24  
**Occupation:** Master's Student  
**Location:** Kuala Lumpur, Malaysia  

**Goals:**
- Create and manage team efficiently
- Invite members from multiple universities/countries
- Coordinate payment (one person pays for all)
- Monitor team registration progress
- Communicate with organizers on behalf of team
- Ensure all team members are approved

**Frustrations:**
- Difficulty inviting international members
- Unclear team roles and responsibilities
- Payment confusion (who pays, how much)
- Last-minute registration rush
- Technical issues during critical moments

**Technical Proficiency:** Advanced  
**Device:** Laptop  
**Browser:** Chrome, Firefox  
**Internet:** 50-100 Mbps (home fiber)

**Quote:**  
*"Sebagai leader, saya butuh kontrol penuh atas tim saya. Jangan sampe ada anggota yang belum approved tapi nggak tahu."*

---

#### **Persona 3: Admin/Organizer**

**Name:** Budi Santoso  
**Age:** 35  
**Occupation:** Event Organizer - Competition Manager  
**Location:** Surabaya, Indonesia  

**Goals:**
- Manage competition settings easily
- Review and approve user registrations quickly
- Verify payment proofs efficiently (with preview)
- Monitor registration statistics in real-time
- Export data for reporting to stakeholders
- Communicate updates to all participants
- Manage admin team (add/remove admins)

**Frustrations:**
- Manual data management (Excel-based)
- Lack of visibility into payment status
- Difficulty tracking which users are pending
- No centralized admin management
- Time-consuming repetitive tasks
- Cannot delegate to other admins easily

**Technical Proficiency:** Intermediate  
**Device:** Laptop  
**Browser:** Chrome  
**Internet:** 20-50 Mbps (office)

**Quote:**  
*"Saya butuh dashboard yang bisa manage semua registrasi dan pembayaran dengan cepat. Jangan sampe admin baru nggak bisa bantu approve."*

---

### 3.2 Secondary Personas

#### **Persona 4: Finance Admin**

**Goals:**
- Review payment proofs specifically
- Verify bank transfer details
- Approve/reject payments with clear reasons
- Export payment reports for accounting
- Track total collected fees

**Access Level:** Limited (payment approvals only)

---

#### **Persona 5: Judge**

**Goals:**
- Access assigned submissions
- Review proposals (PDF download)
- Submit scores and feedback
- View grading rubric and criteria

**Access Level:** Limited (submissions & judging only)

---

#### **Persona 6: Observer/Viewer**

**Goals:**
- View competition information
- Read announcements and updates
- View public leaderboard (if enabled)
- Download competition brochure

**Access Level:** Read-only (no login required for landing page)

---

## 4. User Stories

### 4.1 Registration & Authentication

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| **AUTH-01** | As a participant, I want to register via multi-step form so that I can provide all required information progressively | - 6 steps: Account → Personal → Category → Team → Project → Payment<br>- Progress indicator visible<br>- Can go back to previous steps<br>- Validation per step<br>- Save progress temporarily | P0 |
| **AUTH-02** | As a participant, I want to upload payment proof so that I can confirm my bank transfer | - Upload PDF/Image (max 5MB)<br>- Preview before submit<br>- Enter bank details (bank name, account holder, amount, date)<br>- Show admin bank account info<br>- Validate file type and size | P0 |
| **AUTH-03** | As a participant, I want to see pending status after registration so that I know my application is being reviewed | - Redirect to pending approval page<br>- Clear explanation of next steps<br>- Expected timeline (1-3 days)<br>- Contact info for support<br>- Cannot login until approved | P0 |
| **AUTH-04** | As a participant, I want to login after approval so that I can access my dashboard | - Email-password login<br>- Check approval status on login<br>- Show rejection reason if rejected<br>- Redirect to dashboard if approved<br>- Session persists after refresh | P0 |
| **AUTH-05** | As an admin, I want to create new admin accounts so that I can delegate approval tasks | - Create admin from existing user<br>- Assign role (admin, super_admin, finance_admin)<br>- Set permissions<br>- Send invitation email<br>- Deactivate admin when needed | P0 |
| **AUTH-06** | As an admin, I want to manage admin accounts so that I can control access | - View all admins<br>- Edit admin roles<br>- Deactivate admin<br>- Transfer ownership<br>- Audit log of admin actions | P1 |

---

### 4.2 Admin User Approval

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| **APPR-01** | As an admin, I want to view pending user approvals so that I can review new registrations | - List all pending users<br>- Filter by category (student/startup/corporate)<br>- Search by email/name/institution<br>- Sort by registration date<br>- Show count of pending approvals | P0 |
| **APPR-02** | As an admin, I want to approve user registrations so that they can access the platform | - One-click approve<br>- Bulk approve (select multiple)<br>- Confirmation dialog<br>- Send approval email<br>- Update user status immediately | P0 |
| **APPR-03** | As an admin, I want to reject user registrations so that I can filter out ineligible participants | - Reject with reason (required)<br>- Predefined reasons + custom<br>- Send rejection email<br>- User can re-apply if needed<br>- Track rejection statistics | P0 |
| **APPR-04** | As an admin, I want to view user details so that I can make informed approval decisions | - View full profile<br>- See uploaded documents<br>- Check institution eligibility<br>- View team affiliation<br>- Contact information | P1 |

---

### 4.3 Admin Payment Approval

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| **PAY-01** | As a finance admin, I want to view pending payment proofs so that I can verify transfers | - List all pending payments<br>- Show amount, bank, date<br>- Preview payment proof (image/PDF)<br>- Filter by amount/status/bank<br>- Search by user/team | P0 |
| **PAY-02** | As a finance admin, I want to approve payment proofs so that users can complete registration | - One-click approve<br>- View full-size proof<br>- Download proof for records<br>- Update payment status<br>- Send confirmation email | P0 |
| **PAY-03** | As a finance admin, I want to reject payment proofs so that I can request valid proof | - Reject with reason (required)<br>- Common reasons dropdown<br>- User notified immediately<br>- User can re-upload<br>- Track rejection rate | P0 |
| **PAY-04** | As a finance admin, I want to export payment reports so that I can reconcile with bank statements | - Export to CSV/Excel<br>- Filter by date range<br>- Include all payment details<br>- Total amounts summary<br>- Scheduled reports (optional) | P1 |
| **PAY-05** | As a finance admin, I want to view payment statistics so that I can track collection progress | - Total collected amount<br>- Pending amount<br>- Rejected count<br>- Payment timeline chart<br>- Bank-wise breakdown | P1 |

---

### 4.4 Team Management

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| **TEAM-01** | As a participant, I want to create a team so that I can compete with others | - Enter team name<br>- Select category<br>- Set institution<br>- Auto-generate team code<br>- Become team leader automatically | P0 |
| **TEAM-02** | As a team leader, I want to invite members so that we can form a complete team | - Generate invite link/code<br>- Send via email/WhatsApp<br>- Set member limit (2-5 or 2-10)<br>- Track invitation status (pending/accepted)<br>- Resend invitations | P0 |
| **TEAM-03** | As a member, I want to join a team so that I can participate | - Enter team code or click link<br>- Verify team details before joining<br>- Confirm joining<br>- See team members list<br>- Cannot join if team is full | P0 |
| **TEAM-04** | As a team leader, I want to remove members so that I can manage team composition | - View member list with status<br>- Remove member with confirmation<br>- Member notified of removal<br>- Update team status<br>- Cannot remove self (must transfer leadership) | P1 |
| **TEAM-05** | As a team leader, I want to transfer leadership so that I can assign new leader | - Select new leader from members<br>- Member must accept<br>- Leadership transferred<br>- Old leader becomes member<br>- Notification to all members | P1 |

---

### 4.5 Admin Dashboard & Management

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| **ADMIN-01** | As an admin, I want to view dashboard overview so that I can monitor competition health | - Total registrations (approved/pending)<br>- Total teams formed<br>- Total payments collected<br>- Submission statistics<br>- Timeline countdown<br>- Recent activities | P0 |
| **ADMIN-02** | As an admin, I want to manage all users so that I can oversee the participant base | - View all users in table<br>- Advanced filters (status, category, country)<br>- Search by email/name/institution<br>- Export user list<br>- Bulk actions (approve, reject, email) | P1 |
| **ADMIN-03** | As an admin, I want to manage all teams so that I can track team formation | - View all teams<br>- Filter by category/status<br>- View team members<br>- Export team list<br>- Dissolve team if needed | P1 |
| **ADMIN-04** | As an admin, I want to manage competition settings so that I can control the flow | - Open/close registration<br>- Manage stages (activate/deactivate)<br>- Extend deadlines<br>- Publish/hide leaderboard<br>- Update competition info | P1 |
| **ADMIN-05** | As an admin, I want to post announcements so that I can communicate updates | - Create announcement with rich text<br>- Set type (urgent, general, result)<br>- Schedule publish date<br>- Target audience (all, specific groups)<br>- View analytics (views, clicks) | P1 |
| **ADMIN-06** | As an admin, I want to view analytics so that I can report to stakeholders | - Registration funnel (visitors → registrants → approved → paid)<br>- Geographic distribution<br>- Category distribution<br>- Payment collection chart<br>- Submission timeline<br>- Export as PDF report | P2 |

---

### 4.6 Submission Management

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| **SUB-01** | As a participant, I want to upload competition submission so that I can participate in the competition | - Upload PDF via n8n → Google Drive<br>- Validate file type (PDF only)<br>- Validate file size (max 5MB)<br>- Show upload progress<br>- Success confirmation with file preview | P0 |
| **SUB-02** | As a participant, I want to view my submission history so that I know what I've submitted | - List all submissions by stage<br>- View file name, upload date<br>- See submission status<br>- Access file via Google Drive link<br>- Download own submission | P0 |
| **SUB-03** | As an admin, I want to view all submissions so that I can monitor progress | - Filter by stage/task/team<br>- View submission details<br>- Download submissions<br>- Export submission list<br>- Identify missing submissions | P1 |
| **SUB-04** | As an admin, I want to bulk download submissions so that I can distribute to judges | - Select multiple submissions<br>- Download as ZIP<br>- Organized by team/category<br>- Include metadata file<br>- Progress indicator for large downloads | P1 |

---

## 5. Technical Architecture

### 5.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    Cloudflare Pages (FREE)                       │
│  - React 19 + TypeScript + Vite                                  │
│  - Tailwind CSS + shadcn/ui                                      │
│  - Unlimited bandwidth via CDN                                   │
│  - GSAP for animations                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                    Supabase FREE Tier                            │
│  - PostgreSQL Database (500 MB)                                  │
│  - Authentication (50K MAU)                                      │
│  - Row Level Security (RLS)                                      │
│  - Real-time subscriptions (optional)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Webhook
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUTOMATION                                  │
│                  n8n (Railway FREE tier)                         │
│  - File upload webhook                                           │
│  - Google Drive integration                                      │
│  - File validation                                               │
│  - URL generation                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ OAuth 2.0
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        STORAGE                                   │
│              Google Drive (Google One 100 GB)                    │
│  - PDF file storage (submissions, payment proofs)                │
│  - Public link generation                                        │
│  - 100 GB capacity (expandable to 200GB)                         │
│  - $1.99/month                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Data Flow

#### **File Upload Flow (Payment Proof & Submissions):**

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
```

**Data Stored:**

| Location | Data Type | Size |
|----------|-----------|------|
| **Google Drive** | PDF/Image file (binary) | ~2-5 MB per file |
| **Supabase** | file_url (TEXT) | ~60 bytes |
| **Supabase** | file_name (TEXT) | ~30 bytes |
| **Supabase** | file_size (INTEGER) | 4 bytes |
| **Supabase** | drive_file_id (TEXT) | ~20 bytes |
| **Total Supabase** | Per file | ~200 bytes |

**Storage Calculation:**
```
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

### 5.3 Database Schema

**Core Tables:**

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
```

---

### 5.4 Security

**Authentication:**
- Supabase Auth (email/password)
- JWT tokens (auto-refresh)
- Session persistence (localStorage)
- Password hashing (bcrypt)
- Min. 8 characters, complexity required

**Authorization:**
- Row Level Security (RLS) enabled on all tables
- Role-based access control (RBAC):
  - **participant:** Own data only
  - **admin:** All data + approve users
  - **super_admin:** All data + manage admins
  - **finance_admin:** Payment approvals only
  - **judge:** Submissions only
- Team-based data isolation

**Data Protection:**
- HTTPS enforced (Cloudflare)
- Google Drive "Anyone with link can view" (not public indexable)
- No sensitive data in localStorage (only user ID, email)
- Environment variables for secrets
- Input validation (Zod schemas)

**File Security:**
- PDF/Image validation (type, size)
- File scan for malware (via n8n, optional)
- Access control via Google Drive permissions
- Signed URLs for downloads (future)

---

### 5.5 Performance

**Targets:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 2 seconds | Lighthouse |
| Time to Interactive | < 3 seconds | Lighthouse |
| API Response Time | < 200ms (normal) | Supabase logs |
| API Response Time | < 1000ms (peak) | Supabase logs |
| File Upload Time | < 5 seconds | Frontend timing |
| Concurrent Users | 500-1000 | Load testing |
| Uptime | 99.9% | Monitoring |

**Optimization Strategies:**

```
Frontend:
✅ Code splitting (vendor, gsap, radix)
✅ Asset hashing (cache busting)
✅ Lazy loading (React.lazy)
✅ Image optimization (WebP)
✅ CDN caching (Cloudflare)
✅ React Query / SWR (API caching)
✅ GSAP animations (optimized)

Backend:
✅ Database indexes (user_id, team_id, status)
✅ Connection pooling (Supavisor)
✅ Query optimization (SELECT only needed)
✅ RLS policies (security + performance)
✅ JSONB for flexible config

File Upload:
✅ Client-side validation (reduce failed uploads)
✅ Upload progress indicator (UX)
✅ Retry logic (failed uploads)
✅ Queue system (n8n, if needed)
✅ Compress images before upload
```

---

## 6. Infrastructure & Cost

### 6.1 Infrastructure Components

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

### 6.2 Capacity Planning

**Current Capacity (5K Participants):**

| Component | Limit | Usage | Buffer |
|-----------|-------|-------|--------|
| MAU | 50,000 | 5,000 | 90% ✅ |
| Database | 500 MB | ~2 MB | 99.6% ✅ |
| Egress | 5 GB | ~2.5 GB | 50% ✅ |
| File Storage | 100 GB | ~30 GB | 70% ✅ |
| Concurrent | 200 | ~50-100 | 50-75% ✅ |

**Growth Projection:**

| Participants | MAU | DB Size | File Storage | Cost |
|--------------|-----|---------|--------------|------|
| 5,000 | 5K | 2 MB | 30 GB | $1.99 |
| 10,000 | 10K | 4 MB | 60 GB | $1.99 |
| 20,000 | 20K | 8 MB | 100 GB | $1.99 (at limit) |
| 50,000 | 50K | 20 MB | 250 GB | $21.99* |

*Requires Google One upgrade to 200 GB ($2.99) + Supabase Pro ($25) if MAU > 50K

---

### 6.3 Scalability Plan

**Phase 1: 0-5K Participants (Current)**
```
✅ Supabase FREE
✅ Google One 100 GB
✅ n8n Railway FREE
✅ Cloudflare Pages FREE
```

**Phase 2: 5K-20K Participants**
```
⚠️ Monitor Google Drive usage
⚠️ Upgrade to Google One 200 GB if needed ($2.99)
✅ Supabase FREE still sufficient
✅ Consider n8n paid plan if rate limited ($20/month)
```

**Phase 3: 20K-50K Participants**
```
⚠️ Upgrade to Supabase Pro ($25/month)
⚠️ Upgrade Google One to 2 TB ($9.99)
✅ n8n paid plan ($20/month)
✅ Total: ~$55/month
```

**Phase 4: 50K+ Participants**
```
⚠️ Consider multi-tenant architecture
⚠️ Dedicated database instance
⚠️ Load balancing for n8n
⚠️ CDN for file downloads
✅ Total: ~$200-500/month
```

---

## 7. Admin Dashboard Features

### 7.1 Admin Account Management

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Create Admin** | Convert user to admin | P0 |
| **Role Assignment** | Assign role (admin, super_admin, finance_admin) | P0 |
| **Permission Management** | Set granular permissions | P1 |
| **Admin List** | View all admins with status | P0 |
| **Deactivate Admin** | Temporarily disable admin access | P1 |
| **Delete Admin** | Permanently remove admin | P1 |
| **Transfer Ownership** | Transfer super_admin role | P1 |
| **Audit Log** | Track admin actions | P2 |

**Admin Roles:**

| Role | Permissions | Use Case |
|------|-------------|----------|
| **super_admin** | Full access (all modules + admin management) | Platform owner |
| **admin** | User approval, payment approval, content management | Main organizer |
| **finance_admin** | Payment approvals only, export reports | Finance team |
| **judge** | View submissions, grade, add feedback | Competition judges |
| **observer** | Read-only access to all data | Stakeholders, sponsors |

---

### 7.2 User Approval Dashboard

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Pending Users List** | Table view of all pending users | P0 |
| **User Details Preview** | View full profile before approve | P0 |
| **Bulk Approve** | Approve multiple users at once | P1 |
| **Bulk Reject** | Reject multiple with common reason | P1 |
| **Search & Filter** | By email, name, institution, category | P0 |
| **Sort** | By registration date, category | P0 |
| **Export** | Export pending list to CSV | P1 |
| **Statistics** | Pending count, approval rate | P1 |

---

### 7.3 Payment Approval Dashboard

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Pending Payments List** | Card view of all pending payments | P0 |
| **Payment Proof Preview** | View image/PDF in modal | P0 |
| **Zoom & Download** | Zoom into proof, download for records | P0 |
| **Payment Details** | Bank, amount, date, account holder | P0 |
| **Quick Approve/Reject** | One-click actions | P0 |
| **Reject with Reason** | Dropdown + custom reason | P0 |
| **Search & Filter** | By user, team, amount, bank | P0 |
| **Export Reports** | CSV/Excel with totals | P1 |
| **Statistics Dashboard** | Collected, pending, rejected | P1 |

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  Payment Approvals                           [12 Pending]    │
├─────────────────────────────────────────────────────────────┤
│  Search: [_____________________]  Filter: [All Banks ▼]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 👤 Andi Pratama                    Rp 500.000        │   │
│  │    andi@email.com                  01 Apr 2026       │   │
│  │    Team: Innovation Squad                            │   │
│  │    Bank: BCA | Account: Andi Pratama                 │   │
│  │    File: proof_123.jpg (1.2 MB)                      │   │
│  │                                                      │   │
│  │    [👁️ View Proof]  [✅ Approve]  [❌ Reject]       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 👤 Siti Nurhaliza                  Rp 500.000        │   │
│  │    siti@email.com                  01 Apr 2026       │   │
│  │    Team: KL Startupers                               │   │
│  │    Bank: Mandiri | Account: Siti Nurhaliza           │   │
│  │    File: proof_456.pdf (0.8 MB)                      │   │
│  │                                                      │   │
│  │    [👁️ View Proof]  [✅ Approve]  [❌ Reject]       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.4 User Management Dashboard

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **All Users Table** | Paginated table view | P0 |
| **Advanced Filters** | Status, role, category, country | P0 |
| **Search** | Email, name, institution | P0 |
| **User Details** | Full profile view | P0 |
| **Edit User** | Update user info (admin override) | P1 |
| **Ban/Suspend** | Temporarily disable account | P1 |
| **Reset Password** | Admin-initiated password reset | P1 |
| **Export** | CSV/Excel export | P1 |
| **Bulk Email** | Send email to selected users | P2 |

---

### 7.5 Team Management Dashboard

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **All Teams List** | Card/table view | P0 |
| **Team Details** | Members, category, status | P0 |
| **Filter** | Category, status, institution | P0 |
| **Search** | Team name, code, members | P0 |
| **Export** | Team list with members | P1 |
| **Dissolve Team** | Delete team (admin action) | P1 |
| **Add Member** | Manually add member to team | P1 |
| **Transfer Leadership** | Change team leader | P1 |

---

### 7.6 Competition Control

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Open/Close Registration** | Toggle registration availability | P0 |
| **Manage Stages** | Activate/deactivate stages | P0 |
| **Extend Deadlines** | Update task deadlines | P1 |
| **Publish Leaderboard** | Toggle public visibility | P1 |
| **Update Competition Info** | Edit details, prizes, themes | P1 |
| **Emergency Mode** | Pause all activities | P2 |

---

### 7.7 Announcements

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Create Announcement** | Rich text editor | P0 |
| **Schedule Publish** | Set future publish date | P1 |
| **Target Audience** | All, specific groups, stages | P1 |
| **Priority Levels** | Urgent, general, result | P0 |
| **View Analytics** | Views, clicks, engagement | P1 |
| **Edit/Delete** | Update or remove announcements | P0 |

---

### 7.8 Reports & Analytics

**Features:**

| Feature | Description | Priority |
|---------|-------------|----------|
| **Registration Funnel** | Visitors → Registrants → Approved → Paid | P1 |
| **Geographic Distribution** | Map/chart by country | P1 |
| **Category Distribution** | Student vs Startup vs Corporate | P1 |
| **Payment Collection** | Timeline chart, bank breakdown | P1 |
| **Submission Timeline** | Submissions per day/week | P1 |
| **Export Reports** | PDF/CSV for stakeholders | P1 |
| **Custom Date Range** | Select period for reports | P2 |

---

## 8. User Experience

### 8.1 Design Principles

1. **Simplicity:** Minimal clicks to complete tasks
2. **Clarity:** Clear labels, instructions, and feedback
3. **Responsiveness:** Fast loading, smooth interactions
4. **Accessibility:** WCAG 2.1 AA compliance
5. **Mobile-First:** Optimized for mobile devices
6. **Consistency:** Unified design language across platform
7. **Professional:** Business case competition aesthetic
8. **International:** Support multiple languages (ID/EN)

---

### 8.2 Key User Flows

#### **Flow 1: Registration → Payment → Approval → Login**

```
1. Landing Page
   └── Click "Register Now"

2. Registration - Step 1: Account
   ├── Email
   ├── Password (min 8 chars)
   ├── Confirm Password
   ├── Agree to Terms
   └── Next →

3. Registration - Step 2: Personal
   ├── Full Name
   ├── Date of Birth
   ├── Phone Number
   ├── Country
   ├── City
   └── Next →

4. Registration - Step 3: Category
   ├── Select Category (Student/Startup/Corporate)
   ├── Institution/Company Name
   ├── Additional Details (based on category)
   └── Next →

5. Registration - Step 4: Team
   ├── Option A: Create New Team
   │   ├── Team Name
   │   └── Auto-generate Code
   ├── Option B: Join Existing Team
   │   └── Enter Team Code
   └── Next →

6. Registration - Step 5: Project
   ├── Project Name
   ├── One-line Description
   ├── Problem Statement
   ├── Solution Overview
   ├── SDG Alignment (select up to 3)
   └── Next →

7. Registration - Step 6: Payment ⭐ NEW
   ├── Admin Bank Account Info Display
   │   ├── Bank: BCA
   │   ├── Account Number: 1234567890
   │   ├── Account Holder: PT KATH Event Organizer
   │   └── Amount: Rp 500.000
   ├── Upload Payment Proof
   │   ├── Bank Name (dropdown + other)
   │   ├── Account Holder Name
   │   ├── Transfer Amount
   │   ├── Transfer Date
   │   └── File Upload (PDF/Image, max 5MB)
   │       └── Preview before submit
   └── Submit Registration

8. Pending Approval Page
   ├── Confirmation Message
   ├── Expected Timeline (1-3 days)
   ├── Next Steps
   ├── Contact Support
   └── Return to Login

9. Admin Reviews (Background)
   ├── Admin receives notification
   ├── Reviews user profile
   ├── Reviews payment proof (preview)
   ├── Approves or Rejects
   └── System sends email

10. User Receives Email
    ├── If Approved:
    │   ├── Congratulations message
    │   ├── Login link
    │   └── Access dashboard
    └── If Rejected:
        ├── Reason for rejection
        ├── Option to re-apply
        └── Contact support

11. User Logs In
    ├── Enter credentials
    ├── System checks approval status
    ├── If approved: Dashboard
    └── If rejected: Show reason
```

---

#### **Flow 2: Admin Payment Approval**

```
1. Admin Login
   └── Redirect to Admin Dashboard

2. Dashboard Overview
   ├── See "12 Pending Payments" card
   └── Click "Review Payments"

3. Payment Approvals Page
   ├── List of pending payments (card view)
   ├── Each card shows:
   │   ├── User name & email
   │   ├── Team name
   │   ├── Amount & date
   │   ├── Bank & account holder
   │   └── File thumbnail
   └── Actions: View, Approve, Reject

4. Review Payment
   ├── Click "View Proof"
   ├── Modal opens with:
   │   ├── Full-size image/PDF preview
   │   ├── Zoom controls
   │   └── Download button
   └── Verify details match

5. Approve Payment
   ├── Click "Approve"
   ├── Confirmation dialog
   ├── System updates:
   │   ├── Payment status: approved
   │   ├── User status: approved
   │   ├── Team payment status: paid
   │   └── Send confirmation email
   └── Success message

6. OR Reject Payment
   ├── Click "Reject"
   ├── Modal: Enter rejection reason
   │   ├── Dropdown: Unclear image, Wrong amount, etc.
   │   └── Custom reason (required)
   ├── System updates:
   │   ├── Payment status: rejected
   │   └── Send rejection email
   └── User can re-upload
```

---

#### **Flow 3: Admin Account Creation**

```
1. Super Admin Login
   └── Navigate to Settings → Admin Management

2. Admin Management Page
   ├── List of current admins
   ├── Click "Create New Admin"

3. Create Admin Form
   ├── Search existing user (email/name)
   ├── Select user from results
   ├── Assign role:
   │   ├── Admin (full access)
   │   ├── Finance Admin (payments only)
   │   └── Judge (submissions only)
   ├── Set permissions (checkboxes)
   └── Submit

4. System Processing
   ├── Update user role
   ├── Send invitation email
   └── Log admin creation

5. New Admin Receives Email
   ├── Welcome message
   ├── Admin dashboard link
   └── Temporary password (if set)

6. New Admin Logs In
   ├── First-time login
   ├── Change password (if required)
   └── Access admin dashboard (based on role)
```

---

### 8.3 UI/UX Requirements

**Forms:**
- ✅ Clear labels with required indicators (*)
- ✅ Inline validation (real-time)
- ✅ Error messages below fields
- ✅ Success confirmation after submit
- ✅ Loading states (spinners, disabled buttons)
- ✅ Progress indicator for multi-step forms
- ✅ Auto-save draft (optional)

**File Upload:**
- ✅ Drag & drop support
- ✅ File type indicator (PDF/Image icon)
- ✅ File size display
- ✅ Progress bar during upload
- ✅ Preview before submit (image/PDF)
- ✅ Success/error feedback
- ✅ Retry failed uploads

**Tables:**
- ✅ Sortable columns
- ✅ Filterable rows
- ✅ Pagination (20-50 per page)
- ✅ Bulk selection (checkboxes)
- ✅ Export to CSV/Excel
- ✅ Responsive design (mobile-friendly)

**Dashboards:**
- ✅ Summary cards (registrations, payments, submissions)
- ✅ Progress indicators
- ✅ Deadline countdowns
- ✅ Recent activity feed
- ✅ Quick actions
- ✅ Real-time updates (optional)

**Modals:**
- ✅ Clear purpose/title
- ✅ Minimal distractions
- ✅ Clear actions (Cancel/Confirm)
- ✅ Keyboard support (ESC to close)
- ✅ Backdrop click to close (optional)
- ✅ Responsive sizing

---

## 9. Acceptance Criteria

### 9.1 Functional Requirements

| ID | Requirement | Test Case | Expected Result |
|----|-------------|-----------|-----------------|
| **FR-01** | User can register via 6-step form | Complete all steps with valid data | Registration successful, redirected to pending approval |
| **FR-02** | User can upload payment proof | Upload valid PDF/Image (< 5MB) | File uploaded, preview shown, metadata saved |
| **FR-03** | User cannot login before approval | Try login with pending account | Blocked with message "Account pending approval" |
| **FR-04** | User can login after approval | Admin approves, user logs in | Login successful, redirected to dashboard |
| **FR-05** | Admin can create new admin | Super admin creates finance admin | New admin can access payment approvals |
| **FR-06** | Admin can approve user | Click approve on pending user | User status: approved, email sent |
| **FR-07** | Admin can approve payment | Click approve on pending payment | Payment status: approved, user notified |
| **FR-08** | Admin can reject with reason | Reject payment with custom reason | Payment status: rejected, reason saved, user notified |
| **FR-09** | Admin can preview payment proof | Click view proof | Modal opens with full-size image/PDF |
| **FR-10** | Admin can filter payments | Filter by bank, amount | Filtered list displayed |
| **FR-11** | File uploads to Google Drive | Upload file via n8n | File in Google Drive, URL in Supabase |
| **FR-12** | Admin can export user list | Export to CSV | CSV file downloaded with all users |
| **FR-13** | System validates file type | Upload .exe file | Error: "Only PDF/Image files allowed" |
| **FR-14** | System validates file size | Upload 10MB file | Error: "File size must be less than 5MB" |
| **FR-15** | Team leader can invite members | Generate invite code | Code generated, shareable via link |

---

### 9.2 Non-Functional Requirements

| ID | Requirement | Measurement | Target |
|----|-------------|-------------|--------|
| **NFR-01** | Performance | Page load time | < 2 seconds |
| **NFR-02** | Performance | API response time | < 200ms (normal) |
| **NFR-03** | Scalability | Concurrent users | 500-1000 |
| **NFR-04** | Reliability | Uptime | 99.9% |
| **NFR-05** | Security | Data encryption | HTTPS enforced |
| **NFR-06** | Security | Access control | RLS enabled |
| **NFR-07** | Usability | Task completion rate | > 95% |
| **NFR-08** | Compatibility | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **NFR-09** | Compatibility | Device support | Desktop, tablet, mobile |
| **NFR-10** | Maintainability | Code documentation | 100% of critical functions |
| **NFR-11** | Accessibility | WCAG compliance | Level AA |
| **NFR-12** | Internationalization | Language support | Indonesian, English |

---

## 10. Testing Strategy

### 10.1 Testing Levels

**Unit Testing:**
- Test individual functions/components
- Focus on business logic
- Tools: Vitest, React Testing Library
- Coverage target: > 70%

**Integration Testing:**
- Test component interactions
- Test API calls (Supabase, n8n)
- Tools: Supabase local development, MSW
- Focus: Auth flow, file upload, payment approval

**End-to-End Testing:**
- Test complete user flows
- Simulate real user behavior
- Tools: Playwright, Cypress
- Critical paths: Registration, Admin approval

**Load Testing:**
- Test with simulated concurrent users
- Identify bottlenecks
- Tools: k6, Artillery
- Target: 1000 concurrent users

---

### 10.2 Test Scenarios

**Critical Paths (Must Test):**

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
```

**Edge Cases:**

```
1. Upload exactly 5 MB file → Should succeed
2. Upload 5.01 MB file → Should fail
3. Network failure during upload → Retry option
4. Session expiry during upload → Re-authenticate
5. Duplicate team code → Show error
6. Team full (5/5 members) → Disable join
7. Payment after deadline → Mark as late
8. Google Drive quota full → Show error
9. Admin creates duplicate admin → Prevent
10. User tries to login while rejected → Show reason + re-apply option
```

---

## 11. Deployment Plan

### 11.1 Environments

| Environment | Purpose | URL | Access |
|-------------|---------|-----|--------|
| **Development** | Local development | localhost:5173 | Developers |
| **Staging** | Pre-production testing | staging.cibc.kat event.com | Team, QA |
| **Production** | Live competition | cibc.kat event.com | Public |

---

### 11.2 Deployment Steps

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

### 11.3 Rollback Plan

**If Critical Issue Found:**

```
1. Identify issue severity
   - P0 (Critical): Immediate rollback
   - P1 (High): Fix within 1 hour or rollback
   - P2 (Medium): Fix within 24 hours

2. Rollback steps
   a. Revert code to last stable version
   b. Redeploy to Cloudflare Pages
   c. Verify deployment
   d. Communicate to users (if downtime)

3. Post-mortem
   a. Document root cause
   b. Implement fix
   c. Test thoroughly
   d. Redeploy
```

---

## 12. Monitoring & Maintenance

### 12.1 Monitoring

**Metrics to Track:**

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Uptime | Uptime Kuma | < 99% |
| API Response Time | Supabase logs | > 500ms |
| Error Rate | Sentry | > 1% |
| File Upload Failures | n8n logs | > 5% |
| Database Size | Supabase dashboard | > 400 MB |
| MAU Usage | Supabase dashboard | > 40K |
| Storage Usage | Google Drive | > 80 GB |
| Pending Approvals | Custom query | > 100 |
| Payment Pending | Custom query | > 50 |

**Tools:**
- Supabase Dashboard (built-in analytics)
- Sentry (error tracking)
- Uptime Kuma (uptime monitoring)
- Google Drive storage alerts
- Custom admin dashboard widgets

---

### 12.2 Maintenance Tasks

**Daily:**
- Check pending approvals count
- Monitor error logs
- Review support tickets

**Weekly:**
- Review storage usage
- Check MAU growth
- Backup verification
- Admin activity review

**Monthly:**
- Security updates
- Performance review
- Cost review
- User feedback analysis

**Quarterly:**
- Capacity planning review
- Architecture review
- Feature roadmap update

---

## 13. Risks & Mitigation

### 13.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Supabase downtime** | High | Low | Monitor status page, have backup plan |
| **Google Drive API rate limit** | Medium | Medium | Implement queue system in n8n |
| **n8n instance crash** | High | Medium | Auto-restart, backup instance ready |
| **Database corruption** | Critical | Low | Daily backups, test restore monthly |
| **File upload failure** | High | Medium | Retry logic, clear error messages |
| **DDoS attack** | Critical | Low | Cloudflare DDoS protection |
| **SSL certificate expiry** | High | Low | Auto-renewal, monitor expiry date |

---

### 13.2 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Traffic spike during deadline** | High | High | Auto-scaling, queue system |
| **Support overload** | Medium | High | FAQ, automated responses |
| **Data privacy violation** | Critical | Low | RLS, minimal data collection |
| **Budget overrun** | Medium | Low | Monitor usage, set alerts |
| **Team member unavailable** | Medium | Medium | Documentation, cross-training |
| **Admin error (wrong approval)** | Medium | Medium | Audit log, undo capability |

---

### 13.3 User Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **User cannot upload file** | High | Medium | Clear error messages, support channel |
| **User loses submission** | Critical | Low | Confirmation emails, submission history |
| **User misses deadline** | High | Medium | Deadline reminders, countdown timer |
| **User account hacked** | Critical | Low | Strong password requirements, 2FA (future) |
| **Payment rejected unfairly** | High | Low | Appeal process, admin review |

---

## 14. Success Metrics

### 14.1 Key Performance Indicators (KPIs)

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

### 14.2 Post-Event Metrics

**To Collect After Event:**

```
□ Total registrations vs. target
□ Conversion rate (visitor → registrant)
□ Registration funnel drop-off points
□ Team formation rate
□ Payment collection rate
□ Average payment approval time
□ Submission rate per stage
□ Average file size
□ Peak concurrent users
□ Most common support issues
□ User satisfaction score
□ Net Promoter Score (NPS)
□ Admin efficiency metrics
□ Infrastructure cost per participant
□ Geographic distribution
□ Category distribution
```

---

## 15. Appendix

### 15.1 Glossary

| Term | Definition |
|------|------------|
| **MAU** | Monthly Active Users |
| **RLS** | Row Level Security (Supabase feature) |
| **n8n** | Workflow automation tool (nodemation) |
| **OAuth** | Open Authorization (authentication protocol) |
| **CDN** | Content Delivery Network |
| **PDF** | Portable Document Format |
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token |
| **SSL** | Secure Sockets Layer |
| **DDoS** | Distributed Denial of Service |
| **RBAC** | Role-Based Access Control |
| **BMC** | Business Model Canvas |

---

### 15.2 References

**Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [n8n Docs](https://docs.n8n.io)
- [Google Drive API](https://developers.google.com/drive)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

**Tools:**
- Supabase: https://supabase.com
- n8n: https://n8n.io
- Railway: https://railway.app
- Google Cloud: https://console.cloud.google.com
- Cloudflare: https://dash.cloudflare.com

---

### 15.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-04-02 | Product Team | Initial PRD creation |
| 2.0.0 | 2026-04-02 | Product Team | Added payment proof & admin management |

---

## ✅ Approval

**Stakeholders:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead | | | |
| Project Manager | | | |

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
