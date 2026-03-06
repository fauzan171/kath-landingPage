import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faqConfig } from '../config';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredItems = activeCategory === 'All'
    ? faqConfig.items
    : faqConfig.items.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const content = contentRef.current;

    if (!section || !header || !content) return;

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

    // Content animation
    gsap.set(content, { opacity: 0, y: 40 });
    const contentTrigger = ScrollTrigger.create({
      trigger: content,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(contentTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  if (!faqConfig.items.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-kath-black py-24 md:py-32"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <span className="font-body text-kath-gold text-xs uppercase tracking-[0.3em]">
            {faqConfig.sectionLabel}
          </span>
          <h2 className="font-display text-headline text-kath-white mt-4">
            {faqConfig.sectionTitle}
          </h2>
          <p className="font-body text-kath-off-white/60 mt-4">
            {faqConfig.sectionDescription}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['All', ...faqConfig.categories].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 font-body text-xs rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-kath-gold text-kath-black'
                  : 'bg-kath-dark-gray text-kath-off-white/70 hover:text-kath-white'
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
                className={`border rounded-xl transition-all duration-300 ${
                  isOpen
                    ? 'border-kath-gold/50 bg-kath-dark-gray/30'
                    : 'border-kath-charcoal/50 bg-transparent'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-body text-sm md:text-base text-kath-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-kath-gold flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 pb-5 font-body text-sm text-kath-off-white/70 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24 md:mt-32" />
    </section>
  );
};

export default FAQ;
