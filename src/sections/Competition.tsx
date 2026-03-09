import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { competitionConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Trophy, Users, Award, Clock, ArrowRight, Rocket, ChevronRight } from 'lucide-react';
import AboutCompetition from '../pages/AboutCompetition';

gsap.registerPlugin(ScrollTrigger);

const Competition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Show about competition page
  const [showAboutPage, setShowAboutPage] = useState(false);

  useEffect(() => {
    const deadline = new Date(competitionConfig.mainCompetition.deadline);

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const mainCard = mainCardRef.current;
    const categories = categoriesRef.current;

    if (!section || !header || !mainCard || !categories) return;

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

    // Main card animation
    gsap.set(mainCard, { opacity: 0, y: 50 });
    const mainCardTrigger = ScrollTrigger.create({
      trigger: mainCard,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(mainCard, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(mainCardTrigger);

    // Categories animation
    const categoryCards = categories.querySelectorAll('.category-card');
    gsap.set(categoryCards, { opacity: 0, y: 40 });
    const categoriesTrigger = ScrollTrigger.create({
      trigger: categories,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(categoryCards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(categoriesTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  const getCategoryIcon = (name: string) => {
    if (name.includes('Startup') || name.includes('startup')) return <Rocket className="w-5 h-5 text-kath-gold" />;
    if (name.includes('Social') || name.includes('Sosial')) return <Award className="w-5 h-5 text-kath-gold" />;
    if (name.includes('Student') || name.includes('Mahasiswa')) return <Users className="w-5 h-5 text-kath-gold" />;
    if (name.includes('Corporate') || name.includes('Korporasi')) return <Trophy className="w-5 h-5 text-kath-gold" />;
    return <Trophy className="w-5 h-5 text-kath-gold" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Open' || status === 'Buka') return 'bg-green-500/20 text-green-400';
    if (status === 'Coming Soon' || status === 'Segera') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  // Show about page if clicked
  if (showAboutPage) {
    return (
      <AboutCompetition
        onBack={() => setShowAboutPage(false)}
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      id="competition"
      className="relative w-full bg-kath-dark-gray py-24 md:py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-kath-gold rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-kath-gold rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-kath-gold text-xs uppercase tracking-[0.3em]">
            {competitionConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-headline text-kath-white mt-4">
            {competitionConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-kath-off-white/60 mt-4 max-w-2xl mx-auto">
            {competitionConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Main Competition Card */}
        <div
          ref={mainCardRef}
          className="relative mb-12 p-8 md:p-12 bg-gradient-to-br from-kath-gold/20 to-kath-gold/5 border border-kath-gold/30 rounded-3xl overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-kath-gold/10 rounded-full blur-[80px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-kath-gold" />
                <span className="font-body text-kath-gold text-sm uppercase tracking-wider">
                  {language === 'id' ? 'Kompetisi Utama' : 'Main Competition'}
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-kath-white mb-4">
                {competitionConfig.mainCompetition.name[language]}
              </h3>
              <p className="font-body text-kath-off-white/70 mb-6">
                {competitionConfig.mainCompetition.description[language]}
              </p>
              <button
                onClick={() => setShowAboutPage(true)}
                className="group px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
              >
                {language === 'id' ? 'Lihat Detail Kompetisi' : 'View Competition Details'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right - Countdown */}
            <div className="flex flex-col items-center lg:items-end">
              <span className="font-body text-kath-off-white/60 text-sm mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {language === 'id' ? 'Pendaftaran ditutup dalam' : 'Registration closes in'}
              </span>
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {[
                  { value: timeLeft.days, label: language === 'id' ? 'Hari' : 'Days' },
                  { value: timeLeft.hours, label: language === 'id' ? 'Jam' : 'Hours' },
                  { value: timeLeft.minutes, label: language === 'id' ? 'Menit' : 'Mins' },
                  { value: timeLeft.seconds, label: language === 'id' ? 'Detik' : 'Secs' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 md:w-20 md:h-20 bg-kath-black/50 border border-kath-gold/30 rounded-xl flex flex-col items-center justify-center"
                  >
                    <span className="font-display text-2xl md:text-3xl text-kath-gold">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="font-body text-[10px] text-kath-off-white/50 uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div ref={categoriesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {competitionConfig.categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setShowAboutPage(true)}
              className="category-card group p-6 bg-kath-black/50 border border-kath-charcoal/50 rounded-2xl hover:border-kath-gold/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-kath-gold/10 flex items-center justify-center">
                  {getCategoryIcon(category.name[language])}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-body rounded-full ${
                    getStatusColor(category.status[language])
                  }`}
                >
                  {category.status[language]}
                </span>
              </div>
              <h4 className="font-display text-lg text-kath-white mb-2 group-hover:text-kath-gold transition-colors">
                {category.name[language]}
              </h4>
              <p className="font-body text-xs text-kath-off-white/50 mb-3">
                {category.target[language]}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-kath-gold" />
                  <span className="font-body text-sm text-kath-gold">{category.prize}</span>
                </div>
                <span className="flex items-center gap-1 text-kath-off-white/40 text-xs font-body group-hover:text-kath-gold transition-colors">
                  {language === 'id' ? 'Lihat Detail' : 'View Details'}
                  <ChevronRight className="w-3 h-3" />
                </span>
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

export default Competition;
