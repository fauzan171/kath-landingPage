import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { appContactConfig } from '../config';
import {
  Trophy,
  Users,
  Award,
  ArrowRight,
  Heart,
  ChevronLeft,
  Medal,
  Sparkles,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  ArrowUpRight,
  Camera,
  CheckCircle2
} from '../icons';

gsap.registerPlugin(ScrollTrigger);

interface AboutCompetitionProps {
  onBack: () => void;
}

const AboutCompetition = ({ onBack }: AboutCompetitionProps) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo(
        '.hero-stats',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(
        '.hero-cta',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 }
      );

      // Scroll sections
      gsap.utils.toArray<HTMLElement>('.gsap-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60 },
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

  const categories = [
    {
      id: '1',
      icon: Heart,
      name: 'Wedding Concept',
      fullName: 'Wedding Concept Competition',
      description: 'Rancang konsep pernikahan yang unik dan memorable. Dari tema, dekorasi, hingga rundown acara.',
      prize: 'Rp 200.000.000',
      target: 'Wedding Planner',
      color: 'group-hover:bg-rose-500/20',
      borderColor: 'hover:border-rose-500/50',
      textColor: 'group-hover:text-rose-400'
    },
    {
      id: '2',
      icon: Sparkles,
      name: 'Event Design',
      fullName: 'Event Design Challenge',
      description: 'Ciptakan desain event yang inovatif dengan kombinasi estetika dan fungsionalitas.',
      prize: 'Rp 150.000.000',
      target: 'Event Designer',
      color: 'group-hover:bg-violet-500/20',
      borderColor: 'hover:border-violet-500/50',
      textColor: 'group-hover:text-violet-400'
    },
    {
      id: '3',
      icon: Camera,
      name: 'Photography',
      fullName: 'Event Photography Contest',
      description: 'Abadikan momen berharga dalam event dengan teknik fotografi profesional.',
      prize: 'Rp 100.000.000',
      target: 'Photographer',
      color: 'group-hover:bg-cyan-500/20',
      borderColor: 'hover:border-cyan-500/50',
      textColor: 'group-hover:text-cyan-400'
    },
    {
      id: '4',
      icon: GraduationCap,
      name: 'Student Event',
      fullName: 'Student Event Competition',
      description: 'Kompetisi khusus mahasiswa untuk mengembangkan ide event yang kreatif.',
      prize: 'Rp 50.000.000',
      target: 'Mahasiswa',
      color: 'group-hover:bg-emerald-500/20',
      borderColor: 'hover:border-emerald-500/50',
      textColor: 'group-hover:text-emerald-400'
    }
  ];

  const benefits = [
    {
      icon: Trophy,
      value: '500jt+',
      label: 'Total Hadiah',
      desc: 'Hadiah uang tunai dan merchandise eksklusif'
    },
    {
      icon: Medal,
      value: '20+',
      label: 'Pemenang',
      desc: 'Kesempatan menang di berbagai kategori'
    },
    {
      icon: Users,
      value: '500+',
      label: 'Peserta',
      desc: 'Jaringan profesional dari seluruh Indonesia'
    },
    {
      icon: Award,
      value: '100%',
      label: 'Sertifikat',
      desc: 'Sertifikat nasional untuk semua peserta'
    }
  ];

  const timeline = [
    { date: '1 Mar', month: 'Maret', title: 'Pendaftaran Dibuka', desc: 'Registrasi online dibuka untuk semua kategori' },
    { date: '25 Mar', month: 'Maret', title: 'Workshop Persiapan', desc: 'Workshop gratis untuk peserta terdaftar' },
    { date: '15 Apr', month: 'April', title: 'Deadline Pendaftaran', desc: 'Batas akhir pengiriman form pendaftaran' },
    { date: '30 Apr', month: 'April', title: 'Pengumpulan Karya', desc: 'Deadline submit proposal dan portofolio' },
    { date: '15 Mei', month: 'Mei', title: 'Semi Final', desc: 'Pengumuman finalis dan presentasi' },
    { date: '20 Jun', month: 'Juni', title: 'Final & Awarding', desc: 'Presentasi final dan pengumuman pemenang' }
  ];

  const faqs = [
    {
      q: 'Siapa saja yang boleh mendaftar?',
      a: 'Kompetisi terbuka untuk seluruh warga negara Indonesia. Kategori Student hanya untuk mahasiswa aktif, sementara kategori lain terbuka untuk profesional dan pemula.'
    },
    {
      q: 'Apakah boleh mendaftar lebih dari satu kategori?',
      a: 'Ya, peserta diperbolehkan mendaftar di lebih dari satu kategori. Namun, setiap kategori memerlukan pendaftaran dan pembayaran terpisah.'
    },
    {
      q: 'Berapa biaya pendaftarannya?',
      a: 'Biaya pendaftaran bervariasi per kategori: Early bird Rp 150.000 - Rp 300.000, Normal Rp 250.000 - Rp 500.000. Student category memiliki harga khusus yang lebih terjangkau.'
    },
    {
      q: 'Bagaimana cara mengirimkan karya?',
      a: 'Karya dikirimkan melalui dashboard peserta setelah login. Format yang diterima adalah PDF untuk proposal dan JPG/PNG untuk foto. Maksimal ukuran file 10MB.'
    },
    {
      q: 'Apakah peserta luar Jakarta bisa ikut?',
      a: 'Tentu! Kompetisi ini nasional. Presentasi semi-final dan final dapat dilakukan secara online atau offline sesuai preferensi peserta.'
    }
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-kath-black">

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-kath-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-kath-off-white/70 hover:text-kath-gold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-body text-sm">Kembali</span>
            </button>

            <span className="font-display text-kath-gold text-xl tracking-wide">
              KATH Competition 2026
            </span>

            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm font-medium rounded-full transition-all"
            >
              Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-kath-gold/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-kath-gold/3 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-kath-gold/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-kath-gold/5 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <div className="hero-title">
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-body uppercase tracking-[0.2em] text-kath-gold bg-kath-gold/10 rounded-full border border-kath-gold/20">
                  Kompetisi Nasional 2026
                </span>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-kath-white leading-[0.95] mb-2">
                  KATH
                </h1>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-kath-gold leading-[0.95] mb-6">
                  Competition
                </h1>
              </div>

              <p className="hero-subtitle font-body text-lg text-kath-off-white/70 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Ajang bergengsi untuk menemukan talenta terbaik di industri event Indonesia.
                Tunjukkan kreativitas Anda dan menangkan total hadiah lebih dari{' '}
                <span className="text-kath-gold font-semibold">Rp 500 Juta</span>.
              </p>

              {/* Stats Row */}
              <div className="hero-stats flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                {[
                  { value: '4', label: 'Kategori' },
                  { value: '500+', label: 'Peserta' },
                  { value: '500jt+', label: 'Hadiah' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="font-display text-2xl text-kath-gold">{stat.value}</div>
                    <div className="font-body text-xs text-kath-off-white/50 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="hero-cta flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body font-medium rounded-full transition-all flex items-center gap-2"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('kategori')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border border-kath-charcoal/50 hover:border-kath-gold/50 text-kath-white font-body font-medium rounded-full transition-all"
                >
                  Lihat Kategori
                </button>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {benefits.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 bg-kath-dark-gray/40 backdrop-blur-sm border border-kath-charcoal/30 rounded-2xl ${
                      index % 2 === 1 ? 'mt-8' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-kath-gold/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-kath-gold" />
                    </div>
                    <div className="font-display text-3xl text-kath-white mb-1">{item.value}</div>
                    <div className="font-body text-sm text-kath-off-white/60 mb-2">{item.label}</div>
                    <div className="font-body text-xs text-kath-off-white/40">{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-kath-off-white/30">
          <span className="font-body text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-kath-gold/50 to-transparent" />
        </div>
      </section>

      {/* About Section */}
      <section className="gsap-section py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-sm text-kath-gold uppercase tracking-[0.2em]">Tentang Kompetisi</span>
              <h2 className="font-display text-4xl lg:text-5xl text-kath-white mt-4 mb-6 leading-tight">
                Wadah Pengembangan Talenta Event Indonesia
              </h2>
              <div className="space-y-4 font-body text-kath-off-white/70 leading-relaxed">
                <p>
                  KATH Competition adalah kompetisi tahunan yang diselenggarakan oleh KATH Event Organizer sejak tahun 2020. Kompetisi ini menjadi platform utama bagi para profesional muda, mahasiswa, dan enthusiast event untuk menunjukkan kemampuan mereka di bidang wedding planning, event design, dan fotografi.
                </p>
                <p>
                  Setiap tahun, kompetisi ini menarik lebih dari 500 peserta dari seluruh Indonesia. Dengan dewan juri yang terdiri dari profesional berpengalaman dan hadiah total mencapai ratusan juta rupiah, KATH Competition telah menjadi salah satu kompetisi event paling bergengsi di Tanah Air.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  'Profesional Juri',
                  'Hadiah Menarik',
                  'Workshop Eksklusif',
                  'Sertifikat Resmi'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-kath-gold/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-kath-gold" />
                    </div>
                    <span className="font-body text-sm text-kath-off-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-kath-dark-gray border border-kath-charcoal/30">
                <img
                  src="/card-2.webp"
                  alt="KATH Competition"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 p-6 bg-kath-dark-gray border border-kath-charcoal/30 rounded-2xl">
                <div className="font-display text-4xl text-kath-gold mb-1">6+</div>
                <div className="font-body text-sm text-kath-off-white/60">Tahun Pengalaman</div>
              </div>
              <div className="absolute -top-6 -right-6 p-6 bg-kath-gold text-kath-black rounded-2xl">
                <div className="font-display text-3xl mb-1">2026</div>
                <div className="font-body text-sm opacity-80">Season</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="kategori" className="gsap-section py-24 lg:py-32 bg-kath-dark-gray/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-body text-sm text-kath-gold uppercase tracking-[0.2em]">Kategori Lomba</span>
            <h2 className="font-display text-4xl lg:text-5xl text-kath-white mt-4 mb-4">
              Pilih Kategori Yang Tepat
            </h2>
            <p className="font-body text-kath-off-white/60">
              Empat kategori kompetisi yang dirancang untuk menguji berbagai aspek keterampilan di industri event
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/competition/comp_00${cat.id}`)}
                  className={`group p-8 bg-kath-dark-gray/40 border border-kath-charcoal/30 rounded-3xl cursor-pointer transition-all duration-300 ${cat.borderColor} hover:bg-kath-dark-gray/60`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-kath-gold/10 flex items-center justify-center transition-colors duration-300 ${cat.color}`}>
                      <Icon className={`w-7 h-7 text-kath-gold transition-colors duration-300 ${cat.textColor}`} />
                    </div>
                    <div className="flex items-center gap-1 text-kath-gold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-body text-sm">Detail</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl text-kath-white mb-2 group-hover:text-kath-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-body text-kath-off-white/60 text-sm mb-6 line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-6 pt-6 border-t border-kath-charcoal/20">
                    <div>
                      <div className="font-body text-xs text-kath-off-white/40 uppercase tracking-wider mb-1">Hadiah</div>
                      <div className="font-display text-lg text-kath-gold">{cat.prize}</div>
                    </div>
                    <div className="w-px h-10 bg-kath-charcoal/30" />
                    <div>
                      <div className="font-body text-xs text-kath-off-white/40 uppercase tracking-wider mb-1">Target</div>
                      <div className="font-body text-sm text-kath-off-white">{cat.target}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="gsap-section py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-body text-sm text-kath-gold uppercase tracking-[0.2em]">Timeline</span>
            <h2 className="font-display text-4xl lg:text-5xl text-kath-white mt-4 mb-4">
              Jadwal Kompetisi
            </h2>
            <p className="font-body text-kath-off-white/60">
              Ikuti setiap tahapan kompetisi dengan memperhatikan timeline berikut
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-kath-gold/50 via-kath-gold/30 to-transparent lg:-translate-x-1/2" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Date Badge */}
                  <div className="hidden lg:flex w-1/2 items-center justify-center">
                    <div className={`text-center ${index % 2 === 0 ? 'mr-16' : 'ml-16'}`}>
                      <div className="font-display text-3xl text-kath-gold">{item.date}</div>
                      <div className="font-body text-sm text-kath-off-white/50">{item.month}</div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-8 lg:left-1/2 w-4 h-4 bg-kath-gold rounded-full border-4 border-kath-black lg:-translate-x-1/2 z-10" />

                  {/* Content */}
                  <div className="flex-1 pl-20 lg:pl-0 lg:w-1/2">
                    <div className={`lg:${index % 2 === 0 ? 'pl-16' : 'pr-16'}`}>
                      {/* Mobile Date */}
                      <div className="lg:hidden flex items-center gap-2 mb-2">
                        <span className="font-display text-lg text-kath-gold">{item.date}</span>
                        <span className="font-body text-sm text-kath-off-white/50">{item.month}</span>
                      </div>
                      <h3 className="font-display text-xl text-kath-white mb-1">{item.title}</h3>
                      <p className="font-body text-sm text-kath-off-white/60">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="gsap-section py-24 lg:py-32 bg-kath-dark-gray/20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-sm text-kath-gold uppercase tracking-[0.2em]">FAQ</span>
            <h2 className="font-display text-4xl lg:text-5xl text-kath-white mt-4 mb-4">
              Pertanyaan Umum
            </h2>
            <p className="font-body text-kath-off-white/60">
              Temukan jawaban atas pertanyaan yang sering ditanyakan
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-kath-dark-gray/40 border border-kath-charcoal/30 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-display text-lg text-kath-white pr-8">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-kath-gold flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 pb-6 font-body text-kath-off-white/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gsap-section py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="relative p-12 lg:p-16 bg-gradient-to-br from-kath-gold/20 via-kath-gold/10 to-transparent border border-kath-gold/30 rounded-[2.5rem] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-96 h-96 bg-kath-gold/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-kath-gold/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative text-center">
              <h2 className="font-display text-4xl lg:text-5xl text-kath-white mb-4">
                Siap Untuk Berkompetisi?
              </h2>
              <p className="font-body text-kath-off-white/70 max-w-xl mx-auto mb-8">
                Jangan lewatkan kesempatan untuk menunjukkan bakat Anda kepada industri event Indonesia.
                Daftar sekarang dan jadilah bagian dari KATH Competition 2026!
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-10 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body font-medium rounded-full transition-all flex items-center gap-2"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => window.open(appContactConfig.whatsappUrl, '_blank')}
                  className="px-10 py-4 border border-kath-charcoal/50 hover:border-kath-gold/50 text-kath-white font-body font-medium rounded-full transition-all"
                >
                  Hubungi Kami
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-kath-charcoal/20">
                <div className="flex items-center gap-2 text-kath-off-white/60">
                  <Phone className="w-4 h-4 text-kath-gold" />
                  <span className="font-body text-sm">+62 21 1234 5678</span>
                </div>
                <div className="flex items-center gap-2 text-kath-off-white/60">
                  <Mail className="w-4 h-4 text-kath-gold" />
                  <span className="font-body text-sm">competition@kathevent.com</span>
                </div>
                <div className="flex items-center gap-2 text-kath-off-white/60">
                  <MapPin className="w-4 h-4 text-kath-gold" />
                  <span className="font-body text-sm">Jakarta, Indonesia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-kath-charcoal/20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl text-kath-gold">KATH</span>
              <span className="font-body text-kath-off-white/40">|</span>
              <span className="font-body text-kath-off-white/40">Competition 2026</span>
            </div>

            <div className="flex items-center gap-8">
              <a href="#" className="font-body text-sm text-kath-off-white/40 hover:text-kath-gold transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#" className="font-body text-sm text-kath-off-white/40 hover:text-kath-gold transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="font-body text-sm text-kath-off-white/40 hover:text-kath-gold transition-colors">
                Kontak
              </a>
            </div>

            <p className="font-body text-sm text-kath-off-white/30">
              © 2026 KATH Event Organizer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutCompetition;
