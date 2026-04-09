// src/App.tsx
import { useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';
import { siteConfig } from './config';

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

// CIBC Competition Pages
import CIBCLanding from './pages/cibc-landing/CIBCLanding'; // Folder baru untuk Landing Page CIBC
import CIBCRegister from './pages/cibc/CIBCRegister';
import CIBCLogin from './pages/cibc/CIBCLogin';
import CIBCDashboard from './pages/dashboard/CIBCDashboard';
import PendingApproval from './pages/cibc/PendingApproval';
import ForgotPassword from './pages/cibc/ForgotPassword';
import VerifyEmail from './pages/cibc/VerifyEmail';
import ResetPassword from './pages/cibc/ResetPassword';
import ChangePassword from './pages/cibc/ChangePassword';
import Rejected from './pages/cibc/Rejected';
import PublicLeaderboard from './pages/PublicLeaderboard';
import TermsAndConditions from './pages/TermsAndConditions';

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
import AdminRegistrationsHub from './pages/admin/AdminRegistrationsHub';
import AdminCompetitionSetup from './pages/admin/AdminCompetitionSetup';
import AdminJudgingHub from './pages/admin/AdminJudgingHub';
import AdminUsersHub from './pages/admin/AdminUsersHub';
import AdminCommunicationsHub from './pages/admin/AdminCommunicationsHub';

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
  }, []);

  return (
    <Routes>
      {/* KATH Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* CIBC Routes - Protected */}
      <Route path="/cibc" element={<CIBCLanding />} />
      <Route path="/cibc/login" element={<CIBCLogin />} />
      <Route path="/cibc/register" element={<CIBCRegister />} />
      <Route path="/cibc/pending-approval" element={<PendingApproval />} />
      <Route path="/cibc/forgot-password" element={<ForgotPassword />} />
      <Route path="/cibc/verify-email" element={<VerifyEmail />} />
      <Route path="/cibc/reset-password" element={<ResetPassword />} />
      <Route path="/cibc/change-password" element={<ChangePassword />} />
      <Route path="/cibc/rejected" element={<Rejected />} />
      <Route path="/cibc/dashboard" element={<ParticipantRoute><CIBCDashboard /></ParticipantRoute>} />

      {/* Public Competition Pages */}
      <Route path="/cibc/leaderboard" element={<PublicLeaderboard />} />
      <Route path="/cibc/terms" element={<TermsAndConditions />} />

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
        {/* Hub Routes (merged pages with tabs) */}
        <Route path="registrations-hub" element={<AdminRegistrationsHub />} />
        <Route path="competition-setup" element={<AdminCompetitionSetup />} />
        <Route path="judging" element={<AdminJudgingHub />} />
        <Route path="users-hub" element={<AdminUsersHub />} />
        <Route path="communications" element={<AdminCommunicationsHub />} />
        {/* Individual routes (kept for backward compat) */}
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

      {/* 404 Catch-All */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Page not found</p>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">Back to Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;