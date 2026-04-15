# CIBC Registration Form Update Plan

## Objective

Restructure the CIBC registration form from the current 5-step flow to a new 6-step flow that matches the Google Form guidebook requirements. The update includes adding sub-theme selection, inline team member registration, multi-document uploads, and an enhanced payment section with bank logos and tiered pricing.

---

## Current State Analysis

### Existing Form Steps (5 steps)
1. **Account** - email, password, confirmPassword, agreeToTerms (`CIBCRegister.tsx:414-507`)
2. **Personal** - fullName, birthDate, phone, country, city (`CIBCRegister.tsx:509-607`)
3. **Category** - category=student, institutionName, studentId, major (`CIBCRegister.tsx:609-688`)
4. **Team** - teamName only (`CIBCRegister.tsx:690-737`)
5. **Payment** - paymentFile upload, agreeToPayment (`CIBCRegister.tsx:739-869`)

### Key Files
- **Form UI**: `src/pages/cibc/CIBCRegister.tsx` (902 lines)
- **Service Layer**: `src/services/cibc.service.ts` (re-export layer), `src/services/supabase.service.ts` (actual services)
- **Type Definitions**: `src/lib/supabase.ts` (Team interface at line 187-211, TeamMember at 213-233)
- **Database Schema**: `supabase/migrations/v6.0.0-final-schema.sql` (teams table at line 76-91)
- **Latest Migration**: `supabase/migrations/v6.6.0-missing-submission-columns.sql` (adds student_id, major to team_members)

### Database Schema Gaps
- `teams` table: No `sub_theme` column
- `teams` table: No document URL columns (`student_cards_url`, `instagram_proof_url`, `twibbon_proof_url`, `bmc_url`)
- No bank logo assets exist in `/public` directory yet
- `team_members` already has `student_id`, `institution`, `major` columns (added in v6.6.0)

---

## Target Form Steps (6 steps)

| Step | Name | Fields |
|------|------|--------|
| 1 | Account | email, password, confirmPassword, agreeToTerms (UNCHANGED) |
| 2 | Team & Theme | teamName, subTheme (Energy\|Health\|Food\|Finance\|Beauty\|Manufacture) |
| 3 | Leader Personal | fullName, institutionName, studentId, major, phone |
| 4 | Team Members | member1 (fullName, institution, studentId), member2 (fullName, institution, studentId) |
| 5 | Documents | studentIdCards PDF, instagramFollowProof PDF, twibbonProof PDF (max 5 files), bmc PDF |
| 6 | Payment | Mandiri/OVO/SuperBank info with logos, pricing tiers, payment proof upload |

---

## Implementation Plan

### Phase 1: Database Migration

- [ ] **Task 1.1**: Create new migration file `supabase/migrations/v7.0.0-registration-update.sql`
  - Rationale: All schema changes must be in a versioned migration file following the existing naming convention (v6.x.x pattern).
  - This migration will contain all ALTER TABLE statements for the new columns.

- [ ] **Task 1.2**: Add `sub_theme` column to `teams` table
  - Add: `ALTER TABLE teams ADD COLUMN IF NOT EXISTS sub_theme TEXT;`
  - Add check constraint: `CHECK (sub_theme IN ('Energy', 'Health', 'Food', 'Finance', 'Beauty', 'Manufacture') OR sub_theme IS NULL)`
  - Rationale: The sub-theme is a team-level attribute (not per-member), so it belongs on the `teams` table.

- [ ] **Task 1.3**: Add document URL columns to `teams` table
  - Add columns: `student_cards_url TEXT`, `instagram_proof_url TEXT`, `twibbon_proof_url TEXT` (JSONB array for multiple files), `bmc_url TEXT`
  - Consider using `twibbon_proof_urls JSONB DEFAULT '[]'` since twibbon allows up to 5 files
  - Rationale: Documents are team-level requirements, stored as URLs referencing uploaded files in R2/Supabase Storage.

