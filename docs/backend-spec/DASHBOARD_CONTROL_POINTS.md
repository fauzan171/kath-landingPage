# 🎛️ Dashboard Control Points - CIBC Project

Dokumen ini berisi lengkap semua kontrol yang bisa dilakukan dari Backend Admin Dashboard berdasarkan analisis project KATH Landing Page.

---

## 📊 CONTROL POINTS SUMMARY

Berikut 7 kategori utama yang bisa dikontrol dari Dashboard:

| # | Kategori | Control Points | Prioritas |
|---|----------|----------------|-----------|
| 1 | **Competition Settings** | 12 kontrol | 🔴 P0 |
| 2 | **Stages & Flow** | 15 kontrol | 🔴 P0 |
| 3 | **Tasks & Submissions** | 18 kontrol | 🔴 P0 |
| 4 | **Teams & Participants** | 14 kontrol | 🟡 P1 |
| 5 | **Grading & Evaluation** | 10 kontrol | 🟡 P1 |
| 6 | **Content Management** | 20 kontrol | 🟢 P2 |
| 7 | **System & Admin** | 8 kontrol | 🟢 P2 |

---

## 1️⃣ COMPETITION SETTINGS

Berdasarkan `competitionConfig` di `src/config.ts`:

### Core Competition Info
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Competition Name** | `mainCompetition.name` | Edit bilingual text |
| **Total Prize Text** | `mainCompetition.totalPrize` | Edit prize display |
| **Deadline** | `mainCompetition.deadline` | Set registration deadline |
| **Description** | `mainCompetition.description` | Edit bilingual description |
| **Status** | - (baru) | Draft/Upcoming/Active/Completed |
| **Competition Code** | - (baru) | Unique identifier (e.g., "cibc-2026") |

### Categories Management
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Add/Edit Category** | `categories[]` | CRUD categories |
| **Category Name** | `category.name` | Bilingual name |
| **Target Participant** | `category.target` | Siapa yang boleh ikut |
| **Prize per Category** | `category.prize` | Hadiah untuk kategori |
| **Category Status** | `category.status` | Open/Coming Soon/Closed |
| **Max Team Size** | - (hardcoded) | Set per competition |
| **Min Team Size** | - (hardcoded) | Set per competition |

### Timeline & Dates
| Control | Dashboard Action |
|---------|------------------|
| **Registration Open** | Set date & time |
| **Registration Close** | Set deadline |
| **Event Start** | Tanggal mulai kompetisi |
| **Event End** | Tanggal selesai |
| **Auto-progress Stages** | Aktivasi otomatis antar stage |

---

## 2️⃣ STAGES & FLOW MANAGEMENT

Berdasarkan `cibcMockData.ts` → `timelinePhases` dan flow di FE:

### Stage Configuration
| Control | Current | Dashboard Action |
|---------|---------|------------------|
| **Stage Name** | `phase.name` | Edit stage name |
| **Stage Description** | `phase.description` | Deskripsi stage |
| **Stage Order** | Array order | Drag & drop reorder |
| **Start Date** | `phase.startDate` | Set tanggal mulai |
| **End Date** | `phase.endDate` | Set tanggal selesai |
| **Stage Status** | `phase.status` | Draft/Upcoming/Active/Completed |
| **Activate Stage** | Manual | Toggle active stage |
| **Stage Visibility** | - | Show/hide dari peserta |

### Milestones per Stage
| Control | Current | Dashboard Action |
|---------|---------|------------------|
| **Add Milestone** | `milestones[]` | Add event checkpoint |
| **Milestone Name** | `milestone.name` | Nama event |
| **Milestone Date** | `milestone.date` | Tanggal milestone |
| **Mark Complete** | `milestone.completed` | Check off milestone |

### Stage Dependencies
| Control | Dashboard Action |
|---------|------------------|
| **Require Previous Stage** | Harus lewat stage sebelumnya |
| **Auto-advance** | Otomatis next stage saat waktu |
| **Manual Trigger** | Admin trigger next stage |
| **Stage Prerequisites** | Apa yang harus diselesaikan dulu |

---

## 3️⃣ TASKS & SUBMISSIONS

Berdasarkan submission flow dan `SubmissionForm.tsx`:

### Task Management
| Control | Current | Dashboard Action |
|---------|---------|------------------|
| **Create Task** | Hardcoded | Add new submission task |
| **Task Name** | - | Edit nama task |
| **Task Description** | - | Deskripsi requirements |
| **Task Type** | File/text | submission/quiz/manual_review |
| **Belongs to Stage** | - | Assign ke stage |
| **Task Order** | - | Urutan dalam stage |
| **Required/Optional** | - | Mandatory atau tidak |
| **Publish Status** | - | Draft/Published |

