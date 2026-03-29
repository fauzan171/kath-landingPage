import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Import komponen yang sudah dipisah
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import OverviewSection from './sections/OverviewSection';
import TeamSection from './sections/TeamSection';
import SubmissionSection from './sections/SubmissionSection';
import ResourcesSection from './sections/ResourcesSection';
import SettingsSection from './sections/SettingsSection';

// --- TYPE DEFINITIONS ---
export type DashboardSection = 'overview' | 'team' | 'submission' | 'resources' | 'settings';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  category?: string;
}

const CIBCDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // --- STATE MANAGEMENT ---
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [team, setTeam] = useState<any | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // --- MOCK DATA LOADING (Ganti dengan fetch Supabase/API aslimu jika ada) ---
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulasi delay loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Set Mock Data
        setCurrentUser({
          id: 'user-1',
          fullName: 'Peserta CIBC',
          email: 'peserta@cibc2026.com',
          category: 'mahasiswa'
        });

        setTeam({
          id: 'team-1',
          name: 'Tim Alpha',
          category: 'mahasiswa',
          institution: 'Universitas Indonesia'
        });

        setTeamMembers([
          { id: '1', user: { name: 'Peserta CIBC', email: 'peserta@cibc2026.com' }, role: 'leader' },
          { id: '2', user: { name: 'Anggota Dua', email: 'anggota2@cibc2026.com' }, role: 'member' }
        ]);

        setSubmissions([
          { id: 'sub-1', status: 'graded', total_score: 85, file_name: 'BMC_TimAlpha.pdf', feedback: 'Struktur BMC sangat baik.' },
          { id: 'sub-2', status: 'submitted', file_name: 'PitchDeck_TimAlpha.pdf', feedback: null }
        ]);

        setAnnouncements([
          { title: 'Selamat Datang di CIBC 2026', content: 'Kompetisi telah resmi dimulai. Silakan cek panduan di menu Materi.' },
          { title: 'Deadline Submission Tahap 1', content: 'Harap mengumpulkan BMC paling lambat tanggal 20 Februari 2026.' }
        ]);

        setStages([
          { id: 'stage-1', title: 'Pendaftaran & Pengumpulan BMC', status: 'active', deadline: '20 Feb 2026' },
          { id: 'stage-2', title: 'Seleksi Tahap 1', status: 'pending', deadline: '28 Feb 2026' },
          { id: 'stage-3', title: 'Grand Final', status: 'pending', deadline: '15 Mar 2026' }
        ]);

        setNotifications([
          { id: 'notif-1', isRead: false, title: 'Submission BMC dinilai' },
          { id: 'notif-2', isRead: true, title: 'Selamat datang di CIBC 2026' }
        ]);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // --- HANDLERS ---
  const handleLogout = () => {
    // Tambahkan logika clear token / sign out Supabase di sini
    navigate('/cibc/login');
  };

  const handleMarkAsRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === notifId ? { ...notif, isRead: true } : notif)
    );
  };

  // --- DERIVED STATE ---
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  // Contoh perhitungan progres sederhana berdasarkan submission
  const progressPercentage = submissions.length > 0 ? 50 : 10;

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

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Header Dipisah */}
      <DashboardHeader
        currentUser={currentUser}
        unreadNotifications={unreadNotifications}
        handleLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        {/* INI BAGIAN YANG DIPERBAIKI: Ditambahkan items-start dan relative */}
        <div className="grid lg:grid-cols-4 gap-8 items-start relative">

          {/* Sidebar Dipisah */}
          <DashboardSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && (
              <OverviewSection
                currentUser={currentUser}
                team={team}
                stages={stages}
                announcements={announcements}
                notifications={notifications}
                progressPercentage={progressPercentage}
                unreadNotifications={unreadNotifications}
                handleMarkAsRead={handleMarkAsRead}
              />
            )}

            {activeSection === 'team' && (
              <TeamSection
                team={team}
                teamMembers={teamMembers}
              />
            )}

            {activeSection === 'submission' && (
              <SubmissionSection
                team={team}
                submissions={submissions}
              />
            )}

            {activeSection === 'resources' && (
              <ResourcesSection />
            )}

            {activeSection === 'settings' && (
              <SettingsSection
                currentUser={currentUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CIBCDashboard;