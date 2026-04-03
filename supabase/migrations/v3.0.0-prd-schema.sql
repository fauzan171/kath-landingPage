-- ============================================
-- CIBC Competition Platform - Complete Schema
-- Version: 3.0.0 (PRD Implementation)
-- Based on: PRD-CIBC-Competition-Platform-v3.md
-- ============================================
--
-- Tables:
-- 1. users - User accounts (Supabase Auth integrated)
-- 2. admin_accounts - Admin role management
-- 3. competitions - Competition details
-- 4. stages - Competition stages/phases
-- 5. tasks - Tasks within stages
-- 6. teams - Team registrations
-- 7. team_members - Team member details
-- 8. submissions - Team submissions
-- 9. payment_proofs - Payment verification (NEW)
-- 10. announcements - Competition announcements
-- 11. judge_scores - Individual judge scoring (NEW)
-- 12. notifications - User notifications
-- 13. audit_logs - Admin action logs
-- 14. news - News/blog articles
--
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- Integrated with Supabase Auth
-- id = auth.users.id (managed by Supabase)

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,  -- References auth.users.id
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,

    -- User status
    institution TEXT,
    country TEXT DEFAULT 'Indonesia',
    category TEXT CHECK(category IN ('student', 'startup', 'corporate', 'open')),

    -- Account status
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    payment_status TEXT CHECK(payment_status IN ('unpaid', 'pending', 'paid', 'rejected')) DEFAULT 'unpaid',
    rejection_reason TEXT,  -- Reason for rejection if status = 'rejected'
    is_verified BOOLEAN DEFAULT false,  -- Whether user has verified their email

    -- Role
    role TEXT CHECK(role IN ('participant', 'admin', 'super_admin', 'finance_admin', 'judge')) DEFAULT 'participant',

    -- Timestamps
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_payment_status ON users(payment_status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- 2. ADMIN_ACCOUNTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'finance_admin', 'judge')),
    permissions JSONB DEFAULT '["read"]'::jsonb,

    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_accounts_user ON admin_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_role ON admin_accounts(role);

-- ============================================
-- 3. COMPETITIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    name_id TEXT,
    description TEXT,
    description_id TEXT,

    -- Status
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT false,

    -- Theme (for landing page)
    theme TEXT,
    theme_id TEXT,

    -- Timeline
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    competition_start TIMESTAMPTZ,
    competition_end TIMESTAMPTZ,

    -- Configuration (JSONB for flexibility)
    config JSONB DEFAULT '{
        "totalPrize": "Rp 200 Juta",
        "maxTeamSize": 5,
        "minTeamSize": 2,
        "registrationFee": 500000,
        "categories": [
            {"id": "student", "name": "Student", "prize": "Rp 50 Juta"},
            {"id": "startup", "name": "Startup", "prize": "Rp 100 Juta"},
            {"id": "corporate", "name": "Corporate", "prize": "Rp 50 Juta"}
        ]
    }'::jsonb,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_code ON competitions(code);
CREATE INDEX IF NOT EXISTS idx_competitions_active ON competitions(is_active);

-- ============================================
-- 4. STAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,

    -- Timeline
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,

    -- Status
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,

    -- Behavior
    auto_progress BOOLEAN DEFAULT false,
    requires_all_tasks BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stages_competition ON stages(competition_id);
CREATE INDEX IF NOT EXISTS idx_stages_active ON stages(is_active);
CREATE INDEX IF NOT EXISTS idx_stages_order ON stages(order_index);

-- ============================================
-- 5. TASKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    instructions TEXT,
    instructions_id TEXT,

    -- Task type
    type TEXT CHECK(type IN (
        'file_upload',
        'text_input',
        'link_submit',
        'quiz',
        'attendance',
        'text',
        'link',
        'presentation'
    )) DEFAULT 'file_upload',

    -- File settings
    max_file_size_mb INTEGER DEFAULT 10,
    max_file_size INTEGER DEFAULT 10485760,  -- bytes (10MB)
    allowed_extensions JSONB DEFAULT '[".pdf"]'::jsonb,
    file_types JSONB DEFAULT '["pdf"]'::jsonb,  -- alias
    max_files INTEGER DEFAULT 1,

    -- Deadline
    deadline TIMESTAMPTZ,
    allow_late_submission BOOLEAN DEFAULT false,
    late_penalty_percent INTEGER DEFAULT 0,

    -- Settings
    is_required BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    allow_edit BOOLEAN DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 1,

    -- Grading rubric (JSONB)
    rubric JSONB DEFAULT '[]'::jsonb,
    max_score INTEGER DEFAULT 100,

    -- Custom form fields
    custom_fields JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_tasks_competition ON tasks(competition_id);
CREATE INDEX IF NOT EXISTS idx_tasks_published ON tasks(is_published);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(order_index);

