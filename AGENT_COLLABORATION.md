# Kolaborasi Skill Agents - KATH BMC Competition Platform

## 📋 Ringkasan Requirements
- Ubah warna dari item/gelap ke **cerah dan premium**
- Flow: Landing page company → Section competition → Dashboard
- Dashboard competition standar internasional
- Kolaborasi antar tim (BMC, UI/UX, FE)

---

## 🎯 BMC CONSULTANT RECOMMENDATION

### Flow Competition Terbaik (Standar Internasional)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LANDING PAGE COMPANY                                                        │
│  ├── Hero Section (Brand Story)                                             │
│  ├── Services Section                                                        │
│  ├── Portfolio Section                                                       │
│  ├── ⭐ COMPETITION SECTION (Highlight)                                      │
│  │   ├── Featured Competition Card                                          │
│  │   ├── Categories Overview                                                │
│  │   └── CTA: "Register Now" → Register Page                                │
│  ├── Testimonials                                                           │
│  └── Contact                                                                │
│                                                                              │
│  REGISTRATION FLOW                                                           │
│  ├── Choose Category (Startup/Student/Social/Corporate)                     │
│  ├── Fill Personal Data                                                     │
│  ├── Team Setup (Optional)                                                  │
│  └── Submit Registration → PENDING VERIFICATION                             │
│                                                                              │
│  DASHBOARD (Post-Registration)                                              │
│  ├── Overview                                                               │
│  │   ├── Welcome & Status                                                   │
│  │   ├── Stats (Competitions, Active, Wins, Certificates)                   │
│  │   ├── Current Competition Progress                                       │
│  │   └── Quick Actions                                                      │
│  │                                                                          │
│  ├── My Competitions                                                        │
│  │   ├── Active Competitions                                                │
│  │   ├── Completed Competitions                                             │
│  │   └── Competition History                                                │
│  │                                                                          │
│  ├── Documents                                                               │
│  │   ├── Required Documents (KTP, Portfolio, Proposal, etc.)                │
│  │   ├── Upload Status                                                      │
│  │   └── Document Templates Download                                        │
│  │                                                                          │
│  ├── My Team                                                                 │
│  │   ├── Team Members                                                       │
│  │   ├── Invite Members                                                     │
│  │   └── Role Management                                                    │
│  │                                                                          │
│  ├── Timeline                                                                 │
│  │   ├── Competition Timeline                                               │
│  │   ├── Milestones                                                         │
│  │   └── Deadlines                                                          │
│  │                                                                          │
│  └── Settings                                                                │
│      ├── Profile                                                            │
│      ├── Notifications                                                      │
│      └── Security                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Features (Standar Internasional)

#### 1. Overview Tab
| Component | Description |
|-----------|-------------|
| Welcome Banner | Personalized greeting + verification status |
| Stats Cards | Total competitions, Active, Wins, Certificates |
| Current Competition | Active competition progress + deadline |
| Quick Actions | Submit, View Details, Upload Documents |
| Recent Activity | Latest actions and updates |

#### 2. My Competitions Tab
| Component | Description |
|-----------|-------------|
| Competition Cards | Status (Registered, In Progress, Completed) |
| Progress Indicator | Visual progress for each competition |
| Team Info | Team name, members, role |
| Deadlines | Upcoming deadlines highlighted |

#### 3. Documents Tab
| Component | Description |
|-----------|-------------|
| Required Docs List | KTP, Portfolio, Proposal, Recommendations |
| Upload Status | Uploaded/Pending/Rejected |
| File Preview | Preview uploaded documents |
| Templates | Download templates |

#### 4. My Team Tab
| Component | Description |
|-----------|-------------|
| Team Overview | Team name, category, status |
| Members List | Avatar, name, role, email |
| Invite System | Invite via email/link |
| Role Assignment | Leader, Member, Mentor |

#### 5. Timeline Tab
| Component | Description |
|-----------|-------------|
| Milestone Timeline | Registration → Workshop → Submission → Final |
| Current Phase | Highlighted current phase |
| Countdown | Countdown to next deadline |
| Notifications | Important dates alerts |

---

## 🎨 UI/UX CONSULTANT RECOMMENDATION

### Color Palette - Bright & Premium Theme

#### Primary Colors (Vibrant & Professional)
```css
/* Primary - Vibrant Blue (Trust & Professional) */
--primary-50:  #EFF6FF;
--primary-100: #DBEAFE;
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3B82F6;  /* Main Primary */
--primary-600: #2563EB;
--primary-700: #1D4ED8;
--primary-800: #1E40AF;
--primary-900: #1E3A8A;

/* Accent - Warm Gold (Premium & Award) */
--accent-50:  #FFFBEB;
--accent-100: #FEF3C7;
--accent-200: #FDE68A;
--accent-300: #FCD34D;
--accent-400: #FBBF24;
--accent-500: #F59E0B;  /* Main Accent */
--accent-600: #D97706;
--accent-700: #B45309;
--accent-800: #92400E;
--accent-900: #78350F;
```

