/**
 * Service Factory
 *
 * Provides unified interface for switching between
 * mock and real API implementations
 */

import { env } from '../config/environment';

export type ServiceType =
  | 'competition'
  | 'portfolio'
  | 'news'
  | 'auth'
  | 'team'
  | 'submission'
  | 'notification'
  | 'profile'
  | 'settings';

/**
 * Service Factory Class
 *
 * Singleton pattern for service instances
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
   */
  async getService(type: ServiceType) {
    const useMock = env.useMockData;

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
      case 'auth':
        return (await import('./auth.service')).authService;
      case 'team':
        if (useMock) {
          const m = await import('./mockData');
          return m.teamService;
        }
        throw new Error('Team API service not implemented');
      case 'submission':
        if (useMock) {
          const m = await import('./mockData');
          return m.submissionService;
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