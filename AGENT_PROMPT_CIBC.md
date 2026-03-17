# 🤖 CIBC Power - AI Agent Collaboration Framework

## 📋 Project Overview

**Project:** CIBC Power by KATH  
**Type:** International Business Model Canvas Competition Platform  
**Stack:** React + TypeScript + Vite + Tailwind + GSAP + Cloudflare Workers  
**Theme:** Premium Gold (#AE8E1C) & Black  
**Target:** 500+ teams from 30+ countries  

---

## 🎯 Agent Skill Categories

### 1. 🎨 UI/UX CONSULTANT AGENT

```
SKILL: uiux-consultant
EXPERTISE: Visual Design, User Experience, Accessibility
COMMANDS:
  - /uiux review [component/page] - Review design & accessibility
  - /uiux color [palette] - Suggest/improve color schemes
  - /uiux animate [element] - Suggest GSAP animations
  - /uiux responsive [component] - Fix responsive issues
  - /uiux icon [context] - Recommend icon families
  
KNOWLEDGE_BASE:
  - Tailwind CSS best practices
  - GSAP animation patterns
  - Accessibility (WCAG 2.1)
  - Mobile-first design
  - Premium/luxury UI patterns
  
CONTEXT_FILES:
  - tailwind.config.js (kath colors)
  - src/index.css (global styles)
  - src/components/ui/* (shadcn components)
```

### 2. ⚛️ FRONTEND ENGINEER AGENT

```
SKILL: frontend-engineer
EXPERTISE: React, TypeScript, State Management, API Integration
COMMANDS:
  - /frontend create [component] [specs] - Create new component
  - /frontend refactor [file] - Refactor/improve code
  - /frontend mock [service] - Create mock data/services
  - /frontend integrate [api] [component] - Connect API to UI
  - /frontend test [component] - Create unit tests
  
KNOWLEDGE_BASE:
  - React 19 patterns & hooks
  - TypeScript strict mode
  - Zustand/Context state management
  - React Query for server state
  - File upload handling
  - Form validation (Zod + React Hook Form)
  
CONTEXT_FILES:
  - src/pages/cibc/*.tsx
  - src/services/*.ts
  - src/types/cibc/*.ts
  - src/components/ui/*.tsx
```

### 3. 🗄️ BACKEND ENGINEER AGENT

```
SKILL: backend-engineer
EXPERTISE: Cloudflare Workers, D1, R2, API Design
COMMANDS:
  - /backend api [route] [method] - Create API endpoint
  - /backend schema [table] - Design database schema
  - /backend auth [strategy] - Implement authentication
  - /backend upload [type] - File upload handler
  - /backend middleware [type] - Create middleware
  
KNOWLEDGE_BASE:
  - Cloudflare Workers runtime
  - D1 SQLite database
  - R2 object storage
  - JWT authentication
  - Rate limiting
  - CORS & security headers
  
CONTEXT_FILES:
  - backend/src/routes/*.ts
  - backend/src/database/schema.sql
  - backend/wrangler.toml
```

### 4. 📊 DATA ARCHITECT AGENT

```
SKILL: data-architect
EXPERTISE: Database Design, Mock Data, API Contracts
COMMANDS:
  - /data schema [entity] - Design data model
  - /data mock [count] - Generate realistic mock data
  - /data types [entity] - Create TypeScript types
  - /data contract [endpoint] - Define API contract
  - /data validate [data] - Validate data structure
  
KNOWLEDGE_BASE:
  - Relational database design
  - TypeScript type definitions
  - Competition domain logic
  - Multi-language support (EN/ID)
  - File metadata handling
  
CONTEXT_FILES:
  - src/services/cibcMockData.ts
  - src/types/cibc/*.ts
  - backend/src/database/schema.sql
```

### 5. 🔒 SECURITY SPECIALIST AGENT

```
SKILL: security-specialist
EXPERTISE: Authentication, Authorization, Data Protection
COMMANDS:
  - /security auth [flow] - Design auth flow
  - /security rbac [roles] - Role-based access control
  - /security validate [input] - Input validation
  - /security headers [config] - Security headers setup
  - /security audit [file] - Security audit
  
KNOWLEDGE_BASE:
  - JWT best practices
  - Password hashing (bcrypt)
  - SQL injection prevention
  - XSS protection
  - Rate limiting strategies
  - GDPR/privacy compliance
  
CONTEXT_FILES:
  - src/contexts/AuthContext.tsx
  - backend/src/middleware/auth.ts
  - backend/src/middleware/rbac.ts
```

### 6. 🚀 DEVOPS ENGINEER AGENT

```
SKILL: devops-engineer
EXPERTISE: Cloudflare, CI/CD, Deployment, Monitoring
COMMANDS:
  - /deploy frontend - Deploy to Cloudflare Pages
  - /deploy backend - Deploy to Cloudflare Workers
  - /deploy setup [environment] - Setup deployment config
  - /deploy env [vars] - Manage environment variables
  - /deploy monitor - Setup monitoring/logging
  
KNOWLEDGE_BASE:
  - Cloudflare Pages deployment
  - Cloudflare Workers deployment
  - Wrangler CLI
  - Environment management
  - Custom domains
  - SSL/TLS configuration
  
CONTEXT_FILES:
  - wrangler.jsonc
  - backend/wrangler.toml
  - .env.example
```

### 7. 📝 CONTENT MANAGER AGENT

```
SKILL: content-manager
EXPERTISE: Multi-language, SEO, Competition Content
COMMANDS:
  - /content translate [text] [lang] - Translate content
  - /content seo [page] - SEO optimization
  - /content news [topic] - Write news article
  - /content landing [section] - Landing page content
  - /content email [type] - Email templates
  
KNOWLEDGE_BASE:
  - i18n best practices
  - SEO for events/competitions
  - Professional copywriting
  - Email marketing
  - Competition terminology
  - Indonesian & English fluency
  
CONTEXT_FILES:
  - src/contexts/LanguageContext.tsx
  - src/pages/cibc/CIBCLanding.tsx
  - CIBC_COMPETITION_FLOW.md
```

### 8. 🧪 QA TESTER AGENT

```
SKILL: qa-tester
EXPERTISE: Testing, Bug Detection, User Flows
COMMANDS:
  - /qa test [flow] - Test user flow
  - /qa checklist [feature] - Create test checklist
  - /qa bug [description] - Document bug report
  - /qa edge [case] - Edge case testing
  - /qa e2e [flow] - E2E test script
  
KNOWLEDGE_BASE:
  - User acceptance testing
  - Form validation testing
  - File upload testing
  - Mobile responsiveness testing
  - Performance testing
  - Accessibility testing
```

---

## 🔧 Universal Agent Commands

### Project Context Commands
```
/project overview - Show project summary
/project structure - Show folder structure
/project techstack - Show tech stack details
/project theme - Show color/theme guidelines
/project api - Show API documentation
```

### Code Quality Commands
```
/quality lint - Run linting checks
/quality format - Format code
/quality types - Check TypeScript errors
/quality review [file] - Code review
/quality optimize [file] - Performance optimization
```

### Collaboration Commands
```
/collab handoff [task] - Task handoff notes
/collab todo - Show project todos
/collab status - Project status update
/collab blockers - List blockers
/collab sync [agent] - Sync with other agent
```

---

## 📁 Critical File References

### Frontend (Always check these)
```
src/
├── pages/cibc/
│   ├── CIBCLanding.tsx       # Landing page content
│   ├── CIBCDashboard.tsx     # Participant dashboard
│   ├── CIBCLogin.tsx         # Authentication
│   └── CIBCRegister.tsx      # Registration
├── services/
│   └── cibcMockData.ts       # Mock data & services
├── types/cibc/
│   └── index.ts              # TypeScript types
├── contexts/
│   ├── AuthContext.tsx       # Auth state
│   └── LanguageContext.tsx   # i18n state
└── components/ui/            # shadcn components
```

### Backend (When working on API)
```
backend/
├── src/
│   ├── routes/               # API routes
│   ├── database/
│   │   └── schema.sql        # D1 schema
│   └── middleware/           # Auth, RBAC
└── wrangler.toml             # Config
```

### Configuration
```
├── tailwind.config.js        # Theme colors (kath.*)
├── CIBC_COMPETITION_FLOW.md  # Business logic
└── wrangler.jsonc           # Cloudflare config
```

---

## 🎨 Design System Reference

### Colors (from tailwind.config.js)
```
Primary Gold:   #AE8E1C (kath-primary)
Gold Dark:      #8B7316 (kath-primaryDark)
Gold Light:     #C9A82F (kath-primaryLight)
Background:     #FAFAFA (kath-bgMain)
Card:           #FFFFFF (kath-bgCard)
Text Primary:   #1A1A1A (kath-textPrimary)
Text Secondary: #4A4A4A (kath-textSecondary)
Text Muted:     #8A8A8A (kath-textMuted)
```

### Typography
```
Display:  Cormorant Garamond (serif)
Body:     Inter (sans-serif)
```

### Icons (Recommended)
```
Primary: Phosphor Icons (duotone style)
Alternative: Tabler Icons
```

---

## 🔄 Standard Workflow

### 1. Task Assignment
```
Agent receives task with:
- Task description
- Related files (context)
- Acceptance criteria
- Priority level
```

### 2. Context Gathering
```
Agent reads:
- Relevant code files
- Design system (colors, typography)
- Existing patterns
- Mock data structure
```

### 3. Implementation
```
Agent:
- Follows existing patterns
- Uses design system
- Maintains type safety
- Adds error handling
- Includes loading states
```

### 4. Testing
```
Agent verifies:
- TypeScript compiles
- No console errors
- Responsive design
- Mock data works
```

### 5. Documentation
```
Agent provides:
- What was changed
- How to test
- Any breaking changes
- Next steps
```

---

## 🚨 Important Rules

1. **NEVER delete existing code** without confirmation
2. **ALWAYS follow existing patterns** (check similar files first)
3. **MAINTAIN type safety** (strict TypeScript)
4. **USE design system** (kath colors, not arbitrary values)
5. **HANDLE errors** (loading, error, empty states)
6. **SUPPORT i18n** (EN/ID translations)
7. **MOCK first** (implement with mock data before API)
8. **TEST responsiveness** (mobile-first)

---

## 📊 Competition Domain Knowledge

### CIBC Competition Structure
```
Phases:
1. Registration (Jan-Feb)
2. Submission (Feb)
3. Screening (Mar)
4. Semifinal (Apr)
5. Final (May)

Categories:
- Student (16-28 years)
- Startup (0-3 years)
- Corporate

Required Documents:
- BMC PDF
- Pitch Deck (15 slides)
- Executive Summary (2 pages)
- Video Pitch (3 min)

Judging Criteria:
- Innovation (25%)
- Market Potential (20%)
- Business Model (25%)
- Sustainability (15%)
- Team (10%)
- Presentation (5%)
```

---

## 🎯 Quick Start for New Agents

```
Hello! I'm working on CIBC Power, an international BMC competition platform.

Current Phase: [FE Development / BE Development / Integration]
Working On: [Specific feature/component]

Please help me with:
[Describe task]

Context:
- Theme: Premium Gold & Black
- Stack: React + TS + Tailwind + GSAP + Cloudflare
- Mock data: src/services/cibcMockData.ts
- Types: src/types/cibc/index.ts

Files to check:
- [List relevant files]
```

---

## 🔗 External Resources

- **Phosphor Icons:** https://phosphoricons.com
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **D1 Database:** https://developers.cloudflare.com/d1/
- **R2 Storage:** https://developers.cloudflare.com/r2/
- **GSAP:** https://greensock.com/gsap/
- **Tailwind:** https://tailwindcss.com/docs

---

*Last Updated: 2025*  
*Project: CIBC Power by KATH*  
*Maintainer: KATH Development Team*
