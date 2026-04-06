---
name: feature-dev
description: Feature development workflow with QA testing for the KATH competition platform. Use when: (1) Implementing new features or pages, (2) Fixing bugs in existing components, (3) Refactoring code, (4) Adding new routes or components. Always follow the implement -> test -> verify cycle. Integrates with supabase-dev skill for database-related features.
---

# Feature Development

## Development Workflow

### Step 1: Understand Requirements
- Read the target file(s) fully before making changes
- Identify all dependencies (imports, services, types)
- Check if Supabase schema changes are needed (use supabase-dev skill)

### Step 2: Plan Changes
- List all files that need modification
- Identify the order of changes (schema first, then types, then services, then UI)
- Check for breaking changes to existing functionality

### Step 3: Implement
- Make changes in dependency order:
  1. SQL migrations (if needed)
  2. TypeScript types (`src/types/index.ts` and `src/lib/supabase.ts`)
  3. Service layer (`src/services/supabase.service.ts`)
  4. Hooks (`src/hooks/`)
  5. Components/Pages (`src/pages/`, `src/sections/`, `src/components/`)
  6. Routes (`src/App.tsx`)

### Step 4: QA Testing
After each feature implementation, run these verification steps:

#### TypeScript Check
```bash
npx tsc --noEmit 2>&1 | head -50
```
**MUST pass with 0 errors before proceeding.**

#### Build Check
```bash
npm run build 2>&1 | tail -20
```
**MUST succeed before proceeding.**

#### Test Suite
```bash
npx vitest run 2>&1 | tail -20
```
**All tests MUST pass.**

#### Manual Verification Checklist
- [ ] Imports resolve correctly
- [ ] No unused variables/imports
- [ ] Types match between service and component
- [ ] Error handling is present for all async operations
- [ ] Loading states are handled in UI
- [ ] Edge cases handled (null, undefined, empty arrays)

## Code Patterns

### Component with Service Integration
```typescript
import { useEffect, useState } from 'react';
import { supabaseXxxService } from '@/services/supabase.service';
import type { Xxxx } from '@/types';

export const MyComponent = () => {
  const [data, setData] = useState<Xxxx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await supabaseXxxService.getAll();
        if (result.data) setData(result.data);
        else setError(result.error?.message || 'Failed to load');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{/* render */}</div>;
};
```

### Form with Validation
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = (): boolean => {
  const newErrors: Record<string, string> = {};
  if (!field.trim()) newErrors.field = 'Field is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;
  // submit logic
};
```

### File Upload Pattern
```typescript
const handleFileUpload = async (file: File) => {
  // Validate
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  if (file.size > maxSize) { setError('File too large'); return; }
  if (!allowedTypes.includes(file.type)) { setError('Invalid file type'); return; }

  // Upload
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('bucket')
    .upload(`submissions/${fileName}`, file);

  if (error) { setError(error.message); return; }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('bucket')
    .getPublicUrl(`submissions/${fileName}`);
};
```

## Route Registration

When adding new pages, register in `src/App.tsx`:
```typescript
// For admin pages (inside AdminLayout):
<Route path="new-page" element={<AdminNewPage />} />

// For public pages:
<Route path="/new-page" element={<NewPage />} />

// For protected pages:
<Route element={<ParticipantRoute />}>
  <Route path="/new-page" element={<NewPage />} />
</Route>
```

## Icon Usage

Icons are re-exported from `src/icons/index.tsx` (wraps lucide-react).
Import from `@/icons` for consistency:
```typescript
import { Trophy, Users, ArrowRight } from '@/icons';
```

## Common Pitfalls

1. **Don't call service methods without required params** - e.g., `getByCompetition(competitionId)` needs the ID
2. **Don't forget loading/error states** - every async operation needs both
3. **Don't hardcode data that should come from Supabase** - use service layer
4. **Don't import from both `@/types` and `@/lib/supabase`** for the same type - pick one
5. **Don't forget to clean up subscriptions** in useEffect return
6. **Don't use `any` type** - use proper types or `unknown`
