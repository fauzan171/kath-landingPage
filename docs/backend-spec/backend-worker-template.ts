// ============================================
// CLOUDFLARE WORKER TEMPLATE - ADMIN DASHBOARD API
// ============================================
// File: src/index.ts (for wrangler project)

import { Router } from './router';
import { authMiddleware } from './middleware/auth';
import { competitionContextMiddleware } from './middleware/competition';
import * as authController from './controllers/auth';
import * as competitionController from './controllers/competitions';
import * as stageController from './controllers/stages';
import * as taskController from './controllers/tasks';
import * as teamController from './controllers/teams';
import * as submissionController from './controllers/submissions';
import * as dashboardController from './controllers/dashboard';
import * as announcementController from './controllers/announcements';

// ============================================
// ENVIRONMENT BINDINGS
// ============================================

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ADMIN_BUCKET: R2Bucket;
}

// ============================================
// MAIN WORKER
// ============================================

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const router = new Router();
    
    // CORS handling
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // ============================================
    // PUBLIC ROUTES
    // ============================================
    
    // Auth
    router.post('/api/v1/auth/login', authController.login);
    router.post('/api/v1/auth/logout', authController.logout);
    router.post('/api/v1/auth/refresh', authController.refresh);
    
    // Public competition data (for frontend)
    router.get('/api/v1/public/competitions', competitionController.listPublic);
    router.get('/api/v1/public/competitions/:id', competitionController.getPublic);
    router.get('/api/v1/public/competitions/:id/timeline', competitionController.getTimeline);
    router.get('/api/v1/public/competitions/:id/faqs', competitionController.getFAQs);
    
    // ============================================
    // PROTECTED ROUTES (Require Auth)
    // ============================================
    
    router.use('/api/v1/admin/*', authMiddleware);
    
    // Admin Auth
    router.get('/api/v1/admin/auth/me', authController.getMe);
    router.post('/api/v1/admin/auth/context', authController.setContext);
    
    // ============================================
    // COMPETITION CONTEXT ROUTES
    // (Require competition_id in JWT)
    // ============================================
    
    router.use('/api/v1/admin/competitions/:id/*', competitionContextMiddleware);
    
    // Competitions (Super Admin)
    router.get('/api/v1/admin/competitions', competitionController.list);
    router.post('/api/v1/admin/competitions', competitionController.create);
    router.get('/api/v1/admin/competitions/:id', competitionController.get);
    router.patch('/api/v1/admin/competitions/:id', competitionController.update);
    router.delete('/api/v1/admin/competitions/:id', competitionController.remove);
    
    // Dashboard
    router.get('/api/v1/admin/dashboard/stats', dashboardController.getStats);
    router.get('/api/v1/admin/dashboard/activities', dashboardController.getActivities);
    router.get('/api/v1/admin/dashboard/timeline', dashboardController.getTimeline);
    
    // Stages
    router.get('/api/v1/admin/stages', stageController.list);
    router.post('/api/v1/admin/stages', stageController.create);
    router.get('/api/v1/admin/stages/:id', stageController.get);
    router.patch('/api/v1/admin/stages/:id', stageController.update);
    router.delete('/api/v1/admin/stages/:id', stageController.remove);
    router.post('/api/v1/admin/stages/:id/activate', stageController.activate);
    router.post('/api/v1/admin/stages/:id/deactivate', stageController.deactivate);
    
    // Tasks
    router.get('/api/v1/admin/tasks', taskController.list);
    router.post('/api/v1/admin/stages/:stageId/tasks', taskController.create);
    router.get('/api/v1/admin/tasks/:id', taskController.get);
    router.patch('/api/v1/admin/tasks/:id', taskController.update);
    router.delete('/api/v1/admin/tasks/:id', taskController.remove);
    router.post('/api/v1/admin/tasks/:id/publish', taskController.publish);
    router.post('/api/v1/admin/tasks/:id/unpublish', taskController.unpublish);
    
    // Teams
    router.get('/api/v1/admin/teams', teamController.list);
    router.post('/api/v1/admin/teams', teamController.create);
    router.get('/api/v1/admin/teams/:id', teamController.get);
    router.patch('/api/v1/admin/teams/:id', teamController.update);
    router.patch('/api/v1/admin/teams/:id/status', teamController.updateStatus);
    router.delete('/api/v1/admin/teams/:id', teamController.remove);
    router.post('/api/v1/admin/teams/:id/members', teamController.addMember);
    router.delete('/api/v1/admin/teams/:id/members/:memberId', teamController.removeMember);
    
    // Submissions
    router.get('/api/v1/admin/submissions', submissionController.list);
    router.get('/api/v1/admin/submissions/:id', submissionController.get);
    router.post('/api/v1/admin/submissions/:id/grade', submissionController.grade);
    router.patch('/api/v1/admin/submissions/:id/status', submissionController.updateStatus);
    router.get('/api/v1/admin/submissions/export', submissionController.export);
    router.get('/api/v1/admin/tasks/:taskId/submissions', submissionController.listByTask);
    
    // Announcements
    router.get('/api/v1/admin/announcements', announcementController.list);
    router.post('/api/v1/admin/announcements', announcementController.create);
    router.get('/api/v1/admin/announcements/:id', announcementController.get);
    router.patch('/api/v1/admin/announcements/:id', announcementController.update);
    router.post('/api/v1/admin/announcements/:id/publish', announcementController.publish);
    router.delete('/api/v1/admin/announcements/:id', announcementController.remove);
    
    // Reports
    router.get('/api/v1/admin/reports/standings', dashboardController.getStandings);
    router.get('/api/v1/admin/reports/submissions', dashboardController.getSubmissionStats);
    router.get('/api/v1/admin/reports/progress', dashboardController.getProgress);
    router.get('/api/v1/admin/reports/export', dashboardController.exportFull);
    
    // Settings
    router.get('/api/v1/admin/settings', competitionController.getSettings);
    router.patch('/api/v1/admin/settings', competitionController.updateSettings);
    router.get('/api/v1/admin/settings/judges', competitionController.getJudges);
    router.post('/api/v1/admin/settings/judges', competitionController.addJudge);
    router.delete('/api/v1/admin/settings/judges/:userId', competitionController.removeJudge);
    
    // File uploads
    router.post('/api/v1/admin/upload', submissionController.uploadFile);
    
    // Handle request
    return router.handle(request, env, ctx);
  }
};

