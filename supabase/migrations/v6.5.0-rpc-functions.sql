-- ============================================
-- Migration: v6.5.0 - Add missing RPC functions
-- ============================================
-- Creates 4 RPC functions that are called from the frontend but
-- were never defined in the database:
--   1. get_competition_stats(p_competition_id)
--   2. get_timeline()
--   3. activate_stage(p_stage_id)
--   4. increment_news_view(p_news_id)
-- ============================================

-- ============================================
-- 1. get_competition_stats
-- ============================================
-- Returns aggregate stats for a competition:
--   total_teams, verified_teams, pending_teams, total_submissions
-- Used by: src/services/supabase.service.ts getStats()

CREATE OR REPLACE FUNCTION get_competition_stats(p_competition_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_teams BIGINT;
  v_verified_teams BIGINT;
  v_pending_teams BIGINT;
  v_total_submissions BIGINT;
BEGIN
  SELECT COUNT(*) INTO v_total_teams
    FROM teams WHERE competition_id = p_competition_id;

  SELECT COUNT(*) INTO v_verified_teams
    FROM teams WHERE competition_id = p_competition_id AND status = 'verified';

  SELECT COUNT(*) INTO v_pending_teams
    FROM teams WHERE competition_id = p_competition_id AND status = 'pending';

  SELECT COUNT(*) INTO v_total_submissions
    FROM submissions WHERE competition_id = p_competition_id AND status = 'submitted';

  RETURN json_build_object(
    'total_teams', v_total_teams,
    'verified_teams', v_verified_teams,
    'pending_teams', v_pending_teams,
    'total_submissions', v_total_submissions
  );
END;
$$;

-- ============================================
-- 2. get_timeline
-- ============================================
-- Returns stages with their tasks for the active competition.
-- Used by: src/services/supabase.service.ts getTimeline()

CREATE OR REPLACE FUNCTION get_timeline()
RETURNS TABLE(
  stage_id UUID,
  stage_name TEXT,
  stage_name_id TEXT,
  stage_description TEXT,
  stage_order_index INTEGER,
  stage_start_date TIMESTAMPTZ,
  stage_end_date TIMESTAMPTZ,
  stage_status TEXT,
  stage_is_active BOOLEAN,
  stage_progress INTEGER,
  tasks JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_comp_id UUID;
BEGIN
  -- Get the active competition
  SELECT id INTO v_comp_id FROM competitions
    WHERE is_active = true
    ORDER BY created_at DESC
    LIMIT 1;

  IF v_comp_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
    SELECT
      s.id AS stage_id,
      s.name AS stage_name,
      s.name_id AS stage_name_id,
      s.description AS stage_description,
      s.order_index AS stage_order_index,
      s.start_date AS stage_start_date,
      s.end_date AS stage_end_date,
      s.status AS stage_status,
      s.is_active AS stage_is_active,
      COALESCE(
        (SELECT ROUND(
          COUNT(CASE WHEN sub.status = 'submitted' THEN 1 END)::numeric
          / NULLIF(COUNT(sub.id)::numeric, 0) * 100
        )::INTEGER
        FROM tasks t2
        LEFT JOIN submissions sub ON sub.task_id = t2.id
          AND sub.team_id IN (
            SELECT tm.team_id FROM team_members tm
            WHERE tm.user_id = auth.uid()::uuid AND tm.is_active = true
          )
        WHERE t2.stage_id = s.id AND t2.is_required = true
        ), 0
      ) AS stage_progress,
      COALESCE(
        (SELECT jsonb_agg(
          jsonb_build_object(
            'id', t.id,
            'name', t.name,
            'name_id', t.name_id,
            'description', t.description,
            'type', t.type,
            'order_index', t.order_index,
            'is_required', t.is_required,
            'is_published', t.is_published,
            'max_score', t.max_score,
            'deadline', t.deadline,
            'instructions', t.instructions,
            'rubric', t.rubric
          )
          ORDER BY t.order_index
        )
        FROM tasks t
        WHERE t.stage_id = s.id
        ), '[]'::jsonb
      ) AS tasks
    FROM stages s
    WHERE s.competition_id = v_comp_id
    ORDER BY s.order_index;
END;
$$;

-- ============================================
-- 3. activate_stage
-- ============================================
-- Deactivates all stages in the competition and activates the target stage.
-- Returns the activated stage row.
-- Used by: src/services/supabase.service.ts activateStage()

CREATE OR REPLACE FUNCTION activate_stage(p_stage_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_comp_id UUID;
  v_stage stages%ROWTYPE;
BEGIN
  -- Get the competition_id for the target stage
  SELECT competition_id INTO v_comp_id
    FROM stages WHERE id = p_stage_id;

  IF v_comp_id IS NULL THEN
    RAISE EXCEPTION 'Stage not found: %', p_stage_id;
  END IF;

  -- Deactivate all stages in the competition
  UPDATE stages
    SET is_active = false, status = 'upcoming'
    WHERE competition_id = v_comp_id;

  -- Activate the target stage
  UPDATE stages
    SET is_active = true, status = 'active'
    WHERE id = p_stage_id
    RETURNING * INTO v_stage;

  RETURN row_to_json(v_stage);
END;
$$;

-- ============================================
-- 4. increment_news_view
-- ============================================
-- Atomically increments the view count for a news article.
-- Used by: src/services/supabaseNews.service.ts incrementView()

CREATE OR REPLACE FUNCTION increment_news_view(p_news_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE news
    SET views = COALESCE(views, 0) + 1
    WHERE id = p_news_id;
END;
$$;

-- ============================================
-- Add views column to news table if not exists
-- ============================================
ALTER TABLE news ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Migration v6.5.0 completed: 4 RPC functions created';
  RAISE NOTICE '  - get_competition_stats(UUID)';
  RAISE NOTICE '  - get_timeline()';
  RAISE NOTICE '  - activate_stage(UUID)';
  RAISE NOTICE '  - increment_news_view(UUID)';
END$$;
