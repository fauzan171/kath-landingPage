-- ============================================
-- CIBC Competition Platform - RLS Circular Reference Fix
-- Version: 6.1.0 (Critical Security Fix)
-- ============================================
--
-- ISSUE: P0-004 - RLS Circular Reference for Admin Access
--
-- Problem: RLS policies on 'users' table query the same 'users' table
-- they're protecting, causing potential infinite recursion or access issues.
--
-- Fix Strategy:
-- 1. Use auth.jwt() to check role from JWT metadata (NO table query)
-- 2. Create user_role_assignments table (separate from protected users table)
-- 3. Sync role changes to auth.users.raw_app_metadata for JWT claims
-- 4. Update RLS policies to check JWT first, then user_role_assignments
--
-- This migration is idempotent - safe to run multiple times.
--
-- ============================================

-- ============================================
-- PART 1: CREATE USER_ROLE_ASSIGNMENTS TABLE
-- ============================================
-- This table stores role assignments separately from the users table
-- to avoid circular reference in RLS policies.

CREATE TABLE IF NOT EXISTS user_role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('participant', 'admin', 'super_admin', 'finance_admin', 'judge')) DEFAULT 'participant',
    assigned_by UUID,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role ON user_role_assignments(role);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_active ON user_role_assignments(is_active);

-- Enable RLS on this table
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: SYNC ROLE TO JWT CLAIMS
-- ============================================
-- When a user's role changes in the users table, we need to update
-- the auth.users.raw_app_metadata so it appears in JWT claims.

-- Function to sync role to JWT claims
CREATE OR REPLACE FUNCTION sync_role_to_jwt_claims()
RETURNS TRIGGER AS $$
BEGIN
    -- Update auth.users.raw_app_metadata with the new role
    UPDATE auth.users
    SET raw_app_metadata = jsonb_set(
        COALESCE(raw_app_metadata, '{}'::jsonb),
        '{role}',
        to_jsonb(NEW.role)
    )
    WHERE id = NEW.id;

    -- Also update or insert into user_role_assignments
    INSERT INTO user_role_assignments (user_id, role, is_active, updated_at)
    VALUES (NEW.id, NEW.role, true, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        role = NEW.role,
        is_active = true,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS sync_user_role_to_jwt ON users;

-- Create trigger to sync role changes
CREATE TRIGGER sync_user_role_to_jwt
    AFTER INSERT OR UPDATE OF role ON users
    FOR EACH ROW
    EXECUTE FUNCTION sync_role_to_jwt_claims();

-- ============================================
-- PART 3: INITIAL SYNC FOR EXISTING USERS
-- ============================================
-- Sync existing users' roles to JWT claims and role assignments

INSERT INTO user_role_assignments (user_id, role, is_active)
SELECT id, role, true
FROM users
WHERE id IS NOT NULL
ON CONFLICT (user_id)
DO UPDATE SET
    role = EXCLUDED.role,
    is_active = true,
    updated_at = NOW();

-- Sync to auth.users.raw_app_metadata
UPDATE auth.users u
SET raw_app_metadata = jsonb_set(
    COALESCE(u.raw_app_metadata, '{}'::jsonb),
    '{role}',
    to_jsonb(ur.role)
)
FROM users ur
WHERE u.id = ur.id
AND ur.role IS NOT NULL;

-- ============================================
-- PART 4: CREATE IMPROVED HELPER FUNCTIONS
-- ============================================
-- These functions check JWT claims first (no DB query), then fall back
-- to user_role_assignments table (no circular reference).

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    jwt_role TEXT;
BEGIN
    -- First check JWT claims (no database query needed)
    jwt_role := auth.jwt() -> 'app_metadata' ->> 'role';

    IF jwt_role IN ('admin', 'super_admin', 'finance_admin') THEN
        RETURN true;
    END IF;

    -- Fallback: check user_role_assignments table
    RETURN EXISTS (
        SELECT 1 FROM user_role_assignments
        WHERE user_id = auth.uid()::uuid
        AND role IN ('admin', 'super_admin', 'finance_admin')
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_judge()
RETURNS BOOLEAN AS $$
DECLARE
    jwt_role TEXT;
BEGIN
    jwt_role := auth.jwt() -> 'app_metadata' ->> 'role';

    IF jwt_role = 'judge' THEN
        RETURN true;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM user_role_assignments
        WHERE user_id = auth.uid()::uuid
        AND role = 'judge'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- PART 5: RLS POLICIES FOR USER_ROLE_ASSIGNMENTS
-- ============================================

DROP POLICY IF EXISTS "Users read own role" ON user_role_assignments;
CREATE POLICY "Users read own role" ON user_role_assignments
    FOR SELECT USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Admins read all roles" ON user_role_assignments;
CREATE POLICY "Admins read all roles" ON user_role_assignments
    FOR SELECT USING (
        auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'super_admin', 'finance_admin')
        OR EXISTS (
            SELECT 1 FROM user_role_assignments ura
            WHERE ura.user_id = auth.uid()::uuid
            AND ura.role IN ('admin', 'super_admin', 'finance_admin')
            AND ura.is_active = true
        )
    );

DROP POLICY IF EXISTS "Admins manage roles" ON user_role_assignments;
CREATE POLICY "Admins manage roles" ON user_role_assignments
    FOR ALL USING (
        auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'super_admin')
        OR EXISTS (
            SELECT 1 FROM user_role_assignments ura
            WHERE ura.user_id = auth.uid()::uuid
            AND ura.role IN ('admin', 'super_admin')
            AND ura.is_active = true
        )
    );

DROP POLICY IF EXISTS "System insert roles" ON user_role_assignments;
CREATE POLICY "System insert roles" ON user_role_assignments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PART 6: UPDATE USERS TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users read own data" ON users;
DROP POLICY IF EXISTS "Admins read all users" ON users;
DROP POLICY IF EXISTS "Users update own data" ON users;
DROP POLICY IF EXISTS "Admins update all users" ON users;
DROP POLICY IF EXISTS "Service role insert users" ON users;

CREATE POLICY "Users read own data" ON users
    FOR SELECT USING (auth.uid()::uuid = id);

CREATE POLICY "Admins read all users" ON users
    FOR SELECT USING (
        auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'super_admin', 'finance_admin')
        OR EXISTS (
            SELECT 1 FROM user_role_assignments
            WHERE user_id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin', 'finance_admin')
            AND is_active = true
        )
    );

CREATE POLICY "Users update own data" ON users
    FOR UPDATE USING (auth.uid()::uuid = id)
    WITH CHECK (auth.uid()::uuid = id);

CREATE POLICY "Admins update all users" ON users
    FOR UPDATE USING (
        auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'super_admin')
        OR EXISTS (
            SELECT 1 FROM user_role_assignments
            WHERE user_id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin')
            AND is_active = true
        )
    )
    WITH CHECK (
        auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'super_admin')
        OR EXISTS (
            SELECT 1 FROM user_role_assignments
            WHERE user_id = auth.uid()::uuid
            AND role IN ('admin', 'super_admin')
            AND is_active = true
        )
    );

CREATE POLICY "Service role insert users" ON users
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, verify with:
-- SELECT * FROM pg_policies WHERE tablename = 'users';
-- SELECT auth.jwt();  -- Should show app_metadata with role