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
  backgroundImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80",
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
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      title: t("Eternal Love Wedding", "Eternal Love Wedding"),
      description: t(
        "Perayaan cinta yang magis dengan rangkaian bunga elegan dan keanggunan timeless di Grand Ballroom.",
        "A magical celebration of love with elegant floral arrangements and timeless sophistication at the Grand Ballroom."
      ),
      rotation: -2,
      category: t("Pernikahan", "Wedding"),
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      title: t("Global Innovation Summit", "Global Innovation Summit"),
      description: t(
        "Keunggulan korporat yang didefinisikan ulang - pertemuan bergengsi para pemimpin industri dengan produksi mutakhir.",
        "Corporate excellence redefined - a prestigious gathering of industry leaders with state-of-the-art production."
      ),
      rotation: 1,
      category: t("Korporat", "Corporate"),
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
      title: t("Garden of Lights Gala", "Garden of Lights Gala"),
      description: t(
        "Malam yang mempesona di bawah bintang, menampilkan kanopi lampu peri yang memukau dan makan malam gourmet.",
        "An enchanting evening under the stars, featuring a mesmerizing canopy of fairy lights and gourmet dining."
      ),
      rotation: -1,
      category: t("Pesta Pribadi", "Private Party"),
    },
  ],
};

// Breath Section (Cinematic Showcase)
export interface BreathSectionConfig {
  backgroundImage: string;
  backgroundAlt: string;
  title: { id: string; en: string };
  subtitle: { id: string; en: string };
  description: { id: string; en: string };
}

export const breathSectionConfig: BreathSectionConfig = {
  backgroundImage: "https://images.unsplash.com/photo-1478146896981-b80c463ab1d7?w=1920&q=80",
  backgroundAlt: "Luxury Event Venue Interior",
  title: t("Keunggulan dalam Setiap Detail", "Excellence in Every Detail"),
  subtitle: t("PENGALAMAN EVENT PREMIUM", "PREMIUM EVENT EXPERIENCE"),
  description: t(
    "Dari pertemuan intim hingga perayaan megah, kami mewujudkan visi Anda dengan kreativitas, presisi, dan keanggunan yang tak tertandingi. Tim kami yang berdedikasi memastikan setiap momen dirancang dengan sempurna.",
    "From intimate gatherings to grand celebrations, we bring your vision to life with creativity, precision, and unparalleled elegance. Our dedicated team ensures every moment is crafted to perfection."
  ),
};

// ZigZag Grid Section (Services)
export interface ZigZagGridItem {
  id: string;
  title: { id: string; en: string };
  subtitle: { id: string; en: string };
  description: { id: string; en: string };
  image: string;
  imageAlt: string;
  reverse: boolean;
}

export interface ZigZagGridConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  items: ZigZagGridItem[];
}

