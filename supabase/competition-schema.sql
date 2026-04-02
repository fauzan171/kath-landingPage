-- ============================================
-- CIBC Competition Management System Schema
-- ============================================
-- Run this in Supabase SQL Editor after landing-page-content.sql
-- ============================================

-- ============================================
-- 1. COMPETITIONS
-- ============================================
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL DEFAULT 'cibc-2026',
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    theme TEXT,
    theme_id TEXT,
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    competition_start TIMESTAMPTZ,
    competition_end TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default CIBC 2026 competition
INSERT INTO competitions (code, name, name_id, description, description_id, theme, theme_id)
VALUES (
    'cibc-2026',
    'CIBC Power by KATH 2026',
    'CIBC Power by KATH 2026',
    'International Business Case Competition - Innovate for a Sustainable Future',
    'Kompetisi Bisnis Case Internasional - Inovasi untuk Masa Depan Berkelanjutan',
    'Innovate for a Sustainable Future',
    'Inovasi untuk Masa Depan Berkelanjutan'
) ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 2. COMPETITION STAGES (Timeline)
-- ============================================
CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    order_index INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default stages for CIBC 2026
INSERT INTO stages (competition_id, name, name_id, description, order_index) VALUES
((SELECT id FROM competitions WHERE code = 'cibc-2026'), 'Registration', 'Pendaftaran', 'Team registration and verification', 1),
((SELECT id FROM competitions WHERE code = 'cibc-2026'), 'Preliminary', 'Penyisihan', 'Initial round - Case study submission', 2),
((SELECT id FROM competitions WHERE code = 'cibc-2026'), 'Semi-Final', 'Semi-Final', 'Semi-final round - Presentation', 3),
((SELECT id FROM competitions WHERE code = 'cibc-2026'), 'Final', 'Final', 'Grand final - Live presentation', 4);

-- ============================================
-- 3. TASKS (Submissions per stage)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID REFERENCES stages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    type TEXT CHECK(type IN ('file_upload', 'text', 'link', 'presentation')) DEFAULT 'file_upload',
    file_types TEXT[] DEFAULT ARRAY['pdf'],
    max_file_size INTEGER DEFAULT 10485760, -- 10MB
    deadline TIMESTAMPTZ,
    max_score DECIMAL DEFAULT 100,
    is_published BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tasks
INSERT INTO tasks (stage_id, name, name_id, description, type, is_published, order_index) VALUES
((SELECT id FROM stages WHERE name = 'Preliminary' AND competition_id = (SELECT id FROM competitions WHERE code = 'cibc-2026')),
    'Business Case Proposal', 'Proposal Bisnis Case', 'Submit your business case proposal in PDF format', 'file_upload', true, 1);

-- ============================================
-- 4. EXTEND USERS TABLE (add competition fields)
-- ============================================
-- Add columns to existing users table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'institution') THEN
        ALTER TABLE users ADD COLUMN institution TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============================================
-- 5. USER ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT CHECK(role IN ('participant', 'admin', 'judge', 'super_admin')) DEFAULT 'participant',
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, competition_id)
);

-- ============================================
-- 6. TEAMS
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    team_code TEXT UNIQUE,
    category TEXT CHECK(category IN ('student', 'open')) DEFAULT 'student',
    institution TEXT,
    status TEXT CHECK(status IN ('draft', 'pending', 'verified', 'disqualified')) DEFAULT 'draft',
    payment_proof TEXT,
    payment_status TEXT CHECK(payment_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    documents JSONB DEFAULT '{}',
    notes TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate team code function
CREATE OR REPLACE FUNCTION generate_team_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN 'CIBC-' || result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate team code
CREATE OR REPLACE FUNCTION set_team_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.team_code IS NULL THEN
        NEW.team_code := generate_team_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_team_code_trigger ON teams;
CREATE TRIGGER set_team_code_trigger
    BEFORE INSERT ON teams
    FOR EACH ROW
    EXECUTE FUNCTION set_team_code();

-- ============================================
-- 7. TEAM MEMBERS
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT CHECK(role IN ('leader', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id),
    UNIQUE(user_id) -- One user can only be in one team per competition
);

-- ============================================
-- 8. SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    content TEXT, -- For text submissions
    link_url TEXT, -- For link submissions
    status TEXT CHECK(status IN ('draft', 'submitted', 'late', 'graded')) DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    total_score DECIMAL,
    feedback TEXT,
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, team_id)
);

-- ============================================
-- 9. GRADING CRITERIA
-- ============================================
CREATE TABLE IF NOT EXISTS grading_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    max_score DECIMAL DEFAULT 100,
    weight DECIMAL DEFAULT 1.0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default grading criteria
INSERT INTO grading_criteria (task_id, name, name_id, description, max_score, weight, order_index) VALUES
((SELECT id FROM tasks WHERE name = 'Business Case Proposal'),
    'Problem Analysis', 'Analisis Masalah', 'Quality of problem identification and analysis', 25, 0.25, 1),
((SELECT id FROM tasks WHERE name = 'Business Case Proposal'),
    'Solution Innovation', 'Inovasi Solusi', 'Creativity and feasibility of proposed solution', 25, 0.25, 2),
((SELECT id FROM tasks WHERE name = 'Business Case Proposal'),
    'Presentation', 'Presentasi', 'Clarity and professionalism of presentation', 25, 0.25, 3),
