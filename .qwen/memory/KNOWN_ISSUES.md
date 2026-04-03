# Known Issues - CIBC Competition Platform

**Last Updated**: 2026-04-03 15:00:00

---

## 🔴 CRITICAL (P0) - BLOCKING DEPLOYMENT

### Issue #P0-001: Mock Login Password Bypass

**Severity**: CRITICAL  
**Status**: ⏳ PENDING FIX  
**File**: `src/pages/cibc/CIBCLogin.tsx:229-253`  
**Task**: P0-001

**Description**:
Mock login function compares passwords in plain text and can be bypassed by only providing email.

**Current Code**:
```typescript
const mockLogin = (email: string, password: string) => {
  const user = users.find((u: { email: string; password: string }) =>
    u.email === email && u.password === password  // ❌ Plain text comparison!
  );
  // ...
};
```

**Risk**:
- Authentication bypass in mock mode
- Anyone can login as any user without password
- Could leak to production if mock mode enabled

**Fix Plan**:
1. Add environment check: `import.meta.env.DEV`
2. Add password validation even in mock mode
3. Add warning console.log when mock mode active
4. Disable mock mode in production builds

**Estimated Fix Time**: 1-2 hours

---

### Issue #P0-002: Type Mismatch - Database vs TypeScript

**Severity**: CRITICAL  
**Status**: ⏳ PENDING FIX  
**Files**: `src/lib/supabase.ts:164` vs `supabase/migrations/v6.0.0-final-schema.sql:83`  
**Task**: P0-002

**Description**:
Team status type definition in TypeScript doesn't match database CHECK constraint.

**TypeScript has**:
```typescript
type TeamStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'registered' 
  | 'active' 
  | 'disqualified' 
  | 'withdrawn' 
  | 'pending' 
  | 'verified';
```

**Database has**:
```sql
CREATE TABLE teams (
  -- ...
  status TEXT DEFAULT 'draft' 
  CHECK (status IN ('draft', 'pending', 'verified', 'rejected'))
);
```

**Mismatch**:
- Code has: `pending_review`, `registered`, `active`, `disqualified`, `withdrawn`
- Database has: `rejected` (not in code)
- Missing: `observer` role in database

**Risk**:
- Runtime insert failures when using status not in DB CHECK
- Type safety completely broken for TeamStatus
- Authorization gaps (observer role not recognized)

**Fix Plan**:
1. Update database CHECK constraint to include all statuses
2. OR update TypeScript type to match database
3. Add ENUM type to database for better type safety
4. Sync both definitions

**Estimated Fix Time**: 2-3 hours

---

### Issue #P0-003: Missing CSRF on Authentication Forms

**Severity**: CRITICAL  
**Status**: ⏳ PENDING FIX  
**Files**: `CIBCLogin.tsx:338`, `JudgeLogin.tsx:170`  
**Task**: P0-003

**Description**:
Login and authentication forms don't use CSRFProtectedForm component.

**Current Code**:
```typescript
// CIBCLogin.tsx - Line 338
<form onSubmit={handleSubmit} className="space-y-6">
  {/* No CSRF token */}
</form>
```

**Expected**:
```typescript
<CSRFProtectedForm onSubmit={handleSubmit}>
  {/* Form content */}
</CSRFProtectedForm>
```

**Risk**:
- Login CSRF attacks possible
- Session hijacking via malicious forms
- Credential theft

**Fix Plan**:
1. Wrap login forms with CSRFProtectedForm
2. Or manually add CSRF token to form submission
3. Test login flow after changes

**Estimated Fix Time**: 1-2 hours

---

### Issue #P0-004: RLS Circular Reference

**Severity**: CRITICAL  
**Status**: ⏳ PENDING FIX  
**File**: `supabase/migrations/v4.0.0-fixed-schema.sql:355-372`  
**Task**: P0-004

**Description**:
Admin RLS policy queries the `users` table that it's protecting, creating a circular dependency.

**Current Policy**:
```sql
CREATE POLICY "Admins can read users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

**Problem**:
- Policy queries `users` table to check if user is admin
- But policy is ON the `users` table itself
- If trigger fails or timing issue, admin access fails

**Risk**:
- Admin access fails intermittently
- Circular dependency can cause deadlocks
- RLS policy evaluation fails

**Fix Plan**:
1. Use `auth.jwt()` to get role from JWT token
2. OR use SECURITY DEFINER function
3. OR store roles in separate table (user_role_assignments already exists)

**Estimated Fix Time**: 2-3 hours

---

### Issue #P0-005: Permissive Notification Insert Policy

**Severity**: CRITICAL  
**Status**: ⏳ PENDING FIX  
**File**: `supabase/migrations/v6.0.0-final-schema.sql:601-603`  
**Task**: P0-005

**Description**:
Notification insert policy allows ANYONE to insert notifications.

**Current Policy**:
```sql
CREATE POLICY "System insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);  -- ❌ ANYONE CAN INSERT!
```

**Risk**:
- Notification spam attacks
- Malicious users can create fake notifications
- Database can be filled with junk data

**Fix Plan**:
```sql
CREATE POLICY "System insert notifications" ON notifications
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role'  -- Only service can insert
    OR EXISTS (
      SELECT 1 FROM user_role_assignments
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );
```

**Estimated Fix Time**: 30 minutes

---

## 🟠 HIGH (P1) - SHOULD FIX SOON

### Issue #P1-004: N+1 Query Problem

**Severity**: HIGH  
**Status**: ⏳ PENDING  
**File**: `src/services/supabase.service.ts:309-323`

**Description**:
Fetching timeline events does sequential queries (1 per stage).

**Current**:
```typescript
for (const stage of stages) {
  const tasks = await this.getTasksByStage(stage.id); // 1 query per stage
  // ...
}
// 10 stages = 11 queries total
```

**Fix**:
```typescript
const stages = await this.supabase
  .from('stages')
  .select('*, tasks(*)')  // Single query with join
  .eq('competition_id', competitionId);
