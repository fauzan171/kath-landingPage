import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Trophy,
  Users,
  Award,
  Clock,
  ArrowRight,
  Heart,
  ChevronLeft,
  Medal,
  Sparkles,
  Gift,
  CheckCircle,
  FileText,
  Download,
  Share2,
  Mail,
  Phone,
  Star,
  Target,
  Calendar
} from 'lucide-react';
import { competitionConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import CompetitionForm from '../components/CompetitionForm';

gsap.registerPlugin(ScrollTrigger);

// Extended competition data with details
const competitionDetails: Record<string, {
  description: string;
  longDescription: string;
  requirements: string[];
  timeline: { phase: string; date: string }[];
  prizes: { place: string; reward: string; description?: string }[];
  rules: string[];
  contact: string;
  benefits: string[];
  judges: { name: string; role: string; image: string }[];
  faqs: { question: string; answer: string }[];
}> = {
  "1": {
    description: "Showcase your creativity in designing the perfect wedding experience. From concept to execution, demonstrate your ability to create unforgettable moments for couples on their special day.",
    longDescription: "The Wedding Concept Competition is our flagship event that brings together the most talented wedding planners and designers in Indonesia. This competition challenges participants to create a complete wedding concept from theme development to execution plan. Participants will be evaluated on creativity, feasibility, budget management, and attention to detail. The winning concept will be featured in our annual Wedding Expo and the winner will receive a mentorship opportunity with our senior wedding planners.",
    requirements: [
      "Age 18-45 years old",
      "Experience in event planning (minimum 1 year)",
      "Portfolio of at least 3 wedding events",
      "Valid ID and professional credentials",
      "Ability to present in Bahasa Indonesia or English",
      "Commitment to attend all competition phases"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 Maret 2025" },
      { phase: "Early Bird Deadline", date: "31 Maret 2025" },
      { phase: "Final Registration", date: "15 April 2025" },
      { phase: "Proposal Submission", date: "30 April 2025" },
      { phase: "Semi-Final Announcement", date: "15 Mei 2025" },
      { phase: "Semi-Final Workshop", date: "20 Mei 2025" },
      { phase: "Final Presentation", date: "10 Juni 2025" },
      { phase: "Winner Announcement", date: "20 Juni 2025" }
    ],
    prizes: [
      { place: "Grand Champion", reward: "Rp 200.000.000", description: "Cash prize + Trophy + Certificate + 1-year mentorship program" },
      { place: "1st Runner Up", reward: "Rp 100.000.000", description: "Cash prize + Certificate + 6-month mentorship program" },
      { place: "2nd Runner Up", reward: "Rp 50.000.000", description: "Cash prize + Certificate + 3-month mentorship program" },
      { place: "Best Concept", reward: "Rp 25.000.000", description: "Cash prize + Certificate + Featured in Wedding Expo 2026" },
      { place: "People's Choice", reward: "Rp 15.000.000", description: "Cash prize + Certificate based on public voting" }
    ],
    rules: [
      "Original work only, plagiarism will result in immediate disqualification",
      "All designs must be submitted in digital format (PDF/PPT) and printed A3",
      "Budget proposal must be realistic and detailed (range: Rp 300M - Rp 800M)",
      "Participants must attend the final presentation in person at Jakarta",
      "KATH Event Organizer reserves the right to use winning designs with credit",
      "All submission materials become property of the competition",
      "Participants must follow the ethical guidelines provided",
      "Late submissions will not be accepted under any circumstances"
    ],
    contact: "wedding@kathevent.com",
    benefits: [
      "Networking with industry professionals and potential clients",
      "Portfolio review and feedback from expert judges",
      "Media exposure through our official channels",
      "Access to exclusive workshop and training sessions",
      "Certificate of participation for all finalists",
      "Opportunity to collaborate with KATH Event Organizer"
    ],
    judges: [
      { name: "Sarah Wijaya", role: "Creative Director, KATH EO", image: "/client-1.webp" },
      { name: "Michael Tan", role: "Award-Winning Wedding Planner", image: "/client-2.webp" },
      { name: "Diana Kusuma", role: "Editor-in-Chief, Wedding Magazine", image: "/client-3.webp" }
    ],
    faqs: [
      { question: "Can I participate as a team?", answer: "Yes, teams of up to 3 members are allowed. All members must be registered." },
      { question: "Is there a registration fee?", answer: "Early bird: Rp 500,000. Regular: Rp 750,000 per participant/team." },
      { question: "What format should the proposal be in?", answer: "Digital PDF (max 50MB) and printed A3 board for final presentation." }
    ]
  },
  "2": {
    description: "Push the boundaries of event design with innovative concepts. Create stunning visual experiences that transform ordinary spaces into extraordinary environments.",
    longDescription: "The Event Design Challenge calls for creative minds to reimagine event spaces. This competition focuses on innovative use of space, lighting, materials, and technology to create immersive experiences. Whether it's a corporate gala, product launch, or social event, participants must demonstrate their ability to transform venues into memorable destinations. Sustainable design practices will receive additional consideration.",
    requirements: [
      "Open to all designers (freelance or agency)",
      "Proficiency in 3D visualization software (SketchUp, 3ds Max, Blender)",
      "Strong portfolio showcasing at least 5 creative designs",
      "Ability to present designs professionally in English",
      "Understanding of event production and logistics",
      "Commitment to sustainable design principles preferred"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 Maret 2025" },
      { phase: "Design Brief Release", date: "15 Maret 2025" },
      { phase: "Registration Deadline", date: "30 April 2025" },
      { phase: "Design Submission", date: "31 Mei 2025" },
      { phase: "Public Voting", date: "1-15 Juni 2025" },
      { phase: "Judging Panel Review", date: "16-30 Juni 2025" },
      { phase: "Winner Announcement", date: "10 Juli 2025" }
    ],
    prizes: [
      { place: "Grand Winner", reward: "Rp 150.000.000", description: "Cash prize + Featured Project Implementation + Professional Camera Kit" },
      { place: "Runner Up", reward: "Rp 75.000.000", description: "Cash prize + Certificate + Design Software License" },
      { place: "People's Choice", reward: "Rp 25.000.000", description: "Cash prize + Certificate based on public voting" },
      { place: "Best Sustainable Design", reward: "Rp 20.000.000", description: "Special category for eco-friendly designs" },
      { place: "Top 10 Finalists", reward: "Certificate + Mentorship Program", description: "All finalists receive recognition and career support" }
    ],
    rules: [
      "Designs must be original and created specifically for this competition",
      "Submissions must include 3D renders, floor plans, and material specifications",
      "Sustainable design elements will receive bonus points",
      "Designs must be feasible within a realistic budget (max Rp 500M)",
      "All submissions become property of KATH Event Organizer with designer credit",
      "Participants must use the provided venue specifications",
      "Design presentation must not exceed 20 minutes",
      "Use of AI-generated content must be disclosed"
    ],
    contact: "design@kathevent.com",
    benefits: [
      "Chance to see your design come to life in a real event",
      "Portfolio feature on KATH website and social media",
      "Professional photography of your design concept",
      "Networking with venue partners and suppliers",
      "Access to industry software discounts",
      "Invitation to exclusive design community events"
    ],
    judges: [
      { name: "Andi Lim", role: "Principal Designer, Lim Studio", image: "/client-1.webp" },
      { name: "Rina Susanti", role: "Creative Head, Decor Indonesia", image: "/client-2.webp" },
      { name: "David Chen", role: "Lighting Design Expert", image: "/client-3.webp" }
    ],
    faqs: [
      { question: "What software can I use?", answer: "Any 3D software is acceptable. Most common are SketchUp, 3ds Max, Blender, and Cinema 4D." },
      { question: "Do I need to specify actual vendors?", answer: "Yes, your design must include realistic vendor specifications and pricing." },
      { question: "Can I submit multiple designs?", answer: "Each participant/team can submit up to 2 different design concepts." }
    ]
  },
  "3": {
    description: "Capture the essence of events through your lens. Show your ability to document emotions, moments, and the atmosphere that makes each event unique.",
    longDescription: "The Event Photography Contest celebrates the art of capturing fleeting moments. We're looking for photographers who can tell stories through their images - documenting not just what happened, but how it felt. From the nervous excitement before a wedding ceremony to the joy of a product launch, your photos should transport viewers into the heart of the event.",
    requirements: [
      "Professional or amateur photographers welcome",
      "Own professional photography equipment",
      "Portfolio of at least 10 event photographs",
      "Ability to deliver high-resolution RAW files if requested",
      "Understanding of event photography etiquette",
      "Willingness to sign usage rights agreement"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 April 2025" },
      { phase: "Theme Announcement", date: "15 April 2025" },
      { phase: "Registration Deadline", date: "31 Mei 2025" },
      { phase: "Photo Submission", date: "30 Juni 2025" },
      { phase: "Judging Period", date: "1-31 Juli 2025" },
      { phase: "Online Exhibition", date: "1-15 Agustus 2025" },
      { phase: "Winner Announcement", date: "20 Agustus 2025" }
    ],
    prizes: [
      { place: "Best in Show", reward: "Rp 100.000.000", description: "Cash prize + Sony A7 IV Camera Kit + Tamron 28-75mm Lens" },
      { place: "Gold Award", reward: "Rp 50.000.000", description: "Cash prize + Godox Lighting Kit + Certificate" },
      { place: "Silver Award", reward: "Rp 25.000.000", description: "Cash prize + Camera Accessories Bundle + Certificate" },
      { place: "Bronze Award", reward: "Rp 10.000.000", description: "Cash prize + Certificate" },
      { place: "Honorable Mentions (3)", reward: "Certificate + Featured Exhibition", description: "Recognition for exceptional work" }
    ],
    rules: [
      "Photos must be taken within the last 2 years (after January 2023)",
      "Minimal editing allowed (color correction, cropping only)",
      "Each participant can submit up to 5 photos",
      "Photos must be high resolution (min 3000px on longest side, 300dpi)",
      "Model releases required for identifiable people",
      "Photos must not contain watermarks or signatures",
      "AI-generated or heavily manipulated images are prohibited",
      "Submission includes brief description of each photo (max 100 words)"
    ],
    contact: "photo@kathevent.com",
    benefits: [
      "Professional printing of winning photos for exhibition",
      "Feature interview on KATH blog and social media",
      "Portfolio review by professional photographers",
      "Invitation to exclusive photography workshops",
      "Potential for future event photography assignments",
      "Certificate of achievement for all participants"
    ],
    judges: [
      { name: "Budi Hartono", role: "Award-Winning Event Photographer", image: "/client-1.webp" },
      { name: "Lisa Anggraini", role: "Editor, Photography Indonesia", image: "/client-2.webp" },
      { name: "James Wilson", role: "International Wedding Photographer", image: "/client-3.webp" }
    ],
    faqs: [
      { question: "Can I submit photos taken at any event?", answer: "Yes, any event type is acceptable as long as it meets the theme." },
      { question: "What file format is required?", answer: "Submit JPG for entry. RAW files may be requested for verification." },
      { question: "Do I retain copyright?", answer: "Yes, you retain copyright but grant KATH usage rights for promotion." }
    ]
  },
  "4": {
    description: "Calling all students! This is your chance to showcase your fresh perspective and innovative ideas in event planning. Perfect platform to kickstart your career.",
    longDescription: "The Student Event Competition is designed specifically for aspiring event professionals currently enrolled in educational institutions. This competition provides a platform for students to apply their classroom knowledge to real-world scenarios. Participants will develop a complete event proposal, from concept to execution plan, demonstrating creativity, budgeting skills, and project management abilities.",
    requirements: [
      "Active student (D3/S1/D4 level, any major)",
      "Valid student ID required (min. 6 months validity)",
      "Team of 2-4 members allowed",
      "Faculty recommendation letter required",
      "GPA minimum 2.75 (for individual applicants)",
      "Commitment to attend virtual and in-person sessions"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 Maret 2025" },
      { phase: "Early Bird Deadline", date: "15 Maret 2025" },
      { phase: "Final Registration", date: "15 April 2025" },
      { phase: "Workshop Session", date: "25 April 2025" },
      { phase: "Proposal Submission", date: "15 Mei 2025" },
      { phase: "Semi-Final Presentation", date: "1 Juni 2025" },
      { phase: "Final Presentation", date: "20 Juni 2025" },
      { phase: "Winner Announcement", date: "30 Juni 2025" }
    ],
    prizes: [
      { place: "Champion", reward: "Rp 50.000.000", description: "Cash prize + Internship Opportunity at KATH + Certificate" },
      { place: "1st Runner Up", reward: "Rp 30.000.000", description: "Cash prize + Mentorship Program + Certificate" },
      { place: "2nd Runner Up", reward: "Rp 15.000.000", description: "Cash prize + Certificate" },
      { place: "Best Innovation", reward: "Rp 10.000.000", description: "Special award for most creative concept" },
      { place: "Best Presentation", reward: "Rp 5.000.000", description: "Award for outstanding presentation skills" }
    ],
    rules: [
      "All team members must be currently enrolled students",
      "Concept must be original and feasible within budget",
      "Budget limit: Rp 500.000.000 for the event concept",
      "Must include sustainability considerations in proposal",
      "Presentation limited to 15 minutes + 10 minutes Q&A",
      "Props and visual aids allowed for final presentation",
      "Academic integrity must be maintained throughout",
      "Participants cannot join multiple teams"
    ],
    contact: "student@kathevent.com",
    benefits: [
      "Free workshop on event planning fundamentals",
      "Certificate of participation for all teams",
      " networking session with industry professionals",
      "Priority consideration for KATH internship programs",
      "Academic portfolio enhancement opportunity",
      "Access to exclusive student community"
    ],
    judges: [
      { name: "Prof. Dr. Ahmad Surya", role: "Head of Event Management Dept", image: "/client-1.webp" },
      { name: "Maya Wulandari", role: "HR Director, KATH EO", image: "/client-2.webp" },
      { name: "Kevin Lim", role: "Event Industry Consultant", image: "/client-3.webp" }
    ],
    faqs: [
      { question: "Can different majors form a team?", answer: "Yes! Cross-disciplinary teams are encouraged." },
      { question: "Is there student discount for registration?", answer: "Yes, student rate is Rp 200,000 per team (early bird Rp 150,000)." },
      { question: "Will this help my career?", answer: "Absolutely! Past participants have secured jobs at top event companies." }
    ]
  }
};

interface CompetitionDetailProps {
  competitionId: string;
  onBack: () => void;
}

const CompetitionDetail = ({ competitionId, onBack }: CompetitionDetailProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'prizes' | 'rules' | 'faq'>('overview');
  const { language } = useLanguage();

  const competition = competitionConfig.categories.find(c => c.id === competitionId);
  const details = competitionDetails[competitionId];

  useEffect(() => {
    if (!sectionRef.current || !heroRef.current) return;

    // Hero animation
    gsap.fromTo(
      heroRef.current.querySelectorAll('.animate-item'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );

    // Scroll animations
    const sections = sectionRef.current.querySelectorAll('.scroll-section');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  if (!competition || !details) return null;

  const getCategoryIcon = () => {
    const name = competition.name[language];
    if (name.includes('Wedding') || name.includes('Startup')) return <Heart className="w-6 h-6" />;
    if (name.includes('Design') || name.includes('Social')) return <Sparkles className="w-6 h-6" />;
    if (name.includes('Photography') || name.includes('Student')) return <Award className="w-6 h-6" />;
    return <Users className="w-6 h-6" />;
  };

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-kath-black">
      <CompetitionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        competitionName={competition.name[language]}
      />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-kath-black/90 backdrop-blur-lg border-b border-kath-charcoal/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-kath-off-white hover:text-kath-gold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-body text-sm">Kembali</span>
            </button>
            <span className="font-display text-kath-gold text-lg">KATH Competition</span>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-2 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm rounded-full transition-colors"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center pt-24 pb-16 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kath-gold/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kath-gold/3 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="animate-item flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-kath-gold/20 flex items-center justify-center text-kath-gold">
                  {getCategoryIcon()}
                </div>
                <span className="font-body text-kath-gold text-sm uppercase tracking-wider">
                  Kompetisi Kategori
                </span>
              </div>

              <h1 className="animate-item font-display text-4xl md:text-5xl lg:text-6xl text-kath-white mb-6 leading-tight">
                {competition.name[language]}
              </h1>

              <p className="animate-item font-body text-kath-off-white/70 text-lg mb-8 leading-relaxed">
                {details.description}
              </p>

              <div className="animate-item flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-kath-dark-gray/50 rounded-full border border-kath-charcoal/30">
                  <Trophy className="w-4 h-4 text-kath-gold" />
                  <span className="font-body text-kath-white text-sm">{competition.prize}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-kath-dark-gray/50 rounded-full border border-kath-charcoal/30">
                  <Target className="w-4 h-4 text-kath-gold" />
                  <span className="font-body text-kath-white text-sm">{competition.target[language]}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                  competition.status[language] === (language === 'id' ? 'Buka' : 'Open')
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-body text-sm">{competition.status[language]}</span>
                </div>
              </div>

              <div className="animate-item flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="group px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border border-kath-charcoal/50 hover:border-kath-gold/50 text-kath-white font-body uppercase tracking-wider rounded-full transition-all duration-300"
                >
                  Lihat Detail
                </button>
              </div>
            </div>

            {/* Right Content - Quick Stats */}
            <div className="animate-item">
              <div className="relative p-8 bg-kath-dark-gray/50 border border-kath-charcoal/30 rounded-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-kath-gold/10 rounded-full blur-[60px]" />

                <h3 className="font-display text-xl text-kath-white mb-6">Informasi Lomba</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-kath-black/30 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-kath-gold/20 flex items-center justify-center">
                      <Medal className="w-5 h-5 text-kath-gold" />
                    </div>
                    <div>
                      <p className="font-body text-kath-off-white/50 text-xs">{language === 'id' ? 'Total Hadiah' : 'Total Prize'}</p>
                      <p className="font-display text-kath-gold">{competition.prize}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-kath-black/30 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-kath-gold/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-kath-gold" />
                    </div>
                    <div>
                      <p className="font-body text-kath-off-white/50 text-xs">{language === 'id' ? 'Target Peserta' : 'Target Participants'}</p>
                      <p className="font-display text-kath-white">{competition.target[language]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-kath-black/30 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-kath-gold/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-kath-gold" />
                    </div>
                    <div>
                      <p className="font-body text-kath-off-white/50 text-xs">Status</p>
                      <p className={`font-display ${competition.status[language] === (language === 'id' ? 'Buka' : 'Open') ? 'text-green-400' : 'text-yellow-400'}`}>
                        {competition.status[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-kath-black/30 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-kath-gold/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-kath-gold" />
                    </div>
                    <div>
                      <p className="font-body text-kath-off-white/50 text-xs">Kontak</p>
                      <p className="font-body text-kath-white text-sm">{details.contact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="details" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Tabs */}
          <div className="scroll-section flex flex-wrap gap-2 mb-8 border-b border-kath-charcoal/30 pb-4">
            {(['overview', 'timeline', 'prizes', 'rules', 'faq'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-body text-sm capitalize rounded-full transition-all ${
                  activeTab === tab
                    ? 'bg-kath-gold text-kath-black'
                    : 'text-kath-off-white/60 hover:text-kath-white hover:bg-kath-charcoal/30'
                }`}
              >
                {tab === 'faq' ? 'FAQ' : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="scroll-section min-h-[400px]">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="p-8 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-2xl">
                    <h2 className="font-display text-2xl text-kath-white mb-4">Tentang Kompetisi</h2>
                    <p className="font-body text-kath-off-white/70 leading-relaxed">
                      {details.longDescription}
                    </p>
                  </div>

                  <div className="p-8 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-2xl">
                    <h2 className="flex items-center gap-3 font-display text-2xl text-kath-white mb-6">
                      <CheckCircle className="w-6 h-6 text-kath-gold" />
                      Persyaratan
                    </h2>
                    <ul className="space-y-3">
                      {details.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3 text-kath-off-white/70 font-body">
                          <span className="w-6 h-6 bg-kath-gold/20 text-kath-gold rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-2xl">
                    <h2 className="flex items-center gap-3 font-display text-2xl text-kath-white mb-6">
                      <Star className="w-6 h-6 text-kath-gold" />
                      Benefits
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {details.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-kath-gold flex-shrink-0 mt-0.5" />
                          <span className="font-body text-kath-off-white/70 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-kath-gold/20 to-kath-gold/5 border border-kath-gold/30 rounded-2xl">
                    <h3 className="font-display text-xl text-kath-white mb-4">Siap Berpartisipasi?</h3>
                    <p className="font-body text-kath-off-white/60 text-sm mb-6">
                      Daftar sekarang dan jadilah bagian dari kompetisi prestisius ini!
                    </p>
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="w-full py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body rounded-full transition-colors"
                    >
                      Daftar Sekarang
                    </button>
                  </div>

                  <div className="p-6 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-2xl">
                    <h3 className="font-display text-lg text-kath-white mb-4">Dewan Juri</h3>
                    <div className="space-y-4">
                      {details.judges.map((judge, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-kath-charcoal/50 overflow-hidden">
                            <img src={judge.image} alt={judge.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-body text-kath-white text-sm">{judge.name}</p>
                            <p className="font-body text-kath-off-white/50 text-xs">{judge.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-2xl">
                    <h3 className="font-display text-lg text-kath-white mb-4">Bagikan</h3>
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-kath-charcoal/50 flex items-center justify-center text-kath-off-white hover:text-kath-gold hover:bg-kath-charcoal transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-kath-charcoal/50 flex items-center justify-center text-kath-off-white hover:text-kath-gold hover:bg-kath-charcoal transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="max-w-3xl">
                <h2 className="flex items-center gap-3 font-display text-2xl text-kath-white mb-8">
                  <Calendar className="w-6 h-6 text-kath-gold" />
                  Timeline Kompetisi
                </h2>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-kath-charcoal/50" />
                  <div className="space-y-6">
                    {details.timeline.map((item, index) => (
                      <div key={index} className="relative flex gap-6">
                        <div className="relative z-10 w-12 h-12 bg-kath-dark-gray border-2 border-kath-gold rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-body text-kath-gold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 p-6 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-xl">
                          <p className="font-display text-kath-white text-lg">{item.phase}</p>
                          <p className="font-body text-kath-gold">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Prizes Tab */}
            {activeTab === 'prizes' && (
              <div>
                <h2 className="flex items-center gap-3 font-display text-2xl text-kath-white mb-8">
                  <Gift className="w-6 h-6 text-kath-gold" />
                  Struktur Hadiah
                </h2>
                <div className="grid gap-4 max-w-4xl">
                  {details.prizes.map((prize, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl border ${
                        index === 0
                          ? 'bg-gradient-to-r from-kath-gold/20 to-kath-gold/5 border-kath-gold/50'
                          : 'bg-kath-dark-gray/30 border-kath-charcoal/30'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            index === 0 ? 'bg-kath-gold/30' : 'bg-kath-charcoal/50'
                          }`}>
                            <Trophy className={`w-6 h-6 ${index === 0 ? 'text-kath-gold' : 'text-kath-off-white'}`} />
                          </div>
                          <div>
                            <p className="font-display text-kath-white text-lg">{prize.place}</p>
                            {prize.description && (
                              <p className="font-body text-kath-off-white/50 text-sm">{prize.description}</p>
                            )}
                          </div>
                        </div>
                        <p className="font-display text-kath-gold text-xl">{prize.reward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
              <div className="max-w-4xl">
                <h2 className="flex items-center gap-3 font-display text-2xl text-kath-white mb-8">
                  <FileText className="w-6 h-6 text-kath-gold" />
                  Peraturan Kompetisi
                </h2>
                <div className="grid gap-4">
                  {details.rules.map((rule, index) => (
                    <div key={index} className="flex gap-4 p-6 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-xl">
                      <span className="w-8 h-8 bg-kath-gold/20 text-kath-gold rounded-lg flex items-center justify-center text-sm font-body flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="font-body text-kath-off-white/70">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="max-w-3xl">
                <h2 className="flex items-center gap-3 font-display text-2xl text-kath-white mb-8">
                  <Users className="w-6 h-6 text-kath-gold" />
                  Pertanyaan Umum
                </h2>
                <div className="space-y-4">
                  {details.faqs.map((faq, index) => (
                    <div key={index} className="p-6 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-xl">
                      <h3 className="font-display text-kath-white mb-2">{faq.question}</h3>
                      <p className="font-body text-kath-off-white/60">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-t from-kath-dark-gray/50 to-transparent">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <div className="scroll-section p-8 md:p-12 bg-kath-dark-gray/50 border border-kath-charcoal/30 rounded-3xl">
            <h2 className="font-display text-3xl md:text-4xl text-kath-white mb-4">
              Siap Untuk Berkompetisi?
            </h2>
            <p className="font-body text-kath-off-white/60 mb-8 max-w-xl mx-auto">
              Jangan lewatkan kesempatan untuk menunjukkan bakat Anda dan memenangkan hadiah menarik!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setIsFormOpen(true)}
                className="group px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
              >
                Daftar Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onBack}
                className="px-8 py-4 border border-kath-charcoal/50 hover:border-kath-gold/50 text-kath-white font-body uppercase tracking-wider rounded-full transition-all duration-300"
              >
                Lihat Kompetisi Lain
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-8 border-t border-kath-charcoal/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-kath-off-white/50">
                <Mail className="w-4 h-4" />
                <span className="font-body text-sm">{details.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-kath-off-white/50">
                <Phone className="w-4 h-4" />
                <span className="font-body text-sm">+62 21 1234 5678</span>
              </div>
            </div>
            <p className="font-body text-kath-off-white/30 text-sm">
              © 2025 KATH Event Organizer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompetitionDetail;
