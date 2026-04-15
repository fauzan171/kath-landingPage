-- ============================================
-- Migration v6.9.0: CIBC Registration Fields
-- ============================================
-- Adds sub_theme and document URL columns to teams table
-- to match the CIBC 2026 registration form requirements
-- ============================================

-- Add sub_theme column for competition theme selection
ALTER TABLE teams ADD COLUMN IF NOT EXISTS sub_theme TEXT;

-- Add document URL columns for registration requirements
ALTER TABLE teams ADD COLUMN IF NOT EXISTS student_cards_url TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS instagram_proof_url TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS twibbon_proof_url TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS bmc_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN teams.sub_theme IS 'Selected sub-theme: Energy, Health, Food, Finance, Beauty, or Manufacture';
COMMENT ON COLUMN teams.student_cards_url IS 'URL to combined PDF of all members student ID cards';
COMMENT ON COLUMN teams.instagram_proof_url IS 'URL to PDF proof of Instagram follow for all members';
COMMENT ON COLUMN teams.twibbon_proof_url IS 'URL to PDF proof of Twibbon posts for all members';
COMMENT ON COLUMN teams.bmc_url IS 'URL to Business Model Canvas PDF document';
