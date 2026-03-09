import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const { language } = useLanguage();

  const allLabel = language === 'id' ? 'Semua' : 'All';
  const currentFilter = activeFilter === 'All' || activeFilter === 'Semua' 
    ? allLabel 
    : activeFilter;

  const filteredItems = currentFilter === allLabel
    ? portfolioConfig.items
    : portfolioConfig.items.filter(item => item.category[language] === currentFilter);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;

    if (!section || !header || !grid) return;

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

    // Grid animation
    const animateGrid = () => {
      const items = grid.querySelectorAll('.portfolio-item');
      gsap.set(items, { opacity: 0, y: 50, scale: 0.95 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    };

    const gridTrigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 75%',
      once: true,
      onEnter: animateGrid,
    });
    triggers.push(gridTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  // Re-animate when filter changes
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = grid.querySelectorAll('.portfolio-item');
    gsap.set(items, { opacity: 0, y: 30, scale: 0.95 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }, [activeFilter, language]);

  if (!portfolioConfig.items.length) return null;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative w-full bg-kath-black py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-kath-gold text-xs uppercase tracking-[0.3em]">
            {portfolioConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-headline text-kath-white mt-4">
            {portfolioConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-kath-off-white/60 mt-4 max-w-2xl mx-auto">
            {portfolioConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {portfolioConfig.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category[language])}
              className={`px-5 py-2 font-body text-sm rounded-full transition-all duration-300 ${
                currentFilter === category[language]
                  ? 'bg-kath-gold text-kath-black'
                  : 'bg-kath-dark-gray text-kath-off-white/70 hover:text-kath-white border border-kath-charcoal hover:border-kath-gold/50'
              }`}
            >
              {category[language]}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="portfolio-item group relative overflow-hidden rounded-2xl cursor-pointer bg-kath-dark-gray"
            >
              {/* Image Container - Centered */}
              <div className="aspect-[4/3] overflow-hidden flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title[language]}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  style={{ objectPosition: 'center center' }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-kath-black via-kath-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {/* Category Badge */}
                <span className="inline-block self-start px-3 py-1 bg-kath-gold/20 text-kath-gold text-xs font-body rounded-full mb-3">
                  {item.category[language]}
                </span>

                {/* Title */}
                <h3 className="font-display text-xl text-kath-white mb-2 group-hover:text-kath-gold transition-colors duration-300">
                  {item.title[language]}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-4 text-kath-off-white/60">
                  <span className="flex items-center gap-1 text-xs font-body">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-body">
                    <Calendar className="w-3 h-3" />
                    {item.year}
                  </span>
                </div>

                {/* View Button */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-kath-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-kath-black" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24 md:mt-32" />
    </section>
  );
};

export default Portfolio;