export const zigZagGridConfig: ZigZagGridConfig = {
  sectionLabel: t("LAYANAN KAMI", "OUR SERVICES"),
  sectionTitle: t("Menciptakan Pengalaman Luar Biasa", "Crafting Extraordinary Experiences"),
  items: [
    {
      id: "wedding",
      title: t("Perencanaan Pernikahan", "Wedding Planning"),
      subtitle: t("PERAYAKAN TIMELESS", "TIMELESS CELEBRATIONS"),
      description: t(
        "Dari upacara intim hingga resepsi megah, kami menciptakan pengalaman pernikahan yang mencerminkan kisah cinta unik Anda. Perencanaan pernikahan komprehensif kami mencakup pemilihan venue, desain dekor, koordinasi vendor, dan manajemen hari-H untuk memastikan hari istimewa Anda tidak kurang dari magis.",
        "From intimate ceremonies to grand receptions, we create wedding experiences that reflect your unique love story. Our comprehensive wedding planning includes venue selection, décor design, vendor coordination, and day-of management to ensure your special day is nothing short of magical."
      ),
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      imageAlt: "Elegant Wedding Ceremony",
      reverse: false,
    },
    {
      id: "corporate",
      title: t("Event Korporat", "Corporate Events"),
      subtitle: t("KEUNGGULAN PROFESIONAL", "PROFESSIONAL EXCELLENCE"),
      description: t(
        "Tingkatkan merek Anda dengan event korporat yang dijalankan dengan sempurna. Dari peluncuran produk dan rapat tahunan hingga gala dinner dan aktivitas team building, kami menghadirkan event profesional yang meninggalkan kesan mendalam pada para pemangku kepentingan Anda.",
        "Elevate your brand with impeccably executed corporate events. From product launches and annual meetings to gala dinners and team building activities, we deliver professional events that leave lasting impressions on your stakeholders."
      ),
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      imageAlt: "Corporate Gala Dinner",
      reverse: true,
    },
    {
      id: "exhibition",
      title: t("Pameran & Trade Show", "Exhibitions & Trade Shows"),
      subtitle: t("TAMPILKAN MEREK ANDA", "SHOWCASE YOUR BRAND"),
      description: t(
        "Menonjol dari keramaian dengan desain pameran yang memukau yang memikat audiens Anda. Kami menciptakan pengalaman merek imersif yang mendorong engagement dan memberikan hasil yang terukur untuk bisnis Anda.",
        "Stand out from the crowd with stunning exhibition designs that captivate your audience. We create immersive brand experiences that drive engagement and deliver measurable results for your business."
      ),
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
      imageAlt: "Modern Exhibition Booth",
      reverse: false,
    },
    {
      id: "private",
      title: t("Pesta Pribadi", "Private Parties"),
      subtitle: t("PERAYAKAN EKSKLUSIF", "EXCLUSIVE CELEBRATIONS"),
      description: t(
        "Rayakan momen spesial dalam hidup dengan gaya dan keanggunan. Dari ulang tahun milestone hingga peryaan anniversary, kami merancang pesta pribadi yang melebihi ekspektasi dan menciptakan kenangan berharga.",
        "Celebrate life's special moments with style and sophistication. From milestone birthdays to anniversary celebrations, we design private parties that exceed expectations and create cherished memories."
      ),
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
      imageAlt: "Luxury Private Party",
      reverse: true,
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
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      title: t("Garden Romance Wedding", "Garden Romance Wedding"),
      category: t("Pernikahan", "Wedding"),
      location: "Jakarta",
      year: "2025",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      title: t("Executive Summit 2025", "Executive Summit 2025"),
      category: t("Korporat", "Corporate"),
      location: "Jakarta",
      year: "2025",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
      title: t("Tech Innovation Expo", "Tech Innovation Expo"),
      category: t("Pameran", "Exhibition"),
      location: "Jakarta",
      year: "2024",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
      title: t("Golden Anniversary Gala", "Golden Anniversary Gala"),
      category: t("Pribadi", "Private"),
      location: "Bali",
      year: "2024",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
      title: t("Crystal Ballroom Wedding", "Crystal Ballroom Wedding"),
      category: t("Pernikahan", "Wedding"),
      location: "Jakarta",
      year: "2024",
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
      title: t("Annual Awards Night", "Annual Awards Night"),
      category: t("Korporat", "Corporate"),
      location: "Jakarta",
      year: "2025",
    },
  ],
};

// Competition Section - BMC ONLY
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
  };
  categories: CompetitionCategory[];
  ctaText: { id: string; en: string };
}

export const competitionConfig: CompetitionConfig = {
  sectionLabel: t("KOMPETISI BMC", "BMC COMPETITION"),
  sectionTitle: t("BMC International Competition 2026", "BMC International Competition 2026"),
  sectionDescription: t(
    "Unjukkan kreativitas dan inovasi bisnis Anda. Bergabunglah dengan kompetisi tahunan kami dan menangkan hadiah luar biasa.",
    "Showcase your business creativity and innovation. Join our annual competition and win amazing prizes."
  ),
  mainCompetition: {
    name: t("BMC International Competition 2026", "BMC International Competition 2026"),
    deadline: "2025-12-31",
    description: t(
      "Desain model bisnis terbaik Anda dan menangkan hadiah eksklusif senilai lebih dari $100,000 termasuk pendanaan investasi",
      "Design your best business model and win exclusive prizes worth over $100,000 including investment funding"
    ),
  },
  categories: [
    {
      id: "1",
      name: t("BMC Startup Challenge", "BMC Startup Challenge"),
      target: t("Startup & Founder", "Startup & Founder"),
      prize: "$50K",
      status: t("Buka", "Open"),
    },
    {
      id: "2",
      name: t("BMC Social Enterprise", "BMC Social Enterprise"),
      target: t("Social Entrepreneur", "Social Entrepreneur"),
      prize: "$30K",
      status: t("Buka", "Open"),
    },
    {
      id: "3",
      name: t("BMC Student Innovation", "BMC Student Innovation"),
      target: t("Mahasiswa", "Students"),
      prize: "$15K",
      status: t("Segera", "Soon"),
    },
    {
      id: "4",
      name: t("BMC Corporate Innovation", "BMC Corporate Innovation"),
      target: t("Korporasi", "Corporations"),
      prize: "$25K",
      status: t("Buka", "Open"),
    },
  ],
  ctaText: t("Daftar Sekarang", "Register Now"),
};