- [ ] **Task 1.4**: Run the migration against the Supabase database
  - Execute the SQL migration in the Supabase dashboard SQL editor or via CLI
  - Verify columns exist with `\d teams` or Supabase table editor

### Phase 2: Type Definitions Update

- [ ] **Task 2.1**: Update `Team` interface in `src/lib/supabase.ts` (line 187-211)
  - Add `sub_theme?: string` field
  - Add `student_cards_url?: string` field
  - Add `instagram_proof_url?: string` field
  - Add `twibbon_proof_urls?: string[]` field (array for multi-file)
  - Add `bmc_url?: string` field
  - Rationale: TypeScript interfaces must match the database schema for type safety.

- [ ] **Task 2.2**: Update all Supabase query SELECT statements that reference `teams` table
  - Files to update: `src/lib/supabase.ts` (lines 587, 595), `src/services/supabase.service.ts` (lines 708, 722, 774)
  - Add the new columns to all `.select()` calls on the `teams` table
  - Rationale: Supabase client only returns explicitly selected columns; omitting new columns will cause data loss on reads.

### Phase 3: Service Layer Updates

- [ ] **Task 3.1**: Update `teamsService.create()` in `src/services/supabase.service.ts` (line 797-840)
  - Extend the object-based API to accept `sub_theme` parameter
  - Update `insertData` object to include `sub_theme` when provided
  - Rationale: The team creation during registration now needs to persist the sub-theme.

- [ ] **Task 3.2**: Create document upload helper function in `src/services/supabase.service.ts`
  - Add a new `uploadDocumentProof` function similar to `uploadPaymentProof` (line 1765-1827)
  - Use `uploadType: 'document'` when calling `uploadFileToR2`
  - Support multi-file upload for twibbon (return array of URLs)
  - Rationale: Documents use the same R2 upload pipeline but need a distinct upload type for organization.

- [ ] **Task 3.3**: Add `updateTeamDocuments` method to `supabasePaymentService` or create new `supabaseDocumentService`
  - Method signature: `updateTeamDocuments(teamId, { student_cards_url, instagram_proof_url, twibbon_proof_urls, bmc_url })`
  - Updates the `teams` row with document URLs after successful uploads
  - Rationale: Need a clean way to persist document URLs to the database after upload.

### Phase 4: Bank Logo Assets

- [ ] **Task 4.1**: Source and add bank logo images to `public/images/banks/` directory
  - Required logos: Mandiri, OVO (now Astra), SuperBank
  - Use PNG or SVG format with transparent backgrounds
  - Recommended size: 120x40px or similar aspect ratio for consistent display
  - Rationale: Payment section requires visual bank identification per the design requirements.

- [ ] **Task 4.2**: Verify logo assets render correctly in the cream/gold theme
  - Ensure logos have sufficient contrast against `#F9F8F6` background
  - Consider adding subtle border or shadow if logos lack contrast

### Phase 5: Registration Form UI Overhaul (`CIBCRegister.tsx`)

- [ ] **Task 5.1**: Update step count from 5 to 6 and modify the `steps` array (line 333-339)
  - Change to: Account, Team & Theme, Leader Personal, Team Members, Documents, Payment
  - Update progress bar calculation from `(currentStep - 1) / 4` to `(currentStep - 1) / 5` (line 383)
  - Update step labels in the progress tracker (lines 399-404)
  - Update `nextStep` max step check from 5 to 6 (line 158)
  - Update button condition from `currentStep < 5` to `currentStep < 6` (line 884)
  - Rationale: The form now has 6 steps, all navigation logic must reflect this.

- [ ] **Task 5.2**: KEEP Step 1 (Account) unchanged
  - No modifications needed; schema, validation, and UI remain the same
  - Lines 414-507 stay as-is

- [ ] **Task 5.3**: Replace Step 2 (Personal) with Team & Theme step
  - Remove: birthDate, country, city fields
  - Add: `teamName` input field (moved from old Step 4)
  - Add: `subTheme` radio button group or select dropdown with options: Energy, Health, Food, Finance, Beauty, Manufacture
  - Create new Zod schema `step2Schema` with `teamName` and `subTheme` validation
  - Update `step2Form` default values
  - Design: Use visually appealing card-based radio buttons for sub-theme selection with icons/colors per theme
  - Rationale: Team name and theme selection are logically grouped; this matches the Google Form structure.

