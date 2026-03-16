import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Building2, Cake, LayoutGrid, Sparkles, Monitor } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Building2,
  Cake,
  LayoutGrid,
  Sparkles,
  Monitor,
};

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const triggers: ScrollTrigger[] = [];

    // Header animation
    gsap.set(header.children, { opacity: 0, y: 30 });
    const headerTrigger = ScrollTrigger.create({
      trigger: header,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(header.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(headerTrigger);

    // Cards animation
    const cardElements = cards.querySelectorAll('.service-card');
    gsap.set(cardElements, { opacity: 0, y: 50 });
    const cardsTrigger = ScrollTrigger.create({
      trigger: cards,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(cardElements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(cardsTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  if (!servicesConfig.services.length) return null;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-kath-bg-main py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16 lg:mb-20">
          <span className="font-body text-kath-primary text-xs uppercase tracking-[0.3em]">
            {servicesConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-headline text-kath-text-primary mt-4">
            {servicesConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-kath-text-secondary mt-4 max-w-2xl mx-auto px-4">
            {servicesConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {servicesConfig.services.map((service) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={service.id}
                className="service-card group relative p-6 sm:p-8 bg-white border border-kath-bg-section rounded-2xl hover:border-kath-primary/30 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-500 card-hover"
              >
                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-kath-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-kath-primary/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-kath-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl sm:text-2xl text-kath-text-primary mb-2 sm:mb-3">
                  {service.title[language]}
                </h3>
                <p className="font-body text-sm text-kath-text-secondary mb-4 sm:mb-6 leading-relaxed">
                  {service.description[language]}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="font-body text-xs text-kath-text-muted flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-kath-primary" />
                      {feature[language]}
                    </li>
                  ))}
                </ul>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-kath-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-20 md:mt-24 lg:mt-32" />
    </section>
  );
};

export default Services;