-- ============================================
-- 6. TEAMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,

    -- Team info
    name TEXT NOT NULL,
    code TEXT UNIQUE,  -- Team code for invitation (e.g., CIBC2026-ABC123)
    team_code TEXT,    -- Alias for backward compatibility

    -- Category
    category TEXT CHECK(category IN ('student', 'startup', 'corporate', 'open')),

    -- Status
    status TEXT CHECK(status IN (
        'draft',
        'pending',
        'pending_review',
        'registered',
        'verified',
        'active',
        'disqualified',
        'withdrawn'
    )) DEFAULT 'pending',

    -- Payment
    payment_status TEXT CHECK(payment_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    payment_proof TEXT,         -- URL to payment proof
    payment_drive_id TEXT,      -- Google Drive file ID
    payment_uploaded_at TIMESTAMPTZ,
    payment_rejection_reason TEXT,

    -- Leader
    leader_id UUID REFERENCES users(id),

    -- Team size
    max_members INTEGER DEFAULT 5,

    -- Registration metadata
    institution TEXT,
    country TEXT DEFAULT 'Indonesia',
    project_name TEXT,
    project_description TEXT,

    -- Stats
    total_score DECIMAL(5,2) DEFAULT 0,
    rank INTEGER,

    -- Verification
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejected_by UUID REFERENCES users(id),
    rejected_at TIMESTAMPTZ,
    notes TEXT,

    -- Timestamps
    registered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_competition ON teams(competition_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_payment_status ON teams(payment_status);
CREATE INDEX IF NOT EXISTS idx_teams_code ON teams(code);
CREATE INDEX IF NOT EXISTS idx_teams_leader ON teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_teams_category ON teams(category);

-- ============================================
-- 7. TEAM_MEMBERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),

    -- Profile
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    student_id TEXT,
    institution TEXT,
    major TEXT,
    position TEXT,

    -- Role in team
    role TEXT CHECK(role IN ('leader', 'member', 'mentor')) DEFAULT 'member',

    -- Status
    status TEXT CHECK(status IN ('active', 'pending', 'removed')) DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,

    -- Joined user data (from users table)
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);

-- ============================================
-- 8. SUBMISSIONS TABLE
-- ============================================
-- IMPORTANT: file_url stores Google Drive URL (string only!)
-- Actual file is stored in Google Drive via n8n
-- ============================================

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,

    -- Submission data
    submitted_by UUID REFERENCES users(id),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),

    -- File metadata (Google Drive URL - string only!)
    file_url TEXT,           -- https://drive.google.com/file/d/xxx/view
    file_name TEXT,
    file_size INTEGER,       -- bytes
    file_type TEXT,          -- MIME type
    drive_file_id TEXT,      -- Google Drive file ID

    -- Link submission
    link_url TEXT,

    -- Content (for text_input)
    content TEXT,

    -- Custom field values
    field_values JSONB DEFAULT '{}'::jsonb,

    -- Status
    status TEXT CHECK(status IN (
        'draft',
        'submitted',
        'under_review',
        'needs_revision',
        'graded',
        'final',
        'late'
    )) DEFAULT 'draft',

    -- Grading (final scores)
    total_score DECIMAL(5,2),
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMPTZ,
    feedback TEXT,
    criteria_scores JSONB DEFAULT '{}'::jsonb,

    -- Late submission
    is_late BOOLEAN DEFAULT false,
    penalty_applied INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(task_id, team_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_team ON submissions(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_competition ON submissions(competition_id);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON submissions(total_score DESC);

-- ============================================
-- 9. PAYMENT_PROOFS TABLE (NEW - from PRD)
-- ============================================
-- Critical for payment verification workflow
-- ============================================

CREATE TABLE IF NOT EXISTS payment_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,

    -- Payment details
    bank_name TEXT NOT NULL,
    account_holder TEXT NOT NULL,
    transfer_amount INTEGER NOT NULL,  -- in IDR
    transfer_date TIMESTAMPTZ NOT NULL,

    -- File metadata
    file_url TEXT NOT NULL,            -- Google Drive URL
    file_name TEXT,
    file_size INTEGER,
    drive_file_id TEXT,

    -- Verification status
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejected_reason TEXT,

    -- Verification by admin
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,

    -- Notes
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_proofs_user ON payment_proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_team ON payment_proofs(team_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON payment_proofs(status);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_competition ON payment_proofs(competition_id);

-- ============================================
-- 10. ANNOUNCEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),

    title TEXT NOT NULL,
    title_id TEXT,
    content TEXT NOT NULL,
    content_id TEXT,

    type TEXT CHECK(type IN ('general', 'urgent', 'result', 'reminder', 'system', 'info', 'warning', 'success')) DEFAULT 'general',

    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,

    -- Targeting
    target_all BOOLEAN DEFAULT true,
    target_teams JSONB,
    target_stages JSONB,
    target_categories JSONB,

    views_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_competition ON announcements(competition_id);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);

-- ============================================
-- 11. JUDGE_SCORES TABLE (NEW - from PRD)
-- ============================================
-- Individual judge scoring for submissions
-- Each submission gets 3 judges
-- ============================================

CREATE TABLE IF NOT EXISTS judge_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    judge_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Scores breakdown (JSONB)
    scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_score DECIMAL(5,2) NOT NULL DEFAULT 0,

    -- Feedback
    feedback TEXT,

    -- Recommendation
    recommendation TEXT CHECK(recommendation IN ('approve', 'revise', 'reject')) DEFAULT 'approve',

    -- Status
    is_completed BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(submission_id, judge_id)
);

