import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { breathSectionConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const BreathSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const text = textRef.current;
    const subtitle = subtitleRef.current;

    if (!section || !container || !text || !subtitle) return;

    // Initial state
    gsap.set(container, { scale: 0.92, borderRadius: '60px' });
    gsap.set(text, { opacity: 0, scale: 1.1 });
    gsap.set(subtitle, { opacity: 0, y: 20 });

    // Scale up animation on scroll
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Container scale and border radius
        gsap.set(container, {
          scale: 0.92 + progress * 0.08,
          borderRadius: `${60 - progress * 20}px`,
        });

        // Text reveal
        gsap.set(text, {
          opacity: progress,
          scale: 1.1 - progress * 0.1,
        });

        // Subtitle reveal
        if (progress > 0.5) {
          const subtitleProgress = (progress - 0.5) * 2;
          gsap.set(subtitle, {
            opacity: subtitleProgress,
            y: 20 - subtitleProgress * 20,
          });
        }
      },
    });

    triggerRef.current = trigger;

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, []);

  if (!breathSectionConfig.title && !breathSectionConfig.backgroundImage) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 bg-kath-black"
    >
      <div className="px-4 md:px-8">
        <div
          ref={containerRef}
          className="relative w-full max-w-7xl mx-auto overflow-hidden border border-kath-charcoal/50"
          style={{ willChange: 'transform, border-radius' }}
        >
          {/* Background Image */}
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <img
              src={breathSectionConfig.backgroundImage}
              alt={breathSectionConfig.backgroundAlt}
              className="w-full h-full object-cover"
            />

            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-kath-black/50" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2
                ref={textRef}
                className="font-display text-display text-kath-white tracking-tight text-center"
                style={{
                  willChange: 'transform, opacity',
                  textShadow: '0 4px 40px rgba(0,0,0,0.5)'
                }}
              >
                {breathSectionConfig.title[language]}
              </h2>
              <p
                ref={subtitleRef}
                className="font-body text-kath-gold text-sm md:text-base uppercase tracking-[0.3em] mt-6"
                style={{ willChange: 'transform, opacity' }}
              >
                {breathSectionConfig.subtitle[language]}
              </p>
            </div>

            {/* Subtle gradient edges */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-kath-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-kath-black/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      {breathSectionConfig.description && (
        <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16 md:mt-24 text-center">
          <p className="font-body text-sm text-kath-off-white/60 max-w-lg mx-auto leading-relaxed">
            {breathSectionConfig.description[language]}
          </p>
        </div>
      )}
    </section>
  );
};

export default BreathSection;
