// Helper function for bilingual text
const t = (id: string, en: string) => ({ id, en });

// Site-wide configuration
export interface SiteConfig {
  language: string;
  siteName: string;
  siteDescription: string;
}

export const siteConfig: SiteConfig = {
  language: "id",
  siteName: "KATH Event Organizer",
  siteDescription: "Premium Event Organizer in Jakarta - Creating Unforgettable Moments Since 2019. Wedding, Corporate Events, Exhibitions, and Private Parties.",
};

// Hero Section
export interface HeroConfig {
  backgroundImage: string;
  backgroundAlt: string;
  title: { id: string; en: string };
  subtitle: { id: string; en: string };
  label: { id: string; en: string };
  ctaPrimary: { id: string; en: string };
  ctaSecondary: { id: string; en: string };
}

export const heroConfig: HeroConfig = {
  backgroundImage: "/hero-pic2.webp",
  backgroundAlt: "Luxury Event Venue by KATH Event Organizer",
  title: t(
    "We Create,Unforgettable\nMoments",
    "We Create,Unforgettable\nMoments"
  ),
  subtitle: t(
    "Mengubah visi Anda menjadi pengalaman luar biasa sejak 2019.",
    "Transforming your vision into extraordinary experiences since 2019."
  ),
  label: t("PREMIUM EVENT ORGANIZER", "PREMIUM EVENT ORGANIZER"),
  ctaPrimary: t("Mulai Perjalanan", "Start Your Journey"),
  ctaSecondary: t("Lihat Karya Kami", "View Our Work"),
};

// Narrative Text Section (About)
export interface NarrativeTextConfig {
  line1: { id: string; en: string };
  line2: { id: string; en: string };
  line3: { id: string; en: string };
  stats: {
    years: string;
    events: string;
    clients: string;
    awards: string;
  };
}

export const narrativeTextConfig: NarrativeTextConfig = {
  line1: t("Where Dreams Meet Execution", "Where Dreams Meet Execution"),
  line2: t("Kindling All The Happiness", "Kindling All The Happiness"),
  line3: t(
    "KATH Event Organizer adalah agensi event kreatif berbasis di Jakarta, yang berdedikasi untuk menciptakan pengalaman luar biasa yang meninggalkan kesan mendalam. Sejak 2019, kami telah mengubah visi menjadi kenyataan, menghadirkan event premium dengan perhatian meticulosa terhadap detail dan kualitas yang tak tertandingi.",
    "KATH Event Organizer is a creative event agency based in Jakarta, dedicated to crafting extraordinary experiences that leave lasting impressions. Since 2019, we have been transforming visions into reality, delivering premium events with meticulous attention to detail and uncompromising quality."
  ),
  stats: {
    years: "7+",
    events: "500+",
    clients: "200+",
    awards: "50+",
  },
};

// Card Stack Section (Featured Portfolio)
export interface CardStackItem {
  id: number;
  image: string;
  title: { id: string; en: string };
  description: { id: string; en: string };
  rotation: number;
  category: { id: string; en: string };
}

export interface CardStackConfig {
  sectionTitle: { id: string; en: string };
  sectionSubtitle: { id: string; en: string };
  cards: CardStackItem[];
}

export const cardStackConfig: CardStackConfig = {
  sectionTitle: t("Event Unggulan", "Featured Events"),
  sectionSubtitle: t("PORTFOLIO KAMI", "OUR PORTFOLIO"),
  cards: [
    {
      id: 1,
      image: "/card-1.webp",
      title: t("Eternal Love Wedding", "Eternal Love Wedding"),
      description: t(
        "Perayaan cinta yang magis dengan rangkaian bunga elegan dan keanggunan timeless di Grand Ballroom.",
        "A magical celebration of love with elegant floral arrangements and timeless sophistication at the Grand Ballroom."
      ),
      rotation: -2,
      category: t("Wedding", "Wedding"),
    },
    {
      id: 2,
      image: "/card-2.webp",
      title: t("Tech Summit 2024", "Tech Summit 2024"),
      description: t(
        "Konferensi teknologi bertaraf internasional dengan 2000+ peserta dari berbagai negara.",
        "An international technology conference with 2000+ attendees from various countries."
      ),
      rotation: 1,
      category: t("Corporate", "Corporate"),
    },
    {
      id: 3,
      image: "/card-3.webp",
      title: t("Enchanted Garden Party", "Enchanted Garden Party"),
      description: t(
        "Pesta mewah dengan konsep taman ajaib yang memukau para tamu undangan.",
        "A luxurious party with an enchanted garden concept that mesmerized the guests."
      ),
      rotation: -1,
      category: t("Private Party", "Private Party"),
    },
  ],
};

// Services Section
export interface ServiceItem {
  id: string;
  icon: string;
  title: { id: string; en: string };
  description: { id: string; en: string };
  features: { id: string; en: string }[];
}

