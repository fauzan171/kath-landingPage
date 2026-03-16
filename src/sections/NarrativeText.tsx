import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { narrativeTextConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// 4-Point Star SVG Component
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
  </svg>
);

const NarrativeText = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;
    const star = starRef.current;
    const stats = statsRef.current;

    if (!section || !line1 || !line2 || !line3 || !star) return;

    // Set initial states
    gsap.set([line1, line2, line3], { opacity: 0, y: 30 });
    gsap.set(star, { opacity: 0, scale: 0.5 });
    if (stats) {
      gsap.set(stats.children, { opacity: 0, y: 20 });
    }

    const triggers: ScrollTrigger[] = [];

    // Star animation
    const starTrigger = ScrollTrigger.create({
      trigger: star,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(star, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      },
    });
    triggers.push(starTrigger);

    // Line animations with stagger
    const line1Trigger = ScrollTrigger.create({
      trigger: line1,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(line1, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(line1Trigger);

    const line2Trigger = ScrollTrigger.create({
      trigger: line2,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(line2, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(line2Trigger);

    const line3Trigger = ScrollTrigger.create({
      trigger: line3,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(line3, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(line3Trigger);

    // Stats animation
    if (stats) {
      const statsTrigger = ScrollTrigger.create({
        trigger: stats,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(stats.children, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          });
        },
      });
      triggers.push(statsTrigger);
    }

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  if (!narrativeTextConfig.line1 && !narrativeTextConfig.line2 && !narrativeTextConfig.line3) return null;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-24 md:py-32 lg:py-40 bg-kath-bg-main"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        {/* Spinning Star */}
        <div
          ref={starRef}
          className="flex justify-center mb-12"
          style={{ willChange: 'transform, opacity' }}
        >
          <StarIcon className="w-6 h-6 md:w-8 md:h-8 text-kath-primary spin-slow" />
        </div>

        {/* Narrative Text */}
        <div className="space-y-6 md:space-y-8">
          <p
            ref={line1Ref}
            className="font-display text-headline text-kath-text-primary"
            style={{ willChange: 'transform, opacity' }}
          >
            {narrativeTextConfig.line1[language]}
          </p>

          <p
            ref={line2Ref}
            className="font-display text-subheadline text-kath-primary italic max-w-2xl mx-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            {narrativeTextConfig.line2[language]}
          </p>

          <p
            ref={line3Ref}
            className="font-body text-sm md:text-base text-kath-text-secondary max-w-2xl mx-auto leading-relaxed"
            style={{ willChange: 'transform, opacity' }}
          >
            {narrativeTextConfig.line3[language]}
          </p>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-kath-bg-section"
        >
          <div className="text-center">
            <span className="font-display text-3xl md:text-4xl text-kath-primary">
              {narrativeTextConfig.stats.years}
            </span>
            <p className="font-body text-xs text-kath-text-muted mt-2 uppercase tracking-wider">
              {language === 'id' ? 'Tahun' : 'Years'}
            </p>
          </div>
          <div className="text-center">
            <span className="font-display text-3xl md:text-4xl text-kath-primary">
              {narrativeTextConfig.stats.events}
            </span>
            <p className="font-body text-xs text-kath-text-muted mt-2 uppercase tracking-wider">
              {language === 'id' ? 'Event' : 'Events'}
            </p>
          </div>
          <div className="text-center">
            <span className="font-display text-3xl md:text-4xl text-kath-primary">
              {narrativeTextConfig.stats.clients}
            </span>
            <p className="font-body text-xs text-kath-text-muted mt-2 uppercase tracking-wider">
              {language === 'id' ? 'Klien' : 'Clients'}
            </p>
          </div>
          <div className="text-center">
            <span className="font-display text-3xl md:text-4xl text-kath-primary">
              {narrativeTextConfig.stats.awards}
            </span>
            <p className="font-body text-xs text-kath-text-muted mt-2 uppercase tracking-wider">
              {language === 'id' ? 'Penghargaan' : 'Awards'}
            </p>
          </div>
        </div>

        {/* Bottom Star */}
        <div className="flex justify-center mt-12">
          <StarIcon className="w-4 h-4 text-kath-primary/50" />
        </div>
      </div>
    </section>
  );
};

export default NarrativeText;
