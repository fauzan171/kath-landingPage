// ============================================
// CIBC Mock Data - STUB FILE
// ============================================
// This file provides stub implementations for backward compatibility.
//
// TODO: Remove this file and migrate all imports to use Supabase services
// ============================================

/**
 * Initialize CIBC Data - DEPRECATED
 * Data is now managed by Supabase
 */
export function initializeCIBCData() {
  console.log('[CIBC] Data initialized via Supabase');
  // No-op - data is now in Supabase
}

/**
 * Get CIBC Competition - DEPRECATED
 * Use supabaseCompetitionService.getActive() instead
 */
export function getCIBCCompetition() {
  console.warn('[cibcMockData] getCIBCCompetition is deprecated. Use competitionService.getActive() instead.');
  return null;
}

// Re-export types from supabase for backward compatibility
export type {
  Competition,
  Team,
  TeamMember,
  Submission,
  Announcement,
  Stage,
  Task,
} from '@/lib/supabase';

// Mock data arrays (empty - use Supabase instead)
export const mockCompetitions: any[] = [];
export const mockTeams: any[] = [];
export const mockSubmissions: any[] = [];
export const mockAnnouncements: any[] = [];