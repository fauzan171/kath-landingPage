import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faqConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { language } = useLanguage();

  // Derive initial category from language, allow user to change it
  const [activeCategory, setActiveCategory] = useState<string>(() => language === 'id' ? 'Umum' : 'General');

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allLabel = language === 'id' ? 'Semua' : 'All';
  
  const filteredItems = activeCategory === allLabel
    ? faqConfig.items
    : faqConfig.items.filter((item) => item.category[language] === activeCategory);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const content = contentRef.current;

    if (!section || !header || !content) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Content animation
      gsap.fromTo(
        content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!faqConfig.items.length) return null;

  return (
    <section
      ref={sectionRef}
      id="faq"
      // Diubah kembali ke krem
      className="relative w-full bg-[#F9F8F6] py-24 md:py-32"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
            {faqConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0F0F0F] mt-4 tracking-tight">
            {faqConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto">
            {faqConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[allLabel, ...faqConfig.categories.map(c => c[language])].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 font-body text-sm rounded-full transition-all duration-300 border ${
                activeCategory === category
                  ? 'bg-[#FFB22C] border-[#FFB22C] text-[#0F0F0F] font-bold shadow-md shadow-[#FFB22C]/20'
                  // Diubah ke bg-white agar kontras dengan bg krem
                  : 'bg-white border-[#0F0F0F]/5 text-[#0F0F0F]/60 hover:text-[#0F0F0F] hover:border-[#0F0F0F]/15'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div ref={contentRef} className="space-y-4">
          {filteredItems.map((item) => {
            const isOpen = openItems.includes(item.id);
            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#FFB22C] bg-white shadow-lg shadow-[#0F0F0F]/5'
                    // Item yang tidak aktif juga menggunakan bg-white
                    : 'border-[#0F0F0F]/10 bg-white hover:border-[#0F0F0F]/20'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <span className={`font-display text-base md:text-lg pr-4 transition-colors ${
                    isOpen ? 'text-[#0F0F0F] font-bold' : 'text-[#0F0F0F] font-semibold group-hover:text-[#FFB22C]'
                  }`}>
                    {item.question[language]}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    // Sedikit disesuaikan background icon agar tidak terlalu gelap
                    isOpen ? 'bg-[#FFB22C]/10' : 'bg-[#F9F8F6] group-hover:bg-[#FFB22C]/10'
                  }`}>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#FFB22C]' : 'text-[#0F0F0F]/50 group-hover:text-[#FFB22C]'
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid grid-rows-[1fr] opacity-100' : 'grid grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pt-2 font-body text-sm md:text-base text-[#0F0F0F]/70 leading-relaxed">
                      {item.answer[language]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garis Pembatas Bawah */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 mt-24 md:mt-32">
        <div className="h-[1px] w-full bg-[#0F0F0F]/10" />
      </div>
    </section>
  );
};

export default FAQ;