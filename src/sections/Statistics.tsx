import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { statisticsConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Statistics = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({
    years: 0,
    events: 0,
    clients: 0,
    awards: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const stats = statsRef.current;

    if (!section || !stats) return;

    const triggers: ScrollTrigger[] = [];

    const statsTrigger = ScrollTrigger.create({
      trigger: stats,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (!hasAnimated) {
          setHasAnimated(true);
          animateCounts();
        }
      },
    });
    triggers.push(statsTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, [hasAnimated]);

  const animateCounts = () => {
    const targets = {
      years: parseInt(statisticsConfig.stats.years.value),
      events: parseInt(statisticsConfig.stats.events.value),
      clients: parseInt(statisticsConfig.stats.clients.value),
      awards: parseInt(statisticsConfig.stats.awards.value),
    };

    const duration = 2;
    const ease = 'power2.out';

    Object.entries(targets).forEach(([key, target]) => {
      gsap.to(
        { value: 0 },
        {
          value: target,
          duration,
          ease,
          onUpdate: function () {
            setCounts((prev) => ({
              ...prev,
              [key]: Math.floor(this.targets()[0].value),
            }));
          },
        }
      );
    });
  };

  const statItems = [
    { key: 'years', value: counts.years, suffix: '+', label: statisticsConfig.stats.years.label[language] },
    { key: 'events', value: counts.events, suffix: '+', label: statisticsConfig.stats.events.label[language] },
    { key: 'clients', value: counts.clients, suffix: '+', label: statisticsConfig.stats.clients.label[language] },
    { key: 'awards', value: counts.awards, suffix: '+', label: statisticsConfig.stats.awards.label[language] },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F9F8F6] py-16 sm:py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Label Atas - Emas Baru #FFB22C */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
            {statisticsConfig.sectionLabel[language]}
          </span>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-4 gap-6 sm:gap-8 md:gap-12"
        >
          {statItems.map((stat, index) => (
            <div
              key={stat.key}
              className="text-center group"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative inline-flex items-baseline justify-center">
                <span className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-7xl text-[#0F0F0F] group-hover:text-[#FFB22C] transition-colors duration-500">
                  {stat.value}
                </span>
                <span className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#FFB22C] ml-1">
                  {stat.suffix}
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-[#0F0F0F]/60 mt-2 sm:mt-3 uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION DIVIDER - Garis tipis Emas Baru #FFB22C */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-16 sm:mt-20 md:mt-28">
        <div className="h-[1px] w-full bg-[#FFB22C]/30" />
      </div>
      
    </section>
  );
};

export default Statistics;