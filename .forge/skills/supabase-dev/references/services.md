# Service Layer Reference

## Location: `src/services/supabase.service.ts`

## Services Available

### supabaseAuthService (lines 28-134)
- `signUp(email, password, userData)` - Register
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getSession()` - Get current session
- `getCurrentUser()` - Get auth user with profile
- `isAuthenticated()` - Check auth status
- `resetPassword(email)` - Send reset email
- `updatePassword(newPassword)` - Update password

### supabaseCompetitionService (lines 151-453)
- `getCompetition()` - Get CIBC 2026 by code 'cibc-2026'
- `getActive()` - Get active CIBC 2026
- `getStats()` - Team/submission counts
- `getByCode(code)` - Lookup by code
- `getById(id)` - Lookup by ID
- `update(id, data)` - Update competition (admin)
- `getTimeline(competitionId)` - Stages + tasks with progress
- `getActiveStage(competitionId)` - Currently active stage
- `activateStage(stageId, competitionId)` - Activate a stage
- `updateStage(stageId, data)` - Update stage dates

### supabaseStageService (lines 459-557)
- `getByCompetition(competitionId)` - All stages for competition
- `getVisible(competitionId)` - Visible stages only
- `getAll(competitionId)` - All stages (admin)
- `getById(id)` - Single stage
- `create(data)` - Create stage
- `update(id, data)` - Update stage
- `delete(id)` - Delete stage

### supabaseTaskService (lines 563-676)
- `getByStage(stageId)` - Tasks for a stage
- `getPublished(stageId)` - Published tasks only
- `getAll(competitionId)` - All tasks (admin)
- `getByCompetition(competitionId)` - Tasks for competition
- `getById(id)` - Single task
- `create(data)` - Create task
- `update(id, data)` - Update task
- `delete(id)` - Delete task

### supabaseTeamService (lines 682-963)
- `getByCompetition(competitionId)` - Teams for competition
- `getAll()` - All teams (admin)
- `getMyTeam(competitionId)` - Current user's team
- `getById(id)` - Team with members
- `create(data)` - Create team
- `update(id, data)` - Update team
- `verify(id)` - Verify team
- `reject(id, reason)` - Reject team
- `addMember(teamId, member)` - Add member
- `removeMember(teamId, userId)` - Remove member
- `updateStatus(id, status)` - Update team status
- `getStats(competitionId)` - Team stats

### supabaseSubmissionService (lines 970-1326)
- `getByCompetition(competitionId)` - Submissions for competition
- `create(data)` - Create submission
- `update(id, data)` - Update submission
- `getByTeam(teamId)` - Team's submissions
- `getMySubmissions(competitionId)` - Current user's submissions
- `getAll()` - All submissions (admin)
- `getByTask(taskId)` - Submissions for task (admin/judge)
- `getById(id)` - Single submission with joins
- `createWithFile(data)` - File upload via n8n
- `createWithContent(data)` - Text/link submission
- `upsert(data)` - Upsert submission
- `submit(id)` - Submit draft
- `updateStatus(id, status)` - Update status
- `grade(id, score, feedback)` - Grade submission
- `getStats(competitionId)` - Submission stats

### supabaseAnnouncementService (lines 1332-1424)
- `getPublished(competitionId)` - Published announcements
- `getAll(competitionId)` - All announcements (admin)
- `create(data)` - Create announcement
- `publish(id)` - Publish announcement
- `update(id, data)` - Update announcement
- `delete(id)` - Delete announcement

### supabaseNotificationService (lines 1441-1518)
- `getMy()` - Current user's notifications
- `markRead(id)` - Mark as read
- `markAllRead()` - Mark all as read
- `getUnreadCount()` - Unread count
- `create(data)` - Create notification

### supabaseContentService (lines 1532-1578)
- `getSection(section)` - Get content section
- `getAll()` - All content sections
- `update(section, data)` - Update content section

### supabasePaymentService (lines 1692-1893)
- `uploadProof(teamId, file)` - Upload payment proof
- `updateTeamPayment(teamId, data)` - Update payment
- `getPendingPayments()` - Pending payments (admin)
- `getAllPayments()` - All payments (admin)
- `verifyPayment(teamId, adminId)` - Verify payment
- `rejectPayment(teamId, adminId, reason)` - Reject payment
- `getPaymentStats()` - Payment stats

## Low-level Helpers (src/lib/supabase.ts)
- `uploadFileToDrive(file, folder)` - Upload via n8n webhook to Google Drive
- `createSubmission(data)` - Direct submission creation
- `getTeamSubmissions(teamId)` - Direct team submissions query
- `getSubmissionById(id)` - Direct submission query
- `getCompetitionByCode(code)` - Direct competition query
- `getActiveCompetitions()` - Active competitions query
- `getCompetitionStages(competitionId)` - Direct stages query
- `getStageTasks(stageId)` - Direct tasks query
- `createTeam(data)` - Direct team creation
- `addTeamMember(teamId, member)` - Direct member addition
- `getTeamById(id)` - Direct team query
- `getPublishedAnnouncements(competitionId)` - Direct announcements query

## Deprecated (src/services/cibc.service.ts)
Re-export aliases: `competitionService`, `teamsService`, `stagesService`, `tasksService`, `submissionsService`
Use `supabase*Service` directly instead.
