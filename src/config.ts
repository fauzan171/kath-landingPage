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
  title: string;
  subtitle: string;
  label: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export const heroConfig: HeroConfig = {
  backgroundImage: "/hero-bg.webp",
  backgroundAlt: "Luxury Event Venue by KATH Event Organizer",
  title: "We Create\nUnforgettable\nMoments",
  subtitle: "Transforming your vision into extraordinary experiences since 2019.",
  label: "PREMIUM EVENT ORGANIZER",
  ctaPrimary: "Start Your Journey",
  ctaSecondary: "View Our Work",
};

// Narrative Text Section (About)
export interface NarrativeTextConfig {
  line1: string;
  line2: string;
  line3: string;
  stats: {
    years: string;
    events: string;
    clients: string;
    awards: string;
  };
}

export const narrativeTextConfig: NarrativeTextConfig = {
  line1: "Where Dreams Meet Execution",
  line2: "Kindling All The Happiness",
  line3: "KATH Event Organizer is a creative event agency based in Jakarta, dedicated to crafting extraordinary experiences that leave lasting impressions. Since 2019, we have been transforming visions into reality, delivering premium events with meticulous attention to detail and uncompromising quality.",
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
  title: string;
  description: string;
  rotation: number;
  category: string;
}

export interface CardStackConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  cards: CardStackItem[];
}

export const cardStackConfig: CardStackConfig = {
  sectionTitle: "Featured Events",
  sectionSubtitle: "OUR PORTFOLIO",
  cards: [
    {
      id: 1,
      image: "/card-1.webp",
      title: "Eternal Love Wedding",
      description: "A magical celebration of love with elegant floral arrangements and timeless sophistication at the Grand Ballroom.",
      rotation: -2,
      category: "Wedding",
    },
    {
      id: 2,
      image: "/card-2.webp",
      title: "Global Innovation Summit",
      description: "Corporate excellence redefined - a prestigious gathering of industry leaders with state-of-the-art production.",
      rotation: 1,
      category: "Corporate",
    },
    {
      id: 3,
      image: "/card-3.webp",
      title: "Garden of Lights Gala",
      description: "An enchanting evening under the stars, featuring a mesmerizing canopy of fairy lights and gourmet dining.",
      rotation: -1,
      category: "Private Party",
    },
  ],
};

// Breath Section (Cinematic Showcase)
export interface BreathSectionConfig {
  backgroundImage: string;
  backgroundAlt: string;
  title: string;
  subtitle: string;
  description: string;
}

export const breathSectionConfig: BreathSectionConfig = {
  backgroundImage: "/breath-bg.webp",
  backgroundAlt: "Luxury Event Venue Interior",
  title: "Excellence in Every Detail",
  subtitle: "PREMIUM EVENT EXPERIENCE",
  description: "From intimate gatherings to grand celebrations, we bring your vision to life with creativity, precision, and unparalleled elegance. Our dedicated team ensures every moment is crafted to perfection.",
};

// ZigZag Grid Section (Services)
export interface ZigZagGridItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse: boolean;
}

export interface ZigZagGridConfig {
  sectionLabel: string;
  sectionTitle: string;
  items: ZigZagGridItem[];
}

