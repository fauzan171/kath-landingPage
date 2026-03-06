import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';
import { ArrowRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const label = labelRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;

    if (!section || !title || !subtitle || !image || !overlay || !label || !cta) return;

    // Initial animation on load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      image,
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2 }
    )
    .fromTo(
      label,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=1.2'
    )
    .fromTo(
      title,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      '-=0.6'
    )
    .fromTo(
      subtitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(
      cta.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
      '-=0.4'
    );

    // Scroll-driven parallax
    const parallaxTriggers: ScrollTrigger[] = [];

    const imageTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(image, { y: self.progress * 150 });
      },
    });
    parallaxTriggers.push(imageTrigger);

    const contentTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '50% top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(title, {
          opacity: 1 - self.progress * 1.5,
          y: self.progress * -50
        });
        gsap.set(subtitle, {
          opacity: 1 - self.progress * 2,
          y: self.progress * -30
        });
        gsap.set(label, {
          opacity: 1 - self.progress * 2,
        });
        gsap.set(cta, {
          opacity: 1 - self.progress * 2,
        });
      },
    });
    parallaxTriggers.push(contentTrigger);

    const overlayTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(overlay, { opacity: 0.3 + self.progress * 0.4 });
      },
    });
    parallaxTriggers.push(overlayTrigger);

    return () => {
      parallaxTriggers.forEach(trigger => trigger.kill());
      tl.kill();
    };
  }, []);

  if (!heroConfig.title && !heroConfig.backgroundImage) return null;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-[100svh] w-full overflow-hidden"
    >
      {/* Background Image with Ken Burns */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <img
          src={heroConfig.backgroundImage}
          alt={heroConfig.backgroundAlt}
          className="w-full h-full object-cover ken-burns"
        />
      </div>

      {/* Dark overlay for depth */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-kath-black opacity-30"
        style={{ willChange: 'opacity' }}
      />

      {/* Hero overlay gradient */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        {/* Label */}
        <span
          ref={labelRef}
          className="font-body text-kath-gold text-xs md:text-sm uppercase tracking-[0.4em] mb-6"
          style={{ willChange: 'transform, opacity' }}
        >
          {heroConfig.label}
        </span>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="font-display text-kath-white text-display tracking-tight select-none text-center whitespace-pre-line"
          style={{
            textShadow: '0 4px 40px rgba(0,0,0,0.5)',
            willChange: 'transform, opacity'
          }}
        >
          {heroConfig.title}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-kath-off-white/80 text-sm md:text-base mt-8 max-w-xl text-center leading-relaxed"
          style={{ willChange: 'transform, opacity' }}
        >
          {heroConfig.subtitle}
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-10">
          <button className="group px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2">
            {heroConfig.ctaPrimary}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border border-kath-white/30 hover:border-kath-gold text-kath-white font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300">
            {heroConfig.ctaSecondary}
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-body text-kath-white/60 text-xs uppercase tracking-wider">Scroll</span>
        <ChevronDown className="w-5 h-5 text-kath-gold" />
      </div>

      {/* Bottom gradient for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kath-black to-transparent" />
    </section>
  );
};

export default Hero;
