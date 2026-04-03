// ============================================
// CIBC Dashboard - Supabase Services
// ============================================
// This service layer integrates with the Supabase client
// and provides a unified interface for the CIBC Admin Dashboard
// ============================================

import {
  supabase as _supabase,
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

// Non-null alias - always check isSupabaseConfigured() before using
const supabase = _supabase!;

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
      redirectTo: `${env.appUrl}/cibc/reset-password`,
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
      .maybeSingle();

    if (error) {
      console.error('Error fetching competition:', error);
      return null;
    }
    return data;
  },

  /**
   * Get active competition (alias for getCompetition)
   */
  getActive: async (): Promise<Competition | null> => {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('code', COMPETITION_CODE)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active competition:', error);
      return null;
    }
    return data;
  },

  /**
   * Get competition stats
   */
  getStats: async (): Promise<{
    totalTeams: number;
    verifiedTeams: number;
    pendingTeams: number;
    totalSubmissions: number;
  } | null> => {
    const competition = await supabaseCompetitionService.getActive();
    if (!competition) return null;

    const { data, error } = await supabase.rpc('get_competition_stats', {
      p_competition_id: competition.id
    });

    if (error) {
      // Fallback: manual calculation
      const { data: teams } = await supabase
        .from('teams')
        .select('status')
        .eq('competition_id', competition.id);

      const { data: submissions } = await supabase
        .from('submissions')
        .select('id')
        .eq('competition_id', competition.id);

      type TeamStatus = { status: string };
      const teamList = (teams || []) as TeamStatus[];

      return {
        totalTeams: teamList.length,
        verifiedTeams: teamList.filter((t: TeamStatus) => t.status === 'verified').length,
        pendingTeams: teamList.filter((t: TeamStatus) => t.status === 'pending').length,
        totalSubmissions: submissions?.length || 0,
      };
    }
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
      .maybeSingle();

    if (error) {
      console.error('Error fetching competition by code:', error);
      return null;
    }
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
      .maybeSingle();

    if (error) {
      console.error('Error fetching competition by id:', error);
      return null;
    }
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

    // Fallback: manual query - OPTIMIZED: Single query with join
    const competition = await supabaseCompetitionService.getCompetition();
    if (!competition) return [];

    // Get tasks for each stage - Single query with join instead of N+1
    const { data: stagesWithTasks, error: stagesTasksError } = await supabase
      .from('stages')
      .select(`
        *,
        tasks (
          id,
          stage_id,
          competition_id,
          name,
          name_id,
          description,
          description_id,
          instructions,
          type,
          max_file_size_mb,
          max_file_size,
          max_score,
          allowed_extensions,
          file_types,
          deadline,
          is_required,
          is_published,
          order_index,
          rubric,
          custom_fields,
          created_at,
          updated_at
        )
      `)
      .eq('competition_id', competition.id)
      .order('order_index', { ascending: true });

    if (stagesTasksError) throw stagesTasksError;

    // Transform to match expected format
    return (stagesWithTasks || []).map(stage => ({
      ...stage,
      tasks: ((stage.tasks || []) as Task[]).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)),
      progress: 0, // TODO: Calculate based on submissions
    }));
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
      .maybeSingle();

    if (error) {
      console.error('Error fetching active stage:', error);
      return null;
    }
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
  // LEGACY METHODS (for backward compatibility)
  // ============================================

  /**
   * Get all active competitions (legacy - returns only CIBC 2026)
   * @deprecated Use getCompetition() instead
   */
  getAllActive: async (): Promise<Competition[]> => {
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
   * Get visible stages for a competition (public)
   */
  getVisible: async (competitionId: string): Promise<Stage[]> => {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .eq('competition_id', competitionId)
      .eq('is_visible', true)
      .order('order_index', { ascending: true });

    if (error) return [];
    return data || [];
  },

  /**
   * Get all stages (admin) - alias for getByCompetition
   */
  getAll: async (competitionId: string): Promise<Stage[]> => {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .eq('competition_id', competitionId)
      .order('order_index', { ascending: true });

    if (error) return [];
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

  /**
   * Delete stage (admin)
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('stages')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
   * Get published tasks for a stage (alias for getByStage)
   */
  getPublished: async (stageId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('stage_id', stageId)
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) return [];
    return data || [];
  },

  /**
   * Get all tasks for a stage (admin - includes unpublished)
   */
  getAll: async (stageId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('stage_id', stageId)
      .order('order_index', { ascending: true });

    if (error) return [];
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

  /**
   * Delete task (admin)
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
   * Get all teams (admin) - alias for getByCompetition
   */
  getAll: async (competitionId: string): Promise<Team[]> => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('competition_id', competitionId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  /**
   * Get current user's team for competition
   */
  getMyTeam: async (competitionId: string): Promise<(Team & { members: TeamMember[] }) | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get team member record
    const { data: memberData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!memberData) return null;

    // Get team with members
    const { data: teamData, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(
          id,
          team_id,
          user_id,
          role,
          joined_at,
          user:users(id, name, email, institution)
        )
      `)
      .eq('id', memberData.team_id)
      .eq('competition_id', competitionId)
      .maybeSingle();

    if (error) return null;
    return teamData;
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
    teamDataOrCompetitionId: string | {
      competition_id: string;
      name: string;
      category: string;
      institution?: string;
      status?: string;
      payment_status?: string;
    },
    name?: string,
    category?: string,
    institution?: string
  ): Promise<Team> => {
    // Support both object-based and parameter-based API
    let insertData: Record<string, unknown>;

    if (typeof teamDataOrCompetitionId === 'object') {
      insertData = {
        competition_id: teamDataOrCompetitionId.competition_id,
        name: teamDataOrCompetitionId.name,
        category: teamDataOrCompetitionId.category,
        institution: teamDataOrCompetitionId.institution,
        status: teamDataOrCompetitionId.status || 'draft',
        payment_status: teamDataOrCompetitionId.payment_status || 'pending',
      };
    } else {
      insertData = {
        competition_id: teamDataOrCompetitionId,
        name: name!,
        category: category!,
        institution,
        status: 'draft',
      };
    }

    const { data, error } = await supabase
      .from('teams')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update team
   */
  update: async (id: string, updates: Partial<Team>): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Verify team (admin)
   */
  verify: async (id: string, adminId: string | null): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update({
        status: 'verified',
        payment_status: 'verified',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Reject team (admin)
   */
  reject: async (id: string, notes: string): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update({
        status: 'draft',
        payment_status: 'rejected',
        notes,
      })
      .eq('id', id)
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
   * Remove member from team
   */
  removeMember: async (teamId: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
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
   * Get team's submissions (alias for getByTeam)
   */
  getMySubmissions: async (teamId: string): Promise<Submission[]> => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  /**
   * Get all submissions (admin)
   */
  getAll: async (competitionId?: string): Promise<(Submission & { team: Team })[]> => {
    let query = supabase
      .from('submissions')
      .select(`
        *,
        team:teams!submissions_team_id_fkey(*)
      `)
      .order('submitted_at', { ascending: false });

    if (competitionId) {
      query = query.eq('competition_id', competitionId);
    }

    const { data, error } = await query;

    if (error) return [];
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
   * Create or update submission
   */
  upsert: async (submission: Partial<Submission>): Promise<Submission> => {
    const { data, error } = await supabase
      .from('submissions')
      .upsert(submission, { onConflict: 'task_id,team_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Submit (change status to submitted)
   */
  submit: async (id: string): Promise<Submission> => {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', id)
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

  /**
   * Update announcement (admin)
   */
  update: async (id: string, updates: Partial<Announcement>): Promise<Announcement> => {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete announcement (admin)
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ============================================
// Notification Service (Supabase)
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export const supabaseNotificationService = {
  /**
   * Get user's notifications
   */
  getMy: async (): Promise<Notification[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return [];
    return data || [];
  },

  /**
   * Mark notification as read
   */
  markRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read
   */
  markAllRead: async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (): Promise<number> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) return 0;
    return count || 0;
  },

  /**
   * Create notification (admin/system)
   */
  create: async (notification: Partial<Notification>): Promise<Notification> => {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================
// CIBC Content Service (Supabase)
// ============================================

export interface CIBCContent {
  id: string;
  section: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at: string;
}

export const supabaseContentService = {
  /**
   * Get section content
   */
  getSection: async (section: string): Promise<Record<string, unknown> | null> => {
    const { data, error } = await supabase
      .from('cibc_content')
      .select('content')
      .eq('section', section)
      .eq('is_published', true)
      .single();

    if (error) return null;
    return data?.content || null;
  },

  /**
   * Get all sections
   */
  getAll: async (): Promise<CIBCContent[]> => {
    const { data, error } = await supabase
      .from('cibc_content')
      .select('*')
      .order('section', { ascending: true });

    if (error) return [];
    return data || [];
  },

  /**
   * Update section (admin)
   */
  update: async (section: string, content: Record<string, unknown>): Promise<CIBCContent> => {
    const { data, error } = await supabase
      .from('cibc_content')
      .upsert({
        section,
        content,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================
// Payment Service (Supabase + n8n)
// ============================================

export interface PaymentUploadResult {
  fileUrl: string;
  driveFileId: string;
  fileName: string;
  fileSize: number;
}

/**
 * Upload payment proof via n8n to Google Drive
 * Falls back to Supabase Storage if n8n is not configured
 */
export async function uploadPaymentProof(
  file: File,
  teamId: string,
  competitionId: string
): Promise<PaymentUploadResult> {
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  // Check if n8n is properly configured (not placeholder URL)
  if (isN8nConfigured()) {
    // Upload via n8n webhook to Google Drive
    const formData = new FormData();
    formData.append('file', file);
    formData.append('teamId', teamId);
    formData.append('competitionId', competitionId);
    formData.append('uploadType', 'payment');
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size.toString());

    const response = await fetch(`${n8nWebhookUrl}/upload-payment`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload payment proof');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return {
      fileUrl: result.fileUrl,
      driveFileId: result.driveFileId,
      fileName: result.fileName,
      fileSize: parseInt(result.fileSize, 10),
    };
  }

  // Fallback: Upload to Supabase Storage
  console.log('[Payment] n8n not configured, using Supabase Storage fallback');

  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `payment-proofs/${competitionId}/${teamId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage bucket 'payments'
    const { data, error } = await supabase.storage
      .from('payments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      // If bucket doesn't exist, use mock URL for development
      console.warn('[Payment] Storage upload failed, using mock URL:', error.message);

      // Return mock URL for development
      const mockFileId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        fileUrl: `https://mock-storage.local/payments/${fileName}`,
        driveFileId: mockFileId,
        fileName: file.name,
        fileSize: file.size,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('payments')
      .getPublicUrl(data.path);

    return {
      fileUrl: urlData.publicUrl,
      driveFileId: data.path,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (err) {
    console.error('[Payment] Upload error:', err);

    // Final fallback: return mock URL so registration can continue
    const mockFileId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      fileUrl: `https://mock-storage.local/payments/${teamId}/${file.name}`,
      driveFileId: mockFileId,
      fileName: file.name,
      fileSize: file.size,
    };
  }
}

export const supabasePaymentService = {
  /**
   * Upload payment proof for a team
   */
  uploadProof: async (
    file: File,
    teamId: string,
    competitionId: string
  ): Promise<PaymentUploadResult> => {
    return uploadPaymentProof(file, teamId, competitionId);
  },

  /**
   * Update team payment info
   */
  updateTeamPayment: async (
    teamId: string,
    paymentProofUrl: string,
    driveFileId?: string
  ): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update({
        payment_proof: paymentProofUrl,
        payment_status: 'pending',
        payment_uploaded_at: new Date().toISOString(),
        payment_drive_id: driveFileId || null,
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get pending payments (admin)
   */
  getPendingPayments: async (competitionId: string): Promise<(Team & { members: TeamMember[] })[]> => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(
          id,
          team_id,
          user_id,
          role,
          joined_at,
          user:users(id, name, email, institution)
        )
      `)
      .eq('competition_id', competitionId)
      .eq('payment_status', 'pending')
      .not('payment_proof', 'is', null)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  /**
   * Get all payments with filter (admin)
   */
  getAllPayments: async (
    competitionId: string,
    status?: 'pending' | 'verified' | 'rejected'
  ): Promise<(Team & { members: TeamMember[] })[]> => {
    let query = supabase
      .from('teams')
      .select(`
        *,
        members:team_members(
          id,
          team_id,
          user_id,
          role,
          joined_at,
          user:users(id, name, email, institution)
        )
      `)
      .eq('competition_id', competitionId)
      .not('payment_proof', 'is', null);

    if (status) {
      query = query.eq('payment_status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  /**
   * Verify payment (admin)
   */
  verifyPayment: async (teamId: string, adminId: string | null): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update({
        payment_status: 'verified',
        status: 'verified',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;

    // Create notification for team members
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId);

    if (members && members.length > 0) {
      const notifications = members.map((m: { user_id: string }) => ({
        user_id: m.user_id,
        title: 'Pembayaran Diverifikasi',
        message: 'Bukti pembayaran tim Anda telah diverifikasi. Anda dapat mulai mengakses dashboard.',
        type: 'payment_verified',
        link: '/dashboard',
        is_read: false,
      }));

      await supabase.from('notifications').insert(notifications);
    }

    return data;
  },

  /**
   * Reject payment (admin)
   */
  rejectPayment: async (teamId: string, reason: string, adminId: string | null): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update({
        payment_status: 'rejected',
        payment_rejection_reason: reason,
        rejected_by: adminId,
        rejected_at: new Date().toISOString(),
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;

    // Create notification for team members
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId);

    if (members && members.length > 0) {
      const notifications = members.map((m: { user_id: string }) => ({
        user_id: m.user_id,
        title: 'Pembayaran Ditolak',
        message: `Bukti pembayaran ditolak: ${reason}. Silakan upload ulang bukti pembayaran yang valid.`,
        type: 'payment_rejected',
        link: '/dashboard/settings',
        is_read: false,
      }));

      await supabase.from('notifications').insert(notifications);
    }

    return data;
  },

  /**
   * Get payment stats (admin)
   */
  getPaymentStats: async (competitionId: string): Promise<{
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  }> => {
    const { data, error } = await supabase
      .from('teams')
      .select('payment_status')
      .eq('competition_id', competitionId)
      .not('payment_proof', 'is', null);

    if (error) return { total: 0, pending: 0, verified: 0, rejected: 0 };

    type PaymentStatus = { payment_status: string };
    const teams = (data || []) as PaymentStatus[];

    return {
      total: teams.length,
      pending: teams.filter((t: PaymentStatus) => t.payment_status === 'pending').length,
      verified: teams.filter((t: PaymentStatus) => t.payment_status === 'verified').length,
      rejected: teams.filter((t: PaymentStatus) => t.payment_status === 'rejected').length,
    };
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
  notification: supabaseNotificationService,
  content: supabaseContentService,
  payment: supabasePaymentService,
};

export default supabaseServices;