CREATE INDEX IF NOT EXISTS idx_judge_scores_submission ON judge_scores(submission_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_judge ON judge_scores(judge_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_completed ON judge_scores(is_completed);

-- ============================================
-- 12. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,

    -- Related entity
    announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
    related_entity_type TEXT,
    related_entity_id UUID,

    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK(type IN ('info', 'success', 'warning', 'urgent')) DEFAULT 'info',

    -- Action
    action_url TEXT,
    action_text TEXT,

    -- Read status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_team ON notifications(team_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(is_read);

-- ============================================
-- 13. AUDIT_LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,

    -- Action details
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,

    -- Values
    old_values JSONB,
    new_values JSONB,

    -- Metadata
    ip_address TEXT,
    user_agent TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_competition ON audit_logs(competition_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- ============================================
-- 14. NEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title TEXT NOT NULL,
    title_id TEXT,
    slug TEXT UNIQUE NOT NULL,

    excerpt TEXT NOT NULL,
    excerpt_id TEXT,

    content TEXT NOT NULL,
    content_id TEXT,

    image TEXT,

    category TEXT NOT NULL CHECK(category IN ('competition', 'announcement', 'news', 'update', 'tips')) DEFAULT 'news',

    author TEXT NOT NULL DEFAULT 'CIBC Team',
    author_id UUID REFERENCES users(id),

    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,

    views INTEGER DEFAULT 0,

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Users: read/update own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins: full access to all tables
CREATE POLICY "Admins full access on users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_accounts
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin', 'finance_admin')
            AND is_active = true
        )
    );

CREATE POLICY "Admins full access on teams" ON teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_accounts
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin', 'finance_admin')
            AND is_active = true
        )
    );

CREATE POLICY "Admins full access on submissions" ON submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_accounts
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin')
            AND is_active = true
        )
    );

CREATE POLICY "Admins full access on payment_proofs" ON payment_proofs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_accounts
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin', 'finance_admin')
            AND is_active = true
        )
    );

CREATE POLICY "Admins full access on announcements" ON announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_accounts
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin')
            AND is_active = true
        )
    );

-- Judges: read submissions, write judge_scores
CREATE POLICY "Judges can read assigned submissions" ON submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM judge_scores
            WHERE judge_id = auth.uid()
            AND submission_id = submissions.id
        )
    );

CREATE POLICY "Judges can write own scores" ON judge_scores
    FOR ALL USING (judge_id = auth.uid());

-- Public: read active competitions
CREATE POLICY "Public can read active competitions" ON competitions
    FOR SELECT USING (status IN ('active', 'upcoming') OR is_active = true);

-- Public: read visible stages
CREATE POLICY "Public can read visible stages" ON stages
    FOR SELECT USING (is_visible = true);

-- Public: read published tasks
CREATE POLICY "Public can read published tasks" ON tasks
    FOR SELECT USING (is_published = true);

-- Public: read published announcements
CREATE POLICY "Public can read published announcements" ON announcements
    FOR SELECT USING (is_published = true);

-- Public: read published news
CREATE POLICY "Public can read published news" ON news
    FOR SELECT USING (is_published = true);

-- Team members: read own team
CREATE POLICY "Team members can read own team" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = teams.id
            AND tm.user_id = auth.uid()
            AND tm.is_active = true
        )
        OR leader_id = auth.uid()
    );

-- Team members: read own submissions
CREATE POLICY "Team members can read own submissions" ON submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN teams t ON t.id = tm.team_id
            WHERE t.id = submissions.team_id
            AND tm.user_id = auth.uid()
            AND tm.is_active = true
        )
    );

-- Team members: create submissions for own team
CREATE POLICY "Team members can create submissions" ON submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN teams t ON t.id = tm.team_id
            WHERE t.id = submissions.team_id
            AND tm.user_id = auth.uid()
            AND tm.is_active = true
            AND t.status IN ('verified', 'active')
        )
    );

