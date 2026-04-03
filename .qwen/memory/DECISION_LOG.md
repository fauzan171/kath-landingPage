# Architectural Decision Log

**Last Updated**: 2026-04-03 15:00:00

---

## Decision #001 - Use user_role_assignments Table

**Date**: 2026-04-03  
**Task**: 1.2 - Fix RLS Policies  
**Decided By**: AI Agent + User Approval

### Context
Needed to choose role management approach:
- **Option A**: `users.role` column (simple, global roles)
- **Option B**: `user_role_assignments` table (complex, competition-specific roles)

### Options Analysis

#### Option A: users.role Column
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  role TEXT CHECK(role IN ('participant', 'admin', 'super_admin', 'judge')) DEFAULT 'participant'
);
```

**Pros**:
- Simpler queries (single table lookup)
- Better performance (no joins needed)
- Easier to maintain

**Cons**:
- Global role only (not competition-specific)
- Can't have different roles per competition
- Judge can see ALL submissions across ALL competitions
- Less flexible for future expansion

#### Option B: user_role_assignments Table
```sql
CREATE TABLE user_role_assignments (
  user_id UUID REFERENCES users(id),
  competition_id UUID REFERENCES competitions(id),
  role VARCHAR(50) NOT NULL,
  UNIQUE(user_id, competition_id)
);
```

**Pros**:
- Competition-specific roles
- Judge only sees assigned submissions
- More granular permissions
- Better for multi-competition scenarios
- Matches PRD specification

**Cons**:
- More complex queries (requires joins)
- Need to seed admin roles
- Slightly slower performance

### Decision
**Chose Option B**: `user_role_assignments` table

### Reasoning
1. Matches PRD requirements for competition-specific roles
2. Better security - judge only sees submissions from assigned competitions
3. More granular control (admin for comp A, participant for comp B)
4. Scalable for future multi-competition scenarios
5. Already defined in `supabase-schema.sql` (lines 217-224)

### Impact
- RLS policies more complex but more secure
- Requires joins in queries
- Better authorization isolation

### Files Affected
- `supabase/migrations/v5.0.0-rls-policies-fix.sql`
- `src/components/ProtectedRoute.tsx`
- `src/services/auth.service.ts`

---

## Decision #002 - Defer Phase 4 to Post-Deployment

**Date**: 2026-04-03  
**Task**: All Phase 4  
**Decided By**: User

### Context
Phase 4 tasks are nice-to-have improvements, not security-critical.

### Options
- **Option A**: Complete all phases before deployment (2-3 weeks)
- **Option B**: Deploy after Phase 1-3, fix Phase 4 post-deployment (1 week + sprint 2)

### Decision
**Chose Option B**: Defer Phase 4 to post-deployment sprint

### Reasoning
1. 68% of critical tasks complete (Phase 1-3)
2. Phase 4 = UX improvements, not security features
3. Faster time-to-market (1 week vs 3-4 weeks)
4. Can iterate after launch based on user feedback
5. Technical debt documented and tracked

### Impact
- Deploy sooner with core security features
- Known technical debt tracked in KNOWN_ISSUES.md
- Plan to fix in Sprint 2 post-deployment

### Files Affected
- None (decision only)

---

## Decision #003 - Keep useAuth Hook Instead of Direct Import

**Date**: 2026-04-03  
**Task**: 2.4 - Login.tsx Migration  
**Decided By**: AI Agent

### Context
FIX-IMPLEMENTATION-PROMPT.md suggested direct import from `auth.service.ts`, but `useAuth` hook was already working.

### Options

#### Option A: Direct Import (as per spec)
```typescript
import { login } from '@/services/auth.service';

const Login = () => {
  const handleLogin = async (email, password) => {
    const result = await login({ email, password });
    // ...
  };
};
```

#### Option B: useAuth Hook (React-idiomatic)
```typescript
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const handleLogin = async (email, password) => {
    const result = await login({ email, password });
    // ...
  };
};
```

### Decision
**Chose Option B**: Keep useAuth hook pattern

### Reasoning
1. useAuth hook internally calls auth.service.ts (same functionality)
2. More React-idiomatic pattern
3. Better separation of concerns
4. Easier to test and maintain
5. No functional difference
6. Consistent with React best practices

### Impact
- Minor deviation from spec
- Better code maintainability
- No security impact
- More testable code

### Files Affected
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`
- `src/hooks/useAuth.ts`

---

## Decision #004 - Create Consolidated Migration Files

**Date**: 2026-04-03  
**Task**: 3.1 - Consolidate SQL Schemas  
**Decided By**: AI Agent