export interface ServicesConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  sectionLabel: t("APA YANG KAMI TAWARKAN", "WHAT WE OFFER"),
  sectionTitle: t("Layanan Premium Kami", "Our Premium Services"),
  sectionDescription: t(
    "Solusi event komprehensif yang disesuaikan dengan visi dan kebutuhan unik Anda",
    "Comprehensive event solutions tailored to your unique vision and requirements"
  ),
  services: [
    {
      id: "wedding",
      icon: "Heart",
      title: t("Perencanaan Pernikahan", "Wedding Planning"),
      description: t("Perencanaan pernikahan full-service dari konsep hingga eksekusi", "Full-service wedding planning from concept to execution"),
      features: [
        t("Pemilihan Venue", "Venue Selection"),
        t("Desain Dekor", "Décor Design"),
        t("Koordinasi Vendor", "Vendor Coordination"),
        t("Manajemen Hari-H", "Day-of Management"),
      ],
    },
    {
      id: "corporate",
      icon: "Building2",
      title: t("Event Korporat", "Corporate Events"),
      description: t("Event profesional yang meningkatkan presence merek Anda", "Professional events that elevate your brand presence"),
      features: [
        t("Peluncuran Produk", "Product Launches"),
        t("Rapat Tahunan", "Annual Meetings"),
        t("Gala Dinner", "Gala Dinners"),
        t("Team Building", "Team Building"),
      ],
    },
    {
      id: "birthday",
      icon: "Cake",
      title: t("Perayaan Ulang Tahun", "Birthday Celebrations"),
      description: t("Pesta ulang tahun yang berkesan untuk semua usia", "Memorable birthday parties for all ages and occasions"),
      features: [
        t("Desain Tema", "Theme Design"),
        t("Hiburan", "Entertainment"),
        t("Katering", "Catering"),
        t("Fotografi", "Photography"),
      ],
    },
    {
      id: "exhibition",
      icon: "LayoutGrid",
      title: t("Pameran", "Exhibitions"),
      description: t("Desain booth memukau yang memikat audiens Anda", "Stunning booth designs that captivate your audience"),
      features: [
        t("Desain Booth", "Booth Design"),
        t("Aktivasi Merek", "Brand Activation"),
        t("Display Interaktif", "Interactive Displays"),
        t("Logistik", "Logistics"),
      ],
    },
    {
      id: "private",
      icon: "Sparkles",
      title: t("Pesta Pribadi", "Private Parties"),
      description: t("Perayaan eksklusif yang disesuaikan dengan preferensi Anda", "Exclusive celebrations tailored to your preferences"),
      features: [
        t("Styling Venue", "Venue Styling"),
        t("Hiburan", "Entertainment"),
        t("Katering Gourmet", "Gourmet Catering"),
        t("Layanan Personal", "Personalized Service"),
      ],
    },
    {
      id: "virtual",
      icon: "Monitor",
      title: t("Event Virtual & Hybrid", "Virtual & Hybrid Events"),
      description: t("Pengalaman digital seamless yang menghubungkan audiens", "Seamless digital experiences that connect audiences"),
      features: [
        t("Live Streaming", "Live Streaming"),
        t("Platform Virtual", "Virtual Platforms"),
        t("Solusi Hybrid", "Hybrid Solutions"),
        t("Dukungan Teknis", "Tech Support"),
      ],
    },
  ],
};

// Breath Section
export interface BreathConfig {
  backgroundImage: string;
  backgroundAlt: string;
  videoUrl?: string;
  title: { id: string; en: string };
  subtitle: { id: string; en: string };
  description?: { id: string; en: string };
}

export const breathConfig: BreathConfig = {
  backgroundImage: "/breath-bg.webp",
  backgroundAlt: "KATH Event Organizer Premium Events",
  title: t("Setiap Momen Berharga", "Every Moment Matters"),
  subtitle: t(
    "Kami percaya bahwa setiap detik dalam event Anda harus diabadikan dengan sempurna. Dari persiapan hingga penutupan, tim kami memastikan semua berjalan lancar.",
    "We believe that every second of your event should be captured perfectly. From preparation to closing, our team ensures everything runs smoothly."
  ),
  description: t(
    "Setiap detail diperhatikan dengan cermat untuk memastikan kesuksesan event Anda.",
    "Every detail is carefully attended to ensure the success of your event."
  ),
};

// Alias for BreathSection component
export const breathSectionConfig = breathConfig;

// Portfolio Section
export interface PortfolioItem {
  id: string;
  image: string;
  title: { id: string; en: string };
  category: { id: string; en: string };
  location: string;
  year: string;
}

export interface PortfolioConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  categories: { id: string; en: string }[];
  items: PortfolioItem[];
}

