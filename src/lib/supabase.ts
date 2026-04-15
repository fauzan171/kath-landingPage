// ============================================
// Supabase Client Configuration
// ============================================
//
// Architecture:
// - Database: Supabase PostgreSQL (FREE 500MB)
// - Storage: Cloudflare R2 via Supabase Edge Function
// - Total Cost: $0/month
//
// ============================================

import { createClient } from '@supabase/supabase-js';

// Environment variables (set in .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn if Supabase is not configured (but don't throw error)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: Supabase environment variables are missing. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. ' +
    'See .env.example for reference.'
  );
}

// Create Supabase client (will be null if not configured)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// ============================================
// TYPE DEFINITIONS
// ============================================

export type UserRole = 'participant' | 'admin' | 'super_admin' | 'finance_admin' | 'judge';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  institution?: string;
  country?: string;
  category?: string;
  status: string;
  rejection_reason?: string;
  role: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  competition_id?: string;
  role: UserRole;
  permissions: string[];
}

// ============================================
// Rubric Types
// ============================================

/** A single rubric criterion with weight-based scoring */
export interface RubricCriterion {
  id: string;
  name: string;
  nameId?: string;
  maxScore: number;
  weight: number;
  description?: string;
}

/** The full rubric data structure stored as JSONB on tasks */
export interface RubricData {
  rubric: RubricCriterion[];
  totalWeight: number;
}

/** Legacy rubric format used by AdminStages */
export interface LegacyRubricCriterion {
  criterion: string;
  description: string;
  max_points: number;
}

export interface Competition {
  id: string;
  code: string;
  name: string;
  name_id?: string;
  description?: string;
  description_id?: string;
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'archived';
  is_active?: boolean;
  registration_start?: string;
  registration_end?: string;
  competition_start?: string;
  competition_end?: string;
  config: {
    totalPrize?: string;
    maxTeamSize?: number;
    minTeamSize?: number;
    categories?: Array<{
      id: string;
      name: string;
      nameId?: string;
      prize?: string;
      description?: string;
    }>;
  } & Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Not in DB, used in UI only
  subtitle?: string;
  event_start?: string;
  event_end?: string;
  target?: string;
  prize?: string;
  image?: string;
  requirements?: string[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    heroImage?: string;
    logo?: string;
  };
  settings?: {
    autoProgressStages?: boolean;
    publicLeaderboard?: boolean;
    blindGrading?: boolean;
  };
}

export interface Stage {
  id: string;
  competition_id: string;
  name: string;
  name_id?: string;
  description?: string;
  order_index: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'upcoming' | 'active' | 'completed';
  is_active: boolean;
  created_at?: string;
  // Not in DB, used in UI only
  is_visible?: boolean;
  auto_progress?: boolean;
  requires_all_tasks?: boolean;
}

export interface Task {
  id: string;
  stage_id: string;
  competition_id: string;
  name: string;
  name_id?: string;
  description?: string;
  description_id?: string;
  instructions?: string;
  type: 'file_upload' | 'text_input' | 'link_submit' | 'quiz' | 'attendance' | 'text' | 'link' | 'presentation';
  max_file_size_mb?: number;
  max_file_size?: number;
  max_score?: number;
  allowed_extensions?: string[];
  file_types?: string[];
  deadline?: string;
  is_required: boolean;
  is_published: boolean;
  order_index: number;
  rubric?: Array<RubricCriterion | LegacyRubricCriterion>;
  rubric_data?: RubricData;
  custom_fields?: Array<{
    id: string;
    label: string;
    labelId?: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface Team {
  id: string;
  competition_id: string;
  name: string;
  code?: string;
  category?: 'startup' | 'student' | 'corporate' | 'open';
  institution?: string;
  status: 'draft' | 'pending' | 'verified' | 'rejected';
  payment_status?: 'unpaid' | 'pending' | 'verified' | 'rejected';
  payment_proof?: string;
  payment_drive_id?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  // Not in DB, used in UI only
  team_code?: string;
  sub_theme?: string;
  country?: string;
  total_score?: number;
  rank?: number;
  payment_uploaded_at?: string;
  payment_rejection_reason?: string;
  student_cards_url?: string;
  instagram_proof_url?: string;
  twibbon_proof_url?: string;
  bmc_url?: string;
  notes?: string;
  rejected_by?: string;
  rejected_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  institution?: string;
  role: 'leader' | 'member' | 'mentor';
  is_active: boolean;
  joined_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    institution?: string;
  };
  // Not in DB, used in UI only
  student_id?: string;
  major?: string;
  position?: string;
}

export interface Submission {
  id: string;
  task_id: string;
  team_id: string;
  competition_id: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  drive_file_id?: string;
  link_url?: string;
  content?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'needs_revision' | 'graded' | 'final' | 'late';
  total_score?: number;
  feedback?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  // Not in DB, used in UI only
  submitted_by?: string;
  file_type?: string;
  field_values?: Record<string, unknown>;
  graded_by?: string;
  graded_at?: string;
  criteria_scores?: Record<string, number>;
  is_late?: boolean;
  penalty_applied?: number;
}

export interface Announcement {
  id: string;
  competition_id: string;
  title: string;
  title_id?: string;
  content: string;
  content_id?: string;
  type: 'general' | 'urgent' | 'result' | 'reminder' | 'system' | 'info' | 'warning' | 'success';
  is_published: boolean;
  published_at?: string;
  views_count: number;
  created_at: string;
  updated_at?: string;
}

// ============================================
// AUTH HELPERS
// ============================================

export async function signUp(email: string, password: string, metadata?: Record<string, unknown>) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ============================================
// FILE UPLOAD HELPER (via Cloudflare R2)
// ============================================

export async function uploadFileToR2(
  file: File,
  taskId: string,
  teamId: string
): Promise<{
  fileUrl: string;
  storageKey: string;
  fileName: string;
  fileSize: number;
}> {
  if (!supabase) throw new Error('Supabase is not configured');

  // 1. Request Presigned Upload URL from Edge Function
  const { data, error } = await supabase.functions.invoke('upload-r2', {
    body: {
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      taskId,
      teamId,
      uploadType: 'submission'
    }
  });

  if (error || !data?.uploadUrl) {
    console.error('Failed getting upload URL:', error);
    throw new Error('Gagal mendapatkan akses secure upload. Silakan coba sesaat lagi.');
  }

  // 2. Upload file directly to Cloudflare R2
  const uploadResponse = await fetch(data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    }
  });

  if (!uploadResponse.ok) {
    throw new Error('Gagal memindahkan file ke Cloud Storage. Silakan coba lagi.');
  }

  return {
    fileUrl: data.finalUrl,
    storageKey: data.key,
    fileName: file.name,
    fileSize: file.size
  };
}

