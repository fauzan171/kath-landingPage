import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, Trophy, FileText, Bell, Settings, LogOut, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { competitionService, stagesService, teamsService, submissionsService, announcementsService, notificationsService } from '@/services/cibc.service';
import type { Competition } from '@/lib/supabase';

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
  payment_status?: string;
  payment_proof?: string;
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
  submitted_at?: string;
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

const menuItems = [
  { id: 'overview', icon: Home, labelId: 'Ringkasan', labelEn: 'Overview' },
  { id: 'team', icon: Trophy, labelId: 'Tim', labelEn: 'Team' },
  { id: 'submission', icon: FileText, labelId: 'Submission', labelEn: 'Submission' },
  { id: 'resources', icon: FileText, labelId: 'Resource', labelEn: 'Resources' },
  { id: 'settings', icon: Settings, labelId: 'Pengaturan', labelEn: 'Settings' },
];

const CIBCDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [stages, setStages] = useState<StageData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [_competition, setCompetition] = useState<Competition | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error('Supabase tidak terkonfigurasi');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/cibc/login'); return; }
      setCurrentUser({ id: user.id, fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Peserta', email: user.email || '' });
      const comp = await competitionService.getActive();
      if (!comp) throw new Error('Kompetisi tidak ditemukan');
      setCompetition(comp);
      const teamData = await teamsService.getMyTeam(comp.id);
      if (teamData) {
        setTeam({ id: teamData.id, name: teamData.name, category: (teamData.category || 'student') as any, institution: teamData.institution || '', status: teamData.status, team_code: teamData.team_code || teamData.code || '', total_score: teamData.total_score });
        const teamSubmissions = await submissionsService.getMySubmissions(teamData.id);
        setSubmissions(teamSubmissions);
      }
      const stagesData = await stagesService.getVisible(comp.id);
      setStages(stagesData.map(s => ({ id: s.id, name: s.name, name_id: s.name_id, order_index: s.order_index, status: 'draft', is_active: s.is_active })));
      const allTasks: TaskData[] = [];
      for (const stage of stagesData) {
        const stageTasks = await import('@/services/cibc.service').then(m => m.tasksService.getPublished(stage.id));
        allTasks.push(...stageTasks.map(t => ({ ...t, is_required: t.is_required ?? true })));
      }
      setTasks(allTasks);
      setAnnouncements(await announcementsService.getPublished(comp.id));
      setNotifications(await notificationsService.getMy());
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
      toast.error(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally { setIsLoading(false); }
  }, [navigate]);

  useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

  const handleLogout = async () => {
    try { if (supabase) await supabase.auth.signOut(); localStorage.removeItem('cibc_current_user'); toast.success(language === 'id' ? 'Berhasil logout' : 'Logged out'); navigate('/cibc/login'); }
    catch (err) { toast.error(language === 'id' ? 'Gagal logout' : 'Failed logout'); }
  };

  const handleMarkAsRead = async (notifId: string) => { await notificationsService.markRead(notifId); setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)); };
  const handleMarkAllRead = async () => { await notificationsService.markAllRead(); setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))); toast.success(language === 'id' ? 'Semua dibaca' : 'All read'); };
  const unreadNotifications = notifications.filter(n => !n.is_read).length;
  const calculateProgress = () => { if (!tasks.length) return 0; const requiredTasks = tasks.filter(t => t.is_required); if (!requiredTasks.length) return 0; const completedTasks = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length; return Math.round((completedTasks / requiredTasks.length) * 100); };
  const progressPercentage = calculateProgress();

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center"><div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" /><p className="text-white/70 font-medium">Memuat...</p></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" /><h2 className="text-white font-bold text-xl mb-2">Terjadi Kesalahan</h2><p className="text-white/60 mb-6">{error}</p>
        <button onClick={loadDashboardData} className="px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400">Coba Lagi</button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection currentUser={currentUser} team={team} stages={stages} tasks={tasks} submissions={submissions} announcements={announcements} progressPercentage={progressPercentage} />;
      case 'team': return <TeamSection team={team} />;
      case 'submission': return <SubmissionSection submissions={submissions} />;
      case 'resources': return <ResourcesSection />;
      case 'settings': return <SettingsSection currentUser={currentUser} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMobileMenu(true)} className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div><h1 className="text-white font-bold text-lg">{team?.name || 'CIBC Dashboard'}</h1><p className="text-white/50 text-sm">{team?.institution || currentUser?.email}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(true)} className="relative p-3 hover:bg-white/10 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-white" />
              {unreadNotifications > 0 && <span className="absolute top-1 right-1 w-5 h-5 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">{unreadNotifications}</span>}
            </button>
            <button onClick={handleLogout} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><LogOut className="w-5 h-5 text-white/70" /></button>
          </div>
        </div>
        <div className="lg:hidden flex overflow-x-auto px-2 pb-2 gap-1 scrollbar-hide">
          {menuItems.map(item => { const Icon = item.icon; const isActive = activeSection === item.id; return (<button key={item.id} onClick={() => setActiveSection(item.id as DashboardSection)} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-amber-500 text-slate-900' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Icon className="w-5 h-5" /><span className="text-xs font-medium">{language === 'id' ? item.labelId : item.labelEn}</span></button>); })}
        </div>
      </header>
      <div className="flex">
        <aside className="hidden lg:block w-64 min-h-screen bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-4">
          <nav className="space-y-2">
            {menuItems.map(item => { const Icon = item.icon; const isActive = activeSection === item.id; return (<button key={item.id} onClick={() => setActiveSection(item.id as DashboardSection)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><Icon className="w-5 h-5" /><span className="font-medium">{language === 'id' ? item.labelId : item.labelEn}</span></button>); })}
          </nav>
          {team && (<div className="mt-8 p-4 bg-slate-800/50 rounded-2xl border border-white/5"><h3 className="text-white/50 text-sm mb-2">Team Code</h3><p className="text-amber-400 font-mono text-xl font-bold">{team.team_code}</p><div className="mt-3 flex items-center justify-between"><span className="text-white/50 text-sm">Progress</span><span className="text-white font-bold">{progressPercentage}%</span></div><div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all" style={{ width: `${progressPercentage}%` }} /></div></div>)}
        </aside>
        <main className="flex-1 p-4 lg:p-6">{renderSection()}</main>
      </div>
      {showMobileMenu && (<div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} /><div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-white/10 p-4 animate-slide-in"><div className="flex items-center justify-between mb-6"><h2 className="text-white font-bold text-lg">Menu</h2><button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-5 h-5 text-white" /></button></div><nav className="space-y-2">{menuItems.map(item => { const Icon = item.icon; const isActive = activeSection === item.id; return (<button key={item.id} onClick={() => { setActiveSection(item.id as DashboardSection); setShowMobileMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500 text-slate-900' : 'text-white/70 hover:bg-white/5'}`}><Icon className="w-5 h-5" /><span className="font-medium">{language === 'id' ? item.labelId : item.labelEn}</span></button>); })}</nav>{team && (<div className="mt-8 p-4 bg-slate-800/50 rounded-2xl border border-white/5"><h3 className="text-white/50 text-sm mb-1">Team Code</h3><p className="text-amber-400 font-mono text-xl font-bold">{team.team_code}</p></div>)}</div></div>)}
      {showNotifications && (<div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotifications(false)} /><div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-slate-900 rounded-t-3xl border-t border-white/10 p-4 animate-slide-up"><div className="flex items-center justify-between mb-4"><h2 className="text-white font-bold text-lg">Notifikasi</h2><button onClick={handleMarkAllRead} className="text-amber-400 text-sm font-medium">Tandai semua dibaca</button></div><div className="space-y-3 overflow-y-auto max-h-[60vh]">{notifications.length === 0 ? <p className="text-white/50 text-center py-8">Tidak ada notifikasi</p> : notifications.map(notif => (<div key={notif.id} onClick={() => handleMarkAsRead(notif.id)} className={`p-4 rounded-2xl cursor-pointer transition-all ${notif.is_read ? 'bg-slate-800/50' : 'bg-slate-800 border border-amber-500/30'}`}><h4 className="text-white font-medium">{notif.title}</h4><p className="text-white/60 text-sm mt-1">{notif.message}</p></div>))}</div></div></div>)}
    </div>
  );
};

function OverviewSection({ currentUser, team, stages, tasks, submissions, announcements, progressPercentage }: any) {
  const { language } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 rounded-3xl p-6 border border-amber-500/20">
        <h2 className="text-white text-2xl font-bold mb-2">{language === 'id' ? 'Selamat Datang' : 'Welcome'}, {currentUser?.fullName?.split(' ')[0]}! 👋</h2>
        <p className="text-white/70">{language === 'id' ? `Tim "${team?.name}" - ${stages.length} tahap kompetisi` : `Team "${team?.name}" - ${stages.length} competition stages`}</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex-shrink-0 w-40 p-4 bg-slate-800/50 rounded-2xl border border-white/5"><div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3"><Trophy className="w-5 h-5 text-blue-400" /></div><p className="text-white/50 text-sm">Tahap</p><p className="text-white font-bold text-xl">{stages.length}</p></div>
        <div className="flex-shrink-0 w-40 p-4 bg-slate-800/50 rounded-2xl border border-white/5"><div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-3"><FileText className="w-5 h-5 text-green-400" /></div><p className="text-white/50 text-sm">Tugas</p><p className="text-white font-bold text-xl">{ tasks.length}</p></div>
        <div className="flex-shrink-0 w-40 p-4 bg-slate-800/50 rounded-2xl border border-white/5"><div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3"><FileText className="w-5 h-5 text-purple-400" /></div><p className="text-white/50 text-sm">Submit</p><p className="text-white font-bold text-xl">{submissions.filter((s: any) => s.status === 'submitted').length}</p></div>
        <div className="flex-shrink-0 w-40 p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-500/20"><div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3"><Trophy className="w-5 h-5 text-amber-400" /></div><p className="text-white/50 text-sm">Progress</p><p className="text-amber-400 font-bold text-xl">{progressPercentage}%</p></div>
      </div>
      <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5"><div className="flex items-center justify-between mb-2"><span className="text-white/70 font-medium">Progress Kompetisi</span><span className="text-amber-400 font-bold">{progressPercentage}%</span></div><div className="h-3 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} /></div></div>
      <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5"><h3 className="text-white font-bold mb-4">Pengumuman Terbaru</h3>{announcements.length === 0 ? <p className="text-white/50">Belum ada pengumuman</p> : <div className="space-y-3">{announcements.slice(0, 3).map((ann: any) => (<div key={ann.id} className="p-3 bg-slate-800/50 rounded-xl"><h4 className="text-white font-medium">{ann.title}</h4><p className="text-white/50 text-sm mt-1 line-clamp-2">{ann.content}</p></div>))}</div>}</div>
    </div>
  );
}

function TeamSection({ team }: { team: TeamData | null }) {
  return (<div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5"><h2 className="text-white font-bold text-xl mb-4">Informasi Tim</h2>{team ? (<div className="space-y-4"><div className="flex justify-between"><span className="text-white/50">Nama Tim</span><span className="text-white font-medium">{team.name}</span></div><div className="flex justify-between"><span className="text-white/50">Kode Tim</span><span className="text-amber-400 font-mono font-bold">{team.team_code}</span></div><div className="flex justify-between"><span className="text-white/50">Kategori</span><span className="text-white font-medium capitalize">{team.category}</span></div><div className="flex justify-between"><span className="text-white/50">Institusi</span><span className="text-white font-medium">{team.institution}</span></div></div>) : <p className="text-white/50">Tim belum dibuat</p>}</div>);
}

function SubmissionSection({ submissions }: { submissions: any[] }) {
  return (<div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5"><h2 className="text-white font-bold text-xl mb-4">Submission</h2>{submissions.length === 0 ? <p className="text-white/50">Belum ada submission</p> : <div className="space-y-3">{submissions.map((sub: any) => (<div key={sub.id} className="p-4 bg-slate-800/50 rounded-xl flex items-center justify-between"><div><h4 className="text-white font-medium">{sub.task?.name || 'Tugas'}</h4><p className="text-white/50 text-sm">{sub.file_name}</p></div><span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'graded' ? 'bg-green-500/20 text-green-400' : sub.status === 'submitted' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{sub.status}</span></div>))}</div>}</div>);
}

function ResourcesSection() {
  return (<div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5"><h2 className="text-white font-bold text-xl mb-4">Resources</h2><p className="text-white/50">Tidak ada resource tersedia</p></div>);
}

function SettingsSection({ currentUser }: { currentUser: CurrentUser | null }) {
  return (<div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5"><h2 className="text-white font-bold text-xl mb-4">Pengaturan</h2><div className="space-y-4"><div className="flex justify-between"><span className="text-white/50">Nama</span><span className="text-white font-medium">{currentUser?.fullName}</span></div><div className="flex justify-between"><span className="text-white/50">Email</span><span className="text-white font-medium">{currentUser?.email}</span></div></div></div>);
}

export default CIBCDashboard;