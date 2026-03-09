import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonialsConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsConfig.testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsConfig.testimonials.length) % testimonialsConfig.testimonials.length);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const carousel = carouselRef.current;

    if (!section || !header || !carousel) return;

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

    // Carousel animation
    gsap.set(carousel, { opacity: 0, y: 40 });
    const carouselTrigger = ScrollTrigger.create({
      trigger: carousel,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(carousel, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(carouselTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!testimonialsConfig.testimonials.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-kath-black py-24 md:py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-kath-gold/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-kath-gold text-xs uppercase tracking-[0.3em]">
            {testimonialsConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-headline text-kath-white mt-4">
            {testimonialsConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-kath-off-white/60 mt-4 max-w-2xl mx-auto">
            {testimonialsConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Carousel */}
        <div ref={carouselRef} className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-kath-gold/10 rounded-full flex items-center justify-center">
            <Quote className="w-6 h-6 text-kath-gold" />
          </div>

          {/* Testimonial Cards */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonialsConfig.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="text-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-kath-gold text-kath-gold" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="font-display text-xl md:text-2xl text-kath-white leading-relaxed mb-8">
                      "{testimonial.quote[language]}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex flex-col items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-kath-gold/30 mb-4"
                      />
                      <h4 className="font-display text-lg text-kath-white">
                        {testimonial.name}
                      </h4>
                      <p className="font-body text-sm text-kath-gold">
                        {testimonial.role[language]}
                      </p>
                      <p className="font-body text-xs text-kath-off-white/50 mt-1">
                        {testimonial.event[language]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-kath-charcoal hover:border-kath-gold flex items-center justify-center transition-colors duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-kath-white" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonialsConfig.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-kath-gold'
                      : 'bg-kath-charcoal hover:bg-kath-gold/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-kath-charcoal hover:border-kath-gold flex items-center justify-center transition-colors duration-300"
            >
              <ChevronRight className="w-5 h-5 text-kath-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24 md:mt-32" />
    </section>
  );
};

export default Testimonials;
