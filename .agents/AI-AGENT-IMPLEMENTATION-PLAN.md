# 🤖 AI Agent Implementation Plan

## Service Architecture Fix - CIBC Competition Platform

**Mission:** Fix all 35 issues in service layer and consolidate to single Supabase-based architecture

**Timeline:** 3 weeks (15 working days)

**Priority:** CRITICAL → HIGH → MEDIUM

---

## 📋 **OVERVIEW**

### **Current State:**
```
❌ 3 different service layers (confusing)
❌ Auth service uses REST API (WRONG!)
❌ Competition service uses REST API (WRONG!)
❌ Duplicate code (cibc.service.ts & supabase.service.ts)
❌ Type definitions not synchronized
❌ No error handling standards
❌ No tests
```

### **Target State:**
```
✅ Single service layer (supabase.service.ts)
✅ All services use Supabase client
✅ No duplicate code
✅ Generated types from Supabase
✅ Standardized error handling
✅ Comprehensive test coverage
```

---

## 🗓️ **WEEK 1: CRITICAL FIXES**

### **Day 1: Fix Auth Service (Issue #1)**

**Goal:** Rewrite auth.service.ts to use Supabase Auth

**Tasks:**
```
□ 1.1: Create backup of old auth.service.ts
   Command: mv src/services/auth.service.ts src/services/auth.service.ts.old

□ 1.2: Create new auth.service.ts with Supabase
   File: src/services/auth.service.ts
   Functions to implement:
   - login(email, password)
   - register(email, password, metadata)
   - logout()
   - resetPassword(email)
   - getCurrentUser()
   - getSession()
   - isAuthenticated()

□ 1.3: Add proper error handling
   - Map Supabase errors to user-friendly messages
   - Log errors with context
   - Return consistent response format

□ 1.4: Create unit tests
   File: src/services/__tests__/auth.service.test.ts
   Tests:
   - login with valid credentials → success
   - login with invalid credentials → error
   - register new user → success
   - logout → clears session
   - getCurrentUser when logged in → returns user
   - getCurrentUser when logged out → returns null

□ 1.5: Update imports in components
   Find all: import { authService } from '@/services/auth.service'
   Verify: Still works with new implementation
   Test: Login flow manually

□ 1.6: Delete old file
   Command: rm src/services/auth.service.ts.old
```

**Expected Output:**
- New `src/services/auth.service.ts` (150-200 lines)
- Test file: `src/services/__tests__/auth.service.test.ts` (100+ lines)
- All login flows working
- No REST API calls

**Acceptance Criteria:**
```
✅ User can login with email/password
✅ User can register
✅ User can logout
✅ Session persists after refresh
✅ Error messages are user-friendly
✅ All tests passing
```

---

### **Day 2: Fix Competition Service (Issue #2)**

**Goal:** Rewrite competition.service.ts to use Supabase queries

**Tasks:**
```
□ 2.1: Create backup of old competition.service.ts
   Command: mv src/services/competition.service.ts src/services/competition.service.ts.old

□ 2.2: Create new competition.service.ts with Supabase
   File: src/services/competition.service.ts
   Functions to implement:
   - getActive() → returns active competition
   - getById(id) → returns competition by ID
   - getAll() → returns all competitions
   - create(data) → creates new competition (admin)
   - update(id, data) → updates competition (admin)
   - delete(id) → deletes competition (admin)
   - getStats() → returns competition statistics

□ 2.3: Add proper error handling
   - Consistent return types
   - Error logging
   - User-friendly messages

□ 2.4: Create unit tests
   File: src/services/__tests__/competition.service.test.ts
   Tests:
   - getActive returns active competition
   - getById returns competition
   - getById with invalid ID returns null
   - create competition (admin)
   - update competition (admin)

□ 2.5: Update imports in components
   Find all: import { competitionService } from '@/services/competition.service'
   Verify: Still works with new implementation
   Test: Competition list & detail pages

□ 2.6: Delete old file
   Command: rm src/services/competition.service.ts.old
```

**Expected Output:**
- New `src/services/competition.service.ts` (200-250 lines)
- Test file: `src/services/__tests__/competition.service.test.ts` (150+ lines)
- All competition data loading from Supabase
- No REST API calls

**Acceptance Criteria:**
```
✅ Competition list loads from Supabase
✅ Competition detail works
✅ Admin can create/update/delete competitions
✅ All tests passing
```