export const zigZagGridConfig: ZigZagGridConfig = {
  sectionLabel: "OUR SERVICES",
  sectionTitle: "Crafting Extraordinary Experiences",
  items: [
    {
      id: "wedding",
      title: "Wedding Planning",
      subtitle: "TIMELESS CELEBRATIONS",
      description: "From intimate ceremonies to grand receptions, we create wedding experiences that reflect your unique love story. Our comprehensive wedding planning includes venue selection, décor design, vendor coordination, and day-of management to ensure your special day is nothing short of magical.",
      image: "/wedding-event.webp",
      imageAlt: "Elegant Wedding Ceremony",
      reverse: false,
    },
    {
      id: "corporate",
      title: "Corporate Events",
      subtitle: "PROFESSIONAL EXCELLENCE",
      description: "Elevate your brand with impeccably executed corporate events. From product launches and annual meetings to gala dinners and team building activities, we deliver professional events that leave lasting impressions on your stakeholders.",
      image: "/corporate-event.webp",
      imageAlt: "Corporate Gala Dinner",
      reverse: true,
    },
    {
      id: "exhibition",
      title: "Exhibitions & Trade Shows",
      subtitle: "SHOWCASE YOUR BRAND",
      description: "Stand out from the crowd with stunning exhibition designs that captivate your audience. We create immersive brand experiences that drive engagement and deliver measurable results for your business.",
      image: "/exhibition-event.webp",
      imageAlt: "Modern Exhibition Booth",
      reverse: false,
    },
    {
      id: "private",
      title: "Private Parties",
      subtitle: "EXCLUSIVE CELEBRATIONS",
      description: "Celebrate life's special moments with style and sophistication. From milestone birthdays to anniversary celebrations, we design private parties that exceed expectations and create cherished memories.",
      image: "/private-party.webp",
      imageAlt: "Luxury Private Party",
      reverse: true,
    },
  ],
};

// Services Section
export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface ServicesConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  sectionLabel: "WHAT WE OFFER",
  sectionTitle: "Our Premium Services",
  sectionDescription: "Comprehensive event solutions tailored to your unique vision and requirements",
  services: [
    {
      id: "wedding",
      icon: "Heart",
      title: "Wedding Planning",
      description: "Full-service wedding planning from concept to execution",
      features: ["Venue Selection", "Décor Design", "Vendor Coordination", "Day-of Management"],
    },
    {
      id: "corporate",
      icon: "Building2",
      title: "Corporate Events",
      description: "Professional events that elevate your brand presence",
      features: ["Product Launches", "Annual Meetings", "Gala Dinners", "Team Building"],
    },
    {
      id: "birthday",
      icon: "Cake",
      title: "Birthday Celebrations",
      description: "Memorable birthday parties for all ages and occasions",
      features: ["Theme Design", "Entertainment", "Catering", "Photography"],
    },
    {
      id: "exhibition",
      icon: "LayoutGrid",
      title: "Exhibitions",
      description: "Stunning booth designs that captivate your audience",
      features: ["Booth Design", "Brand Activation", "Interactive Displays", "Logistics"],
    },
    {
      id: "private",
      icon: "Sparkles",
      title: "Private Parties",
      description: "Exclusive celebrations tailored to your preferences",
      features: ["Venue Styling", "Entertainment", "Gourmet Catering", "Personalized Service"],
    },
    {
      id: "virtual",
      icon: "Monitor",
      title: "Virtual & Hybrid Events",
      description: "Seamless digital experiences that connect audiences",
      features: ["Live Streaming", "Virtual Platforms", "Hybrid Solutions", "Tech Support"],
    },
  ],
};

// Portfolio Section
export interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  category: string;
  location: string;
  year: string;
}

export interface PortfolioConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  categories: string[];
  items: PortfolioItem[];
}

export const portfolioConfig: PortfolioConfig = {
  sectionLabel: "OUR WORK",
  sectionTitle: "Event Portfolio",
  sectionDescription: "Explore our collection of meticulously crafted events that showcase our creativity and expertise",
  categories: ["All", "Wedding", "Corporate", "Exhibition", "Private"],
  items: [
    {
      id: "1",
      image: "/wedding-event.webp",
      title: "Garden Romance Wedding",
      category: "Wedding",
      location: "Jakarta",
      year: "2025",
    },
    {
      id: "2",
      image: "/corporate-event.webp",
      title: "Executive Summit 2025",
      category: "Corporate",
      location: "Jakarta",
      year: "2025",
    },
    {
      id: "3",
      image: "/exhibition-event.webp",
      title: "Tech Innovation Expo",
      category: "Exhibition",
      location: "Jakarta",
      year: "2024",
    },
    {
      id: "4",
      image: "/private-party.webp",
      title: "Golden Anniversary Gala",
      category: "Private",
      location: "Bali",
      year: "2024",
    },
    {
      id: "5",
      image: "/card-1.webp",
      title: "Crystal Ballroom Wedding",
      category: "Wedding",
      location: "Jakarta",
      year: "2024",
    },
    {
      id: "6",
      image: "/card-2.webp",
      title: "Annual Awards Night",
      category: "Corporate",
      location: "Jakarta",
      year: "2025",
    },
  ],
};