// ============================================
// CORS HANDLER
// ============================================

function handleCORS(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// ============================================
// ROUTER UTILITY CLASS
// ============================================

class Router {
  private routes: Array<{
    method: string;
    pattern: URLPattern;
    handler: Function;
    middlewares: Function[];
  }> = [];
  
  private globalMiddlewares: Function[] = [];

  use(pattern: string, ...middlewares: Function[]) {
    if (pattern === '*') {
      this.globalMiddlewares.push(...middlewares);
    } else {
      this.globalMiddlewares.push(...middlewares);
    }
  }

  get(path: string, handler: Function, ...middlewares: Function[]) {
    this.addRoute('GET', path, handler, middlewares);
  }

  post(path: string, handler: Function, ...middlewares: Function[]) {
    this.addRoute('POST', path, handler, middlewares);
  }

  put(path: string, handler: Function, ...middlewares: Function[]) {
    this.addRoute('PUT', path, handler, middlewares);
  }

  patch(path: string, handler: Function, ...middlewares: Function[]) {
    this.addRoute('PATCH', path, handler, middlewares);
  }

  delete(path: string, handler: Function, ...middlewares: Function[]) {
    this.addRoute('DELETE', path, handler, middlewares);
  }

  private addRoute(method: string, path: string, handler: Function, middlewares: Function[]) {
    const pattern = new URLPattern({ pathname: path });
    this.routes.push({ method, pattern, handler, middlewares });
  }

  async handle(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    for (const route of this.routes) {
      const match = route.pattern.exec(url);
      if (match && route.method === request.method) {
        const params = match.pathname.groups;
        
        // Run global middlewares
        for (const mw of this.globalMiddlewares) {
          const result = await mw(request, env, ctx);
          if (result) return result; // Middleware returned early
        }
        
        // Run route-specific middlewares
        for (const mw of route.middlewares) {
          const result = await mw(request, env, ctx);
          if (result) return result;
        }
        
        // Run handler
        return await route.handler(request, env, ctx, params);
      }
    }
    
    return jsonResponse({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function parseBody<T>(request: Request): Promise<T> {
  try {
    return await request.json() as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}
