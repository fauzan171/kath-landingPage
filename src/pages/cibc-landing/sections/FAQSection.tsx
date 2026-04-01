import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';

gsap.registerPlugin(ScrollTrigger);

export const FAQSection = () => {
    const { language } = useLanguage();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // Animasi GSAP saat di-scroll
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            onEnter: () => {
                gsap.fromTo('.faq-header',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
                gsap.fromTo('.faq-item',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
                );
            },
            once: true,
        });

        return () => trigger.kill();
    }, []);

    const toggleFaq = (index: number) => {
        // Jika FAQ yang diklik sudah terbuka, maka tutup. Jika belum, buka yang baru.
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Ornamen Background Pemanis */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFB22C]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="faq-header inline-block px-5 py-2 bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full text-[#FFB22C] font-body text-xs uppercase tracking-widest font-bold mb-6">
                        FAQ
                    </span>
                    <h2 className="faq-header font-display text-4xl md:text-5xl lg:text-6xl text-[#0F0F0F] font-bold tracking-tight mb-6">
                        {language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
                    </h2>
                </div>

                {/* List FAQ (Accordion) */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {COMPETITION_DATA.faqs.map((faq, index) => {
                        const isOpen = openFaq === index;

                        return (
                            <div 
                                key={index} 
                                className={`faq-item border rounded-2xl transition-all duration-300 overflow-hidden ${
                                    isOpen 
                                    ? 'bg-white border-[#FFB22C] shadow-lg shadow-[#FFB22C]/10' 
                                    : 'bg-[#F9F8F6] border-gray-200 hover:border-[#FFB22C]/50 hover:bg-white'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                                >
                                    <span className={`font-display text-lg md:text-xl font-bold pr-6 transition-colors duration-300 ${
                                        isOpen ? 'text-[#FFB22C]' : 'text-[#0F0F0F] group-hover:text-[#FFB22C]'
                                    }`}>
                                        {faq.q[language]}
                                    </span>
                                    
                                    {/* Ikon Panah Berputar */}
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                            isOpen ? 'bg-[#FFB22C] text-white' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-[#FFB22C]/50 group-hover:text-[#FFB22C]'
                                        }`}
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </button>
                                
                                {/* Isi Konten FAQ dengan Efek Slide Turun */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 md:px-8 pb-8 pt-0">
                                                <p className="font-body text-gray-600 leading-relaxed text-base md:text-lg">
                                                    {faq.a[language]}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Contact Support Banner (Simplified & Elongated) */}
                <div className="faq-header mt-16 max-w-4xl mx-auto">
                    <div className="bg-[#F9F8F6] rounded-3xl md:rounded-full p-6 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-200 shadow-sm">
                        
                        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center flex-shrink-0">
                                <MessageCircleQuestion className="w-6 h-6 text-[#FFB22C]" />
                            </div>
                            <div>
                                <h3 className="font-display text-xl font-bold text-[#0F0F0F]">
                                    {language === 'id' ? 'Masih Punya Pertanyaan?' : 'Still Have Questions?'}
                                </h3>
                                <p className="font-body text-sm text-gray-500 mt-1">
                                    {language === 'id' ? 'Tim kami siap membantu Anda kapan saja.' : 'Our team is ready to help you anytime.'}
                                </p>
                            </div>
                        </div>

                        <a 
                            href={`mailto:${COMPETITION_DATA.contact.email}`} 
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFB22C] hover:bg-[#FFA000] text-white rounded-full font-body font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FFB22C]/30 flex-shrink-0"
                        >
                            <Mail className="w-4 h-4" />
                            <span>{COMPETITION_DATA.contact.email}</span>
                        </a>
                        
                    </div>
                </div>

            </div>
        </section>
    );
};