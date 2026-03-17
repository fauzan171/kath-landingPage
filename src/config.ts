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
  backgroundImage: "/hero-bg.webp",
  backgroundAlt: "Luxury Event Venue by KATH Event Organizer",
  title: t(
    "We Create\nUnforgettable\nMoments",
    "We Create\nUnforgettable\nMoments"
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
  image: string;
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
  sectionTitle: t("Layanan Kami", "Our Services"),
  sectionDescription: t(
    "Kami menyediakan layanan event organizer lengkap untuk semua kebutuhan Anda, dari wedding hingga corporate event.",
    "We provide comprehensive event organizer services for all your needs, from weddings to corporate events."
  ),
  services: [
    {
      id: "wedding",
      icon: "heart",
      title: t("Wedding", "Wedding"),
      description: t(
        "Menciptakan pernikahan impian Anda dengan detail yang sempurna dan momen yang tak terlupakan.",
        "Creating your dream wedding with perfect details and unforgettable moments."
      ),
      image: "/wedding-event.webp",
      features: [
        t("Dekorasi & Tema", "Decoration & Theme"),
        t("Koordinasi Vendor", "Vendor Coordination"),
        t("Manajemen Acara", "Event Management"),
      ],
    },
    {
      id: "corporate",
      icon: "briefcase",
      title: t("Corporate Event", "Corporate Event"),
      description: t(
        "Mengelola event bisnis profesional yang meninggalkan kesan mendalam bagi stakeholder.",
        "Managing professional business events that leave lasting impressions on stakeholders."
      ),
      image: "/corporate-event.webp",
      features: [
        t("Konferensi & Seminar", "Conferences & Seminars"),
        t("Product Launch", "Product Launch"),
        t("Team Building", "Team Building"),
      ],
    },
    {
      id: "private",
      icon: "sparkles",
      title: t("Private Party", "Private Party"),
      description: t(
        "Merancang perayaan eksklusif yang mencerminkan kepribadian dan gaya unik Anda.",
        "Designing exclusive celebrations that reflect your unique personality and style."
      ),
      image: "/private-party.webp",
      features: [
        t("Birthday Party", "Birthday Party"),
        t("Anniversary", "Anniversary"),
        t("Private Gathering", "Private Gathering"),
      ],
    },
    {
      id: "exhibition",
      icon: "presentation",
      title: t("Exhibition", "Exhibition"),
      description: t(
        "Menyelenggarakan pameran yang menarik perhatian dan memaksimalkan brand visibility.",
        "Organizing exhibitions that capture attention and maximize brand visibility."
      ),
      image: "/exhibition-event.webp",
      features: [
        t("Booth Design", "Booth Design"),
        t("Event Production", "Event Production"),
        t("Brand Activation", "Brand Activation"),
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

// Portfolio Grid Section
export interface PortfolioItem {
  id: number;
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
  items: PortfolioItem[];
  categories: { id: string; id_text: string; en: string }[];
}

export const portfolioConfig: PortfolioConfig = {
  sectionLabel: t("KARYA TERBAIK KAMI", "OUR BEST WORK"),
  sectionTitle: t("Portfolio Kami", "Our Portfolio"),
  sectionDescription: t(
    "Lihat berbagai event yang telah kami selenggarakan dengan sukses. Setiap proyek adalah cerminan dedikasi dan profesionalisme tim kami.",
    "See the various events we have successfully organized. Each project is a reflection of our team's dedication and professionalism."
  ),
  items: [
    {
      id: 1,
      image: "/grid-1.webp",
      title: t("Romantic Garden Wedding", "Romantic Garden Wedding"),
      category: t("Wedding", "Wedding"),
      location: "Jakarta",
      year: "2024",
    },
    {
      id: 2,
      image: "/grid-2.webp",
      title: t("Annual Corporate Gala", "Annual Corporate Gala"),
      category: t("Corporate", "Corporate"),
      location: "Bali",
      year: "2024",
    },
    {
      id: 3,
      image: "/birthday-event.webp",
      title: t("Birthday Celebration", "Birthday Celebration"),
      category: t("Private Party", "Private Party"),
      location: "Jakarta",
      year: "2024",
    },
    {
      id: 4,
      image: "/virtual-event.webp",
      title: t("Virtual Product Launch", "Virtual Product Launch"),
      category: t("Corporate", "Corporate"),
      location: "Online",
      year: "2024",
    },
    {
      id: 5,
      image: "/wedding-event.webp",
      title: t("Luxury Wedding", "Luxury Wedding"),
      category: t("Wedding", "Wedding"),
      location: "Yogyakarta",
      year: "2023",
    },
    {
      id: 6,
      image: "/exhibition-event.webp",
      title: t("Trade Exhibition", "Trade Exhibition"),
      category: t("Exhibition", "Exhibition"),
      location: "Jakarta",
      year: "2024",
    },
  ],
  categories: [
    { id: "all", id_text: "Semua", en: "All" },
    { id: "wedding", id_text: "Wedding", en: "Wedding" },
    { id: "corporate", id_text: "Corporate", en: "Corporate" },
    { id: "private", id_text: "Private Party", en: "Private Party" },
    { id: "exhibition", id_text: "Exhibition", en: "Exhibition" },
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

// News Section
export interface NewsItem {
  id: number;
  image: string;
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  content: { id: string; en: string };
  date: string;
  category: { id: string; en: string };
  author: string;
}

export interface NewsConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  items: NewsItem[];
}

export const newsConfig: NewsConfig = {
  sectionLabel: t("UPDATE KAMI", "OUR UPDATES"),
  sectionTitle: t("Berita Terbaru", "Latest News"),
  sectionDescription: t(
    "Dapatkan informasi terbaru tentang event dan kompetisi yang kami selenggarakan.",
    "Get the latest information about events and competitions we organize."
  ),
  items: [
    {
      id: 1,
      image: "/corporate-event.webp",
      title: t("KATH sukses menggelar konferensi teknologi terbesar", "KATH successfully hosts largest tech conference"),
      excerpt: t(
        "Lebih dari 2000 peserta hadir dalam Tech Summit 2024 yang diselenggarakan di Jakarta Convention Center.",
        "More than 2000 attendees joined Tech Summit 2024 held at Jakarta Convention Center."
      ),
      content: t(
        "Lebih dari 2000 peserta hadir dalam Tech Summit 2024 yang diselenggarakan di Jakarta Convention Center. Event ini menghadirkan pembicara dari berbagai perusahaan teknologi ternama.",
        "More than 2000 attendees joined Tech Summit 2024 held at Jakarta Convention Center. The event featured speakers from various leading technology companies."
      ),
      date: "2024-03-15",
      category: t("Corporate", "Corporate"),
      author: "KATH Team",
    },
    {
      id: 2,
      image: "/wedding-event.webp",
      title: t("Trend pernikahan 2024 yang wajib diketahui", "2024 wedding trends you need to know"),
      excerpt: t(
        "Warna earthy tone, dekorasi sustainable, dan intimate wedding menjadi tren utama tahun ini.",
        "Earthy tones, sustainable decor, and intimate weddings are the main trends this year."
      ),
      content: t(
        "Warna earthy tone, dekorasi sustainable, dan intimate wedding menjadi tren utama tahun ini. KATH hadir dengan berbagai pilihan tema yang sesuai dengan tren terkini.",
        "Earthy tones, sustainable decor, and intimate weddings are the main trends this year. KATH presents various theme options that match current trends."
      ),
      date: "2024-03-10",
      category: t("Wedding", "Wedding"),
      author: "KATH Team",
    },
    {
      id: 3,
      image: "/virtual-event.webp",
      title: t("Tips mengadakan hybrid event yang sukses", "Tips for hosting successful hybrid events"),
      excerpt: t(
        "Pelajari strategi untuk menggabungkan pengalaman offline dan online dalam satu event yang memorable.",
        "Learn strategies to combine offline and online experiences in one memorable event."
      ),
      content: t(
        "Pelajari strategi untuk menggabungkan pengalaman offline dan online dalam satu event yang memorable. Hybrid event menjadi pilihan tepat untuk menjangkau audiens yang lebih luas.",
        "Learn strategies to combine offline and online experiences in one memorable event. Hybrid events are a great choice to reach a wider audience."
      ),
      date: "2024-03-05",
      category: t("Tips", "Tips"),
      author: "KATH Team",
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