#### Background Colors (Light Theme)
```css
/* Light Backgrounds */
--bg-primary:    #FFFFFF;    /* Main background */
--bg-secondary:  #F8FAFC;    /* Cards, sections */
--bg-tertiary:   #F1F5F9;    /* Hover states */
--bg-elevated:   #FFFFFF;    /* Elevated cards */

/* Dark Backgrounds (For contrast sections) */
--bg-dark:       #0F172A;    /* Footer, CTA sections */
--bg-darker:     #020617;    /* Dark accents */
```

#### Text Colors
```css
/* Light Theme Text */
--text-primary:   #0F172A;    /* Main text */
--text-secondary: #475569;    /* Secondary text */
--text-muted:     #94A3B8;    /* Muted text */
--text-inverse:   #FFFFFF;    /* Text on dark bg */

/* Semantic Colors */
--success:        #10B981;    /* Green */
--warning:        #F59E0B;    /* Amber */
--error:          #EF4444;    /* Red */
--info:           #3B82F6;    /* Blue */
```

### Complete Color System
```javascript
// tailwind.config.js - Updated Colors
colors: {
  // Light backgrounds
  'bg-main': '#F8FAFC',
  'bg-card': '#FFFFFF',
  'bg-section': '#F1F5F9',

  // Primary Blue (Trust)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Accent Gold (Premium)
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Neutral
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
}
```

### Dashboard Design Guidelines

#### Card Design
```css
/* Light Theme Card */
.card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card:hover {
  border-color: #3B82F6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

/* Gradient Card (Featured) */
.card-featured {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
}
```

#### Button Styles
```css
/* Primary Button */
.btn-primary {
  background: #3B82F6;
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
}

.btn-primary:hover {
  background: #2563EB;
}

/* Accent Button */
.btn-accent {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
}

/* Outline Button */
.btn-outline {
  background: transparent;
  border: 1px solid #E2E8F0;
  color: #334155;
}
```

### Typography
```css
/* Headings */
--heading-1: clamp(2rem, 5vw, 3rem);    /* 32-48px */
--heading-2: clamp(1.5rem, 4vw, 2.5rem); /* 24-40px */
--heading-3: clamp(1.25rem, 3vw, 1.75rem); /* 20-28px */

/* Body */
--body-lg: 1.125rem;  /* 18px */
--body-base: 1rem;    /* 16px */
--body-sm: 0.875rem;  /* 14px */
--body-xs: 0.75rem;   /* 12px */
```

---

## 💻 FRONTEND ENGINEER IMPLEMENTATION

### Files to Update

#### 1. `tailwind.config.js`
- Update color palette to bright theme
- Keep kath colors for brand consistency (use as accent)

#### 2. `src/index.css`
- Update CSS variables
- Light theme as default

#### 3. `src/pages/Dashboard.tsx`
- Update background colors
- Update card styles
- Update text colors

#### 4. Component Updates
- All components need color updates
- Update status badges colors
- Update hover states

### Implementation Priority

| Priority | File | Changes |
|----------|------|---------|
| 🔴 High | tailwind.config.js | New color system |
| 🔴 High | index.css | CSS variables |
| 🔴 High | Dashboard.tsx | Light theme |
| 🟡 Medium | All sections | Color updates |
| 🟢 Low | Animations | Fine-tuning |

---

## 📝 SUMMARY OF CHANGES

### Warna Baru
| Element | Lama (Dark) | Baru (Light) |
|---------|-------------|--------------|
| Background | #0a0a0a (Hitam) | #F8FAFC (Putih) |
| Cards | #1a1a1a (Gelap) | #FFFFFF (Putih) |
| Primary | #a68a2d (Gold) | #3B82F6 (Blue) |
| Accent | - | #F59E0B (Gold) |
| Text | #ffffff | #0F172A |

### Flow Baru
```
Landing Page → Competition Section → Register → Dashboard
                                              ├── Overview
                                              ├── My Competitions
                                              ├── Documents
                                              ├── My Team
                                              ├── Timeline
                                              └── Settings
```

### Dashboard Features
1. ✅ Overview - Stats, Progress, Quick Actions
2. ✅ My Competitions - Competition list & status
3. ✅ Documents - Upload & manage documents
4. ✅ My Team - Team management
5. ✅ Timeline - Competition milestones
6. ✅ Settings - Profile & preferences

---

*Generated by: BMC Consultant + UI/UX Consultant + Frontend Engineer*
*Date: 2024-03-15*