### Submission Requirements
| Control | Current | Dashboard Action |
|---------|---------|------------------|
| **Max File Size** | 50MB hardcoded | Set limit (MB) |
| **Allowed File Types** | - | PDF/PPT/ZIP/Video/etc |
| **Max Files Count** | - | 1 file atau multiple |
| **Custom Fields** | - | Add custom form fields |
| **Field Type** | - | text/textarea/select/number |
| **Field Required** | - | Validation rules |
| **Deadline per Task** | - | Bisa beda dari stage |
| **Grace Period** | - | Toleransi keterlambatan |

### Submission Form Builder
| Control | Dashboard Action |
|---------|------------------|
| **Field Label** | Label field |
| **Placeholder** | Helper text |
| **Validation** | Required/optional |
| **Options** | Untuk dropdown/select |
| **Help Text** | Penjelasan field |

---

## 4️⃣ TEAMS & PARTICIPANTS

Berdasarkan `initialTeams` dan `teamService` di mock data:

### Team Management
| Control | Current | Dashboard Action |
|---------|---------|------------------|
| **View All Teams** | `teamService.getAll()` | List dengan filter/search |
| **Team Status** | `team.status` | Pending/Active/Disqualified |
| **Approve Team** | Manual | Accept registration |
| **Reject Team** | Manual | Reject with reason |
| **Disqualify** | - | Remove from competition |
| **Team Category** | `team.category` | Startup/Student/etc |
| **Team Code** | `team.code` | Unique identifier |
| **Max Members** | `team.maxMembers` | Limit per team |
| **Institution** | - | Kampus/company |

### Team Members
| Control | Dashboard Action |
|---------|------------------|
| **View Members** | List semua anggota |
| **Add Member** | Manual add (admin) |
| **Remove Member** | Kick dari team |
| **Change Role** | Leader/Member/Mentor |
| **Verify Member** | Approve join request |
| **Member Limit** | Max anggota tim |

### Registration Data
| Control | Dashboard Action |
|---------|------------------|
| **View Registration Form** | Data yang diisi waktu daftar |
| **Edit Registration** | Fix data tim |
| **Export Registrations** | CSV/Excel download |

---

## 5️⃣ GRADING & EVALUATION

Berdasarkan `judgingCriteria` di mock data:

### Judging Criteria
| Control | Current | Dashboard Action |
|---------|---------|------------------|
| **Add Criteria** | `judgingCriteria[]` | Add rubrik penilaian |
| **Criteria Name** | `criteria.name` | Nama aspek |
| **Description** | `criteria.description` | Penjelasan |
| **Max Score** | `criteria.maxScore` | Skala maksimum |
| **Weight** | `criteria.weight` | Bobot % |
| **Order** | - | Urutan criteria |
| **Active Status** | - | Enable/disable |

### Submission Review
| Control | Dashboard Action |
|---------|------------------|
| **View Submissions** | List semua submission |
| **Filter by Task** | Submission per task |
| **Filter by Status** | Draft/Submitted/Graded |
| **Filter by Team** | Cari per tim |
| **View File** | Preview uploaded files |
| **Download File** | Download submission |
| **Assign Judge** | Assign ke juri |

### Grading Workflow
| Control | Dashboard Action |
|---------|------------------|
| **Score per Criteria** | Input skor per aspek |
| **Total Score** | Auto calculate |
| **Written Feedback** | Komentar juri |
| **Return for Revision** | Minta revisi |
| **Final Grade** | Lock score |
| **Publish Results** | Umumkan ke peserta |
| **Blind Review** | Hide team identity |

### Reports
| Control | Dashboard Action |
|---------|------------------|
| **Leaderboard** | Ranking by score |
| **Progress Report** % completion per team |
| **Export Scores** | CSV/Excel export |
| **Statistics** | Avg, median, distribution |

---

## 6️⃣ CONTENT MANAGEMENT

Berdasarkan semua sections di `src/config.ts` dan `src/sections/`:

### Website Content (KATH Main Site)
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Hero Background** | `heroConfig.backgroundImage` | Upload gambar hero |
| **Hero Title** | `heroConfig.title` | Edit bilingual |
| **Hero Subtitle** | `heroConfig.subtitle` | Edit bilingual |
| **Hero CTA** | `heroConfig.ctaPrimary` | Edit button text |
| **Narrative Text** | `narrativeTextConfig` | Edit about section |
| **Stats Numbers** | `narrativeTextConfig.stats` | Update angka |

