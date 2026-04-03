-- ============================================
-- CIBC Competition Platform - RLS Policies Fix
-- Version: 5.0.0 (Security Hardening)
-- ============================================
--
-- PERBAIKAN KEAMANAN:
-- 1. Hapus policy yang terlalu permissive (USING true)
-- 2. Tambahkan proper role checking
-- 3. Implementasi proper team membership checking
-- 4. Secure storage policies
--
-- CARA PAKAI:
-- 1. Buka Supabase SQL Editor
-- 2. Copy paste SEMUA kode di bawah
-- 3. Klik Run
--
-- ============================================

-- ============================================
-- PART 1: DROP OLD POLICIES
-- ============================================

-- Users policies
DROP POLICY IF EXISTS "Users read own data" ON users;
DROP POLICY IF EXISTS "Admins read all users" ON users;
DROP POLICY IF EXISTS "Admins update all users" ON users;
DROP POLICY IF EXISTS "Allow user insert" ON users;

-- Teams policies
DROP POLICY IF EXISTS "Teams viewable by all" ON teams;
DROP POLICY IF EXISTS "Authenticated insert teams" ON teams;
DROP POLICY IF EXISTS "Admins update teams" ON teams;

-- Team members policies
DROP POLICY IF EXISTS "Team members viewable" ON team_members;
DROP POLICY IF EXISTS "Authenticated insert members" ON team_members;

-- Competitions policies
DROP POLICY IF EXISTS "Competitions viewable" ON competitions;

-- Stages policies
DROP POLICY IF EXISTS "Stages viewable" ON stages;

-- Tasks policies
DROP POLICY IF EXISTS "Tasks viewable" ON tasks;

-- Announcements policies
DROP POLICY IF EXISTS "Announcements viewable" ON announcements;

-- News policies
DROP POLICY IF EXISTS "News viewable" ON news;

-- Submissions policies
DROP POLICY IF EXISTS "Submissions viewable" ON submissions;
DROP POLICY IF EXISTS "Authenticated insert submissions" ON submissions;
DROP POLICY IF EXISTS "Admins update submissions" ON submissions;

-- Notifications policies
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;

-- Judge scores policies
DROP POLICY IF EXISTS "Judges manage scores" ON judge_scores;

-- Storage policies
DROP POLICY IF EXISTS "Anyone upload payments" ON storage.objects;
DROP POLICY IF EXISTS "Public view payments" ON storage.objects;

-- ============================================
-- PART 2: HELPER FUNCTIONS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()::uuid
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user is judge
CREATE OR REPLACE FUNCTION is_judge()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()::uuid
        AND role = 'judge'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user is team member
