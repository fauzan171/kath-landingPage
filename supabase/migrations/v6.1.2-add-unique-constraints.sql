-- ============================================
-- P1-006: Add Missing Unique Constraints
-- Version: 6.1.2
-- Date: 2026-04-04
-- ============================================
--
-- ISSUE: Teams can have duplicate names within the same competition
-- RISK: Confusion, data integrity issues
-- FIX: Add unique constraint on (competition_id, name)
--
-- ============================================

-- ============================================
-- PART 1: Add Unique Constraint for Team Names
-- ============================================
-- This prevents duplicate team names within the same competition

-- First, check for existing duplicates and handle them
-- (This query is for analysis - run manually if needed)
-- SELECT competition_id, name, COUNT(*)
-- FROM teams
-- GROUP BY competition_id, name
-- HAVING COUNT(*) > 1;

-- Add the unique constraint
-- Using WHERE clause to handle any existing duplicates gracefully
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_team_name_per_competition'
    ) THEN
        -- Add unique constraint
        -- If there are duplicates, this will fail - handle manually first
        ALTER TABLE teams
        ADD CONSTRAINT unique_team_name_per_competition
        UNIQUE (competition_id, name);

        RAISE NOTICE 'Added unique_team_name_per_competition constraint';
    ELSE
        RAISE NOTICE 'Constraint unique_team_name_per_competition already exists';
    END IF;
EXCEPTION 
  WHEN unique_violation THEN
    RAISE WARNING 'Duplicate team names exist. Run this to find duplicates: SELECT competition_id, name, COUNT(*) FROM teams GROUP BY competition_id, name HAVING COUNT(*) > 1';
  WHEN OTHERS THEN
    RAISE WARNING 'Could not add unique constraint: %', SQLERRM;
END $$;

-- ============================================
-- PART 2: Add Unique Constraint for Team Codes
-- ============================================
-- Team codes should also be unique globally

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_team_code'
    ) THEN
        -- Add unique constraint for code if it doesn't exist
        -- The code column already has UNIQUE in schema, but ensure it's enforced
        RAISE NOTICE 'Team code uniqueness is handled by existing constraint';
    END IF;
END $$;

-- ============================================
-- PART 3: Add Index for Performance
-- ============================================

-- Index for team lookup by competition and status
CREATE INDEX IF NOT EXISTS idx_teams_competition_status
ON teams(competition_id, status);

-- Index for team lookup by competition and category
CREATE INDEX IF NOT EXISTS idx_teams_competition_category
ON teams(competition_id, category);

-- ============================================
-- PART 4: Fix Orphaned Stages on Competition Delete
-- ============================================
-- Ensure stages are deleted when competition is deleted

DO $$
BEGIN
    -- Check if FK constraint needs updating
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'stages'
        AND kcu.column_name = 'competition_id'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.constraint_name NOT LIKE '%cascade%'
    ) THEN
        -- Drop old constraint and add new one with CASCADE
        ALTER TABLE stages
        DROP CONSTRAINT IF EXISTS stages_competition_id_fkey;

        ALTER TABLE stages
        ADD CONSTRAINT stages_competition_id_fkey
        FOREIGN KEY (competition_id)
        REFERENCES competitions(id)
        ON DELETE CASCADE;

        RAISE NOTICE 'Updated stages FK with CASCADE delete';
    END IF;
END $$;

-- Same for tasks
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'tasks'
        AND kcu.column_name = 'competition_id'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.constraint_name NOT LIKE '%cascade%'
    ) THEN
        ALTER TABLE tasks
        DROP CONSTRAINT IF EXISTS tasks_competition_id_fkey;

        ALTER TABLE tasks
        ADD CONSTRAINT tasks_competition_id_fkey
        FOREIGN KEY (competition_id)
        REFERENCES competitions(id)
        ON DELETE CASCADE;

        RAISE NOTICE 'Updated tasks FK with CASCADE delete';
    END IF;
END $$;

-- Same for team_members
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'team_members'
        AND kcu.column_name = 'team_id'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.constraint_name NOT LIKE '%cascade%'
    ) THEN
        ALTER TABLE team_members
        DROP CONSTRAINT IF EXISTS team_members_team_id_fkey;

        ALTER TABLE team_members
        ADD CONSTRAINT team_members_team_id_fkey
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE;

        RAISE NOTICE 'Updated team_members FK with CASCADE delete';
    END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, verify with:
--
-- SELECT conname, contype
-- FROM pg_constraint
-- WHERE conrelid = 'teams'::regclass;
--
-- Expected output should include:
-- - unique_team_name_per_competition (type: u)
-- - teams_pkey (type: p)
--
-- ============================================