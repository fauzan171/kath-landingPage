import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { newsConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, ArrowRight, User, X, Clock, Tag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const News = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const [selectedNews, setSelectedNews] = useState<typeof newsConfig.items[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(() => language === 'id' ? 'Semua' : 'All');

  const categories = [
    { id: 'all', label: language === 'id' ? 'Semua' : 'All' },
    { id: 'competition', label: language === 'id' ? 'Kompetisi' : 'Competition' },
    { id: 'announcement', label: language === 'id' ? 'Pengumuman' : 'Announcement' },
    { id: 'news', label: language === 'id' ? 'Berita' : 'News' },
  ];

  const allLabel = language === 'id' ? 'Semua' : 'All';

  const filteredNews = activeCategory === allLabel
    ? newsConfig.items
    : newsConfig.items.filter(item => item.category[language] === activeCategory);

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
    const newsCards = grid.querySelectorAll('.news-card');
    gsap.set(newsCards, { opacity: 0, y: 40 });
    const gridTrigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(newsCards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(gridTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, [activeCategory, language]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const labels = {
    readMore: language === 'id' ? 'Baca Selengkapnya' : 'Read More',
    close: language === 'id' ? 'Tutup' : 'Close',
    share: language === 'id' ? 'Bagikan artikel ini' : 'Share this article',
    minRead: language === 'id' ? 'menit baca' : 'min read',
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="news"
        className="relative w-full bg-[#F9F8F6] py-24 md:py-32 overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12 md:mb-16">
            <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
              {newsConfig.sectionLabel[language]}
            </span>
            <h2 className="font-display text-4xl md:text-4xl lg:text-5xl font-medium text-[#0F0F0F] mt-4">
              {newsConfig.sectionTitle[language]}
            </h2>
            <p className="font-body text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto text-base md:text-lg">
              {newsConfig.sectionDescription[language]}
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.label)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 font-body text-xs md:text-sm rounded-full transition-all duration-300 font-medium ${
                    activeCategory === category.label
                      ? 'bg-[#FFB22C] text-[#0F0F0F] shadow-md shadow-[#FFB22C]/20'
                      : 'bg-white border border-[#0F0F0F]/10 text-[#0F0F0F]/60 hover:border-[#0F0F0F]/30 hover:text-[#0F0F0F]'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="news-card group bg-white border border-[#0F0F0F]/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#FFB22C]/10 hover:-translate-y-2 cursor-pointer flex flex-col"
                onClick={() => setSelectedNews(item)}
              >
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title[language]}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/60 to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#FFB22C] text-[#0F0F0F] text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {item.category[language]}
                  </span>
                </div>

                {/* Content Container (Latar tetap putih, hanya teks yang bereaksi) */}
                <div className="flex flex-col flex-grow p-4 md:p-6 bg-white">
                  <div className="flex items-center gap-3 md:gap-4 text-[#0F0F0F]/50 text-[10px] md:text-xs mb-2 md:mb-3 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {item.author}
                    </span>
                  </div>

                  {/* Judul berubah warna menjadi emas saat di-hover */}
                  <h3 className="font-display text-base md:text-lg lg:text-xl font-semibold text-[#0F0F0F] mb-2 md:mb-3 line-clamp-2 leading-snug transition-colors duration-300 group-hover:text-[#FFB22C]">
                    {item.title[language]}
                  </h3>

                  <p className="font-body text-xs md:text-sm text-[#0F0F0F]/60 mb-4 md:mb-6 line-clamp-2 flex-grow">
                    {item.excerpt[language]}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-[#FFB22C] font-body text-xs md:text-sm font-bold">
                    {labels.readMore}
                    {/* Tanda panah bergeser ke kanan saat di-hover */}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-20 md:mt-28">
          <div className="h-[1px] w-full bg-[#FFB22C]/30" />
        </div>
      </section>

      {/* News Detail Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedNews(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0F0F0F]/80 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[90vh] bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 hover:bg-[#FFB22C] shadow-sm rounded-full flex items-center justify-center text-[#0F0F0F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto w-full h-full">
              {/* Hero Image */}
              <div className="relative h-48 md:h-64 lg:h-80 w-full">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title[language]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative -mt-12 md:-mt-16 px-5 md:px-12 pb-8 md:pb-12 bg-white rounded-t-2xl md:rounded-t-3xl pt-6 md:pt-8">
                {/* Category Badge */}
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFB22C] text-[#0F0F0F] text-xs font-bold uppercase tracking-wider rounded-full mb-5">
                  <Tag className="w-3.5 h-3.5" />
                  {selectedNews.category[language]}
                </span>

                {/* Title */}
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0F0F0F] mb-4 md:mb-6 leading-tight">
                  {selectedNews.title[language]}
                </h2>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[#0F0F0F]/60 font-medium text-xs md:text-sm mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#0F0F0F]/10">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FFB22C]" />
                    {formatDate(selectedNews.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FFB22C]" />
                    {selectedNews.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FFB22C]" />
                    5 {labels.minRead}
                  </span>
                </div>

                {/* Article Content */}
                <div className="prose max-w-none">
                  <p className="font-body text-base md:text-lg text-[#0F0F0F]/80 font-medium leading-relaxed mb-4 md:mb-6">
                    {selectedNews.excerpt[language]}
                  </p>
                  <p className="font-body text-[#0F0F0F]/70 leading-relaxed">
                    {selectedNews.content[language]}
                  </p>
                </div>

                {/* Share Section */}
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[#0F0F0F]/10">
                  <p className="font-body text-sm font-bold text-[#0F0F0F]/50 uppercase tracking-wider mb-4">
                    {labels.share}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Twitter', 'Facebook', 'LinkedIn', 'WhatsApp'].map((platform) => (
                      <button
                        key={platform}
                        className="px-5 py-2.5 bg-[#F9F8F6] border border-[#0F0F0F]/10 hover:bg-[#FFB22C] hover:border-[#FFB22C] text-[#0F0F0F] text-sm font-medium font-body rounded-full transition-all duration-300"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;