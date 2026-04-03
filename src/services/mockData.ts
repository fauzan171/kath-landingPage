// ============================================
// Mock Data - STUB FILE
// ============================================
// This file provides synchronous stub implementations
// for backward compatibility.
//
// IMPORTANT: These functions return empty/mock data.
// For real data, use the appropriate service:
// - Landing Page: competitionService (localStorage)
// - CIBC Dashboard: cibc.service (Supabase)
// ============================================

// ============================================
// TYPES
// ============================================

export interface CompetitionTimeline {
  phase: string;
  startDate: string;
  endDate: string;
  completed?: boolean;
  date?: string;
}

export interface CompetitionJudge {
  name: string;
  role: string;
  image: string;
}

export interface Competition {
  id: string;
  name: string;
  target: string;
  prize: string;
  status: 'Open' | 'Coming Soon' | 'Closed' | 'in_progress' | 'registered' | 'finished' | 'upcoming';
  deadline: string;
  description: string;
  image?: string;
  requirements?: string[];
  timeline?: CompetitionTimeline[];
  registeredCount?: number;
  maxParticipants?: number;
  judges?: CompetitionJudge[];
  result?: {
    announced: boolean;
    winner?: string;
    finalists?: string[];
  } | string;
  organizer?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  hasSubmitted?: boolean;
  teamSize?: number;
  teamName?: string;
  rules?: string[];
  category?: string;
  submissionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  code?: string;
  competitionId?: string;
  competition_id?: string;
  competitionName?: string;
  members?: TeamMember[];
  status?: string;
  category?: string;
  institution?: string;
  total_score?: number;
  rank?: number;
  description?: string;
  maxMembers?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id?: string;
  full_name?: string;
  name?: string;  // alias
  email: string;
  phone?: string;
  institution?: string;
  role: 'leader' | 'member' | 'mentor';
  is_active: boolean;
  status?: string;
  joined_at: string;
  joinedAt?: string;  // alias
}

export interface SubmissionFile {
  id?: string;
  name: string;
  url: string;
  size: number;
  type?: string;
}

export interface Submission {
  id: string;
  task_id: string;
  team_id: string;
  competition_id: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  drive_file_id?: string;
  link_url?: string;
  content?: string;
  description?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'needs_revision' | 'graded' | 'final';
  total_score?: number;
  feedback?: string;
  submitted_at?: string;
  submittedAt?: string;
  files?: SubmissionFile[];
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  competition_id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'result' | 'reminder' | 'system';
  is_published: boolean;
  published_at?: string;
  views_count: number;
  created_at: string;
}

export interface Stage {
  id: string;
  name: string;
  competition_id: string;
  order_index: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'upcoming' | 'active' | 'completed';
  is_active: boolean;
  is_visible: boolean;
}

export interface Task {
  id: string;
  name: string;
  stage_id: string;
  competition_id: string;
  type: string;
  is_required: boolean;
  is_published: boolean;
  max_file_size_mb?: number;
  allowed_extensions?: string[];
  rubric?: any[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  isRead: boolean;
  read: boolean;
  createdAt: string;
  time?: string;
  actionUrl?: string;
  action?: string;
}

export interface DashboardStats {
  totalTeams: number;
  totalSubmissions: number;
  activeCompetitions: number;
  pendingPayments: number;
  totalCompetitions: number;
  active: number;
  wins: number;
  certificates: number;
}

// ============================================
// COMPETITION FUNCTIONS (Synchronous stubs)
// ============================================

export function getCompetitions(): Competition[] {
  // Use competitionService for real data
  return [];
}

export function getCompetitionById(_id: string): Competition | null {
  return null;
}

// ============================================
// TEAM FUNCTIONS (Synchronous stubs)
// ============================================

export function getTeams(): Team[] {
  return [];
}

export function getTeamsByCompetition(_competitionId: string): Team[] {
  return [];
}

export function getTeamById(_id: string): (Team & { members: TeamMember[] }) | null {
  return null;
}

// ============================================
// SUBMISSION FUNCTIONS (Synchronous stubs)
// ============================================

export function getSubmissions(): Submission[] {
  return [];
}

export function getSubmissionByCompetition(_competitionId: string): Submission | null {
  return null;
}

// ============================================
// NOTIFICATION FUNCTIONS (Synchronous stubs)
// ============================================

export function getNotifications(): Notification[] {
  return [];
}

export function markNotificationAsRead(_id: string): void {
  // No-op
}

export function markAllNotificationsAsRead(): void {
  // No-op
}

export function addNotification(notification: Partial<Notification>): Notification {
  return {
    id: `notif_${Date.now()}`,
    title: notification.title || '',
    message: notification.message || '',
    type: notification.type || 'info',
    isRead: false,
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  };
}

// ============================================
// DASHBOARD FUNCTIONS (Synchronous stubs)
// ============================================

export function getDashboardStats(): DashboardStats {
  return {
    totalTeams: 0,
    totalSubmissions: 0,
    activeCompetitions: 0,
    pendingPayments: 0,
    totalCompetitions: 0,
    active: 0,
    wins: 0,
    certificates: 0,
  };
}

// ============================================
// LEGACY SERVICE OBJECTS
// ============================================

export const teamService = {
  getAll: getTeams,
  getById: getTeamById,
  getByCompetition: getTeamsByCompetition,
};

export const submissionService = {
  getAll: getSubmissions,
  getByCompetition: getSubmissionByCompetition,
};

export const notificationService = {
  getAll: getNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  add: addNotification,
};

export const profileService = {
  get: () => null,
  update: async () => ({ success: false, message: 'Not implemented' }),
};

export const settingsService = {
  get: () => null,
  update: async () => ({ success: false, message: 'Not implemented' }),
};

// ============================================
// TEAM MANAGEMENT FUNCTIONS
// ============================================

export function createTeam(data: Partial<Team>): Team {
  return {
    id: `team_${Date.now()}`,
    name: data.name || 'New Team',
    status: 'active',
    members: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...data,
  };
}

export function inviteMember(teamId: string, member: Partial<TeamMember>): TeamMember {
  return {
    id: `member_${Date.now()}`,
    team_id: teamId,
    full_name: member.full_name || '',
    name: member.name || member.full_name || '',
    email: member.email || '',
    role: member.role || 'member',
    is_active: true,
    joined_at: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
    ...member,
  };
}

export function removeMember(_teamId: string, _memberId: string): boolean {
  console.warn('[mockData] removeMember is deprecated.');
  return true;
}

export function promoteMember(_teamId: string, _memberId: string): boolean {
  console.warn('[mockData] promoteMember is deprecated.');
  return true;
}

// ============================================
// SUBMISSION FUNCTIONS
// ============================================

export function createSubmission(data: Partial<Submission>): Submission {
  return {
    id: `sub_${Date.now()}`,
    task_id: data.task_id || '',
    team_id: data.team_id || '',
    competition_id: data.competition_id || '',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...data,
  };
}

export function updateSubmission(id: string, data: Partial<Submission>): Submission {
  return {
    id,
    task_id: data.task_id || '',
    team_id: data.team_id || '',
    competition_id: data.competition_id || '',
    status: data.status || 'draft',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...data,
  };
}