```

**Estimated Fix Time**: 2 hours

---

### Issue #P1-005: Excessive 'any' Types

**Severity**: HIGH  
**Status**: ⏳ PENDING  
**Files**: Multiple (30+ instances)

**Description**:
Too many `any` types instead of proper TypeScript typing.

**Examples**:
```typescript
// CIBCDashboard.tsx:120
const [data, setData] = useState<any>(null);

// catch blocks
catch (error: any) {

// mockData.ts
const mockData: any = {...};
```

**Fix**: Import from centralized `src/types/index.ts`

**Estimated Fix Time**: 4 hours

---

### Issue #P1-006: Missing Unique Constraint

**Severity**: HIGH  
**Status**: ⏳ PENDING  
**File**: `teams` table

**Description**:
No unique constraint on `teams.name` per competition.

**Risk**: Duplicate team names in same competition

**Fix**:
```sql
ALTER TABLE teams 
ADD CONSTRAINT unique_team_name_per_competition 
UNIQUE (competition_id, name);
```

**Estimated Fix Time**: 30 minutes

---

### Issue #P1-007: No Rate Limiting on Registration

**Severity**: HIGH  
**Status**: ⏳ PENDING  
**File**: `src/services/auth.service.ts:147-206`

**Description**:
Login has rate limiting, registration doesn't.

**Risk**: Spam/fake registrations

**Fix**: Add registration rate limiter similar to login

**Estimated Fix Time**: 1 hour

---

### Issue #P1-008: Permissive Notification Insert Policy (Duplicate of P0-005)

See P0-005.

---

### Issue #P1-009: No React.memo Usage

**Severity**: HIGH  
**Status**: ⏳ PENDING  
**Files**: `AdminUsers.tsx:163-219`, `CIBCDashboard.tsx:103-396`

**Description**:
Zero memoization across entire codebase.

**Impact**: Unnecessary re-renders on large lists

**Fix**: Extract and memoize list item components

**Estimated Fix Time**: 3 hours

---

### Issue #P1-010: RLS Circular Reference (Admin Access)

**Severity**: HIGH  
**Status**: ⏳ PENDING  
**File**: `supabase/migrations/v4.0.0-fixed-schema.sql`

**Description**:
Similar to P0-004 but for admin access specifically.

**Estimated Fix Time**: 2 hours

---

## 🟡 MEDIUM (P2) - POST-DEPLOYMENT

### Accessibility Issues (4)

| Issue | File | Fix |
|-------|------|-----|
| Password toggle missing ARIA | Settings.tsx:173-223 | Add aria-label, aria-pressed |
| Tab missing role="tablist" | Settings.tsx:488-506 | Add proper tab ARIA |
| Error not linked to input | Settings.tsx:151-156 | Add aria-describedby |
| Placeholder contrast 3:1 | Settings.tsx:134 | Change to placeholder-white/50 |

**Total Fix Time**: 2-3 hours

---

### Performance Issues (3)

| Issue | File | Fix |
|-------|------|-----|
| No code splitting for admin | App.tsx | Use lazy() + Suspense |
| No list virtualization | AdminUsers.tsx | Use @tanstack/react-virtual |
| Inline functions in onClick | AdminUsers.tsx:127 | Use useCallback |

**Total Fix Time**: 4-5 hours

---

### Security Issues (3)

| Issue | File | Fix |
|-------|------|-----|
| Sensitive console logs | CIBCLogin.tsx:130-133 | Guard with env.debug |
| localStorage token storage | auth.service.ts:122 | Use Supabase session only |
| Timing attack in CSRF | security.ts:138 | Use constantTimeCompare |

**Total Fix Time**: 2-3 hours

---

## 📊 SUMMARY

| Severity | Count | Status | Blocking |
|----------|-------|--------|----------|
| **P0 - Critical** | 5 | ⏳ PENDING | ✅ YES - Deployment blocked |
| **P1 - High** | 7 | ⏳ PENDING | ❌ No - Should fix soon |
| **P2 - Medium** | 14 | ⏳ PENDING | ❌ No - Post-deployment |

**Total Issues**: 26  
**Fixed**: 0  
**Pending**: 26  
**Completion**: 0%

---

## 🎯 FIX PRIORITY

### Before Deployment (MUST FIX):
1. P0-001: Mock login bypass
2. P0-002: Type mismatch
3. P0-003: Missing CSRF on auth
4. P0-004: RLS circular reference
5. P0-005: Permissive notification policy

### Week 1 (SHOULD FIX):
6. P1-004: N+1 queries
7. P1-005: Any types
8. P1-007: Registration rate limiting
9. P1-010: RLS circular reference

### Week 2-3 (NICE TO FIX):
10. P1-006: Unique constraint
11. P1-009: React.memo
12. P2-006 to P2-009: Accessibility, performance, security

---

**Last Updated**: 2026-04-03 15:00:00  
**Next Fix**: P0-001 (Mock login bypass)