### Portfolio/Card Stack
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Add Portfolio** | `cardStackConfig.cards[]` | Add featured event |
| **Portfolio Image** | `card.image` | Upload foto |
| **Portfolio Title** | `card.title` | Edit bilingual |
| **Portfolio Desc** | `card.description` | Edit deskripsi |
| **Portfolio Category** | `card.category` | Pilih kategori |
| **Card Order** | Array index | Drag & drop reorder |

### Services Section
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Service Title** | `servicesConfig.sectionTitle` | Edit |
| **Service Items** | `servicesConfig.services[]` | CRUD services |
| **Service Icon** | `service.icon` | Pilih icon |
| **Service Image** | `service.image` | Upload foto |
| **Service Features** | `service.features[]` | Edit list |

### Portfolio Grid
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Add Portfolio Item** | `portfolioConfig.items[]` | Add new |
| **Portfolio Image** | `item.image` | Upload |
| **Portfolio Category** | `item.category` | Assign |
| **Portfolio Location** | `item.location` | Edit |
| **Portfolio Year** | `item.year` | Edit |
| **Filter Categories** | `portfolioConfig.categories` | Manage filters |

### Testimonials
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Add Testimonial** | `testimonialsConfig.testimonials[]` | Add review |
| **Client Photo** | `testimonial.image` | Upload |
| **Client Name** | `testimonial.name` | Edit |
| **Client Role** | `testimonial.role` | Edit |
| **Quote** | `testimonial.quote` | Edit |
| **Rating** | `testimonial.rating` | 1-5 stars |

### FAQ Management
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Add FAQ** | `faqConfig.faqs[]` | Add Q&A |
| **Question** | `faq.question` | Edit bilingual |
| **Answer** | `faq.answer` | Edit bilingual |
| **Category** | `faq.category` | Assign kategori |
| **FAQ Order** | Array index | Reorder |
| **FAQ Categories** | `faqConfig.categories` | Manage cats |

### Contact Info
| Control | Current Location | Dashboard Action |
|---------|-----------------|------------------|
| **Email** | `contactConfig.email` | Update email |
| **Phone** | `contactConfig.phone` | Update WA/telp |
| **Address** | `contactConfig.address` | Update alamat |
| **Social Links** | `contactConfig.socials` | Update IG/FB/etc |
| **Office Hours** | - | Set jam operasional |

---

## 7️⃣ SYSTEM & ADMIN

### User Management (Admin Panel)
| Control | Dashboard Action |
|---------|------------------|
| **Create Admin** | Add new admin user |
| **Assign Role** | Super/Admin/Judge/Observer |
| **Assign Competition** | Kompetisi yang diakses |
| **Deactivate User** | Disable account |
| **Reset Password** | Force reset |
| **View Activity Log** | Audit trail |

### Announcements
| Control | Dashboard Action |
|---------|------------------|
| **Create Announcement** | Post pengumuman |
| **Target Audience** | All/Specific teams/Stages |
| **Announcement Type** | General/Urgent/Result |
| **Schedule Publish** | Delayed publishing |
| **Send Notification** | Push/email notif |

### System Settings
| Control | Dashboard Action |
|---------|------------------|
| **Maintenance Mode** | Toggle website maintenance |
| **Registration Toggle** | Buka/tutup pendaftaran |
| **Email Settings** | SMTP config |
| **Backup Data** | Export database |
| **Theme Settings** | Colors/branding |

---

## 📱 FRONTEND PAGES yang Perlu API Integration

### Public Pages (Landing)
| Page | API Endpoint | Data Source |
|------|--------------|-------------|
| `/` (Home) | `GET /public/content/hero` | `heroConfig` |
| `/` | `GET /public/content/about` | `narrativeTextConfig` |
| `/` | `GET /public/content/services` | `servicesConfig` |
| `/` | `GET /public/content/portfolio` | `cardStackConfig` + `portfolioConfig` |
| `/` | `GET /public/content/testimonials` | `testimonialsConfig` |
| `/` | `GET /public/content/faq` | `faqConfig` |
| `/` | `GET /public/content/contact` | `contactConfig` |

### Competition Pages (CIBC)
| Page | API Endpoint | Data Source |
|------|--------------|-------------|
| `/cibc` | `GET /public/competitions/:id` | `competitionConfig` |
| `/cibc` | `GET /public/competitions/:id/timeline` | `timelinePhases` |
| `/cibc/register` | `POST /public/teams` | Registration |
| `/cibc/dashboard` | `GET /user/teams/:id` | `teamService.getMyTeam()` |
| `/cibc/dashboard/submission` | `GET /user/submissions` | Submission data |
| `/competition/:id/submit` | `POST /user/submissions` | Submission upload |

