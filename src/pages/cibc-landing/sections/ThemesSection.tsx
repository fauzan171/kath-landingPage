import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Lightbulb, Code } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';

gsap.registerPlugin(ScrollTrigger);

export const ThemesSection = () => {
    const { language } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const cardsWrapperRef = useRef<HTMLDivElement>(null);

    const themeIcons = [Rocket, Lightbulb, Code];

    useEffect(() => {
        const section = sectionRef.current;
        const stickyContent = stickyRef.current;
        const cardsWrapper = cardsWrapperRef.current;
        
        if (!section || !stickyContent || !cardsWrapper) return;

        // --- 1. Animasi Masuk Awal ---
        const enterTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 70%',
            onEnter: () => {
                // Animasikan judul
                gsap.fromTo('.theme-header-elem', 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
                
                // Animasikan kartu muncul
                gsap.fromTo('.theme-card', 
                    { opacity: 0, x: 50 }, 
                    { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
                );
            },
            once: true,
        });

        // --- 2. Efek Parallax/Stacking pada Kartu (Sticky Progression) ---
        // Kita menggunakan ScrollTrigger murni untuk mendeteksi progress
        const cards = gsap.utils.toArray('.theme-card') as HTMLElement[];
        
        cards.forEach((card, i) => {
            // Kita atur agar kartu sedikit memudar saat kartu berikutnya menutupi
            ScrollTrigger.create({
                trigger: card,
                start: 'top 50%', // Ketika bagian atas kartu mencapai tengah layar
                end: 'bottom 20%', // Ketika bagian bawah kartu mau hilang
                scrub: true,
                animation: gsap.fromTo(card, 
                    { scale: 1, opacity: 1 }, 
                    // Jika ini bukan kartu terakhir, buat dia sedikit mengecil dan memudar saat di-scroll lewat
                    { scale: i === cards.length - 1 ? 1 : 0.95, opacity: i === cards.length - 1 ? 1 : 0.4, ease: "none" }
                )
            });
        });

        return () => {
            enterTrigger.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-[#F9F8F6] overflow-visible">
            <div className="container mx-auto px-6 max-w-7xl">
                
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
                    
                    {/* BAGIAN KIRI: Sticky Header */}
                    {/* Menggunakan position sticky CSS standar untuk performa terbaik */}
                    <div ref={stickyRef} className="lg:w-1/3 lg:sticky lg:top-32 self-start flex flex-col pt-4">
                        <span className="theme-header-elem inline-block self-start px-5 py-2 bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full text-[#FFB22C] font-body text-xs uppercase tracking-widest font-bold mb-6">
                            {language === 'id' ? 'Tema & Topik' : 'Themes & Topics'}
                        </span>
                        <h2 className="theme-header-elem font-display text-4xl md:text-5xl lg:text-6xl text-[#0F0F0F] font-bold leading-[1.15] tracking-tight mb-6">
                            {language === 'id' ? 'Fokus Kompetisi' : 'Competition Focus'}
                        </h2>
                        <p className="theme-header-elem font-body text-lg text-gray-600 leading-relaxed">
                            {language === 'id'
                                ? 'Pilih salah satu dari tiga sub-tema utama yang paling sesuai dengan solusi bisnismu.'
                                : 'Choose one of the three main sub-themes that best fits your business solution.'}
                        </p>
                    </div>

                    {/* BAGIAN KANAN: Scrolling Cards */}
                    <div ref={cardsWrapperRef} className="lg:w-2/3 flex flex-col gap-8 md:gap-12">
                        {COMPETITION_DATA.themes.map((theme, index) => {
                            const Icon = themeIcons[index % themeIcons.length];
                            return (
                                <div 
                                    key={index} 
                                    className="theme-card relative bg-white border border-gray-100 p-8 md:p-10 rounded-[2rem] shadow-xl shadow-black/5 hover:border-gray-200 transition-colors duration-300 transform-gpu"
                                >
                                    <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#FFB22C]/10 flex items-center justify-center">
                                            <Icon className="w-8 h-8 text-[#FFB22C]" />
                                        </div>
                                        <h3 className="font-display text-2xl md:text-3xl text-[#0F0F0F] font-bold">{theme.title[language]}</h3>
                                    </div>
                                    
                                    <p className="font-body text-lg text-gray-600 mb-8 leading-relaxed">
                                        {theme.desc[language]}
                                    </p>
                                    
                                    <div>
                                        <h4 className="font-body text-sm text-gray-400 uppercase tracking-wider font-bold mb-4">
                                            {language === 'id' ? 'Topik Bahasan:' : 'Focus Areas:'}
                                        </h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {theme.topics[language].map((topic, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5 border border-gray-100">
                                                        <span className="w-2 h-2 rounded-full bg-[#FFB22C]" />
                                                    </div>
                                                    <span className="text-sm md:text-base font-body text-gray-600 leading-tight pt-1">
                                                        {topic}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};