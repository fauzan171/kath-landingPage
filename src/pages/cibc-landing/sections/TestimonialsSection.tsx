import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';

gsap.registerPlugin(ScrollTrigger);

export const TestimonialsSection = () => {
    const { language } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fitur Auto-Swipe: Geser otomatis setiap 5 detik
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % COMPETITION_DATA.testimonials.length);
        }, 5000); 
        
        // Membersihkan interval saat komponen di-unmount agar tidak bocor memori
        return () => clearInterval(timer);
    }, []);

    // GSAP untuk animasi header saat pertama kali di-scroll
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            onEnter: () => {
                gsap.fromTo('.testi-header',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
            },
            once: true,
        });

        return () => trigger.kill();
    }, []);

    // Variasi Animasi Framer Motion untuk efek Swipe
    const slideVariants = {
        enter: { x: 100, opacity: 0, scale: 0.95 },
        center: { x: 0, opacity: 1, scale: 1 },
        exit: { x: -100, opacity: 0, scale: 0.95 }
    };

    const activeTestimonial = COMPETITION_DATA.testimonials[activeIndex];

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-[#F9F8F6] relative overflow-hidden">
            <div className="container mx-auto px-6">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <span className="testi-header inline-block px-5 py-2 bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full text-[#FFB22C] font-body text-xs uppercase tracking-widest font-bold mb-6">
                        {language === 'id' ? 'Testimoni' : 'Testimonials'}
                    </span>
                    <h2 className="testi-header font-display text-4xl md:text-5xl lg:text-6xl text-[#0F0F0F] font-bold tracking-tight mb-6">
                        {language === 'id' ? 'Kata Mereka' : 'What They Say'}
                    </h2>
                </div>

                {/* Carousel Container */}
                <div className="max-w-4xl mx-auto relative min-h-[400px] md:min-h-[350px] flex items-center justify-center">
                    
                    {/* AnimatePresence menangani animasi masuk dan keluar elemen */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.6 }}
                            className="w-full absolute"
                        >
                            {/* Card Testimonial */}
                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 relative flex flex-col justify-between max-w-3xl mx-auto cursor-grab active:cursor-grabbing">
                                
                                {/* Ikon Quote Transparan */}
                                <Quote className="absolute top-10 right-10 w-16 h-16 text-[#FFB22C]/10 rotate-180 pointer-events-none" />

                                {/* Isi Kutipan */}
                                <div className="mb-10 relative z-10 text-center md:text-left">
                                    <p className="font-body text-xl md:text-2xl text-gray-600 leading-relaxed italic font-medium">
                                        "{activeTestimonial.quote[language]}"
                                    </p>
                                </div>

                                {/* Info Pengguna */}
                                <div className="flex flex-col md:flex-row items-center md:items-center gap-5 mt-auto pt-8 border-t border-gray-100">
                                    <img
                                        src={activeTestimonial.image}
                                        alt={activeTestimonial.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-[#FFB22C]/30 shadow-sm"
                                        loading="lazy"
                                    />
                                    <div className="text-center md:text-left">
                                        <h4 className="font-display text-xl text-[#0F0F0F] font-bold leading-tight">
                                            {activeTestimonial.name}
                                        </h4>
                                        <p className="font-body text-sm font-bold text-[#FFB22C] mt-1">
                                            {activeTestimonial.role}
                                        </p>
                                        <p className="font-body text-xs text-gray-400 font-medium">
                                            {activeTestimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indikator Titik (Dots) Interaktif */}
                <div className="flex justify-center gap-3 mt-12 relative z-10">
                    {COMPETITION_DATA.testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                index === activeIndex 
                                ? 'bg-[#FFB22C] w-10 shadow-md shadow-[#FFB22C]/30' 
                                : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};