((SELECT id FROM tasks WHERE name = 'Business Case Proposal'),
    'Impact & Sustainability', 'Dampak & Keberlanjutan', 'Potential impact and sustainability of solution', 25, 0.25, 4);

-- ============================================
-- 10. SUBMISSION SCORES (Per criteria)
-- ============================================
CREATE TABLE IF NOT EXISTS submission_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    criteria_id UUID REFERENCES grading_criteria(id) ON DELETE CASCADE,
    score DECIMAL NOT NULL,
    feedback TEXT,
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(submission_id, criteria_id)
);

-- ============================================
-- 11. ANNOUNCEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_id TEXT,
    content TEXT NOT NULL,
    content_id TEXT,
    type TEXT CHECK(type IN ('info', 'warning', 'success', 'urgent')) DEFAULT 'info',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. CIBC LANDING PAGE CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS cibc_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default CIBC content sections
INSERT INTO cibc_content (section, content) VALUES
('hero', '{"title": "CIBC Power by KATH 2026", "subtitle": "International Business Case Competition", "description": "Innovate for a Sustainable Future", "cta_text": "Register Now", "cta_link": "/cibc/register"}'),
('about', '{"title": "About CIBC", "description": "The International Business Case Competition challenges students to solve real-world business problems.", "features": ["Real Business Cases", "International Judges", "Premium Networking"]}'),
('prizes', '{"title": "Prizes", "total": "$10,000+", "categories": [{"rank": "1st Place", "prize": "$5,000"}, {"rank": "2nd Place", "prize": "$3,000"}, {"rank": "3rd Place", "prize": "$2,000"}]}'),
('categories', '{"items": [{"name": "Student Category", "description": "Undergraduate students"}, {"name": "Open Category", "description": "Professionals and graduates"}]}'),
('requirements', '{"items": ["Team of 3-5 members", "Valid student ID (for student category)", "Registration fee: $50/team"]}')
ON CONFLICT (section) DO NOTHING;

-- ============================================
-- 14. ENABLE RLS
-- ============================================
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cibc_content ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 15. RLS POLICIES
-- ============================================

-- Competitions: Public read, Admin write
CREATE POLICY "Public read competitions" ON competitions FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage competitions" ON competitions FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Stages: Public read visible, Admin write
CREATE POLICY "Public read stages" ON stages FOR SELECT USING (is_visible = true);
CREATE POLICY "Admin manage stages" ON stages FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Tasks: Public read published, Admin write
CREATE POLICY "Public read tasks" ON tasks FOR SELECT USING (is_published = true);
CREATE POLICY "Admin manage tasks" ON tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Teams: Users see own team, Admin sees all
CREATE POLICY "Users see own team" ON teams FOR SELECT USING (
    id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Users create team" ON teams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Leaders update team" ON teams FOR UPDATE USING (
    id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'leader')
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Team Members: Users manage own membership
CREATE POLICY "Users see team members" ON team_members FOR SELECT USING (
    user_id = auth.uid()
    OR team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Users join team" ON team_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Leaders manage members" ON team_members FOR DELETE USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'leader')
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Submissions: Users see own, Admin sees all
CREATE POLICY "Teams see own submissions" ON submissions FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'judge'))
);
CREATE POLICY "Teams create submission" ON submissions FOR INSERT WITH CHECK (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);
CREATE POLICY "Teams update draft" ON submissions FOR UPDATE USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()) AND status = 'draft'
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'judge'))
);

-- Announcements: Public read published, Admin write
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Participants read announcements" ON announcements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin manage announcements" ON announcements FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Notifications: Users see own only
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- CIBC Content: Public read, Admin write
CREATE POLICY "Public read cibc_content" ON cibc_content FOR SELECT USING (is_published = true);
CREATE POLICY "Admin manage cibc_content" ON cibc_content FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- 16. UPDATED AT TRIGGERS
-- ============================================
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY['competitions', 'stages', 'tasks', 'teams', 'submissions', 'announcements', 'cibc_content'])
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- ============================================
-- 17. HELPER FUNCTIONS
-- ============================================

-- Get current user's team for a competition
CREATE OR REPLACE FUNCTION get_user_team(p_user_id UUID, p_competition_id UUID)
RETURNS UUID AS $$
SELECT team_id FROM team_members tm
JOIN teams t ON t.id = tm.team_id
WHERE tm.user_id = p_user_id AND t.competition_id = p_competition_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = p_user_id AND role IN ('admin', 'super_admin')
);
$$ LANGUAGE sql SECURITY DEFINER;

-- Get competition stats
CREATE OR REPLACE FUNCTION get_competition_stats(p_competition_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_teams', (SELECT COUNT(*) FROM teams WHERE competition_id = p_competition_id),
        'verified_teams', (SELECT COUNT(*) FROM teams WHERE competition_id = p_competition_id AND status = 'verified'),
        'pending_teams', (SELECT COUNT(*) FROM teams WHERE competition_id = p_competition_id AND status = 'pending'),
        'total_submissions', (SELECT COUNT(*) FROM submissions s JOIN tasks t ON s.task_id = t.id JOIN stages st ON t.stage_id = st.id WHERE st.competition_id = p_competition_id)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE!
-- ============================================
SELECT 'Competition management tables created successfully!' as status;