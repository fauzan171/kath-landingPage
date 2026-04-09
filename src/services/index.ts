// API Configuration
export { get, post, put, del, uploadFile, API_BASE_URL } from './api';
export type { ApiResponse, ApiError } from './api';

// Types
export type {
  // Portfolio
  PortfolioItem,
  PortfolioFormData,
  PortfolioQueryParams,
  // News
  NewsItem,
  NewsFormData,
  NewsQueryParams,
  // Competition
  Competition,
  MainCompetition,
  CompetitionCategory,
  CompetitionFormData,
  CompetitionQueryParams,
  RegistrationFormData,
  CompetitionRegistration,
  CompetitionTimeline,
  CompetitionJudge,
  // Featured Event
  FeaturedEvent,
  FeaturedEventFormData,
  // Auth
  LoginCredentials,
  AuthUser,
  AuthTokens,
  LoginResponse,
  // Upload
  UploadResponse,
  // Common
  PaginationParams,
} from './types';

// Services (Legacy - KATH Landing Page)
export { portfolioService, getPortfolio, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio, getPortfolioCategories } from './portfolio.service';
export { newsService, getNews, getNewsBySlug, getNewsById, createNews, updateNews, deleteNews, getNewsCategories } from './news.service';
export { competitionService, getCompetitions, getMainCompetition, getCompetitionById, createCompetition, updateCompetition, deleteCompetition, registerToCompetition } from './competition.service';
export { featuredEventService, getFeaturedEvents, getFeaturedEventById, createFeaturedEvent, updateFeaturedEvent, deleteFeaturedEvent, reorderFeaturedEvents } from './featured-event.service';
export {
  authService,
  login,
  logout,
  refreshToken,
  resetPassword,
  updatePassword,
  register,
  getCurrentUser,
  getCurrentUserAsync,
  getSession,
  isAuthenticated,
  isAuthenticatedAsync,
} from './auth.service';

// Service Factory
export { ServiceFactory, getService, isCIBCDashboardAvailable } from './service.factory';
export type { ServiceType } from './service.factory';

// ============================================
// CIBC Dashboard - Supabase Services
// ============================================

// Supabase Services
export {
  supabaseServices,
  supabaseAuthService,
  supabaseCompetitionService,
  supabaseStageService,
  supabaseTaskService,
  supabaseTeamService,
  supabaseSubmissionService,
  supabaseAnnouncementService,
  type TimelineStage,
} from './supabase.service';

// News Service (Supabase)
export {
  supabaseNewsService,
  type News,
  type NewsCategory,
  type NewsFormData as CIBCNewsFormData,
  generateSlug,
  getLocalizedTitle,
  getLocalizedExcerpt,
  getLocalizedContent,
  formatNewsDate,
} from './supabaseNews.service';

// Supabase Client & Types
export {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser as getSupabaseUser,
  uploadFileToDrive,
  type User,
  type UserRole,
  type UserRoleAssignment,
  type Competition as CIBCCompetition,
  type Stage,
  type Task,
  type Team,
  type TeamMember,
  type Submission,
  type Announcement,
} from '@/lib/supabase';

// Environment helpers
export { isSupabaseConfigured, isR2StorageConfigured } from '@/config/environment';