/**
 * Service Factory
 *
 * Provides unified interface for switching between
 * mock, API, and Supabase implementations
 *
 * Architecture: Supabase + Google Drive + n8n (100% FREE)
 *
 * UPDATED: Auth service now uses Supabase directly (Issue #1 fixed)
 */

import { env, isSupabaseConfigured } from '../config/environment';

export type ServiceType =
  | 'competition'
  | 'portfolio'
  | 'news'
  | 'auth'
  | 'team'
  | 'submission'
  | 'notification'
  | 'profile'
  | 'settings'
  | 'stage'
  | 'task'
  | 'announcement';

/**
 * Service Factory Class
 *
 * Singleton pattern for service instances
 * Priority: Supabase > Mock > Legacy API (deprecated)
 */
export class ServiceFactory {
  private static instance: ServiceFactory;

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  /**
   * Get service implementation based on environment
   *
   * Priority:
   * 1. Supabase (if configured) - ALWAYS preferred
   * 2. Mock data (if useMockData)
   * 3. Legacy API (deprecated - being phased out)
   */
  async getService(type: ServiceType) {
    const useMock = env.useMockData;
    const useSupabase = isSupabaseConfigured();

    // ============================================
    // AUTH SERVICE - Always uses Supabase
    // ============================================
    // FIXED: Issue #1 - Auth now uses Supabase Auth directly
    if (type === 'auth') {
      // Auth service always uses Supabase when configured
      // This is the ONLY correct implementation for auth
      if (useSupabase) {
        const auth = await import('./auth.service');
        return auth.authService;
      }
      // If Supabase not configured, still return auth service
      // (it will handle the error gracefully)
      const auth = await import('./auth.service');
      return auth.authService;
    }

    // ============================================
    // SUPABASE SERVICES (CIBC Dashboard)
    // ============================================
    // These services ONLY work with Supabase
    if (useSupabase && !useMock) {
      const supabase = await import('./supabase.service');
      const { supabaseServices } = supabase;

      switch (type) {
        case 'competition':
          return supabaseServices.competition;
        case 'stage':
          return supabaseServices.stage;
        case 'task':
          return supabaseServices.task;
        case 'team':
          return supabaseServices.team;
        case 'submission':
          return supabaseServices.submission;
        case 'announcement':
          return supabaseServices.announcement;
      }
    }

    // ============================================
    // LEGACY SERVICES (KATH Landing Page)
    // ============================================
    // These services are being phased out
    // TODO: Move to Supabase implementation
    switch (type) {
      case 'competition':
        if (useMock) {
          const m = await import('./mockData');
          return m.competitionService;
        }
        return (await import('./competition.service')).competitionService;
      case 'portfolio':
        return (await import('./portfolio.service')).portfolioService;
      case 'news':
        return (await import('./news.service')).newsService;
      case 'team':
        if (useMock) {
          const m = await import('./mockData');
          return m.teamService;
        }
        // Fallback to Supabase if available
        if (useSupabase) {
          const supabase = await import('./supabase.service');
          return supabase.supabaseServices.team;
        }
        throw new Error('Team API service not implemented');
      case 'submission':
        if (useMock) {
          const m = await import('./mockData');
          return m.submissionService;
        }
        // Fallback to Supabase if available
        if (useSupabase) {
          const supabase = await import('./supabase.service');
          return supabase.supabaseServices.submission;
        }
        throw new Error('Submission API service not implemented');
      case 'notification':
        if (useMock) {
          const m = await import('./mockData');
          return m.notificationService;
        }
        throw new Error('Notification API service not implemented');
      case 'profile':
        if (useMock) {
          const m = await import('./mockData');
          return m.profileService;
        }
        throw new Error('Profile API service not implemented');
      case 'settings':
        if (useMock) {
          const m = await import('./mockData');
          return m.settingsService;
        }
        throw new Error('Settings API service not implemented');
      case 'stage':
        // Only available via Supabase
        if (useSupabase) {
          const supabase = await import('./supabase.service');
          return supabase.supabaseServices.stage;
        }
        throw new Error('Stage service requires Supabase configuration');
      case 'task':
        // Only available via Supabase
        if (useSupabase) {
          const supabase = await import('./supabase.service');
          return supabase.supabaseServices.task;
        }
        throw new Error('Task service requires Supabase configuration');
      case 'announcement':
        // Only available via Supabase
        if (useSupabase) {
          const supabase = await import('./supabase.service');
          return supabase.supabaseServices.announcement;
        }
        throw new Error('Announcement service requires Supabase configuration');
      default:
        throw new Error(`Unknown service type: ${type}`);
    }
  }
}

/**
 * Convenience function for getting services
 */
export function getService<T extends ServiceType>(type: T) {
  return ServiceFactory.getInstance().getService(type);
}

/**
 * Check if CIBC Dashboard services are available
 */
export function isCIBCDashboardAvailable(): boolean {
  return isSupabaseConfigured();
}