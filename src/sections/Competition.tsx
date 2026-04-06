import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { competitionConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Trophy, Users, Award, Clock, ArrowRight, Rocket } from 'lucide-react';
import { useCountdownDeadline } from '../hooks/useCountdownDeadline';

gsap.registerPlugin(ScrollTrigger);

const Competition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Countdown timer - reads deadline from Supabase (admin controlled via stage end_date)
  const { timeLeft } = useCountdownDeadline();

  // Animasi GSAP In saat Scroll
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Main Card Animation
      if (mainCardRef.current) {
        gsap.fromTo(
          mainCardRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mainCardRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }

      // Categories Cards Animation
      if (categoriesRef.current) {
        const categoryCards = categoriesRef.current.querySelectorAll('.category-card');
        gsap.fromTo(
          categoryCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: categoriesRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getCategoryIcon = (name: string) => {
    if (name.includes('Startup') || name.includes('startup')) return <Rocket className="w-5 h-5 text-current" />;
    if (name.includes('Social') || name.includes('Sosial')) return <Award className="w-5 h-5 text-current" />;
    if (name.includes('Student') || name.includes('Mahasiswa')) return <Users className="w-5 h-5 text-current" />;
    if (name.includes('Corporate') || name.includes('Korporasi')) return <Trophy className="w-5 h-5 text-current" />;
    return <Trophy className="w-5 h-5 text-current" />;
  };

  const renderStatusBadge = (status: string) => {
    const isOpen = status === 'Open' || status === 'Buka';
    const isComingSoon = status === 'Coming Soon' || status === 'Segera';

    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border transition-all duration-300 relative z-20
        ${isOpen ? 'border-[#0F0F0F]/20 text-[#0F0F0F] bg-white group-hover:border-[#FFB22C] group-hover:text-[#FFB22C]' 
                 : isComingSoon ? 'border-[#FFB22C]/30 text-[#FFB22C] bg-[#FFB22C]/5' 
                 : 'border-[#0F0F0F]/10 text-[#0F0F0F]/40'}`}
      >
        {isOpen && (
          <span className="relative flex h-2 w-2">
            {/* Animasi gelombang kedip (ping) diubah agar menjadi emas saat hover */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 group-hover:bg-[#FFB22C] transition-colors duration-300"></span>
            {/* Titik utama diubah agar menjadi emas saat hover */}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-[#FFB22C] transition-colors duration-300"></span>
          </span>
        )}
        {status}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="competition"
      className="relative w-full bg-[#F9F8F6] text-[#0F0F0F] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
            {competitionConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-medium mt-4">
            {competitionConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto text-lg">
            {competitionConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Main Competition Card */}
        <div
          ref={mainCardRef}
          className="relative mb-16 p-8 md:p-12 bg-white border border-[#0F0F0F]/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#FFB22C]/5 transition-shadow duration-500"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#FFB22C]/5 to-transparent pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left - Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FFB22C]/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#FFB22C]" />
                </div>
                <span className="font-body text-[#FFB22C] text-sm font-bold uppercase tracking-wider">
                  {language === 'id' ? 'Kompetisi Utama' : 'Main Competition'}
                </span>
              </div>
              <h3 className="font-display text-4xl md:text-5xl font-semibold text-[#0F0F0F] mb-4 leading-tight">
                {competitionConfig.mainCompetition.name[language]}
              </h3>
              <p className="font-body text-[#0F0F0F]/70 mb-8 text-lg leading-relaxed">
                {competitionConfig.mainCompetition.description[language]}
              </p>
              <button
                onClick={() => navigate('/cibc')}
                className="group px-8 py-4 bg-[#FFB22C] text-[#0F0F0F] font-body text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-3 hover:bg-[#0F0F0F] hover:text-[#FFB22C] hover:shadow-lg hover:-translate-y-1"
              >
                {language === 'id' ? 'Lihat Detail Kompetisi' : 'View Competition Details'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right - Countdown */}
            <div className="flex flex-col items-start lg:items-end">
              <span className="font-body text-[#0F0F0F]/50 text-sm font-medium mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Clock className="w-4 h-4 text-[#FFB22C]" />
                {language === 'id' ? 'Pendaftaran ditutup dalam' : 'Registration closes in'}
              </span>
              <div className="grid grid-cols-4 gap-3 md:gap-4 w-full lg:w-auto">
                {[
                  { value: timeLeft.days, label: language === 'id' ? 'Hari' : 'Days' },
                  { value: timeLeft.hours, label: language === 'id' ? 'Jam' : 'Hours' },
                  { value: timeLeft.minutes, label: language === 'id' ? 'Menit' : 'Mins' },
                  { value: timeLeft.seconds, label: language === 'id' ? 'Detik' : 'Secs' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="w-full aspect-square md:w-24 md:h-24 bg-[#F9F8F6] border border-[#0F0F0F]/10 rounded-2xl flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-display text-3xl md:text-4xl font-semibold text-[#FFB22C] mb-1">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="font-body text-[10px] md:text-xs text-[#0F0F0F]/40 uppercase font-bold tracking-widest">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards (Hanya Teks/Konten yang Berubah Warna) */}
        <div ref={categoriesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {competitionConfig.categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate('/cibc')}
              className="category-card group relative bg-white border border-[#0F0F0F]/10 p-8 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#FFB22C]/10 hover:-translate-y-2 flex flex-col"
            >
              {/* Header Card: Ikon & Badge Status */}
              <div className="flex items-center justify-between mb-8">
                {/* Ikon Kategori: Hover menjadi Emas */}
                <div className="w-12 h-12 rounded-xl bg-[#F9F8F6] border border-[#0F0F0F]/5 flex items-center justify-center text-[#0F0F0F]/40 transition-colors duration-300 group-hover:bg-[#FFB22C]/10 group-hover:border-[#FFB22C]/20 group-hover:text-[#FFB22C]">
                  {getCategoryIcon(category.name[language])}
                </div>
                {renderStatusBadge(category.status[language])}
              </div>
              
              {/* Judul: Hover menjadi Emas */}
              <h4 className="font-display text-2xl font-semibold text-[#0F0F0F] mb-3 leading-snug transition-colors duration-300 group-hover:text-[#FFB22C]">
                {category.name[language]}
              </h4>
              
              <p className="font-body text-sm text-[#0F0F0F]/60 mb-8 flex-grow">
                {category.target[language]}
              </p>
              
              {/* Bottom section (Prize & Button) */}
              <div className="pt-4 border-t border-[#0F0F0F]/10 flex items-center justify-between transition-colors duration-300 group-hover:border-[#FFB22C]/30">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FFB22C]" />
                  <span className="font-body text-sm font-bold text-[#0F0F0F]">{category.prize}</span>
                </div>
                {/* Tombol Bulat Panah: Hover menjadi Emas Solid */}
                <div className="w-8 h-8 rounded-full border border-[#0F0F0F]/10 flex items-center justify-center text-[#0F0F0F]/40 transition-all duration-300 group-hover:bg-[#FFB22C] group-hover:text-[#0F0F0F] group-hover:border-[#FFB22C]">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Garis Pembatas Bawah */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-20 md:mt-28">
        <div className="h-[1px] w-full bg-[#FFB22C]/30" />
      </div>
    </section>
  );
};

export default Competition;