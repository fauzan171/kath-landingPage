/**
 * CIBC Power by KATH - Dashboard
 *
 * Main dashboard for registered participants
 * Color Theme: Cream (#E6DDC5) & Black
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, FileText, Users, Bell, Settings,
  CheckCircle2, AlertCircle,
  Target, Leaf, LogOut, UserPlus, Calendar
} from '../../icons';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  teamService,
  submissionService,
  notificationService,
  dashboardService,
  timelineService,
  initializeCIBCData,
} from '../../services/cibcMockData';
import type { Team, Submission, CIBCNotification, DashboardProgress, TimelinePhase } from '../../types/cibc';

// Current user type
interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  category: string;
  teamId?: string;
}

// Dashboard sections
type DashboardSection = 'overview' | 'team' | 'submission' | 'resources' | 'settings';

const CIBCDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [team, setTeam] = useState<Team | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [notifications, setNotifications] = useState<CIBCNotification[]>([]);
  const [progress, setProgress] = useState<DashboardProgress | null>(null);
  const [timeline, setTimeline] = useState<TimelinePhase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('cibc_current_user');
    if (!storedUser) {
      navigate('/cibc/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      initializeCIBCData();
      loadData(user);
    } catch {
      navigate('/cibc/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadData = async (user: CurrentUser) => {
    try {
      setIsLoading(true);

      const [teams, submissions, notifs, tl] = await Promise.all([
        teamService.getAll(),
        submissionService.getAll(),
        notificationService.getAll(),
        timelineService.getAll(),
      ]);

      let currentTeam = teams.find(t => t.leaderId === user.id || t.id === user.teamId);

      if (!currentTeam && teams.length > 0) {
        currentTeam = teams[0];
      }

      setTeam(currentTeam || null);
      setNotifications(notifs);
      setTimeline(tl);

      if (currentTeam) {
        const teamSubmission = submissions.find(s => s.teamId === currentTeam!.id);
        setSubmission(teamSubmission || null);

        const prog = await dashboardService.getProgress(currentTeam.id);
        setProgress(prog);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error(language === 'id' ? 'Gagal memuat data' : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cibc_current_user');
    navigate('/cibc');
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const progressPercentage = progress?.overallProgress || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cibc-bgMain flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cibc-primary/30 border-t-cibc-primary rounded-full animate-spin mx-auto mb-4" />
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
                {notifications.filter(n => !n.read).length > 0 && (
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
                        {team?.name || 'Create your team to get started'}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-cibc-primary/20 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-cibc-primary" />
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-white">
                      {language === 'id' ? 'Progress Registrasi' : 'Registration Progress'}
                    </h3>
                    <span className="text-2xl font-display text-cibc-primary">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-cibc-bgSection rounded-full h-3 mb-6">
                    <div
                      className="bg-cibc-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {/* Progress Items */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: language === 'id' ? 'Registrasi Akun' : 'Account Registration', done: progress?.registration },
                      { label: language === 'id' ? 'Formasi Tim' : 'Team Formation', done: progress?.teamFormation },
                      { label: language === 'id' ? 'Submission BMC' : 'BMC Submission', done: progress?.submission },
                      { label: language === 'id' ? 'Dokumen Pendukung' : 'Supporting Documents', done: progress?.documentsUploaded?.bmc && progress?.documentsUploaded?.pitchDeck },
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
                </div>

                {/* Timeline Preview */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-4">
                    {language === 'id' ? 'Timeline Kompetisi' : 'Competition Timeline'}
                  </h3>
                  <div className="space-y-4">
                    {timeline.slice(0, 4).map((phase, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          phase.status === 'active' ? 'bg-cibc-primary' : 'bg-cibc-border'
                        }`} />
                        <div className="flex-1">
                          <p className="font-body text-sm text-white">{phase.name}</p>
                          <p className="font-body text-xs text-cibc-textMuted">
                            {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        {phase.status === 'active' && (
                          <span className="px-2 py-1 bg-cibc-primary/20 text-cibc-primary text-xs rounded-full font-body">
                            {language === 'id' ? 'Aktif' : 'Active'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-white">
                      {language === 'id' ? 'Notifikasi' : 'Notifications'}
                    </h3>
                    <span className="text-cibc-primary text-sm font-body cursor-pointer hover:underline">
                      {language === 'id' ? 'Lihat Semua' : 'View All'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          notif.read ? 'bg-cibc-bgSection' : 'bg-cibc-primary/5 border border-cibc-primary/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notif.read ? 'bg-cibc-border' : 'bg-cibc-primary'
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
                      team?.status === 'complete' ? 'bg-cibc-success/20 text-cibc-success' : 'bg-cibc-warning/20 text-cibc-warning'
                    }`}>
                      {team?.status === 'complete'
                        ? (language === 'id' ? 'Lengkap' : 'Complete')
                        : (language === 'id' ? 'Pembentukan' : 'Forming')}
                    </span>
                  </div>

                  {team && (
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
                            {team.code}
                          </code>
                          <button className="px-3 py-2 text-cibc-primary hover:bg-cibc-primary/10 rounded-lg font-body text-sm">
                            {language === 'id' ? 'Salin' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Members */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg text-white">
                      {language === 'id' ? 'Anggota Tim' : 'Team Members'}
                    </h3>
                    <span className="font-body text-sm text-cibc-textSecondary">
                      {team?.members?.length || 0} / {team?.maxMembers || 5}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {team?.members?.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-cibc-bgSection rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cibc-primary/20 flex items-center justify-center">
                            <span className="font-display text-cibc-primary">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-body text-white">{member.name}</p>
                            <p className="font-body text-xs text-cibc-textMuted">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.role === 'leader' && (
                            <span className="px-2 py-1 bg-cibc-primary/20 text-cibc-primary text-xs rounded-full font-body">
                              Leader
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full font-body ${
                            member.status === 'active' ? 'bg-cibc-success/20 text-cibc-success' : 'bg-cibc-warning/20 text-cibc-warning'
                          }`}>
                            {member.status === 'active'
                              ? (language === 'id' ? 'Aktif' : 'Active')
                              : (language === 'id' ? 'Pending' : 'Pending')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Invite Button */}
                  {(team?.members?.length || 0) < (team?.maxMembers || 5) && (
                    <button className="w-full mt-4 py-3 border-2 border-dashed border-cibc-border rounded-lg text-cibc-textSecondary hover:border-cibc-primary hover:text-cibc-primary transition-colors font-body flex items-center justify-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      {language === 'id' ? 'Undang Anggota' : 'Invite Member'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submission Section */}
            {activeSection === 'submission' && (
              <div className="space-y-6">
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-6">
                    {language === 'id' ? 'Status Submission' : 'Submission Status'}
                  </h3>

                  {submission ? (
                    <div className="space-y-4">
                      <div>
                        <label className="font-body text-sm text-cibc-textMuted">
                          {language === 'id' ? 'Nama Proyek' : 'Project Name'}
                        </label>
                        <p className="font-display text-xl text-white mt-1">{submission.projectName}</p>
                      </div>
                      <div>
                        <label className="font-body text-sm text-cibc-textMuted">
                          {language === 'id' ? 'Deskripsi' : 'Description'}
                        </label>
                        <p className="font-body text-white mt-1">{submission.oneLineDescription}</p>
                      </div>
                      <div>
                        <label className="font-body text-sm text-cibc-textMuted">
                          Status
                        </label>
                        <p className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-body ${
                            submission.status === 'draft' ? 'bg-cibc-warning/20 text-cibc-warning' :
                            submission.status === 'submitted' ? 'bg-cibc-info/20 text-cibc-info' :
                            'bg-cibc-success/20 text-cibc-success'
                          }`}>
                            {submission.status.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-cibc-textMuted mx-auto mb-4" />
                      <p className="font-body text-cibc-textSecondary">
                        {language === 'id' ? 'Belum ada submission' : 'No submission yet'}
                      </p>
                      <button className="mt-4 px-6 py-2 bg-cibc-primary text-cibc-textDark rounded-lg font-body text-sm hover:bg-cibc-primaryDark transition-colors">
                        {language === 'id' ? 'Buat Submission' : 'Create Submission'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div className="bg-cibc-bgCard border border-cibc-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-white mb-6">
                    {language === 'id' ? 'Dokumen Pendukung' : 'Supporting Documents'}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { type: 'BMC', key: 'bmc', icon: FileText },
                      { type: 'Pitch Deck', key: 'pitchDeck', icon: FileText },
                      { type: 'Executive Summary', key: 'executiveSummary', icon: FileText },
                      { type: 'Video Pitch', key: 'video', icon: FileText },
                    ].map(doc => (
                      <div key={doc.key} className="p-4 bg-cibc-bgSection rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <doc.icon className="w-5 h-5 text-cibc-textMuted" />
                          <span className="font-body text-white">{doc.type}</span>
                        </div>
                        {progress?.documentsUploaded?.[doc.key as keyof typeof progress.documentsUploaded] ? (
                          <CheckCircle2 className="w-5 h-5 text-cibc-success" />
                        ) : (
                          <button className="px-3 py-1 text-cibc-primary border border-cibc-primary/30 rounded-lg font-body text-sm hover:bg-cibc-primary/10">
                            Upload
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
                    <div>
                      <label className="font-body text-sm text-cibc-textMuted">
                        {language === 'id' ? 'Kategori' : 'Category'}
                      </label>
                      <p className="font-body text-white mt-1 capitalize">{currentUser?.category}</p>
                    </div>
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