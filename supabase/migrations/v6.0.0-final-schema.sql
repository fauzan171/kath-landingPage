-- ============================================
-- CIBC Competition Platform - Final Consolidated Schema
-- Version: 6.0.0 (Production Ready)
-- ============================================
--
-- This is the CANONICAL schema file for the platform.
-- All other supabase-*.sql files in root are DEPRECATED.
--
-- MIGRATION GUIDE:
-- 1. If starting fresh: Run this entire file
-- 2. If upgrading from v4.0.0: Run v5.0.0-rls-policies-fix.sql and v5.1.0-missing-tables.sql
-- 3. If upgrading from older versions: Run migrations in order (v3.0.0 → v4.0.0 → v5.0.0 → v5.1.0)
--
-- ============================================

-- ============================================
-- PART 1: EXTENSIONS & SETUP
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 2: CORE TABLES
-- ============================================

-- Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,  -- References auth.users.id
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,

    -- User info
    institution TEXT,
    country TEXT DEFAULT 'Indonesia',
    category TEXT CHECK(category IN ('student', 'startup', 'corporate', 'open')),

    -- Account status
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,

    -- Role (for authorization)
    role TEXT CHECK(role IN ('participant', 'admin', 'super_admin', 'finance_admin', 'judge')) DEFAULT 'participant',

    -- Timestamps
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    competition_start TIMESTAMPTZ,
    competition_end TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    category TEXT,
    institution TEXT,
    status TEXT CHECK(status IN ('draft', 'pending', 'verified', 'rejected')) DEFAULT 'pending',
    payment_status TEXT CHECK(payment_status IN ('unpaid', 'pending', 'verified', 'rejected')) DEFAULT 'unpaid',
    payment_proof TEXT,
    payment_drive_id TEXT,
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_competition ON teams(competition_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_competition_status ON teams(competition_id, status);
CREATE INDEX IF NOT EXISTS idx_teams_payment_status ON teams(payment_status);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    institution TEXT,
    role TEXT CHECK(role IN ('leader', 'member', 'mentor')) DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- Stages table
CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id),
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stages_competition ON stages(competition_id);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID REFERENCES stages(id),
    competition_id UUID REFERENCES competitions(id),
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    type TEXT DEFAULT 'file_upload',
    is_required BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_tasks_competition ON tasks(competition_id);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id),
    team_id UUID REFERENCES teams(id),
    competition_id UUID REFERENCES competitions(id),
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    drive_file_id TEXT,
    link_url TEXT,
    content TEXT,
    status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'graded')) DEFAULT 'draft',
    total_score INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_team ON submissions(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_competition_status ON submissions(competition_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_task_status ON submissions(task_id, status);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id),
    title TEXT NOT NULL,
    title_id TEXT,
    content TEXT,
    content_id TEXT,
    type TEXT DEFAULT 'general',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_competition_published ON announcements(competition_id, is_published);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Judge scores table
CREATE TABLE IF NOT EXISTS judge_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES users(id),
    submission_id UUID REFERENCES submissions(id),
    score INTEGER,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(judge_id, submission_id)
);

CREATE INDEX IF NOT EXISTS idx_judge_scores_submission ON judge_scores(submission_id);

-- News table
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_id TEXT,
    content TEXT,
    content_id TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 3: ADDITIONAL TABLES (v5.1.0)
-- ============================================

-- Judge assignments table
CREATE TABLE IF NOT EXISTS judge_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES users(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'recused')),
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(judge_id, submission_id)
);

