/**
 * CIBC Power by KATH - Grand Competition Landing Page
 *
 * Grand Theme: Innovating Tomorrow: Youth-Driven Business Solutions for a Sustainable Global Future
 * Color Theme: Cream (#E6DDC5) & Black
 */

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Trophy, ChevronDown, ChevronUp,
  ArrowRight, CircleCheck,
  Mail, Instagram, Linkedin, Twitter,
  Sun, Clock, Quote, Play
} from '../../icons';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// DATA CONFIGURATION
// ============================================

const COMPETITION_DATA = {
  name: 'CIBC Power 2026',
  tagline: 'by KATH Event Organizer',
  grandTheme: {
    en: 'Innovating Tomorrow: Youth-Driven Business Solutions for a Sustainable Global Future',
    id: 'Menginovasi Masa Depan: Solusi Bisnis Berbasis Pemuda untuk Masa Depan Global yang Berkelanjutan',
  },
  subThemes: [
    {
      id: 1,
      title: { en: 'Empowering the Global Gen Z Economy', id: 'Memberdayakan Ekonomi Gen Z Global' },
      description: {
        en: 'Innovative business model development addressing Gen Z needs in digital lifestyle, creative economy, sustainability, and future of work amidst global economic changes.',
        id: 'Pengembangan model bisnis inovatif yang menjawab kebutuhan Generasi Z dalam bidang digital lifestyle, ekonomi kreatif, sustainability, dan future of work di tengah perubahan ekonomi global.',
      },
    },
    {
      id: 2,
      title: { en: 'Technology & Sustainability in the Future of Beauty Industry', id: 'Teknologi & Keberlanjutan dalam Masa Depan Industri Kecantikan' },
      description: {
        en: 'Beauty business development integrating technology, environmental sustainability, and inclusivity to address changing consumer needs in the international market.',
        id: 'Pengembangan bisnis kecantikan yang mengintegrasikan teknologi, keberlanjutan lingkungan, dan inklusivitas untuk menjawab perubahan kebutuhan konsumen di pasar internasional.',
      },
    },
  ],
  stats: [
    { value: '$100K+', label: { en: 'Total Prize Pool', id: 'Total Hadiah' } },
    { value: '30+', label: { en: 'Countries', id: 'Negara' } },
    { value: '500+', label: { en: 'Expected Teams', id: 'Target Tim' } },
    { value: '50+', label: { en: 'Universities', id: 'Universitas' } },
  ],
  timeline: [
    {
      phase: { en: 'Registration Open', id: 'Pendaftaran Dibuka' },
      date: '1 January - 28 February 2026',
      description: { en: 'Team registration and proposal submission', id: 'Pendaftaran tim dan pengumpulan proposal' },
      status: 'active',
    },
    {
      phase: { en: 'Screening Phase', id: 'Tahap Screening' },
      date: '1 - 31 March 2026',
      description: { en: 'Initial screening of all submissions', id: 'Screening awal semua pengajuan' },
      status: 'upcoming',
    },
    {
      phase: { en: 'Semifinal', id: 'Semifinal' },
      date: '1 - 30 April 2026',
      description: { en: 'Mentorship and pitch preparation', id: 'Mentoring dan persiapan pitch' },
      status: 'upcoming',
    },
    {
      phase: { en: 'Grand Final', id: 'Grand Final' },
      date: '15 - 17 May 2026',
      description: { en: 'Final pitch and awarding ceremony', id: 'Pitch final dan penghargaan' },
      status: 'upcoming',
    },
  ],
  prizes: {
    totalPool: '$100,000+',
    categories: {
      student: [
        { rank: '1st', amount: '$25,000', benefits: ['Cash Prize', 'Mentorship Program', 'Certificate', 'Networking Access'] },
        { rank: '2nd', amount: '$15,000', benefits: ['Cash Prize', 'Mentorship', 'Certificate'] },
        { rank: '3rd', amount: '$10,000', benefits: ['Cash Prize', 'Certificate'] },
      ],
      startup: [
        { rank: '1st', amount: '$50,000', benefits: ['Cash Prize', 'Investment Opportunity', 'Incubation Program', 'Mentorship'] },
        { rank: '2nd', amount: '$30,000', benefits: ['Cash Prize', 'Mentorship', 'Networking'] },
        { rank: '3rd', amount: '$20,000', benefits: ['Cash Prize', 'Mentorship'] },
      ],
      corporate: [
        { rank: '1st', amount: 'Trophy', benefits: ['Champion Trophy', 'Global Recognition', 'Partnership Opportunity', 'Media Coverage'] },
        { rank: '2nd', amount: 'Trophy', benefits: ['Trophy', 'Recognition', 'Certificate'] },
        { rank: '3rd', amount: 'Trophy', benefits: ['Trophy', 'Certificate'] },
      ],
    },
  },
  testimonials: [
    {
      name: 'Sarah Chen',
      role: 'Winner 2025 - Student Category',
      company: 'EcoTech Solutions',
      quote: {
        en: 'CIBC Power was a life-changing experience. The mentorship and exposure we received helped us transform our idea into a real business.',
        id: 'CIBC Power adalah pengalaman yang mengubah hidup. Bimbingan dan eksposur yang kami terima membantu kami mengubah ide menjadi bisnis nyata.',
      },
      image: '/cibc/testimonial-1.webp',
    },
    {
      name: 'Ahmad Rizki',
      role: 'Winner 2025 - Startup Category',
      company: 'Green Innovators',
      quote: {
        en: 'The networking opportunities at CIBC Power are incredible. We connected with investors and mentors who are now part of our journey.',
        id: 'Peluang networking di CIBC Power luar biasa. Kami terhubung dengan investor dan mentor yang sekarang menjadi bagian dari perjalanan kami.',
      },
      image: '/cibc/testimonial-2.webp',
    },
    {
      name: 'Dr. Maria Santos',
      role: 'Judge & Mentor',
      company: 'Stanford University',
      quote: {
        en: 'The quality of submissions at CIBC Power rivals top international competitions. These young innovators are truly shaping the future.',
        id: 'Kualitas pengajuan di CIBC Power menyaingi kompetisi internasional teratas. Para inovator muda ini benar-benar membentuk masa depan.',
      },
      image: '/cibc/testimonial-3.webp',
    },
  ],
  faqs: [
    {
      q: { en: 'Who can participate?', id: 'Siapa yang bisa ikut?' },
      a: {
        en: 'The competition is open to students (16-28 years), early-stage startups (0-3 years), and corporate companies from around the world.',
        id: 'Kompetisi ini terbuka untuk siswa (16-28 tahun), startup awal (0-3 tahun), dan perusahaan korporat dari seluruh dunia.',
      },
    },
    {
      q: { en: 'How many team members are allowed?', id: 'Berapa jumlah anggota tim?' },
      a: {
        en: 'Teams consist of 1-5 members for Student and Startup categories, and 2-10 members for Corporate category.',
        id: 'Tim terdiri dari 1-5 anggota untuk kategori Student dan Startup, dan 2-10 anggota untuk kategori Corporate.',
      },
    },
    {
      q: { en: 'Is there a registration fee?', id: 'Apakah ada biaya pendaftaran?' },
      a: {
        en: 'No, registration is completely free for all participants.',
        id: 'Tidak, pendaftaran gratis untuk semua peserta.',
      },
    },
    {
      q: { en: 'What is the competition format?', id: 'Bagaimana format kompetisi?' },
      a: {
        en: 'Participants submit a Business Model Canvas along with supporting documents. Finalists will pitch in person at the Grand Final in Jakarta.',
        id: 'Peserta mengajukan Business Model Canvas beserta dokumen pendukung. Finalis akan mempresentasikan secara langsung di Grand Final di Jakarta.',
      },
    },
    {
      q: { en: 'What documents are required?', id: 'Dokumen apa saja yang diperlukan?' },
      a: {
        en: 'Required documents include: BMC, Pitch Deck (max 15 slides), Executive Summary (max 2 pages), and optional 3-minute pitch video.',
        id: 'Dokumen yang diperlukan: BMC, Pitch Deck (maks 15 slide), Executive Summary (maks 2 halaman), dan video pitch 3 menit (opsional).',
      },
    },
  ],
  contact: {
    email: 'cibc@kathevent.com',
    phone: '+62 21 1234 5678',
    instagram: '@cibcpower',
    linkedin: 'CIBC Power',
    twitter: '@cibcpower',
  },
};

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const deadline = new Date('2026-02-28T23:59:59');

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

  return (
    <div className="flex gap-3 md:gap-6">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' },
      ].map((item, index) => (
        <div key={index} className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-cibc-primary/20 border border-cibc-primary/40 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="font-display text-2xl md:text-3xl text-cibc-primary">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="font-body text-xs text-cibc-textSecondary mt-2 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, label }: { value: string; label: { en: string; id: string } }) => {
  const { language } = useLanguage();
  const counterRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    const trigger = ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      onEnter: () => {
        if (!hasAnimated.current) {
          hasAnimated.current = true;
          gsap.fromTo(
            counter.querySelector('.counter-value'),
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
          );
        }
      },
      once: true,
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={counterRef} className="text-center">
      <div className="counter-value font-display text-3xl md:text-5xl text-cibc-primary mb-2">{value}</div>
      <div className="font-body text-sm md:text-base text-cibc-textSecondary">{label[language]}</div>
    </div>
  );
};

