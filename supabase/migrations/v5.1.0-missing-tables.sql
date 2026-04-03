-- ============================================
-- CIBC Competition Platform - Missing Tables
-- Version: 5.1.0 (Additional Tables)
-- ============================================
--
-- Tables yang belum ada di schema utama:
-- 1. judge_assignments - Penugasan juri ke submission
-- 2. audit_logs - Log aktivitas untuk audit trail
-- 3. password_reset_tokens - Token reset password (backup)
--
-- ============================================

-- ============================================
-- PART 1: JUDGE_ASSIGNMENTS TABLE
-- ============================================
-- Tracks which judges are assigned to which submissions
-- Allows competition-specific judge assignments

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

-- Indexes for judge_assignments
CREATE INDEX IF NOT EXISTS idx_judge_assignments_judge ON judge_assignments(judge_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_submission ON judge_assignments(submission_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_competition ON judge_assignments(competition_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_status ON judge_assignments(status);

-- ============================================
-- PART 2: AUDIT_LOGS TABLE
-- ============================================
-- Tracks all important actions for audit trail

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

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- PART 3: PASSWORD_RESET_TOKENS TABLE
-- ============================================
-- Backup for password reset tokens (Supabase handles this internally)
-- Useful for custom reset flows or auditing

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- ============================================
-- PART 4: RLS POLICIES FOR NEW TABLES
-- ============================================

-- Judge Assignments RLS
ALTER TABLE judge_assignments ENABLE ROW LEVEL SECURITY;

-- Judges can read their own assignments
CREATE POLICY "Judges read own assignments" ON judge_assignments
    FOR SELECT USING (
        judge_id = auth.uid()::uuid
        OR EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role IN ('admin', 'super_admin')
        )
    );

-- Admins can manage all assignments
CREATE POLICY "Admins manage assignments" ON judge_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role IN ('admin', 'super_admin')
        )
    );

-- Judges can update their own assignments (for completing grading)
CREATE POLICY "Judges update own assignments" ON judge_assignments
    FOR UPDATE USING (judge_id = auth.uid()::uuid);

-- Audit Logs RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins read audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role IN ('admin', 'super_admin')
        )
    );

-- Service role can insert (via trigger or function)
CREATE POLICY "Service insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Password Reset Tokens RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only read their own tokens (for validation)
CREATE POLICY "Users read own reset tokens" ON password_reset_tokens
    FOR SELECT USING (user_id = auth.uid()::uuid);

-- Service can insert tokens
CREATE POLICY "Service insert reset tokens" ON password_reset_tokens
    FOR INSERT WITH CHECK (true);

-- ============================================
-- PART 5: FUNCTIONS FOR AUDIT LOGGING
-- ============================================

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to audit user changes
CREATE OR REPLACE FUNCTION audit_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event(
            NEW.id,
            'user.created',
            'user',
            NEW.id,
            jsonb_build_object('email', NEW.email, 'role', NEW.role)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log significant changes
        IF OLD.status != NEW.status THEN
            PERFORM log_audit_event(
                NEW.id,
                'user.status_changed',
                'user',
                NEW.id,
                jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
            );
        END IF;
        IF OLD.role != NEW.role THEN
            PERFORM log_audit_event(
                auth.uid()::uuid,
                'user.role_changed',
                'user',
                NEW.id,
                jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role)
            );
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event(
            auth.uid()::uuid,
            'user.deleted',
            'user',
            OLD.id,
            jsonb_build_object('email', OLD.email)
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS audit_users_trigger ON users;
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_user_changes();

-- ============================================
-- PART 6: PERFORMANCE INDEXES
-- ============================================
-- Additional indexes for better query performance

-- Submissions
CREATE INDEX IF NOT EXISTS idx_submissions_competition_status ON submissions(competition_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_task_status ON submissions(task_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC);

-- Teams
CREATE INDEX IF NOT EXISTS idx_teams_competition_status ON teams(competition_id, status);
CREATE INDEX IF NOT EXISTS idx_teams_payment_status ON teams(payment_status);

-- Team Members
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Stages and Tasks
CREATE INDEX IF NOT EXISTS idx_stages_competition ON stages(competition_id);
CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_tasks_competition ON tasks(competition_id);

-- Announcements
CREATE INDEX IF NOT EXISTS idx_announcements_competition_published ON announcements(competition_id, is_published);

-- ============================================
-- SELESAI!
-- ============================================
-- Setelah menjalankan SQL ini:
-- 1. Verifikasi semua tabel terbuat
-- 2. Test RLS policies dengan berbagai role
-- 3. Monitor audit_logs untuk memastikan trigger bekerja
-- ============================================