// Testimonials Section
export interface TestimonialItem {
  id: string;
  quote: { id: string; en: string };
  name: string;
  role: { id: string; en: string };
  event: { id: string; en: string };
  image: string;
}

export interface TestimonialsConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  sectionLabel: t("TESTIMONI", "TESTIMONIALS"),
  sectionTitle: t("Apa Kata Klien Kami", "What Our Clients Say"),
  sectionDescription: t(
    "Dengarkan dari orang-orang luar biasa yang telah kami miliki kesempatan untuk bekerja sama",
    "Hear from the wonderful people we've had the pleasure of working with"
  ),
  testimonials: [
    {
      id: "1",
      quote: t(
        "KATH mengubah pernikahan kami menjadi dongeng. Setiap detail sempurna, dari dekor yang menakjubkan hingga koordinasi yang seamless. Mereka benar-benar memahami visi kami.",
        "KATH transformed our wedding into a fairy tale. Every detail was perfect, from the stunning décor to the seamless coordination. They truly understood our vision."
      ),
      name: "Sarah & Michael",
      role: t("Klien Pernikahan", "Wedding Clients"),
      event: t("Garden Wedding 2024", "Garden Wedding 2024"),
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      id: "2",
      quote: t(
        "Bekerja dengan KATH untuk gala korporat tahunan kami adalah pengalaman luar biasa. Profesionalisme dan kreativitas mereka melebihi ekspektasi kami.",
        "Working with KATH for our annual corporate gala was an exceptional experience. Their professionalism and creativity exceeded our expectations."
      ),
      name: "David Chen",
      role: t("CEO", "CEO"),
      event: t("Corporate Gala 2025", "Corporate Gala 2025"),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      id: "3",
      quote: t(
        "Tim KATH membawa kreativitas dan passion yang luar biasa untuk peluncuran produk kami. Mereka menciptakan pengalaman imersif yang sempurna menampilkan merek kami.",
        "The team at KATH brought such creativity and passion to our product launch. They created an immersive experience that perfectly showcased our brand."
      ),
      name: "Lisa Wong",
      role: t("Marketing Director", "Marketing Director"),
      event: t("Product Launch 2024", "Product Launch 2024"),
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
  ],
};

// Statistics Section
export interface StatisticsConfig {
  sectionLabel: { id: string; en: string };
  stats: {
    years: { value: string; label: { id: string; en: string } };
    events: { value: string; label: { id: string; en: string } };
    clients: { value: string; label: { id: string; en: string } };
    awards: { value: string; label: { id: string; en: string } };
  };
}

export const statisticsConfig: StatisticsConfig = {
  sectionLabel: t("PENCAPAIAN KAMI", "OUR ACHIEVEMENTS"),
  stats: {
    years: { value: "7+", label: t("Tahun Pengalaman", "Years Experience") },
    events: { value: "500+", label: t("Event Terlaksana", "Events Delivered") },
    clients: { value: "200+", label: t("Klien Puas", "Happy Clients") },
    awards: { value: "50+", label: t("Penghargaan", "Awards Won") },
  },
};

// FAQ Section
export interface FAQItem {
  id: string;
  question: { id: string; en: string };
  answer: { id: string; en: string };
  category: { id: string; en: string };
}

export interface FAQConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  categories: { id: string; en: string }[];
  items: FAQItem[];
}

