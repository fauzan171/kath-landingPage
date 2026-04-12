import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { zigZagGridConfig, type ZigZagGridItem } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const GridItem = ({
  item,
  index,
}: {
  item: ZigZagGridItem;
  index: number;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null); // Ref untuk animasi progres
  const { language } = useLanguage();

  useEffect(() => {
    const itemEl = itemRef.current;
    const imageContainer = imageContainerRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    const progressBar = progressBarRef.current;

    if (!itemEl || !imageContainer || !image || !text || !progressBar) return;

    // Initial state for text
    gsap.set(text.children, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      // 1. Text reveal animation
      ScrollTrigger.create({
        trigger: text,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(text.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          });
        },
      });

      // 2. Internal parallax on image (Gambar bergerak halus di dalam framenya)
      ScrollTrigger.create({
        trigger: imageContainer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const yPercent = (self.progress - 0.5) * 15; // Dibuat lebih halus
          gsap.set(image, { yPercent });
        },
      });

      // 3. Sticky Progression Bar Animation (Garis terisi saat di-scroll)
      gsap.fromTo(
        progressBar,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: itemEl,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );
    }, itemEl);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={itemRef}
      // Tambahkan min-h-[120vh] agar ada ruang untuk teks men-scroll sementara gambar terkunci (sticky)
      className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 min-h-[80vh] lg:min-h-[120vh] ${
        index > 0 ? 'mt-16 md:mt-24 lg:mt-32' : ''
      }`}
    >
      {/* Kolom Gambar (Sticky) */}
      <div className={`relative h-full ${item.reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        {/* Kontainer ini akan terkunci di layar saat mencapai top-32 */}
        <div className="sticky top-24 md:top-32 w-full">
          <div
            ref={imageContainerRef}
            className="relative w-full aspect-[4/3] md:aspect-[4/3] overflow-hidden rounded-2xl md:rounded-[32px] border border-[#0F0F0F]/10 shadow-xl md:shadow-2xl shadow-[#0F0F0F]/5"
          >
            <img
              ref={imageRef}
              src={item.image}
              alt={item.imageAlt}
              className="absolute inset-0 w-full h-[120%] object-cover"
              style={{
                willChange: 'transform',
                transform: 'scale(1.05)',
              }}
            />
            {/* Gradien overlay tipis agar gambar terlihat elegan */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50 z-10" />
          </div>
        </div>
      </div>

      {/* Kolom Teks (Scrolling) */}
      <div
        ref={textRef}
        className={`flex flex-col justify-center py-12 md:py-20 lg:py-40 ${
          item.reverse ? 'lg:order-1 lg:pr-12' : 'lg:order-2 lg:pl-12'
        }`}
      >
        <span className="font-body text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#FFB22C]">
          {item.subtitle[language]}
        </span>
        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F0F0F] mt-3 md:mt-4 leading-tight tracking-tight">
          {item.title[language]}
        </h3>
        <p className="font-body text-sm md:text-base lg:text-lg text-[#0F0F0F]/70 leading-relaxed mt-4 md:mt-6 max-w-md lg:max-w-lg">
          {item.description[language]}
        </p>

        {/* Indikator Sticky Progression (Visual Bar) */}
        <div className="flex items-center gap-4 mt-12">
          {/* Track Garis */}
          <div className="relative w-1 h-24 bg-[#0F0F0F]/10 rounded-full overflow-hidden">
            {/* Garis Isi (Fill) yang akan dianimasikan oleh GSAP */}
            <div 
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full h-full bg-[#FFB22C] origin-top rounded-full"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>
          <span className="font-body text-xs font-bold text-[#0F0F0F]/40 tracking-widest uppercase">
            {String(index + 1).padStart(2, '0')} / {String(zigZagGridConfig.items.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

const ZigZagGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  if (!zigZagGridConfig.sectionTitle && zigZagGridConfig.items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 lg:py-40 bg-[#F9F8F6] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20 md:mb-32">
          <span className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#FFB22C]">
            {zigZagGridConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0F0F0F] mt-4 tracking-tight">
            {zigZagGridConfig.sectionTitle[language]}
          </h2>
        </div>

        {/* Grid Items */}
        <div className="relative">
          {zigZagGridConfig.items.map((item, index) => (
            <GridItem key={item.id} item={item} index={index} />
          ))}
        </div>
        
      </div>

      {/* Garis Pembatas Bawah Opsional */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-24">
        <div className="h-[1px] w-full bg-[#0F0F0F]/5" />
      </div>
    </section>
  );
};

export default ZigZagGrid;