export const portfolioConfig: PortfolioConfig = {
  sectionLabel: t("KARYA KAMI", "OUR WORK"),
  sectionTitle: t("Portofolio Event", "Event Portfolio"),
  sectionDescription: t(
    "Jelajahi koleksi event kami yang dirancang dengan meticulosa yang menampilkan kreativitas dan keahlian kami",
    "Explore our collection of meticulously crafted events that showcase our creativity and expertise"
  ),
  categories: [
    t("Semua", "All"),
    t("Pernikahan", "Wedding"),
    t("Korporat", "Corporate"),
    t("Pameran", "Exhibition"),
    t("Pribadi", "Private"),
  ],
  items: [
    {
      id: "1",
      image: "/wedding-event.webp",
      title: t("Garden Romance Wedding", "Garden Romance Wedding"),
      category: t("Pernikahan", "Wedding"),
      location: "Jakarta",
      year: "2025",
    },
    {
      id: "2",
      image: "/corporate-event.webp",
      title: t("Executive Summit 2025", "Executive Summit 2025"),
      category: t("Korporat", "Corporate"),
      location: "Jakarta",
      year: "2025",
    },
    {
      id: "3",
      image: "/exhibition-event.webp",
      title: t("Tech Innovation Expo", "Tech Innovation Expo"),
      category: t("Pameran", "Exhibition"),
      location: "Jakarta",
      year: "2024",
    },
    {
      id: "4",
      image: "/private-party.webp",
      title: t("Golden Anniversary Gala", "Golden Anniversary Gala"),
      category: t("Pribadi", "Private"),
      location: "Bali",
      year: "2024",
    },
    {
      id: "5",
      image: "/card-1.webp",
      title: t("Crystal Ballroom Wedding", "Crystal Ballroom Wedding"),
      category: t("Pernikahan", "Wedding"),
      location: "Jakarta",
      year: "2024",
    },
    {
      id: "6",
      image: "/card-2.webp",
      title: t("Annual Awards Night", "Annual Awards Night"),
      category: t("Korporat", "Corporate"),
      location: "Jakarta",
      year: "2025",
    },
  ],
};

// Testimonials Section
export interface TestimonialItem {
  id: string;
  name: string;
  role: { id: string; en: string };
  quote: { id: string; en: string };
  content: { id: string; en: string };
  event: { id: string; en: string };
  rating: number;
  image: string;
}

export interface TestimonialsConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  sectionLabel: t("APA KATA MEREKA", "WHAT THEY SAY"),
  sectionTitle: t("Testimoni Klien", "Client Testimonials"),
  sectionDescription: t(
    "Dengarkan langsung dari klien yang telah mempercayakan momen spesial mereka kepada kami.",
    "Hear directly from clients who have entrusted their special moments to us."
  ),
  testimonials: [
    {
      id: "1",
      name: "Sarah Anderson",
      role: t("Pengantin", "Bride"),
      quote: t(
        "KATH membuat pernikahan kami benar-benar magical. Setiap detail diperhatikan dengan sangat baik!",
        "KATH made our wedding truly magical. Every detail was attended to perfectly!"
      ),
      content: t(
        "KATH membuat pernikahan kami benar-benar magical. Setiap detail diperhatikan dengan sangat baik. Tim mereka profesional dan sangat membantu!",
        "KATH made our wedding truly magical. Every detail was attended to perfectly. Their team is professional and very helpful!"
      ),
      event: t("Garden Wedding", "Garden Wedding"),
      rating: 5,
      image: "/client-1.webp",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: t("CEO, Tech Corp", "CEO, Tech Corp"),
      quote: t(
        "Kami sangat puas dengan corporate event yang diselenggarakan KATH. Hasilnya melebihi ekspektasi!",
        "We are very satisfied with the corporate event organized by KATH. Results exceeded expectations!"
      ),
      content: t(
        "Kami sangat puas dengan corporate event yang diselenggarakan KATH. Prosesnya smooth dan hasilnya melebihi ekspektasi kami.",
        "We are very satisfied with the corporate event organized by KATH. The process was smooth and the results exceeded our expectations."
      ),
      event: t("Annual Gala Dinner", "Annual Gala Dinner"),
      rating: 5,
      image: "/client-2.webp",
    },
    {
      id: "3",
      name: "Lisa Wijaya",
      role: t("Event Manager", "Event Manager"),
      quote: t(
        "Tim KATH sangat profesional dan kreatif. Mereka membantu mewujudkan visi event dengan sempurna!",
        "The KATH team is very professional and creative. They helped realize our event vision perfectly!"
      ),
      content: t(
        "Tim KATH sangat profesional dan kreatif. Mereka membantu kami mewujudkan visi event dengan sempurna. Recommended!",
        "The KATH team is very professional and creative. They helped us realize our event vision perfectly. Highly recommended!"
      ),
      event: t("Product Launch", "Product Launch"),
      rating: 5,
      image: "/client-3.webp",
    },
  ],
};

