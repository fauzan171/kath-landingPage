-- ============================================
-- CIBC Competition Platform - Public Read Access for Landing Page
-- Version: 6.3.0
-- ============================================
--
-- ISSUE: Landing page countdown timer cannot fetch stages because
-- RLS policies only allow authenticated users and admins to read
-- from `competitions` and `stages` tables.
--
-- Anonymous visitors to the landing page get zero results,
-- causing the countdown to fall back to 30 days from now.
--
-- FIX: Add public SELECT policies for:
-- 1. competitions: allow reading active competitions (for countdown)
-- 2. stages: allow reading visible stages (for countdown & timeline)
--
-- This migration is idempotent - safe to run multiple times.
--
-- ============================================

-- ============================================
-- PART 1: COMPETITIONS - Public Read Active
-- ============================================
-- Landing page needs to read the active competition to get its ID
-- before querying stages.

DROP POLICY IF EXISTS "Public read active competitions" ON competitions;
CREATE POLICY "Public read active competitions" ON competitions
    FOR SELECT USING (
        is_active = true
        OR status IN ('active', 'upcoming')
    );

-- ============================================
-- PART 2: STAGES - Public Read Visible
-- ============================================
-- Landing page countdown needs to read visible stages to get end_date.
-- Only stages where is_visible = true are exposed to the public.

DROP POLICY IF EXISTS "Public read visible stages" ON stages;
CREATE POLICY "Public read visible stages" ON stages
    FOR SELECT USING (is_visible = true);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, verify with:
-- SELECT * FROM pg_policies WHERE tablename = 'competitions';
-- SELECT * FROM pg_policies WHERE tablename = 'stages';
--
-- Test as anonymous (anon key):
-- SELECT * FROM competitions WHERE is_active = true;
-- SELECT * FROM stages WHERE is_visible = true;
