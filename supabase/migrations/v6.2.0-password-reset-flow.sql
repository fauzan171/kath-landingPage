-- ============================================
-- Migration: Password Reset Request Flow
-- ============================================
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Tambah kolom ke tabel users
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS temp_password_set_at TIMESTAMP WITH TIME ZONE;

-- 2. Buat tabel password_reset_requests
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'processed' | 'cancelled'
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES users(id),
  notes TEXT
);

-- 3. Enable RLS
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- 4. User bisa INSERT request milik sendiri
CREATE POLICY "Users can create own reset request" ON password_reset_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 5. User bisa baca request milik sendiri
CREATE POLICY "Users can read own reset requests" ON password_reset_requests
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

-- 6. Admin bisa baca semua request
CREATE POLICY "Admins can read all requests" ON password_reset_requests
  FOR SELECT USING (is_admin());

-- 7. Admin bisa UPDATE status request
CREATE POLICY "Admins can update requests" ON password_reset_requests
  FOR UPDATE USING (is_admin());

-- ============================================
-- SELESAI!
-- Setelah ini:
-- 1. Isi VITE_SUPABASE_SERVICE_ROLE_KEY di .env
--    (Ambil dari Supabase Dashboard → Settings → API → service_role key)
-- 2. Restart dev server
-- ============================================
