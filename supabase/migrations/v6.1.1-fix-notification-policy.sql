-- ============================================
-- Security Fix: P0-005 Permissive Notification Insert Policy
-- Version: 6.1.1
-- Date: 2026-04-04
-- ============================================
--
-- CRITICAL SECURITY FIX
-- Issue: Anyone could insert notifications (spam/abuse vector)
-- Fix: Restrict to service_role or admin users only
--
-- Related Issue: P0-005
-- Risk: Any user could spam notifications to other users
-- ============================================

-- ============================================
-- PART 1: FIX NOTIFICATION INSERT POLICY
-- ============================================

-- Drop the vulnerable permissive policy
DROP POLICY IF EXISTS "System insert notifications" ON notifications;

-- Create secure policy: Only service_role (backend) or admins can insert
CREATE POLICY "System insert notifications" ON notifications
    FOR INSERT WITH CHECK (
        -- Allow Supabase service role (backend operations, Edge Functions, webhooks)
        auth.role() = 'service_role'
        OR
        -- Allow admins to send notifications (via admin dashboard)
        is_admin()
    );

-- ============================================
-- PART 2: FIX AUDIT LOG INSERT POLICY (Same Issue)
-- ============================================

-- Drop the vulnerable permissive policy
DROP POLICY IF EXISTS "Service insert audit logs" ON audit_logs;

-- Create secure policy: Only service_role or admins can insert
CREATE POLICY "Service insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (
        -- Allow Supabase service role (backend operations)
        auth.role() = 'service_role'
        OR
        -- Allow admins to create audit entries
        is_admin()
    );

-- ============================================
-- PART 3: VERIFICATION QUERIES
-- ============================================
-- After running this migration, verify with:
--
-- 1. Check notification policies:
--    SELECT * FROM pg_policies WHERE tablename = 'notifications';
--
-- 2. Check audit_log policies:
--    SELECT * FROM pg_policies WHERE tablename = 'audit_logs';
--
-- 3. Test as regular user (should FAIL):
--    INSERT INTO notifications (user_id, title, message)
--    VALUES ('some-uuid', 'Test', 'Should fail');
--
-- ============================================
-- NOTES
-- ============================================
--
-- Why service_role OR is_admin()?
--
-- 1. service_role: Required for backend operations (Edge Functions, webhooks,
--    triggers, scheduled jobs) that need to send system notifications
--
-- 2. is_admin(): Required for admin dashboard features where admins send
--    notifications to users (e.g., announcement broadcasts, payment confirmations)
--
-- This prevents regular users from:
-- - Spamming other users with fake notifications
-- - Creating phishing notifications
-- - Flooding the notifications table (DoS vector)
--
-- ============================================