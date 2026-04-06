import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Download } from 'lucide-react'; // Ikon Play diganti jadi Download
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';
import { downloadBMCTemplate } from '../data/bmcTemplate';
import { CountdownTimer } from '../components/CountdownTimer';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Refs untuk GSAP
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); 
  
  // Refs untuk elemen individual
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    const bgImage = bgImageRef.current;
    const content = contentRef.current;

    if (!section || !bgImage || !content) return;

    const ctx = gsap.context(() => {
      // 1. ANIMASI MASUK (INITIAL LOAD)
      gsap.fromTo(
        [labelRef.current, titleRef.current, subtitleRef.current, timerRef.current, ctaRef.current],
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: 'power3.out', 
          delay: 0.2 
        }
      );

      // 2. ANIMASI PARALLAX
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      tl.to(bgImage, {
        yPercent: 30,
        scale: 1.15,
        filter: 'blur(12px)',
        ease: 'none',
      }, 0); 

      tl.to(content, {
        yPercent: 50,
        opacity: 0,
        ease: 'none',
      }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen w-full overflow-hidden bg-[#0F0F0F] flex items-center justify-center"
    >
      {/* BACKGROUND LAYER */}
      <div className="absolute top-[-5%] left-[-5%] w-[110%] h-[110%] pointer-events-none">
        <img
          ref={bgImageRef}
          src="/hero-pic-4.avif"
          alt="CIBC Hero Background"
          className="w-full h-full object-cover"
          style={{ willChange: 'transform, filter' }} 
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* CONTENT LAYER */}
      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto pt-[40px]"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Tagline / Label */}
        <span
          ref={labelRef}
          className="font-body text-[#FFB22C] text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] mb-3 md:mb-5 font-bold text-center drop-shadow-md"
        >
          {COMPETITION_DATA.tagline}
        </span>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display text-white text-center whitespace-pre-line leading-[1.1]"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)', 
          }}
        >
          {COMPETITION_DATA.name}
        </h1>

        {/* Subtitle / Description */}
        <p
          ref={subtitleRef}
          className="font-body text-white/90 text-sm md:text-base mt-4 md:mt-6 max-w-xl md:max-w-2xl text-center leading-relaxed font-light"
        >
          {COMPETITION_DATA.description[language]}
        </p>

        {/* Countdown Timer Wrapper */}
        <div ref={timerRef} className="w-full flex justify-center mt-8 mb-2 transform scale-90 md:scale-75 origin-top">
            <CountdownTimer />
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 w-full sm:w-auto">
          {/* Button 1: Daftar Sekarang */}
          <button 
            onClick={() => navigate('/cibc/register')}
            className="relative group overflow-hidden w-full sm:w-auto px-6 py-3.5 bg-transparent border border-[#FFB22C] text-white font-body text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.03]"
          >
            <div className="absolute left-1/2 top-[250%] -translate-x-1/2 w-[250%] aspect-square transition-all duration-1000 group-hover:top-[-15%] opacity-0 group-hover:opacity-100 z-0 pointer-events-none" style={{ transitionTimingFunction: 'cubic-bezier(0.68,-0.55,0.27,1.55)' }}>
              <div className="absolute inset-0 bg-[#FFB22C]/70 rounded-[43%] animate-[spin_3.5s_linear_infinite]" />
              <div className="absolute inset-0 bg-[#FFB22C] rounded-[45%] animate-[spin_5s_linear_infinite_reverse]" />
            </div>
            <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0F0F0F] transition-colors duration-500 font-bold">
              {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Button 2: Download Guide */}
          <button
            onClick={() => downloadBMCTemplate(language)}
            className="relative group overflow-hidden w-full sm:w-auto px-6 py-3.5 bg-transparent border border-white/25 text-white font-body text-xs uppercase tracking-wider rounded-full transition-transform duration-300 flex items-center justify-center gap-2 hover:scale-[1.03]"
          >
              <div className="absolute left-1/2 top-[250%] -translate-x-1/2 w-[250%] aspect-square transition-all duration-1000 group-hover:top-[-15%] opacity-0 group-hover:opacity-100 z-0 pointer-events-none" style={{ transitionTimingFunction: 'cubic-bezier(0.68,-0.55,0.27,1.55)' }}>
                <div className="absolute inset-0 bg-white/60 rounded-[43%] animate-[spin_3.5s_linear_infinite]" />
                <div className="absolute inset-0 bg-white rounded-[45%] animate-[spin_5s_linear_infinite_reverse]" />
              </div>
              <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0F0F0F] transition-colors duration-500 font-bold">
                <Download className="w-4 h-4 text-[#FFB22C] group-hover:text-[#0F0F0F] transition-colors" />
                {language === 'id' ? 'Unduh Panduan' : 'Download Guide'}
              </span>
          </button>
        </div>
      </div>
      
    </section>
  );
};