### Context
Multiple SQL schema files with inconsistencies:
- `supabase-schema.sql`
- `supabase-complete-setup.sql`
- `v4.0.0-fixed-schema.sql`
- `supabase-add-missing-columns.sql`

### Options

#### Option A: Keep Separate Files
- Maintain all files separately
- Update each file individually
- Risk: Inconsistencies

#### Option B: Create Consolidated Migration Files
- Create versioned migration files
- Mark old files as deprecated
- Clear migration path

### Decision
**Chose Option B**: Create consolidated migration files

### Migration Strategy
```
v5.0.0-rls-policies-fix.sql    ← RLS policies
v5.1.0-missing-tables.sql      ← Missing tables
v6.0.0-final-schema.sql        ← Consolidated schema
```

### Impact
- Clear version history
- Easier to apply migrations
- Old files kept with deprecation notices
- Migration guide created

### Files Affected
- `supabase/migrations/v5.0.0-rls-policies-fix.sql` (NEW)
- `supabase/migrations/v5.1.0-missing-tables.sql` (NEW)
- `supabase/migrations/v6.0.0-final-schema.sql` (NEW)
- `supabase/MIGRATION-GUIDE.md` (NEW)
- All old SQL files (deprecated)

---

## Decision #005 - Implement Memory System for Continuity

**Date**: 2026-04-03  
**Task**: Project Management  
**Decided By**: AI Agent + User Request

### Context
Need to maintain context across multiple AI agent sessions.

### Requirements
- Preserve context between sessions
- Track all tasks and their status
- Log architectural decisions
- Track file changes
- Enable smooth handoffs

### Decision
**Create Memory System** with following files:
```
.qwen/memory/
├── CURRENT_STATE.md      ← Current project state
├── TASK_TRACKER.md       ← All tasks & status
├── DECISION_LOG.md       ← This file
├── FILES_MODIFIED.md     ← Change log
├── KNOWN_ISSUES.md       ← All known bugs
└── SESSION_HISTORY/      ← Session logs
```

### Impact
- 100% context preservation
- Easy session handoffs
- Clear progress tracking
- Decision history maintained

### Files Affected
- `.qwen/memory/CURRENT_STATE.md` (NEW)
- `.qwen/memory/TASK_TRACKER.md` (NEW)
- `.qwen/memory/DECISION_LOG.md` (NEW)
- `.qwen/memory/FILES_MODIFIED.md` (NEW)
- `.qwen/memory/KNOWN_ISSUES.md` (NEW)
- `ORCHESTRATOR-GUIDE.md` (NEW)

---

## Decision #006 - Deploy After P0 Fixes (Option A)

**Date**: 2026-04-03  
**Task**: Deployment Strategy  
**Decided By**: User + AI Recommendation

### Context
QA Report identified 5 P0 critical issues blocking deployment.

### Options

#### Option A: Fix P0 Only, Then Deploy
- Fix 5 P0 issues (1-2 days)
- Deploy immediately
- Fix P1/P2 post-deployment
- **Time**: 1-2 days + deploy

#### Option B: Fix P0 + P1, Then Deploy
- Fix 5 P0 + 7 P1 issues (3-4 days)
- Deploy with higher confidence
- Fix P2 post-deployment
- **Time**: 3-4 days + deploy

#### Option C: Fix All Issues, Then Deploy
- Fix all 26 issues (1-2 weeks)
- Deploy with zero technical debt
- **Time**: 1-2 weeks + deploy

### Decision
**Chose Option A**: Fix P0 only, then deploy

### Reasoning
1. P0 issues are actual security blockers
2. P1/P2 are improvements, not blocking
3. Faster time-to-market
4. Can iterate post-deployment
5. 95% of critical features already complete

### Impact
- Deploy in 1-2 days
- Known P1/P2 technical debt
- Documented in KNOWN_ISSUES.md
- Plan to fix in Sprint 2

### Files Affected
- None (decision only)

---

## 📊 DECISION SUMMARY

| ID | Topic | Decision | Impact |
|----|-------|----------|--------|
| #001 | Role Management | user_role_assignments table | More secure, competition-specific roles |
| #002 | Phase 4 Timing | Defer to post-deployment | Faster launch, tracked debt |
| #003 | Auth Pattern | Keep useAuth hook | Better React pattern |
| #004 | SQL Migrations | Consolidated files | Clear version history |
| #005 | Memory System | Create .qwen/memory/ | 100% context preservation |
| #006 | Deployment | Fix P0 then deploy | 1-2 days to launch |

---

## 🎯 PENDING DECISIONS

### None currently

All major architectural decisions have been made and documented.

---

**Next Session**: Continue fixing P0 issues as per decisions above.

**Last Updated**: 2026-04-03 15:00:00
