import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

// Icons as simple SVG components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const FileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'dokumen' | 'timeline'>('ringkasan');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Batas Akhir Submission', message: 'Submission deadline tomorrow!', time: '2 jam lalu', unread: true },
    { id: 2, title: 'Skor Diperbarui', message: 'Grading results are now available', time: '1 hari lalu', unread: true },
    { id: 3, title: 'Pengumuman Baru', message: 'New announcement from admin', time: '2 hari lalu', unread: false },
  ]);

  // Mock data - replace with actual data from services
  const myCompetitions = [
    { id: '1', name: 'CIBC Competition', status: 'active', stage: 'Final', deadline: '2026-04-15', tasks: 3, submitted: 2 },
    { id: '2', name: 'Design Challenge', status: 'active', stage: 'Proposal', deadline: '2026-04-20', tasks: 1, submitted: 0 },
  ];

  const stats = [
    { label: 'Kompetisi', value: '2', icon: '🏆', color: 'bg-amber-500' },
    { label: 'Submission', value: '5/12', icon: '📄', color: 'bg-indigo-500' },
    { label: 'Skor', value: '85', icon: '⭐', color: 'bg-emerald-500' },
    { label: 'Rank', value: '#3', icon: '🎯', color: 'bg-rose-500' },
  ];

  const timeline = [
    { date: '2026-04-15', event: 'Final Submission Deadline', type: 'deadline' },
    { date: '2026-04-10', event: 'Grading Started', type: 'info' },
    { date: '2026-04-05', event: 'Proposal Submitted', type: 'success' },
    { date: '2026-04-01', event: 'Competition Started', type: 'info' },
  ];

  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Participant';
  };

  const getNavIcon = (path: string) => {
    const currentPath = window.location.pathname;
    const isActive = currentPath === path || currentPath.startsWith(path + '/');
    switch (path) {
      case '/dashboard': return <HomeIcon className={`w-5 h-5 ${isActive ? 'stroke-indigo-600' : 'stroke-slate-500'}`} />;
      case '/my-competitions': return <TrophyIcon className={`w-5 h-5 ${isActive ? 'stroke-indigo-600' : 'stroke-slate-500'}`} />;
      case '/submission': return <FileIcon className={`w-5 h-5 ${isActive ? 'stroke-indigo-600' : 'stroke-slate-500'}`} />;
      case '/profile': return <UserIcon className={`w-5 h-5 ${isActive ? 'stroke-indigo-600' : 'stroke-slate-500'}`} />;
      default: return null;
    }
  };

  const getNavLabel = (path: string) => {
    switch (path) {
      case '/dashboard': return language === 'id' ? 'Beranda' : 'Home';
      case '/my-competitions': return language === 'id' ? 'Kompetisi' : 'Competitions';
      case '/submission': return language === 'id' ? 'Submit' : 'Submit';
      case '/profile': return language === 'id' ? 'Profil' : 'Profile';
      default: return '';
    }
  };

  const navItems = [
    { path: '/dashboard', label: getNavLabel('/dashboard') },
    { path: '/my-competitions', label: getNavLabel('/my-competitions') },
    { path: '/submission', label: getNavLabel('/submission') },
    { path: '/profile', label: getNavLabel('/profile') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-6 lg:rounded-b-3xl lg:mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">
              {language === 'id' ? 'Halo,' : 'Hello,'} {getUserName()}! 👋
            </h1>
            <p className="text-indigo-200 text-sm mt-1">
              {language === 'id' ? 'Semangat kompetisi hari ini!' : 'Ready for today\'s competition!'}
            </p>
          </div>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <BellIcon className="w-6 h-6" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Stats Cards - Horizontal Scroll on Mobile */}
        <div className="max-w-6xl mx-auto mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 bg-white/10 backdrop-blur rounded-xl p-3 min-w-[80px] lg:flex-1"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-indigo-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-slate-200 p-1 rounded-xl mb-6">
          {(['ringkasan', 'dokumen', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'ringkasan' && (language === 'id' ? 'Ringkasan' : 'Overview')}
              {tab === 'dokumen' && (language === 'id' ? 'Dokumen' : 'Documents')}
              {tab === 'timeline' && (language === 'id' ? 'Timeline' : 'Timeline')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-4">
            {/* My Competitions */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-800">
                  {language === 'id' ? 'Kompetisi Saya' : 'My Competitions'}
                </h2>
                <button className="text-indigo-600 text-sm font-medium flex items-center gap-1">
                  {language === 'id' ? 'Lihat Semua' : 'View All'}
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {myCompetitions.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => navigate(`/competition/${comp.id}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{comp.name}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <FileIcon className="w-4 h-4" />
                            {comp.tasks} {language === 'id' ? 'Task' : 'Tasks'}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {comp.submitted}/{comp.tasks} {language === 'id' ? 'Submit' : 'Submitted'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          comp.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {comp.status === 'active' ? (language === 'id' ? 'Aktif' : 'Active') : 'Ended'}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{comp.stage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                {language === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/submission')}
                  className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-2xl text-left hover:from-indigo-600 hover:to-indigo-700 transition-all"
                >
                  <FileIcon className="w-6 h-6 mb-2" />
                  <div className="font-semibold">{language === 'id' ? 'Upload Submission' : 'Upload'}</div>
                  <div className="text-xs text-indigo-200">{language === 'id' ? 'Submit tugas kamu' : 'Submit your task'}</div>
                </button>
                <button 
                  onClick={() => navigate('/my-team')}
                  className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-2xl text-left hover:from-amber-600 hover:to-amber-700 transition-all"
                >
                  <UserIcon className="w-6 h-6 mb-2" />
                  <div className="font-semibold">{language === 'id' ? 'Tim Saya' : 'My Team'}</div>
                  <div className="text-xs text-amber-100">{language === 'id' ? 'Kelola anggota' : 'Manage members'}</div>
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'dokumen' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {language === 'id' ? 'Belum Ada Dokumen' : 'No Documents Yet'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {language === 'id' ? 'Dokumen akan muncul setelah submit' : 'Documents will appear after submission'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-0">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 relative">
                {idx < timeline.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-200"></div>
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.type === 'deadline' ? 'bg-amber-500' :
                  item.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
                  <p className="font-medium text-slate-800">{item.event}</p>
                  <p className="text-sm text-slate-400">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = window.location.pathname === item.path || window.location.pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                  isActive ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                {getNavIcon(item.path)}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowNotifications(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">
                  {language === 'id' ? 'Notifikasi' : 'Notifications'}
                </h2>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-3 rounded-xl border ${notif.unread ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100'}`}
                >
                  <div className="flex items-start gap-3">
                    {notif.unread && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></span>}
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{notif.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}