import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { navigationConfig } from '../config';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | HTMLButtonElement)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [isScrolled]);

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          opacity: 1,
          visibility: 'visible',
          duration: 0.3,
          ease: 'power2.out',
        });

        // Stagger animation for menu items
        menuItemsRef.current.forEach((item, index) => {
          if (item) {
            gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: index * 0.08,
              ease: 'power3.out',
            });
          }
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          visibility: 'hidden',
          duration: 0.3,
          ease: 'power2.in',
        });

        menuItemsRef.current.forEach((item) => {
          if (item) {
            gsap.set(item, { opacity: 0, y: 30 });
          }
        });
      }
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const setMenuItemRef = (el: HTMLAnchorElement | HTMLButtonElement | null, index: number) => {
    if (el) {
      menuItemsRef.current[index] = el;
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'shadow-2xl shadow-black/20' : ''
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="flex items-center gap-2 sm:gap-3 group touch-feedback"
            >
              <img
                src={navigationConfig.logo}
                alt={navigationConfig.logoAlt}
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(166,138,45,0.5)]"
              />
              <span className="font-display text-xl sm:text-2xl md:text-3xl text-kath-white group-hover:text-kath-gold transition-colors duration-300">
                KATH
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navigationConfig.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className="relative font-body text-sm text-kath-white/80 hover:text-kath-gold transition-colors duration-300 group py-2"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-kath-gold to-kath-gold-light transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <button
                onClick={() => scrollToSection('#contact')}
                className="px-6 py-3 bg-gradient-to-r from-kath-gold to-kath-gold-dark hover:from-kath-gold-light hover:to-kath-gold text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:shadow-gold hover:scale-105 active:scale-95"
              >
                {navigationConfig.ctaText}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-12 h-12 flex items-center justify-center text-kath-white rounded-full bg-kath-charcoal/50 backdrop-blur-sm border border-kath-charcoal/50 hover:border-kath-gold/50 transition-all duration-300 touch-feedback"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 rotate-45' : 'top-1.5'}`} />
                <span className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-[18px]'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Premium Style */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 lg:hidden opacity-0 invisible"
        style={{ willChange: 'opacity, visibility' }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-kath-black/98 backdrop-blur-2xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Decorative elements */}
        <div className="absolute top-20 left-4 w-32 h-32 bg-kath-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-4 w-40 h-40 bg-kath-gold/5 rounded-full blur-3xl" />

        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-8">
          {/* Logo in menu */}
          <div className="absolute top-20 left-6 flex items-center gap-2">
            <img
              src={navigationConfig.logo}
              alt={navigationConfig.logoAlt}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-xl text-kath-gold">KATH</span>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-2">
            {navigationConfig.items.map((item, index) => (
              <a
                key={item.label}
                ref={(el) => setMenuItemRef(el, index)}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className="group flex items-center gap-4 py-3 border-b border-kath-charcoal/30"
                style={{ opacity: 0, transform: 'translateY(30px)' }}
              >
                <span className="font-body text-kath-gold/50 text-sm">0{index + 1}</span>
                <span className="font-display text-2xl sm:text-3xl text-kath-white group-hover:text-kath-gold transition-colors duration-300">
                  {item.label}
                </span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-kath-gold">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <button
            ref={(el) => setMenuItemRef(el, navigationConfig.items.length)}
            onClick={() => scrollToSection('#contact')}
            className="mt-8 w-full py-4 bg-gradient-to-r from-kath-gold to-kath-gold-dark text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 active:scale-95"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
          >
            {navigationConfig.ctaText}
          </button>

          {/* Social Links */}
          <div className="mt-8 flex justify-center gap-6">
            <a href="#" className="text-kath-off-white/50 hover:text-kath-gold transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="text-kath-off-white/50 hover:text-kath-gold transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
