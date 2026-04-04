-- ============================================
-- Fix RLS Policy for Teams INSERT
-- Version: 6.1.4
-- Date: 2026-04-04
-- ============================================
--
-- Issue: Authenticated users cannot insert teams
-- Error: "new row violates row-level security policy for table teams"
--
-- Fix: Update INSERT policy to check auth.uid() instead of auth.role()
-- ============================================

-- First, let's check the current policies and fix them

-- Drop the old INSERT policy that might not be working correctly
DROP POLICY IF EXISTS "Authenticated create teams" ON teams;

-- Create a new INSERT policy that allows any authenticated user to create a team
-- Using auth.uid() IS NOT NULL is more reliable than auth.role()
CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Also add a policy for users to read their own teams (ones they are members of)
-- This is for users who just created a team but aren't yet in team_members
DROP POLICY IF EXISTS "Users read own created teams" ON teams;
CREATE POLICY "Users read own created teams" ON teams
    FOR SELECT
    USING (
        is_admin()
        OR is_team_member(id)
        OR EXISTS (
            -- Allow reading teams where user might be the creator (before team_members entry)
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = teams.id
            AND tm.user_id = auth.uid()
        )
    );

-- Fix team_members INSERT policy - allow team creators to add themselves as leader
-- The current policy requires is_team_leader() which won't work for new teams
DROP POLICY IF EXISTS "Team leaders insert members" ON team_members;
DROP POLICY IF EXISTS "Admins insert members" ON team_members;

-- Allow authenticated users to add themselves as team members when creating a new team
CREATE POLICY "Users can join new teams" ON team_members
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
            -- User can add themselves to a team
            user_id = auth.uid()
            OR is_admin()
        )
    );

-- Allow team leaders to add more members
CREATE POLICY "Team leaders can add members" ON team_members
    FOR INSERT
    WITH CHECK (is_team_leader(team_id) OR is_admin());

-- ============================================
-- Explanation of the fix:
-- ============================================
--
-- Before:
-- - INSERT teams required auth.role() = 'authenticated' (not working)
-- - INSERT team_members required is_team_leader() (circular dependency)
--
-- After:
-- - INSERT teams: any authenticated user (auth.uid() IS NOT NULL)
-- - INSERT team_members: user can add themselves, or team leader can add
--
-- Flow for registration:
-- 1. User signs up (Supabase Auth creates auth.users)
-- 2. Trigger creates public.users entry
-- 3. User creates team (INSERT teams - allowed by new policy)
-- 4. User adds themselves as team member (INSERT team_members - allowed by new policy)
-- 5. User uploads payment proof
-- 6. Redirect to pending approval
-- ============================================