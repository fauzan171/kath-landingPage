import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // Components
// import { Navbar } from './components/Navbar';

// Sections
import { HeroSection } from './sections/HeroSection';
import { StatsSection } from './sections/StatsSection';
import { AboutSection } from './sections/AboutSection';
import { ThemesSection } from './sections/ThemesSection';
import { TimelineSection } from './sections/TimelineSection';
import { PrizesSection } from './sections/PrizesSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FAQSection } from './sections/FAQSection';
import { CTASection } from './sections/CTASection';
import { Footer } from './sections/Footer';

const CIBCLanding = () => {
  // Efek untuk me-refresh animasi GSAP setelah semua komponen dimuat
  useEffect(() => {
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => clearTimeout(refreshTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-cibc-bgMain font-body selection:bg-cibc-primary selection:text-cibc-textDark overflow-hidden">

      {/* Navigasi Atas */}
      {/* <Navbar /> */}

      <main>
        {/* Section dengan ID untuk target navigasi Navbar */}
        <section id="hero">
          <HeroSection />
        </section>

       

        <section id="about">
          <AboutSection />
        </section>

        <StatsSection />

        <ThemesSection />

        <section id="timeline">
          <TimelineSection />
        </section>

        <PrizesSection />

        <TestimonialsSection />

        <section id="faq">
          <FAQSection />
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default CIBCLanding;