---

### **Day 3: Fix Service Factory (Issue #3)**

**Goal:** Simplify Service Factory to always use Supabase

**Tasks:**
```
□ 3.1: Analyze current Service Factory
   File: src/services/service.factory.ts
   Identify: All service types and paths

□ 3.2: Simplify logic
   Remove: Legacy service paths
   Keep: Only Supabase services
   Simplify: Single path for all services

□ 3.3: Update getService method
   New logic:
   - If Supabase configured → use Supabase services
   - If not configured → throw error (don't fallback to mock)
   - Remove useMockData logic

□ 3.4: Update exports
   File: src/services/index.ts
   Remove: Exports of old services
   Keep: Only Supabase services

□ 3.5: Test Service Factory
   Test: Get all service types
   Verify: All return Supabase implementations
   Test: Components that use Service Factory
```

**Expected Output:**
- Simplified `src/services/service.factory.ts` (100-120 lines)
- Clean exports in `src/services/index.ts`
- No legacy service paths

**Acceptance Criteria:**
```
✅ Service Factory always returns Supabase services
✅ No legacy API calls
✅ All components work with new factory
✅ All tests passing
```

---

### **Day 4: Merge Services (Issue #4)**

**Goal:** Merge cibc.service.ts & supabase.service.ts into single file

**Tasks:**
```
□ 4.1: Analyze both services
   Create list of all methods in cibc.service.ts
   Create list of all methods in supabase.service.ts
   Identify: Overlaps, gaps, duplicates

□ 4.2: Create merged service
   File: src/services/supabase-merged.service.ts
   Structure:
   - Import all types from @/lib/supabase
   - Create supabaseAuthService
   - Create supabaseCompetitionService
   - Create supabaseStageService
   - Create supabaseTaskService
   - Create supabaseTeamService
   - Create supabaseSubmissionService
   - Create supabaseAnnouncementService
   - Create supabasePaymentService (from cibc.service.ts)
   - Export all as supabaseServices object

□ 4.3: Standardize methods
   - Consistent naming
   - Consistent error handling
   - Consistent return types
   - Add JSDoc comments

□ 4.4: Update imports
   Find: All imports of cibc.service.ts & supabase.service.ts
   Replace: With supabase-merged.service.ts
   Test: All features manually

□ 4.5: Delete old files
   Command: 
   rm src/services/cibc.service.ts
   rm src/services/supabase.service.ts
   mv src/services/supabase-merged.service.ts src/services/supabase.service.ts
```

**Expected Output:**
- Single `src/services/supabase.service.ts` (400-500 lines)
- All services consolidated
- No duplicate code

**Acceptance Criteria:**
```
✅ All methods from both files available
✅ No duplicate code
✅ Consistent API
✅ All features working
✅ All tests passing
```

---

### **Day 5: Fix Types & Cleanup (Issues #5, #7)**

**Goal:** Unify type definitions and delete dead code

**Tasks:**
```
□ 5.1: Generate types from Supabase
   Command: npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase-generated.ts
   
□ 5.2: Review generated types
   File: src/types/supabase-generated.ts
   Verify: All entities covered
   Fix: Any issues with generated types

□ 5.3: Update all imports
   Replace: Local type definitions
   With: Generated types from src/types/supabase-generated.ts
   Fix: Type mismatches

□ 5.4: Delete api.ts (Issue #5)
   Check: No files importing api.ts
   Command: rm src/services/api.ts
   Update: src/services/index.ts (remove api exports)

□ 5.5: Fix environment validation (Issue #12)
   File: src/config/environment.ts
   Add: Throw error in development if env vars missing
   Test: App throws error without .env

□ 5.6: Remove mock mode (Issue #6)
   File: src/lib/supabase.ts
   Function: uploadFileToDrive
   Remove: Mock mode that returns fake URLs
   Add: Throw error if n8n not configured

□ 5.7: Final cleanup
   Run: TypeScript compiler
   Fix: All type errors
   Test: All features manually
```

**Expected Output:**
- Generated types: `src/types/supabase-generated.ts`
- All files using generated types
- `src/services/api.ts` deleted
- No mock mode in uploadFileToDrive
- Strict environment validation

**Acceptance Criteria:**
```
✅ No TypeScript errors
✅ All types from Supabase
✅ No dead code
✅ Environment validation working
✅ Upload throws error if n8n not configured
```