### Admin Dashboard Pages
| Page | Features | Control Points |
|------|----------|--------------|
| `/admin/login` | Authentication | JWT login |
| `/admin/dashboard` | Overview | Stats, activities, timeline |
| `/admin/competitions` | Manage competitions | CRUD, settings |
| `/admin/stages` | Stage flow | CRUD, activate, order |
| `/admin/tasks` | Task management | CRUD, publish, requirements |
| `/admin/teams` | Participant mgmt | Approve, view, export |
| `/admin/submissions` | View submissions | Filter, preview |
| `/admin/grading` | Evaluation | Score, feedback, criteria |
| `/admin/announcements` | Communication | Create, target, schedule |
| `/admin/reports` | Analytics | Leaderboard, export |
| `/admin/settings` | System config | Users, roles, maintenance |
| `/admin/content` | CMS | Hero, portfolio, FAQ |

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1 (MVP - Week 1-2)
```
🔴 CRITICAL - Must Have
├── Competition Settings
│   ├── Name, prize, deadline
│   ├── Categories CRUD
│   └── Timeline dates
├── Stages Management
│   ├── CRUD stages
│   ├── Activate/deactivate
│   └── Reorder stages
└── Tasks Management
    ├── CRUD tasks
    ├── Assign to stage
    └── File requirements
```

### Phase 2 (Core - Week 3-4)
```
🟡 HIGH - Should Have
├── Teams Management
│   ├── View all teams
│   ├── Approve/reject
│   └── Status management
├── Submissions
│   ├── View submissions
│   ├── Download files
│   └── Filter by task/status
└── Grading
    ├── Judging criteria CRUD
    ├── Score submission
    └── View leaderboard
```

### Phase 3 (Enhanced - Week 5-6)
```
🟢 MEDIUM - Nice to Have
├── Content Management
│   ├── Hero section
│   ├── Portfolio/CardStack
│   └── FAQ management
├── Announcements
│   ├── Create announcement
│   └── Target by team/stage
└── Reports
    ├── Export CSV/Excel
    └── Statistics dashboard
```

### Phase 4 (Polish - Week 7-8)
```
⚪ LOW - Optional
├── Advanced Features
│   ├── Custom form builder
│   ├── Email templates
│   ├── WebSocket real-time
│   └── Audit logging UI
└── System Settings
    ├── User management
    ├── Role permissions
    └── Maintenance mode
```

---

## 📋 CHECKLIST: Dashboard UI Components Needed

### Layout Components
- [ ] Sidebar Navigation (collapsible)
- [ ] Top Header (user, competition switcher)
- [ ] Breadcrumb navigation
- [ ] Page container with padding

### Competition Management
- [ ] Competition Card (grid view)
- [ ] Competition Form (create/edit)
- [ ] Date Range Picker (timeline)
- [ ] Category Manager (list + drag)
- [ ] Status Toggle (draft/active/etc)

### Stage Management
- [ ] Stage Timeline (horizontal/vertical)
- [ ] Stage Card (status, dates, tasks count)
- [ ] Drag & Drop Reorder
- [ ] Milestone List (checkable)
- [ ] Activate Stage Button

### Task Management
- [ ] Task List (by stage)
- [ ] Task Form (rich editor)
- [ ] File Requirements Builder
- [ ] Custom Fields Builder
- [ ] Publish Toggle

### Team Management
- [ ] Team Table (filterable, sortable)
- [ ] Team Detail Modal
- [ ] Member List
- [ ] Status Badge (pending/active/etc)
- [ ] Approve/Reject Buttons
- [ ] Bulk Actions

### Submission/Grading
- [ ] Submission Card (with file preview)
- [ ] Grading Form (criteria inputs)
- [ ] Score Display (with breakdown)
- [ ] Feedback Textarea
- [ ] Status Badge (submitted/graded/etc)

### Content Management
- [ ] Image Uploader (with preview)
- [ ] Rich Text Editor (bilingual)
- [ ] Card/List View Toggle
- [ ] Reorder Drag Handle
- [ ] Category Selector

### Data Display
- [ ] Stats Cards (dashboard)
- [ ] Charts (progress, distribution)
- [ ] Data Table (sort, filter, paginate)
- [ ] Export Button (CSV/Excel)

---

## 🚀 Next Steps

1. **Confirm Priority**: Mau mulai dari Phase 1 (Competition Settings) dulu?
2. **UI Framework**: Shadcn/ui, Ant Design, atau custom component?
3. **Real-time needs**: Butuh WebSocket untuk live notification gak?
4. **Multi-competition**: Ada berapa kompetisi yang jalan bareng?

Ready? Kasih tau aja mau gw mulai coding yang mana dulu! 🎯
