import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Users, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection = () => {
    const { language } = useLanguage();
    const aboutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const about = aboutRef.current;
        if (!about) return;

        // Reset state awal untuk animasi
        gsap.set('.about-text-element', { y: 40, opacity: 0 });
        gsap.set('.image-wrapper', { clipPath: 'inset(100% 0 0 0)' }); // Gambar tertutup dari bawah
        gsap.set('.inner-image', { scale: 1.2 }); // Gambar awalnya zoom
        gsap.set('.floating-card', { y: 30, opacity: 0 });

        const trigger = ScrollTrigger.create({
            trigger: about,
            start: 'top 75%',
            onEnter: () => {
                const tl = gsap.timeline();

                // 1. Animasi Teks (Muncul berurutan dari bawah)
                tl.to('.about-text-element', {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out'
                }, 0);

                // 2. Animasi Gambar (Membuka ke atas + Zoom out)
                tl.to('.image-wrapper', {
                    clipPath: 'inset(0% 0 0 0)',
                    duration: 1.2,
                    ease: 'power3.inOut'
                }, 0.2);
                
                tl.to('.inner-image', {
                    scale: 1,
                    duration: 1.5,
                    ease: 'power3.out'
                }, 0.2);

                // 3. Animasi Floating Card (Muncul dengan efek memantul/spring)
                tl.to('.floating-card', {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'back.out(1.5)'
                }, 1);
            },
            once: true, // Hanya berjalan sekali saat discroll
        });

        return () => trigger.kill();
    }, []);

    return (
        <section ref={aboutRef} className="py-24 md:py-32 bg-[#F9F8F6] overflow-hidden relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* BAGIAN GAMBAR (Sekarang di Kiri) */}
                    <div className="relative order-2 lg:order-1 mt-10 lg:mt-0">
                        <div className="image-wrapper aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 relative">
                            <img 
                                src="https://images.unsplash.com/photo-1681949103006-70066fb25dfe?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                alt="Team collaborating" 
                                className="inner-image object-cover w-full h-full" 
                            />
                            {/* Overlay tipis agar gambar tidak terlalu pucat */}
                            <div className="absolute inset-0 bg-black/5" />
                        </div>

                        {/* Floating Card (Dipindah ke Kanan Bawah agar harmonis dengan teks di kanan) */}
                        <div className="floating-card absolute -bottom-8 -right-4 lg:-right-12 bg-white/95 backdrop-blur-xl border border-gray-100 p-6 rounded-2xl shadow-xl max-w-[280px] z-10">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-3 h-3 rounded-full bg-[#FFB22C] animate-pulse" />
                                <span className="font-display text-[#0F0F0F] font-bold text-lg">Mentorship Session</span>
                            </div>
                            <p className="font-body text-sm text-gray-600 leading-relaxed">
                                {language === 'id' 
                                    ? 'Bimbingan eksklusif dari praktisi industri terkemuka.' 
                                    : 'Exclusive guidance from leading industry practitioners.'}
                            </p>
                        </div>
                    </div>

                    {/* BAGIAN TEKS (Sekarang di Kanan) */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="about-text-element">
                            <span className="inline-block px-5 py-2 bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full text-[#FFB22C] font-body text-xs uppercase tracking-widest font-bold mb-6">
                                {language === 'id' ? 'Tentang Kompetisi' : 'About The Competition'}
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#0F0F0F] font-bold leading-[1.15] tracking-tight">
                                {language === 'id' ? 'Mendorong Inovasi untuk' : 'Driving Innovation for'}{' '}
                                <span className="text-[#FFB22C]">
                                    {language === 'id' ? 'Masa Depan Berkelanjutan' : 'Sustainable Future'}
                                </span>
                            </h2>
                        </div>
                        
                        <p className="about-text-element font-body text-lg md:text-xl text-gray-600 leading-relaxed">
                            {language === 'id'
                                ? 'CIBC Power adalah kompetisi business case berskala internasional yang menantang para inovator muda untuk memecahkan masalah bisnis nyata dengan fokus pada keberlanjutan dan teknologi.'
                                : 'CIBC Power is an international business case competition that challenges young innovators to solve real business problems focusing on sustainability and technology.'}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                            {[
                                { icon: Target, title: { id: 'Solusi Nyata', en: 'Real Solutions' }, desc: { id: 'Fokus pada implementasi', en: 'Focus on implementation' } },
                                { icon: Users, title: { id: 'Jaringan Global', en: 'Global Network' }, desc: { id: 'Terhubung dengan ahli', en: 'Connect with experts' } },
                                { icon: Globe, title: { id: 'Dampak Sosial', en: 'Social Impact' }, desc: { id: 'Menciptakan perubahan', en: 'Create positive change' } },
                            ].map((item, index) => (
                                <div key={index} className="about-text-element flex gap-4 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                        <item.icon className="w-6 h-6 text-[#FFB22C]" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-display font-bold text-lg text-[#0F0F0F] mb-1">{item.title[language]}</h4>
                                        <p className="font-body text-sm text-gray-500">{item.desc[language]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};