-- Team leader: update team
CREATE POLICY "Team leader can update team" ON teams
    FOR UPDATE USING (leader_id = auth.uid());

-- Users: read own notifications
CREATE POLICY "Users can read own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Users: read own payment proofs
CREATE POLICY "Users can read own payment proofs" ON payment_proofs
    FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN (
            'users', 'competitions', 'stages', 'tasks',
            'teams', 'submissions', 'payment_proofs',
            'announcements', 'judge_scores', 'news'
        )
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
             CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
            t, t, t, t
        );
    END LOOP;
END $$;

-- ============================================
-- AUTH TRIGGER: Auto-create user record
-- ============================================
-- When user signs up via Supabase Auth, create record in users table

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

-- Drop existing trigger if exists, then create new
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Get competition statistics
CREATE OR REPLACE FUNCTION get_competition_stats(p_competition_code TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'competition', (SELECT row_to_json(c) FROM competitions c WHERE code = p_competition_code),
        'totalTeams', (SELECT COUNT(*)::int FROM teams t
                       JOIN competitions c ON c.id = t.competition_id
                       WHERE c.code = p_competition_code),
        'verifiedTeams', (SELECT COUNT(*)::int FROM teams t
                          JOIN competitions c ON c.id = t.competition_id
                          WHERE c.code = p_competition_code AND t.status = 'verified'),
        'pendingTeams', (SELECT COUNT(*)::int FROM teams t
                         JOIN competitions c ON c.id = t.competition_id
                         WHERE c.code = p_competition_code AND t.status = 'pending'),
        'totalSubmissions', (SELECT COUNT(*)::int FROM submissions s
                             JOIN competitions c ON c.id = s.competition_id
                             WHERE c.code = p_competition_code),
        'gradedSubmissions', (SELECT COUNT(*)::int FROM submissions s
                              JOIN competitions c ON c.id = s.competition_id
                              WHERE c.code = p_competition_code AND s.status = 'graded'),
        'activeStages', (SELECT COUNT(*)::int FROM stages st
                         JOIN competitions c ON c.id = st.competition_id
                         WHERE c.code = p_competition_code AND st.is_active = true)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Activate stage (deactivate others)
CREATE OR REPLACE FUNCTION activate_stage(p_stage_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    v_competition_id UUID;
BEGIN
    SELECT competition_id INTO v_competition_id FROM stages WHERE id = p_stage_id;

    -- Deactivate other stages
    UPDATE stages
    SET is_active = false, status = 'upcoming'
    WHERE competition_id = v_competition_id AND id != p_stage_id;

    -- Activate target stage
    UPDATE stages
    SET is_active = true, status = 'active'
    WHERE id = p_stage_id
    RETURNING json_build_object(
        'id', id,
        'name', name,
        'status', status,
        'is_active', is_active
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Generate team code
CREATE OR REPLACE FUNCTION generate_team_code(p_competition_code TEXT)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_exists BOOLEAN;
BEGIN
    -- Generate unique code: COMP-YYYY-XXXXX
    v_code := upper(p_competition_code) || '-' || to_char(NOW(), 'YYYY') || '-' ||
              substr(md5(random()::text), 1, 6);

    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM teams WHERE code = v_code) INTO v_exists;

    -- If exists, regenerate (max 10 attempts)
    FOR i IN 1..10 DO
        IF NOT v_exists THEN
            RETURN v_code;
        END IF;
        v_code := upper(p_competition_code) || '-' || to_char(NOW(), 'YYYY') || '-' ||
                  substr(md5(random()::text), 1, 6);
        SELECT EXISTS(SELECT 1 FROM teams WHERE code = v_code) INTO v_exists;
    END LOOP;

    RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Increment news views
CREATE OR REPLACE FUNCTION increment_news_view(p_news_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE news SET views = views + 1 WHERE id = p_news_id;
END;
$$ LANGUAGE plpgsql;

-- Calculate final submission score (from 3 judges)
CREATE OR REPLACE FUNCTION calculate_submission_score(p_submission_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    v_avg_score DECIMAL(5,2);
BEGIN
    -- Calculate average from all completed judge scores
    SELECT AVG(total_score) INTO v_avg_score
    FROM judge_scores
    WHERE submission_id = p_submission_id AND is_completed = true;

    -- Update submission
    UPDATE submissions
    SET total_score = COALESCE(v_avg_score, 0),
        status = 'graded',
        graded_at = NOW()
    WHERE id = p_submission_id;

    RETURN COALESCE(v_avg_score, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ CIBC Competition Platform Schema v3.0.0 Created!';
    RAISE NOTICE '📊 Total tables: 14';
    RAISE NOTICE '🔒 RLS policies: Enabled';
    RAISE NOTICE '⚡ Triggers: Auto user creation, updated_at';
    RAISE NOTICE '💡 Functions: stats, stage activation, team code generation';
END $$;