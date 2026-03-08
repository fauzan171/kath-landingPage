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

// Services
export { portfolioService, getPortfolio, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio, getPortfolioCategories } from './portfolio.service';
export { newsService, getNews, getNewsBySlug, getNewsById, createNews, updateNews, deleteNews, getNewsCategories } from './news.service';
export { competitionService, getCompetitions, getMainCompetition, getCompetitionById, createCompetition, updateCompetition, deleteCompetition, registerToCompetition } from './competition.service';
export { featuredEventService, getFeaturedEvents, getFeaturedEventById, createFeaturedEvent, updateFeaturedEvent, deleteFeaturedEvent, reorderFeaturedEvents } from './featured-event.service';
export { authService, login, logout, refreshToken, getCurrentUser, isAuthenticated } from './auth.service';