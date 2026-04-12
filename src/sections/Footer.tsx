import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, ArrowUpRight, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { footerConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// Magnetic Button Component
const MagneticButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    setIsHovered(false);
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ willChange: 'transform' }}
    >
      <span className="relative z-10 transition-colors duration-300">
        {children}
      </span>
      <span
        className={`absolute inset-0 bg-[#FFB22C] rounded-full transition-transform duration-300 ${
          isHovered ? 'scale-100' : 'scale-0'
        }`}
      />
    </button>
  );
};

const iconMap: Record<string, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
};

const Footer = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const logo = logoRef.current;

    if (!section || !content || !logo) return;

    // Set initial states
    gsap.set(content.children, { opacity: 0, y: 30 });
    gsap.set(logo, { opacity: 0, y: 50 });

    const triggers: ScrollTrigger[] = [];

    // Content reveal
    const contentTrigger = ScrollTrigger.create({
      trigger: content,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(content.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(contentTrigger);

    // Logo reveal
    const logoTrigger = ScrollTrigger.create({
      trigger: logo,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(logo, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(logoTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!footerConfig.heading && !footerConfig.logoText) return null;

  return (
    <footer
      ref={sectionRef}
      className="relative w-full bg-[#F9F8F6] text-[#0F0F0F] overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Upper Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-24 md:pt-32 pb-16">
          <div
            ref={contentRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8"
          >
            {/* Left Column - CTA */}
            <div className="lg:col-span-5">
              <h2 className="font-display text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0F0F0F] tracking-tight">
                {footerConfig.heading[language]}
              </h2>
              {/* Teks premium disisipkan di sini dengan tipografi yang lebih elegan */}
              <p className="font-body text-sm md:text-base lg:text-lg text-[#0F0F0F]/70 mt-4 md:mt-6 max-w-xs md:max-w-lg leading-loose font-light">
                {language === 'id' 
                  ? 'Mewujudkan acara impian Anda dengan sentuhan elegan dan detail yang presisi. Mitra tepercaya untuk setiap momen tak terlupakan.' 
                  : 'Bringing your dream events to life with elegant touches and flawless precision. Your trusted partner for unforgettable moments.'}
              </p>
              {footerConfig.ctaText && (
                <MagneticButton 
                  className="relative mt-8 md:mt-10 px-6 md:px-8 py-3 md:py-4 border border-[#0F0F0F]/20 rounded-full font-body font-bold text-xs md:text-sm uppercase tracking-widest overflow-hidden transition-colors hover:border-[#FFB22C] text-[#0F0F0F]"
                  onClick={() => scrollToSection('#contact')}
                >
                  <span className="flex items-center gap-2">
                    {footerConfig.ctaText[language]}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </MagneticButton>
              )}
            </div>

            {/* Right Column - Contact Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-3 gap-6 md:gap-8">
                {/* Contact */}
                {footerConfig.contact.length > 0 && (
                  <div>
                    <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] text-[#FFB22C] mb-5">
                      {language === 'id' ? 'Kontak' : 'Contact'}
                    </h4>
                    <ul className="space-y-4">
                      {footerConfig.contact.map((item, index) => (
                        <li key={index}>
                          <a
                            href={item.href}
                            className="font-body text-sm font-medium text-[#0F0F0F]/70 hover:text-[#FFB22C] transition-colors flex items-center gap-3"
                          >
                            {item.type === 'email' ? <Mail className="w-4 h-4 text-[#FFB22C]" /> : <Phone className="w-4 h-4 text-[#FFB22C]" />}
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Address */}
                {footerConfig.address.length > 0 && (
                  <div>
                    <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] text-[#FFB22C] mb-5">
                      {footerConfig.locationLabel[language]}
                    </h4>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#FFB22C] mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm font-medium text-[#0F0F0F]/70 leading-loose">
                        {footerConfig.address.map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < footerConfig.address.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                )}

                {/* Social */}
                {footerConfig.socials.length > 0 && (
                  <div>
                    <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] text-[#FFB22C] mb-5">
                      {footerConfig.socialLabel[language]}
                    </h4>
                    <div className="flex gap-4">
                      {footerConfig.socials.map((social, index) => {
                        const Icon = iconMap[social.platform.toLowerCase()] || Instagram;
                        return (
                          <a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full bg-white border border-[#0F0F0F]/5 flex items-center justify-center hover:border-[#FFB22C] hover:bg-[#FFB22C] group transition-all duration-300 shadow-sm hover:shadow-[#FFB22C]/20"
                            aria-label={social.platform}
                          >
                            <Icon className="w-4 h-4 text-[#0F0F0F] group-hover:text-white transition-colors" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Large Logo */}
        {footerConfig.logoText && (
          <div
            ref={logoRef}
            className="border-t border-[#0F0F0F]/5 py-16 md:py-24"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center">
              <svg
                viewBox="0 0 400 120"
                className="w-full max-w-4xl mx-auto h-auto"
                fill="currentColor"
              >
                <text
                  x="50%"
                  y="45%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="font-display font-bold"
                  style={{
                    fontSize: '85px',
                    fontFamily: 'Cormorant Garamond, serif', // Pastikan font family sesuai font elegan Anda
                    letterSpacing: '0.15em',
                    fill: '#FFB22C', // Emas solid agar lebih tegas dan mewah
                  }}
                >
                  {footerConfig.logoText}
                </text>
                <text
                  x="50%"
                  y="85%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="font-body uppercase font-medium"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.4em', // Spasi huruf direnggangkan agar terlihat premium
                    fill: 'rgba(15, 15, 15, 0.7)', // Abu-abu gelap elegan
                  }}
                >
                  {footerConfig.tagline[language]}
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-[#0F0F0F]/5 py-8">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body font-medium text-xs text-[#0F0F0F]/50 tracking-wider">
              {footerConfig.copyright}
            </p>
            {footerConfig.links.length > 0 && (
              <div className="flex gap-8">
                {footerConfig.links.map((link, index) => (
                  <a key={index} href={link.href} className="font-body font-medium text-xs uppercase tracking-wider text-[#0F0F0F]/50 hover:text-[#FFB22C] transition-colors">
                    {link.label[language]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;