// Backward-compatible alias
export const uploadFileToDrive = uploadFileToR2;

// ============================================
// FILE DELETE HELPER (via Cloudflare R2)
// ============================================

export async function deleteFileFromR2(storageKey: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.functions.invoke('upload-r2', {
    method: 'DELETE',
    body: { key: storageKey },
  });

  if (error) {
    console.error('Failed to delete file from R2:', error);
    return false;
  }

  return data?.success ?? false;
}

// ============================================
// SUBMISSION HELPERS
// ============================================

export async function createSubmission(
  taskId: string,
  teamId: string,
  competitionId: string,
  file: File
): Promise<Submission> {
  if (!supabase) throw new Error('Supabase is not configured');
  const uploadResult = await uploadFileToR2(file, taskId, teamId);

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      task_id: taskId,
      team_id: teamId,
      competition_id: competitionId,
      file_url: uploadResult.fileUrl,
      file_name: uploadResult.fileName,
      file_size: uploadResult.fileSize,
      drive_file_id: uploadResult.storageKey,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTeamSubmissions(teamId: string): Promise<Submission[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      tasks (
        id,
        name,
        stage_id
      )
    `)
    .eq('team_id', teamId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSubmissionById(submissionId: string): Promise<Submission | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      tasks (
        id,
        name,
        rubric
      ),
      teams (
        id,
        name,
        institution
      )
    `)
    .eq('id', submissionId)
    .single();

  if (error) return null;
  return data;
}

// ============================================
// COMPETITION HELPERS
// ============================================

export async function getCompetitionByCode(code: string): Promise<Competition | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('competitions')
    .select('id, code, name, name_id, description, description_id, status, is_active, registration_start, registration_end, competition_start, competition_end, config, created_at, updated_at')
    .eq('code', code)
    .single();

  if (error) return null;
  return data;
}

export async function getActiveCompetitions(): Promise<Competition[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('competitions')
    .select('id, code, name, name_id, description, description_id, status, is_active, registration_start, registration_end, competition_start, competition_end, config, created_at, updated_at')
    .in('status', ['active', 'upcoming'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================
// STAGE & TASK HELPERS
// ============================================

export async function getCompetitionStages(competitionId: string): Promise<Stage[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('stages')
    .select('id, competition_id, name, name_id, description, order_index, start_date, end_date, status, is_active, created_at')
    .eq('competition_id', competitionId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getStageTasks(stageId: string): Promise<Task[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('tasks')
    .select('id, stage_id, competition_id, name, name_id, description, description_id, instructions, type, max_file_size_mb, max_file_size, max_score, allowed_extensions, file_types, deadline, is_required, is_published, order_index, rubric, rubric_data, custom_fields, created_at, updated_at')
    .eq('stage_id', stageId)
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============================================
// TEAM HELPERS
// ============================================

export async function createTeam(
  competitionId: string,
  name: string,
  category: string,
  institution?: string
): Promise<Team> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('teams')
    .insert({
      competition_id: competitionId,
      name,
      category,
      institution,
      status: 'draft'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addTeamMember(
  teamId: string,
  member: {
    full_name: string;
    email: string;
    phone?: string;
    institution?: string;
    role?: 'leader' | 'member' | 'mentor';
  }
): Promise<TeamMember> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      ...member,
      role: member.role || 'member'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTeamById(teamId: string): Promise<(Team & { members: TeamMember[] }) | null> {
  if (!supabase) return null;
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id, competition_id, name, code, category, sub_theme, institution, status, payment_status, payment_proof, payment_drive_id, student_cards_url, instagram_proof_url, twibbon_proof_url, bmc_url, verified_by, verified_at, created_at, updated_at')
    .eq('id', teamId)
    .single();

  if (teamError) return null;

  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('id, team_id, user_id, full_name, email, phone, institution, role, is_active, joined_at')
    .eq('team_id', teamId)
    .eq('is_active', true);

  if (membersError) throw membersError;

  return {
    ...team,
    members: members || []
  };
}

// ============================================
// ANNOUNCEMENT HELPERS
// ============================================

export async function getPublishedAnnouncements(competitionId: string): Promise<Announcement[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('announcements')
    .select('id, competition_id, title, title_id, content, content_id, type, is_published, published_at, views_count, created_at, updated_at')
    .eq('competition_id', competitionId)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================
// EXPORTS
// ============================================

export default supabase;
