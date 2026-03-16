import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { competitionConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Trophy, Users, Award, Clock, ArrowRight, Rocket, 
  ChevronRight, Star, Target, TrendingUp, Medal, Sparkles
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Competition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    const flow = flowRef.current;

    if (!section || !header || !mainCard || !categories || !flow) return;

    const triggers: ScrollTrigger[] = [];

    // Header animation
    gsap.set(header.children, { opacity: 0, y: 30 });
    const headerTrigger = ScrollTrigger.create({
      trigger: header,
      start: 'top 85%',
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
    gsap.set(mainCard, { opacity: 0, y: 50, scale: 0.98 });
    const mainCardTrigger = ScrollTrigger.create({
      trigger: mainCard,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(mainCard, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(mainCardTrigger);

    // Flow steps animation
    const flowSteps = flow.querySelectorAll('.flow-step');
    gsap.set(flowSteps, { opacity: 0, y: 30, scale: 0.95 });
    const flowTrigger = ScrollTrigger.create({
      trigger: flow,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(flowSteps, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(1.5)',
        });
      },
    });
    triggers.push(flowTrigger);

    // Categories animation
    const categoryCards = categories.querySelectorAll('.category-card');
    gsap.set(categoryCards, { opacity: 0, y: 40 });
    const categoriesTrigger = ScrollTrigger.create({
      trigger: categories,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(categoryCards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
    if (name.includes('Startup') || name.includes('startup')) return <Rocket className="w-6 h-6 text-kath-primary" />;
    if (name.includes('Social') || name.includes('Sosial')) return <Award className="w-6 h-6 text-kath-primary" />;
    if (name.includes('Student') || name.includes('Mahasiswa')) return <Users className="w-6 h-6 text-kath-primary" />;
    if (name.includes('Corporate') || name.includes('Korporasi')) return <Trophy className="w-6 h-6 text-kath-primary" />;
    return <Trophy className="w-6 h-6 text-kath-primary" />;
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Open' || status === 'Buka') return 'status-open';
    if (status === 'Coming Soon' || status === 'Segera') return 'status-coming-soon';
    return 'status-closed';
  };

  // Competition flow steps
  const flowSteps = [
    {
      icon: <Users className="w-6 h-6" />,
      title: { id: 'Daftar', en: 'Register' },
      desc: { id: 'Buat akun & tim', en: 'Create account & team' },
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: { id: 'Pilih Kategori', en: 'Choose Category' },
      desc: { id: 'Pilih bidang kompetisi', en: 'Select competition field' },
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: { id: 'Submit', en: 'Submit' },
      desc: { id: 'Kirimkan proposalmu', en: 'Submit your proposal' },
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: { id: 'Menangkan', en: 'Win' },
      desc: { id: 'Raih hadiah total', en: 'Win total prizes' },
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="competition"
      className="relative w-full bg-kath-bg-main py-24 md:py-32 overflow-hidden"
    >
      {/* Background decoration - Elegant gold gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kath-primary/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-kath-gold/5 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-kath-primary/3 to-transparent rounded-full" />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-kath-primary/20 to-transparent" />
      <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-kath-primary/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-kath-primary/5 border border-kath-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-kath-primary" />
            <span className="font-body text-kath-primary text-xs uppercase tracking-[0.2em]">
              {competitionConfig.sectionLabel[language]}
            </span>
          </div>
          <h2 className="font-display text-headline text-kath-text-primary mt-4">
            <span className="text-gold-gradient">{language === 'id' ? 'Kompetisi' : 'Business'}</span>
            {' '}
            {language === 'id' ? 'BMC' : 'Model Canvas'}
          </h2>
          <p className="font-body text-kath-text-secondary mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {competitionConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Main Competition Card - Premium Design */}
        <div
          ref={mainCardRef}
          className="relative mb-16 md:mb-20"
        >
          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-kath-primary/40" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-kath-primary/40" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-kath-primary/40" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-kath-primary/40" />

          <div className="relative bg-white border border-kath-primary/10 rounded-3xl overflow-hidden shadow-2xl shadow-kath-primary/5">
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-kath-primary to-transparent" />

            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-kath-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-kath-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left - Info */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kath-primary to-kath-primary-dark flex items-center justify-center gold-glow-sm">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-body text-kath-primary text-sm uppercase tracking-wider font-medium">
                      {language === 'id' ? 'Kompetisi Utama' : 'Main Competition'}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-kath-text-primary mb-4 leading-tight">
                    {competitionConfig.mainCompetition.name[language]}
                  </h3>

                  <p className="font-body text-kath-text-secondary mb-8 text-base leading-relaxed">
                    {competitionConfig.mainCompetition.description[language]}
                  </p>

                  {/* Prize highlight */}
                  <div className="flex items-center gap-4 mb-8 p-4 bg-kath-primary/5 border border-kath-primary/20 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-kath-primary/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-kath-primary trophy-glow" />
                    </div>
                    <div>
                      <p className="font-body text-kath-text-muted text-xs uppercase tracking-wider">
                        {language === 'id' ? 'Total Hadiah' : 'Total Prize'}
                      </p>
                      <p className="font-display text-2xl text-kath-primary">
                        {competitionConfig.mainCompetition.totalPrize}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/bmc-competition')}
                    className="group btn-gold px-8 py-4 text-white font-body text-sm uppercase tracking-wider rounded-full flex items-center gap-3"
                  >
                    {language === 'id' ? 'Lihat Detail Kompetisi' : 'View Competition Details'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right - Countdown */}
                <div className="flex flex-col items-center lg:items-end">
                  <div className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-body text-kath-text-muted text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {language === 'id' ? 'Pendaftaran ditutup dalam' : 'Registration closes in'}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-body rounded-full border border-green-200">
                        {language === 'id' ? 'Sedang Berlangsung' : 'Now Open'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-3 md:gap-4">
                      {[
                        { value: timeLeft.days, label: language === 'id' ? 'Hari' : 'Days' },
                        { value: timeLeft.hours, label: language === 'id' ? 'Jam' : 'Hours' },
                        { value: timeLeft.minutes, label: language === 'id' ? 'Menit' : 'Mins' },
                        { value: timeLeft.seconds, label: language === 'id' ? 'Detik' : 'Secs' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="countdown-card aspect-square rounded-2xl flex flex-col items-center justify-center"
                        >
                          <span className="font-display text-3xl md:text-4xl text-kath-primary mb-1">
                            {String(item.value).padStart(2, '0')}
                          </span>
                          <span className="font-body text-[10px] text-kath-text-muted uppercase tracking-wider">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-kath-bg-section rounded-2xl">
                      <div className="text-center">
                        <p className="font-display text-xl text-kath-text-primary">500+</p>
                        <p className="font-body text-[10px] text-kath-text-muted uppercase tracking-wider">
                          {language === 'id' ? 'Peserta' : 'Participants'}
                        </p>
                      </div>
                      <div className="text-center border-x border-kath-primary/10">
                        <p className="font-display text-xl text-kath-text-primary">50+</p>
                        <p className="font-body text-[10px] text-kath-text-muted uppercase tracking-wider">
                          {language === 'id' ? 'Tim' : 'Teams'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-display text-xl text-kath-text-primary">4</p>
                        <p className="font-body text-[10px] text-kath-text-muted uppercase tracking-wider">
                          {language === 'id' ? 'Kategori' : 'Categories'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Competition Flow / How It Works */}
        <div ref={flowRef} className="mb-16 md:mb-20">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl text-kath-text-primary mb-2">
              {language === 'id' ? 'Alur Kompetisi' : 'Competition Flow'}
            </h3>
            <p className="font-body text-kath-text-muted">
              {language === 'id' 
                ? 'Ikuti langkah-langkah sederhana untuk berpartisipasi' 
                : 'Follow these simple steps to participate'}
            </p>
          </div>

          <div className="relative">
            {/* Connection line - desktop */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-kath-primary/30 to-transparent" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {flowSteps.map((step, index) => (
                <div
                  key={index}
                  className="flow-step group relative"
                >
                  <div className="relative p-6 bg-white border border-kath-primary/10 rounded-2xl hover:border-kath-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-kath-primary/5 hover:-translate-y-1">
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-kath-primary to-kath-primary-dark rounded-full flex items-center justify-center text-white font-body text-sm font-medium shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-kath-primary/10 flex items-center justify-center mb-4 group-hover:bg-kath-primary/20 transition-colors">
                      <div className="text-kath-primary">
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="font-display text-lg text-kath-text-primary mb-1">
                      {step.title[language]}
                    </h4>
                    <p className="font-body text-xs text-kath-text-muted">
                      {step.desc[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Cards - Premium Grid */}
        <div ref={categoriesRef}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-xl md:text-2xl text-kath-text-primary">
              {language === 'id' ? 'Kategori Kompetisi' : 'Competition Categories'}
            </h3>
            <button
              onClick={() => navigate('/bmc-competition')}
              className="group flex items-center gap-2 font-body text-sm text-kath-primary hover:text-kath-primary-dark transition-colors"
            >
              {language === 'id' ? 'Lihat Semua' : 'View All'}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {competitionConfig.categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => navigate('/bmc-competition')}
                className="category-card group relative p-6 bg-white border border-kath-primary/10 rounded-2xl hover:border-kath-primary/40 transition-all duration-400 cursor-pointer card-hover-gold overflow-hidden"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-kath-primary/0 to-kath-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  {/* Icon & Status */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kath-primary/10 to-kath-primary/5 border border-kath-primary/10 flex items-center justify-center group-hover:from-kath-primary/20 group-hover:to-kath-primary/10 transition-all">
                      {getCategoryIcon(category.name[language])}
                    </div>
                    <span className={`px-3 py-1 text-xs font-body rounded-full ${getStatusStyle(category.status[language])}`}>
                      {category.status[language]}
                    </span>
                  </div>

                  {/* Content */}
                  <h4 className="font-display text-lg text-kath-text-primary mb-2 group-hover:text-kath-primary transition-colors">
                    {category.name[language]}
                  </h4>
                  <p className="font-body text-xs text-kath-text-muted mb-4 line-clamp-2">
                    {category.target[language]}
                  </p>

                  {/* Prize & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-kath-primary/10">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-kath-gold" />
                      <span className="font-display text-sm text-kath-gold">{category.prize}</span>
                    </div>
                    <span className="flex items-center gap-1 text-kath-text-muted text-xs font-body group-hover:text-kath-primary transition-colors">
                      {language === 'id' ? 'Detail' : 'Details'}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24 md:mt-32" />
    </section>
  );
};

export default Competition;
