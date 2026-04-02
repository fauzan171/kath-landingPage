import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';

// Import komponen yang sudah dipisah
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import OverviewSection from './sections/OverviewSection';
import TeamSection from './sections/TeamSection';
import SubmissionSection from './sections/SubmissionSection';
import ResourcesSection from './sections/ResourcesSection';
import SettingsSection from './sections/SettingsSection';

// Import services
import { supabase } from '@/lib/supabase';
import { competitionService, stagesService, teamsService, submissionsService, announcementsService, notificationsService } from '@/services/cibc.service';

// --- TYPE DEFINITIONS ---
export type DashboardSection = 'overview' | 'team' | 'submission' | 'resources' | 'settings';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  category?: string;
  role?: string;
  teamId?: string;
  teamName?: string;
  institution?: string;
}

export interface TeamData {
  id: string;
  name: string;
  category: 'student' | 'startup' | 'corporate' | 'open';
  institution: string;
  status: string;
  team_code: string;
  total_score?: number;
}

export interface StageData {
  id: string;
  name: string;
  name_id?: string;
  description?: string;
  order_index: number;
  start_date?: string;
  end_date?: string;
  status: string;
  is_active: boolean;
  tasks?: TaskData[];
  teamProgress?: number;
}

export interface TaskData {
  id: string;
  name: string;
  stage_id: string;
  deadline?: string;
  is_required?: boolean;
}

export interface SubmissionData {
  id: string;
  task_id: string;
  team_id: string;
  file_url?: string;
  file_name?: string;
  status: string;
  total_score?: number;
  feedback?: string;
  criteria_scores?: Record<string, number>;
  submitted_at?: string;
  graded_at?: string;
  task?: TaskData;
}

export interface AnnouncementData {
  id: string;
  title: string;
  title_id?: string;
  content: string;
  content_id?: string;
  type: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

const CIBCDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // --- STATE MANAGEMENT ---
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data States
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [stages, setStages] = useState<StageData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [competition, setCompetition] = useState<any>(null);

  // --- LOAD ALL DATA ---
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Supabase tidak terkonfigurasi. Periksa file .env');
      }

      // Get current user session
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.log('No authenticated user, redirecting to login');
        navigate('/cibc/login');
        return;
      }

      // Set basic user info
      setCurrentUser({
        id: user.id,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Peserta',
        email: user.email || '',
      });

      // Get active competition
      const comp = await competitionService.getActive();
      if (!comp) {
        throw new Error('Kompetisi tidak ditemukan');
      }
      setCompetition(comp);

      // Get user's team
      const teamData = await teamsService.getMyTeam(comp.id);
      if (teamData) {
        setTeam({
          id: teamData.id,
          name: teamData.name,
          category: (teamData.category || 'student') as 'student' | 'startup' | 'corporate' | 'open',
          institution: teamData.institution || '',
          status: teamData.status,
          team_code: teamData.team_code,
          total_score: (teamData as any).total_score,
        });

        // Update current user with team info
        setCurrentUser(prev => prev ? {
          ...prev,
          teamId: teamData.id,
          teamName: teamData.name,
          category: teamData.category,
          institution: teamData.institution,
        } : null);

        // Load submissions for this team
        const teamSubmissions = await submissionsService.getMySubmissions(teamData.id);
        setSubmissions(teamSubmissions);
      }

      // Get stages
      const stagesData = await stagesService.getVisible(comp.id);
      setStages(stagesData.map(s => ({
        id: s.id,
        name: s.name,
        name_id: s.name_id,
        description: s.description,
        order_index: s.order_index,
        start_date: s.start_date,
        end_date: s.end_date,
        status: 'draft',
        is_active: s.is_active,
      })));

      // Get all tasks from all stages
      const allTasks: TaskData[] = [];
      for (const stage of stagesData) {
        const stageTasks = await import('@/services/cibc.service').then(m => m.tasksService.getPublished(stage.id));
        allTasks.push(...stageTasks.map(t => ({
          ...t,
          is_required: t.is_required ?? true,
        })));
      }
      setTasks(allTasks);

      // Get announcements
      const announcementsData = await announcementsService.getPublished(comp.id);
      setAnnouncements(announcementsData);

      // Get notifications
      const notifData = await notificationsService.getMy();
      setNotifications(notifData);

    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Gagal memuat data');
      toast.error(err.message || 'Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // --- HANDLERS ---
  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('cibc_current_user');
      toast.success(language === 'id' ? 'Berhasil logout' : 'Logged out successfully');
      navigate('/cibc/login');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error(language === 'id' ? 'Gagal logout' : 'Failed to logout');
    }
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await notificationsService.markRead(notifId);
      setNotifications(prev =>
        prev.map(notif => notif.id === notifId ? { ...notif, is_read: true } : notif)
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success(language === 'id' ? 'Semua notifikasi ditandai sudah dibaca' : 'All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // --- DERIVED STATE ---
  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  // Calculate progress based on submissions vs required tasks
  const calculateProgress = () => {
    if (!tasks.length) return 0;
    const requiredTasks = tasks.filter(t => t.is_required);
    if (!requiredTasks.length) return 0;

    const completedTasks = submissions.filter(s =>
      s.status === 'submitted' || s.status === 'graded'
    ).length;

    return Math.round((completedTasks / requiredTasks.length) * 100);
  };

  const progressPercentage = calculateProgress();

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FFB22C] animate-spin mx-auto mb-4" />
          <p className="font-body font-medium text-[#0F0F0F]/60">
            {language === 'id' ? 'Memuat Dashboard...' : 'Loading Dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-[#0F0F0F] mb-2">
            {language === 'id' ? 'Terjadi Kesalahan' : 'Error Occurred'}
          </h2>
          <p className="font-body text-[#0F0F0F]/60 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadDashboardData}
              className="px-6 py-3 bg-[#FFB22C] text-[#0F0F0F] rounded-xl font-body font-bold hover:bg-[#FFB22C]/90"
            >
              {language === 'id' ? 'Coba Lagi' : 'Try Again'}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-200 text-[#0F0F0F] rounded-xl font-body font-bold hover:bg-gray-300"
            >
              {language === 'id' ? 'Logout' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <DashboardHeader
        currentUser={currentUser}
        unreadNotifications={unreadNotifications}
        handleLogout={handleLogout}
        handleMarkAsRead={handleMarkAsRead}
        handleMarkAllRead={handleMarkAllRead}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8 items-start relative">
          <DashboardSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          <div className="lg:col-span-3">
            {activeSection === 'overview' && (
              <OverviewSection
                currentUser={currentUser}
                team={team}
                stages={stages}
                tasks={tasks}
                submissions={submissions}
                announcements={announcements}
                notifications={notifications}
                progressPercentage={progressPercentage}
                unreadNotifications={unreadNotifications}
                handleMarkAsRead={handleMarkAsRead}
                handleMarkAllRead={handleMarkAllRead}
                competition={competition}
              />
            )}

            {activeSection === 'team' && (
              <TeamSection
                team={team}
                currentUser={currentUser}
                onRefresh={loadDashboardData}
              />
            )}

            {activeSection === 'submission' && (
              <SubmissionSection
                team={team}
                submissions={submissions}
                tasks={tasks}
                stages={stages}
                competition={competition}
                currentUser={currentUser}
                onRefresh={loadDashboardData}
              />
            )}

            {activeSection === 'resources' && (
              <ResourcesSection competition={competition} />
            )}

            {activeSection === 'settings' && (
              <SettingsSection
                currentUser={currentUser}
                onRefresh={loadDashboardData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CIBCDashboard;