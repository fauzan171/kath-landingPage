---
name: supabase-dev
description: Supabase database operations, SQL migration management, and schema validation for the KATH platform. Use when: (1) Creating or updating SQL migrations, (2) Validating RLS policies, (3) Checking schema consistency between TypeScript types and database, (4) Debugging Supabase query issues, (5) Adding new tables/columns/constraints, (6) Testing database operations. Always reference schema.md and services.md for current state.
---

# Supabase Development

## Pre-flight Checklist

Before ANY database change:
1. Read `references/schema.md` for current table definitions
2. Read the canonical migration `supabase/migrations/v6.0.0-final-schema.sql` to verify actual schema
3. Check existing RLS policies in the migration file
4. Verify TypeScript types in `src/types/index.ts` and `src/lib/supabase.ts` align with schema

## SQL Migration Rules

### Naming Convention
- `v{MAJOR}.{MINOR}.{PATCH}-{descriptive-name}.sql`
- Example: `v6.3.0-public-read-stages.sql`

### Migration Template
```sql
-- Migration: v{VERSION}-{name}
-- Description: {what this migration does}
-- Author: {who}
-- Date: {date}

-- ===== SAFETY CHECKS =====
DO $$
BEGIN
  -- Add any preconditions here
  RAISE NOTICE 'Starting migration: v{VERSION}-{name}';
END$$;

-- ===== CHANGES =====
-- Add your DDL/DML here

-- ===== VERIFICATION =====
DO $$
BEGIN
  RAISE NOTICE 'Migration v{VERSION}-{name} completed successfully';
END$$;
```

### RLS Policy Rules
1. **Always use `is_admin()` helper** for admin checks - never inline role checks
2. **Public read** only for data that should be visible to anonymous users (active competitions, visible stages)
3. **Authenticated read** for data that requires login (teams, submissions)
4. **Role-specific write** - only admins can CRUD most tables, participants can create/update their own data
5. **Never drop existing policies** without replacing them - use `DROP POLICY IF EXISTS` + `CREATE POLICY`

### Schema Change Rules
1. **Additive only** - never remove columns in new migrations, only add
2. **Nullable by default** - new columns should be nullable or have defaults
3. **Foreign keys** - always reference valid table with `ON DELETE CASCADE` or `ON DELETE SET NULL`
4. **Constraints** - add `IF NOT EXISTS` checks
5. **Indexes** - add for any new column used in WHERE clauses

## Service Layer Integration

### Adding a new service method
1. Check `references/services.md` for existing methods
2. Add method to the appropriate service in `src/services/supabase.service.ts`
3. Follow the pattern: `async methodName(params): Promise<ApiResponse<T>>`
4. Always handle both Supabase and mock modes
5. Add proper error logging with `console.error`

### Adding a new table
1. Create migration SQL in `supabase/migrations/`
2. Add TypeScript type to BOTH `src/types/index.ts` AND `src/lib/supabase.ts`
3. Add RLS policies in the same migration
4. Add service methods in `src/services/supabase.service.ts`
5. Update `references/schema.md` with new table

## QA Testing for Database Changes

After every schema change:
1. Run `npx tsc --noEmit` - verify TypeScript types compile
2. Run `npm run build` - verify production build succeeds
3. Check that all existing tests pass: `npx vitest run`
4. Verify RLS policies don't break existing queries by checking service methods
5. If adding new columns, verify all SELECT queries that use `SELECT *` will include them

## Common Patterns

### Query with RLS-safe public access
```typescript
const { data, error } = await supabase
  .from('stages')
  .select('*')
  .eq('competition_id', competitionId)
  .eq('is_visible', true);
```

### File upload to Supabase Storage
```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`path/${fileName}`, file);

const { data: { publicUrl } } = supabase.storage
  .from('bucket-name')
  .getPublicUrl(`path/${fileName}`);
```

### Real-time subscription
```typescript
const channel = supabase
  .channel('channel-name')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'stages' },
    (payload) => { /* handle */ }
  )
  .subscribe();

// Cleanup on unmount
return () => { supabase.removeChannel(channel); };
```
