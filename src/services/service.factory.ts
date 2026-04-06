/**
 * Service Factory
 *
 * Provides unified interface for services
 *
 * Architecture:
 * - All services use Supabase directly
 * - No mock data - production ready
 *
 * Services:
 * - Auth: Supabase Auth (auth.service.ts)
 * - CIBC Services: Supabase (supabase.service.ts)
 * - KATH Services: localStorage (competition.service.ts)
 */

import { isSupabaseConfigured } from '../config/environment';

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
   */
  async getService(type: ServiceType) {
    // ============================================
    // AUTH SERVICE - Supabase Auth
    // ============================================
    if (type === 'auth') {
      const auth = await import('./auth.service');
      return auth.authService;
    }

    // ============================================
    // KATH LANDING PAGE SERVICES - localStorage
    // ============================================
    switch (type) {
      case 'competition':
        return (await import('./competition.service')).competitionService;
      case 'portfolio':
        return (await import('./portfolio.service')).portfolioService;
      case 'news':
        return (await import('./news.service')).newsService;
    }

    // ============================================
    // CIBC DASHBOARD SERVICES - Supabase
    // ============================================
    if (!isSupabaseConfigured()) {
      throw new Error(`Service "${type}" requires Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env`);
    }

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
      case 'notification':
        return supabaseServices.notification;
      case 'profile':        // Profile is handled by auth service
        { const auth = await import('./auth.service'); return auth.authService; }
      case 'settings':
        // Settings is handled by auth service
        { const authService = await import('./auth.service'); return authService.authService; }
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