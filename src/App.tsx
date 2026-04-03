// src/App.tsx
import { useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';
import { siteConfig } from './config';
import { initializeCIBCData } from './services/cibcMockData';

// Route Protection
import { AdminRoute, JudgeRoute, ParticipantRoute } from './components/ProtectedRoute';

// Sections (Landing Page Utama)
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import NarrativeText from './sections/NarrativeText';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import CardStack from './sections/CardStack';
import Competition from './sections/Competition';
import News from './sections/News';
import Testimonials from './sections/Testimonials';
import Statistics from './sections/Statistics';
import ZigZagGrid from './sections/ZigZagGrid';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Pages (Main App)
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyCompetitions from './pages/MyCompetitions';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import MyTeam from './pages/MyTeam';
import CompetitionDetail from './pages/CompetitionDetail';
import SubmissionForm from './pages/SubmissionForm';
import BMCCompetition from './pages/BMCCompetition';

// CIBC Competition Pages
import CIBCLanding from './pages/cibc-landing/CIBCLanding'; // Folder baru untuk Landing Page CIBC
import CIBCRegister from './pages/cibc/CIBCRegister';
import CIBCLogin from './pages/cibc/CIBCLogin';
import CIBCDashboard from './pages/dashboard/CIBCDashboard';
import PendingApproval from './pages/cibc/PendingApproval';
import ForgotPassword from './pages/cibc/ForgotPassword';
import VerifyEmail from './pages/cibc/VerifyEmail';
import ResetPassword from './pages/cibc/ResetPassword';

// Admin Pages
import {
  AdminLayout,
  AdminLogin,
  AdminDashboard,
  AdminHero,
  AdminServices,
  AdminPortfolio,
  AdminNews,
  AdminTestimonials,
  AdminFAQ,
  AdminStatistics,
  AdminContact,
  AdminSettings,
  AdminRegistrations,
  AdminStages,
  AdminSubmissions,
  AdminAnnouncements,
  AdminUsers,
  AdminUserApproval,
  AdminUserManagement,
  AdminPayments,
  AdminTasks,
  AdminGrading,
  AdminLeaderboard,
  AdminJudges,
} from './pages/admin';

// Judge Pages
import {
  JudgeLayout,
  JudgeDashboard,
  JudgeGrading,
  JudgeLogin,
} from './pages/judge';

gsap.registerPlugin(ScrollTrigger);

// Landing Page Component (KATH Event Organizer)
const LandingPage = () => {
  useEffect(() => {
    // Refresh ScrollTrigger after all content is loaded
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoad);
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(refreshTimeout);
    };
  }, []);

  return (
    <div className="relative bg-kath-bg-main min-h-screen">
      <Navigation />
      <Hero />
      <div id="about">
        <NarrativeText />
      </div>
      <Statistics />
      <Services />
      <Portfolio />
      <CardStack />
      <Competition />
      <News />
      <Testimonials />
      <ZigZagGrid />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

function App() {
  const location = useLocation();

  // Initialize Lenis smooth scrolling
  useLenis();

  // Scroll to top on route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    // Set document language if configured
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }

    // Initialize CIBC mock data (creates test user)
    initializeCIBCData();
  }, []);

  return (
    <Routes>
      {/* Main KATH Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-competitions" element={<MyCompetitions />} />
      <Route path="/competition" element={<MyCompetitions />} />
      <Route path="/competition/:id" element={<CompetitionDetail />} />
      <Route path="/competition/:id/submit" element={<SubmissionForm />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/my-teams" element={<MyTeam />} />
      <Route path="/bmc-competition" element={<BMCCompetition />} />

      {/* CIBC Routes - Protected */}
      <Route path="/cibc" element={<CIBCLanding />} />
      <Route path="/cibc/login" element={<CIBCLogin />} />
      <Route path="/cibc/register" element={<CIBCRegister />} />
      <Route path="/cibc/pending-approval" element={<PendingApproval />} />
      <Route path="/cibc/forgot-password" element={<ForgotPassword />} />
      <Route path="/cibc/verify-email" element={<VerifyEmail />} />
      <Route path="/cibc/reset-password" element={<ResetPassword />} />
      <Route path="/cibc/dashboard" element={<ParticipantRoute><CIBCDashboard /></ParticipantRoute>} />

      {/* Admin Routes - Protected */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        {/* Landing Page Content */}
        <Route path="hero" element={<AdminHero />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faq" element={<AdminFAQ />} />
        <Route path="statistics" element={<AdminStatistics />} />
        <Route path="contact" element={<AdminContact />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Competition Management */}
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="stages" element={<AdminStages />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="submissions" element={<AdminSubmissions />} />
        <Route path="grading" element={<AdminGrading />} />
        <Route path="leaderboard" element={<AdminLeaderboard />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="user-approval" element={<AdminUserApproval />} />
        <Route path="user-management" element={<AdminUserManagement />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="judges" element={<AdminJudges />} />
      </Route>

      {/* Judge Routes - Protected */}
      <Route path="/judge/login" element={<JudgeLogin />} />
      <Route path="/judge" element={<JudgeRoute><JudgeLayout /></JudgeRoute>}>
        <Route index element={<JudgeDashboard />} />
        <Route path="grading/:submissionId" element={<JudgeGrading />} />
      </Route>
    </Routes>
  );
}

export default App;