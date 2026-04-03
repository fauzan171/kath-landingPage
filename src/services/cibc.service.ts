// ============================================
// CIBC Competition Service
// ============================================
// DEPRECATED: This file is now a re-export layer for backward compatibility.
// All services are now in supabase.service.ts
//
// Issue #4: MERGED with supabase.service.ts
// - All services now come from supabase.service.ts
// - Types are imported from @/lib/supabase
// - This file is kept for backward compatibility only
// ============================================

// Re-export types from lib/supabase for backward compatibility
export type {
  Competition,
  Stage,
  Task,
  Team,
  TeamMember,
  Submission,
  Announcement,
} from '@/lib/supabase';

// Re-export additional types from supabase.service.ts
export type {
  Notification,
  CIBCContent,
  PaymentUploadResult,
} from './supabase.service';

// Re-export all services from supabase.service.ts
export {
  supabaseAuthService,
  supabaseCompetitionService,
  supabaseStageService,
  supabaseTaskService,
  supabaseTeamService,
  supabaseSubmissionService,
  supabaseAnnouncementService,
  supabaseNotificationService,
  supabaseContentService,
  supabasePaymentService,
  uploadPaymentProof,
  supabaseServices,
} from './supabase.service';

// Create named service aliases for backward compatibility
// These match the old naming convention from cibc.service.ts
import {
  supabaseCompetitionService,
  supabaseStageService,
  supabaseTaskService,
  supabaseTeamService,
  supabaseSubmissionService,
  supabaseAnnouncementService,
  supabaseNotificationService,
  supabaseContentService,
  supabasePaymentService,
} from './supabase.service';

// Export with old names for backward compatibility
export const competitionService = supabaseCompetitionService;
export const stagesService = supabaseStageService;
export const tasksService = supabaseTaskService;
export const teamsService = supabaseTeamService;
export const submissionsService = supabaseSubmissionService;
export const announcementsService = supabaseAnnouncementService;
export const notificationsService = supabaseNotificationService;
export const cibcContentService = supabaseContentService;
export const paymentService = supabasePaymentService;

// Combined service object for backward compatibility
import { supabaseServices } from './supabase.service';

export const cibcService = supabaseServices;
export default cibcService;