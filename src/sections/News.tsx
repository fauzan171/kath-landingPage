import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { newsConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, ArrowRight, User, X, Clock, Tag } from '../icons';

gsap.registerPlugin(ScrollTrigger);

const News = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const [selectedNews, setSelectedNews] = useState<typeof newsConfig.items[0] | null>(null);

  // Default category based on language
  const defaultCategory = language === 'id' ? 'Semua' : 'All';
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);

  // Sync category with language changes
  useEffect(() => {
    setActiveCategory(language === 'id' ? 'Semua' : 'All');
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [language]);

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
        className="relative w-full bg-kath-bg-main py-24 md:py-32 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-kath-primary rounded-full blur-[200px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12 md:mb-16">
            <span className="font-body text-kath-primary text-xs uppercase tracking-[0.3em]">
              {newsConfig.sectionLabel[language]}
            </span>
            <h2 className="font-display text-headline text-kath-text-primary mt-4">
              {newsConfig.sectionTitle[language]}
            </h2>
            <p className="font-body text-kath-text-secondary mt-4 max-w-2xl mx-auto">
              {newsConfig.sectionDescription[language]}
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.label)}
                  className={`px-5 py-2 font-body text-sm rounded-full transition-all duration-300 ${
                    activeCategory === category.label
                      ? 'bg-kath-primary text-white'
                      : 'bg-white text-kath-text-secondary hover:bg-kath-primary/10 hover:text-kath-primary border border-kath-bg-section'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="news-card group bg-white border border-kath-bg-section rounded-2xl overflow-hidden hover:border-kath-primary/30 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title[language]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kath-text-primary/60 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-kath-primary/90 text-white text-xs font-body uppercase tracking-wider rounded-full">
                    {item.category[language]}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-kath-text-muted text-xs mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.author}
                    </span>
                  </div>

                  <h3 className="font-display text-lg text-kath-text-primary mb-3 line-clamp-2 group-hover:text-kath-primary transition-colors">
                    {item.title[language]}
                  </h3>

                  <p className="font-body text-sm text-kath-text-secondary mb-4 line-clamp-2">
                    {item.excerpt[language]}
                  </p>

                  <button
                    onClick={() => setSelectedNews(item)}
                    className="group/btn flex items-center gap-2 text-kath-primary font-body text-sm hover:gap-3 transition-all"
                  >
                    {labels.readMore}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="section-divider mt-24 md:mt-32" />
      </section>

      {/* News Detail Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedNews(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-kath-black/95 backdrop-blur-lg" />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-kath-dark-gray border border-kath-charcoal/50 rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-kath-black/50 hover:bg-kath-gold/20 rounded-full flex items-center justify-center text-kath-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title[language]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kath-dark-gray via-kath-dark-gray/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative -mt-20 px-6 md:px-12 pb-12">
                {/* Category Badge */}
                <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-kath-gold text-kath-black text-xs font-body uppercase tracking-wider rounded-full mb-4">
                  <Tag className="w-3 h-3" />
                  {selectedNews.category[language]}
                </span>

                {/* Title */}
                <h2 className="font-display text-2xl md:text-4xl text-kath-white mb-6">
                  {selectedNews.title[language]}
                </h2>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 text-kath-off-white/60 text-sm mb-8 pb-8 border-b border-kath-charcoal/50">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-kath-gold" />
                    {formatDate(selectedNews.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-kath-gold" />
                    {selectedNews.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-kath-gold" />
                    5 {labels.minRead}
                  </span>
                </div>

                {/* Article Content */}
                <div className="prose prose-invert max-w-none">
                  <p className="font-body text-lg text-kath-off-white/80 leading-relaxed mb-6">
                    {selectedNews.excerpt[language]}
                  </p>
                  <p className="font-body text-kath-off-white/70 leading-relaxed">
                    {selectedNews.content[language]}
                  </p>
                </div>

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-kath-charcoal/50">
                  <p className="font-body text-sm text-kath-off-white/50 mb-4">{labels.share}</p>
                  <div className="flex gap-3">
                    {['Twitter', 'Facebook', 'LinkedIn', 'WhatsApp'].map((platform) => (
                      <button
                        key={platform}
                        className="px-4 py-2 bg-kath-charcoal/50 hover:bg-kath-gold/20 text-kath-off-white text-sm font-body rounded-full transition-colors"
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