// FAQ Section
export interface FAQItem {
  id: string;
  question: { id: string; en: string };
  answer: { id: string; en: string };
  category: { id: string; en: string };
}

export interface FAQConfig {
  sectionTitle: { id: string; en: string };
  sectionSubtitle: { id: string; en: string };
  sectionLabel: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  categories: { id: string; en: string }[];
  faqs: FAQItem[];
  items: FAQItem[];
}

export const faqConfig: FAQConfig = {
  sectionTitle: t("Pertanyaan Umum", "Frequently Asked Questions"),
  sectionSubtitle: t("FAQ", "FAQ"),
  sectionLabel: t("FAQ", "FAQ"),
  sectionDescription: t(
    "Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan kami.",
    "Find answers to frequently asked questions about our services."
  ),
  categories: [
    { id: "general", en: "General" },
    { id: "wedding", en: "Wedding" },
    { id: "corporate", en: "Corporate" },
    { id: "pricing", en: "Pricing" },
  ],
  faqs: [
    {
      id: "1",
      question: t("Bagaimana cara memesan layanan KATH?", "How do I book KATH services?"),
      answer: t(
        "Anda dapat menghubungi kami melalui formulir kontak di website ini atau langsung menghubungi nomor WhatsApp kami. Tim kami akan merespons dalam 24 jam.",
        "You can contact us through the contact form on this website or directly via our WhatsApp number. Our team will respond within 24 hours."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "2",
      question: t("Berapa lama waktu persiapan event?", "How long does event preparation take?"),
      answer: t(
        "Waktu persiapan bervariasi tergantung skala dan kompleksitas event. Untuk wedding, kami rekomendasikan minimal 3-6 bulan. Untuk corporate event, 1-3 bulan.",
        "Preparation time varies depending on the scale and complexity of the event. For weddings, we recommend a minimum of 3-6 months. For corporate events, 1-3 months."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "3",
      question: t("Apakah KATH melayani di luar Jakarta?", "Does KATH serve outside Jakarta?"),
      answer: t(
        "Ya, kami melayani event di seluruh Indonesia dan juga internasional. Tim kami siap bepergian untuk mewujudkan event impian Anda.",
        "Yes, we serve events throughout Indonesia and internationally. Our team is ready to travel to make your dream event a reality."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "4",
      question: t("Bagaimana sistem pembayaran?", "What is the payment system?"),
      answer: t(
        "Kami menggunakan sistem pembayaran bertahap: 30% di awal sebagai booking fee, 50% sebelum event, dan 20% setelah event selesai.",
        "We use a phased payment system: 30% upfront as a booking fee, 50% before the event, and 20% after the event is completed."
      ),
      category: t("Harga", "Pricing"),
    },
    {
      id: "5",
      question: t("Apakah bisa custom package?", "Can I get a custom package?"),
      answer: t(
        "Tentu saja! Setiap event adalah unik dan kami siap membuat paket yang sesuai dengan kebutuhan dan budget Anda.",
        "Of course! Every event is unique and we are ready to create a package that suits your needs and budget."
      ),
      category: t("Harga", "Pricing"),
    },
  ],
  items: [
    {
      id: "1",
      question: t("Bagaimana cara memesan layanan KATH?", "How do I book KATH services?"),
      answer: t(
        "Anda dapat menghubungi kami melalui formulir kontak di website ini atau langsung menghubungi nomor WhatsApp kami. Tim kami akan merespons dalam 24 jam.",
        "You can contact us through the contact form on this website or directly via our WhatsApp number. Our team will respond within 24 hours."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "2",
      question: t("Berapa lama waktu persiapan event?", "How long does event preparation take?"),
      answer: t(
        "Waktu persiapan bervariasi tergantung skala dan kompleksitas event. Untuk wedding, kami rekomendasikan minimal 3-6 bulan. Untuk corporate event, 1-3 bulan.",
        "Preparation time varies depending on the scale and complexity of the event. For weddings, we recommend a minimum of 3-6 months. For corporate events, 1-3 months."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "3",
      question: t("Apakah KATH melayani di luar Jakarta?", "Does KATH serve outside Jakarta?"),
      answer: t(
        "Ya, kami melayani event di seluruh Indonesia dan juga internasional. Tim kami siap bepergian untuk mewujudkan event impian Anda.",
        "Yes, we serve events throughout Indonesia and internationally. Our team is ready to travel to make your dream event a reality."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "4",
      question: t("Bagaimana sistem pembayaran?", "What is the payment system?"),
      answer: t(
        "Kami menggunakan sistem pembayaran bertahap: 30% di awal sebagai booking fee, 50% sebelum event, dan 20% setelah event selesai.",
        "We use a phased payment system: 30% upfront as a booking fee, 50% before the event, and 20% after the event is completed."
      ),
      category: t("Harga", "Pricing"),
    },
    {
      id: "5",
      question: t("Apakah bisa custom package?", "Can I get a custom package?"),
      answer: t(
        "Tentu saja! Setiap event adalah unik dan kami siap membuat paket yang sesuai dengan kebutuhan dan budget Anda.",
        "Of course! Every event is unique and we are ready to create a package that suits your needs and budget."
      ),
      category: t("Harga", "Pricing"),
    },
  ],
};

// Statistics Section
export interface StatItem {
  value: string;
  label: { id: string; en: string };
}

export interface StatisticsConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  stats: {
    years: StatItem;
    events: StatItem;
    clients: StatItem;
    awards: StatItem;
  };
}

export const statisticsConfig: StatisticsConfig = {
  sectionLabel: t("PENCAPAIAN KAMI", "OUR ACHIEVEMENTS"),
  sectionTitle: t("Pencapaian Kami", "Our Achievements"),
  stats: {
    years: { value: "7", label: t("Tahun Pengalaman", "Years Experience") },
    events: { value: "500", label: t("Event Sukses", "Successful Events") },
    clients: { value: "200", label: t("Klien Puas", "Happy Clients") },
    awards: { value: "50", label: t("Penghargaan", "Awards") },
  },
};

// Backward compatibility alias
export const statsConfig = statisticsConfig;

// Competition Section
export interface CompetitionCategory {
  id: string;
  name: { id: string; en: string };
  target: { id: string; en: string };
  prize: string;
  status: { id: string; en: string };
}

export interface CompetitionConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  mainCompetition: {
    name: { id: string; en: string };
    deadline: string;
    description: { id: string; en: string };
    totalPrize: { id: string; en: string };
  };
  categories: CompetitionCategory[];
  ctaText: { id: string; en: string };
}

export const competitionConfig: CompetitionConfig = {
  sectionLabel: t("KOMPETISI CIBC", "CIBC COMPETITION"),
  sectionTitle: t("CIBC Power by KATH 2026", "CIBC Power by KATH 2026"),
  sectionDescription: t(
    "Inovasi untuk masa depan berkelanjutan. Bergabunglah dengan kompetisi internasional dan menangkan hadiah luar biasa.",
    "Innovate for a sustainable future. Join the international competition and win amazing prizes."
  ),
  mainCompetition: {
    name: t("CIBC Power by KATH 2026", "CIBC Power by KATH 2026"),
    deadline: "2025-12-31",
    description: t(
      "Tunjukkan solusi sustainability terbaik Anda dan menangkan hadiah eksklusif senilai lebih dari $100,000 termasuk pendanaan investasi",
      "Showcase your best sustainability solutions and win exclusive prizes worth over $100,000 including investment funding"
    ),
    totalPrize: t("Rp 500 Juta+", "$100K+"),
  },
  categories: [
    {
      id: "1",
      name: t("Student Innovation", "Student Innovation"),
      target: t("Mahasiswa & Siswa (16-28 tahun)", "Students (16-28 years)"),
      prize: "$25K",
      status: t("Buka", "Open"),
    },
    {
      id: "2",
      name: t("Startup Challenge", "Startup Challenge"),
      target: t("Startup 0-3 tahun", "Startups 0-3 years"),
      prize: "$50K",
      status: t("Buka", "Open"),
    },
    {
      id: "3",
      name: t("Corporate Innovation", "Corporate Innovation"),
      target: t("Perusahaan Korporat", "Corporations"),
      prize: "Trophy",
      status: t("Buka", "Open"),
    },
    {
      id: "4",
      name: t("Sustainability Award", "Sustainability Award"),
      target: t("Semua Kategori", "All Categories"),
      prize: "Special",
      status: t("Segera", "Soon"),
    },
  ],
  ctaText: t("Daftar Sekarang", "Register Now"),
};

// News/Blog Section
export interface NewsItem {
  id: string;
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  content: { id: string; en: string };
  image: string;
  category: { id: string; en: string };
  date: string;
  author: string;
  slug: string;
}

export interface NewsConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  items: NewsItem[];
}

export const newsConfig: NewsConfig = {
  sectionLabel: t("UPDATE TERBARU", "LATEST UPDATES"),
  sectionTitle: t("Berita & Pengumuman", "News & Announcements"),
  sectionDescription: t(
    "Ikuti perkembangan terbaru dan pengumuman dari KATH Event Organizer",
    "Stay updated with the latest news and announcements from KATH Event Organizer"
  ),
  items: [
    {
      id: "1",
      title: t(
        "Pendaftaran BMC Competition 2026 Resmi Dibuka",
        "BMC Competition 2026 Registration Now Open"
      ),
      excerpt: t(
        "Bergabunglah dengan kompetisi BMC bergengsi dan menangkan hadiah luar biasa senilai lebih dari $100,000.",
        "Join the prestigious BMC competition and win amazing prizes worth over $100,000."
      ),
      content: t(
        "KATH Event Organizer dengan bangga mempersembahkan BMC International Competition 2026, platform bergengsi bagi entrepreneur dan inovator untuk menampilkan model bisnis terbaik mereka. Kompetisi tahun ini menampilkan berbagai kategori termasuk Startup Challenge, Social Enterprise, Student Innovation, dan Corporate Innovation.",
        "KATH Event Organizer proudly presents BMC International Competition 2026, a prestigious platform for entrepreneurs and innovators to showcase their best business models. This year's competition features various categories including Startup Challenge, Social Enterprise, Student Innovation, and Corporate Innovation."
      ),
      image: "/wedding-event.webp",
      category: t("Kompetisi", "Competition"),
      date: "2025-03-01",
      author: "KATH Team",
      slug: "bmc-competition-2026-open",
    },
    {
      id: "2",
      title: t(
        "Kategori Green Business Ditambahkan",
        "Green Business Category Added"
      ),
      excerpt: t(
        "Kami dengan senang hati mengumumkan kategori baru untuk bisnis berkelanjutan dengan hadiah khusus.",
        "We are excited to announce a new category for sustainable businesses with special prizes."
      ),
      content: t(
        "Karena permintaan yang luar biasa, kami telah menambahkan kategori BMC Green Business ke dalam lineup kompetisi kami. Kategori ini berfokus pada inovasi bisnis berkelanjutan dan solusi ramah lingkungan.",
        "Due to overwhelming demand, we have added the BMC Green Business category to our competition lineup. This category focuses on sustainable business innovation and eco-friendly solutions."
      ),
      image: "/card-2.webp",
      category: t("Pengumuman", "Announcement"),
      date: "2025-02-28",
      author: "KATH Team",
      slug: "new-green-business-category",
    },
    {
      id: "3",
      title: t(
        "Perkenalan Panel Juri BMC 2026",
        "Introducing BMC 2026 Judges Panel"
      ),
      excerpt: t(
        "Mengenal para ahli industri yang akan menilai submission Anda dalam kompetisi BMC.",
        "Meet the industry experts who will evaluate your submissions in the BMC competition."
      ),
      content: t(
        "Kami dengan hormat memperkenalkan panel juri kami untuk BMC International Competition 2026. Panel kami mencakup investor terkemuka, pengusaha sukses, dan veteran industri.",
        "We are honored to introduce our judges panel for BMC International Competition 2026. Our panel includes leading investors, successful entrepreneurs, and industry veterans."
      ),
      image: "/about-team.webp",
      category: t("Berita", "News"),
      date: "2025-02-25",
      author: "KATH Team",
      slug: "judges-panel-2026",
    },
    {
      id: "4",
      title: t(
        "Tips Merencanakan Pernikahan Impian",
        "Tips for Planning Your Dream Wedding"
      ),
      excerpt: t(
        "Pelajari cara merencanakan pernikahan sempurna dengan tips dari para ahli KATH.",
        "Learn how to plan the perfect wedding with tips from KATH experts."
      ),
      content: t(
        "Merencanakan pernikahan bisa menjadi tugas yang menakutkan, tetapi dengan pendekatan yang tepat, ini bisa menjadi pengalaman yang menyenangkan. Berikut adalah tips dari para ahli KATH untuk membantu Anda merencanakan hari istimewa Anda.",
        "Planning a wedding can be a daunting task, but with the right approach, it can be an enjoyable experience. Here are tips from KATH experts to help you plan your special day."
      ),
      image: "/grid-1.webp",
      category: t("Berita", "News"),
      date: "2025-02-20",
      author: "KATH Team",
      slug: "wedding-planning-tips",
    },
    {
      id: "5",
      title: t(
        "Tren Event Korporat 2025",
        "Corporate Event Trends 2025"
      ),
      excerpt: t(
        "Temukan tren terbaru dalam event korporat yang akan mendominasi tahun ini.",
        "Discover the latest trends in corporate events that will dominate this year."
      ),
      content: t(
        "Dari teknologi imersif hingga keberlanjutan, temukan tren event korporat yang akan membentuk industri di tahun 2025 dan seterusnya.",
        "From immersive technology to sustainability, discover the corporate event trends that will shape the industry in 2025 and beyond."
      ),
      image: "/grid-2.webp",
      category: t("Berita", "News"),
      date: "2025-02-15",
      author: "KATH Team",
      slug: "corporate-event-trends-2025",
    },
    {
      id: "6",
      title: t(
        "KATH Raih Penghargaan Industri 2025",
        "KATH Wins Industry Award 2025"
      ),
      excerpt: t(
        "Kami bangga mengumumkan KATH menerima penghargaan prestisius dari Asosiasi Event Indonesia.",
        "We are proud to announce KATH received a prestigious award from the Indonesian Event Association."
      ),
      content: t(
        "KATH Event Organizer dihormati menerima Industry Excellence Award 2025 dari Indonesian Event Professionals Association. Pengakuan ini adalah bukti komitmen kami dalam menyelenggarakan event berkualitas.",
        "KATH Event Organizer is honored to receive the Industry Excellence Award 2025 from the Indonesian Event Professionals Association. This recognition is a testament to our commitment to hosting quality events."
      ),
      image: "/corporate-event.webp",
      category: t("Berita", "News"),
      date: "2025-02-10",
      author: "KATH Team",
      slug: "industry-award-2025",
    },
  ],
};


// Clients Section
export interface ClientItem {
  name: string;
  logo: string;
}

export interface ClientsConfig {
  sectionTitle: { id: string; en: string };
  sectionSubtitle: { id: string; en: string };
  clients: ClientItem[];
}

export const clientsConfig: ClientsConfig = {
  sectionTitle: t("Klien Kami", "Our Clients"),
  sectionSubtitle: t("DIPERCAYA OLEH", "TRUSTED BY"),
  clients: [
    { name: "Client 1", logo: "/client-1.webp" },
    { name: "Client 2", logo: "/client-2.webp" },
    { name: "Client 3", logo: "/client-3.webp" },
  ],
};

// Contact Section
export interface ContactConfig {
  sectionTitle: { id: string; en: string };
  sectionSubtitle: { id: string; en: string };
  sectionLabel: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  ctaText: { id: string; en: string };
  email: string;
  phone: string;
  whatsapp: string;
  address: { id: string; en: string };
  socialMedia: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: { id: string; en: string };
    hours: { id: string; en: string };
  };
  socials: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitter: string;
  };
}

export const contactConfig: ContactConfig = {
  sectionTitle: t("Hubungi Kami", "Contact Us"),
  sectionSubtitle: t("MARI BERBICARA", "LET'S TALK"),
  sectionLabel: t("HUBUNGI KAMI", "CONTACT US"),
  sectionDescription: t(
    "Kami siap membantu mewujudkan event impian Anda. Hubungi kami untuk konsultasi gratis.",
    "We are ready to help make your dream event a reality. Contact us for a free consultation."
  ),
  ctaText: t("Kirim Pesan", "Send Message"),
  email: "hello@kathevent.com",
  phone: "+62 21 1234 5678",
  whatsapp: "+62 812 3456 7890",
  address: t(
    "Jl. Sudirman No. 123, Jakarta Pusat, Indonesia 10220",
    "Jl. Sudirman No. 123, Central Jakarta, Indonesia 10220"
  ),
  socialMedia: {
    instagram: "@kathevent",
    linkedin: "kath-event-organizer",
    youtube: "KATHEvent",
  },
  contactInfo: {
    email: "hello@kathevent.com",
    phone: "+62 21 1234 5678",
    address: t(
      "Jl. Sudirman No. 123, Jakarta Pusat",
      "Jl. Sudirman No. 123, Central Jakarta"
    ),
    hours: t(
      "Senin - Jumat: 09:00 - 18:00 WIB",
      "Monday - Friday: 09:00 - 18:00"
    ),
  },
  socials: {
    instagram: "https://instagram.com/kathevent",
    facebook: "https://facebook.com/kathevent",
    linkedin: "https://linkedin.com/company/kath-event-organizer",
    twitter: "https://twitter.com/kathevent",
  },
};

// Footer
export interface FooterConfig {
  companyName: string;
  heading: { id: string; en: string };
  description: { id: string; en: string };
  ctaText?: { id: string; en: string };
  contact: { type: string; href: string; label: string }[];
  address: string[];
  locationLabel: { id: string; en: string };
  socials: { platform: string; href: string }[];
  socialLabel: { id: string; en: string };
  logoText: string;
  tagline: { id: string; en: string };
  copyright: string;
  links: { href: string; label: { id: string; en: string } }[];
  quickLinks: { label: { id: string; en: string }; href: string }[];
  services: { label: { id: string; en: string }; href: string }[];
}

export const footerConfig: FooterConfig = {
  companyName: "KATH Event Organizer",
  heading: t(
    "Mari Wujudkan Event Impian Anda",
    "Let's Create Your Dream Event"
  ),
  description: t(
    "Menciptakan momen tak terlupakan sejak 2019. Event organizer premium untuk wedding, corporate event, dan private party.",
    "Creating unforgettable moments since 2019. Premium event organizer for weddings, corporate events, and private parties."
  ),
  ctaText: t("Hubungi Kami", "Contact Us"),
  contact: [
    { type: "email", href: "mailto:hello@kathevent.com", label: "hello@kathevent.com" },
    { type: "phone", href: "tel:+622112345678", label: "+62 21 1234 5678" },
  ],
  address: ["Jl. Sudirman No. 123", "Jakarta Pusat, Indonesia 10220"],
  locationLabel: t("Lokasi", "Location"),
  socials: [
    { platform: "instagram", href: "https://instagram.com/kathevent" },
    { platform: "linkedin", href: "https://linkedin.com/company/kath-event-organizer" },
    { platform: "twitter", href: "https://twitter.com/kathevent" },
  ],
  socialLabel: t("Ikuti Kami", "Follow Us"),
  logoText: "KATH",
  tagline: t("Event Organizer Premium", "Premium Event Organizer"),
  copyright: "© 2024 KATH Event Organizer. All rights reserved.",
  links: [
    { href: "/privacy", label: t("Kebijakan Privasi", "Privacy Policy") },
    { href: "/terms", label: t("Syarat & Ketentuan", "Terms & Conditions") },
  ],
  quickLinks: [
    { label: t("Beranda", "Home"), href: "/" },
    { label: t("Tentang Kami", "About Us"), href: "#about" },
    { label: t("Layanan", "Services"), href: "#services" },
    { label: t("Portfolio", "Portfolio"), href: "#portfolio" },
    { label: t("Kontak", "Contact"), href: "#contact" },
  ],
  services: [
    { label: t("Wedding", "Wedding"), href: "#services" },
    { label: t("Corporate Event", "Corporate Event"), href: "#services" },
    { label: t("Private Party", "Private Party"), href: "#services" },
    { label: t("Exhibition", "Exhibition"), href: "#services" },
  ],
};

// Navigation
export interface NavItem {
  label: { id: string; en: string };
  href: string;
}

export interface NavigationConfig {
  logo: string;
  logoAlt: string;
  items: NavItem[];
  cta: { label: { id: string; en: string }; href: string };
  ctaText: { id: string; en: string };
}

export const navigationConfig: NavigationConfig = {
  logo: "/kath-logo.png",
  logoAlt: "KATH Event Organizer Logo",
  items: [
    { label: t("Beranda", "Home"), href: "/" },
    { label: t("Tentang", "About"), href: "#about" },
    { label: t("Layanan", "Services"), href: "#services" },
    { label: t("Portfolio", "Portfolio"), href: "#portfolio" },
    { label: t("Kompetisi", "Competition"), href: "#competition" },
    { label: t("Kontak", "Contact"), href: "#contact" },
  ],
  cta: { label: t("Konsultasi Gratis", "Free Consultation"), href: "#contact" },
  ctaText: t("Konsultasi Gratis", "Free Consultation"),
};

// ZigZag Grid Section
export interface ZigZagGridItem {
  id: number;
  image: string;
  imageAlt: string;
  title: { id: string; en: string };
  subtitle: { id: string; en: string };
  description: { id: string; en: string };
  reverse: boolean;
}

export interface ZigZagGridConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  items: ZigZagGridItem[];
}

