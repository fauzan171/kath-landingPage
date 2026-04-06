// ==========================================
// Centralized Type Definitions
// ==========================================
// This is the single source of truth for all shared types
// Import from this file instead of defining types locally
// ==========================================

// ==========================================
// User & Auth Types
// ==========================================

export type UserRole = 'participant' | 'admin' | 'super_admin' | 'finance_admin' | 'judge';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  institution?: string;
  country?: string;
  category?: 'student' | 'startup' | 'corporate' | 'open';
  status: UserStatus;
  role: UserRole;
  rejection_reason?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  institution?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

// ==========================================
// Competition Types
// ==========================================

// Internal database status
export type CompetitionStatus = 'draft' | 'upcoming' | 'active' | 'completed' | 'archived';
// Display status for landing page
export type CompetitionDisplayStatus = 'Open' | 'Coming Soon' | 'Closed';

export interface Competition {
  id: string;
  code?: string;
  name: string;
  name_id?: string;
  description?: string;
  description_id?: string;
  status: CompetitionStatus | CompetitionDisplayStatus;
  registration_start?: string;
  registration_end?: string;
  competition_start?: string;
  competition_end?: string;
  is_active?: boolean;
  config?: Record<string, unknown>;
  created_at?: string;
  createdAt?: string; // Legacy alias
  updated_at?: string;
  updatedAt?: string; // Legacy alias
  // Extended fields for display
  target?: string;
  prize?: string;
  deadline?: string;
  image?: string;
  requirements?: string[];
  timeline?: CompetitionTimeline[];
  registeredCount?: number;
  maxParticipants?: number;
  judges?: CompetitionJudge[];
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

export interface CompetitionCategory {
  id: string;
  name: string;
  target: string;
  prize: string;
  status: 'Open' | 'Coming Soon' | 'Closed';
}

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

// ==========================================
// Team Types
// ==========================================

export type TeamStatus = 'draft' | 'pending' | 'verified' | 'rejected';
export type PaymentStatus = 'unpaid' | 'pending' | 'verified' | 'rejected';
export type TeamMemberRole = 'leader' | 'member' | 'mentor';

export interface Team {
  id: string;
  competition_id: string;
  name: string;
  code?: string;
  category?: string;
  institution?: string;
  status: TeamStatus;
  payment_status?: PaymentStatus;
  payment_proof?: string;
  payment_drive_id?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  institution?: string;
  role: TeamMemberRole;
  is_active?: boolean;
  joined_at: string;
}

// ==========================================
// Stage & Task Types
// ==========================================

export type StageStatus = 'draft' | 'upcoming' | 'active' | 'completed';

export interface Stage {
  id: string;
  competition_id: string;
  name: string;
  name_id?: string;
  description?: string;
  order_index: number;
  start_date?: string;
  end_date?: string;
  status: StageStatus;
  is_active: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  stage_id: string;
  competition_id: string;
  name: string;
  name_id?: string;
  description?: string;
  type: string;
  is_required: boolean;
  is_published: boolean;
  max_score: number;
  created_at: string;
}

// ==========================================
// Submission Types
// ==========================================

export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'needs_revision' | 'graded' | 'final' | 'late';

export interface Submission {
  id: string;
  task_id?: string;
  team_id?: string;
  competition_id?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  drive_file_id?: string;
  link_url?: string;
  content?: string;
  field_values?: Record<string, unknown>;
  status: SubmissionStatus;
  total_score?: number;
  feedback?: string;
  criteria_scores?: Record<string, number>;
  submitted_at?: string;
  submittedAt?: string; // Legacy alias
  files?: { id: string; name: string; size: string }[]; // Legacy display field
  created_at: string;
  updated_at: string;
}

// ==========================================
// Judge Types
// ==========================================

export type JudgeAssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'recused';

export interface JudgeAssignment {
  id: string;
  competition_id: string;
  judge_id: string;
  submission_id: string;
  stage_id?: string;
  status: JudgeAssignmentStatus;
  assigned_by?: string;
  assigned_at: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface JudgeScore {
  id: string;
  judge_id: string;
  submission_id: string;
  score: number;
  feedback?: string;
  created_at: string;
}

// ==========================================
// Notification Types
// ==========================================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

// ==========================================
// Announcement Types
// ==========================================

export interface Announcement {
  id: string;
  competition_id: string;
  title: string;
  title_id?: string;
  content?: string;
  content_id?: string;
  type: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

// ==========================================
// Audit Log Types
// ==========================================

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ==========================================
// Content Types (Landing Page)
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

// ==========================================
// Registration Types
// ==========================================

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