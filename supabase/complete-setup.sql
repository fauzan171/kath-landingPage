-- ============================================
-- CIBC Dashboard - Complete Database Setup (FIXED ORDER)
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. COMPETITIONS TABLE (harus sebelum user_roles)
-- ============================================

CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')) DEFAULT 'draft',
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    event_start TIMESTAMPTZ,
    event_end TIMESTAMPTZ,
    config JSONB DEFAULT '{"totalPrize": "Rp 200 Juta", "maxTeamSize": 5, "minTeamSize": 2, "categories": []}'::jsonb,
    theme JSONB DEFAULT '{"primaryColor": "#C4A35A", "secondaryColor": "#1A1A1A", "heroImage": null, "logo": null}'::jsonb,
    settings JSONB DEFAULT '{"autoProgressStages": true, "publicLeaderboard": false, "blindGrading": true}'::jsonb,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_code ON competitions(code);

-- ============================================
-- 3. USER ROLES TABLE
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
-- 4. STAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
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
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_extensions JSONB DEFAULT '[".pdf"]'::jsonb,
    max_files INTEGER DEFAULT 1,
    deadline TIMESTAMPTZ,
    allow_late_submission BOOLEAN DEFAULT false,
    late_penalty_percent INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    allow_edit BOOLEAN DEFAULT true,
    rubric JSONB DEFAULT '[]'::jsonb,
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
    category TEXT CHECK(category IN ('startup', 'student', 'corporate')),
    status TEXT CHECK(status IN ('draft', 'pending_review', 'registered', 'active', 'disqualified', 'withdrawn')) DEFAULT 'draft',
    registered_at TIMESTAMPTZ,
    registration_data JSONB DEFAULT '{}'::jsonb,
    total_score DECIMAL(5,2) DEFAULT 0,
    rank INTEGER,
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
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    student_id TEXT,
    institution TEXT,
    major TEXT,
    position TEXT,
    role TEXT CHECK(role IN ('leader', 'member', 'mentor')) DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

