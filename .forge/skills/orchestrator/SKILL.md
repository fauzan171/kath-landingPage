---
name: orchestrator
description: Orchestrates multi-task implementation for the KATH competition platform. Coordinates between feature-dev and supabase-dev skills to implement TIER 1 and TIER 2 features systematically. Use when: (1) Implementing multiple related features, (2) Coordinating database + UI changes, (3) Managing a backlog of tasks with dependencies, (4) Running end-to-end QA after batch changes. Tracks progress via todo list and ensures each task is verified before moving to the next.
---

# Orchestrator

## Workflow

### Phase 1: Planning
1. Read all affected files to understand current state
2. Identify dependencies between tasks
3. Order tasks by dependency (schema -> types -> services -> hooks -> components)
4. Create todo list with all tasks

### Phase 2: Execution
For each task:
1. Mark task as `in_progress`
2. Load relevant skill (supabase-dev for DB, feature-dev for UI)
3. Implement the change
4. Run QA verification:
   - `npx tsc --noEmit` (0 errors required)
   - `npm run build` (success required)
   - `npx vitest run` (all pass required)
5. Mark task as `completed`
6. Move to next task

### Phase 3: Final Verification
After all tasks complete:
1. Full TypeScript check
2. Full production build
3. Full test suite
4. Report summary of all changes

## Task Dependency Rules

```
SQL Migration -> TypeScript Types -> Service Methods -> Hooks -> Components/Pages -> Routes
```

Never implement a dependent task before its dependency is complete and verified.

## Current Implementation Backlog

### TIER 1 - Critical (Before Launch)

| # | Task | Dependencies | Status |
|---|---|---|---|
| 1.1 | Fix file upload in SubmissionForm | None | Pending |
| 1.2 | Structured BMC form (9 blocks) | None | Pending |
| 1.3 | Fix judge scoring (judge_scores table) | Schema check | Pending |
| 1.4 | Rubric editor in AdminStages | None | Pending |
| 1.5 | Leaderboard page | None | Pending |
| 1.6 | Terms & Conditions page | None | Pending |
| 1.7 | BMC Template downloadable | None | Pending |

### TIER 2 - Important (Before Final Event)

| # | Task | Dependencies | Status |
|---|---|---|---|
| 2.1 | Expand FAQ to 12+ items | None | Pending |
| 2.2 | Judge profile section on landing page | None | Pending |

## QA Gate Criteria

Every task MUST pass ALL of these before being marked complete:

1. **TypeScript**: `npx tsc --noEmit` returns 0 errors
2. **Build**: `npm run build` completes successfully
3. **Tests**: `npx vitest run` shows all tests passing
4. **No regressions**: Previous functionality still works

If any gate fails:
1. Fix the issue immediately
2. Re-run all QA gates
3. Do not proceed to next task until all gates pass