---

## 🗓️ **WEEK 2: HIGH PRIORITY FIXES**

### **Day 6: Standardize Error Handling (Issue #9)**

**Goal:** Create consistent error handling across all services

**Tasks:**
```
□ 6.1: Create error handling utility
   File: src/utils/error-handler.ts
   Functions:
   - handleSupabaseError(error, context)
   - mapErrorCode(error)
   - createUserFriendlyMessage(error)

□ 6.2: Create standard response type
   File: src/types/service-response.ts
   Types:
   - ServiceResponse<T>
   - ServiceError
   - SuccessResponse
   - ErrorResponse

□ 6.3: Update all service methods
   Standard pattern:
   ```typescript
   try {
     const { data, error } = await supabase...;
     if (error) {
       logger.error('Context', error);
       return { success: false, error: mapError(error) };
     }
     return { success: true, data };
   } catch (err) {
     logger.error('Context', err);
     return { success: false, error: 'Unexpected error' };
   }
   ```

□ 6.4: Create tests for error handling
   File: src/utils/__tests__/error-handler.test.ts
   Tests: All error scenarios
```

**Expected Output:**
- Error handling utility
- Standard response types
- All services using standard pattern
- Error handling tests

**Acceptance Criteria:**
```
✅ Consistent error handling in all services
✅ User-friendly error messages
✅ Errors logged with context
✅ All tests passing
```

---

### **Day 7: Add Retry Logic (Issue #10)**

**Goal:** Implement retry mechanism for transient failures

**Tasks:**
```
□ 7.1: Create retry utility
   File: src/utils/retry.ts
   Function: withRetry(fn, maxRetries, delayMs)
   Features:
   - Configurable retries (default: 3)
   - Exponential backoff
   - Only retry on transient errors

□ 7.2: Identify retry-worthy operations
   List:
   - Database queries
   - File uploads
   - Auth operations
   - External API calls

□ 7.3: Wrap service methods with retry
   Pattern:
   ```typescript
   return await withRetry(async () => {
     const { data, error } = await supabase...;
     if (error) throw error;
     return data;
   }, 3, 1000);
   ```

□ 7.4: Create tests for retry logic
   File: src/utils/__tests__/retry.test.ts
   Tests:
   - Success on first try (no retry)
   - Success on second try (1 retry)
   - Fail after max retries
   - Exponential backoff timing
```

**Expected Output:**
- Retry utility with exponential backoff
- All critical operations wrapped with retry
- Retry tests

**Acceptance Criteria:**
```
✅ Transient failures automatically retried
✅ Permanent errors fail immediately
✅ Exponential backoff working
✅ All tests passing
```

---

### **Day 8: Add Caching Layer (Issue #11)**

**Goal:** Implement request caching to reduce database load

**Tasks:**
```
□ 8.1: Create caching utility
   File: src/utils/cache.ts
   Class: RequestCache
   Features:
   - TTL-based expiration
   - Memory-efficient
   - Cache invalidation
   - Cache statistics

□ 8.2: Identify cacheable operations
   List:
   - getCompetition() - 5 min TTL
   - getActiveCompetitions() - 5 min TTL
   - getCompetitionStats() - 2 min TTL
   - getLeaderboard() - 1 min TTL

□ 8.3: Implement caching in services
   Pattern:
   ```typescript
   const cacheKey = `competition:${id}`;
   const cached = cache.get(cacheKey);
   if (cached) return cached;
   
   const { data } = await supabase...;
   cache.set(cacheKey, data, 5 * 60);
   return data;
   ```

□ 8.4: Add cache invalidation
   Events:
   - After create/update/delete
   - Manual invalidation
   - Time-based expiration

□ 8.5: Create tests for caching
   File: src/utils/__tests__/cache.test.ts
   Tests:
   - Cache hit returns cached data
   - Cache miss fetches from DB
   - TTL expiration working
   - Invalidation working
```

**Expected Output:**
- Caching utility
- Cached operations for common queries
- Cache invalidation logic
- Cache tests

**Acceptance Criteria:**
```
✅ Repeated queries served from cache
✅ Cache expires after TTL
✅ Cache invalidated on updates
✅ All tests passing
```

---

### **Day 9: Create Logging Service (Issue #14)**

**Goal:** Implement centralized logging service

