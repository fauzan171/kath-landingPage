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
      <span className={`relative z-10 transition-colors duration-300 ${isHovered ? 'text-kath-bg-dark' : ''}`}>
        {children}
      </span>
      <span
        className={`absolute inset-0 bg-gradient-to-r from-kath-primary to-kath-primary-light rounded-full transition-transform duration-300 ${
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
      className="relative w-full bg-kath-bg-dark overflow-hidden"
    >
      {/* Gold gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kath-primary/50 to-transparent" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kath-primary/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kath-primary/3 rounded-full blur-[150px]" />
      </div>

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
              <h2 className="font-display text-headline text-white">
                {footerConfig.heading[language]}
              </h2>
              <p className="font-body text-sm text-white/60 mt-6 max-w-md leading-relaxed">
                {footerConfig.description[language]}
              </p>
              {footerConfig.ctaText && (
                <MagneticButton
                  className="relative mt-8 px-8 py-4 border border-kath-primary/50 rounded-full font-body text-sm uppercase tracking-wider overflow-hidden transition-colors hover:border-kath-primary text-white hover:text-kath-bg-dark"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact */}
                {footerConfig.contact.length > 0 && (
                  <div>
                    <h4 className="font-body text-xs uppercase tracking-[0.15em] text-kath-primary mb-4">
                      {language === 'id' ? 'Kontak' : 'Contact'}
                    </h4>
                    <ul className="space-y-3">
                      {footerConfig.contact.map((item, index) => (
                        <li key={index}>
                          <a
                            href={item.href}
                            className="font-body text-sm text-white/70 hover:text-kath-primary transition-colors flex items-center gap-2 group"
                          >
                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-kath-primary/20 transition-colors">
                              {item.type === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                            </span>
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
                    <h4 className="font-body text-xs uppercase tracking-[0.15em] text-kath-primary mb-4">
                      {footerConfig.locationLabel[language]}
                    </h4>
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-white/70" />
                      </span>
                      <p className="font-body text-sm text-white/70 leading-relaxed">
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
                    <h4 className="font-body text-xs uppercase tracking-[0.15em] text-kath-primary mb-4">
                      {footerConfig.socialLabel[language]}
                    </h4>
                    <div className="flex gap-3">
                      {footerConfig.socials.map((social, index) => {
                        const Icon = iconMap[social.platform.toLowerCase()] || Instagram;
                        return (
                          <a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center hover:border-kath-primary hover:bg-kath-primary/10 transition-all group"
                            aria-label={social.platform}
                          >
                            <Icon className="w-4 h-4 text-white/70 group-hover:text-kath-primary transition-colors" />
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
            className="border-t border-white/10 py-12 md:py-16"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center">
              <svg
                viewBox="0 0 400 100"
                className="w-full max-w-3xl mx-auto h-auto"
                fill="currentColor"
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#AE8E1C" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#C9A82F" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#AE8E1C" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <text
                  x="50%"
                  y="40%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="font-display"
                  style={{
                    fontSize: '80px',
                    fontFamily: 'Cormorant Garamond, serif',
                    letterSpacing: '0.1em',
                    fill: 'url(#goldGradient)',
                  }}
                >
                  {footerConfig.logoText}
                </text>
                <text
                  x="50%"
                  y="75%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="font-body"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.3em',
                    fill: 'rgba(174, 142, 28, 0.5)',
                  }}
                >
                  {footerConfig.tagline[language]}
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/40">
              {footerConfig.copyright}
            </p>
            {footerConfig.links.length > 0 && (
              <div className="flex gap-6">
                {footerConfig.links.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="font-body text-xs text-white/40 hover:text-kath-primary transition-colors"
                  >
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
