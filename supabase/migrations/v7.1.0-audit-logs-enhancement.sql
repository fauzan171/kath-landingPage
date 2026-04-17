-- ============================================
-- v7.1.0: Ensure audit_logs table exists with proper RLS
-- Also add index for faster queries by user_id
-- ============================================

-- Create audit_logs table if not exists
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all audit logs
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Admins can read audit logs'
    ) THEN
        CREATE POLICY "Admins can read audit logs" ON audit_logs
            FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM users
                    WHERE users.id = auth.uid()
                    AND users.role IN ('admin', 'super_admin', 'finance_admin')
                )
            );
    END IF;
END $$;

-- Policy: Any authenticated user can insert audit logs (for tracking their own actions)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Authenticated users can insert audit logs'
    ) THEN
        CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
            FOR INSERT
            WITH CHECK (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Add last_login_at column to users if not exists (for tracking login activity)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'last_login_at'
    ) THEN
        ALTER TABLE users ADD COLUMN last_login_at TIMESTAMPTZ;
    END IF;
END $$;