CREATE INDEX IF NOT EXISTS idx_judge_assignments_judge ON judge_assignments(judge_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_submission ON judge_assignments(submission_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_competition ON judge_assignments(competition_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_status ON judge_assignments(status);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- Password reset tokens table (backup for custom flows)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- ============================================
-- PART 4: AUTH TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, status, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        'pending',
        'participant'
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PART 5: UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 6: HELPER FUNCTIONS FOR RLS
-- ============================================

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

-- ============================================
-- PART 7: RLS POLICIES - USERS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own data" ON users;
CREATE POLICY "Users read own data" ON users
    FOR SELECT USING (auth.uid()::uuid = id);

DROP POLICY IF EXISTS "Admins read all users" ON users;
CREATE POLICY "Admins read all users" ON users
    FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Users update own data" ON users;
CREATE POLICY "Users update own data" ON users
    FOR UPDATE USING (auth.uid()::uuid = id)
    WITH CHECK (auth.uid()::uuid = id);

DROP POLICY IF EXISTS "Admins update all users" ON users;
CREATE POLICY "Admins update all users" ON users
    FOR UPDATE USING (is_admin())
    WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Service role insert users" ON users;
CREATE POLICY "Service role insert users" ON users
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PART 8: RLS POLICIES - TEAMS
-- ============================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teams read access" ON teams;
CREATE POLICY "Teams read access" ON teams
    FOR SELECT USING (is_admin() OR is_team_member(id));

DROP POLICY IF EXISTS "Team leaders update" ON teams;
CREATE POLICY "Team leaders update" ON teams
    FOR UPDATE USING (is_team_leader(id));

DROP POLICY IF EXISTS "Admins update teams" ON teams;
CREATE POLICY "Admins update teams" ON teams
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Authenticated create teams" ON teams;
CREATE POLICY "Authenticated create teams" ON teams
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins delete teams" ON teams;
CREATE POLICY "Admins delete teams" ON teams
    FOR DELETE USING (is_admin());

-- ============================================
-- PART 9: RLS POLICIES - TEAM_MEMBERS
-- ============================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members read access" ON team_members;
CREATE POLICY "Team members read access" ON team_members
    FOR SELECT USING (is_admin() OR is_team_member(team_id));

DROP POLICY IF EXISTS "Team leaders insert members" ON team_members;
CREATE POLICY "Team leaders insert members" ON team_members
    FOR INSERT WITH CHECK (is_team_leader(team_id));

DROP POLICY IF EXISTS "Admins insert members" ON team_members;
CREATE POLICY "Admins insert members" ON team_members
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Team leaders update members" ON team_members;
CREATE POLICY "Team leaders update members" ON team_members
    FOR UPDATE USING (is_team_leader(team_id));

DROP POLICY IF EXISTS "Admins update members" ON team_members;
CREATE POLICY "Admins update members" ON team_members
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Team leaders delete members" ON team_members;
CREATE POLICY "Team leaders delete members" ON team_members
    FOR DELETE USING (is_team_leader(team_id));

DROP POLICY IF EXISTS "Admins delete members" ON team_members;
CREATE POLICY "Admins delete members" ON team_members
    FOR DELETE USING (is_admin());

-- ============================================
-- PART 10: RLS POLICIES - COMPETITIONS
-- ============================================

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read competitions" ON competitions;
CREATE POLICY "Authenticated read competitions" ON competitions
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage competitions" ON competitions;
CREATE POLICY "Admins manage competitions" ON competitions
    FOR ALL USING (is_admin());

-- ============================================
-- PART 11: RLS POLICIES - STAGES
-- ============================================

ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read stages by access" ON stages;
CREATE POLICY "Read stages by access" ON stages
    FOR SELECT USING (is_admin() OR EXISTS (
        SELECT 1 FROM team_members tm
        JOIN teams t ON t.id = tm.team_id
        WHERE t.competition_id = stages.competition_id
        AND tm.user_id = auth.uid()::uuid
        AND tm.is_active = true
    ));

DROP POLICY IF EXISTS "Admins manage stages" ON stages;
CREATE POLICY "Admins manage stages" ON stages
    FOR ALL USING (is_admin());

-- ============================================
-- PART 12: RLS POLICIES - TASKS
-- ============================================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read tasks by access" ON tasks;
CREATE POLICY "Read tasks by access" ON tasks
    FOR SELECT USING (is_admin() OR EXISTS (
        SELECT 1 FROM team_members tm
        JOIN teams t ON t.id = tm.team_id
        WHERE t.competition_id = tasks.competition_id
        AND tm.user_id = auth.uid()::uuid
        AND tm.is_active = true
    ));

DROP POLICY IF EXISTS "Admins manage tasks" ON tasks;
CREATE POLICY "Admins manage tasks" ON tasks
    FOR ALL USING (is_admin());

-- ============================================
-- PART 13: RLS POLICIES - SUBMISSIONS
-- ============================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Submissions read access" ON submissions;
CREATE POLICY "Submissions read access" ON submissions
    FOR SELECT USING (
        is_admin() OR is_judge() OR is_team_member(team_id)
    );

DROP POLICY IF EXISTS "Team members create submissions" ON submissions;
CREATE POLICY "Team members create submissions" ON submissions
    FOR INSERT WITH CHECK (is_team_member(team_id));

DROP POLICY IF EXISTS "Team members update submissions" ON submissions;
CREATE POLICY "Team members update submissions" ON submissions
    FOR UPDATE USING (
        is_team_member(team_id) AND status = 'draft'
    );

DROP POLICY IF EXISTS "Admins update submissions" ON submissions;
CREATE POLICY "Admins update submissions" ON submissions
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Judges update submissions" ON submissions;
CREATE POLICY "Judges update submissions" ON submissions
    FOR UPDATE USING (is_judge());

-- ============================================
-- PART 14: RLS POLICIES - ANNOUNCEMENTS
-- ============================================

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read published announcements" ON announcements;
CREATE POLICY "Read published announcements" ON announcements
    FOR SELECT USING (is_admin() OR is_published = true);

DROP POLICY IF EXISTS "Admins manage announcements" ON announcements;
CREATE POLICY "Admins manage announcements" ON announcements
    FOR ALL USING (is_admin());

-- ============================================
-- PART 15: RLS POLICIES - NEWS
-- ============================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read published news" ON news;
CREATE POLICY "Read published news" ON news
    FOR SELECT USING (is_admin() OR is_published = true);

DROP POLICY IF EXISTS "Admins manage news" ON news;
CREATE POLICY "Admins manage news" ON news
    FOR ALL USING (is_admin());

-- ============================================
-- PART 16: RLS POLICIES - NOTIFICATIONS
-- ============================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "System insert notifications" ON notifications;
CREATE POLICY "System insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- ============================================
-- PART 17: RLS POLICIES - JUDGE_SCORES
-- ============================================

ALTER TABLE judge_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Judges read scores" ON judge_scores;
CREATE POLICY "Judges read scores" ON judge_scores
    FOR SELECT USING (is_admin() OR judge_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Judges insert scores" ON judge_scores;
CREATE POLICY "Judges insert scores" ON judge_scores
    FOR INSERT WITH CHECK (judge_id = auth.uid()::uuid AND is_judge());

DROP POLICY IF EXISTS "Admins insert scores" ON judge_scores;
CREATE POLICY "Admins insert scores" ON judge_scores
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Judges update scores" ON judge_scores;
CREATE POLICY "Judges update scores" ON judge_scores
    FOR UPDATE USING (judge_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Admins update scores" ON judge_scores;
CREATE POLICY "Admins update scores" ON judge_scores
    FOR UPDATE USING (is_admin());

-- ============================================
-- PART 18: RLS POLICIES - JUDGE_ASSIGNMENTS
-- ============================================

ALTER TABLE judge_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Judges read own assignments" ON judge_assignments;
CREATE POLICY "Judges read own assignments" ON judge_assignments
    FOR SELECT USING (
        judge_id = auth.uid()::uuid
        OR is_admin()
    );

DROP POLICY IF EXISTS "Admins manage assignments" ON judge_assignments;
CREATE POLICY "Admins manage assignments" ON judge_assignments
    FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Judges update own assignments" ON judge_assignments;
CREATE POLICY "Judges update own assignments" ON judge_assignments
    FOR UPDATE USING (judge_id = auth.uid()::uuid);

-- ============================================
-- PART 19: RLS POLICIES - AUDIT_LOGS
-- ============================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read audit logs" ON audit_logs;
CREATE POLICY "Admins read audit logs" ON audit_logs
    FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Service insert audit logs" ON audit_logs;
CREATE POLICY "Service insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- ============================================
-- PART 20: STORAGE
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('payments', 'payments', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated upload payments" ON storage.objects;
CREATE POLICY "Authenticated upload payments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'payments' AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Public view payments" ON storage.objects;
CREATE POLICY "Public view payments" ON storage.objects
    FOR SELECT USING (bucket_id = 'payments');

-- ============================================
-- PART 21: SAMPLE DATA
-- ============================================

INSERT INTO competitions (id, code, name, description, status)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'CIBC2026',
    'CIBC Competition 2026',
    'Creative and Innovation Business Competition',
    'active'
) ON CONFLICT (code) DO NOTHING;

-- ============================================
-- SELESAI!
-- ============================================
-- Setelah menjalankan SQL ini:
-- 1. Set admin: UPDATE users SET role = 'super_admin', status = 'approved' WHERE email = 'email-admin';
-- 2. Test: Register user baru -> Login admin -> Approve -> Login user
-- 3. Verify RLS policies dengan berbagai role
-- ============================================