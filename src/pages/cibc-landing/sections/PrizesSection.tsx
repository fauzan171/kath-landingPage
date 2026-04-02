import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CircleCheck, Medal, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';

gsap.registerPlugin(ScrollTrigger);

export const PrizesSection = () => {
    const { language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<'student' | 'startup' | 'corporate'>('student');
    const sectionRef = useRef<HTMLElement>(null);

    // GSAP untuk animasi scroll saat pertama kali section terlihat
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            onEnter: () => {
                gsap.fromTo('.prize-header-elem', 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
            },
            once: true,
        });
        return () => trigger.kill();
    }, []);

    // Menentukan Ikon dan Warna Medali berdasarkan urutan (2nd, 1st, 3rd)
    const getPrizeStyling = (index: number) => {
        switch (index) {
            case 0: // Juara 2 (Kiri)
                return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100', border: 'border-gray-200' };
            case 1: // Juara 1 (Tengah - Grand Prize)
                return { icon: Trophy, color: 'text-[#FFB22C]', bg: 'bg-[#FFB22C]/10', border: 'border-[#FFB22C]' };
            case 2: // Juara 3 (Kanan)
                return { icon: Award, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200/50' };
            default:
                return { icon: Trophy, color: 'text-gray-400', bg: 'bg-gray-100', border: 'border-gray-200' };
        }
    };

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-[#F9F8F6] via-white to-[#F9F8F6] relative overflow-hidden">
            {/* Ornamen Background Pemanis */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FFB22C]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="prize-header-elem inline-block px-5 py-2 bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full text-[#FFB22C] font-body text-xs uppercase tracking-widest font-bold mb-6">
                        {language === 'id' ? 'Hadiah & Penghargaan' : 'Prizes & Awards'}
                    </span>
                    <h2 className="prize-header-elem font-display text-4xl md:text-5xl lg:text-6xl text-[#0F0F0F] font-bold tracking-tight mb-6">
                        Total {COMPETITION_DATA.prizes.pool}
                    </h2>
                </div>

                {/* Category Tabs (Interactive) */}
                <div className="prize-header-elem flex justify-center mb-16 overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                        {(Object.keys(COMPETITION_DATA.prizes.categories) as Array<keyof typeof COMPETITION_DATA.prizes.categories>).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`relative px-8 py-3 rounded-full font-body text-sm font-bold transition-colors duration-300 z-10 ${
                                    activeCategory === cat ? 'text-white' : 'text-gray-500 hover:text-[#0F0F0F]'
                                }`}
                            >
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="activeTabPrize"
                                        className="absolute inset-0 bg-[#0F0F0F] rounded-full -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prize Cards Grid with Framer Motion */}
                <div className="max-w-6xl mx-auto min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
                        >
                            {COMPETITION_DATA.prizes.categories[activeCategory].map((prize, index) => {
                                const style = getPrizeStyling(index);
                                const isGrandPrize = index === 1;

                                return (
                                    <motion.div 
                                        key={index}
                                        whileHover={{ y: -15, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className={`relative p-8 lg:p-10 rounded-[2rem] bg-white border transition-all duration-300 ${style.border} ${
                                            isGrandPrize 
                                            ? 'shadow-2xl shadow-[#FFB22C]/15 z-10 md:scale-105' 
                                            : 'shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10'
                                        }`}
                                    >
                                        {isGrandPrize && (
                                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-white font-body text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-[#FFB22C]/30">
                                                Grand Prize
                                            </div>
                                        )}
                                        
                                        <div className="text-center">
                                            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${style.bg}`}>
                                                <style.icon className={`w-12 h-12 ${style.color}`} />
                                            </div>
                                            
                                            <h3 className="font-display text-2xl text-gray-500 font-medium mb-2">{prize.place}</h3>
                                            <div className="font-display text-4xl lg:text-5xl text-[#0F0F0F] font-bold mb-10">
                                                {prize.amount}
                                            </div>

                                            <div className="space-y-4">
                                                {prize.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex items-center justify-center gap-3 text-gray-600">
                                                        <CircleCheck className={`w-5 h-5 shrink-0 ${isGrandPrize ? 'text-[#FFB22C]' : 'text-gray-400'}`} />
                                                        <span className="font-body text-sm font-medium">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Additional Benefits */}
                <motion.div 
                    className="mt-24 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="font-body text-gray-500 font-medium mb-8">
                        {language === 'id' ? 'Semua finalis juga akan mendapatkan' : 'All finalists will also receive'}:
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                        {['Certificate', 'Networking Access', 'Mentorship Session', 'Media Coverage'].map((benefit) => (
                            <motion.span 
                                key={benefit} 
                                whileHover={{ scale: 1.05, backgroundColor: "#FFB22C", color: "#fff", borderColor: "#FFB22C" }}
                                className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-gray-600 font-body text-sm font-bold shadow-sm cursor-default transition-colors"
                            >
                                {benefit}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
};