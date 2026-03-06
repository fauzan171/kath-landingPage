import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';
import { siteConfig } from './config';

// Sections
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import NarrativeText from './sections/NarrativeText';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import CardStack from './sections/CardStack';
import Competition from './sections/Competition';
import News from './sections/News';
import BreathSection from './sections/BreathSection';
import Testimonials from './sections/Testimonials';
import Statistics from './sections/Statistics';
import ZigZagGrid from './sections/ZigZagGrid';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Components
import BackgroundMusic from './components/BackgroundMusic';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Initialize Lenis smooth scrolling
  useLenis();

  useEffect(() => {
    // Set document language if configured
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }

    // Refresh ScrollTrigger after all content is loaded
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoad);

    // Also refresh after a short delay to ensure images are loaded
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(refreshTimeout);
    };
  }, []);

  return (
    <div className="relative bg-kath-black min-h-screen">
      {/* Background Music - Premium Classical */}
      <BackgroundMusic />

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
      <BreathSection />

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
}

export default App;
