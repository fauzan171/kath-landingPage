// ============================================
// CIBC Dashboard - Supabase Services
// ============================================
// This service layer integrates with the Supabase client
// and provides a unified interface for the CIBC Admin Dashboard
// ============================================

import {
  supabase,
  uploadFileToDrive,
  type Competition,
  type Stage,
  type Task,
  type Team,
  type TeamMember,
  type Submission,
  type Announcement,
} from '@/lib/supabase';
import { env, isSupabaseConfigured, isN8nConfigured } from '@/config/environment';

// ============================================
// Auth Service (Supabase)
// ============================================

export const supabaseAuthService = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Store user info in localStorage for quick access
    if (data.user) {
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
      }));
    }

    return data;
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('user');
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    const session = await supabaseAuthService.getSession();
    return !!session;
  },

  /**
   * Send password reset email
   */
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.appUrl}/reset-password`,
    });
    if (error) throw error;
  },

  /**
   * Update user password
   */
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};

// ============================================
// Competition Service (Supabase) - Single Competition Focus
// ============================================
// CIBC 2026 is the ONLY competition
// ============================================

// Competition code constant
const COMPETITION_CODE = 'cibc-2026';

// Timeline stage with tasks
export interface TimelineStage extends Stage {
  tasks: Task[];
  progress: number;
}

export const supabaseCompetitionService = {
  /**
   * Get CIBC 2026 competition (SINGLE competition)
   */
  getCompetition: async (): Promise<Competition | null> => {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('code', COMPETITION_CODE)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get competition by code (for backward compatibility)
   */
  getByCode: async (code: string): Promise<Competition | null> => {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('code', code)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get competition by ID (for backward compatibility)
   */
  getById: async (id: string): Promise<Competition | null> => {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Update competition (admin)
   */
  update: async (updates: Partial<Competition>): Promise<Competition> => {
    // Get competition ID first
    const competition = await supabaseCompetitionService.getCompetition();
    if (!competition) throw new Error('Competition not found');

    const { data, error } = await supabase
      .from('competitions')
      .update(updates)
      .eq('id', competition.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // TIMELINE MANAGEMENT
  // ============================================

  /**
   * Get full timeline (stages + tasks)
   */
  getTimeline: async (): Promise<TimelineStage[]> => {
    // Use RPC function if available
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_timeline');

    if (!rpcError && rpcData) {
      return rpcData.map((stage: Record<string, unknown>) => ({
        id: stage.stage_id as string,
        name: stage.stage_name as string,
        name_id: stage.stage_name_id as string,
        description: stage.stage_description as string,
        order_index: stage.stage_order_index as number,
        start_date: stage.stage_start_date as string,
        end_date: stage.stage_end_date as string,
        status: stage.stage_status as Stage['status'],
        is_active: stage.stage_is_active as boolean,
        competition_id: '',
        is_visible: true,
        auto_progress: false,
        requires_all_tasks: true,
        created_at: '',
        updated_at: '',
        tasks: (stage.tasks as Task[]) || [],
        progress: (stage.stage_progress as number) || 0,
      }));
    }

    // Fallback: manual query
    const competition = await supabaseCompetitionService.getCompetition();
    if (!competition) return [];

    const { data: stages, error: stagesError } = await supabase
      .from('stages')
      .select('*')
      .eq('competition_id', competition.id)
      .order('order_index', { ascending: true });

    if (stagesError) throw stagesError;

    // Get tasks for each stage
    const stagesWithTasks = await Promise.all(
      (stages || []).map(async (stage) => {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('stage_id', stage.id)
          .order('order_index', { ascending: true });

        return {
          ...stage,
          tasks: tasks || [],
          progress: 0, // TODO: Calculate based on submissions
        };
      })
    );

    return stagesWithTasks;
  },

  /**
   * Get active stage
   */
  getActiveStage: async (): Promise<Stage | null> => {
    const competition = await supabaseCompetitionService.getCompetition();
    if (!competition) return null;

    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .eq('competition_id', competition.id)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Activate a stage (admin)
   */
  activateStage: async (stageId: string): Promise<Stage> => {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc('activate_stage', {
      p_stage_id: stageId
    });

    if (!rpcError && rpcData) {
      return rpcData;
    }

    // Fallback: manual update
    const competition = await supabaseCompetitionService.getCompetition();
    if (!competition) throw new Error('Competition not found');

    // Deactivate all stages
    await supabase
      .from('stages')
      .update({ is_active: false, status: 'upcoming' })
      .eq('competition_id', competition.id);

    // Activate target stage
    const { data, error } = await supabase
      .from('stages')
      .update({ is_active: true, status: 'active' })
      .eq('id', stageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update stage dates (admin)
   */
  updateStage: async (stageId: string, updates: Partial<Stage>): Promise<Stage> => {
    const { data, error } = await supabase
      .from('stages')
      .update(updates)
      .eq('id', stageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * Get competition statistics
   */
  getStats: async (): Promise<{
    competition: Competition | null;
    totalTeams: number;
    totalSubmissions: number;
    activeStages: number;
    teamsByCategory: { startup: number; student: number; corporate: number };
    submissionsByStatus: { draft: number; submitted: number; graded: number };
  }> => {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_competition_stats');

    if (!rpcError && rpcData) {
      return rpcData;
    }

    // Fallback: manual calculation
    const competition = await supabaseCompetitionService.getCompetition();
    if (!competition) {
      return {
        competition: null,
        totalTeams: 0,
        totalSubmissions: 0,
        activeStages: 0,
        teamsByCategory: { startup: 0, student: 0, corporate: 0 },
        submissionsByStatus: { draft: 0, submitted: 0, graded: 0 },
      };
    }

    // Get teams
    const { data: teams } = await supabase
      .from('teams')
      .select('category')
      .eq('competition_id', competition.id);

    // Get submissions
    const { data: submissions } = await supabase
      .from('submissions')
      .select('status')
      .eq('competition_id', competition.id);

    // Get active stages
    const { data: stages } = await supabase
      .from('stages')
      .select('id')
      .eq('competition_id', competition.id)
      .eq('is_active', true);

    return {
      competition,
      totalTeams: teams?.length || 0,
      totalSubmissions: submissions?.length || 0,
      activeStages: stages?.length || 0,
      teamsByCategory: {
        startup: teams?.filter((t: { category: string }) => t.category === 'startup').length || 0,
        student: teams?.filter((t: { category: string }) => t.category === 'student').length || 0,
        corporate: teams?.filter((t: { category: string }) => t.category === 'corporate').length || 0,
      },
      submissionsByStatus: {
        draft: submissions?.filter((s: { status: string }) => s.status === 'draft').length || 0,
        submitted: submissions?.filter((s: { status: string }) => s.status === 'submitted').length || 0,
        graded: submissions?.filter((s: { status: string }) => s.status === 'graded').length || 0,
      },
    };
  },

  /**
   * Get leaderboard
   */
  getLeaderboard: async (category?: string, limit: number = 50): Promise<{
    rank: number;
    team_id: string;
    team_name: string;
    team_institution: string;
    team_category: string;
    total_score: number;
    submissions_count: number;
  }[]> => {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_leaderboard', {
      p_category: category || null,
      p_limit: limit
    });

    if (!rpcError && rpcData) {
      return rpcData;
    }

    // Fallback: manual query
    const competition = await supabaseCompetitionService.getCompetition();
    if (!competition) return [];

    let query = supabase
      .from('teams')
      .select(`
        id,
        name,
        institution,
        category,
        total_score,
        submissions(id)
      `)
      .eq('competition_id', competition.id)
      .eq('status', 'active')
      .order('total_score', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((team, index) => ({
      rank: index + 1,
      team_id: team.id,
      team_name: team.name,
      team_institution: team.institution || '',
      team_category: team.category,
      total_score: team.total_score || 0,
      submissions_count: team.submissions?.length || 0,
    }));
  },

  // ============================================
  // LEGACY METHODS (for backward compatibility)
  // ============================================

  /**
   * Get all active competitions (legacy - returns only CIBC 2026)
   * @deprecated Use getCompetition() instead
   */
  getActive: async (): Promise<Competition[]> => {
    const competition = await supabaseCompetitionService.getCompetition();
    return competition ? [competition] : [];
  },

  /**
   * Get all competitions (legacy - returns only CIBC 2026)
   * @deprecated Use getCompetition() instead
   */
  getAll: async (): Promise<Competition[]> => {
    const competition = await supabaseCompetitionService.getCompetition();
    return competition ? [competition] : [];
  },
};

// ============================================
// Stage Service (Supabase)
// ============================================

export const supabaseStageService = {
  /**
   * Get stages for a competition
   */
  getByCompetition: async (competitionId: string): Promise<Stage[]> => {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .eq('competition_id', competitionId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get stage by ID
   */
  getById: async (id: string): Promise<Stage | null> => {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Create stage (admin)
   */
  create: async (stage: Partial<Stage>): Promise<Stage> => {
    const { data, error } = await supabase
      .from('stages')
      .insert(stage)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update stage (admin)
   */
  update: async (id: string, updates: Partial<Stage>): Promise<Stage> => {
    const { data, error } = await supabase
      .from('stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================
// Task Service (Supabase)
// ============================================

export const supabaseTaskService = {
  /**
   * Get tasks for a stage
   */
  getByStage: async (stageId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('stage_id', stageId)
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get all tasks for a competition
   */
  getByCompetition: async (competitionId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('competition_id', competitionId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get task by ID
   */
  getById: async (id: string): Promise<Task | null> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Create task (admin)
   */
  create: async (task: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update task (admin)
   */
  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================
// Team Service (Supabase)
// ============================================

export const supabaseTeamService = {
  /**
   * Get teams for a competition
   */
  getByCompetition: async (competitionId: string): Promise<Team[]> => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('competition_id', competitionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get team by ID with members
   */
  getById: async (id: string): Promise<(Team & { members: TeamMember[] }) | null> => {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (teamError) return null;

    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', id)
      .eq('is_active', true);

    if (membersError) throw membersError;

    return {
      ...team,
      members: members || [],
    };
  },

  /**
   * Create a new team
   */
  create: async (
    competitionId: string,
    name: string,
    category: string,
    institution?: string
  ): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        competition_id: competitionId,
        name,
        category,
        institution,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Add team member
   */
  addMember: async (
    teamId: string,
    member: {
      full_name: string;
      email: string;
      phone?: string;
      student_id?: string;
      institution?: string;
      major?: string;
      position?: string;
      role?: 'leader' | 'member' | 'mentor';
    }
  ): Promise<TeamMember> => {
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        ...member,
        role: member.role || 'member',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update team status
   */
  updateStatus: async (
    id: string,
    status: Team['status']
  ): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get team stats for competition
   */
  getStats: async (competitionId: string) => {
    const { data: teams, error } = await supabase
      .from('teams')
      .select('status, category')
      .eq('competition_id', competitionId);

    if (error) throw error;

    type TeamStats = { status: string; category: string };
    const teamList = (teams || []) as TeamStats[];

    return {
      total: teamList.length,
      draft: teamList.filter((t: TeamStats) => t.status === 'draft').length,
      registered: teamList.filter((t: TeamStats) => t.status === 'registered').length,
      active: teamList.filter((t: TeamStats) => t.status === 'active').length,
      byCategory: {
        startup: teamList.filter((t: TeamStats) => t.category === 'startup').length,
        student: teamList.filter((t: TeamStats) => t.category === 'student').length,
        corporate: teamList.filter((t: TeamStats) => t.category === 'corporate').length,
      },
    };
  },
};

// ============================================
// Submission Service (Supabase + n8n)
// ============================================

export const supabaseSubmissionService = {
  /**
   * Get submissions for a team
   */
  getByTeam: async (teamId: string): Promise<Submission[]> => {
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
  },

  /**
   * Get submissions for a task (admin/judge)
   */
  getByTask: async (taskId: string): Promise<Submission[]> => {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        teams (
          id,
          name,
          institution
        )
      `)
      .eq('task_id', taskId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get submission by ID
   */
  getById: async (id: string): Promise<Submission | null> => {
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
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Create submission with file upload
   */
  createWithFile: async (
    taskId: string,
    teamId: string,
    competitionId: string,
    file: File
  ): Promise<Submission> => {
    if (!isN8nConfigured()) {
      throw new Error('File upload requires n8n configuration');
    }

    // 1. Upload file to Google Drive via n8n
    const uploadResult = await uploadFileToDrive(file, taskId, teamId);

    // 2. Save metadata to Supabase
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        team_id: teamId,
        competition_id: competitionId,
        file_url: uploadResult.fileUrl,
        file_name: uploadResult.fileName,
        file_size: uploadResult.fileSize,
        file_type: file.type,
        drive_file_id: uploadResult.driveFileId,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        is_late: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create submission with content (text/link)
   */
  createWithContent: async (
    taskId: string,
    teamId: string,
    competitionId: string,
    content: string,
    fieldValues?: Record<string, unknown>
  ): Promise<Submission> => {
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        team_id: teamId,
        competition_id: competitionId,
        content,
        field_values: fieldValues,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        is_late: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update submission status
   */
  updateStatus: async (
    id: string,
    status: Submission['status']
  ): Promise<Submission> => {
    const { data, error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Grade submission (admin/judge)
   */
  grade: async (
    id: string,
    totalScore: number,
    criteriaScores?: Record<string, number>,
    feedback?: string
  ): Promise<Submission> => {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        total_score: totalScore,
        criteria_scores: criteriaScores,
        feedback,
        status: 'graded',
        graded_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get submission stats for competition
   */
  getStats: async (competitionId: string) => {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('status')
      .eq('competition_id', competitionId);

    if (error) throw error;

    type SubmissionStats = { status: string };
    const subList = (submissions || []) as SubmissionStats[];

    return {
      total: subList.length,
      draft: subList.filter((s: SubmissionStats) => s.status === 'draft').length,
      submitted: subList.filter((s: SubmissionStats) => s.status === 'submitted').length,
      graded: subList.filter((s: SubmissionStats) => s.status === 'graded').length,
    };
  },
};

// ============================================
// Announcement Service (Supabase)
// ============================================

export const supabaseAnnouncementService = {
  /**
   * Get published announcements for a competition
   */
  getPublished: async (competitionId: string): Promise<Announcement[]> => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('competition_id', competitionId)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get all announcements (admin)
   */
  getAll: async (competitionId: string): Promise<Announcement[]> => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('competition_id', competitionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create announcement (admin)
   */
  create: async (announcement: Partial<Announcement>): Promise<Announcement> => {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...announcement,
        is_published: announcement.is_published ?? false,
        published_at: announcement.is_published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Publish announcement (admin)
   */
  publish: async (id: string): Promise<Announcement> => {
    const { data, error } = await supabase
      .from('announcements')
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================
// Export all services
// ============================================

export const supabaseServices = {
  auth: supabaseAuthService,
  competition: supabaseCompetitionService,
  stage: supabaseStageService,
  task: supabaseTaskService,
  team: supabaseTeamService,
  submission: supabaseSubmissionService,
  announcement: supabaseAnnouncementService,
};

export default supabaseServices;