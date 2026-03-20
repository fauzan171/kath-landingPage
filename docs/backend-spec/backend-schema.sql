-- ============================================
-- D1 DATABASE SCHEMA FOR ADMIN DASHBOARD
-- ============================================
-- Run: wrangler d1 execute DB_NAME --file=./backend-schema.sql

-- ============================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'judge', 'observer')),
    permissions JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, competition_id, role)
);

-- ============================================
-- 2. COMPETITION MANAGEMENT (Multi-tenant)
-- ============================================

CREATE TABLE IF NOT EXISTS competitions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')),
    registration_start DATETIME,
    registration_end DATETIME,
    event_start DATETIME,
    event_end DATETIME,
    config JSON,
    theme JSON,
    created_by TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. COMPETITION FLOW & STAGES
-- ============================================

CREATE TABLE IF NOT EXISTS stages (
    id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT 0,
    auto_progress BOOLEAN DEFAULT 0,
    requires_submission BOOLEAN DEFAULT 1,
    criteria JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    stage_id TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('submission', 'quiz', 'manual_review', 'attendance')),
    deadline DATETIME,
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_extensions JSON,
    rubric JSON,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT 1,
    is_published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. PARTICIPANTS & TEAMS
-- ============================================

CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    status TEXT CHECK(status IN ('pending', 'registered', 'active', 'disqualified', 'withdrawn')),
    institution TEXT,
    category TEXT,
    registered_at DATETIME,
    registration_data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    student_id TEXT,
    institution TEXT,
    role TEXT CHECK(role IN ('leader', 'member', 'mentor')),
    is_active BOOLEAN DEFAULT 1,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. SUBMISSIONS & GRADING
-- ============================================

CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    submitted_by TEXT REFERENCES users(id),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    content TEXT,
    status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'graded', 'returned')),
    total_score DECIMAL(5,2),
    graded_by TEXT REFERENCES users(id),
    graded_at DATETIME,
    feedback TEXT,
    criteria_scores JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, team_id)
);

CREATE TABLE IF NOT EXISTS submission_reviews (
    id TEXT PRIMARY KEY,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_id TEXT NOT NULL REFERENCES users(id),
    criteria_id TEXT,
    score DECIMAL(5,2),
    feedback TEXT,
    reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    competition_id TEXT REFERENCES competitions(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSON,
    new_values JSON,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. ANNOUNCEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK(type IN ('general', 'urgent', 'result', 'reminder')),
    is_published BOOLEAN DEFAULT 0,
    published_at DATETIME,
    target_teams JSON,
    target_stages JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA (Default Super Admin)
-- ============================================

-- Password: admin123 (change in production!)
-- Generated with: await bcrypt.hash('admin123', 10)
INSERT OR IGNORE INTO users (id, email, password_hash, name, is_active) VALUES (
    'admin-default',
    'admin@kathevent.com',
    '$2a$10$YourHashedPasswordHere',  -- Replace with actual hash
    'Super Admin',
    1
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_competition ON user_roles(competition_id);
CREATE INDEX IF NOT EXISTS idx_stages_competition ON stages(competition_id);
CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_teams_competition ON teams(competition_id);
CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_team ON submissions(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_competition ON audit_logs(competition_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_competition ON announcements(competition_id);
