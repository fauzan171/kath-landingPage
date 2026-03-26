import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Calendar, ArrowUpRight } from '../icons';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // State untuk membatasi jumlah item yang tampil
  const [visibleCount, setVisibleCount] = useState(6);
  
  const { language } = useLanguage();

  const allLabel = language === 'id' ? 'Semua' : 'All';
  const currentFilter = activeFilter === 'All' || activeFilter === 'Semua' 
    ? allLabel 
    : activeFilter;

  // 1. Filter item berdasarkan kategori
  const filteredItems = currentFilter === allLabel
    ? portfolioConfig.items
    : portfolioConfig.items.filter(item => item.category[language] === currentFilter);

  // 2. Potong item sesuai jumlah visibleCount (Maksimal 6 di awal)
  const displayedItems = filteredItems.slice(0, visibleCount);
  
  // 3. Cek apakah masih ada sisa item untuk ditampilkan
  const hasMore = filteredItems.length > visibleCount;

  // Kembalikan ke 6 item setiap kali filter kategori berubah
  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter]);

  // Animasi Header & Grid Awal
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

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  // Re-animate ketika filter atau jumlah item (Load More) berubah
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = grid.querySelectorAll('.portfolio-item');
    
    // Bunuh animasi sebelumnya agar tidak bertabrakan (glitch)
    gsap.killTweensOf(items);
    
    gsap.set(items, { opacity: 0, y: 30, scale: 0.95 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }, [activeFilter, language, visibleCount]);

  if (!portfolioConfig.items.length) return null;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative w-full bg-[#F9F8F6] py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
            {portfolioConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#0F0F0F] mt-4 font-medium">
            {portfolioConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto">
            {portfolioConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {portfolioConfig.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category[language])}
              className={`px-5 py-2.5 font-body text-xs font-semibold tracking-wider rounded-full transition-all duration-300 border ${
                currentFilter === category[language]
                  ? 'bg-[#FFB22C] text-[#0F0F0F] border-[#FFB22C] shadow-md shadow-[#FFB22C]/20'
                  : 'bg-white text-[#0F0F0F]/60 border-[#0F0F0F]/10 hover:border-[#FFB22C]/50 hover:text-[#0F0F0F]'
              }`}
            >
              {category[language]}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="portfolio-item group relative flex flex-col bg-white border border-[#0F0F0F]/10 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-[#0F0F0F]/5 transition-all duration-300"
            >
              {/* Image Container - Bagian Atas Card */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F9F8F6]">
                <img
                  src={item.image}
                  alt={item.title[language]}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* View Button (Ikon Panah) Mengambang di atas gambar saat di-hover */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFB22C] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <ArrowUpRight className="w-5 h-5 text-[#0F0F0F]" />
                </div>
              </div>

              {/* Content Container - Bagian Bawah Card */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                {/* Category Badge */}
                <span className="inline-block self-start px-3 py-1 bg-[#FFB22C]/10 text-[#FFB22C] text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  {item.category[language]}
                </span>

                {/* Title */}
                <h3 className="font-display text-xl md:text-2xl text-[#0F0F0F] font-semibold mb-4 group-hover:text-[#FFB22C] transition-colors duration-300 line-clamp-2">
                  {item.title[language]}
                </h3>

                {/* Meta Data (Garis pembatas di atasnya agar lebih rapi) */}
                <div className="mt-auto pt-4 border-t border-[#0F0F0F]/5 flex items-center justify-between text-[#0F0F0F]/60">
                  <span className="flex items-center gap-1.5 text-xs font-body font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#FFB22C]" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-body font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#FFB22C]" />
                    {item.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button - Hanya muncul jika item > 6 */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-8 h-12 flex items-center justify-center bg-transparent border border-[#0F0F0F]/20 hover:border-[#FFB22C] hover:bg-[#FFB22C] text-[#0F0F0F] font-body font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 group"
            >
              {language === 'id' ? 'Muat Lebih Banyak' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Garis Pembatas Bawah Konsisten */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-20 md:mt-24 lg:mt-32">
        <div className="h-[1px] w-full bg-[#FFB22C]/30" />
      </div>
    </section>
  );
};

export default Portfolio;