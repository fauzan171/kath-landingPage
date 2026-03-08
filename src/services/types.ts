// ==========================================
// Portfolio Types
// ==========================================

export interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  category: 'All' | 'Wedding' | 'Corporate' | 'Exhibition' | 'Private';
  location: string;
  year: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioFormData {
  image: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description?: string;
}

// ==========================================
// News Types
// ==========================================

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'All' | 'Competition' | 'Announcement' | 'News';
  date: string;
  author: string;
  slug: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  slug: string;
}

// ==========================================
// Competition Types
// ==========================================

export interface CompetitionTimeline {
  phase: string;
  startDate: string;
  endDate: string;
}

export interface CompetitionJudge {
  name: string;
  role: string;
  image: string;
}

export interface CompetitionCategory {
  id: string;
  name: string;
  target: string;
  prize: string;
  status: 'Open' | 'Coming Soon' | 'Closed';
}

export interface Competition {
  id: string;
  name: string;
  target: string;
  prize: string;
  status: 'Open' | 'Coming Soon' | 'Closed';
  deadline: string;
  description: string;
  image?: string;
  requirements?: string[];
  timeline?: CompetitionTimeline[];
  registeredCount?: number;
  maxParticipants?: number;
  judges?: CompetitionJudge[];
  createdAt: string;
  updatedAt: string;
}

export interface MainCompetition {
  name: string;
  deadline: string;
  description: string;
  categories: CompetitionCategory[];
}

export interface CompetitionFormData {
  name: string;
  target: string;
  prize: string;
  status: string;
  deadline: string;
  description: string;
  image?: string;
  requirements?: string[];
}

export interface RegistrationFormData {
  participantName: string;
  email: string;
  phone: string;
  teamName?: string;
  teamMembers?: { name: string; email: string }[];
}

export interface CompetitionRegistration {
  registrationId: string;
  competitionId: string;
  participantName: string;
  status: string;
  registeredAt: string;
}

// ==========================================
// Featured Event Types
// ==========================================

export interface FeaturedEvent {
  id: number;
  image: string;
  title: string;
  description: string;
  rotation: number;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedEventFormData {
  image: string;
  title: string;
  description: string;
  rotation: number;
  category: string;
  order: number;
  isActive: boolean;
}

// ==========================================
// Auth Types
// ==========================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ==========================================
// Query/Filter Types
// ==========================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PortfolioQueryParams extends PaginationParams {
  category?: string;
  year?: string;
}

export interface NewsQueryParams extends PaginationParams {
  category?: string;
  search?: string;
  sort?: 'asc' | 'desc';
}

export interface CompetitionQueryParams extends PaginationParams {
  status?: string;
}

// ==========================================
// Upload Types
// ==========================================

export interface UploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}