- [ ] **Task 5.4**: Replace Step 3 (Category) with Leader Personal step
  - Remove: category field (hardcode as 'student')
  - Keep: institutionName, studentId, major
  - Add: fullName (moved from old Step 2), phone (moved from old Step 2)
  - Create new Zod schema `step3Schema` with fullName, institutionName, studentId, major, phone
  - Update `step3Form` default values
  - Rationale: All leader personal information is consolidated into one step.

- [ ] **Task 5.5**: Replace Step 4 (Team) with Team Members step
  - Remove: standalone teamName field (moved to Step 2)
  - Add: Member 1 section (fullName, institution, studentId) - optional
  - Add: Member 2 section (fullName, institution, studentId) - optional
  - Create new Zod schema `step4Schema` with optional member fields
  - Each member section should have a collapsible/expandable UI pattern
  - Add visual distinction between member slots (Member 1, Member 2 labels)
  - Rationale: Team members are now registered inline during sign-up instead of post-registration via dashboard.

- [ ] **Task 5.6**: Create new Step 5 (Documents)
  - Add state variables for document files: `studentIdCards`, `instagramProof`, `twibbonProof` (array, max 5), `bmcFile`
  - Create `step5Schema` with validation for required documents
  - Upload components:
    - Student ID Cards: Single PDF upload, required
    - Instagram Follow Proof: Single PDF upload, required
    - Twibbon Proof: Multi-file upload (max 5 PDFs/images), required
    - BMC (Business Model Canvas): Single PDF upload, required
  - Each upload should use the existing drag-and-drop UI pattern from the payment section (lines 778-837)
  - Add file type validation (PDF only for most, PDF/image for twibbon)
  - Add file size validation (max 5MB per file)
  - Rationale: Documents are now collected during registration per the Google Form requirements.

- [ ] **Task 5.7**: Update Step 6 (Payment) - formerly Step 5
  - Add bank information section with logos:
    - Mandiri: Account number, account name, bank logo
    - OVO: Account number, account name, e-wallet logo
    - SuperBank: Account number, account name, bank logo
  - Add pricing tier display:
    - Early Bird: Rp 100.000/tim (with date range)
    - Wave 1: Rp 125.000/tim (with date range)
    - Wave 2: Rp 150.000/tim (with date range)
  - Highlight the currently active pricing tier based on current date
  - Keep existing payment proof upload and agreement checkbox
  - Create `step6Schema` (rename from `step5Schema`)
  - Rationale: Enhanced payment section provides all necessary payment channel information with visual bank identification.

- [ ] **Task 5.8**: Add new state variables for file management
  - `studentIdCardsFile: File | null`
  - `instagramProofFile: File | null`
  - `twibbonProofFiles: File[]` (array, max 5)
  - `bmcFile: File | null`
  - Remove old step-specific form instances that are no longer needed
  - Rationale: Document files need separate state management outside of react-hook-form since they require custom upload handling.

### Phase 6: Submission Logic Update

- [ ] **Task 6.1**: Update the `onSubmit` function (line 170-330)
  - Collect data from all 6 steps: `step1Data`, `step2Data`, `step3Data`, `step4Data`, `step5Data` (documents), `step6Data` (payment)
  - Update user signup metadata to use leader name from step3 instead of step2
  - Update team creation to include `sub_theme` from step2
  - Add team member insertion for member1 and member2 from step4 (with role='member')
  - Add document upload sequence after team creation
  - Keep payment upload as final step
  - Rationale: The submission flow must handle all new data points in the correct order.

