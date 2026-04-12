import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardStackConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const CardStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Ref baru untuk animasi kotak bergulir
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const indicatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const { language } = useLanguage();

  const cards = cardStackConfig.cards;

  // Efek 1: Deteksi Scroll untuk mengubah activeIndex
  useEffect(() => {
    if (!sectionRef.current || cards.length === 0) return;

    const ctx = gsap.context(() => {
      textRefs.current.forEach((ref, index) => {
        if (!ref) return;

        ScrollTrigger.create({
          trigger: ref,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cards.length]);

  // Efek 2: Animasi Kotak Bergulir setiap kali activeIndex berubah
  useEffect(() => {
    if (!boxRef.current || !indicatorRefs.current[activeIndex]) return;

    // Mengambil target posisi Y dari angka yang sedang aktif
    const target = indicatorRefs.current[activeIndex];
    const targetY = target?.offsetTop || 0;

    // Menggerakkan kotak ke target Y dengan GSAP
    gsap.to(boxRef.current, {
      y: targetY,
      rotation: activeIndex * 90, // Memberikan efek berputar saat pindah
      duration: 0.6,
      ease: 'back.out(1.2)', // Efek sedikit memantul saat berhenti
    });
  }, [activeIndex]);

  if (!cardStackConfig.sectionTitle && cards.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full bg-[#F9F8F6] text-[#0F0F0F]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col md:flex-row relative">

        {/* KOLOM KIRI: Konten Teks yang Di-scroll */}
        <div className="w-full md:w-1/2 md:pr-16 lg:pr-24 py-16 md:py-[15vh]">

          <div className="mb-12 md:mb-20 lg:mb-32">
            <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
              {cardStackConfig.sectionSubtitle[language]}
            </span>
            <h2 className="font-display text-4xl md:text-4xl lg:text-5xl font-medium mt-3 md:mt-4">
              {cardStackConfig.sectionTitle[language]}
            </h2>
          </div>

          {/* List Teks Proses dengan Container Relative untuk jalur kotak */}
          <div ref={containerRef} className="relative flex flex-col">
            
            {/* THE ROLLING BOX (Satu kotak yang bergerak) */}
            <div 
              ref={boxRef}
              className="absolute left-0 w-2.5 h-2.5 bg-[#FFB22C] z-10 mt-[1.2rem] md:mt-[1.3rem]"
              style={{ top: 0 }}
            />

            {cards.map((card, index) => (
              <div
                key={card.id}
                ref={(el) => { textRefs.current[index] = el; }}
                className={`flex flex-col min-h-[45vh] md:min-h-[50vh] transition-all duration-700 ease-out ${
                  activeIndex === index ? 'opacity-100' : 'opacity-30 hover:opacity-60'
                }`}
              >

                <div className="flex gap-3 md:gap-5 items-start">
                  <div
                    ref={(el) => { indicatorRefs.current[index] = el; }}
                    className="flex items-center mt-3 md:mt-3.5 shrink-0 pl-4 md:pl-6 lg:pl-8"
                  >
                    <span className="font-body text-sm md:text-sm font-semibold text-[#0F0F0F]/40 tracking-widest">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="pt-1 md:pt-2">
                    {card.category && (
                      <span className="inline-block px-3 py-1 md:px-3 md:py-1 bg-[#FFB22C]/10 text-[#FFB22C] text-[10px] md:text-[10px] font-bold uppercase tracking-wider rounded-full mb-2 md:mb-3">
                        {card.category[language]}
                      </span>
                    )}
                    <h3 className="font-display text-3xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4 text-[#0F0F0F]">
                      {card.title[language]}
                    </h3>
                    <p className="font-body text-[#0F0F0F]/70 text-base md:text-base lg:text-lg leading-relaxed max-w-xs md:max-w-md">
                      {card.description[language]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: Gambar yang Dipin/Sticky */}
        <div className="hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center py-20">
          {/* UKURAN DIKECILKAN: dari max-w-lg ke max-w-[400px] dan aspect ratio disesuaikan */}
          <div className="relative w-full max-w-[380px] lg:max-w-[420px] aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl shadow-[#0F0F0F]/10 bg-white border border-[#0F0F0F]/5">
            {cards.map((card, index) => (
              <div
                key={`img-${card.id}`}
                className={`absolute inset-0 transition-all duration-1000 ${
                  activeIndex === index
                    ? 'opacity-100 translate-y-0 scale-100 z-10'
                    : activeIndex > index
                    ? 'opacity-0 -translate-y-20 scale-90 z-0'
                    : 'opacity-0 translate-y-20 scale-110 z-0'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }}
              >
                <img
                  src={card.image}
                  alt={card.title[language]}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradien halus */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Garis Pembatas Bawah */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12 md:mt-24">
        <div className="h-[1px] w-full bg-[#FFB22C]/30" />
      </div>
    </section>
  );
};

export default CardStack;