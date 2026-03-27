import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { heroConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); 
  
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const bgImage = bgImageRef.current;
    const content = contentRef.current;

    if (!section || !bgImage || !content) return;

    // 1. ANIMASI MASUK (INITIAL LOAD)
    gsap.fromTo(
      [labelRef.current, titleRef.current, subtitleRef.current, ctaRef.current],
      { y: 40, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: 'power3.out', 
        delay: 0.3 
      }
    );

    // 2. ANIMASI PARALLAX PREMIUM (SAAT DI-SCROLL)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    // Background: Turun, Zoom in, dan BLUR perlahan
    tl.to(bgImage, {
      yPercent: 30,
      scale: 1.15,
      filter: 'blur(12px)', // <-- Efek blur ditambahkan kembali di sini
      ease: 'none',
    }, 0); 

    // Konten (Teks & Tombol): Turun lebih cepat dan memudar
    tl.to(content, {
      yPercent: 50,
      opacity: 0,
      ease: 'none',
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-[100vh] w-full overflow-hidden bg-[#F9F8F6] flex items-center justify-center"
    >
      {/* BACKGROUND LAYER */}
      <div className="absolute top-[-5%] left-[-5%] w-[110%] h-[110%] pointer-events-none">
        <img
          ref={bgImageRef}
          src={heroConfig.backgroundImage}
          alt={heroConfig.backgroundAlt}
          className="w-full h-full object-cover"
          // Pastikan 'filter' ada di willChange agar animasinya mulus
          style={{ willChange: 'transform, filter' }} 
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* CONTENT LAYER */}
      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto pt-[35px] mb-2 md:mb-6"
        style={{ willChange: 'transform, opacity' }}
      >
        <span
          ref={labelRef}
          className="font-body text-[#FFB22C] text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4 md:mb-5 font-bold"
        >
          {heroConfig.label[language]}
        </span>

        <h1
          ref={titleRef}
          className="font-display text-white text-center whitespace-pre-line leading-[1.05]"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            letterSpacing: '-0.01em',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)', 
          }}
        >
          {heroConfig.title[language]}
        </h1>

        <p
          ref={subtitleRef}
          className="font-body text-white/80 text-xs md:text-sm mt-5 md:mt-6 max-w-md md:max-w-2xl text-center leading-relaxed"
        >
          {heroConfig.subtitle[language]}
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 w-full sm:w-auto">
          <button className="relative group overflow-hidden w-full sm:w-auto px-7 py-3 md:py-3.5 bg-transparent border border-[#FFB22C] text-white font-body text-[11px] md:text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.03]">
            <div className="absolute left-1/2 top-[250%] -translate-x-1/2 w-[250%] aspect-square transition-all duration-1000 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] group-hover:top-[-15%] opacity-0 group-hover:opacity-100 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-[#FFB22C]/70 rounded-[43%] animate-[spin_3.5s_linear_infinite]" />
              <div className="absolute inset-0 bg-[#FFB22C] rounded-[45%] animate-[spin_5s_linear_infinite_reverse]" />
            </div>
            <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0F0F0F] transition-colors duration-500 font-bold">
              {heroConfig.ctaPrimary[language]}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button className="relative group overflow-hidden w-full sm:w-auto px-7 py-3 md:py-3.5 bg-transparent border border-white/25 text-white font-body text-[11px] md:text-xs uppercase tracking-wider rounded-full transition-transform duration-300 flex items-center justify-center hover:scale-[1.03]">
              <div className="absolute left-1/2 top-[250%] -translate-x-1/2 w-[250%] aspect-square transition-all duration-1000 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] group-hover:top-[-15%] opacity-0 group-hover:opacity-100 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-white/60 rounded-[43%] animate-[spin_3.5s_linear_infinite]" />
                <div className="absolute inset-0 bg-white rounded-[45%] animate-[spin_5s_linear_infinite_reverse]" />
              </div>
              <span className="relative z-10 group-hover:text-[#0F0F0F] transition-colors duration-500 font-medium">
                {heroConfig.ctaSecondary[language]}
              </span>
          </button>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce pointer-events-none z-20">
        <span className="font-body text-white/50 text-[10px] uppercase tracking-widest">
          {language === 'id' ? 'Gulir' : 'Scroll'}
        </span>
        <ChevronDown className="w-4 h-4 text-[#FFB22C]" />
      </div> */}
      
    </section>
  );
};

export default Hero;