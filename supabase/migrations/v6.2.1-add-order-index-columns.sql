-- ============================================
-- Migration: Add ALL missing columns to stages & tasks tables
-- ============================================
-- Jalankan di: Supabase Dashboard → SQL Editor
-- Menyelesaikan error:
--   42703: column stages.is_visible does not exist
--   42703: column tasks.order_index does not exist
-- ============================================

-- ============================================
-- STAGES TABLE: tambah semua kolom yang missing
-- ============================================

ALTER TABLE stages
  ADD COLUMN IF NOT EXISTS order_index    INTEGER          DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_visible     BOOLEAN          DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_active      BOOLEAN          DEFAULT false,
  ADD COLUMN IF NOT EXISTS status         VARCHAR(50)      DEFAULT 'upcoming',
  ADD COLUMN IF NOT EXISTS auto_progress  BOOLEAN          DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_all_tasks BOOLEAN      DEFAULT false,
  ADD COLUMN IF NOT EXISTS start_date     TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS end_date       TIMESTAMP WITH TIME ZONE;

-- ============================================
-- TASKS TABLE: tambah semua kolom yang missing
-- ============================================

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS order_index        INTEGER      DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_published       BOOLEAN      DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_required        BOOLEAN      DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_edit         BOOLEAN      DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_file_size_mb   INTEGER      DEFAULT 10,
  ADD COLUMN IF NOT EXISTS allowed_extensions TEXT[]       DEFAULT ARRAY['pdf','doc','docx'],
  ADD COLUMN IF NOT EXISTS deadline           TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS instructions       TEXT,
  ADD COLUMN IF NOT EXISTS rubric             JSONB        DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS custom_fields      JSONB        DEFAULT '{}';

-- ============================================
-- Set nilai default yang masuk akal
-- ============================================

-- Stages yang sudah ada: set visible = true, order berdasarkan created_at
UPDATE stages
SET
  is_visible = true,
  is_active  = false,
  status     = 'upcoming',
  order_index = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY competition_id ORDER BY created_at) AS rn
  FROM stages
) sub
WHERE stages.id = sub.id AND stages.order_index = 0;

-- Tasks yang sudah ada: set is_published = true (sudah terpublish), order berdasarkan created_at
UPDATE tasks
SET
  is_published = true,
  order_index  = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY stage_id ORDER BY created_at) AS rn
  FROM tasks
) sub
WHERE tasks.id = sub.id AND tasks.order_index = 0;

-- ============================================
-- COMPETITIONS TABLE: kolom yang mungkin missing
-- ============================================

ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS is_active   BOOLEAN  DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_visible  BOOLEAN  DEFAULT true;

UPDATE competitions SET is_active = true, is_visible = true WHERE is_active IS NULL;

-- ============================================
-- SELESAI!
-- Error 42703 pada stages dan tasks sudah teratasi.
-- ============================================