// Main Component
const CIBCLanding = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'student' | 'startup' | 'corporate'>('student');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const prizesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount - useLayoutEffect ensures it runs before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // GSAP Animations
  useEffect(() => {
    const hero = heroRef.current;
    const stats = statsRef.current;
    const about = aboutRef.current;
    const themes = themesRef.current;
    const timeline = timelineRef.current;
    const prizes = prizesRef.current;

    if (!hero) return;

    // Hero entrance animation
    gsap.fromTo(
      '.hero-content > *',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    );

    // Stats animation
    if (stats) {
      ScrollTrigger.create({
        trigger: stats,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            stats.children,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        },
        once: true,
      });
    }

    // About animation
    if (about) {
      ScrollTrigger.create({
        trigger: about,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            '.about-content',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true,
      });
    }

    // Themes animation
    if (themes) {
      ScrollTrigger.create({
        trigger: themes,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            '.theme-card',
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out' }
          );
        },
        once: true,
      });
    }

    // Timeline animation
    if (timeline) {
      ScrollTrigger.create({
        trigger: timeline,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            '.timeline-item',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
          );
        },
        once: true,
      });
    }

    // Prizes animation
    if (prizes) {
      ScrollTrigger.create({
        trigger: prizes,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            '.prize-card',
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }
          );
        },
        once: true,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % COMPETITION_DATA.testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cibc-bgMain">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Video/Image Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cibc/hero-bg.webp')`,
            }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-cibc-bgMain/90 via-cibc-bgMain/70 to-cibc-bgMain" />
          <div className="absolute inset-0 bg-gradient-to-r from-cibc-bgMain/90 via-transparent to-cibc-bgMain/90" />
          {/* Cream Accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-cibc-primary/10 to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cibc-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cibc-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="hero-content relative z-10 container mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cibc-primary/10 border border-cibc-primary/30 mb-8 backdrop-blur-sm">
            <Sun className="w-4 h-4 text-cibc-primary" />
            <span className="text-cibc-primary text-sm font-body tracking-wider">INTERNATIONAL BMC COMPETITION 2026</span>
          </div>

          {/* Logo */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white mb-4 tracking-tight">
            CIBC
          </h1>
          <p className="font-body text-2xl md:text-3xl text-cibc-primary mb-8 tracking-wide">
            Power by KATH Event Organizer
          </p>

          {/* Grand Theme */}
          <div className="max-w-4xl mx-auto mb-10">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white leading-tight">
              {COMPETITION_DATA.grandTheme[language]}
            </h2>
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center mb-12">
            <CountdownTimer />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/cibc/register')}
              className="group relative px-10 py-4 bg-cibc-primary text-cibc-textDark font-body font-semibold text-sm uppercase tracking-wider rounded-full overflow-hidden hover:bg-cibc-primaryDark transition-all duration-300 shadow-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 border-2 border-cibc-primary/40 text-cibc-primary font-body text-sm uppercase tracking-wider rounded-full hover:bg-cibc-primary/10 transition-all duration-300"
            >
              {language === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
            </button>
          </div>

          {/* Video Play Button */}
          <button className="group flex items-center justify-center gap-3 text-cibc-textSecondary hover:text-white transition-colors">
            <div className="w-12 h-12 rounded-full border-2 border-cibc-primary/30 group-hover:border-cibc-primary group-hover:bg-cibc-primary/10 flex items-center justify-center transition-all">
              <Play className="w-5 h-5 ml-1 text-cibc-primary" />
            </div>
            <span className="font-body text-sm">{language === 'id' ? 'Tonton Video' : 'Watch Video'}</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-body text-xs text-cibc-textMuted uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-cibc-textMuted" />
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS BAR */}
      {/* ============================================ */}
      <section
        ref={statsRef}
        className="relative py-16 bg-gradient-to-r from-cibc-primary/10 via-cibc-bgMain to-cibc-primary/10 border-y border-cibc-primary/20"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {COMPETITION_DATA.stats.map((stat, index) => (
              <AnimatedCounter key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ABOUT SECTION */}
      {/* ============================================ */}
      <section id="about" ref={aboutRef} className="py-24 md:py-32 bg-cibc-bgMain">
        <div className="container mx-auto px-6">
          <div className="about-content max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-cibc-primary/10 border border-cibc-primary/30 rounded-full text-cibc-primary font-body text-xs uppercase tracking-wider mb-6">
                {language === 'id' ? 'Tentang Kompetisi' : 'About The Competition'}
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                {language === 'id' ? 'Membangun Masa Depan' : 'Building The Future'}
              </h2>
              <p className="font-body text-lg text-cibc-textSecondary max-w-3xl mx-auto">
                {language === 'id'
                  ? 'CIBC Power adalah kompetisi Business Model Canvas internasional yang bertujuan menemukan dan mengembangkan solusi bisnis berkelanjutan dari generasi muda berbakat di seluruh dunia.'
                  : 'CIBC Power is an international Business Model Canvas competition aimed at discovering and developing sustainable business solutions from talented young generation around the world.'}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: { en: 'Global Competition', id: 'Kompetisi Global' },
                  desc: { en: 'Compete with teams from 30+ countries', id: 'Bersaing dengan tim dari 30+ negara' },
                },
                {
                  title: { en: 'Sustainability Focus', id: 'Fokus Keberlanjutan' },
                  desc: { en: 'Business solutions for a better tomorrow', id: 'Solusi bisnis untuk masa depan lebih baik' },
                },
                {
                  title: { en: 'Mentorship Program', id: 'Program Mentoring' },
                  desc: { en: 'Guidance from industry experts', id: 'Bimbingan dari pakar industri' },
                },
                {
                  title: { en: 'Networking Access', id: 'Akses Networking' },
                  desc: { en: 'Connect with investors & partners', id: 'Terhubung dengan investor & partner' },
                },
                {
                  title: { en: 'Investment Opportunity', id: 'Peluang Investasi' },
                  desc: { en: 'Potential funding for top startups', id: 'Potensi pendanaan untuk startup terbaik' },
                },
                {
                  title: { en: 'Global Recognition', id: 'Pengakuan Global' },
                  desc: { en: 'Showcase your innovation worldwide', id: 'Tampilkan inovasi Anda ke dunia' },
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-cibc-bgCard border border-cibc-border rounded-2xl hover:border-cibc-primary/50 transition-all duration-300"
                >
                  <h3 className="font-display text-xl text-white mb-2">{feature.title[language]}</h3>
                  <p className="font-body text-cibc-textSecondary">{feature.desc[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SUB THEMES SECTION */}
      {/* ============================================ */}
      <section ref={themesRef} className="py-24 md:py-32 bg-gradient-to-b from-cibc-bgMain via-cibc-primary/5 to-cibc-bgMain">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cibc-primary/10 border border-cibc-primary/30 rounded-full text-cibc-primary font-body text-xs uppercase tracking-wider mb-6">
              {language === 'id' ? 'Tema Kompetisi' : 'Competition Themes'}
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              {language === 'id' ? 'Pilih Track Anda' : 'Choose Your Track'}
            </h2>
            <p className="font-body text-cibc-textSecondary max-w-2xl mx-auto">
              {language === 'id'
                ? 'Pilih salah satu sub tema yang paling sesuai dengan ide bisnis Anda'
                : 'Choose one sub-theme that best fits your business idea'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {COMPETITION_DATA.subThemes.map((theme) => (
              <div
                key={theme.id}
                className="theme-card group relative p-8 md:p-10 bg-cibc-bgCard border border-cibc-border rounded-3xl hover:border-cibc-primary/50 transition-all duration-500 overflow-hidden"
              >
                {/* Number Badge */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-cibc-primary/20 flex items-center justify-center">
                  <span className="font-display text-cibc-primary">{theme.id}</span>
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl md:text-3xl text-white mb-4 group-hover:text-cibc-primary transition-colors">
                  {theme.title[language]}
                </h3>
                <p className="font-body text-cibc-textSecondary leading-relaxed">
                  {theme.description[language]}
                </p>

                {/* Learn More Link */}
                <div className="mt-6 flex items-center gap-2 text-cibc-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-body text-sm">{language === 'id' ? 'Pelajari lebih lanjut' : 'Learn more'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TIMELINE SECTION */}
      {/* ============================================ */}
      <section ref={timelineRef} className="py-24 md:py-32 bg-cibc-bgMain">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cibc-primary/10 border border-cibc-primary/30 rounded-full text-cibc-primary font-body text-xs uppercase tracking-wider mb-6">
              TIMELINE
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              {language === 'id' ? 'Jadwal Kompetisi' : 'Competition Schedule'}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cibc-primary via-cibc-primary/50 to-cibc-primary/20" />

              {COMPETITION_DATA.timeline.map((item, index) => (
                <div
                  key={index}
                  className={`timeline-item relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                    <div className={`w-6 h-6 rounded-full border-4 ${
                      item.status === 'active'
                        ? 'bg-cibc-primary border-cibc-primary shadow-lg shadow-cibc-primary/30'
                        : 'bg-cibc-bgMain border-cibc-primary/50'
                    }`} />
                  </div>

                  {/* Content Card */}
                  <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className={`p-6 bg-cibc-bgCard border rounded-2xl ${
                      item.status === 'active' ? 'border-cibc-primary' : 'border-cibc-border'
                    } hover:border-cibc-primary/50 transition-colors`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-cibc-primary" />
                        <span className="font-body text-sm text-cibc-primary">{item.date}</span>
                      </div>
                      <h3 className="font-display text-xl text-white mb-2">{item.phase[language]}</h3>
                      <p className="font-body text-cibc-textSecondary text-sm">{item.description[language]}</p>
                      {item.status === 'active' && (
                        <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-cibc-primary/20 text-cibc-primary text-xs rounded-full font-body">
                          <span className="w-2 h-2 rounded-full bg-cibc-primary animate-pulse" />
                          {language === 'id' ? 'Sedang Berlangsung' : 'In Progress'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRIZES SECTION */}
      {/* ============================================ */}
      <section ref={prizesRef} className="py-24 md:py-32 bg-gradient-to-b from-cibc-bgMain via-cibc-primary/5 to-cibc-bgMain">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cibc-primary/10 border border-cibc-primary/30 rounded-full text-cibc-primary font-body text-xs uppercase tracking-wider mb-6">
              {language === 'id' ? 'Hadiah & Benefit' : 'Prizes & Benefits'}
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              {language === 'id' ? 'Raih Hadiah Besar' : 'Win Big Prizes'}
            </h2>
            <p className="font-body text-cibc-textSecondary">
              {language === 'id' ? 'Total hadiah' : 'Total prize pool'}: <span className="text-cibc-primary font-display text-2xl">{COMPETITION_DATA.prizes.totalPool}</span>
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {(['student', 'startup', 'corporate'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full font-body text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-cibc-primary text-cibc-textDark'
                    : 'bg-cibc-bgCard text-cibc-textSecondary border border-cibc-border hover:border-cibc-primary/50'
                }`}
              >
                {cat === 'student' && (language === 'id' ? 'Mahasiswa' : 'Student')}
                {cat === 'startup' && 'Startup'}
                {cat === 'corporate' && (language === 'id' ? 'Korporat' : 'Corporate')}
              </button>
            ))}
          </div>

          {/* Prize Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {COMPETITION_DATA.prizes.categories[activeCategory].map((prize, index) => (
              <div
                key={index}
                className={`prize-card relative p-8 rounded-3xl ${
                  index === 0
                    ? 'bg-gradient-to-b from-cibc-primary/20 to-cibc-primary/5 border-2 border-cibc-primary'
                    : 'bg-cibc-bgCard border border-cibc-border'
                }`}
              >
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-cibc-primary text-cibc-textDark text-xs font-body font-bold rounded-full">
                      GRAND PRIZE
                    </span>
                  </div>
                )}

                <div className="text-center">
                  {/* Trophy Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-cibc-primary' : index === 1 ? 'bg-gray-500' : 'bg-amber-700'
                  }`}>
                    <Trophy className="w-8 h-8 text-white" />
                  </div>

                  {/* Rank */}
                  <span className="font-body text-sm text-cibc-textMuted uppercase tracking-wider">{prize.rank} Place</span>

                  {/* Amount */}
                  <h3 className="font-display text-4xl text-cibc-primary my-4">{prize.amount}</h3>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {prize.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 text-cibc-textSecondary">
                        <CircleCheck className="w-4 h-4 text-cibc-primary" />
                        <span className="font-body text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 text-center">
            <p className="font-body text-cibc-textSecondary mb-6">
              {language === 'id' ? 'Semua finalis akan mendapatkan' : 'All finalists will receive'}:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Certificate', 'Networking Access', 'Mentorship Session', 'Media Coverage'].map((benefit) => (
                <span key={benefit} className="px-4 py-2 bg-cibc-bgCard border border-cibc-border rounded-full text-cibc-textSecondary font-body text-sm">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section ref={testimonialsRef} className="py-24 md:py-32 bg-cibc-bgMain">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cibc-primary/10 border border-cibc-primary/30 rounded-full text-cibc-primary font-body text-xs uppercase tracking-wider mb-6">
              {language === 'id' ? 'Testimoni' : 'Testimonials'}
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              {language === 'id' ? 'Kata Mereka' : 'What They Say'}
            </h2>
          </div>

          {/* Testimonial Slider */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Quote className="absolute -top-8 left-0 w-16 h-16 text-cibc-primary/20" />

              {COMPETITION_DATA.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-body text-xl md:text-2xl text-white leading-relaxed mb-8">
                      "{testimonial.quote[language]}"
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-cibc-primary"
                      />
                      <div className="text-left">
                        <h4 className="font-display text-lg text-white">{testimonial.name}</h4>
                        <p className="font-body text-sm text-cibc-primary">{testimonial.role}</p>
                        <p className="font-body text-xs text-cibc-textMuted">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {COMPETITION_DATA.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-cibc-primary w-8' : 'bg-cibc-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ SECTION */}
      {/* ============================================ */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-cibc-bgMain to-cibc-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cibc-primary/10 border border-cibc-primary/30 rounded-full text-cibc-primary font-body text-xs uppercase tracking-wider mb-6">
              FAQ
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              {language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {COMPETITION_DATA.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-cibc-bgCard border border-cibc-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-cibc-bgSection transition-colors"
                >
                  <span className="font-body font-medium text-white pr-4">{faq.q[language]}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-cibc-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-cibc-primary flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="font-body text-cibc-textSecondary">{faq.a[language]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="text-center mt-12">
            <p className="font-body text-cibc-textSecondary mb-4">
              {language === 'id' ? 'Masih punya pertanyaan?' : 'Still have questions?'}
            </p>
            <a
              href={`mailto:${COMPETITION_DATA.contact.email}`}
              className="inline-flex items-center gap-2 text-cibc-primary hover:text-cibc-primaryDark transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-body">{COMPETITION_DATA.contact.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-cibc-primary/20 via-cibc-bgMain to-cibc-bgMain relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cibc-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cibc-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {language === 'id' ? 'Siap Mengubah Dunia?' : 'Ready to Change the World?'}
          </h2>
          <p className="font-body text-lg text-cibc-textSecondary max-w-2xl mx-auto mb-10">
            {language === 'id'
              ? 'Bergabunglah dengan ribuan inovator dari seluruh dunia dan tunjukkan solusi bisnis berkelanjutan Anda.'
              : 'Join thousands of innovators from around the world and showcase your sustainable business solution.'}
          </p>
          <button
            onClick={() => navigate('/cibc/register')}
            className="group px-12 py-5 bg-cibc-primary text-cibc-textDark font-body font-semibold text-sm uppercase tracking-wider rounded-full inline-flex items-center gap-3 hover:bg-cibc-primaryDark transition-all duration-300"
          >
            {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Already have account */}
          <p className="mt-6 font-body text-cibc-textMuted">
            {language === 'id' ? 'Sudah punya akun?' : 'Already have an account?'}{' '}
            <Link to="/cibc/login" className="text-cibc-primary hover:underline">
              {language === 'id' ? 'Masuk' : 'Sign In'}
            </Link>
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="py-16 bg-cibc-bgCard border-t border-cibc-border">
        <div className="container mx-auto px-6">
          {/* Logo & Description */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cibc-primary rounded-xl flex items-center justify-center">
                <span className="text-cibc-textDark font-bold text-xl font-display">K</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-white">CIBC Power</h3>
                <p className="font-body text-xs text-cibc-textMuted">by KATH Event Organizer</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: `https://instagram.com/${COMPETITION_DATA.contact.instagram.replace('@', '')}` },
                { icon: Linkedin, href: `https://linkedin.com/company/${COMPETITION_DATA.contact.linkedin.toLowerCase().replace(' ', '-')}` },
                { icon: Twitter, href: `https://twitter.com/${COMPETITION_DATA.contact.twitter.replace('@', '')}` },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cibc-bgSection border border-cibc-border flex items-center justify-center text-cibc-textMuted hover:text-cibc-primary hover:border-cibc-primary/50 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-cibc-border to-transparent mb-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="font-body text-sm text-cibc-textMuted">
              © 2026 CIBC Power by KATH Event Organizer. {language === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="font-body text-sm text-cibc-textMuted hover:text-white transition-colors">
                {language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'}
              </a>
              <a href="#" className="font-body text-sm text-cibc-textMuted hover:text-white transition-colors">
                {language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CIBCLanding;