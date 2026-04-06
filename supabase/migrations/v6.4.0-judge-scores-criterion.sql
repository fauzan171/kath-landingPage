-- ============================================
-- Migration: v6.4.0 - Update judge_scores for per-criterion scoring
-- ============================================
-- Adds criterion_key and max_score columns to judge_scores table.
-- Drops the UNIQUE(judge_id, submission_id) constraint since we now
-- store one row per judge per criterion (not one row per judge per submission).
-- Also adds submissions.graded_at column and tasks.rubric format update.
-- ============================================

-- ============================================
-- 1. JUDGE_SCORES: Add criterion_key and max_score columns
-- ============================================

-- Drop the old unique constraint (one score per judge per submission)
-- We now allow multiple rows per judge per submission (one per criterion)
ALTER TABLE judge_scores
  DROP CONSTRAINT IF EXISTS judge_scores_judge_id_submission_id_key;

-- Add new columns
ALTER TABLE judge_scores
  ADD COLUMN IF NOT EXISTS criterion_key TEXT DEFAULT 'total',
  ADD COLUMN IF NOT EXISTS max_score INTEGER DEFAULT 100;

-- Add new unique constraint: one score per judge per submission per criterion
ALTER TABLE judge_scores
  ADD CONSTRAINT judge_scores_judge_submission_criterion_unique
  UNIQUE(judge_id, submission_id, criterion_key);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_judge_scores_criterion
  ON judge_scores(criterion_key);

-- ============================================
-- 2. SUBMISSIONS: Add graded_at column
-- ============================================

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ;

-- ============================================
-- 3. TASKS: Ensure rubric is JSONB array (not object)
-- ============================================

-- If rubric column exists but is default '{}', update to '[]'
UPDATE tasks SET rubric = '[]'::jsonb WHERE rubric = '{}'::jsonb OR rubric IS NULL;

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Migration v6.4.0 completed: judge_scores now supports per-criterion scoring';
END$$;
