import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const sponsorLogos = [
    { name: 'KATH Event Organizer', src: '/kath-logo-new.png' },
    { name: 'Cakrawala University', src: null },
    { name: 'Sponsor 1', src: null },
    { name: 'Sponsor 2', src: null },
    { name: 'Sponsor 3', src: null },
    { name: 'Sponsor 4', src: null },
];

const mediaLogos = [
    { name: 'Media Partner 1', src: null },
    { name: 'Media Partner 2', src: null },
    { name: 'Media Partner 3', src: null },
    { name: 'Media Partner 4', src: null },
    { name: 'Media Partner 5', src: null },
    { name: 'Media Partner 6', src: null },
];

const LogoItem = ({ name, src }: { name: string; src: string | null }) => (
    <div className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 px-8 md:px-12">
        {src ? (
            <img
                src={src}
                alt={name}
                className="h-10 md:h-14 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            />
        ) : (
            <div className="h-10 md:h-14 w-28 md:w-36 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50/50">
                <span className="text-[10px] md:text-xs text-gray-300 font-body font-medium uppercase tracking-wider">{name}</span>
            </div>
        )}
    </div>
);

export const SponsorsSection = () => {
    const { language } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            onEnter: () => {
                gsap.fromTo('.sponsor-header-elem',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
            },
            once: true,
        });

        return () => trigger.kill();
    }, []);

    return (
        <section ref={sectionRef} className="py-16 md:py-24 bg-white border-t border-gray-100 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="sponsor-header-elem inline-block px-5 py-2 bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-full text-[#FFB22C] font-body text-xs uppercase tracking-widest font-bold mb-6">
                        {language === 'id' ? 'Didukung Oleh' : 'Supported By'}
                    </span>
                    <h2 className="sponsor-header-elem font-display text-3xl md:text-4xl text-[#0F0F0F] font-bold tracking-tight mb-3">
                        {language === 'id' ? 'Mitra & Sponsor' : 'Partners & Sponsors'}
                    </h2>
                    <p className="sponsor-header-elem font-body text-sm md:text-base text-gray-500 max-w-xl mx-auto">
                        {language === 'id'
                            ? 'Didukung oleh organisasi terkemuka yang berkomitmen untuk mendorong inovasi bisnis.'
                            : 'Supported by leading organizations committed to driving business innovation.'}
                    </p>
                </div>

                {/* Sponsor & Partner Logos - Scrolling */}
                <div className="mb-12">
                    <h3 className="sponsor-header-elem font-body text-xs text-gray-400 uppercase tracking-[0.2em] font-bold text-center mb-6">
                        {language === 'id' ? 'Penyelenggara & Sponsor' : 'Organizer & Sponsors'}
                    </h3>
                    <div className="relative">
                        {/* Fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                        {/* Scrolling row */}
                        <div className="flex animate-scroll-slow">
                            {[...sponsorLogos, ...sponsorLogos].map((logo, index) => (
                                <LogoItem key={`sponsor-${index}`} name={logo.name} src={logo.src} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Media Partner Logos - Scrolling */}
                <div>
                    <h3 className="sponsor-header-elem font-body text-xs text-gray-400 uppercase tracking-[0.2em] font-bold text-center mb-6">
                        {language === 'id' ? 'Mitra Media' : 'Media Partners'}
                    </h3>
                    <div className="relative">
                        {/* Fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                        {/* Scrolling row - reverse direction */}
                        <div className="flex animate-scroll-slow-reverse">
                            {[...mediaLogos, ...mediaLogos].map((logo, index) => (
                                <LogoItem key={`media-${index}`} name={logo.name} src={logo.src} />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
