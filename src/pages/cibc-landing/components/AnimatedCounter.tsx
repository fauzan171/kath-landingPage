import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
    value: string; // Misal: "50+", "$10K", "100"
    label: { id: string; en: string } | string;
}

export const AnimatedCounter = ({ value, label }: AnimatedCounterProps) => {
    const { language } = useLanguage();
    const numberRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Memisahkan angka murni dari simbol (seperti +, $, dll)
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    const prefix = value.match(/^[^0-9]/)?.[0] || '';
    const suffix = value.match(/[^0-9.]$/)?.[0] || '';

    useEffect(() => {
        const el = numberRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        // State awal: Elemen turun sedikit dan memudar
        gsap.set(container, { opacity: 0, y: 30 });

        const trigger = ScrollTrigger.create({
            trigger: container,
            start: 'top 85%', // Mulai saat elemen masuk 85% layar dari bawah
            onEnter: () => {
                // 1. Animasi wadah muncul ke atas (fade up)
                gsap.to(container, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });

                // 2. Animasi angka menghitung (Counter)
                gsap.fromTo(el, 
                    { innerText: 0 }, 
                    {
                        innerText: numericValue,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: 1 }, // Membulatkan angka (tidak ada desimal saat menghitung)
                        onUpdate: function() {
                            // Menggabungkan kembali simbol (prefix/suffix) dengan angka yang sedang berjalan
                            const currentNum = Math.ceil(Number(this.targets()[0].innerText));
                            el.innerText = `${prefix}${currentNum}${suffix}`;
                        }
                    }
                );
            },
            once: true, // Animasi hanya berjalan satu kali
        });

        return () => trigger.kill();
    }, [numericValue, prefix, suffix]);

    // Menangani format label (string biasa atau object dwi-bahasa)
    const displayLabel = typeof label === 'string' ? label : label[language as keyof typeof label];

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center text-center space-y-3 px-4">
            <span 
                ref={numberRef} 
                // Menggunakan font-display dan text-[#0F0F0F] yang sama persis dengan judul About
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F0F0F] tracking-tight"
            >
                0
            </span>
            <span className="font-body text-xs md:text-sm text-gray-500 uppercase tracking-[0.2em] font-medium">
                {displayLabel}
            </span>
        </div>
    );
};