export const faqConfig: FAQConfig = {
  sectionLabel: t("FAQ", "FAQ"),
  sectionTitle: t("Pertanyaan yang Sering Diajukan", "Frequently Asked Questions"),
  sectionDescription: t(
    "Temukan jawaban untuk pertanyaan umum tentang layanan kami",
    "Find answers to common questions about our services"
  ),
  categories: [
    t("Umum", "General"),
    t("Pernikahan", "Wedding"),
    t("Korporat", "Corporate"),
    t("Harga", "Pricing"),
  ],
  items: [
    {
      id: "1",
      question: t(
        "Seberapa jauh sebelumnya saya harus memesan layanan Anda?",
        "How far in advance should I book your services?"
      ),
      answer: t(
        "Kami merekomendasikan pemesanan minimal 6-12 bulan sebelumnya untuk pernikahan dan 3-6 bulan untuk event korporat. Namun, kami juga mengakomodasi permintaan mendadak berdasarkan ketersediaan.",
        "We recommend booking at least 6-12 months in advance for weddings and 3-6 months for corporate events. However, we do accommodate last-minute requests based on availability."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "2",
      question: t(
        "Apa yang termasuk dalam paket perencanaan pernikahan Anda?",
        "What is included in your wedding planning package?"
      ),
      answer: t(
        "Paket perencanaan pernikahan kami mencakup pemilihan venue, koordinasi vendor, desain dekor, manajemen timeline, koordinasi hari-H, dan konsultasi unlimited. Kami juga menawarkan paket kustom sesuai kebutuhan spesifik Anda.",
        "Our wedding planning package includes venue selection, vendor coordination, décor design, timeline management, on-the-day coordination, and unlimited consultations. We also offer customized packages to fit your specific needs."
      ),
      category: t("Pernikahan", "Wedding"),
    },
    {
      id: "3",
      question: t(
        "Apakah Anda menangani event korporat dari berbagai ukuran?",
        "Do you handle corporate events of all sizes?"
      ),
      answer: t(
        "Ya, kami menangani event korporat mulai dari rapat board yang intim hingga konferensi dan gala berskala besar. Tim kami dilengkapi untuk mengelola event dari berbagai ukuran dengan tingkat profesionalisme dan perhatian detail yang sama.",
        "Yes, we handle corporate events ranging from intimate board meetings to large-scale conferences and galas. Our team is equipped to manage events of any size with the same level of professionalism and attention to detail."
      ),
      category: t("Korporat", "Corporate"),
    },
    {
      id: "4",
      question: t(
        "Bagaimana Anda mengenakan biaya untuk layanan Anda?",
        "How do you charge for your services?"
      ),
      answer: t(
        "Harga kami disesuaikan untuk setiap event berdasarkan ruang lingkup, kompleksitas, dan persyaratan. Kami menawarkan harga transparan dengan proposal detail. Hubungi kami untuk konsultasi gratis dan penawaran.",
        "Our pricing is tailored to each event based on scope, complexity, and requirements. We offer transparent pricing with detailed proposals. Contact us for a free consultation and quote."
      ),
      category: t("Harga", "Pricing"),
    },
    {
      id: "5",
      question: t(
        "Bisakah Anda bekerja dengan vendor pilihan saya?",
        "Can you work with my preferred vendors?"
      ),
      answer: t(
        "Tentu saja! Kami dengan senang hati berkolaborasi dengan vendor pilihan Anda. Kami juga memiliki daftar mitra terkurasi yang dapat kami rekomendasikan berdasarkan kebutuhan dan anggaran Anda.",
        "Absolutely! We're happy to collaborate with your preferred vendors. We also have a curated list of trusted partners that we can recommend based on your needs and budget."
      ),
      category: t("Umum", "General"),
    },
    {
      id: "6",
      question: t(
        "Apakah Anda menawarkan solusi event virtual atau hybrid?",
        "Do you offer virtual or hybrid event solutions?"
      ),
      answer: t(
        "Ya, kami menawarkan solusi event virtual dan hybrid komprehensif termasuk live streaming, manajemen platform virtual, dan elemen interaktif untuk melibatkan audiens yang hadir secara fisik maupun jarak jauh.",
        "Yes, we offer comprehensive virtual and hybrid event solutions including live streaming, virtual platform management, and interactive elements to engage both in-person and remote audiences."
      ),
      category: t("Korporat", "Corporate"),
    },
  ],
};

// Contact Section
export interface ContactConfig {
  sectionLabel: { id: string; en: string };
  sectionTitle: { id: string; en: string };
  sectionDescription: { id: string; en: string };
  ctaText: { id: string; en: string };
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
  sectionLabel: t("HUBUNGI KAMI", "GET IN TOUCH"),
  sectionTitle: t("Mari Rencanakan Event Anda Bersama", "Let's Plan Your Event Together"),
  sectionDescription: t(
    "Siap menciptakan sesuatu yang luar biasa? Hubungi kami untuk mendiskusikan visi Anda dan biarkan kami mewujudkannya.",
    "Ready to create something extraordinary? Contact us to discuss your vision and let us bring it to life."
  ),
  ctaText: t("Hubungi Kami", "Contact Us"),
  contactInfo: {
    email: "hello@kathevent.com",
    phone: "+62 21 1234 5678",
    address: t(
      "Jl. Sudirman Kav. 28, Jakarta Selatan, Indonesia",
      "Jl. Sudirman Kav. 28, South Jakarta, Indonesia"
    ),
    hours: t("Sen - Jum: 09:00 - 18:00 WIB", "Mon - Fri: 9:00 AM - 6:00 PM"),
  },
  socials: {
    instagram: "https://instagram.com/kathevent",
    facebook: "https://facebook.com/kathevent",
    linkedin: "https://linkedin.com/company/kathevent",
    twitter: "https://twitter.com/kathevent",
  },
};

// Footer Section
export interface FooterContactItem {
  type: "email" | "phone";
  label: string;
  value: string;
  href: string;
}

export interface FooterSocialItem {
  platform: string;
  href: string;
}

export interface FooterConfig {
  heading: { id: string; en: string };
  description: { id: string; en: string };
  ctaText: { id: string; en: string };
  contact: FooterContactItem[];
  locationLabel: { id: string; en: string };
  address: string[];
  socialLabel: { id: string; en: string };
  socials: FooterSocialItem[];
  logoText: string;
  copyright: string;
  links: { label: { id: string; en: string }; href: string }[];
  tagline: { id: string; en: string };
}

export const footerConfig: FooterConfig = {
  heading: t(
    "Siap Menciptakan Sesuatu yang Luar Biasa?",
    "Ready to Create Something Extraordinary?"
  ),
  description: t(
    "Mari berkolaborasi untuk mewujudkan visi Anda. Hubungi kami hari ini dan mulai perjalanan Anda menuju pengalaman event yang tak terlupakan.",
    "Let's collaborate to bring your vision to life. Contact us today and start your journey towards an unforgettable event experience."
  ),
  ctaText: t("Mulai Perjalanan", "Start Your Journey"),
  contact: [
    {
      type: "email",
      label: "hello@kathevent.com",
      value: "hello@kathevent.com",
      href: "mailto:hello@kathevent.com",
    },
    {
      type: "phone",
      label: "+62 21 1234 5678",
      value: "+62 21 1234 5678",
      href: "tel:+622112345678",
    },
  ],
  locationLabel: t("Lokasi", "Location"),
  address: ["Jl. Sudirman Kav. 28", "Jakarta Selatan 12920", "Indonesia"],
  socialLabel: t("Ikuti Kami", "Follow Us"),
  socials: [
    { platform: "instagram", href: "https://instagram.com/kathevent" },
    { platform: "facebook", href: "https://facebook.com/kathevent" },
    { platform: "linkedin", href: "https://linkedin.com/company/kathevent" },
    { platform: "twitter", href: "https://twitter.com/kathevent" },
  ],
  logoText: "KATH",
  copyright: "2025 KATH Event Organizer. All rights reserved.",
  links: [
    { label: t("Kebijakan Privasi", "Privacy Policy"), href: "#" },
    { label: t("Syarat & Ketentuan", "Terms & Conditions"), href: "#" },
  ],
  tagline: t("Kindling All The Happiness", "Kindling All The Happiness"),
};

// Navigation
export interface NavItem {
  label: { id: string; en: string };
  href: string;
}

export interface NavigationConfig {
  items: NavItem[];
  ctaText: { id: string; en: string };
  logo: string;
  logoAlt: string;
}

export const navigationConfig: NavigationConfig = {
  items: [
    { label: t("Beranda", "Home"), href: "#home" },
    { label: t("Tentang", "About"), href: "#about" },
    { label: t("Layanan", "Services"), href: "#services" },
    { label: t("Portofolio", "Portfolio"), href: "#portfolio" },
    { label: t("Kompetisi", "Competition"), href: "#competition" },
    { label: t("Berita", "News"), href: "#news" },
    { label: t("Kontak", "Contact"), href: "#contact" },
  ],
  ctaText: t("Mulai", "Get Started"),
  logo: "/KATH-Logo.svg",
  logoAlt: "KATH Event Organizer Logo",
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
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
      category: t("Berita", "News"),
      date: "2025-02-10",
      author: "KATH Team",
      slug: "industry-award-2025",
    },
  ],
};
