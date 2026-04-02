/**
 * Service Factory
 *
 * Provides unified interface for switching between
 * mock, localStorage, and Supabase implementations
 *
 * Architecture:
 * - CIBC Dashboard: Supabase + Google Drive + n8n
 * - KATH Landing Page: localStorage (demo mode)
 *
 * UPDATED:
 * - Issue #1: Auth service now uses Supabase directly
 * - Issue #2: Competition service now uses localStorage
 * - Issue #3: Service Factory logic simplified
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
 *
 * Service Sources:
 * 1. Auth: Supabase Auth (auth.service.ts)
 * 2. CIBC Services: Supabase (supabase.service.ts)
 * 3. KATH Services: localStorage or mock (competition.service.ts, mockData.ts)
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
   * Get service implementation based on type
   *
   * Routing Logic:
   * - auth: Always uses auth.service.ts (Supabase Auth)
   * - CIBC services (stage, task, announcement): Supabase only
   * - KATH services (competition, portfolio, news): localStorage
   * - Shared services (team, submission): Supabase or mock
   */
  async getService(type: ServiceType) {
    const useMock = env.useMockData;
    const useSupabase = isSupabaseConfigured();

    // ============================================
    // AUTH SERVICE - Supabase Auth
    // ============================================
    // FIXED: Issue #1 - Auth now uses Supabase Auth directly
    if (type === 'auth') {
      const auth = await import('./auth.service');
      return auth.authService;
    }

    // ============================================
    // KATH LANDING PAGE SERVICES - localStorage
    // ============================================
    // FIXED: Issue #2 - Competition now uses localStorage
    // These services are for the KATH Landing Page demo
    switch (type) {
      case 'competition':
        // Competition service uses localStorage (no REST API)
        return (await import('./competition.service')).competitionService;
      case 'portfolio':
        return (await import('./portfolio.service')).portfolioService;
      case 'news':
        return (await import('./news.service')).newsService;
    }

    // ============================================
    // CIBC DASHBOARD SERVICES - Supabase
    // ============================================
    // These services require Supabase configuration
    if (useSupabase) {
      const supabase = await import('./supabase.service');
      const { supabaseServices } = supabase;

      switch (type) {
        case 'stage':
          return supabaseServices.stage;
        case 'task':
          return supabaseServices.task;
        case 'announcement':
          return supabaseServices.announcement;
        case 'team':
          return supabaseServices.team;
        case 'submission':
          return supabaseServices.submission;
      }
    }

    // ============================================
    // FALLBACK SERVICES - Mock or Error
    // ============================================
    // For services that don't have Supabase implementations
    switch (type) {
      case 'team':
        if (useMock) {
          const m = await import('./mockData');
          return m.teamService;
        }
        throw new Error('Team service requires Supabase configuration');
      case 'submission':
        if (useMock) {
          const m = await import('./mockData');
          return m.submissionService;
        }
        throw new Error('Submission service requires Supabase configuration');
      case 'notification':
        if (useMock) {
          const m = await import('./mockData');
          return m.notificationService;
        }
        throw new Error('Notification service requires mock mode or Supabase');
      case 'profile':
        if (useMock) {
          const m = await import('./mockData');
          return m.profileService;
        }
        throw new Error('Profile service requires mock mode');
      case 'settings':
        if (useMock) {
          const m = await import('./mockData');
          return m.settingsService;
        }
        throw new Error('Settings service requires mock mode');
      case 'stage':
        throw new Error('Stage service requires Supabase configuration');
      case 'task':
        throw new Error('Task service requires Supabase configuration');
      case 'announcement':
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