// Competition Section
export interface CompetitionCategory {
  id: string;
  name: string;
  target: string;
  prize: string;
  status: string;
}

export interface CompetitionConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  mainCompetition: {
    name: string;
    deadline: string;
    description: string;
  };
  categories: CompetitionCategory[];
  ctaText: string;
}

export const competitionConfig: CompetitionConfig = {
  sectionLabel: "CREATIVE COMPETITION",
  sectionTitle: "KATH Event Competition",
  sectionDescription: "Unleash your creativity and win amazing prizes. Join our annual competition and showcase your talent in the event industry.",
  mainCompetition: {
    name: "Wedding Planner Competition 2026",
    deadline: "2025-12-31",
    description: "Design the wedding of the year and win exclusive prizes worth over Rp 500,000,000",
  },
  categories: [
    {
      id: "1",
      name: "Wedding Concept Competition",
      target: "Wedding Planners",
      prize: "Rp 200M",
      status: "Open",
    },
    {
      id: "2",
      name: "Event Design Challenge",
      target: "Designers",
      prize: "Rp 150M",
      status: "Open",
    },
    {
      id: "3",
      name: "Event Photography Contest",
      target: "Photographers",
      prize: "Rp 100M",
      status: "Coming Soon",
    },
    {
      id: "4",
      name: "Student Event Competition",
      target: "Students",
      prize: "Rp 50M",
      status: "Open",
    },
  ],
  ctaText: "Register Now",
};

// Testimonials Section
export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  event: string;
  image: string;
}

export interface TestimonialsConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  sectionLabel: "TESTIMONIALS",
  sectionTitle: "What Our Clients Say",
  sectionDescription: "Hear from the wonderful people we've had the pleasure of working with",
  testimonials: [
    {
      id: "1",
      quote: "KATH transformed our wedding into a fairy tale. Every detail was perfect, from the stunning décor to the seamless coordination. They truly understood our vision and made it come alive.",
      name: "Sarah & Michael",
      role: "Wedding Clients",
      event: "Garden Wedding 2024",
      image: "/client-1.webp",
    },
    {
      id: "2",
      quote: "Working with KATH for our annual corporate gala was an exceptional experience. Their professionalism and creativity exceeded our expectations. Our guests were thoroughly impressed.",
      name: "David Chen",
      role: "CEO",
      event: "Corporate Gala 2025",
      image: "/client-2.webp",
    },
    {
      id: "3",
      quote: "The team at KATH brought such creativity and passion to our product launch. They created an immersive experience that perfectly showcased our brand. Highly recommended!",
      name: "Lisa Wong",
      role: "Marketing Director",
      event: "Product Launch 2024",
      image: "/client-3.webp",
    },
  ],
};

// Statistics Section
export interface StatisticsConfig {
  sectionLabel: string;
  stats: {
    years: { value: string; label: string };
    events: { value: string; label: string };
    clients: { value: string; label: string };
    awards: { value: string; label: string };
  };
}

export const statisticsConfig: StatisticsConfig = {
  sectionLabel: "OUR ACHIEVEMENTS",
  stats: {
    years: { value: "7+", label: "Years Experience" },
    events: { value: "500+", label: "Events Delivered" },
    clients: { value: "200+", label: "Happy Clients" },
    awards: { value: "50+", label: "Awards Won" },
  },
};

// FAQ Section
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FAQConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  categories: string[];
  items: FAQItem[];
}

