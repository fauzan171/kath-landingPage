import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonialsConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Quote, ChevronLeft, ChevronRight, Star } from '../icons';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State baru untuk mendeteksi hover
  const { language } = useLanguage();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsConfig.testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsConfig.testimonials.length) % testimonialsConfig.testimonials.length);
  };

  // GSAP Animations (Muncul saat di-scroll)
  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const carousel = carouselRef.current;

    if (!section || !header || !carousel) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Carousel animation
      gsap.fromTo(
        carousel,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carousel,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-play carousel dengan logika Pause/Resume
  useEffect(() => {
    // Jika sedang di-hover (isPaused = true), jangan jalankan interval
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Ganti slide setiap 5 detik

    // Bersihkan interval saat komponen dibongkar atau saat status isPaused berubah
    return () => clearInterval(interval);
  }, [isPaused]); // Dependency array memastikan efek di-restart saat status isPaused berubah

  if (!testimonialsConfig.testimonials.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F9F8F6] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 md:mb-20">
          <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
            {testimonialsConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0F0F0F] mt-4 tracking-tight">
            {testimonialsConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            {testimonialsConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          ref={carouselRef} 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}   // Hentikan autoplay saat mouse masuk
          onMouseLeave={() => setIsPaused(false)}  // Lanjutkan autoplay saat mouse keluar
        >
          
          {/* Slider Window */}
          <div className="relative overflow-hidden pb-8 px-4">
            <div
              // Durasi ditambah ke 1000ms dan kurva diubah agar gesekannya sangaaat halus
              className="flex transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonialsConfig.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-2 md:px-4"
                >
                  {/* Testimonial Card - Menghapus shadow, hanya menggunakan border tipis */}
                  <div className="relative bg-white rounded-[32px] p-8 md:p-12 border border-[#0F0F0F]/10 flex flex-col items-center text-center">
                    
                    {/* Decorative Quote Icon */}
                    <div className="absolute top-6 right-8 opacity-10 pointer-events-none">
                      <Quote className="w-16 h-16 text-[#FFB22C]" fill="currentColor" />
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#FFB22C] text-[#FFB22C]" />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <blockquote className="font-display text-xl md:text-2xl text-[#0F0F0F] leading-relaxed mb-8 max-w-3xl">
                      "{testimonial.quote[language]}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-[#FFB22C]"
                      />
                      <div className="text-left">
                        <h4 className="font-display text-lg font-semibold text-[#0F0F0F]">
                          {testimonial.name}
                        </h4>
                        <p className="font-body text-sm font-medium text-[#FFB22C]">
                          {testimonial.role[language]}
                        </p>
                        <p className="font-body text-xs text-[#0F0F0F]/40 mt-0.5">
                          {testimonial.event[language]}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-[#0F0F0F]/10 hover:border-[#FFB22C] hover:bg-[#FFB22C] group flex items-center justify-center transition-all duration-300 bg-transparent hover:shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-[#0F0F0F] group-hover:text-white transition-colors" />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {testimonialsConfig.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    index === currentIndex
                      ? 'w-8 bg-[#FFB22C]'
                      : 'w-2 bg-[#0F0F0F]/15 hover:bg-[#0F0F0F]/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-[#0F0F0F]/10 hover:border-[#FFB22C] hover:bg-[#FFB22C] group flex items-center justify-center transition-all duration-300 bg-transparent hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-[#0F0F0F] group-hover:text-white transition-colors" />
            </button>
          </div>

        </div>
      </div>

      {/* Garis Pembatas Bawah */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-24">
        <div className="h-[1px] w-full bg-[#0F0F0F]/10" />
      </div>
    </section>
  );
};

export default Testimonials;