-- ============================================
-- Migration: v6.6.0 - Add missing submission columns + indexes
-- ============================================
-- Adds columns that the application code references but are missing
-- from the submissions table, plus additional useful indexes.
-- ============================================

-- ============================================
-- 1. SUBMISSIONS: Add all missing columns
-- ============================================

-- field_values: stores structured BMC form data as JSONB
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS field_values JSONB DEFAULT '{}';

-- file_type: MIME type of uploaded file
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS file_type TEXT;

-- graded_by: UUID of the admin/judge who graded
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS graded_by UUID REFERENCES users(id);

-- submitted_by: UUID of the user who submitted
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES users(id);

-- criteria_scores: per-criterion scores as JSONB
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS criteria_scores JSONB DEFAULT '{}';

-- is_late: flag for late submissions
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT false;

-- penalty_applied: percentage penalty for late submissions
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS penalty_applied INTEGER DEFAULT 0;

-- ============================================
-- 2. TEAMS: Add missing columns
-- ============================================

-- payment_uploaded_at: when payment proof was uploaded
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS payment_uploaded_at TIMESTAMPTZ;

-- payment_rejection_reason: why payment was rejected
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS payment_rejection_reason TEXT;

-- rejected_by: UUID of admin who rejected
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES users(id);

-- rejected_at: when team was rejected
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- notes: admin notes on team
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- country: team country
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Indonesia';

-- total_score: aggregated team score
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS total_score INTEGER DEFAULT 0;

-- rank: team rank in leaderboard
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS rank INTEGER;

-- ============================================
-- 3. TEAM_MEMBERS: Add missing columns
-- ============================================

-- student_id: student identification number
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS student_id TEXT;

-- major: field of study
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS major TEXT;

-- position: role description
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS position TEXT;

-- ============================================
-- 4. COMPETITIONS: Add missing columns
-- ============================================

-- theme: JSONB for theme configuration (colors, images, logos)
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{}';

-- settings: JSONB for competition settings
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- target: target audience description
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS target TEXT;

-- prize: prize description
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS prize TEXT;

-- image: competition image URL
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS image TEXT;

-- requirements: JSONB array of requirements
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]';

-- subtitle: competition subtitle
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS subtitle TEXT;

-- event_start / event_end: actual event dates
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS event_start TIMESTAMPTZ;

ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS event_end TIMESTAMPTZ;

-- ============================================
-- 5. TASKS: Add missing columns
-- ============================================

-- rubric_data: structured rubric with weights
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS rubric_data JSONB DEFAULT '{}';

-- name_id: Indonesian name
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS name_id TEXT;

-- description_id: Indonesian description
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS description_id TEXT;

-- max_file_size: max file size in bytes
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS max_file_size INTEGER DEFAULT 10485760;

-- ============================================
-- 6. STAGES: Add missing columns
-- ============================================

-- name_id: Indonesian name
ALTER TABLE stages
  ADD COLUMN IF NOT EXISTS name_id TEXT;

-- ============================================
-- 7. ADDITIONAL INDEXES for performance
-- ============================================

-- Submissions: lookup by team + competition
CREATE INDEX IF NOT EXISTS idx_submissions_team_competition
  ON submissions(team_id, competition_id);

-- Submissions: lookup by status
CREATE INDEX IF NOT EXISTS idx_submissions_status
  ON submissions(status);

-- Submissions: lookup by graded_by
CREATE INDEX IF NOT EXISTS idx_submissions_graded_by
  ON submissions(graded_by);

-- Teams: lookup by payment status
CREATE INDEX IF NOT EXISTS idx_teams_payment_uploaded
  ON teams(payment_uploaded_at)
  WHERE payment_uploaded_at IS NOT NULL;

-- Team members: lookup by email (for registration dedup)
CREATE INDEX IF NOT EXISTS idx_team_members_email
  ON team_members(email);

-- ============================================
-- 8. UPDATE SUBMISSION STATUS CHECK CONSTRAINT
-- ============================================
-- The original schema only allows: draft, submitted, under_review, graded
-- Code uses additional statuses: needs_revision, final, late

ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_status_check;
ALTER TABLE submissions ADD CONSTRAINT submissions_status_check
  CHECK (status IN ('draft', 'submitted', 'under_review', 'needs_revision', 'graded', 'final', 'late'));

-- ============================================
-- 9. UPDATE TEAMS CATEGORY CHECK CONSTRAINT
-- ============================================

ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_category_check;
ALTER TABLE teams ADD CONSTRAINT teams_category_check
  CHECK (category IN ('startup', 'student', 'corporate', 'open') OR category IS NULL);

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Migration v6.6.0 completed: all missing columns added to submissions, teams, team_members, competitions, tasks, stages';
END$$;
