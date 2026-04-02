// ============================================
// CIBC Competition Service
// ============================================
// Service for managing competition data
// ============================================

import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export interface Competition {
  id: string;
  code: string;
  name: string;
  name_id?: string;
  description?: string;
  description_id?: string;
  theme?: string;
  theme_id?: string;
  registration_start?: string;
  registration_end?: string;
  competition_start?: string;
  competition_end?: string;
  is_active: boolean;
  config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: string;
  competition_id: string;
  name: string;
  name_id?: string;
  description?: string;
  description_id?: string;
  order_index: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  stage_id: string;
  competition_id?: string;
  name: string;
  name_id?: string;
  description?: string;
  description_id?: string;
  type: 'file_upload' | 'text' | 'link' | 'presentation';
  file_types?: string[];
  max_file_size?: number;
  deadline?: string;
  max_score?: number;
  is_required?: boolean;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  competition_id: string;
  name: string;
  team_code: string;
  category: 'student' | 'open';
  institution?: string;
  status: 'draft' | 'pending' | 'verified' | 'disqualified';
  payment_proof?: string;
  payment_status: 'pending' | 'verified' | 'rejected';
  documents?: Record<string, unknown>;
  notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'leader' | 'member';
  joined_at: string;
  // Joined data
  user?: {
    id: string;
    name: string;
    email: string;
    institution?: string;
  };
}

export interface Submission {
  id: string;
  task_id: string;
  team_id: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  content?: string;
  link_url?: string;
  status: 'draft' | 'submitted' | 'late' | 'graded' | 'needs_revision' | 'under_review';
  submitted_at?: string;
  total_score?: number;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
  is_late?: boolean;
  criteria_scores?: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  competition_id: string;
  title: string;
  title_id?: string;
  content: string;
  content_id?: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  is_published: boolean;
  published_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

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

export interface CIBCContent {
  id: string;
  section: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at: string;
}

// ============================================
// COMPETITION SERVICE
// ============================================

export const competitionService = {
  /**
   * Get active competition (CIBC 2026)
   */
  async getActive(): Promise<Competition | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('code', 'cibc-2026')
      .eq('is_active', true)
      .single();
    if (error) return null;
    return data;
  },

  /**
   * Get competition by ID
   */
  async getById(id: string): Promise<Competition | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  },

  /**
   * Get competition stats
   */
  async getStats(): Promise<{
    totalTeams: number;
    verifiedTeams: number;
    pendingTeams: number;
    totalSubmissions: number;
  } | null> {
    if (!supabase) return null;
    const competition = await this.getActive();
    if (!competition) return null;

    const { data, error } = await supabase.rpc('get_competition_stats', {
      p_competition_id: competition.id
    });

    if (error) return null;
    return data;
  },
};

// ============================================
// STAGES SERVICE
// ============================================

