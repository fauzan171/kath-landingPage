-- ============================================
-- CIBC Admin Dashboard - Supabase PostgreSQL Schema
-- Version: 2.0.0 (Supabase Overhaul)
-- Last Updated: 2026-03-19
-- ============================================
--
-- Architecture:
-- - Database: Supabase PostgreSQL (FREE 500MB)
-- - Storage: Google Drive via n8n (FREE 15GB)
-- - Automation: n8n Workflow (Self-hosted FREE)
-- - Total Cost: $0/month
--
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,  -- NULL if using Supabase Auth
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. USER ROLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'judge', 'observer')),
    permissions JSONB DEFAULT '["read"]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, competition_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_competition ON user_roles(competition_id);

-- ============================================
-- 3. COMPETITIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')) DEFAULT 'draft',

    -- Timeline
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    event_start TIMESTAMPTZ,
    event_end TIMESTAMPTZ,

    -- Configuration (JSONB for flexibility)
    config JSONB DEFAULT '{
        "totalPrize": "Rp 200 Juta",
        "maxTeamSize": 5,
        "minTeamSize": 2,
        "categories": []
    }'::jsonb,

    -- Theme settings
    theme JSONB DEFAULT '{
        "primaryColor": "#C4A35A",
        "secondaryColor": "#1A1A1A",
        "heroImage": null,
        "logo": null
    }'::jsonb,

    -- Competition settings
    settings JSONB DEFAULT '{
        "autoProgressStages": true,
        "publicLeaderboard": false,
        "blindGrading": true
    }'::jsonb,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_code ON competitions(code);

-- ============================================
-- 4. STAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
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
    instructions TEXT,

    type TEXT CHECK(type IN ('file_upload', 'text_input', 'link_submit', 'quiz', 'attendance')) DEFAULT 'file_upload',

    -- File settings
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_extensions JSONB DEFAULT '[".pdf"]'::jsonb,
    max_files INTEGER DEFAULT 1,

    -- Deadline
    deadline TIMESTAMPTZ,
    allow_late_submission BOOLEAN DEFAULT false,
    late_penalty_percent INTEGER DEFAULT 0,

    -- Settings
    is_required BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    allow_edit BOOLEAN DEFAULT true,

    -- Grading rubric
    rubric JSONB DEFAULT '[]'::jsonb,

    -- Custom form fields
    custom_fields JSONB DEFAULT '[]'::jsonb,

    order_index INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_tasks_competition ON tasks(competition_id);
CREATE INDEX IF NOT EXISTS idx_tasks_published ON tasks(is_published);

-- ============================================
-- 6. TEAMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    code TEXT UNIQUE,

    -- Category
    category TEXT CHECK(category IN ('startup', 'student', 'corporate')),

    -- Status
    status TEXT CHECK(status IN ('draft', 'pending_review', 'registered', 'active', 'disqualified', 'withdrawn')) DEFAULT 'draft',

    -- Registration
    registered_at TIMESTAMPTZ,
    registration_data JSONB DEFAULT '{}'::jsonb,

    -- Stats
    total_score DECIMAL(5,2) DEFAULT 0,
    rank INTEGER,

    -- Metadata
    institution TEXT,
    country TEXT DEFAULT 'Indonesia',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_competition ON teams(competition_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_code ON teams(code);

-- ============================================
-- 7. TEAM MEMBERS TABLE
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
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

-- ============================================
-- 8. SUBMISSIONS TABLE
-- ============================================
-- IMPORTANT: file_url stores Google Drive URL (string only!)
-- Actual file is stored in Google Drive (15GB FREE)
-- Database only stores metadata (~200 bytes per submission)
-- ============================================

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,

    -- Submission data
    submitted_by UUID REFERENCES team_members(id),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),

    -- File metadata (Google Drive URL - string only!)
    file_url TEXT,        -- https://drive.google.com/file/d/xxx/view
    file_name TEXT,
    file_size INTEGER,    -- bytes
    file_type TEXT,       -- MIME type
    drive_file_id TEXT,   -- Google Drive file ID

    -- Content (for text_input, link_submit)
    content TEXT,

    -- Custom field values
    field_values JSONB DEFAULT '{}'::jsonb,

    -- Status
    status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'needs_revision', 'graded', 'final')) DEFAULT 'draft',

    -- Grading
    total_score DECIMAL(5,2),
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMPTZ,
    feedback TEXT,

    -- Criteria breakdown
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

-- ============================================
-- 9. ANNOUNCEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),

    title TEXT NOT NULL,
    title_id TEXT,
    content TEXT NOT NULL,
    content_id TEXT,

    type TEXT CHECK(type IN ('general', 'urgent', 'result', 'reminder', 'system')) DEFAULT 'general',

    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,

    -- Targeting
    target_all BOOLEAN DEFAULT true,
    target_teams JSONB,
    target_stages JSONB,
    target_categories JSONB,

    views_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_competition ON announcements(competition_id);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published);

-- ============================================
-- 10. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),

    announcement_id UUID REFERENCES announcements(id),
    related_entity_type TEXT,
    related_entity_id UUID,

    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK(type IN ('info', 'success', 'warning', 'urgent')) DEFAULT 'info',

    action_url TEXT,
    action_text TEXT,

    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_team ON notifications(team_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(is_read);

-- ============================================
-- 11. AUDIT LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    competition_id UUID REFERENCES competitions(id),

    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,

    old_values JSONB,
    new_values JSONB,

    ip_address TEXT,
    user_agent TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_competition ON audit_logs(competition_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Public can read active competitions
CREATE POLICY "Public can read active competitions" ON competitions
    FOR SELECT USING (status IN ('active', 'upcoming'));

-- Public can read published stages and tasks
CREATE POLICY "Public can read stages" ON stages
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can read tasks" ON tasks
    FOR SELECT USING (is_published = true);

-- Team members can read their own team
CREATE POLICY "Team members can read own team" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = teams.id
            AND team_members.email = auth.email()
        )
    );

-- Team members can read own submissions
CREATE POLICY "Team members can read own submissions" ON submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            JOIN teams t ON t.id = tm.team_id
            WHERE t.id = submissions.team_id
            AND tm.email = auth.email()
        )
    );

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

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE SIZE ESTIMATION
-- ============================================
--
-- Per submission metadata:
-- - id: 36 bytes (UUID)
-- - file_url: ~60 bytes (Google Drive URL)
-- - file_name: ~30 bytes
-- - file_size: 4 bytes
-- - status: ~10 bytes
-- - timestamps: ~40 bytes
-- - Total: ~180 bytes per submission
--
-- With 500MB free tier:
-- - Can store ~2.7 million submission records
-- - At 500 teams x 5 tasks = 2,500 submissions = ~450KB
-- - Plenty of room for growth!
--
-- File storage: Google Drive (FREE 15GB)
-- - 15GB / 5MB per PDF = 3,000 PDFs
-- - Perfect for competition use case!
--
-- ============================================

-- Print success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 Total tables: 11';
    RAISE NOTICE '💾 Estimated storage per submission: ~200 bytes';
    RAISE NOTICE '📁 File storage: Google Drive (FREE 15GB)';
    RAISE NOTICE '💰 Total cost: $0/month';
END $$;