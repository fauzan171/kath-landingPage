import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Trophy,
  Users,
  ArrowRight,
  ChevronLeft,
  FileText,
  Download,
  CheckCircle2,
  Globe,
  Target,
  BookOpen,
  Video,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Heart,
  Building2
} from '../icons';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const BMCCompetition = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'guidelines' | 'timeline' | 'resources'>('overview');

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gsap-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const deadline = new Date('2025-12-31T23:59:59');
    
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

  const stats = [
    { value: '$100K+', label: language === 'id' ? 'Total Hadiah' : 'Total Prize', icon: Trophy },
    { value: '50+', label: language === 'id' ? 'Negara' : 'Countries', icon: Globe },
    { value: '1000+', label: language === 'id' ? 'Peserta' : 'Participants', icon: Users },
    { value: '4', label: language === 'id' ? 'Kategori' : 'Categories', icon: Target },
  ];

  const categories = [
    {
      id: 'startup',
      name: language === 'id' ? 'BMC Startup Challenge' : 'BMC Startup Challenge',
      prize: '$50,000',
      target: language === 'id' ? 'Startup & Founder' : 'Startup & Founder',
      description: language === 'id' 
        ? 'Untuk startup yang ingin menyempurnakan model bisnis mereka dan mendapatkan pendanaan.'
        : 'For startups looking to refine their business model and secure funding.',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'social',
      name: language === 'id' ? 'BMC Social Enterprise' : 'BMC Social Enterprise',
      prize: '$30,000',
      target: language === 'id' ? 'Social Entrepreneur' : 'Social Entrepreneur',
      description: language === 'id'
        ? 'Untuk bisnis sosial yang fokus pada dampak positif bagi masyarakat.'
        : 'For social businesses focused on creating positive impact for communities.',
      icon: Heart,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'student',
      name: language === 'id' ? 'BMC Student Innovation' : 'BMC Student Innovation',
      prize: '$15,000',
      target: language === 'id' ? 'Mahasiswa' : 'Students',
      description: language === 'id'
        ? 'Kompetisi khusus untuk mahasiswa dengan ide bisnis inovatif.'
        : 'Competition exclusively for students with innovative business ideas.',
      icon: BookOpen,
      color: 'from-violet-500 to-violet-600',
    },
    {
      id: 'corporate',
      name: language === 'id' ? 'BMC Corporate Innovation' : 'BMC Corporate Innovation',
      prize: '$25,000',
      target: language === 'id' ? 'Korporasi' : 'Corporations',
      description: language === 'id'
        ? 'Untuk korporasi yang ingin mengembangkan unit bisnis baru.'
        : 'For corporations looking to develop new business units.',
      icon: Building2,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const timeline = [
    { 
      date: '1 Mar 2025', 
      title: language === 'id' ? 'Pendaftaran Dibuka' : 'Registration Opens',
      desc: language === 'id' ? 'Registrasi online dibuka untuk semua kategori' : 'Online registration opens for all categories',
      status: 'completed'
    },
    { 
      date: '25 Mar 2025', 
      title: language === 'id' ? 'Workshop Persiapan' : 'Preparation Workshop',
      desc: language === 'id' ? 'Workshop gratis untuk peserta terdaftar' : 'Free workshop for registered participants',
      status: 'completed'
    },
    { 
      date: '15 Apr 2025', 
      title: language === 'id' ? 'Deadline Pendaftaran' : 'Registration Deadline',
      desc: language === 'id' ? 'Batas akhir pengiriman form pendaftaran' : 'Final deadline for registration submission',
      status: 'current'
    },
    { 
      date: '30 Apr 2025', 
      title: language === 'id' ? 'Pengumpulan BMC' : 'BMC Submission',
      desc: language === 'id' ? 'Deadline submit BMC dan proposal' : 'Deadline for BMC and proposal submission',
      status: 'upcoming'
    },
    { 
      date: '15 Mei 2025', 
      title: language === 'id' ? 'Pengumuman Finalis' : 'Finalists Announcement',
      desc: language === 'id' ? 'Pengumuman finalis dan presentasi' : 'Finalists announcement and presentations',
      status: 'upcoming'
    },
    { 
      date: '20 Jun 2025', 
      title: language === 'id' ? 'Final & Awarding' : 'Final & Awarding',
      desc: language === 'id' ? 'Presentasi final dan pengumuman pemenang' : 'Final presentations and winner announcement',
      status: 'upcoming'
    },
  ];

  const resources = [
    { 
      name: language === 'id' ? 'BMC Template' : 'BMC Template', 
      type: 'PDF', 
      size: '2.4 MB',
      icon: FileText 
    },
    { 
      name: language === 'id' ? 'Panduan Kompetisi' : 'Competition Guidelines', 
      type: 'PDF', 
      size: '5.1 MB',
      icon: BookOpen 
    },
    { 
      name: language === 'id' ? 'Formulir Originalitas' : 'Declaration of Originality', 
      type: 'PDF', 
      size: '1.2 MB',
      icon: FileText 
    },
    { 
      name: language === 'id' ? 'Tutorial Video' : 'Video Tutorial', 
      type: 'MP4', 
      size: '45 MB',
      icon: Video 
    },
  ];

  const faqs = [
    {
      q: language === 'id' ? 'Siapa saja yang boleh mendaftar?' : 'Who can register?',
      a: language === 'id' 
        ? 'Kompetisi terbuka untuk individu dan tim dari seluruh dunia. Kategori Student hanya untuk mahasiswa aktif, sementara kategori lain terbuka untuk profesional dan entrepreneur.'
        : 'The competition is open to individuals and teams from around the world. Student category is only for active students, while other categories are open to professionals and entrepreneurs.'
    },
    {
      q: language === 'id' ? 'Berapa biaya pendaftarannya?' : 'What is the registration fee?',
      a: language === 'id'
        ? 'Pendaftaran GRATIS untuk semua kategori. Tidak ada biaya tersembunyi atau biaya tambahan.'
        : 'Registration is FREE for all categories. There are no hidden fees or additional charges.'
    },
    {
      q: language === 'id' ? 'Bagaimana format pengumpulan BMC?' : 'What is the BMC submission format?',
      a: language === 'id'
        ? 'Peserta wajib menggunakan template BMC resmi yang tersedia di halaman Resources. BMC harus diisi lengkap dan diunggah dalam format PDF.'
        : 'Participants must use the official BMC template available on the Resources page. BMC must be completed fully and uploaded in PDF format.'
    },
    {
      q: language === 'id' ? 'Apakah boleh mendaftar lebih dari satu kategori?' : 'Can I register for more than one category?',
      a: language === 'id'
        ? 'Ya, peserta diperbolehkan mendaftar di lebih dari satu kategori dengan menggunakan email yang berbeda untuk setiap pendaftaran.'
        : 'Yes, participants are allowed to register in more than one category using different emails for each registration.'
    },
  ];

  const criteria = [
    { name: language === 'id' ? 'Inovasi' : 'Innovation', weight: '30%' },
    { name: language === 'id' ? 'Kelayakan Bisnis' : 'Business Viability', weight: '25%' },
    { name: language === 'id' ? 'Dampak Sosial' : 'Social Impact', weight: '20%' },
    { name: language === 'id' ? 'Presentasi' : 'Presentation', weight: '15%' },
    { name: language === 'id' ? 'Komplit BMC' : 'BMC Completeness', weight: '10%' },
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-kath-bg-main">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-kath-bg-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-kath-text-secondary hover:text-kath-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-body text-sm">{language === 'id' ? 'Kembali' : 'Back'}</span>
            </button>

            <span className="font-display text-kath-primary text-xl tracking-wide">
              BMC International 2026
            </span>

            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-kath-primary hover:bg-kath-primary-dark text-white font-body text-sm font-medium rounded-full transition-all"
            >
              {language === 'id' ? 'Daftar' : 'Register'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-kath-primary/5 via-transparent to-kath-gold/5" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-kath-primary/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-kath-gold/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-body uppercase tracking-[0.2em] text-kath-primary bg-kath-primary/10 rounded-full border border-kath-primary/20">
                {language === 'id' ? 'Kompetisi Internasional 2026' : 'International Competition 2026'}
              </span>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-kath-text-primary leading-[0.95] mb-6">
                BMC
                <span className="text-kath-primary block">Competition</span>
              </h1>

              <p className="font-body text-lg text-kath-text-secondary max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                {language === 'id'
                  ? 'Kompetisi Model Bisnis Canvas internasional. Tunjukkan ide bisnis terbaik Anda dan menangkan hadiah total lebih dari $100,000.'
                  : 'International Business Model Canvas competition. Showcase your best business idea and win total prizes of over $100,000.'}
              </p>

              {/* Countdown */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {[
                  { value: timeLeft.days, label: language === 'id' ? 'Hari' : 'Days' },
                  { value: timeLeft.hours, label: language === 'id' ? 'Jam' : 'Hours' },
                  { value: timeLeft.minutes, label: language === 'id' ? 'Menit' : 'Mins' },
                  { value: timeLeft.seconds, label: language === 'id' ? 'Detik' : 'Secs' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-kath-primary/20 rounded-xl flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="font-display text-2xl sm:text-3xl text-kath-primary">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="font-body text-[10px] text-kath-text-muted uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-8 py-4 bg-kath-primary hover:bg-kath-primary-dark text-white font-body font-medium rounded-full transition-all flex items-center gap-2 shadow-lg shadow-kath-primary/25"
                >
                  {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border border-kath-bg-section hover:border-kath-primary/30 text-kath-text-primary font-body font-medium rounded-full transition-all bg-white"
                >
                  {language === 'id' ? 'Pelajari Lebih' : 'Learn More'}
                </button>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 bg-white border border-kath-bg-section rounded-2xl shadow-sm hover:shadow-md hover:border-kath-primary/20 transition-all ${
                      index % 2 === 1 ? 'mt-8' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-kath-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-kath-primary" />
                    </div>
                    <div className="font-display text-3xl text-kath-text-primary mb-1">{item.value}</div>
                    <div className="font-body text-sm text-kath-text-secondary">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-kath-bg-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            {[
              { id: 'overview', label: language === 'id' ? 'Ikhtisar' : 'Overview' },
              { id: 'guidelines', label: language === 'id' ? 'Panduan' : 'Guidelines' },
              { id: 'timeline', label: language === 'id' ? 'Timeline' : 'Timeline' },
              { id: 'resources', label: language === 'id' ? 'Resources' : 'Resources' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-body text-sm rounded-full transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-kath-primary text-white'
                    : 'text-kath-text-secondary hover:text-kath-text-primary hover:bg-kath-bg-section'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* About Section */}
          <section id="about" className="gsap-section py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="font-body text-sm text-kath-primary uppercase tracking-[0.2em]">
                    {language === 'id' ? 'Tentang Kompetisi' : 'About Competition'}
                  </span>
                  <h2 className="font-display text-4xl lg:text-5xl text-kath-text-primary mt-4 mb-6 leading-tight">
                    {language === 'id'
                      ? 'Wadah Pengembangan Model Bisnis Global'
                      : 'Global Business Model Development Platform'}
                  </h2>
                  <div className="space-y-4 font-body text-kath-text-secondary leading-relaxed">
                    <p>
                      {language === 'id'
                        ? 'BMC International Competition adalah kompetisi tahunan yang diselenggarakan oleh KATH Event Organizer sejak tahun 2020. Kompetisi ini menjadi platform utama bagi para entrepreneur, mahasiswa, dan profesional dari seluruh dunia untuk menunjukkan model bisnis terbaik mereka.'
                        : 'BMC International Competition is an annual competition organized by KATH Event Organizer since 2020. This competition is the main platform for entrepreneurs, students, and professionals from around the world to showcase their best business models.'}
                    </p>
                    <p>
                      {language === 'id'
                        ? 'Dengan dewan juri yang terdiri dari investor, akademisi, dan profesional berpengalaman dari berbagai industri, kompetisi ini telah menjadi salah satu ajang BMC paling bergengsi di dunia.'
                        : 'With a jury panel consisting of investors, academics, and experienced professionals from various industries, this competition has become one of the most prestigious BMC events in the world.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {[
                      language === 'id' ? 'Juri Internasional' : 'International Jury',
                      language === 'id' ? 'Hadiah Besar' : 'Grand Prizes',
                      language === 'id' ? 'Mentorship' : 'Mentorship',
                      language === 'id' ? 'Sertifikat Global' : 'Global Certificate',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-kath-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-kath-primary" />
                        </div>
                        <span className="font-body text-sm text-kath-text-primary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-kath-bg-section shadow-lg">
                    <img
                      src="/cibc/competition-event.webp"
                      alt="BMC Competition"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 p-6 bg-white border border-kath-bg-section rounded-2xl shadow-lg">
                    <div className="font-display text-4xl text-kath-primary mb-1">6+</div>
                    <div className="font-body text-sm text-kath-text-secondary">
                      {language === 'id' ? 'Tahun Pengalaman' : 'Years Experience'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="gsap-section py-24 lg:py-32 bg-kath-bg-section">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="font-body text-sm text-kath-primary uppercase tracking-[0.2em]">
                  {language === 'id' ? 'Kategori Lomba' : 'Competition Categories'}
                </span>
                <h2 className="font-display text-4xl lg:text-5xl text-kath-text-primary mt-4 mb-4">
                  {language === 'id' ? 'Pilih Kategori Anda' : 'Choose Your Category'}
                </h2>
                <p className="font-body text-kath-text-secondary">
                  {language === 'id'
                    ? 'Empat kategori kompetisi yang dirancang untuk berbagai jenis bisnis dan entrepreneur'
                    : 'Four competition categories designed for various types of businesses and entrepreneurs'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className="group p-8 bg-white border border-kath-bg-section rounded-3xl hover:border-kath-primary/30 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="font-display text-2xl text-kath-primary">{cat.prize}</div>
                          <div className="font-body text-xs text-kath-text-muted uppercase">
                            {language === 'id' ? 'Hadiah' : 'Prize'}
                          </div>
                        </div>
                      </div>

                      <h3 className="font-display text-2xl text-kath-text-primary mb-2">
                        {cat.name}
                      </h3>
                      <p className="font-body text-kath-text-secondary text-sm mb-4">
                        {cat.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-kath-primary" />
                        <span className="font-body text-kath-text-secondary">{cat.target}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <section className="gsap-section py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Eligibility */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="font-display text-3xl text-kath-text-primary mb-6">
                    {language === 'id' ? 'Kriteria Kelayakan' : 'Eligibility Criteria'}
                  </h2>
                  <div className="space-y-4">
                    {[
                      language === 'id' ? 'Terbuka untuk individu atau tim (2-6 anggota)' : 'Open to individuals or teams (2-6 members)',
                      language === 'id' ? 'Tidak ada batasan usia untuk kategori Startup, Social, dan Corporate' : 'No age limit for Startup, Social, and Corporate categories',
                      language === 'id' ? 'Kategori Student: Mahasiswa aktif S1/D3/D4' : 'Student category: Active undergraduate students',
                      language === 'id' ? 'Ide bisnis harus orisinal dan belum pernah dipresentasikan di kompetisi lain' : 'Business idea must be original and not previously presented in other competitions',
                      language === 'id' ? 'Setiap peserta/tim hanya boleh mengirimkan 1 BMC' : 'Each participant/team may only submit 1 BMC',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-kath-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-kath-primary" />
                        </div>
                        <span className="font-body text-kath-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-3xl text-kath-text-primary mb-6">
                    {language === 'id' ? 'Format Pengumpulan' : 'Submission Format'}
                  </h2>
                  <div className="p-6 bg-kath-bg-section rounded-2xl space-y-4">
                    <div className="flex items-start gap-4">
                      <FileText className="w-5 h-5 text-kath-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-body font-medium text-kath-text-primary mb-1">
                          {language === 'id' ? 'BMC Canvas' : 'BMC Canvas'}
                        </h4>
                        <p className="font-body text-sm text-kath-text-secondary">
                          {language === 'id'
                            ? 'Wajib menggunakan template BMC resmi. Format PDF, maksimal 5 halaman.'
                            : 'Must use official BMC template. PDF format, maximum 5 pages.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <BookOpen className="w-5 h-5 text-kath-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-body font-medium text-kath-text-primary mb-1">
                          {language === 'id' ? 'Business Proposal' : 'Business Proposal'}
                        </h4>
                        <p className="font-body text-sm text-kath-text-secondary">
                          {language === 'id'
                            ? 'PDF maksimal 10 halaman, font Arial 11pt, spasi 1.5'
                            : 'PDF maximum 10 pages, Arial font 11pt, 1.5 spacing'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Video className="w-5 h-5 text-kath-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-body font-medium text-kath-text-primary mb-1">
                          {language === 'id' ? 'Video Pitch (Finalis)' : 'Video Pitch (Finalists)'}
                        </h4>
                        <p className="font-body text-sm text-kath-text-secondary">
                          {language === 'id'
                            ? 'Durasi maksimal 5 menit, format MP4, upload ke YouTube (unlisted)'
                            : 'Maximum duration 5 minutes, MP4 format, upload to YouTube (unlisted)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Judging Criteria */}
              <div>
                <h2 className="font-display text-3xl text-kath-text-primary mb-6">
                  {language === 'id' ? 'Kriteria Penilaian' : 'Judging Criteria'}
                </h2>
                <div className="space-y-4">
                  {criteria.map((item, i) => (
                    <div key={i} className="p-4 bg-white border border-kath-bg-section rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-body text-kath-text-primary">{item.name}</span>
                        <span className="font-display text-kath-primary">{item.weight}</span>
                      </div>
                      <div className="h-2 bg-kath-bg-section rounded-full overflow-hidden">
                        <div
                          className="h-full bg-kath-primary rounded-full"
                          style={{ width: item.weight }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <section className="gsap-section py-24 lg:py-32">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-body text-sm text-kath-primary uppercase tracking-[0.2em]">
                {language === 'id' ? 'Jadwal Kompetisi' : 'Competition Schedule'}
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-kath-text-primary mt-4 mb-4">
                {language === 'id' ? 'Timeline BMC 2026' : 'BMC 2026 Timeline'}
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-kath-bg-section lg:-translate-x-1/2" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className="hidden lg:flex w-1/2 items-center justify-center">
                      <div className={`text-center ${index % 2 === 0 ? 'mr-16' : 'ml-16'}`}>
                        <div className="font-display text-2xl text-kath-text-primary">{item.date}</div>
                      </div>
                    </div>

                    <div
                      className={`absolute left-8 lg:left-1/2 w-4 h-4 rounded-full border-4 lg:-translate-x-1/2 z-10 ${
                        item.status === 'completed'
                          ? 'bg-kath-primary border-kath-primary'
                          : item.status === 'current'
                          ? 'bg-white border-kath-primary'
                          : 'bg-white border-kath-bg-section'
                      }`}
                    />

                    <div className="flex-1 pl-20 lg:pl-0 lg:w-1/2">
                      <div className={`lg:${index % 2 === 0 ? 'pl-16' : 'pr-16'}`}>
                        <div className="lg:hidden font-body text-sm text-kath-primary mb-1">{item.date}</div>
                        <div className="p-6 bg-white border border-kath-bg-section rounded-2xl hover:border-kath-primary/30 transition-all">
                          <h3 className="font-display text-xl text-kath-text-primary mb-1">{item.title}</h3>
                          <p className="font-body text-sm text-kath-text-secondary">{item.desc}</p>
                          {item.status === 'current' && (
                            <span className="inline-block mt-3 px-3 py-1 bg-kath-primary/10 text-kath-primary text-xs font-body rounded-full">
                              {language === 'id' ? 'Sedang Berlangsung' : 'In Progress'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <section className="gsap-section py-24 lg:py-32">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-body text-sm text-kath-primary uppercase tracking-[0.2em]">
                {language === 'id' ? 'Unduhan' : 'Downloads'}
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-kath-text-primary mt-4 mb-4">
                {language === 'id' ? 'Resources & Templates' : 'Resources & Templates'}
              </h2>
              <p className="font-body text-kath-text-secondary">
                {language === 'id'
                  ? 'Unduh template dan panduan yang diperlukan untuk kompetisi'
                  : 'Download required templates and guidelines for the competition'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={index}
                    className="group p-6 bg-white border border-kath-bg-section rounded-2xl hover:border-kath-primary/30 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-kath-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-kath-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-body font-medium text-kath-text-primary">{resource.name}</h3>
                        <p className="font-body text-sm text-kath-text-muted">
                          {resource.type} • {resource.size}
                        </p>
                      </div>
                      <Download className="w-5 h-5 text-kath-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="font-display text-3xl text-kath-text-primary text-center mb-12">
                {language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white border border-kath-bg-section rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-body font-medium text-kath-text-primary pr-8">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-kath-primary flex-shrink-0 transition-transform ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <p className="px-6 pb-6 font-body text-kath-text-secondary leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="gsap-section py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="relative p-12 lg:p-16 bg-gradient-to-br from-kath-primary/10 via-kath-primary/5 to-transparent border border-kath-primary/20 rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-96 h-96 bg-kath-primary/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-kath-gold/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative text-center">
              <h2 className="font-display text-4xl lg:text-5xl text-kath-text-primary mb-4">
                {language === 'id' ? 'Siap Berkompetisi?' : 'Ready to Compete?'}
              </h2>
              <p className="font-body text-kath-text-secondary max-w-xl mx-auto mb-8">
                {language === 'id'
                  ? 'Jangan lewatkan kesempatan untuk menunjukkan model bisnis terbaik Anda kepada dunia. Daftar sekarang!'
                  : 'Don\'t miss the opportunity to showcase your best business model to the world. Register now!'}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-10 py-4 bg-kath-primary hover:bg-kath-primary-dark text-white font-body font-medium rounded-full transition-all flex items-center gap-2 shadow-lg shadow-kath-primary/25"
                >
                  {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => window.open('mailto:competition@kath.com', '_blank')}
                  className="px-10 py-4 border border-kath-primary/30 hover:border-kath-primary text-kath-primary font-body font-medium rounded-full transition-all"
                >
                  {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kath-bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-display text-2xl mb-4">BMC International</h3>
              <p className="font-body text-white/60 text-sm">
                {language === 'id'
                  ? 'Kompetisi Model Bisnis Canvas bergengsi untuk entrepreneur global.'
                  : 'Prestigious Business Model Canvas competition for global entrepreneurs.'}
              </p>
            </div>
            <div>
              <h4 className="font-body font-medium mb-4">{language === 'id' ? 'Tautan' : 'Links'}</h4>
              <ul className="space-y-2 font-body text-sm text-white/60">
                <li><button onClick={() => setActiveTab('overview')} className="hover:text-kath-primary transition-colors">{language === 'id' ? 'Ikhtisar' : 'Overview'}</button></li>
                <li><button onClick={() => setActiveTab('guidelines')} className="hover:text-kath-primary transition-colors">{language === 'id' ? 'Panduan' : 'Guidelines'}</button></li>
                <li><button onClick={() => setActiveTab('timeline')} className="hover:text-kath-primary transition-colors">{language === 'id' ? 'Timeline' : 'Timeline'}</button></li>
                <li><button onClick={() => setActiveTab('resources')} className="hover:text-kath-primary transition-colors">{language === 'id' ? 'Resources' : 'Resources'}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body font-medium mb-4">{language === 'id' ? 'Kontak' : 'Contact'}</h4>
              <ul className="space-y-2 font-body text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  competition@kath.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +62 812 3456 7890
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Jakarta, Indonesia
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-body font-medium mb-4">{language === 'id' ? 'Ikuti Kami' : 'Follow Us'}</h4>
              <div className="flex gap-4">
                {['Instagram', 'LinkedIn', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-kath-primary hover:bg-kath-primary/10 transition-all"
                  >
                    <span className="text-xs">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center font-body text-sm text-white/40">
            © 2026 BMC International Competition. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BMCCompetition;
