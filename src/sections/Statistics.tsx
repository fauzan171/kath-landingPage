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

    // Stats animation trigger
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
      className="relative w-full bg-kath-bg-main py-16 sm:py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Label */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="font-body text-kath-primary text-xs uppercase tracking-[0.3em]">
            {statisticsConfig.sectionLabel[language]}
          </span>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12"
        >
          {statItems.map((stat, index) => (
            <div
              key={stat.key}
              className="text-center group p-6 bg-white rounded-2xl border border-kath-bg-section hover:border-kath-primary/20 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative inline-flex items-baseline justify-center">
                <span className="font-display text-4xl sm:text-5xl md:text-6xl text-kath-text-primary group-hover:text-kath-primary transition-colors duration-500">
                  {stat.value}
                </span>
                <span className="font-display text-2xl sm:text-3xl md:text-4xl text-kath-primary ml-1">
                  {stat.suffix}
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-kath-text-muted mt-2 sm:mt-3 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-16 sm:mt-20 md:mt-28" />
    </section>
  );
};

export default Statistics;
