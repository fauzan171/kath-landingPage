-- ============================================
-- ⚠️ DEPRECATED - DO NOT USE
-- ============================================
-- This file is DEPRECATED. All columns are now included in:
-- supabase/migrations/v6.0.0-final-schema.sql
--
-- @deprecated Use supabase/migrations/v6.0.0-final-schema.sql instead
-- ============================================

-- ============================================
-- Add Missing Columns to Users Table
-- ============================================
-- Run this in Supabase SQL Editor to add missing columns
-- that are needed by AdminUserApproval.tsx
-- ============================================

-- Add rejection_reason column
ALTER TABLE users
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add is_verified column
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- ============================================
-- Create Storage Bucket for Payments
-- ============================================
-- Run this in Supabase Storage section or via SQL

-- Insert storage bucket (if using SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payments', 'payments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy to allow authenticated users to upload
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payments');

-- Storage policy to allow public read
CREATE POLICY "Public can view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payments');

-- ============================================
-- Verify Current User Status
-- ============================================
-- Check if user status is actually 'approved'
SELECT id, email, name, status, created_at
FROM users
WHERE status = 'approved';

-- Check pending users
SELECT id, email, name, status, created_at
FROM users
WHERE status = 'pending'
ORDER BY created_at DESC;