export const faqConfig: FAQConfig = {
  sectionLabel: "FAQ",
  sectionTitle: "Frequently Asked Questions",
  sectionDescription: "Find answers to common questions about our services",
  categories: ["General", "Wedding", "Corporate", "Pricing"],
  items: [
    {
      id: "1",
      question: "How far in advance should I book your services?",
      answer: "We recommend booking at least 6-12 months in advance for weddings and 3-6 months for corporate events. However, we do accommodate last-minute requests based on availability.",
      category: "General",
    },
    {
      id: "2",
      question: "What is included in your wedding planning package?",
      answer: "Our wedding planning package includes venue selection, vendor coordination, décor design, timeline management, on-the-day coordination, and unlimited consultations. We also offer customized packages to fit your specific needs.",
      category: "Wedding",
    },
    {
      id: "3",
      question: "Do you handle corporate events of all sizes?",
      answer: "Yes, we handle corporate events ranging from intimate board meetings to large-scale conferences and galas. Our team is equipped to manage events of any size with the same level of professionalism and attention to detail.",
      category: "Corporate",
    },
    {
      id: "4",
      question: "How do you charge for your services?",
      answer: "Our pricing is tailored to each event based on scope, complexity, and requirements. We offer transparent pricing with detailed proposals. Contact us for a free consultation and quote.",
      category: "Pricing",
    },
    {
      id: "5",
      question: "Can you work with my preferred vendors?",
      answer: "Absolutely! We're happy to collaborate with your preferred vendors. We also have a curated list of trusted partners that we can recommend based on your needs and budget.",
      category: "General",
    },
    {
      id: "6",
      question: "Do you offer virtual or hybrid event solutions?",
      answer: "Yes, we offer comprehensive virtual and hybrid event solutions including live streaming, virtual platform management, and interactive elements to engage both in-person and remote audiences.",
      category: "Corporate",
    },
  ],
};

// Contact Section
export interface ContactConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  ctaText: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
}

export const contactConfig: ContactConfig = {
  sectionLabel: "GET IN TOUCH",
  sectionTitle: "Let's Plan Your Next Event Together",
  sectionDescription: "Ready to create something extraordinary? Contact us to discuss your vision and let us bring it to life.",
  ctaText: "Contact Us",
  contactInfo: {
    email: "hello@kathevent.com",
    phone: "+62 21 1234 5678",
    address: "Jl. Sudirman Kav. 28, Jakarta Selatan",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM",
  },
  socials: {
    instagram: "https://instagram.com/kathevent",
    facebook: "https://facebook.com/kathevent",
    linkedin: "https://linkedin.com/company/kathevent",
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
  heading: string;
  description: string;
  ctaText: string;
  contact: FooterContactItem[];
  locationLabel: string;
  address: string[];
  socialLabel: string;
  socials: FooterSocialItem[];
  logoText: string;
  copyright: string;
  links: { label: string; href: string }[];
  tagline: string;
}

export const footerConfig: FooterConfig = {
  heading: "Ready to Create Something Extraordinary?",
  description: "Let's collaborate to bring your vision to life. Contact us today and start your journey towards an unforgettable event experience.",
  ctaText: "Start Your Journey",
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
  locationLabel: "Location",
  address: ["Jl. Sudirman Kav. 28", "Jakarta Selatan 12920", "Indonesia"],
  socialLabel: "Follow Us",
  socials: [
    { platform: "instagram", href: "https://instagram.com/kathevent" },
    { platform: "facebook", href: "https://facebook.com/kathevent" },
  ],
  logoText: "KATH",
  copyright: "2025 KATH Event Organizer. All rights reserved.",
  links: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  tagline: "Kindling All The Happiness",
};

// Navigation
export interface NavItem {
  label: string;
  href: string;
}

export interface NavigationConfig {
  items: NavItem[];
  ctaText: string;
  logo: string;
  logoAlt: string;
}

export const navigationConfig: NavigationConfig = {
  items: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Competition", href: "#competition" },
    { label: "News", href: "#news" },
    { label: "Contact", href: "#contact" },
  ],
  ctaText: "Get Started",
  logo: "/KATH-Logo.svg",
  logoAlt: "KATH Event Organizer Logo",
};

// News/Blog Section
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  slug: string;
}

export interface NewsConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  items: NewsItem[];
}

