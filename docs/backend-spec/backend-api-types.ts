// ============================================
// TYPESCRIPT TYPES FOR ADMIN DASHBOARD API
// ============================================

// ============================================
// AUTHENTICATION
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  competitionId: string;
  role: 'super_admin' | 'admin' | 'judge' | 'observer';
  permissions: Permission[];
  createdAt: string;
}

export type Permission = 
  | 'read' 
  | 'write' 
  | 'delete' 
  | 'grade' 
  | 'manage_teams' 
  | 'manage_settings' 
  | 'export_data';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  competitions: CompetitionContext[];
}

export interface CompetitionContext {
  competitionId: string;
  competitionName: string;
  role: string;
  permissions: Permission[];
}

export interface SetContextRequest {
  competitionId: string;
}

export interface AccessTokenPayload {
  sub: string;           // user_id
  email: string;
  name: string;
  competitionId?: string;
  role?: string;
  permissions: Permission[];
  iat: number;
  exp: number;
}

// ============================================
// COMPETITION
// ============================================

export interface Competition {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'archived';
  registrationStart?: string;
  registrationEnd?: string;
  eventStart?: string;
  eventEnd?: string;
  config: CompetitionConfig;
  theme?: CompetitionTheme;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionConfig {
  maxTeamSize?: number;
  minTeamSize?: number;
  categories?: string[];
  totalPrize?: string;
  rules?: string;
  faqs?: FAQ[];
  registrationFields?: RegistrationField[];
  [key: string]: any;  // Extensible
}

export interface CompetitionTheme {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

export interface FAQ {
  id: string;
  question: { id: string; en: string };
  answer: { id: string; en: string };
  category: string;
  order: number;
}

export interface RegistrationField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface CreateCompetitionRequest {
  code: string;
  name: string;
  description?: string;
  registrationStart?: string;
  registrationEnd?: string;
  eventStart?: string;
  eventEnd?: string;
  config?: CompetitionConfig;
}

export interface UpdateCompetitionRequest {
  name?: string;
  description?: string;
  status?: Competition['status'];
  registrationStart?: string;
  registrationEnd?: string;
  eventStart?: string;
  eventEnd?: string;
  config?: Partial<CompetitionConfig>;
  theme?: Partial<CompetitionTheme>;
}

// ============================================
// STAGES & TASKS
// ============================================

export interface Stage {
  id: string;
  competitionId: string;
  name: string;
  description?: string;
  orderIndex: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoProgress: boolean;
  requiresSubmission: boolean;
  criteria?: JudgingCriteria[];
  createdAt: string;
  updatedAt: string;
}

export interface JudgingCriteria {
  id: string;
  name: string;
  description?: string;
  weight: number;        // Percentage (0-100)
  maxScore: number;
}

export interface Task {
  id: string;
  stageId: string;
  competitionId: string;
  name: string;
  description?: string;
  type: 'submission' | 'quiz' | 'manual_review' | 'attendance';
  deadline?: string;
  maxFileSizeMb: number;
  allowedExtensions: string[];
  rubric?: JudgingCriteria[];
  orderIndex: number;
  isRequired: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStageRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  orderIndex?: number;
  criteria?: Omit<JudgingCriteria, 'id'>[];
}

export interface CreateTaskRequest {
  stageId: string;
  name: string;
  description?: string;
  type: Task['type'];
  deadline?: string;
  maxFileSizeMb?: number;
  allowedExtensions?: string[];
  rubric?: Omit<JudgingCriteria, 'id'>[];
  isRequired?: boolean;
}

// ============================================
// TEAMS
// ============================================

export interface Team {
  id: string;
  competitionId: string;
  name: string;
  code?: string;
  status: 'pending' | 'registered' | 'active' | 'disqualified' | 'withdrawn';
  institution?: string;
  category?: string;
  registeredAt?: string;
  registrationData?: Record<string, any>;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  studentId?: string;
  institution?: string;
  role: 'leader' | 'member' | 'mentor';
  isActive: boolean;
  joinedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  code?: string;
  institution?: string;
  category?: string;
  members: Omit<TeamMember, 'id' | 'teamId' | 'joinedAt'>[];
}

export interface UpdateTeamStatusRequest {
  status: Team['status'];
  reason?: string;
}

// ============================================
// SUBMISSIONS
// ============================================

export interface Submission {
  id: string;
  taskId: string;
  teamId: string;
  competitionId: string;
  submittedBy?: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  content?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'graded' | 'returned';
  totalScore?: number;
  gradedBy?: string;
  gradedAt?: string;
  feedback?: string;
  criteriaScores?: Record<string, number>;
  team?: Pick<Team, 'id' | 'name' | 'institution'>;
  task?: Pick<Task, 'id' | 'name' | 'type'>;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionListItem extends Submission {
  teamName: string;
  taskName: string;
  stageName: string;
}

export interface GradeSubmissionRequest {
  criteriaScores: Record<string, number>;  // criteria_id -> score
  totalScore: number;
  feedback?: string;
  status?: 'graded' | 'returned';
}

export interface SubmissionFilters {
  taskId?: string;
  teamId?: string;
  status?: Submission['status'];
  stageId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================
// DASHBOARD & REPORTS
// ============================================

export interface DashboardStats {
  totalTeams: number;
  activeTeams: number;
  pendingTeams: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  gradedSubmissions: number;
  currentStage?: Stage;
  upcomingDeadline?: Task;
}

export interface RecentActivity {
  id: string;
  type: 'submission' | 'registration' | 'grading' | 'stage_change';
  description: string;
  user?: string;
  team?: string;
  timestamp: string;
}

export interface StandingsEntry {
  rank: number;
  teamId: string;
  teamName: string;
  institution?: string;
  totalScore: number;
  stageScores: Record<string, number>;
  lastSubmissionAt?: string;
}

export interface ProgressReport {
  teamId: string;
  teamName: string;
  stages: {
    stageId: string;
    stageName: string;
    tasksCompleted: number;
    tasksTotal: number;
    percentage: number;
    score?: number;
  }[];
  overallProgress: number;
}

// ============================================
// ANNOUNCEMENTS
// ============================================

export interface Announcement {
  id: string;
  competitionId: string;
  createdBy: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'result' | 'reminder';
  isPublished: boolean;
  publishedAt?: string;
  targetTeams?: string[];
  targetStages?: string[];
  createdAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type: Announcement['type'];
  targetTeams?: string[];
  targetStages?: string[];
}

// ============================================
// API RESPONSE WRAPPER
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