**Tasks:**
```
□ 9.1: Create logger utility
   File: src/utils/logger.ts
   Class: Logger
   Levels:
   - error (with stack trace)
   - warn (with context)
   - info (with metadata)
   - debug (detailed)

□ 9.2: Add context to all logs
   Pattern:
   ```typescript
   logger.error('[CompetitionService.getCompetition]', error, {
     competitionId: id,
     userId: currentUser?.id,
     timestamp: new Date().toISOString()
   });
   ```

□ 9.3: Update all service methods
   Replace: console.log, console.error, console.warn
   With: logger.info, logger.error, logger.warn

□ 9.4: Add log filtering (development vs production)
   Development: All log levels
   Production: Error & warn only

□ 9.5: Create tests for logger
   File: src/utils/__tests__/logger.test.ts
```

**Expected Output:**
- Centralized logger utility
- All services using logger
- Context-rich logs
- Logger tests

**Acceptance Criteria:**
```
✅ All logs have context
✅ Different log levels working
✅ Production filtering working
✅ All tests passing
```

---

### **Day 10: Complete Payment Service (Issue #13)**

**Goal:** Complete all missing payment methods

**Tasks:**
```
□ 10.1: Review current payment service
    File: src/services/supabase.service.ts
    Section: supabasePaymentService
    Identify: Missing methods

□ 10.2: Implement missing methods
    Methods to add:
    - getPaymentHistory(teamId)
    - getPaymentStats(competitionId) - complete existing
    - exportPaymentReport(competitionId, dateRange)
    - getPaymentByTeam(teamId)
    - bulkVerifyPayments(teamIds)
    - getPaymentAnalytics(dateRange)

□ 10.3: Add proper error handling
    - Validate inputs
    - Handle edge cases
    - Log errors

□ 10.4: Create tests for payment service
    File: src/services/__tests__/payment.service.test.ts
    Tests: All payment methods

□ 10.5: Test manually
    Test: All payment flows in admin dashboard
```

**Expected Output:**
- Complete payment service
- All payment methods implemented
- Payment tests

**Acceptance Criteria:**
```
✅ All payment methods available
✅ Payment approval flow complete
✅ Payment stats working
✅ All tests passing
```

---

## 🗓️ **WEEK 3: MEDIUM PRIORITY & TESTING**

### **Day 11-12: Add Unit Tests (Issue #15)**

**Goal:** Achieve >90% test coverage

**Tasks:**
```
□ 11.1: Setup test framework
    Install: vitest, @testing-library/react
    Configure: vitest.config.ts
    Setup: Test utilities & mocks

□ 11.2: Create test files for all services
    Files:
    - src/services/__tests__/auth.service.test.ts
    - src/services/__tests__/competition.service.test.ts
    - src/services/__tests__/team.service.test.ts
    - src/services/__tests__/submission.service.test.ts
    - src/services/__tests__/payment.service.test.ts
    - src/services/__tests__/announcement.service.test.ts

□ 11.3: Write comprehensive tests
    For each service:
    - Success scenarios
    - Error scenarios
    - Edge cases
    - Integration tests

□ 11.4: Run test coverage
    Command: npm run test:coverage
    Target: >90% coverage
    Fix: Any gaps

□ 11.5: Setup CI/CD integration
    Add: Test step to CI/CD
    Require: All tests passing before deploy
```

**Expected Output:**
- Test files for all services
- >90% code coverage
- CI/CD integration

**Acceptance Criteria:**
```
✅ All services have tests
✅ Coverage >90%
✅ All tests passing
✅ CI/CD running tests
```

---

### **Day 13-14: Fix Medium Issues (#16-25)**

**Goal:** Fix all medium severity issues

