import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Users,
  Trophy,
  Award,
  Medal,
  Flag,
  Crown,
  FileText,
  FileCheck,
  Upload,
  Download,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Activity,
  LogOut,
  Bell,
  ChevronRight,
  Edit3,
  Eye,
  Settings,
  Menu,
  X,
  FileSearch,
  Target,
  Zap
} from '../icons';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getDashboardStats,
  getCompetitions,
  type Notification,
  type Competition
} from '../services/mockData';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ReactNode;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline'>('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [stats, setStats] = useState({
    totalCompetitions: 0,
    active: 0,
    wins: 0,
    certificates: 0
  });
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Load data
  useEffect(() => {
    setNotifications(getNotifications());
    setCompetitions(getCompetitions());
    setStats(getDashboardStats());
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(getNotifications());
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kath-success/10 text-kath-success rounded-full text-sm font-medium border border-kath-success/20">
              <CheckCircle2 className="w-4 h-4" />
              Aktif
            </span>
          ),
          message: 'Akun Anda telah terverifikasi dan aktif',
        };
      case 'pending':
        return {
          badge: (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kath-gold/10 text-kath-gold rounded-full text-sm font-medium border border-kath-gold/20">
              <Clock className="w-4 h-4" />
              Menunggu Verifikasi
            </span>
          ),
          message: 'Akun Anda sedang dalam proses verifikasi admin',
        };
      case 'rejected':
        return {
          badge: (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kath-error/10 text-kath-error rounded-full text-sm font-medium border border-kath-error/20">
              <XCircle className="w-4 h-4" />
              Ditolak
            </span>
          ),
          message: 'Pendaftaran Anda ditolak. Hubungi support untuk info lebih lanjut.',
        };
      default:
        return {
          badge: null,
          message: 'Status tidak diketahui',
        };
    }
  };

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      date: '1 Maret 2025',
      title: 'Pendaftaran Dibuka',
      description: 'Registrasi online dibuka untuk semua kategori',
      status: 'completed',
      icon: <Flag className="w-4 h-4" />,
    },
    {
      id: '2',
      date: '25 Maret 2025',
      title: 'Workshop Persiapan',
      description: 'Workshop gratis untuk peserta terdaftar',
      status: 'completed',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: '3',
      date: '15 April 2025',
      title: 'Deadline Pendaftaran',
      description: 'Batas akhir pengiriman form pendaftaran',
      status: 'current',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: '4',
      date: '30 April 2025',
      title: 'Pengumpulan Karya',
      description: 'Deadline submit proposal dan portofolio',
      status: 'upcoming',
      icon: <Upload className="w-4 h-4" />,
    },
    {
      id: '5',
      date: '15 Mei 2025',
      title: 'Semi Final',
      description: 'Pengumuman finalis dan presentasi',
      status: 'upcoming',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: '6',
      date: '20 Juni 2025',
      title: 'Final & Awarding',
      description: 'Presentasi final dan pengumuman pemenang',
      status: 'upcoming',
      icon: <Crown className="w-4 h-4" />,
    },
  ];

  const documents = [
    { name: 'KTP/Kartu Pelajar', status: 'uploaded', date: '10 Mar 2025', size: '2.4 MB', type: 'ID Card' },
    { name: 'Portofolio', status: 'pending', date: '-', size: '-', type: 'Portfolio' },
    { name: 'Surat Rekomendasi', status: 'uploaded', date: '12 Mar 2025', size: '1.1 MB', type: 'Recommendation' },
    { name: 'Proposal Kompetisi', status: 'uploaded', date: '15 Mar 2025', size: '5.8 MB', type: 'Proposal' },
  ];

  const activeCompetitions = competitions.filter(c => c.status === 'in_progress' || c.status === 'registered');
  const currentCompetition = activeCompetitions[0];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-kath-bg-main flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-kath-primary/30 border-t-kath-primary rounded-full animate-spin" />
          <p className="font-body text-kath-primary text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(user.status);

  return (
    <div className="min-h-screen bg-kath-bg-main">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-kath-bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kath-primary to-kath-primary-dark flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-kath-primary text-xl tracking-wide">KATH</span>
                <span className="font-body text-kath-text-secondary text-sm ml-2">Dashboard</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'documents', label: 'Dokumen', icon: FileText },
                { id: 'timeline', label: 'Timeline', icon: Calendar },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all ${
                    activeTab === item.id
                      ? 'bg-kath-primary/10 text-kath-primary'
                      : 'text-kath-text-secondary hover:text-kath-text-primary hover:bg-kath-bg-section'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button
                onClick={() => setShowAllNotifications(!showAllNotifications)}
                className="relative p-2 text-kath-text-secondary hover:text-kath-text-primary hover:bg-kath-bg-section rounded-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-kath-bg-section">
                <div className="text-right">
                  <p className="font-body text-kath-text-primary text-sm font-medium">{user.fullName}</p>
                  <p className="font-body text-kath-text-muted text-xs">{user.competitionCategory}</p>
                </div>
                <div
                  onClick={() => navigate('/edit-profile')}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-kath-primary to-kath-primary-dark flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-kath-primary/50 transition-all"
                >
                  <span className="font-display text-white text-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-kath-text-secondary hover:text-kath-text-primary hover:bg-kath-bg-section rounded-lg transition-all"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-kath-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-body text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-kath-bg-section bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'documents', label: 'Dokumen', icon: FileText },
                { id: 'timeline', label: 'Timeline', icon: Calendar },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all ${
                    activeTab === item.id
                      ? 'bg-kath-primary/10 text-kath-primary'
                      : 'text-kath-text-secondary hover:text-kath-text-primary hover:bg-kath-bg-section'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-kath-bg-section">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-body text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl text-kath-text-primary mb-2">
                  Selamat Datang, <span className="text-kath-primary">{user.fullName.split(' ')[0]}</span>
                </h1>
                <p className="font-body text-kath-text-secondary">
                  Kelola pendaftaran dan persiapan kompetisi Anda di sini
                </p>
              </div>
              <div className="flex items-center gap-3">
                {statusConfig.badge}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Total Competitions',
                value: stats.totalCompetitions.toString(),
                icon: Trophy,
                trend: '+2',
                onClick: () => navigate('/my-competitions')
              },
              {
                label: 'Active',
                value: stats.active.toString(),
                icon: Target,
                trend: '2',
                onClick: () => navigate('/my-competitions')
              },
              {
                label: 'Wins',
                value: stats.wins.toString(),
                icon: Award,
                trend: '+1',
                onClick: () => navigate('/my-competitions')
              },
              {
                label: 'Certificates',
                value: stats.certificates.toString(),
                icon: FileText,
                trend: '3',
                onClick: () => navigate('/my-competitions')
              },
            ].map((stat, index) => (
              <div
                key={index}
                onClick={stat.onClick}
                className="bg-white border border-kath-bg-section rounded-2xl p-5 hover:border-kath-primary/30 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-kath-primary/10 flex items-center justify-center text-kath-primary group-hover:bg-kath-primary/20 transition-all">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-kath-success">{stat.trend}</span>
                </div>
                <p className="font-display text-2xl text-kath-text-primary mb-1">{stat.value}</p>
                <p className="font-body text-kath-text-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Competition Card */}
              {currentCompetition && (
                <div className="bg-gradient-to-br from-kath-primary/10 via-kath-primary/5 to-transparent border border-kath-primary/20 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-kath-primary/20 flex items-center justify-center">
                        <Trophy className="w-7 h-7 text-kath-primary" />
                      </div>
                      <div>
                        <p className="font-body text-kath-primary text-sm uppercase tracking-wider mb-1">
                          Kompetisi Aktif
                        </p>
                        <h2 className="font-display text-xl text-kath-text-primary">{currentCompetition.name}</h2>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/my-competitions')}
                      className="flex items-center gap-2 px-4 py-2 bg-kath-primary hover:bg-kath-primary-dark text-white font-body text-sm font-medium rounded-full transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-kath-text-secondary text-sm">Progress</span>
                      <span className="font-body text-kath-primary text-sm">{currentCompetition.progress}%</span>
                    </div>
                    <div className="h-2 bg-kath-bg-section rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-kath-primary to-kath-primary-light rounded-full transition-all"
                        style={{ width: `${currentCompetition.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-kath-text-muted" />
                      <span className="font-body text-kath-text-secondary">
                        Deadline: {new Date(currentCompetition.deadline).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-kath-text-muted" />
                      <span className="font-body text-kath-text-secondary">
                        {currentCompetition.teamName || 'Individual'} ({currentCompetition.teamSize})
                      </span>
                    </div>
                  </div>

                  {!currentCompetition.hasSubmitted && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => navigate(`/competition/${currentCompetition.id}/submit`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-kath-gold hover:bg-kath-gold-dark text-white font-body font-medium rounded-xl transition-all"
                      >
                        <Upload className="w-5 h-5" />
                        Submit Now
                      </button>
                      <button
                        onClick={() => navigate(`/competition/${currentCompetition.id}`)}
                        className="flex items-center justify-center gap-2 px-4 py-3 border border-kath-bg-section text-kath-text-secondary hover:bg-kath-bg-section rounded-xl transition-all"
                      >
                        <FileSearch className="w-5 h-5" />
                        Details
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Section */}
              <div className="bg-white border border-kath-bg-section rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-kath-primary/10 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-kath-primary" />
                    </div>
                    <h3 className="font-display text-lg text-kath-text-primary">Dokumen Persyaratan</h3>
                  </div>
                  <button
                    onClick={() => alert('Upload document feature coming soon!')}
                    className="flex items-center gap-2 px-4 py-2 border border-kath-primary/30 text-kath-primary hover:bg-kath-primary/10 rounded-full font-body text-sm transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>

                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-kath-bg-main border border-kath-bg-section rounded-xl hover:border-kath-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.status === 'uploaded'
                              ? 'bg-kath-success/10 text-kath-success'
                              : 'bg-kath-gold/10 text-kath-gold'
                          }`}
                        >
                          {doc.status === 'uploaded' ? (
                            <FileCheck className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-body text-kath-text-primary text-sm">{doc.name}</p>
                          <p className="font-body text-kath-text-muted text-xs">
                            {doc.status === 'uploaded'
                              ? `${doc.date} • ${doc.size}`
                              : 'Belum diupload'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'uploaded' ? (
                          <>
                            <button
                              onClick={() => alert(`View ${doc.name}`)}
                              className="p-2 text-kath-text-muted hover:text-kath-primary hover:bg-kath-primary/10 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => alert(`Download ${doc.name}`)}
                              className="p-2 text-kath-text-muted hover:text-kath-primary hover:bg-kath-primary/10 rounded-lg transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => alert(`Upload ${doc.name}`)}
                            className="px-3 py-1.5 bg-kath-gold/10 text-kath-gold rounded-full font-body text-xs hover:bg-kath-gold/20 transition-all"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-kath-bg-section rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-kath-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-kath-primary" />
                  </div>
                  <h3 className="font-display text-lg text-kath-text-primary">Timeline Kompetisi</h3>
                </div>

                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-kath-bg-section" />
                  <div className="space-y-6">
                    {timelineEvents.map((event) => (
                      <div key={event.id} className="relative flex gap-4">
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            event.status === 'completed'
                              ? 'bg-kath-success/10 border-kath-success text-kath-success'
                              : event.status === 'current'
                              ? 'bg-kath-primary/10 border-kath-primary text-kath-primary'
                              : 'bg-kath-bg-section border-kath-bg-section text-kath-text-muted'
                          }`}
                        >
                          {event.icon}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                            <h4 className={`font-body font-medium ${event.status === 'upcoming' ? 'text-kath-text-muted' : 'text-kath-text-primary'}`}>
                              {event.title}
                            </h4>
                            <span className={`font-body text-xs ${event.status === 'current' ? 'text-kath-primary' : 'text-kath-text-muted'}`}>
                              {event.date}
                            </span>
                          </div>
                          <p className={`font-body text-sm ${event.status === 'upcoming' ? 'text-kath-bg-section' : 'text-kath-text-secondary'}`}>
                            {event.description}
                          </p>
                          {event.status === 'current' && (
                            <span className="inline-block mt-2 px-3 py-1 bg-kath-primary/10 text-kath-primary rounded-full font-body text-xs">
                              Sedang Berlangsung
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white border border-kath-bg-section rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    onClick={() => navigate('/edit-profile')}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-kath-primary to-kath-primary-dark flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-kath-primary/50 transition-all"
                  >
                    <span className="font-display text-white text-2xl">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-kath-text-primary">{user.fullName}</h3>
                    <p className="font-body text-kath-primary text-sm">{user.competitionCategory}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-kath-text-muted" />
                    <span className="font-body text-kath-text-secondary">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-kath-text-muted" />
                    <span className="font-body text-kath-text-secondary">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-kath-text-muted" />
                    <span className="font-body text-kath-text-secondary">{user.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-kath-text-muted" />
                    <span className="font-body text-kath-text-secondary">{user.institution}</span>
                  </div>
                  {user.major && (
                    <div className="flex items-center gap-3 text-sm">
                      <GraduationCap className="w-4 h-4 text-kath-text-muted" />
                      <span className="font-body text-kath-text-secondary">{user.major}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/edit-profile')}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 border border-kath-bg-section hover:border-kath-primary/50 text-kath-text-secondary hover:text-kath-primary rounded-xl font-body text-sm transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profil
                </button>
              </div>

              {/* Notifications */}
              <div className="bg-white border border-kath-bg-section rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-kath-primary/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-kath-primary" />
                    </div>
                    <h3 className="font-display text-lg text-kath-text-primary">Notifikasi</h3>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-kath-primary hover:text-kath-primary-dark font-body"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {(showAllNotifications ? notifications : notifications.slice(0, 3)).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        handleMarkAsRead(notif.id);
                        if (notif.actionUrl) navigate(notif.actionUrl);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        notif.read ? 'bg-kath-bg-main' : 'bg-kath-primary/5 border border-kath-primary/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'success'
                              ? 'bg-kath-success/10 text-kath-success'
                              : notif.type === 'warning'
                              ? 'bg-kath-gold/10 text-kath-gold'
                              : notif.type === 'urgent'
                              ? 'bg-kath-error/10 text-kath-error'
                              : 'bg-kath-primary/10 text-kath-primary'
                          }`}
                        >
                          {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                           notif.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                           notif.type === 'urgent' ? <Zap className="w-4 h-4" /> :
                           <Bell className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-kath-text-primary text-sm font-medium truncate">{notif.title}</p>
                          <p className="font-body text-kath-text-secondary text-xs line-clamp-2">{notif.message}</p>
                          <p className="font-body text-kath-text-muted text-xs mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {notifications.length > 3 && (
                  <button
                    onClick={() => setShowAllNotifications(!showAllNotifications)}
                    className="w-full mt-4 flex items-center justify-center gap-2 text-kath-primary hover:text-kath-primary-dark font-body text-sm transition-all"
                  >
                    {showAllNotifications ? 'Show Less' : 'View All Notifications'}
                    <ChevronRight className={`w-4 h-4 transition-transform ${showAllNotifications ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-kath-bg-section rounded-2xl p-6">
                <h3 className="font-display text-lg text-kath-text-primary mb-4">Aksi Cepat</h3>
                <div className="space-y-2">
                  {[
                    { icon: Trophy, label: 'My Competitions', desc: 'Lihat semua kompetisi', action: () => navigate('/my-competitions') },
                    { icon: Users, label: 'My Teams', desc: 'Kelola tim Anda', action: () => navigate('/my-teams') },
                    { icon: Upload, label: 'Upload Dokumen', desc: 'Submit file persyaratan', action: () => alert('Upload feature coming soon!') },
                    { icon: Settings, label: 'Settings', desc: 'Pengaturan akun', action: () => navigate('/settings') },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-kath-bg-section transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-kath-primary/10 flex items-center justify-center text-kath-primary group-hover:bg-kath-primary/20 transition-all">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-body text-kath-text-primary text-sm">{action.label}</p>
                        <p className="font-body text-kath-text-muted text-xs">{action.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-kath-bg-section group-hover:text-kath-primary transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Prize Info */}
              <div className="bg-gradient-to-br from-kath-gold/10 to-transparent border border-kath-gold/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Medal className="w-6 h-6 text-kath-gold" />
                  <h3 className="font-display text-lg text-kath-text-primary">Total Hadiah</h3>
                </div>
                <p className="font-display text-3xl text-kath-gold mb-2">Rp 500.000.000</p>
                <p className="font-body text-kath-text-secondary text-sm mb-4">
                  Hadiah uang tunai dan merchandise eksklusif
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-kath-text-secondary">Juara 1</span>
                    <span className="font-body text-kath-gold">Rp 200jt</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-kath-text-secondary">Juara 2</span>
                    <span className="font-body text-kath-text-primary">Rp 100jt</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-kath-text-secondary">Juara 3</span>
                    <span className="font-body text-kath-text-primary">Rp 50jt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
