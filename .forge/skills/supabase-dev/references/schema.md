# Supabase Database Schema Reference

## Tables Overview

### users
- `id` UUID PK (references auth.users)
- `email`, `name`, `phone`, `avatar_url`
- `institution`, `country`, `category`
- `status` (pending/approved/rejected)
- `role` (participant/admin/super_admin/finance_admin/judge)
- `rejection_reason`, `last_login_at`, `created_at`, `updated_at`
- `force_password_change` BOOLEAN, `temp_password_set_at` TIMESTAMP

### competitions
- `id` UUID PK
- `code` UNIQUE (e.g., 'cibc-2026')
- `name`, `name_id`, `description`, `description_id`
- `status` (draft/upcoming/active/completed)
- `registration_start/end`, `competition_start/end`
- `is_active`, `config` JSONB
- `created_at`, `updated_at`

### teams
- `id` UUID PK
- `competition_id` FK, `name`, `code` UNIQUE
- `category`, `institution`
- `status` (draft/pending/verified/rejected)
- `payment_status` (unpaid/pending/verified/rejected)
- `payment_proof`, `payment_drive_id`
- `verified_by`, `verified_at`, `created_at`, `updated_at`

### team_members
- `id` UUID PK
- `team_id` FK, `user_id` FK
- `full_name`, `email`, `phone`, `institution`
- `role` (leader/member/mentor), `is_active`, `joined_at`

### stages
- `id` UUID PK
- `competition_id` FK
- `name`, `name_id`, `description`
- `order_index`, `start_date`, `end_date`
- `status` (draft/upcoming/active/completed)
- `is_active`, `created_at`

### tasks
- `id` UUID PK
- `stage_id` FK, `competition_id` FK
- `name`, `name_id`, `description`, `type`
- `is_required`, `is_published`, `max_score`
- `created_at`

### submissions
- `id` UUID PK
- `task_id` FK, `team_id` FK, `competition_id` FK
- `file_url`, `file_name`, `file_size`
- `drive_file_id`, `link_url`, `content`
- `status` (draft/submitted/under_review/graded)
- `total_score`, `feedback`
- `submitted_at`, `created_at`, `updated_at`

### judge_scores
- `id` UUID PK
- `judge_id` FK, `submission_id` FK
- `score`, `feedback`
- `created_at`
- UNIQUE(judge_id, submission_id)

### judge_assignments
- `id` UUID PK
- `competition_id` FK, `judge_id` FK, `submission_id` FK, `stage_id` FK
- `status` (pending/in_progress/completed/recused)
- `assigned_by`, `assigned_at`, `completed_at`
- `notes`, `created_at`, `updated_at`
- UNIQUE(judge_id, submission_id)

### announcements
- `id` UUID PK, `competition_id` FK
- `title`, `title_id`, `content`, `content_id`
- `type`, `is_published`, `published_at`, `created_at`

### notifications
- `id` UUID PK, `user_id` FK
- `title`, `message`, `type`, `link`
- `is_read`, `created_at`

### news
- `id` UUID PK
- `title`, `title_id`, `content`, `content_id`
- `image_url`, `is_published`, `published_at`, `created_at`

### audit_logs
- `id` UUID PK, `user_id` FK
- `action`, `entity_type`, `entity_id`
- `details` JSONB, `ip_address`, `user_agent`, `created_at`

## RLS Helper Functions
- `is_admin()` - checks user role is admin/super_admin
- `is_judge()` - checks user role is judge
- `is_team_member(team_uuid)` - checks if current user is active team member
- `is_team_leader(team_uuid)` - checks if current user is team leader

## Key Constraints
- judge_scores: UNIQUE(judge_id, submission_id) - one score per judge per submission
- judge_assignments: UNIQUE(judge_id, submission_id) - one assignment per judge per submission
- teams: code is UNIQUE
- competitions: code is UNIQUE

## Migration File Locations
- Canonical schema: `supabase/migrations/v6.0.0-final-schema.sql`
- RLS fix: `supabase/migrations/v6.3.0-public-read-stages.sql`
- Password reset: `supabase/migrations/v6.2.0-password-reset-flow.sql`