export const stagesService = {
  /**
   * Get all visible stages for competition
   */
  async getVisible(competitionId: string): Promise<Stage[]> {
    if (!supabase) return [];
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
   * Get all stages (admin)
   */
  async getAll(_competitionId?: string): Promise<Stage[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .eq('competition_id', _competitionId)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  /**
   * Create stage (admin)
   */
  async create(stage: Partial<Stage>): Promise<Stage> {
    if (!supabase) throw new Error('Supabase not configured');
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
  async update(id: string, updates: Partial<Stage>): Promise<Stage> {
    if (!supabase) throw new Error('Supabase not configured');
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
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('stages').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// TASKS SERVICE
// ============================================

export const tasksService = {
  /**
   * Get published tasks for a stage
   */
  async getPublished(stageId: string): Promise<Task[]> {
    if (!supabase) return [];
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
   * Get all tasks for a stage (admin)
   */
  async getAll(stageId: string): Promise<Task[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('stage_id', stageId)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  /**
   * Create task (admin)
   */
  async create(task: Partial<Task>): Promise<Task> {
    if (!supabase) throw new Error('Supabase not configured');
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
  async update(id: string, updates: Partial<Task>): Promise<Task> {
    if (!supabase) throw new Error('Supabase not configured');
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
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// TEAMS SERVICE
// ============================================

export const teamsService = {
  /**
   * Get user's team for competition
   */
  async getMyTeam(competitionId: string): Promise<(Team & { members: TeamMember[] }) | null> {
    if (!supabase) return null;
    const user = await supabase.auth.getUser();
    if (!user.data.user) return null;

    // Get team member record
    const { data: memberData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.data.user.id)
      .single();

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
      .single();

    if (error) return null;
    return teamData;
  },

  /**
   * Get all teams (admin)
   */
  async getAll(competitionId: string): Promise<Team[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('competition_id', competitionId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  /**
   * Create team
   */
  async create(team: Partial<Team>, leaderUserId: string): Promise<Team> {
    if (!supabase) throw new Error('Supabase not configured');

    // Create team
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single();

    if (teamError) throw teamError;

    // Add leader as member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: teamData.id,
        user_id: leaderUserId,
        role: 'leader'
      });

    if (memberError) throw memberError;

    return teamData;
  },

  /**
   * Update team
   */
  async update(id: string, updates: Partial<Team>): Promise<Team> {
    if (!supabase) throw new Error('Supabase not configured');
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
  async verify(id: string, adminId: string): Promise<Team> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('teams')
      .update({
        status: 'verified',
        payment_status: 'verified',
        verified_by: adminId,
        verified_at: new Date().toISOString()
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
  async reject(id: string, notes: string): Promise<Team> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('teams')
      .update({
        status: 'draft',
        payment_status: 'rejected',
        notes
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Add member to team
   */
  async addMember(teamId: string, userId: string, role: 'leader' | 'member' = 'member'): Promise<TeamMember> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userId,
        role
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, userId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);
    if (error) throw error;
  },
};

// ============================================
// SUBMISSIONS SERVICE
// ============================================

export const submissionsService = {
  /**
   * Get team's submissions
   */
  async getMySubmissions(teamId: string): Promise<Submission[]> {
    if (!supabase) return [];
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
  async getAll(_competitionId?: string): Promise<(Submission & { team: Team })[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        team:teams!submissions_team_id_fkey(*)
      `)
      .order('submitted_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  /**
   * Create or update submission
   */
  async upsert(submission: Partial<Submission>): Promise<Submission> {
    if (!supabase) throw new Error('Supabase not configured');
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
  async submit(id: string): Promise<Submission> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Grade submission (admin)
   */
  async grade(id: string, score: number, feedback: string, graderId: string): Promise<Submission> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('submissions')
      .update({
        total_score: score,
        feedback,
        graded_by: graderId,
        graded_at: new Date().toISOString(),
        status: 'graded'
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// ANNOUNCEMENTS SERVICE
// ============================================

export const announcementsService = {
  /**
   * Get published announcements
   */
  async getPublished(competitionId: string): Promise<Announcement[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('competition_id', competitionId)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  /**
   * Get all announcements (admin)
   */
  async getAll(competitionId: string): Promise<Announcement[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('competition_id', competitionId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  /**
   * Create announcement (admin)
   */
  async create(announcement: Partial<Announcement>): Promise<Announcement> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update announcement (admin)
   */
  async update(id: string, updates: Partial<Announcement>): Promise<Announcement> {
    if (!supabase) throw new Error('Supabase not configured');
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
   * Publish announcement (admin)
   */
  async publish(id: string): Promise<Announcement> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('announcements')
      .update({
        is_published: true,
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Delete announcement (admin)
   */
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// NOTIFICATIONS SERVICE
// ============================================

export const notificationsService = {
  /**
   * Get user's notifications
   */
  async getMy(): Promise<Notification[]> {
    if (!supabase) return [];
    const user = await supabase?.auth.getUser();
    if (!user?.data?.user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.data.user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) return [];
    return data || [];
  },

  /**
   * Mark as read
   */
  async markRead(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw error;
  },

  /**
   * Mark all as read
   */
  async markAllRead(): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.data.user.id)
      .eq('is_read', false);
    if (error) throw error;
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    if (!supabase) return 0;
    const user = await supabase?.auth.getUser();
    if (!user?.data?.user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.data.user.id)
      .eq('is_read', false);
    if (error) return 0;
    return count || 0;
  },
};

// ============================================
// CIBC CONTENT SERVICE
// ============================================

export const cibcContentService = {
  /**
   * Get section content
   */
  async getSection(section: string): Promise<Record<string, unknown> | null> {
    if (!supabase) return null;
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
  async getAll(): Promise<CIBCContent[]> {
    if (!supabase) return [];
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
  async update(section: string, content: Record<string, unknown>): Promise<CIBCContent> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('cibc_content')
      .upsert({
        section,
        content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'section' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// EXPORT ALL
// ============================================

export const cibcService = {
  competition: competitionService,
  stages: stagesService,
  tasks: tasksService,
  teams: teamsService,
  submissions: submissionsService,
  announcements: announcementsService,
  notifications: notificationsService,
  content: cibcContentService,
};

export default cibcService;