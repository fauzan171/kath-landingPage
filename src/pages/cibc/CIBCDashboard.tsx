/**
 * CIBC Power by KATH - Dashboard
 *
 * Main dashboard for registered participants
 * Connected to Supabase for real data
 * Color Theme: Cream (#E6DDC5) & Black
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, FileText, Users, Bell, Settings,
  CheckCircle2, AlertCircle,
  Target, Leaf, LogOut, UserPlus, Calendar, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import { isSupabaseConfigured } from '@/config/environment';
import { supabase } from '@/lib/supabase';
import {
  competitionService,
  stagesService,
  teamsService,
  submissionsService,
  announcementsService,
  notificationsService,
} from '@/services/cibc.service';

// Types
interface TeamMember {
  id: string;
  user_id: string;
  role: 'leader' | 'member';
  user?: {
    id: string;
    name: string;
    email: string;
    institution?: string;
  };
}

interface Team {
  id: string;
  name: string;
  team_code: string;
  category: 'student' | 'open';
  status: 'draft' | 'pending' | 'verified' | 'disqualified';
  payment_status: 'pending' | 'verified' | 'rejected';
  institution?: string;
}

interface Stage {
  id: string;
  name: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

interface Submission {
  id: string;
  status: 'draft' | 'submitted' | 'late' | 'graded';
  file_name?: string;
  total_score?: number;
  feedback?: string;
  created_at: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  published_at?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Current user type from localStorage
interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  category?: string;
  teamId?: string;
  role?: string;
}

// Dashboard sections
type DashboardSection = 'overview' | 'team' | 'submission' | 'resources' | 'settings';

const CIBCDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      // First check localStorage for session
      const storedUser = localStorage.getItem('cibc_current_user');

      if (!storedUser) {
        // Check Supabase session
        if (isSupabaseConfigured() && supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            navigate('/cibc/login');
            return;
          }
          // Create user from Supabase session
          const newUser: CurrentUser = {
            id: user.id,
            email: user.email || '',
            fullName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          };
          localStorage.setItem('cibc_current_user', JSON.stringify(newUser));
          setCurrentUser(newUser);
        } else {
          navigate('/cibc/login');
          return;
        }
      } else {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          navigate('/cibc/login');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  // Load data when user is set
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadData = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get competition
      const comp = await competitionService.getActive();
      if (!comp) {
        toast.error(language === 'id' ? 'Kompetisi tidak ditemukan' : 'Competition not found');
        setIsLoading(false);
        return;
      }

      // Load stages
      const stagesData = await stagesService.getVisible(comp.id);
      setStages(stagesData);

      // Load team if user has one
      const teamData = await teamsService.getMyTeam(comp.id);
      if (teamData) {
        setTeam({
          id: teamData.id,
          name: teamData.name,
          team_code: teamData.team_code,
          category: teamData.category,
          status: teamData.status,
          payment_status: teamData.payment_status,
          institution: teamData.institution,
        });
        setTeamMembers(teamData.members || []);

        // Load submissions for team
        const subs = await submissionsService.getMySubmissions(teamData.id);
        setSubmissions(subs);

        // Update current user with team ID
        if (currentUser && !currentUser.teamId) {
          const updatedUser: CurrentUser = {
            ...currentUser,
            teamId: teamData.id,
          };
          localStorage.setItem('cibc_current_user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
      }

      // Load announcements
      const announcementsData = await announcementsService.getPublished(comp.id);
      setAnnouncements(announcementsData);

      // Load notifications
      const notifs = await notificationsService.getMy();
      setNotifications(notifs);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error(language === 'id' ? 'Gagal memuat data' : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('cibc_current_user');
    navigate('/cibc');
  }, [navigate]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Calculate progress
  const progressPercentage = team ? (
    (team.status === 'verified' ? 40 : 20) +
    (submissions.some(s => s.status !== 'draft') ? 30 : 0) +
    (submissions.some(s => s.status === 'graded') ? 30 : 0)
  ) : 0;

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cibc-bgMain flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cibc-primary animate-spin mx-auto mb-4" />
          <p className="font-body text-cibc-textSecondary">
            {language === 'id' ? 'Memuat...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cibc-bgMain">
      {/* Header */}
      <header className="bg-cibc-bgCard border-b border-cibc-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cibc-primary flex items-center justify-center">
                <span className="text-cibc-textDark font-display font-bold">C</span>
              </div>
              <div>
                <h1 className="font-display text-lg text-white">CIBC Power</h1>
                <p className="text-xs text-cibc-textMuted font-body">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{currentUser?.fullName}</p>
                <p className="text-xs text-cibc-textMuted">{currentUser?.email}</p>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-cibc-textSecondary hover:text-white">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-cibc-primary rounded-full" />
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-cibc-textSecondary hover:text-cibc-primary"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-4 sticky top-24">
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: language === 'id' ? 'Ikhtisar' : 'Overview', icon: Target },
                  { id: 'team', label: language === 'id' ? 'Tim' : 'Team', icon: Users },
                  { id: 'submission', label: 'Submission', icon: FileText },
                  { id: 'resources', label: language === 'id' ? 'Sumber Daya' : 'Resources', icon: Leaf },
                  { id: 'settings', label: language === 'id' ? 'Pengaturan' : 'Settings', icon: Settings },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as DashboardSection)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-cibc-primary/10 text-cibc-primary'
                        : 'text-cibc-textSecondary hover:bg-cibc-bgSection'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-body text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-cibc-textDark to-cibc-bgCard rounded-2xl p-6 border border-cibc-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl mb-1 text-white">
                        {language === 'id' ? `Selamat Datang, ${currentUser?.fullName?.split(' ')[0]}!` : `Welcome, ${currentUser?.fullName?.split(' ')[0]}!`}
                      </h2>
                      <p className="font-body text-cibc-textSecondary">
                        {team?.name || language === 'id' ? 'Buat tim Anda untuk memulai' : 'Create your team to get started'}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-cibc-primary/20 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-cibc-primary" />
                    </div>
                  </div>
                </div>

                {/* Team Status Card */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-white">
                      {language === 'id' ? 'Status Registrasi' : 'Registration Status'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-body ${
                      team?.status === 'verified' ? 'bg-cibc-success/20 text-cibc-success' :
                      team?.status === 'pending' ? 'bg-cibc-warning/20 text-cibc-warning' :
                      'bg-cibc-textMuted/20 text-cibc-textMuted'
                    }`}>
                      {team?.status === 'verified' ? (language === 'id' ? 'Terverifikasi' : 'Verified') :
                       team?.status === 'pending' ? (language === 'id' ? 'Menunggu' : 'Pending') :
                       (language === 'id' ? 'Belum Terdaftar' : 'Not Registered')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-cibc-bgSection rounded-full h-3 mb-6">
                    <div
                      className="bg-cibc-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {/* Progress Steps */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: language === 'id' ? 'Akun Dibuat' : 'Account Created', done: !!currentUser },
                      { label: language === 'id' ? 'Tim Terbentuk' : 'Team Formed', done: !!team },
                      { label: language === 'id' ? 'Registrasi Diverifikasi' : 'Registration Verified', done: team?.status === 'verified' },
                      { label: language === 'id' ? 'Submission Selesai' : 'Submission Complete', done: submissions.some(s => s.status !== 'draft') },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.done ? 'bg-cibc-primary' : 'bg-cibc-bgSection border border-cibc-border'
                        }`}>
                          {item.done && <CheckCircle2 className="w-4 h-4 text-cibc-textDark" />}
                        </div>
                        <span className={`font-body text-sm ${item.done ? 'text-white' : 'text-cibc-textSecondary'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* No Team Warning */}
                  {!team && (
                    <div className="mt-6 p-4 bg-cibc-warning/10 border border-cibc-warning/30 rounded-lg">
                      <p className="font-body text-sm text-cibc-warning">
                        {language === 'id'
                          ? 'Anda belum terdaftar dalam tim. Silakan hubungi ketua tim atau daftarkan tim baru.'
                          : "You're not registered in a team yet. Contact your team leader or register a new team."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timeline Preview */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-4">
                    {language === 'id' ? 'Timeline Kompetisi' : 'Competition Timeline'}
                  </h3>
                  <div className="space-y-4">
                    {stages.slice(0, 4).map((stage, index) => (
                      <div key={stage.id || index} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          stage.is_active ? 'bg-cibc-primary' : 'bg-cibc-border'
                        }`} />
                        <div className="flex-1">
                          <p className="font-body text-sm text-white">{stage.name}</p>
                          {stage.start_date && (
                            <p className="font-body text-xs text-cibc-textMuted">
                              {new Date(stage.start_date).toLocaleDateString()}
                              {stage.end_date && ` - ${new Date(stage.end_date).toLocaleDateString()}`}
                            </p>
                          )}
                        </div>
                        {stage.is_active && (
                          <span className="px-2 py-1 bg-cibc-primary/20 text-cibc-primary text-xs rounded-full font-body">
                            {language === 'id' ? 'Aktif' : 'Active'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Announcements */}
                {announcements.length > 0 && (
                  <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg text-white">
                        {language === 'id' ? 'Pengumuman' : 'Announcements'}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {announcements.slice(0, 3).map(announcement => (
                        <div key={announcement.id} className="p-4 bg-cibc-bgSection rounded-lg">
                          <h4 className="font-body font-medium text-white">{announcement.title}</h4>
                          <p className="font-body text-sm text-cibc-textSecondary mt-1 line-clamp-2">{announcement.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {notifications.length > 0 && (
                  <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg text-white">
                        {language === 'id' ? 'Notifikasi' : 'Notifications'}
                      </h3>
                      {unreadNotifications > 0 && (
                        <span className="text-cibc-primary text-sm font-body cursor-pointer hover:underline">
                          {language === 'id' ? `Tandai semua dibaca` : 'Mark all read'}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {notifications.slice(0, 3).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            notif.is_read ? 'bg-cibc-bgSection' : 'bg-cibc-primary/5 border border-cibc-primary/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.is_read ? 'bg-cibc-border' : 'bg-cibc-primary'
                            }`} />
                            <div>
                              <p className="font-body text-sm text-white">{notif.title}</p>
                              <p className="font-body text-xs text-cibc-textMuted mt-1">{notif.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Team Section */}
            {activeSection === 'team' && (
              <div className="space-y-6">
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg text-white">
                      {language === 'id' ? 'Informasi Tim' : 'Team Information'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-body ${
                      team?.status === 'verified' ? 'bg-cibc-success/20 text-cibc-success' :
                      team?.status === 'pending' ? 'bg-cibc-warning/20 text-cibc-warning' :
                      'bg-cibc-textMuted/20 text-cibc-textMuted'
                    }`}>
                      {team?.status === 'verified' ? (language === 'id' ? 'Terverifikasi' : 'Verified') :
                       team?.status === 'pending' ? (language === 'id' ? 'Menunggu' : 'Pending') :
                       (language === 'id' ? 'Draft' : 'Draft')}
                    </span>
                  </div>

                  {team ? (
                    <div className="space-y-4">
                      <div>
                        <label className="font-body text-sm text-cibc-textMuted">
                          {language === 'id' ? 'Nama Tim' : 'Team Name'}
                        </label>
                        <p className="font-display text-xl text-white mt-1">{team.name}</p>
                      </div>
                      <div>
                        <label className="font-body text-sm text-cibc-textMuted">
                          {language === 'id' ? 'Kode Undangan' : 'Invite Code'}
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="px-3 py-2 bg-cibc-bgSection rounded-lg font-body text-cibc-primary">
                            {team.team_code}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(team.team_code);
                              toast.success(language === 'id' ? 'Kode disalin!' : 'Code copied!');
                            }}
                            className="px-3 py-2 text-cibc-primary hover:bg-cibc-primary/10 rounded-lg font-body text-sm"
                          >
                            {language === 'id' ? 'Salin' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-sm text-cibc-textMuted">
                          {language === 'id' ? 'Kategori' : 'Category'}
                        </label>
                        <p className="font-body text-white mt-1 capitalize">{team.category}</p>
                      </div>
                      {team.institution && (
                        <div>
                          <label className="font-body text-sm text-cibc-textMuted">
                            {language === 'id' ? 'Institusi' : 'Institution'}
                          </label>
                          <p className="font-body text-white mt-1">{team.institution}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-cibc-textMuted mx-auto mb-4" />
                      <p className="font-body text-cibc-textSecondary">
                        {language === 'id' ? 'Anda belum bergabung dengan tim' : "You haven't joined a team yet"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Team Members */}
                {team && (
                  <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-lg text-white">
                        {language === 'id' ? 'Anggota Tim' : 'Team Members'}
                      </h3>
                      <span className="font-body text-sm text-cibc-textSecondary">
                        {teamMembers.length} / {team.category === 'open' ? 10 : 5}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-cibc-bgSection rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cibc-primary/20 flex items-center justify-center">
                              <span className="font-display text-cibc-primary">
                                {member.user?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-body text-white">{member.user?.name || 'Unknown'}</p>
                              <p className="font-body text-xs text-cibc-textMuted">{member.user?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {member.role === 'leader' && (
                              <span className="px-2 py-1 bg-cibc-primary/20 text-cibc-primary text-xs rounded-full font-body">
                                Leader
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Invite Button */}
                    {teamMembers.length < (team.category === 'open' ? 10 : 5) && (
                      <button className="w-full mt-4 py-3 border-2 border-dashed border-cibc-border rounded-lg text-cibc-textSecondary hover:border-cibc-primary hover:text-cibc-primary transition-colors font-body flex items-center justify-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        {language === 'id' ? 'Undang Anggota' : 'Invite Member'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submission Section */}
            {activeSection === 'submission' && (
              <div className="space-y-6">
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-6">
                    {language === 'id' ? 'Status Submission' : 'Submission Status'}
                  </h3>

                  {team ? (
                    submissions.length > 0 ? (
                      <div className="space-y-4">
                        {submissions.map(submission => (
                          <div key={submission.id} className="p-4 bg-cibc-bgSection rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-body ${
                                submission.status === 'graded' ? 'bg-cibc-success/20 text-cibc-success' :
                                submission.status === 'submitted' ? 'bg-cibc-info/20 text-cibc-info' :
                                'bg-cibc-warning/20 text-cibc-warning'
                              }`}>
                                {submission.status.toUpperCase()}
                              </span>
                              {submission.total_score !== undefined && (
                                <span className="font-display text-cibc-primary">{submission.total_score}/100</span>
                              )}
                            </div>
                            {submission.file_name && (
                              <p className="font-body text-sm text-white">{submission.file_name}</p>
                            )}
                            {submission.feedback && (
                              <p className="font-body text-xs text-cibc-textMuted mt-2">{submission.feedback}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-cibc-textMuted mx-auto mb-4" />
                        <p className="font-body text-cibc-textSecondary">
                          {language === 'id' ? 'Belum ada submission' : 'No submissions yet'}
                        </p>
                        <button className="mt-4 px-6 py-2 bg-cibc-primary text-cibc-textDark rounded-lg font-body text-sm hover:bg-cibc-primaryDark transition-colors">
                          {language === 'id' ? 'Buat Submission' : 'Create Submission'}
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-cibc-textMuted mx-auto mb-4" />
                      <p className="font-body text-cibc-textSecondary">
                        {language === 'id' ? 'Daftar tim terlebih dahulu untuk mengirim submission' : 'Register a team first to submit'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resources Section */}
            {activeSection === 'resources' && (
              <div className="space-y-6">
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-6">
                    {language === 'id' ? 'Panduan & Template' : 'Guides & Templates'}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'BMC Template', desc: language === 'id' ? 'Template Business Model Canvas' : 'Business Model Canvas Template' },
                      { title: 'Pitch Deck Guide', desc: language === 'id' ? 'Panduan membuat pitch deck' : 'Pitch deck creation guide' },
                      { title: 'Judging Criteria', desc: language === 'id' ? 'Kriteria penilaian kompetisi' : 'Competition judging criteria' },
                      { title: 'SDG Guidelines', desc: language === 'id' ? 'Panduan keselarasan SDG' : 'SDG alignment guidelines' },
                    ].map((resource, index) => (
                      <div key={index} className="p-4 bg-cibc-bgSection rounded-lg hover:bg-cibc-border transition-colors cursor-pointer">
                        <h4 className="font-body font-medium text-white mb-1">{resource.title}</h4>
                        <p className="font-body text-sm text-cibc-textMuted">{resource.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workshop Schedule */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-6">
                    {language === 'id' ? 'Jadwal Workshop' : 'Workshop Schedule'}
                  </h3>

                  <div className="space-y-4">
                    {[
                      { title: 'BMC Fundamentals', date: '15 Jan 2026', time: '14:00 WIB' },
                      { title: 'Pitch Perfect', date: '22 Jan 2026', time: '14:00 WIB' },
                      { title: 'Sustainability in Business', date: '29 Jan 2026', time: '14:00 WIB' },
                    ].map((workshop, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-cibc-bgSection rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-cibc-primary" />
                          <div>
                            <p className="font-body text-white">{workshop.title}</p>
                            <p className="font-body text-xs text-cibc-textMuted">{workshop.date} • {workshop.time}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 text-cibc-primary font-body text-sm hover:underline">
                          {language === 'id' ? 'Daftar' : 'Register'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-6">
                    {language === 'id' ? 'Pengaturan Akun' : 'Account Settings'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-sm text-cibc-textMuted">Email</label>
                      <p className="font-body text-white mt-1">{currentUser?.email}</p>
                    </div>
                    <div>
                      <label className="font-body text-sm text-cibc-textMuted">
                        {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                      </label>
                      <p className="font-body text-white mt-1">{currentUser?.fullName}</p>
                    </div>
                    {currentUser?.category && (
                      <div>
                        <label className="font-body text-sm text-cibc-textMuted">
                          {language === 'id' ? 'Kategori' : 'Category'}
                        </label>
                        <p className="font-body text-white mt-1 capitalize">{currentUser.category}</p>
                      </div>
                    )}
                  </div>

                  <button className="mt-6 px-6 py-2 bg-cibc-primary text-cibc-textDark rounded-lg font-body text-sm hover:bg-cibc-primaryDark transition-colors">
                    {language === 'id' ? 'Edit Profil' : 'Edit Profile'}
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-cibc-bgCard border border-cibc-error/30 rounded-xl p-6">
                  <h3 className="font-display text-lg text-cibc-error mb-4">
                    {language === 'id' ? 'Zona Bahaya' : 'Danger Zone'}
                  </h3>
                  <p className="font-body text-cibc-textSecondary mb-4">
                    {language === 'id'
                      ? 'Tindakan di bawah ini tidak dapat dibatalkan.'
                      : 'Actions below cannot be undone.'}
                  </p>
                  <button className="px-6 py-2 bg-cibc-error/20 text-cibc-error border border-cibc-error/30 rounded-lg font-body text-sm hover:bg-cibc-error/30 transition-colors">
                    {language === 'id' ? 'Hapus Akun' : 'Delete Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CIBCDashboard;