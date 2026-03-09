import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const label = labelRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;

    if (!section || !title || !subtitle || !image || !overlay || !label || !cta) return;

    // Initial animation on load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      image,
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2 }
    )
    .fromTo(
      label,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=1.2'
    )
    .fromTo(
      title,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      '-=0.6'
    )
    .fromTo(
      subtitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(
      cta.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
      '-=0.4'
    );

    // Scroll-driven parallax
    const parallaxTriggers: ScrollTrigger[] = [];

    const imageTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(image, { y: self.progress * 150 });
      },
    });
    parallaxTriggers.push(imageTrigger);

    const contentTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '50% top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(title, {
          opacity: 1 - self.progress * 1.5,
          y: self.progress * -50
        });
        gsap.set(subtitle, {
          opacity: 1 - self.progress * 2,
          y: self.progress * -30
        });
        gsap.set(label, {
          opacity: 1 - self.progress * 2,
        });
        gsap.set(cta, {
          opacity: 1 - self.progress * 2,
        });
      },
    });
    parallaxTriggers.push(contentTrigger);

    const overlayTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(overlay, { opacity: 0.3 + self.progress * 0.4 });
      },
    });
    parallaxTriggers.push(overlayTrigger);

    return () => {
      parallaxTriggers.forEach(trigger => trigger.kill());
      tl.kill();
    };
  }, []);

  if (!heroConfig.title && !heroConfig.backgroundImage) return null;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-[100svh] w-full overflow-hidden"
    >
      {/* Background Image with Ken Burns */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <img
          src={heroConfig.backgroundImage}
          alt={heroConfig.backgroundAlt}
          className="w-full h-full object-cover ken-burns"
        />
      </div>

      {/* Dark overlay for depth */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-kath-black opacity-30"
        style={{ willChange: 'opacity' }}
      />

      {/* Hero overlay gradient */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content - Mobile Optimized */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Label */}
        <span
          ref={labelRef}
          className="font-body text-kath-gold text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-6"
          style={{ willChange: 'transform, opacity' }}
        >
          {heroConfig.label[language]}
        </span>

        {/* Main Title - Responsive sizing */}
        <h1
          ref={titleRef}
          className="font-display text-kath-white text-center whitespace-pre-line"
          style={{
            fontSize: 'clamp(2rem, 10vw, 8rem)',
            lineHeight: '0.95',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 40px rgba(0,0,0,0.5)',
            willChange: 'transform, opacity'
          }}
        >
          {heroConfig.title[language]}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-kath-off-white/80 text-sm sm:text-base mt-6 sm:mt-8 max-w-md sm:max-w-xl text-center leading-relaxed px-4"
          style={{ willChange: 'transform, opacity' }}
        >
          {heroConfig.subtitle[language]}
        </p>

        {/* CTA Buttons - Mobile optimized */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto px-4 sm:px-0">
          <button className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-kath-gold to-kath-gold-dark hover:from-kath-gold-light hover:to-kath-gold text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-gold touch-feedback">
            {heroConfig.ctaPrimary[language]}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-kath-white/30 hover:border-kath-gold hover:bg-kath-gold/10 text-kath-white font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 touch-feedback">
            {heroConfig.ctaSecondary[language]}
          </button>
        </div>
      </div>

      {/* Scroll Indicator - Mobile optimized */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-body text-kath-white/60 text-xs uppercase tracking-wider">
          {language === 'id' ? 'Gulir' : 'Scroll'}
        </span>
        <ChevronDown className="w-5 h-5 text-kath-gold" />
      </div>

      {/* Bottom gradient for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-kath-black to-transparent" />
    </section>
  );
};

export default Hero;