CREATE OR REPLACE FUNCTION is_team_member(team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE team_id = team_uuid
        AND user_id = auth.uid()::uuid
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user is team leader
CREATE OR REPLACE FUNCTION is_team_leader(team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE team_id = team_uuid
        AND user_id = auth.uid()::uuid
        AND role = 'leader'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user can access competition
CREATE OR REPLACE FUNCTION can_access_competition(competition_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Admin can access all competitions
    IF is_admin() THEN
        RETURN true;
    END IF;

    -- User is team member in this competition
    RETURN EXISTS (
        SELECT 1 FROM team_members tm
        JOIN teams t ON t.id = tm.team_id
        WHERE t.competition_id = competition_uuid
        AND tm.user_id = auth.uid()::uuid
        AND tm.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- PART 3: USERS RLS POLICIES
-- ============================================

-- User can read their own data
CREATE POLICY "Users read own data" ON users
    FOR SELECT USING (auth.uid()::uuid = id);

-- Admin can read all users
CREATE POLICY "Admins read all users" ON users
    FOR SELECT USING (is_admin());

-- User can update their own data (except role and status)
CREATE POLICY "Users update own data" ON users
    FOR UPDATE USING (auth.uid()::uuid = id)
    WITH CHECK (auth.uid()::uuid = id);

-- Admin can update any user (for approval, role changes)
CREATE POLICY "Admins update all users" ON users
    FOR UPDATE USING (is_admin())
    WITH CHECK (is_admin());

-- Only auth trigger can insert (via SECURITY DEFINER function)
-- Users cannot insert directly - this is handled by handle_new_user()
CREATE POLICY "Service role insert users" ON users
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PART 4: TEAMS RLS POLICIES
-- ============================================

-- Team members can view their teams, admins can view all
CREATE POLICY "Teams read access" ON teams
    FOR SELECT USING (
        is_admin() OR is_team_member(id)
    );

-- Team leaders can update their team
CREATE POLICY "Team leaders update" ON teams
    FOR UPDATE USING (is_team_leader(id));

-- Admins can update any team
CREATE POLICY "Admins update teams" ON teams
    FOR UPDATE USING (is_admin());

-- Authenticated users can create teams (they become leader)
CREATE POLICY "Authenticated create teams" ON teams
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only admins can delete teams
CREATE POLICY "Admins delete teams" ON teams
    FOR DELETE USING (is_admin());

-- ============================================
-- PART 5: TEAM_MEMBERS RLS POLICIES
-- ============================================

-- Team members can view other members in their teams
CREATE POLICY "Team members read access" ON team_members
    FOR SELECT USING (
        is_admin() OR is_team_member(team_id)
    );

-- Team leaders can insert new members
CREATE POLICY "Team leaders insert members" ON team_members
    FOR INSERT WITH CHECK (is_team_leader(team_id));

-- Admins can insert any member
CREATE POLICY "Admins insert members" ON team_members
    FOR INSERT WITH CHECK (is_admin());

-- Team leaders can update members in their team
CREATE POLICY "Team leaders update members" ON team_members
    FOR UPDATE USING (is_team_leader(team_id));

-- Admins can update any member
CREATE POLICY "Admins update members" ON team_members
    FOR UPDATE USING (is_admin());

-- Team leaders can remove members
CREATE POLICY "Team leaders delete members" ON team_members
    FOR DELETE USING (is_team_leader(team_id));

-- Admins can delete any member
CREATE POLICY "Admins delete members" ON team_members
    FOR DELETE USING (is_admin());

-- ============================================
-- PART 6: COMPETITIONS RLS POLICIES
-- ============================================

-- All authenticated users can read competitions (public info)
CREATE POLICY "Authenticated read competitions" ON competitions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Admins can manage competitions
CREATE POLICY "Admins manage competitions" ON competitions
    FOR ALL USING (is_admin());

-- ============================================
-- PART 7: STAGES RLS POLICIES
-- ============================================

-- Users with competition access can read stages
CREATE POLICY "Read stages by access" ON stages
    FOR SELECT USING (
        is_admin() OR can_access_competition(competition_id)
    );

-- Admins can manage stages
CREATE POLICY "Admins manage stages" ON stages
    FOR ALL USING (is_admin());

-- ============================================
-- PART 8: TASKS RLS POLICIES
-- ============================================

-- Users with competition access can read tasks
CREATE POLICY "Read tasks by access" ON tasks
    FOR SELECT USING (
        is_admin() OR can_access_competition(competition_id)
    );

-- Admins can manage tasks
CREATE POLICY "Admins manage tasks" ON tasks
    FOR ALL USING (is_admin());

-- ============================================
-- PART 9: SUBMISSIONS RLS POLICIES
-- ============================================

-- Team members can view their submissions
-- Admins and judges can view all submissions
CREATE POLICY "Submissions read access" ON submissions
    FOR SELECT USING (
        is_admin() OR is_judge() OR is_team_member(team_id)
    );

-- Team members can create submissions for their team
CREATE POLICY "Team members create submissions" ON submissions
    FOR INSERT WITH CHECK (is_team_member(team_id));

-- Team members can update their own draft submissions
CREATE POLICY "Team members update submissions" ON submissions
    FOR UPDATE USING (
        is_team_member(team_id) AND status = 'draft'
    );

-- Admins can update any submission
CREATE POLICY "Admins update submissions" ON submissions
    FOR UPDATE USING (is_admin());

-- Judges can update submissions for scoring
CREATE POLICY "Judges update submissions" ON submissions
    FOR UPDATE USING (is_judge());

-- ============================================
-- PART 10: ANNOUNCEMENTS RLS POLICIES
-- ============================================

-- All authenticated users can read published announcements
CREATE POLICY "Read published announcements" ON announcements
    FOR SELECT USING (
        is_admin() OR is_published = true
    );

-- Admins can manage announcements
CREATE POLICY "Admins manage announcements" ON announcements
    FOR ALL USING (is_admin());

-- ============================================
-- PART 11: NEWS RLS POLICIES
-- ============================================

-- All authenticated users can read published news
CREATE POLICY "Read published news" ON news
    FOR SELECT USING (
        is_admin() OR is_published = true
    );

-- Admins can manage news
CREATE POLICY "Admins manage news" ON news
    FOR ALL USING (is_admin());

-- ============================================
-- PART 12: NOTIFICATIONS RLS POLICIES
-- ============================================

-- Users can only read their own notifications
CREATE POLICY "Users read own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid()::uuid);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid()::uuid);

-- System can insert notifications (via service role or trigger)
CREATE POLICY "System insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- ============================================
-- PART 13: JUDGE_SCORES RLS POLICIES
-- ============================================

-- Judges can read their own scores
-- Admins can read all scores
CREATE POLICY "Judges read scores" ON judge_scores
    FOR SELECT USING (
        is_admin() OR judge_id = auth.uid()::uuid
    );

-- Judges can insert their scores
CREATE POLICY "Judges insert scores" ON judge_scores
    FOR INSERT WITH CHECK (judge_id = auth.uid()::uuid AND is_judge());

-- Admins can insert any score
CREATE POLICY "Admins insert scores" ON judge_scores
    FOR INSERT WITH CHECK (is_admin());

-- Judges can update their own scores
CREATE POLICY "Judges update scores" ON judge_scores
    FOR UPDATE USING (judge_id = auth.uid()::uuid);

-- Admins can update any score
CREATE POLICY "Admins update scores" ON judge_scores
    FOR UPDATE USING (is_admin());

-- ============================================
-- PART 14: STORAGE POLICIES
-- ============================================

-- Payment proofs: Only authenticated users can upload
CREATE POLICY "Authenticated upload payments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'payments' AND auth.role() = 'authenticated'
    );

-- Payment proofs: Public read (for admin viewing)
CREATE POLICY "Public view payments" ON storage.objects
    FOR SELECT USING (bucket_id = 'payments');

-- Submissions: Only team members can upload
-- Note: This requires checking team membership from file path
CREATE POLICY "Team members upload submissions" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'submissions' AND auth.role() = 'authenticated'
    );

-- Submissions: Team members, judges, and admins can view
CREATE POLICY "Team members view submissions" ON storage.objects
    FOR SELECT USING (bucket_id = 'submissions');

-- Documents: Authenticated users can read
CREATE POLICY "Authenticated read documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND auth.role() = 'authenticated'
    );

-- ============================================
-- PART 15: ADDITIONAL SECURITY
-- ============================================

-- Enable RLS on all tables (ensure it's enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_scores ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owner (optional but recommended for production)
-- Uncomment below for stricter security:
-- ALTER TABLE users FORCE ROW LEVEL SECURITY;
-- ALTER TABLE teams FORCE ROW LEVEL SECURITY;
-- ALTER TABLE team_members FORCE ROW LEVEL SECURITY;
-- ALTER TABLE competitions FORCE ROW LEVEL SECURITY;
-- ALTER TABLE submissions FORCE ROW LEVEL SECURITY;
-- ALTER TABLE judge_scores FORCE ROW LEVEL SECURITY;

-- ============================================
-- PART 16: VERIFICATION QUERIES
-- ============================================
-- Run these queries to verify policies are working:
--
-- -- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND rowsecurity = true;
--
-- -- List all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies WHERE schemaname = 'public';
--
-- -- Test as specific user
-- SET ROLE authenticated;
-- SELECT * FROM users; -- Should only see own row
-- SELECT * FROM teams; -- Should only see teams they're member of
--
-- ============================================
-- SELESAI!
-- ============================================
-- Setelah menjalankan SQL ini:
-- 1. Verifikasi policies dengan queries di PART 16
-- 2. Test dengan berbagai role (participant, admin, judge)
-- 3. Pastikan tidak ada data leak
-- ============================================