-- ============================================
-- CIBC Competition Platform - Fixed Schema
-- Version: 4.0.0 (Fixed RLS & Simplified)
-- ============================================
--
-- PERBAIKAN DARI v3.0.0:
-- 1. RLS Policy sekarang cek users.role (bukan admin_accounts)
-- 2. Hapus tabel admin_accounts yang tidak perlu
-- 3. Simplified dan konsisten dengan aplikasi
-- 4. Admin approval flow yang benar
--
-- CARA PAKAI:
-- 1. Buka Supabase SQL Editor
-- 2. Copy paste SEMUA kode di bawah
-- 3. Klik Run
--
-- ============================================

-- ============================================
-- PART 1: CLEANUP - Hapus Semua yang Ada
-- ============================================

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_competitions_updated_at ON competitions;
DROP TRIGGER IF EXISTS update_stages_updated_at ON stages;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
DROP TRIGGER IF EXISTS update_news_updated_at ON news;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_competition_stats(TEXT) CASCADE;
DROP FUNCTION IF EXISTS activate_stage(UUID) CASCADE;
DROP FUNCTION IF EXISTS generate_team_code(TEXT) CASCADE;
DROP FUNCTION IF EXISTS increment_news_view(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_submission_score(UUID) CASCADE;

-- Drop tables (urutan penting - child dulu)
DROP TABLE IF EXISTS judge_scores CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS payment_proofs CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS stages CASCADE;
DROP TABLE IF EXISTS competitions CASCADE;
DROP TABLE IF EXISTS admin_accounts CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop storage buckets
DELETE FROM storage.buckets WHERE id IN ('payments', 'submissions', 'documents');

-- ============================================
-- PART 2: EXTENSION
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 3: USERS TABLE
-- ============================================
-- Ini adalah tabel utama untuk semua user
-- Role langsung di tabel ini (tidak pakai tabel terpisah)
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY,  -- References auth.users.id
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,

    -- User info
    institution TEXT,
    country TEXT DEFAULT 'Indonesia',
    category TEXT CHECK(category IN ('student', 'startup', 'corporate', 'open')),

    -- Account status (INI YANG DICEK SAAT LOGIN)
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,

    -- Role (INI YANG DICEK UNTUK ADMIN ACCESS)
    role TEXT CHECK(role IN ('participant', 'admin', 'super_admin', 'finance_admin', 'judge')) DEFAULT 'participant',

    -- Timestamps
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- PART 4: COMPETITIONS TABLE
-- ============================================

CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 5: TEAMS TABLE
-- ============================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id),
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

CREATE INDEX idx_teams_competition ON teams(competition_id);
CREATE INDEX idx_teams_status ON teams(status);

-- ============================================
-- PART 6: TEAM_MEMBERS TABLE
-- ============================================

CREATE TABLE team_members (
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

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ============================================
-- PART 7: STAGES TABLE
-- ============================================

CREATE TABLE stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id),
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stages_competition ON stages(competition_id);

-- ============================================
-- PART 8: TASKS TABLE
-- ============================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID REFERENCES stages(id),
    competition_id UUID REFERENCES competitions(id),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'file_upload',
    is_required BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_stage ON tasks(stage_id);

-- ============================================
-- PART 9: SUBMISSIONS TABLE
-- ============================================

CREATE TABLE submissions (
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

CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_submissions_team ON submissions(team_id);

-- ============================================
-- PART 10: ANNOUNCEMENTS TABLE
-- ============================================

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id),
    title TEXT NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'general',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 11: NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================
-- PART 12: JUDGE_SCORES TABLE
-- ============================================

CREATE TABLE judge_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES users(id),
    submission_id UUID REFERENCES submissions(id),
    score INTEGER,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_judge_scores_submission ON judge_scores(submission_id);

-- ============================================
-- PART 13: NEWS TABLE
-- ============================================

CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 14: STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('payments', 'payments', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 15: AUTH TRIGGER
-- ============================================
-- Saat user signup via Supabase Auth, otomatis buat record di users table
-- dengan status='pending' dan role='participant'

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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PART 16: UPDATED_AT TRIGGER
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
-- PART 17: RLS POLICIES - USERS
-- ============================================
-- INI BAGIAN PALING PENTING!
-- RLS sekarang cek users.role LANGSUNG (bukan admin_accounts)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: User bisa baca data dirinya sendiri
CREATE POLICY "Users read own data" ON users
    FOR SELECT USING (auth.uid()::uuid = id);

-- Policy: Admin bisa baca SEMUA user
CREATE POLICY "Admins read all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin')
        )
    );

-- Policy: Admin bisa UPDATE semua user (untuk approval)
CREATE POLICY "Admins update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin')
        )
    );

-- Policy: User baru bisa INSERT (untuk auth trigger)
CREATE POLICY "Allow user insert" ON users
    FOR INSERT WITH CHECK (true);

-- ============================================
-- PART 18: RLS POLICIES - TEAMS
-- ============================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams viewable by all" ON teams
    FOR SELECT USING (true);

CREATE POLICY "Authenticated insert teams" ON teams
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins update teams" ON teams
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin')
        )
    );

-- ============================================
-- PART 19: RLS POLICIES - TEAM_MEMBERS
-- ============================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members viewable" ON team_members
    FOR SELECT USING (true);

CREATE POLICY "Authenticated insert members" ON team_members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- PART 20: RLS POLICIES - OTHER TABLES
-- ============================================

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Competitions viewable" ON competitions FOR SELECT USING (true);

ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stages viewable" ON stages FOR SELECT USING (true);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tasks viewable" ON tasks FOR SELECT USING (true);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Announcements viewable" ON announcements FOR SELECT USING (true);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News viewable" ON news FOR SELECT USING (true);

-- ============================================
-- PART 21: RLS POLICIES - SUBMISSIONS
-- ============================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Submissions viewable" ON submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_id = submissions.team_id
            AND user_id = auth.uid()::uuid
        )
        OR EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin', 'judge')
        )
    );

CREATE POLICY "Authenticated insert submissions" ON submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins update submissions" ON submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin', 'judge')
        )
    );

-- ============================================
-- PART 22: RLS POLICIES - NOTIFICATIONS
-- ============================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid()::uuid);

-- ============================================
-- PART 23: RLS POLICIES - JUDGE_SCORES
-- ============================================

ALTER TABLE judge_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges manage scores" ON judge_scores
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin', 'judge')
        )
    );

-- ============================================
-- PART 24: STORAGE POLICIES
-- ============================================

CREATE POLICY "Anyone upload payments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'payments');

CREATE POLICY "Public view payments" ON storage.objects
    FOR SELECT USING (bucket_id = 'payments');

-- ============================================
-- PART 25: SAMPLE DATA
-- ============================================

INSERT INTO competitions (id, code, name, description, status)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'CIBC2026',
    'CIBC Competition 2026',
    'Creative and Innovation Business Competition',
    'active'
);

-- ============================================
-- SELESAI!
-- ============================================l
-- Setelah menjalankan SQL ini:
-- 1. Set admin: UPDATE users SET role = 'super_admin', status = 'approved' WHERE email = 'email-admin';
-- 2. Test: Register user baru -> Login admin -> Approve -> Login user
-- ============================================