**Tasks:**
```
□ 13.1: Enable TypeScript strict mode (Issue #16)
    File: tsconfig.json
    Set: "strict": true
    Fix: All type errors

□ 13.2: Standardize method naming (Issue #17)
    Pattern: camelCase, verb-first
    Examples: getById, createTeam, updateStatus
    Fix: Inconsistent names

□ 13.3: Add JSDoc documentation (Issue #18)
    Add: JSDoc comments to all public methods
    Include: @param, @returns, @throws, @example

□ 13.4: Add loading states (Issue #19)
    Create: Loading context provider
    Add: Loading states to all async operations
    Test: UX during loading

□ 13.5: Add timeout handling (Issue #20)
    Add: Timeout to all fetch calls
    Default: 30 seconds
    Handle: Timeout errors gracefully

□ 13.6: Add request cancellation (Issue #21)
    Add: AbortController to all fetch calls
    Cleanup: Abort on component unmount
    Handle: AbortError gracefully

□ 13.7: Standardize date formats (Issue #22)
    Use: ISO 8601 everywhere
    Convert: All dates to UTC
    Format: User-friendly display

□ 13.8: Add error codes (Issue #23)
    Create: Error code enum
    Map: Each error to code
    Use: Codes in error responses

□ 13.9: Fix import order (Issue #24)
    Standard: 
    1. External libraries
    2. Internal modules
    3. Relative imports
    4. Styles
    Fix: All files

□ 13.10: Add performance monitoring (Issue #25)
    Add: Performance marks to critical operations
    Track: API response times
    Alert: Slow operations
```

**Expected Output:**
- All medium issues fixed
- Code quality improved
- Better DX

**Acceptance Criteria:**
```
✅ TypeScript strict mode enabled
✅ Consistent naming
✅ JSDoc on all public methods
✅ Loading states everywhere
✅ Timeout handling
✅ Request cancellation
✅ Standardized dates
✅ Error codes
✅ Clean imports
✅ Performance monitoring
```

---

### **Day 15: Final Testing & Documentation**

**Goal:** Final verification and documentation

**Tasks:**
```
□ 15.1: Run all tests
    Command: npm run test
    Fix: Any failing tests
    Verify: Coverage still >90%

□ 15.2: Manual testing
    Test all critical flows:
    - User registration
    - User login
    - Team creation
    - Payment upload
    - Submission upload
    - Admin approval
    - Judging flow

□ 15.3: Performance testing
    Test: Page load times
    Test: API response times
    Target: <200ms for cached, <500ms for uncached

□ 15.4: Update documentation
    Files:
    - README.md (update architecture section)
    - SERVICES.md (create new - service documentation)
    - TESTING.md (create new - testing guide)

□ 15.5: Create changelog
    File: CHANGELOG.md
    Include: All changes made
    Format: Conventional Commits

□ 15.6: Final review
    Review: All code changes
    Verify: All acceptance criteria met
    Approve: Ready for staging deploy
```

**Expected Output:**
- All tests passing
- Manual testing complete
- Performance targets met
- Documentation updated
- Changelog created

**Acceptance Criteria:**
```
✅ All tests passing
✅ All critical flows working
✅ Performance targets met
✅ Documentation complete
✅ Ready for production
```

---

## 📊 **DAILY CHECKLIST**

### **Morning (9:00 AM):**

```
□ Review yesterday's progress
□ Check for any breaking changes
□ Plan today's tasks
□ Create backup branch
```

### **During Work:**

```
□ Commit every 30-60 minutes
□ Write tests as you code
□ Test manually after each fix
□ Document changes
```

### **Evening (5:00 PM):**

```
□ Run all tests
□ Fix any failing tests
□ Update progress document
□ Commit final changes
□ Create daily report
```

---

## 📝 **PROGRESS TRACKING**

### **Daily Report Template:**

```markdown
## Day X Progress Report

**Date:** YYYY-MM-DD
**Focus:** [Topic of the day]

### Completed:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Issues Encountered:
- Issue 1: [Description]
  Resolution: [How fixed]
- Issue 2: [Description]
  Resolution: [How fixed]

### Tests:
- Total: X tests
- Passing: Y tests
- Coverage: Z%

### Tomorrow's Plan:
- Task 1
- Task 2
- Task 3

### Blockers:
- [Any blockers]
```

---

## 🚨 **ESCALATION PATH**

### **If Stuck:**

```
Level 1: Try for 30 minutes
         - Read documentation
         - Check Stack Overflow
         - Review similar code

Level 2: After 30 minutes, ask for help
         - Document what you tried
         - Show error messages
         - Ask specific question

Level 3: If critical blocker, skip to next task
         - Document blocker
         - Move to next priority task
         - Come back later
```

---

## ✅ **FINAL CHECKLIST**

### **Before Marking Complete:**

```
□ All 35 issues addressed
□ All tests passing (>90% coverage)
□ No TypeScript errors
□ Manual testing complete
□ Performance targets met
□ Documentation updated
□ Changelog created
□ Code reviewed
□ Ready for staging deploy
```

---

**AI Agent: Start with Day 1 tasks now!**

**Good luck! 🚀**
