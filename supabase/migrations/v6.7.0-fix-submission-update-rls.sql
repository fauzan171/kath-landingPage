-- ============================================
-- Fix: Allow team members to update submissions with status 'needs_revision'
-- Previously only 'draft' status was allowed for update, which blocked resubmissions
-- ============================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Team members update submissions" ON submissions;

-- Create new policy that allows update for both 'draft' and 'needs_revision' statuses
-- USING: which rows can be updated (pre-update check on existing row)
-- WITH CHECK: what the new row values must satisfy (post-update check)
CREATE POLICY "Team members update submissions" ON submissions
    FOR UPDATE USING (
        is_team_member(team_id) AND status IN ('draft', 'needs_revision')
    ) WITH CHECK (
        is_team_member(team_id)
    );
