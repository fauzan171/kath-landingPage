import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { breathSectionConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const BreathSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const descContainerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const titleContainer = titleContainerRef.current;
    const descContainer = descContainerRef.current;

    if (!section || !image || !titleContainer || !descContainer) return;

    const ctx = gsap.context(() => {
      // --- FASE 1: Animasi Masuk (Dari atas menuju layar penuh) ---
      
      // Mengatur posisi awal gambar agar pergerakannya menyambung ke Fase 2
      gsap.fromTo(
        image,
        { scale: 1.2, filter: 'blur(15px)', yPercent: -20 }, 
        {
          scale: 1.4,
          filter: 'blur(0px)',
          yPercent: -10, // Berakhir tepat di titik awal Fase 2
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top top', // Sejajarkan akhir animasi dengan titik dimulainya PIN
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        titleContainer,
        { opacity: 0, y: 80 }, 
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top top',
            scrub: 1,
          },
        }
      );

      // --- FASE 2: Animasi Terkunci / Pinned (Pertukaran Teks & Parallax) ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top', // Menggunakan 'top top' lebih presisi untuk layar penuh h-screen
          end: '+=200%',
          pin: true,
          anticipatePin: 1, // KUNCI PERBAIKAN: Mencegah efek kejang/lompat saat memasuki full screen
          scrub: 1.2,
        },
      });

      // A. Parallax & Zoom Out Gambar (Lanjutan momentum dari Fase 1)
      tl.fromTo(
        image,
        { yPercent: -10, scale: 1.4 },
        { yPercent: 10, scale: 1.2, ease: 'none' },
        0
      );

      // B. Judul Utama Naik & Meredup
      tl.to(
        titleContainer,
        { y: -100, opacity: 0, ease: 'power1.inOut', duration: 1 },
        0.2
      );

      // C. Deskripsi Muncul dari Bawah Menggantikan Judul
      tl.fromTo(
        descContainer,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power1.out', duration: 1 },
        0.6
      );

      // --- FASE 3: Animasi Keluar (Menuju section bawah) ---
      // Gambar melanjutkan pergerakan ke bawah agar tidak terasa berhenti mendadak
      gsap.fromTo(
        image,
        { scale: 1.2, filter: 'blur(0px)', yPercent: 10 }, 
        {
          scale: 1.4,
          filter: 'blur(15px)',
          yPercent: 20, // Melanjutkan momentum parallax
          immediateRender: false, 
          scrollTrigger: {
            trigger: section,
            start: () => tl.scrollTrigger ? tl.scrollTrigger.end : 0, 
            end: () => `+=${window.innerHeight}`, 
            scrub: 1,
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!breathSectionConfig.title && !breathSectionConfig.backgroundImage) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#0F0F0F] flex items-center justify-center pointer-events-auto"
    >
      <div 
        ref={imageWrapperRef}
        className="relative w-full h-full overflow-hidden bg-[#0F0F0F] group cursor-default"
      >
        <img
          ref={imageRef}
          src={breathSectionConfig.backgroundImage}
          alt={breathSectionConfig.backgroundAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform, filter' }} 
        />

        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-[#0F0F0F]/55 z-0" />

        {/* Judul & Subjudul */}
        <div 
          ref={titleContainerRef} 
          className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 z-20 pointer-events-none will-change-transform"
        >
          <h2
            className="font-display text-5xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight text-center leading-tight max-w-5xl drop-shadow-2xl"
            style={{ textShadow: '0 8px 40px rgba(0,0,0,0.8)' }}
          >
            {breathSectionConfig.title[language]}
          </h2>
          <p className="font-body text-[#FFB22C] text-sm md:text-base font-normal uppercase tracking-[0.3em] mt-6 text-center drop-shadow-lg">
            {breathSectionConfig.subtitle[language]}
          </p>
        </div>

        {/* Deskripsi */}
        {breathSectionConfig.description && (
          <div 
            ref={descContainerRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 z-20 pointer-events-none will-change-transform opacity-0"
          >
            <p 
              className="font-body text-lg md:text-lg lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-normal text-center drop-shadow-2xl"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
            >
              {breathSectionConfig.description[language]}
            </p>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default BreathSection;