export const newsConfig: NewsConfig = {
  sectionLabel: "LATEST UPDATES",
  sectionTitle: "News & Announcements",
  sectionDescription: "Stay updated with the latest news, announcements, and competition updates from KATH Event Organizer",
  items: [
    {
      id: "1",
      title: "Wedding Planner Competition 2026 Registration Now Open",
      excerpt: "Join our prestigious Wedding Planner Competition and stand a chance to win amazing prizes worth over Rp 500,000,000.",
      content: "KATH Event Organizer proudly presents the Wedding Planner Competition 2026, a prestigious platform for aspiring wedding planners to showcase their creativity and talent. This year's competition features multiple categories including Wedding Concept Design, Event Planning, and Vendor Management. Participants will be judged by industry experts and have the opportunity to network with top professionals in the field.",
      image: "/wedding-event.webp",
      category: "Competition",
      date: "2025-03-01",
      author: "KATH Team",
      slug: "wedding-planner-competition-2026-open",
    },
    {
      id: "2",
      title: "New Event Design Category Added to Competition",
      excerpt: "We are excited to announce a brand new category for event designers with special prizes for creative excellence.",
      content: "Due to overwhelming demand, we have added a new Event Design Challenge category to our competition lineup. This category focuses on innovative event design concepts, sustainability in event planning, and the use of technology in creating immersive experiences. Winners will receive mentorship opportunities with leading event designers in Indonesia.",
      image: "/card-2.webp",
      category: "Announcement",
      date: "2025-02-28",
      author: "KATH Team",
      slug: "new-event-design-category",
    },
    {
      id: "3",
      title: "Meet Our Esteemed Judges Panel",
      excerpt: "Introducing the industry experts who will be evaluating your submissions for the KATH Event Competition.",
      content: "We are honored to introduce our panel of judges for the KATH Event Competition 2026. Our panel includes renowned wedding planners, award-winning event designers, and industry veterans with decades of combined experience. Each judge brings unique perspectives and expertise to ensure fair and comprehensive evaluation of all entries.",
      image: "/about-team.webp",
      category: "News",
      date: "2025-02-25",
      author: "KATH Team",
      slug: "judges-panel-announcement",
    },
    {
      id: "4",
      title: "Student Competition Early Bird Registration Extended",
      excerpt: "Good news for students! We have extended the early bird registration period for the Student Event Competition.",
      content: "We understand that students are busy with their academic schedules, so we have decided to extend the early bird registration for the Student Event Competition until March 15, 2025. This gives students more time to prepare their submissions and take advantage of the discounted registration fee. Don't miss this opportunity to kickstart your career in event management!",
      image: "/grid-1.webp",
      category: "Competition",
      date: "2025-02-20",
      author: "KATH Team",
      slug: "student-competition-early-bird-extended",
    },
    {
      id: "5",
      title: "Photography Contest Guidelines Released",
      excerpt: "All the details you need to know about our Event Photography Contest including themes and submission requirements.",
      content: "The complete guidelines for the Event Photography Contest are now available. This year's theme is 'Capturing Emotions in Events' - we are looking for photographs that tell stories and capture the essence of special moments. Categories include Wedding Photography, Corporate Event Photography, and Creative Event Documentation. Winners will have their work featured in our annual gallery exhibition.",
      image: "/grid-2.webp",
      category: "Competition",
      date: "2025-02-15",
      author: "KATH Team",
      slug: "photography-contest-guidelines",
    },
    {
      id: "6",
      title: "KATH Event Organizer Wins Industry Excellence Award",
      excerpt: "We are proud to announce that KATH has been recognized for outstanding contribution to the event industry.",
      content: "KATH Event Organizer is honored to receive the Industry Excellence Award 2025 from the Indonesian Event Professionals Association. This recognition is a testament to our commitment to delivering exceptional event experiences and our dedication to nurturing new talent through our annual competition. Thank you to all our clients, partners, and team members who made this possible.",
      image: "/corporate-event.webp",
      category: "News",
      date: "2025-02-10",
      author: "KATH Team",
      slug: "industry-excellence-award-2025",
    },
  ],
};
