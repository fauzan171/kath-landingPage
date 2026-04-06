import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';

gsap.registerPlugin(ScrollTrigger);

export const TimelineSection = () => {
    const { language } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null); // Referensi untuk garis kuning yang memanjang
    const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]); // Array referensi untuk tiap item

    useEffect(() => {
        const section = sectionRef.current;
        const line = lineRef.current;
        const items = timelineItemsRef.current;

        if (!section || !line) return;

        const ctx = gsap.context(() => {
            // 1. Animasi Header (Muncul dari bawah)
            gsap.fromTo('.timeline-header', 
                { opacity: 0, y: 30 }, 
                { 
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 75%',
                    }
                }
            );

            // 2. Animasi Garis Timeline (Memanjang seiring scroll)
            gsap.fromTo(line, 
                { height: '0%' }, // Mulai dari 0
                { 
                    height: '100%', // Penuh ke bawah
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 50%', // Garis mulai memanjang saat bagian atas section mencapai tengah layar
                        end: 'bottom 80%', // Berhenti memanjang mendekati akhir section
                        scrub: 0.5, // Animasi terkait erat dengan pergerakan scroll (dengan sedikit smoothing)
                    }
                }
            );

            // 3. Animasi Setiap Item (Titik dan Kartu)
            items.forEach((item, i) => {
                if (!item) return;
                
                // Elemen spesifik dalam item
                const dot = item.querySelector('.timeline-dot');
                const card = item.querySelector('.timeline-card');
                
                // Tentukan arah geser masuk berdasarkan posisi kartu (kiri atau kanan)
                const isEven = i % 2 === 0;
                const xOffset = window.innerWidth > 768 ? (isEven ? -50 : 50) : 50; // Desktop selang-seling, Mobile selalu dari kanan

                // Atur state awal kartu dan titik
                gsap.set(card, { opacity: 0, x: xOffset });
                gsap.set(dot, { scale: 0.5, backgroundColor: '#E5E7EB', borderColor: '#D1D5DB', boxShadow: 'none' }); // Abu-abu pudar

                // Animasi saat di-scroll
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 65%', // Kapan titik/kartu harus menyala
                    onEnter: () => {
                        // Animasikan titik (Menyala kuning)
                        gsap.to(dot, { 
                            scale: 1, 
                            backgroundColor: '#fff', 
                            borderColor: '#FFB22C', 
                            boxShadow: '0 0 15px rgba(255, 178, 44, 0.4)',
                            duration: 0.4, 
                            ease: 'back.out(2)' 
                        });
                        
                        // Animasikan kartu masuk
                        gsap.to(card, { 
                            opacity: 1, 
                            x: 0, 
                            duration: 0.6, 
                            ease: 'power3.out',
                            delay: 0.1 
                        });
                    },
                    once: true,
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                
                {/* Header */}
                <div className="text-center mb-20 flex flex-col items-center">
                    <span className="timeline-header inline-block px-5 py-2 bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full text-[#FFB22C] font-body text-xs uppercase tracking-widest font-bold mb-6">
                        Timeline
                    </span>
                    <h2 className="timeline-header font-display text-4xl md:text-5xl lg:text-6xl text-[#0F0F0F] font-bold leading-[1.15] tracking-tight">
                        {language === 'id' ? 'Jadwal Penting' : 'Important Dates'}
                    </h2>
                </div>

                {/* Timeline Container */}
                <div className="relative pl-6 md:pl-0">
                    
                    {/* 1. Background Line (Garis abu-abu pasif) */}
                    <div className="absolute top-0 bottom-0 left-[23.5px] md:left-1/2 md:-translate-x-1/2 w-[2px] bg-gray-200" />
                    
                    {/* 2. Active Line (Garis kuning yang memanjang dari atas ke bawah) */}
                    <div 
                        ref={lineRef}
                        className="absolute top-0 left-[23.5px] md:left-1/2 md:-translate-x-1/2 w-[2px] bg-[#FFB22C] origin-top z-0" 
                    />

                    {COMPETITION_DATA.timeline.map((item, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div 
                                key={index} 
                                ref={(el) => { timelineItemsRef.current[index] = el; }}
                                className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 last:mb-0"
                            >
                                {/* Titik Tengah (Dot) */}
                                <div className="timeline-dot absolute left-[15px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full border-[3px] z-10" />
                                
                                {/* Wadah Kartu (Mengatur posisi ke Kiri atau Kanan di Desktop) */}
                                <div className={`w-full md:w-[calc(50%-40px)] pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 text-left'}`}>
                                    
                                    {/* Kartu Konten (Card) */}
                                    <div className={`timeline-card bg-white border border-gray-100 shadow-xl shadow-black/5 p-8 rounded-[2rem] hover:border-[#FFB22C]/30 hover:shadow-2xl hover:shadow-[#FFB22C]/5 transition-all duration-300 relative ${isEven ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                                        
                                        <h3 className="font-display text-2xl text-[#0F0F0F] font-bold mb-3">{item.phase[language]}</h3>
                                        
                                        <div className={`flex flex-col gap-3 font-body text-sm text-gray-600 ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#FFB22C]" />
                                                <span className="font-medium">{item.date[language]}</span>
                                            </div>
                                            {item.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-[#FFB22C]" />
                                                    <span>{item.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Segitiga panah kecil mengarah ke garis tengah (Hanya Desktop) */}
                                        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent ${isEven ? '-right-[8px] border-l-8 border-l-gray-100' : '-left-[8px] border-r-8 border-r-gray-100'}`} />
                                        
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};