- [ ] **Task 6.2**: Implement document upload sequence in `onSubmit`
  - After team creation, upload each document:
    1. Upload student ID cards PDF -> store URL in `student_cards_url`
    2. Upload Instagram follow proof PDF -> store URL in `instagram_proof_url`
    3. Upload twibbon proof files (up to 5) -> store URLs array in `twibbon_proof_urls`
    4. Upload BMC PDF -> store URL in `bmc_url`
  - Update team record with all document URLs
  - Handle partial upload failures gracefully (warn but continue)
  - Rationale: Documents must be uploaded to R2 and their URLs persisted before registration is considered complete.

- [ ] **Task 6.3**: Update team member insertion logic
  - Leader insertion remains the same (from step3 data)
  - Add insertion for member1 if provided (fullName, institution, studentId from step4)
  - Add insertion for member2 if provided (fullName, institution, studentId from step4)
  - Use `supabaseTeamService.addMember()` for each member
  - Set `is_active: true` and `role: 'member'` for each
  - Rationale: Members are now registered inline rather than invited post-registration.

### Phase 7: Validation Schema Updates

- [ ] **Task 7.1**: Create/Update Zod schemas for all steps
  - `step1Schema`: KEEP UNCHANGED (lines 49-59)
  - `step2Schema`: Replace with `{ teamName: z.string().min(2), subTheme: z.enum(['Energy','Health','Food','Finance','Beauty','Manufacture']) }`
  - `step3Schema`: Replace with `{ fullName, institutionName, studentId, major, phone }` - all required except major
  - `step4Schema`: Replace with `{ member1: { fullName?, institution?, studentId? }, member2: { fullName?, institution?, studentId? } }` - all optional
  - `step5Schema`: New schema for document validation (at least check files are present)
  - `step6Schema`: Rename from old step5Schema, keep paymentFile and agreeToPayment
  - Rationale: Each step needs its own validation schema for the multi-step form pattern.

- [ ] **Task 7.2**: Update `nextStep` validation switch (line 147-161)
  - Add case 6 for step6Form validation
  - Update all case numbers to match new step assignments
  - Rationale: Step navigation must validate the correct form for each step.

### Phase 8: UI/UX Polish

