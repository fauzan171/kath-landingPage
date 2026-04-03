-- ============================================
-- ⚠️ DEPRECATED - DO NOT USE
-- ============================================
-- This file is DEPRECATED and will be removed in a future version.
--
-- PLEASE USE: supabase/migrations/v6.0.0-final-schema.sql
--
-- @deprecated Use supabase/migrations/v6.0.0-final-schema.sql instead
-- ============================================

-- ============================================
-- CIBC Competition Platform - COMPLETE RESET & SETUP
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This will DROP all existing tables and recreate them correctly
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: DROP ALL EXISTING TABLES
-- ============================================
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS stages CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_role_assignments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS competitions CASCADE;

-- ============================================
-- STEP 2: CREATE TABLES IN CORRECT ORDER
-- ============================================

-- 1. COMPETITIONS TABLE (independent)
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_id VARCHAR(255),
  description TEXT,
  description_id TEXT,
  theme VARCHAR(255),
  theme_id VARCHAR(255),
  registration_start TIMESTAMP WITH TIME ZONE,
  registration_end TIMESTAMP WITH TIME ZONE,
  competition_start TIMESTAMP WITH TIME ZONE,
  competition_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS TABLE (references auth.users from Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  institution VARCHAR(255),
  category VARCHAR(50) DEFAULT 'student',
  is_verified BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending',
  rejection_reason TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER ROLES TABLE
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'observer',
  permissions JSONB DEFAULT '["read"]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, competition_id)
);

-- 4. TEAMS TABLE
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  team_code VARCHAR(50) UNIQUE,
  category VARCHAR(50) DEFAULT 'student',
  institution VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  payment_proof TEXT,
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_uploaded_at TIMESTAMP WITH TIME ZONE,
  payment_rejection_reason TEXT,
  payment_drive_id TEXT,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID,
  rejected_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  documents JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TEAM MEMBERS TABLE
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 6. STAGES TABLE
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_id VARCHAR(255),
  description TEXT,
  description_id TEXT,
  order_index INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TASKS TABLE
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_id VARCHAR(255),
  description TEXT,
  description_id TEXT,
  type VARCHAR(50) DEFAULT 'file_upload',
  file_types JSONB DEFAULT '["pdf"]',
  max_file_size INTEGER DEFAULT 10485760,
  deadline TIMESTAMP WITH TIME ZONE,
  max_score INTEGER DEFAULT 100,
  is_required BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  rubric JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. SUBMISSIONS TABLE
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES users(id),
  submitted_at TIMESTAMP WITH TIME ZONE,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  file_type VARCHAR(100),
  drive_file_id TEXT,
  content TEXT,
  field_values JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft',
  total_score INTEGER,
  graded_by UUID REFERENCES users(id),
  graded_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  criteria_scores JSONB DEFAULT '{}',
  is_late BOOLEAN DEFAULT false,
  penalty_applied INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, team_id)
);

-- 9. ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  title_id VARCHAR(255),
  content TEXT NOT NULL,
  content_id TEXT,
  type VARCHAR(50) DEFAULT 'general',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(100),
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE INDEXES
-- ============================================
CREATE INDEX idx_teams_competition ON teams(competition_id);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_payment_status ON teams(payment_status);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_submissions_team ON submissions(team_id);
CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- STEP 4: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Competitions: Public read
CREATE POLICY "Competitions are public read" ON competitions
  FOR SELECT USING (true);

-- Users: Users can read own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users: Users can update own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users: Allow insert (for registration)
CREATE POLICY "Allow user insert" ON users
  FOR INSERT WITH CHECK (true);

-- Teams: Anyone can insert (for registration)
CREATE POLICY "Anyone can insert teams" ON teams
  FOR INSERT WITH CHECK (true);

-- Teams: Anyone can read
CREATE POLICY "Anyone can read teams" ON teams
  FOR SELECT USING (true);

-- Teams: Anyone can update (for payment upload)
CREATE POLICY "Anyone can update teams" ON teams
  FOR UPDATE USING (true);

-- Team Members: Anyone can insert
CREATE POLICY "Anyone can insert team members" ON team_members
  FOR INSERT WITH CHECK (true);

-- Team Members: Anyone can read
CREATE POLICY "Anyone can read team members" ON team_members
  FOR SELECT USING (true);

-- Stages: Public read if visible
CREATE POLICY "Stages visible are public" ON stages
  FOR SELECT USING (is_visible = true);

-- Tasks: Public read if published
CREATE POLICY "Tasks published are public" ON tasks
  FOR SELECT USING (is_published = true);

-- Submissions: Users can read
CREATE POLICY "Users can read submissions" ON submissions
  FOR SELECT USING (true);

-- Submissions: Users can insert
CREATE POLICY "Users can insert submissions" ON submissions
  FOR INSERT WITH CHECK (true);

-- Submissions: Users can update
CREATE POLICY "Users can update submissions" ON submissions
  FOR UPDATE USING (true);

-- Announcements: Public read if published
CREATE POLICY "Announcements published are public" ON announcements
  FOR SELECT USING (is_published = true);

-- Notifications: Users can read own
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications: Users can update own
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Notifications: Allow insert
CREATE POLICY "Allow notification insert" ON notifications
  FOR INSERT WITH CHECK (true);

-- User roles: Users can read own roles
CREATE POLICY "Users can read own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON competitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stages_updated_at
  BEFORE UPDATE ON stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 6: GRANT PERMISSIONS
-- ============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ============================================
-- STEP 7: SEED DATA
-- ============================================

-- Insert default competition
INSERT INTO competitions (code, name, name_id, description, description_id, is_active)
VALUES (
  'cibc-2026',
  'CIBC 2026 - Creative Innovation Business Competition',
  'CIBC 2026 - Kompetisi Bisnis Inovasi Kreatif',
  'Creative Innovation Business Competition 2026 - A prestigious business model competition for students, startups, and corporates.',
  'Kompetisi Bisnis Inovasi Kreatif 2026 - Kompetisi model bisnis bergengsi untuk mahasiswa, startup, dan korporat.',
  true
) ON CONFLICT (code) DO NOTHING;

-- Insert sample stage
INSERT INTO stages (competition_id, name, name_id, description, order_index, is_active, is_visible)
SELECT id, 'Registration', 'Pendaftaran', 'Team registration and verification phase', 1, true, true
FROM competitions WHERE code = 'cibc-2026'
ON CONFLICT DO NOTHING;

-- Insert sample task
INSERT INTO tasks (stage_id, competition_id, name, name_id, description, type, is_published, order_index)
SELECT s.id, c.id, 'Business Model Canvas', 'Business Model Canvas', 'Upload your BMC document', 'file_upload', true, 1
FROM stages s
JOIN competitions c ON c.code = 'cibc-2026'
WHERE s.name = 'Registration'
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- After running this:
-- 1. All tables are created with correct structure
-- 2. RLS policies are set up
-- 3. Default competition is inserted
-- 4. Registration will work correctly