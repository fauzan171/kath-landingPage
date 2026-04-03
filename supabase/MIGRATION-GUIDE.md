# Supabase Schema Migration Guide

## Overview

This document explains how to migrate the CIBC Competition Platform database schema.

## Current Status

### Canonical Schema (USE THIS)
- **`supabase/migrations/v6.0.0-final-schema.sql`** - Complete, production-ready schema

### Migration Files (Apply in Order)
1. `supabase/migrations/v3.0.0-prd-schema.sql` - Original PRD schema
2. `supabase/migrations/v4.0.0-fixed-schema.sql` - Fixed role assignments
3. `supabase/migrations/v5.0.0-rls-policies-fix.sql` - Secure RLS policies
4. `supabase/migrations/v5.1.0-missing-tables.sql` - Additional tables

### Deprecated Files (DO NOT USE)
- `supabase-schema.sql`
- `supabase-schema-safe.sql`
- `supabase-complete-setup.sql`
- `supabase-auth-trigger.sql`
- `supabase-judge-assignments.sql`
- `supabase-add-missing-columns.sql`

## Migration Paths

### Fresh Installation
```bash
# In Supabase SQL Editor, run:
supabase/migrations/v6.0.0-final-schema.sql
```

### Upgrading from v4.0.0
```bash
# Run in order:
1. supabase/migrations/v5.0.0-rls-policies-fix.sql
2. supabase/migrations/v5.1.0-missing-tables.sql
```

### Upgrading from v3.0.0
```bash
# Run in order:
1. supabase/migrations/v4.0.0-fixed-schema.sql
2. supabase/migrations/v5.0.0-rls-policies-fix.sql
3. supabase/migrations/v5.1.0-missing-tables.sql
```

### Full Reset (WARNING: Destroys All Data)
```bash
# Run:
supabase/migrations/v6.0.0-final-schema.sql
# This includes DROP TABLE statements for clean setup
```

## Schema Features

### Tables Included
- `users` - User profiles with roles (participant, admin, super_admin, finance_admin, judge)
- `competitions` - Competition definitions
- `teams` - Team registrations
- `team_members` - Team membership
- `stages` - Competition stages/phases
- `tasks` - Tasks within stages
- `submissions` - Team submissions
- `announcements` - Competition announcements
- `notifications` - User notifications
- `judge_scores` - Judge scoring
- `judge_assignments` - Judge-to-submission assignments
- `audit_logs` - Audit trail
- `news` - Platform news
- `password_reset_tokens` - Password reset tokens

### Security Features
- Row Level Security (RLS) on all tables
- Helper functions: `is_admin()`, `is_judge()`, `is_team_member()`, `is_team_leader()`
- Proper policy-based access control
- Audit logging trigger on users table

### Performance Features
- Indexes on frequently queried columns
- Composite indexes for common filter patterns
- Efficient join indexes

## Post-Installation Setup

### Create Admin User
```sql
-- After signing up via the app, run:
UPDATE users
SET role = 'super_admin', status = 'approved'
WHERE email = 'your-admin@email.com';
```

### Verify RLS Policies
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies WHERE schemaname = 'public';
```

### Test Access Control
```sql
-- Test as participant
SET ROLE authenticated;
SELECT * FROM users;  -- Should only see own row
SELECT * FROM teams;  -- Should only see teams they're member of

-- Test as admin
-- First, set your user as admin, then test
SELECT * FROM users;  -- Should see all users
```

## Troubleshooting

### Foreign Key Errors
Make sure to run the schema in order. The v6.0.0 schema handles dependencies correctly.

### RLS Policy Not Working
1. Ensure RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Check if user has correct role in `users` table
3. Verify `auth.uid()` returns the correct user ID

### Auth Trigger Not Firing
The `handle_new_user()` trigger should auto-create a `users` entry when someone signs up via Supabase Auth. If not working:
1. Check if trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Recreate the trigger from v6.0.0 schema

## Rollback

If you need to rollback, use Supabase's built-in migration system or restore from a backup.

```bash
# Supabase CLI rollback (if using CLI)
supabase db reset --linked

# Or restore from Supabase dashboard backup
```

## Questions?

Contact the development team or refer to:
- PRD: `.agents/PRD-CIBC-Competition-Platform-v3.md`
- Implementation Plan: `FIX-IMPLEMENTATION-PROMPT.md`