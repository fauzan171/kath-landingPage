-- ============================================
-- ⚠️ DEPRECATED - DO NOT USE
-- ============================================
-- This file is DEPRECATED. The judge_assignments table is now included in:
-- supabase/migrations/v6.0.0-final-schema.sql
-- with proper RLS policies.
--
-- @deprecated Use supabase/migrations/v6.0.0-final-schema.sql instead
-- ============================================

-- ============================================
-- CIBC Competition Platform - Judge Assignments Table
-- ============================================
-- Run this in Supabase SQL Editor
-- This creates the judge_assignments table for Phase 3
-- ============================================

-- Create judge_assignments table
CREATE TABLE IF NOT EXISTS judge_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judge_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(judge_id, submission_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_judge_assignments_judge ON judge_assignments(judge_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_submission ON judge_assignments(submission_id);
CREATE INDEX IF NOT EXISTS idx_judge_assignments_status ON judge_assignments(status);

-- Enable RLS
ALTER TABLE judge_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Judges can read their own assignments
CREATE POLICY "Judges can read own assignments" ON judge_assignments
  FOR SELECT USING (auth.uid() = judge_id);

-- Admins can do everything (via service role or if we add admin check)
-- For now, allow all for development
CREATE POLICY "Allow all for development" ON judge_assignments
  FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON judge_assignments TO authenticated;
GRANT ALL ON judge_assignments TO anon;

-- ============================================
-- DONE!
-- ============================================
-- After running this, judge_assignments table is ready