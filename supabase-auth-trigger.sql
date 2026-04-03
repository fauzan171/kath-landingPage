-- ============================================
-- ⚠️ DEPRECATED - DO NOT USE
-- ============================================
-- This file is DEPRECATED. The auth trigger is now included in:
-- supabase/migrations/v6.0.0-final-schema.sql
--
-- @deprecated Use supabase/migrations/v6.0.0-final-schema.sql instead
-- ============================================

-- ============================================
-- Supabase Auth Trigger - Auto Create public.users
-- ============================================
-- Run this in Supabase SQL Editor
-- This trigger automatically creates a public.users entry
-- when a new user signs up via Supabase Auth
-- ============================================

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users when auth.users is created
  INSERT INTO public.users (id, email, name, status, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'pending',  -- Requires admin approval
    false       -- Not verified yet
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ============================================
-- DONE!
-- ============================================
-- After running this:
-- 1. When user signs up via Supabase Auth, public.users is auto-created
-- 2. User status is 'pending' (needs admin approval)
-- 3. Registration flow will work without foreign key errors