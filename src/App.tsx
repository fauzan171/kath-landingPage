import { useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';
import { siteConfig } from './config';
import { initializeCIBCData } from './services/cibcMockData';

// Sections
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import NarrativeText from './sections/NarrativeText';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import CardStack from './sections/CardStack';
import Competition from './sections/Competition';
import News from './sections/News';
// import BreathSection from './sections/BreathSection';
import Testimonials from './sections/Testimonials';
import Statistics from './sections/Statistics';
import ZigZagGrid from './sections/ZigZagGrid';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Pages
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
// import AboutCompetition from './pages/AboutCompetition'; // 👈 [DITAMBAHKAN] Import halaman AboutCompetition

// CIBC Competition Pages
import CIBCLanding from './pages/cibc/CIBCLanding';
import CIBCRegister from './pages/cibc/CIBCRegister';
import CIBCLogin from './pages/cibc/CIBCLogin';
import CIBCDashboard from './pages/dashboard/CIBCDashboard';

// Admin Pages
import {
  AdminLayout,
  AdminDashboard,
  // Landing Page Content
  AdminHero,
  AdminServices,
  AdminPortfolio,
  AdminNews,
  AdminTestimonials,
  AdminFAQ,
  AdminStatistics,
  AdminContact,
  AdminSettings,
  // Competition Management
  AdminRegistrations,
  AdminStages,
  AdminSubmissions,
  AdminAnnouncements,
  AdminUsers,
} from './pages/admin';

// Components
// import BackgroundMusic from './components/BackgroundMusic';

gsap.registerPlugin(ScrollTrigger);

// Landing Page Component
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
      {/* Background Music - Premium Classical */}
      {/* <BackgroundMusic /> */}

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Narrative Text Section (About) */}
      <div id="about">
        <NarrativeText />
      </div>

      {/* Statistics Section */}
      <Statistics />

      {/* Services Section */}
      <Services />

      {/* Portfolio Section */}
      <Portfolio />

      {/* Card Stack Parallax Gallery */}
      <CardStack />

      {/* Competition Section */}
      <Competition />

      {/* News/Blog Section */}
      <News />

      {/* BREATH Video Mask Section */}
      {/* <BreathSection /> */}

      {/* Testimonials Section */}
      <Testimonials />

      {/* Zig-Zag Grid Section */}
      <ZigZagGrid />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
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
    <>
      {/* {!isAuthRoute && <BackgroundMusic />} */}
      <Routes>
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

        {/* 
        <Route path="/about-competition" element={<AboutCompetition />} /> */}

        <Route path="/cibc" element={<CIBCLanding />} />
        <Route path="/cibc/login" element={<CIBCLogin />} />
        <Route path="/cibc/register" element={<CIBCRegister />} />
        <Route path="/cibc/dashboard" element={<CIBCDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
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
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;