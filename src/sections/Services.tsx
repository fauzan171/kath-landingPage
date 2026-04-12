import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const customIconMap: Record<string, string> = {
  Heart: '/assets/hearth.png', 
  Building2: '/assets/workplace1.png', 
  Cake: '/assets/cake.png', 
  LayoutGrid: '/assets/exhibition.png', 
  Sparkles: '/assets/party.png', 
  Monitor: '/assets/virtual-party.png', 
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

    // Grid Items animation
    const cardElements = cards.querySelectorAll('.service-item');
    gsap.set(cardElements, { opacity: 0, y: 30 });
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
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  if (!servicesConfig.services.length) return null;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-[#F9F8F6] py-24 md:py-32"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div ref={headerRef} className="text-center mb-12 md:mb-16 lg:mb-20">
          <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
            {servicesConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#0F0F0F] mt-4 font-medium">
            {servicesConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto px-4">
            {servicesConfig.sectionDescription[language]}
          </p>
        </div>
      </div>

      {/* Services Grid Layout */}
      <div className="w-full border-t border-[#0F0F0F]/10">
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
        >
          {servicesConfig.services.map((service) => {
            const iconUrl = customIconMap[service.icon] || customIconMap.Sparkles;

            return (
              <div
                key={service.id}
                className="service-item group relative h-[220px] md:h-[260px] lg:h-[280px] border-b border-[#0F0F0F]/10 md:border-r overflow-hidden bg-[#F9F8F6] transition-colors duration-500 hover:bg-white cursor-pointer"
              >
                
                {/* --- DEKORASI PANAH (ARROW) YANG SEJAJAR --- */}
                {/* 1. `top-8 md:top-10` menyamakan padding p-8 md:p-10 dari konten di bawahnya.
                  2. `h-12 md:h-14` menyamakan tinggi persis kotak ikon utama agar center sejajar.
                */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-10 lg:right-10 h-10 md:h-12 lg:h-14 flex items-center z-20 pointer-events-none">
                  <ArrowUpRight 
                    className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 text-[#0F0F0F]/20 group-hover:text-[#FFB22C] group-hover:-translate-y-1 group-hover:translate-x-1" 
                    strokeWidth={1.5} 
                  />
                </div>

                {/* --- STATE NORMAL --- */}
                {/* Diubah dari justify-center menjadi justify-start agar menempel di atas (p-8 md:p-10) */}
                <div className="absolute inset-0 flex flex-col items-start justify-start p-6 md:p-8 lg:p-10 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-y-4">
                  
                  {/* Kotak Ikon Utama - Tingginya persis dengan wadah panah di atas (h-12 md:h-14) */}
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center border border-[#0F0F0F]/10 rounded-xl md:rounded-2xl bg-white shadow-sm mb-4 md:mb-5 flex-shrink-0">
                    <img 
                      src={iconUrl} 
                      alt={service.title[language]}
                      className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 object-contain"
                      style={{ filter: 'invert(75%) sepia(87%) saturate(583%) hue-rotate(338deg) brightness(101%) contrast(104%)' }} 
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-display text-lg md:text-xl lg:text-2xl text-[#0F0F0F] font-semibold mb-1.5 md:mb-2 pr-8">
                      {service.title[language]}
                    </h3>
                    <p className="font-body text-xs md:text-sm text-[#0F0F0F]/60 line-clamp-2 pr-4">
                      {service.description[language]}
                    </p>
                  </div>

                </div>

                {/* --- STATE HOVER --- */}
                {/* Diubah dari justify-center menjadi justify-start agar transisi konsisten di atas */}
                <div className="absolute inset-0 flex flex-col items-start justify-start p-6 md:p-8 lg:p-10 opacity-0 translate-y-8 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 bg-white">
                  
                  {/* Memberikan h-12 md:h-14 di header hover ini agar teks judulnya juga ikut sejajar dengan panah */}
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5 h-10 md:h-12 lg:h-14 w-full">
                    <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-[#0F0F0F]/10 rounded-lg md:rounded-xl bg-[#F9F8F6] flex-shrink-0">
                       <img 
                        src={iconUrl} 
                        alt="" 
                        className="w-5 h-5 object-contain" 
                        style={{ filter: 'invert(75%) sepia(87%) saturate(583%) hue-rotate(338deg) brightness(101%) contrast(104%)' }}
                      />
                    </div>
                    <h3 className="font-display text-lg md:text-xl text-[#0F0F0F] font-semibold pr-8 line-clamp-2">
                      {service.title[language]}
                    </h3>
                  </div>
                  
                  <ul className="space-y-2 md:space-y-2.5 mt-1 w-full">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="font-body text-xs md:text-sm text-[#0F0F0F]/70 flex items-start gap-2 md:gap-3"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB22C] flex-shrink-0 mt-1.5" />
                        <span className="pr-4">{feature[language]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Garis Emas Tipis di bawah saat hover */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FFB22C] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Garis Emas Tipis Bawah */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-20 md:mt-24 lg:mt-32">
        <div className="h-[1px] w-full bg-[#FFB22C]/30" />
      </div>
    </section>
  );
};

export default Services;