export const zigZagGridConfig: ZigZagGridConfig = {
  sectionLabel: t("MENGAPA KAMI", "WHY US"),
  sectionTitle: t("Keunggulan Kami", "Our Excellence"),
  items: [
    {
      id: 1,
      image: "/wedding-event.webp",
      imageAlt: "Wedding Event",
      title: t("Pengalaman Premium", "Premium Experience"),
      subtitle: t("LEBIH DARI 7 TAHUN", "OVER 7 YEARS"),
      description: t(
        "Dengan pengalaman lebih dari 7 tahun, kami telah membangun reputasi sebagai event organizer premium yang terpercaya.",
        "With over 7 years of experience, we have built a reputation as a trusted premium event organizer."
      ),
      reverse: false,
    },
    {
      id: 2,
      image: "/corporate-event.webp",
      imageAlt: "Corporate Event",
      title: t("Tim Profesional", "Professional Team"),
      subtitle: t("TIM BERPENGALAMAN", "EXPERIENCED TEAM"),
      description: t(
        "Tim kami terdiri dari profesional berpengalaman yang siap mewujudkan visi event Anda menjadi kenyataan.",
        "Our team consists of experienced professionals ready to bring your event vision to life."
      ),
      reverse: true,
    },
    {
      id: 3,
      image: "/exhibition-event.webp",
      imageAlt: "Exhibition Event",
      title: t("Kreativitas Tanpa Batas", "Unlimited Creativity"),
      subtitle: t("DESAIN UNIK", "UNIQUE DESIGN"),
      description: t(
        "Kami menghadirkan konsep-konsep kreatif dan inovatif yang membuat event Anda berbeda dari yang lain.",
        "We bring creative and innovative concepts that make your event stand out from the rest."
      ),
      reverse: false,
    },
  ],
};