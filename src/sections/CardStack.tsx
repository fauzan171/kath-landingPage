import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardStackConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const CardStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const { language } = useLanguage();

  const cards = cardStackConfig.cards;

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !wrapper || cardElements.length === 0) return;

    // Set initial positions - cards start at screen center
    cardElements.forEach((card, index) => {
      gsap.set(card, {
        y: index === 0 ? 0 : window.innerHeight * 0.5,
        rotation: cards[index].rotation,
        opacity: index === 0 ? 1 : 0,
      });
    });

    // Create pinned scroll animation
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `${cardElements.length * 50}%`,
      pin: wrapper,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const segmentSize = 1 / cardElements.length;

        cardElements.forEach((card, index) => {
          const cardStart = index * segmentSize;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - cardStart) / segmentSize);

          if (index === 0) {
            // First card - fade out as user scrolls
            gsap.set(card, {
              opacity: 1 - cardProgress * 0.3,
              scale: 1 - cardProgress * 0.05,
            });
          } else {
            // Other cards - slide up from bottom
            const prevCardEnd = index * segmentSize;
            const prevProgress = gsap.utils.clamp(0, 1, (progress - prevCardEnd + segmentSize) / segmentSize);

            gsap.set(card, {
              y: (1 - prevProgress) * window.innerHeight * 0.8,
              opacity: prevProgress,
              zIndex: index,
            });
          }
        });
      },
    });

    triggerRef.current = trigger;

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, []);

  if (!cardStackConfig.sectionTitle && cards.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-kath-bg-section"
      style={{ minHeight: `${(cards.length + 1) * 50}vh` }}
    >
      {/* Section Header */}
      <div className="absolute top-0 left-0 right-0 py-12 md:py-16 text-center z-10">
        <span className="font-body text-sm text-kath-primary uppercase tracking-[0.2em]">
          {cardStackConfig.sectionSubtitle[language]}
        </span>
        <h2 className="font-display text-headline text-kath-text-primary mt-4">
          {cardStackConfig.sectionTitle[language]}
        </h2>
      </div>

      {/* Pinned Card Wrapper */}
      <div
        ref={wrapperRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="relative w-full max-w-4xl mx-auto px-6 md:px-8 aspect-[4/3]">
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="absolute inset-0"
              style={{
                willChange: 'transform, opacity',
                zIndex: index,
              }}
            >
              <div className="relative overflow-hidden rounded-3xl shadow-lg shadow-kath-primary/10 bg-white h-full border border-kath-bg-section">
                {/* Image - Centered */}
                <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={card.image}
                    alt={card.title[language]}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center center' }}
                  />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-kath-text-primary/80 via-kath-text-primary/20 to-transparent" />
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block px-3 py-1 bg-kath-primary/20 text-white text-xs font-body rounded-full mb-3">
                    {card.category[language]}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-2">
                    {card.title[language]}
                  </h3>
                  <p className="font-body text-sm text-white/70">
                    {card.description[language]}
                  </p>
                </div>

                {/* Card Number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-kath-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="font-body text-xs text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-24" />
    </section>
  );
};

export default CardStack;
