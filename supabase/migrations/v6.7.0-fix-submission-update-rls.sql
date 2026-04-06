-- ============================================
-- Fix: Allow team members to update submissions with status 'needs_revision'
-- Previously only 'draft' status was allowed for update, which blocked resubmissions
-- ============================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Team members update submissions" ON submissions;

-- Create new policy that allows update for both 'draft' and 'needs_revision' statuses
CREATE POLICY "Team members update submissions" ON submissions
    FOR UPDATE USING (
        is_team_member(team_id) AND status IN ('draft', 'needs_revision')
    );
