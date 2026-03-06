import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { competitionConfig } from '../config';
import { Trophy, Users, Award, Clock, ArrowRight, Heart, X, Calendar, Target, Gift, CheckCircle, FileText, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Extended competition data with details
const competitionDetails: Record<string, {
  description: string;
  requirements: string[];
  timeline: { phase: string; date: string }[];
  prizes: { place: string; reward: string }[];
  rules: string[];
  contact: string;
}> = {
  "1": {
    description: "Showcase your creativity in designing the perfect wedding experience. From concept to execution, demonstrate your ability to create unforgettable moments for couples on their special day.",
    requirements: [
      "Age 18-45 years old",
      "Experience in event planning (minimum 1 year)",
      "Portfolio of at least 3 wedding events",
      "Valid ID and professional credentials"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 Maret 2025" },
      { phase: "Proposal Submission", date: "15 April 2025" },
      { phase: "Semi-Final Announcement", date: "1 Mei 2025" },
      { phase: "Final Presentation", date: "20 Mei 2025" },
      { phase: "Winner Announcement", date: "31 Mei 2025" }
    ],
    prizes: [
      { place: "1st Place", reward: "Rp 200.000.000 + Trophy + Certificate" },
      { place: "2nd Place", reward: "Rp 100.000.000 + Certificate" },
      { place: "3rd Place", reward: "Rp 50.000.000 + Certificate" },
      { place: "Best Concept", reward: "Rp 25.000.000 + Certificate" }
    ],
    rules: [
      "Original work only, plagiarism will result in disqualification",
      "All designs must be submitted in digital format (PDF/PPT)",
      "Budget proposal must be realistic and detailed",
      "Participants must attend the final presentation in person",
      "KATH Event Organizer reserves the right to use winning designs"
    ],
    contact: "competition@kathevent.com"
  },
  "2": {
    description: "Push the boundaries of event design with innovative concepts. Create stunning visual experiences that transform ordinary spaces into extraordinary environments.",
    requirements: [
      "Open to all designers (freelance or agency)",
      "Proficiency in 3D visualization software",
      "Strong portfolio showcasing creative designs",
      "Ability to present designs professionally"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 Maret 2025" },
      { phase: "Design Submission", date: "30 April 2025" },
      { phase: "Public Voting", date: "1-10 Mei 2025" },
      { phase: "Judging Panel Review", date: "11-15 Mei 2025" },
      { phase: "Winner Announcement", date: "25 Mei 2025" }
    ],
    prizes: [
      { place: "Grand Winner", reward: "Rp 150.000.000 + Featured Project" },
      { place: "Runner Up", reward: "Rp 75.000.000 + Certificate" },
      { place: "People's Choice", reward: "Rp 25.000.000 + Certificate" },
      { place: "Top 10", reward: "Certificate + Mentorship Program" }
    ],
    rules: [
      "Designs must be original and created specifically for this competition",
      "Submissions must include 3D renders and floor plans",
      "Sustainable design elements will receive bonus points",
      "Designs must be feasible within a realistic budget",
      "All submissions become property of KATH Event Organizer"
    ],
    contact: "design@kathevent.com"
  },
  "3": {
    description: "Capture the essence of events through your lens. Show your ability to document emotions, moments, and the atmosphere that makes each event unique.",
    requirements: [
      "Professional or amateur photographers",
      "Own photography equipment",
      "Portfolio of event photography",
      "Ability to work in various lighting conditions"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 April 2025" },
      { phase: "Photo Submission", date: "31 Mei 2025" },
      { phase: "Judging Period", date: "1-15 Juni 2025" },
      { phase: "Exhibition", date: "20-30 Juni 2025" },
      { phase: "Winner Announcement", date: "1 Juli 2025" }
    ],
    prizes: [
      { place: "Best in Show", reward: "Rp 100.000.000 + Professional Camera Kit" },
      { place: "Gold", reward: "Rp 50.000.000 + Lens Package" },
      { place: "Silver", reward: "Rp 25.000.000 + Lighting Kit" },
      { place: "Bronze", reward: "Rp 10.000.000 + Certificate" }
    ],
    rules: [
      "Photos must be taken within the last 2 years",
      "Minimal editing allowed (color correction only)",
      "Each participant can submit up to 5 photos",
      "Photos must be high resolution (min 3000px on longest side)",
      "Model releases required for identifiable people"
    ],
    contact: "photo@kathevent.com"
  },
  "4": {
    description: "Calling all students! This is your chance to showcase your fresh perspective and innovative ideas in event planning. Perfect platform to kickstart your career.",
    requirements: [
      "Active student (D3/S1/D4 level)",
      "Valid student ID required",
      "Team of 2-4 members allowed",
      "Faculty recommendation letter"
    ],
    timeline: [
      { phase: "Registration Open", date: "1 Maret 2025" },
      { phase: "Early Bird Deadline", date: "15 Maret 2025" },
      { phase: "Final Registration", date: "15 April 2025" },
      { phase: "Proposal Submission", date: "30 April 2025" },
      { phase: "Winner Announcement", date: "15 Mei 2025" }
    ],
    prizes: [
      { place: "Champion", reward: "Rp 50.000.000 + Internship Opportunity" },
      { place: "1st Runner Up", reward: "Rp 30.000.000 + Certificate" },
      { place: "2nd Runner Up", reward: "Rp 15.000.000 + Certificate" },
      { place: "Best Innovation", reward: "Rp 10.000.000 + Mentorship" }
    ],
    rules: [
      "All team members must be currently enrolled students",
      "Concept must be original and feasible",
      "Budget limit: Rp 500.000.000 for the event concept",
      "Must include sustainability considerations",
      "Presentation limited to 15 minutes + Q&A"
    ],
    contact: "student@kathevent.com"
  }
};

const Competition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Selected competition for detail view
  const [selectedCompetition, setSelectedCompetition] = useState<typeof competitionConfig.categories[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'prizes' | 'rules'>('overview');

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

    if (!section || !header || !mainCard || !categories) return;

    const triggers: ScrollTrigger[] = [];

    // Header animation
    gsap.set(header.children, { opacity: 0, y: 30 });
    const headerTrigger = ScrollTrigger.create({
      trigger: header,
      start: 'top 80%',
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
    gsap.set(mainCard, { opacity: 0, y: 50 });
    const mainCardTrigger = ScrollTrigger.create({
      trigger: mainCard,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(mainCard, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(mainCardTrigger);

    // Categories animation
    const categoryCards = categories.querySelectorAll('.category-card');
    gsap.set(categoryCards, { opacity: 0, y: 40 });
    const categoriesTrigger = ScrollTrigger.create({
      trigger: categories,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(categoryCards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
    if (name.includes('Wedding')) return <Heart className="w-5 h-5 text-kath-gold" />;
    if (name.includes('Design')) return <Award className="w-5 h-5 text-kath-gold" />;
    if (name.includes('Photography')) return <Trophy className="w-5 h-5 text-kath-gold" />;
    if (name.includes('Student')) return <Users className="w-5 h-5 text-kath-gold" />;
    return <Trophy className="w-5 h-5 text-kath-gold" />;
  };

  const selectedDetails = selectedCompetition ? competitionDetails[selectedCompetition.id] : null;

  return (
    <>
      <section
        ref={sectionRef}
        id="competition"
        className="relative w-full bg-kath-dark-gray py-24 md:py-32 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-kath-gold rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-kath-gold rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12 md:mb-16">
            <span className="font-body text-kath-gold text-xs uppercase tracking-[0.3em]">
              {competitionConfig.sectionLabel}
            </span>
            <h2 className="font-display text-headline text-kath-white mt-4">
              {competitionConfig.sectionTitle}
            </h2>
            <p className="font-body text-kath-off-white/60 mt-4 max-w-2xl mx-auto">
              {competitionConfig.sectionDescription}
            </p>
          </div>

          {/* Main Competition Card */}
          <div
            ref={mainCardRef}
            className="relative mb-12 p-8 md:p-12 bg-gradient-to-br from-kath-gold/20 to-kath-gold/5 border border-kath-gold/30 rounded-3xl overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-kath-gold/10 rounded-full blur-[80px]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left - Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-kath-gold" />
                  <span className="font-body text-kath-gold text-sm uppercase tracking-wider">
                    Main Competition
                  </span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl text-kath-white mb-4">
                  {competitionConfig.mainCompetition.name}
                </h3>
                <p className="font-body text-kath-off-white/70 mb-6">
                  {competitionConfig.mainCompetition.description}
                </p>
                <button
                  onClick={() => setSelectedCompetition(competitionConfig.categories[0])}
                  className="group px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  {competitionConfig.ctaText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right - Countdown */}
              <div className="flex flex-col items-center lg:items-end">
                <span className="font-body text-kath-off-white/60 text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Registration closes in
                </span>
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Mins' },
                    { value: timeLeft.seconds, label: 'Secs' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 md:w-20 md:h-20 bg-kath-black/50 border border-kath-gold/30 rounded-xl flex flex-col items-center justify-center"
                    >
                      <span className="font-display text-2xl md:text-3xl text-kath-gold">
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="font-body text-[10px] text-kath-off-white/50 uppercase">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div ref={categoriesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitionConfig.categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCompetition(category)}
                className="category-card group p-6 bg-kath-black/50 border border-kath-charcoal/50 rounded-2xl hover:border-kath-gold/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-kath-gold/10 flex items-center justify-center">
                    {getCategoryIcon(category.name)}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-body rounded-full ${
                      category.status === 'Open'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {category.status}
                  </span>
                </div>
                <h4 className="font-display text-lg text-kath-white mb-2 group-hover:text-kath-gold transition-colors">
                  {category.name}
                </h4>
                <p className="font-body text-xs text-kath-off-white/50 mb-3">
                  {category.target}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-kath-gold" />
                    <span className="font-body text-sm text-kath-gold">{category.prize}</span>
                  </div>
                  <span className="flex items-center gap-1 text-kath-off-white/40 text-xs font-body group-hover:text-kath-gold transition-colors">
                    Details
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="section-divider mt-24 md:mt-32" />
      </section>

      {/* Competition Detail Modal */}
      {selectedCompetition && selectedDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedCompetition(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-kath-black/95 backdrop-blur-lg" />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-kath-dark-gray border border-kath-charcoal/50 rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCompetition(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-kath-black/50 hover:bg-kath-gold/20 rounded-full flex items-center justify-center text-kath-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="relative p-8 md:p-12 bg-gradient-to-br from-kath-gold/20 to-kath-gold/5 border-b border-kath-charcoal/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-kath-gold/20 flex items-center justify-center">
                    {getCategoryIcon(selectedCompetition.name)}
                  </div>
                  <div>
                    <span className="font-body text-kath-gold text-sm uppercase tracking-wider">
                      Competition Details
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl text-kath-white">
                      {selectedCompetition.name}
                    </h2>
                  </div>
                </div>

                <p className="font-body text-kath-off-white/70 max-w-2xl">
                  {selectedDetails.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-kath-charcoal/30">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-kath-gold" />
                    <div>
                      <p className="text-kath-off-white/50 text-xs">Target</p>
                      <p className="text-kath-white text-sm font-body">{selectedCompetition.target}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-kath-gold" />
                    <div>
                      <p className="text-kath-off-white/50 text-xs">Total Prize</p>
                      <p className="text-kath-gold text-sm font-body">{selectedCompetition.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-kath-gold" />
                    <div>
                      <p className="text-kath-off-white/50 text-xs">Status</p>
                      <p className={`text-sm font-body ${selectedCompetition.status === 'Open' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedCompetition.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-kath-charcoal/30">
                {(['overview', 'timeline', 'prizes', 'rules'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-4 font-body text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-kath-gold border-b-2 border-kath-gold'
                        : 'text-kath-off-white/60 hover:text-kath-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8 md:p-12">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="flex items-center gap-2 font-display text-xl text-kath-white mb-4">
                        <CheckCircle className="w-5 h-5 text-kath-gold" />
                        Requirements
                      </h3>
                      <ul className="space-y-3">
                        {selectedDetails.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3 text-kath-off-white/70 font-body">
                            <span className="w-1.5 h-1.5 bg-kath-gold rounded-full mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-kath-black/50 rounded-xl border border-kath-charcoal/30">
                      <h4 className="font-display text-lg text-kath-white mb-2">Ready to Participate?</h4>
                      <p className="font-body text-kath-off-white/60 text-sm mb-4">
                        Register now and showcase your talent. Don't miss this opportunity to win amazing prizes and gain industry recognition.
                      </p>
                      <button className="px-6 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300">
                        Register Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-display text-xl text-kath-white mb-6">
                      <Calendar className="w-5 h-5 text-kath-gold" />
                      Competition Timeline
                    </h3>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-kath-charcoal/50" />

                      {/* Timeline items */}
                      <div className="space-y-6">
                        {selectedDetails.timeline.map((item, index) => (
                          <div key={index} className="relative flex gap-4">
                            <div className="relative z-10 w-4 h-4 bg-kath-gold rounded-full flex-shrink-0 mt-1" />
                            <div>
                              <p className="font-display text-kath-white">{item.phase}</p>
                              <p className="font-body text-kath-gold text-sm">{item.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Prizes Tab */}
                {activeTab === 'prizes' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-display text-xl text-kath-white mb-6">
                      <Trophy className="w-5 h-5 text-kath-gold" />
                      Prize Structure
                    </h3>
                    <div className="grid gap-4">
                      {selectedDetails.prizes.map((prize, index) => (
                        <div
                          key={index}
                          className={`p-6 rounded-xl border ${
                            index === 0
                              ? 'bg-gradient-to-r from-kath-gold/20 to-kath-gold/5 border-kath-gold/30'
                              : 'bg-kath-black/30 border-kath-charcoal/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display text-kath-white">{prize.place}</span>
                            <span className="font-body text-kath-gold">{prize.reward}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules Tab */}
                {activeTab === 'rules' && (
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 font-display text-xl text-kath-white mb-4">
                      <FileText className="w-5 h-5 text-kath-gold" />
                      Competition Rules
                    </h3>
                    <div className="space-y-4">
                      {selectedDetails.rules.map((rule, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-kath-black/30 rounded-xl">
                          <span className="w-6 h-6 bg-kath-gold/20 text-kath-gold rounded-full flex items-center justify-center text-sm font-body flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="font-body text-kath-off-white/70">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-kath-charcoal/30 bg-kath-black/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="font-body text-kath-off-white/50 text-sm">Questions?</p>
                    <p className="font-body text-kath-gold">{selectedDetails.contact}</p>
                  </div>
                  <button className="px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2">
                    Register Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Competition;