-- ============================================
-- 8. SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    submitted_by UUID REFERENCES team_members(id),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    file_type TEXT,
    drive_file_id TEXT,
    content TEXT,
    field_values JSONB DEFAULT '{}'::jsonb,
    status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'needs_revision', 'graded', 'final')) DEFAULT 'draft',
    total_score DECIMAL(5,2),
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMPTZ,
    feedback TEXT,
    criteria_scores JSONB DEFAULT '{}'::jsonb,
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
-- 12. NEWS TABLE
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
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Public can read active competitions" ON competitions FOR SELECT USING (status IN ('active', 'upcoming'));
CREATE POLICY "Public can read stages" ON stages FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read tasks" ON tasks FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published news" ON news FOR SELECT USING (is_published = true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION get_competition_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'competition', (SELECT row_to_json(c) FROM competitions c WHERE code = 'cibc-2026'),
        'totalTeams', (SELECT COUNT(*)::int FROM teams t JOIN competitions c ON c.id = t.competition_id WHERE c.code = 'cibc-2026'),
        'totalSubmissions', (SELECT COUNT(*)::int FROM submissions s JOIN competitions c ON c.id = s.competition_id WHERE c.code = 'cibc-2026'),
        'activeStages', (SELECT COUNT(*)::int FROM stages st JOIN competitions c ON c.id = st.competition_id WHERE c.code = 'cibc-2026' AND st.is_active = true)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION activate_stage(p_stage_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    v_competition_id UUID;
BEGIN
    SELECT competition_id INTO v_competition_id FROM stages WHERE id = p_stage_id;
    UPDATE stages SET is_active = false, status = 'upcoming' WHERE competition_id = v_competition_id AND id != p_stage_id;
    UPDATE stages SET is_active = true, status = 'active' WHERE id = p_stage_id
    RETURNING json_build_object('id', id, 'name', name, 'status', status, 'is_active', is_active) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_news_view(p_news_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE news SET views = views + 1 WHERE id = p_news_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO users (id, email, password_hash, name, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@kathevent.com', '$2a$10$PlaceholderHashUseSupabaseAuth', 'Super Admin', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO competitions (
    id, code, name, subtitle, description, status,
    registration_start, registration_end, event_start, event_end,
    config, theme, settings, created_by
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    'cibc-2026',
    'CIBC Power by KATH 2026',
    'Inovasi untuk Masa Depan Berkelanjutan',
    'Kompetisi Business Model Canvas tingkat internasional dengan hadiah total Rp 200 Juta.',
    'active',
    '2026-03-01 00:00:00+00', '2026-04-30 23:59:59+00',
    '2026-05-01 00:00:00+00', '2026-05-17 23:59:59+00',
    '{"totalPrize": "Rp 200 Juta", "maxTeamSize": 5, "minTeamSize": 2, "categories": [{"id": "startup", "name": "Startup", "prize": "Rp 100 Juta"}, {"id": "student", "name": "Student", "prize": "Rp 50 Juta"}, {"id": "corporate", "name": "Corporate", "prize": "Rp 50 Juta"}]}'::jsonb,
    '{"primaryColor": "#C4A35A", "secondaryColor": "#1A1A1A"}'::jsonb,
    '{"autoProgressStages": true, "publicLeaderboard": false, "blindGrading": true}'::jsonb,
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (id, user_id, competition_id, role, permissions)
VALUES ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'super_admin', '["read", "write", "delete", "grade", "manage_users", "manage_competitions"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO stages (id, competition_id, name, name_id, description, order_index, start_date, end_date, status, is_active, is_visible, auto_progress, requires_all_tasks) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000010', 'Registration', 'Pendaftaran', 'Register your team', 1, '2026-03-01', '2026-04-30', 'active', true, true, false, true),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000010', 'BMC Submission', 'Pengumpulan BMC', 'Submit your BMC', 2, '2026-05-01', '2026-05-07', 'upcoming', false, true, false, true),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000010', 'Pitch Deck', 'Pitch Deck', 'Submit pitch deck', 3, '2026-05-08', '2026-05-12', 'draft', false, true, false, true),
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000010', 'Semifinal', 'Semifinal', 'Present to judges', 4, '2026-05-13', '2026-05-14', 'draft', false, true, false, true),
('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000010', 'Final', 'Final', 'Final presentation', 5, '2026-05-15', '2026-05-17', 'draft', false, true, false, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, stage_id, competition_id, name, name_id, description, instructions, type, max_file_size_mb, allowed_extensions, deadline, is_required, is_published, allow_edit, rubric, order_index) VALUES
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000010', 'Team Registration', 'Pendaftaran Tim', 'Complete team registration', 'Fill the registration form', 'text_input', 10, '[".pdf"]'::jsonb, '2026-04-30', true, true, true, NULL, 1),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000010', 'Business Model Canvas', 'Business Model Canvas', 'Upload your BMC', 'Upload PDF format', 'file_upload', 10, '[".pdf"]'::jsonb, '2026-05-07', true, true, true, '[{"id": "innovation", "name": "Innovation", "maxScore": 25, "weight": 0.25}, {"id": "market", "name": "Market Potential", "maxScore": 20, "weight": 0.20}, {"id": "business", "name": "Business Model", "maxScore": 25, "weight": 0.25}, {"id": "team", "name": "Team Capability", "maxScore": 15, "weight": 0.15}, {"id": "presentation", "name": "Presentation", "maxScore": 15, "weight": 0.15}]'::jsonb, 1),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000010', 'Pitch Deck', 'Pitch Deck', 'Upload pitch deck', '10-15 slides PDF/PPTX', 'file_upload', 20, '[".pdf", ".pptx"]'::jsonb, '2026-05-12', true, false, true, NULL, 1),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000010', 'Video Pitch', 'Video Pitch', 'Submit 2-3 min video', 'YouTube/Vimeo link', 'link_submit', 0, NULL, '2026-05-12', true, false, true, NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO announcements (id, competition_id, created_by, title, title_id, content, content_id, type, is_published, published_at, target_all)
VALUES ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Welcome to CIBC 2026!', 'Selamat Datang di CIBC 2026!', '<p>Welcome to CIBC Power by KATH 2026!</p>', '<p>Selamat datang di CIBC Power by KATH 2026!</p>', 'general', true, NOW(), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO news (id, title, title_id, slug, excerpt, excerpt_id, content, content_id, category, author, is_published, published_at, views) VALUES
('00000000-0000-0000-0000-000000000401', 'CIBC 2026 Open for Registration', 'CIBC 2026 Dibuka', 'cibc-2026-open', 'Register now for the biggest BMC competition!', 'Daftar sekarang!', '<p>CIBC Power by KATH 2026 is now open!</p>', '<p>Pendaftaran dibuka!</p>', 'competition', 'CIBC Team', true, NOW(), 0),
('00000000-0000-0000-0000-000000000402', '5 Tips for Winning BMC', '5 Tips Menang BMC', '5-tips-bmc', 'Learn the secrets to create winning BMC', 'Pelajari rahasia BMC', '<p>Here are 5 tips...</p>', '<p>Berikut 5 tips...</p>', 'tips', 'CIBC Team', true, NOW() - INTERVAL '2 days', 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUCCESS!
-- ============================================
SELECT '✅ Database setup complete!' as status;