- [ ] **Task 8.1**: Design sub-theme selection cards for Step 2
  - Create 6 visually distinct cards for: Energy, Health, Food, Finance, Beauty, Manufacture
  - Use appropriate icons or color coding per theme
  - Selected state should use the gold accent color (#FFB22C)
  - Consistent with the cream/gold theme (#F9F8F6, #FFB22C, #0F0F0F)
  - Rationale: Sub-theme selection is a key differentiator and should be visually engaging.

- [ ] **Task 8.2**: Design team member input sections for Step 4
  - Use collapsible sections for Member 1 and Member 2
  - Add "Add Member 1" / "Add Member 2" toggle buttons
  - Show member count indicator (1/3, 2/3, 3/3 including leader)
  - Rationale: Members are optional; collapsible UI prevents overwhelming the form.

- [ ] **Task 8.3**: Design bank logo payment section for Step 6
  - Create a 3-column grid for bank payment options (Mandiri, OVO, SuperBank)
  - Each card shows: bank logo, account number, account name
  - Add a copy-to-clipboard button for account numbers
  - Show pricing tiers in a highlighted banner above the bank info
  - Highlight active pricing tier with gold accent
  - Rationale: Clear bank information with logos reduces payment errors and improves user experience.

---

## Verification Criteria

- [ ] All 6 form steps render correctly with proper validation on each step
- [ ] Progress bar accurately reflects 6 steps with correct percentage calculation
- [ ] Sub-theme selection persists and is saved to `teams.sub_theme` in database
- [ ] Team members (1 and 2) are saved to `team_members` table with correct role
- [ ] All 4 document types upload successfully to R2 and URLs persist in database
- [ ] Twibbon multi-file upload accepts up to 5 files and stores array of URLs
- [ ] Payment section displays all 3 bank options with logos
- [ ] Pricing tiers display correctly with active tier highlighted based on current date
- [ ] Registration completes end-to-end: user created -> team created -> members added -> documents uploaded -> payment uploaded
- [ ] Error handling works for partial failures (e.g., document upload fails but registration continues)
- [ ] Mobile responsive layout works for all new form steps
- [ ] Bilingual support (ID/EN) works for all new labels and descriptions

---

## Potential Risks and Mitigations

1. **Database migration failure on existing data**
   - Risk: Adding new columns with constraints may fail if existing data violates constraints
   - Mitigation: Use `ADD COLUMN IF NOT EXISTS` and allow NULL for all new columns; add constraints separately

2. **File upload size/timeout for multiple documents**
   - Risk: Uploading 4+ documents in sequence during registration may cause timeouts
   - Mitigation: Upload documents in parallel using `Promise.allSettled()` and show progress; set reasonable file size limits (5MB each)

3. **RLS policy blocking team member insertion**
   - Risk: Row Level Security may prevent inserting members for a newly created team since the user may not yet be recognized as team leader
   - Mitigation: Verify the `team_members` INSERT RLS policy allows the team creator to add members; the existing policy at `v6.0.0-final-schema.sql:452` uses `is_team_leader()` which checks `auth.uid()` - this should work since the leader is inserted first

4. **Progress bar calculation overflow**
   - Risk: Hardcoded division by 4 in progress bar (line 383) causes incorrect display
   - Mitigation: Update to division by 5 for 6 steps; make this dynamic based on `steps.length`

5. **Missing bank logo assets**
   - Risk: Bank logos may not be available or may have licensing restrictions
   - Mitigation: Use official bank logos from public brand assets; fallback to text-only display with bank name styling

6. **Form state loss on step navigation**
   - Risk: react-hook-form state may not persist correctly when steps are reorganized
   - Mitigation: Each step has its own `useForm` instance; values are preserved as long as the component is not unmounted (current pattern uses conditional rendering which preserves state)

---

## Alternative Approaches

1. **Store documents as separate table instead of columns on `teams`**
   - Create a `team_documents` table with columns: `id, team_id, document_type, file_url, storage_key, uploaded_at`
   - Pros: More normalized, easier to add new document types, supports versioning
   - Cons: More complex queries, additional migration, requires JOINs
   - Recommendation: Consider for future iteration; columns on `teams` are simpler for the initial implementation

2. **Use a single JSONB column for all document URLs**
   - Add `documents JSONB DEFAULT '{}'` to `teams` table instead of individual columns
   - Pros: Flexible schema, easy to add new document types without migration
   - Cons: Loses type safety, harder to query individual documents
   - Recommendation: Individual columns are preferred for type safety and explicit schema

3. **Lazy upload documents after registration**
   - Allow registration to complete without documents, upload them later via dashboard
   - Pros: Faster registration, reduces abandonment
   - Cons: Doesn't match Google Form requirements, may lead to incomplete registrations
   - Recommendation: Keep inline upload as required per the specification, but add graceful fallback for upload failures

---

## File Change Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `supabase/migrations/v7.0.0-registration-update.sql` | NEW | Database migration for new columns |
| `src/lib/supabase.ts` | MODIFY | Update Team interface, update SELECT queries |
| `src/services/supabase.service.ts` | MODIFY | Update team creation, add document upload, update SELECT queries |
| `src/pages/cibc/CIBCRegister.tsx` | MAJOR MODIFY | Complete form restructure (6 steps, new fields, new uploads) |
| `public/images/banks/mandiri.png` | NEW | Mandiri bank logo |
| `public/images/banks/ovo.png` | NEW | OVO e-wallet logo |
| `public/images/banks/superbank.png` | NEW | SuperBank logo |

---

## Execution Order

1. Database migration (Phase 1) - must be first
2. Type definitions (Phase 2) - depends on Phase 1
3. Service layer (Phase 3) - depends on Phase 2
4. Bank logo assets (Phase 4) - independent, can run in parallel
5. Form UI overhaul (Phase 5) - depends on Phases 2, 3
6. Submission logic (Phase 6) - depends on Phases 3, 5
7. Validation schemas (Phase 7) - integrated with Phase 5
8. UI polish (Phase 8) - final pass after core functionality works
