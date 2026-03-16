import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { navigationConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        backgroundColor: isScrolled ? 'rgba(250, 250, 250, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isScrolled]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-lg shadow-black/10' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="flex items-center gap-3 group"
            >
              <img
                src={navigationConfig.logo}
                alt={navigationConfig.logoAlt}
                className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-display text-2xl md:text-3xl text-kath-text-primary group-hover:text-kath-primary transition-colors hidden sm:block">
                KATH
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigationConfig.items.map((item) => (
                <a
                  key={item.label.id}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className="font-body text-sm text-kath-text-secondary hover:text-kath-primary transition-colors relative group"
                >
                  {item.label[language]}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-kath-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA Button & Language Switcher */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              <button
                onClick={() => scrollToSection('#contact')}
                className="px-6 py-3 bg-kath-primary hover:bg-kath-primary-dark text-white font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300"
              >
                {navigationConfig.ctaText[language]}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-kath-text-primary"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-kath-bg-main/98 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navigationConfig.items.map((item, index) => (
            <a
              key={item.label.id}
              href={item.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
              className="font-display text-3xl text-kath-text-primary hover:text-kath-primary transition-colors"
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s ease-out',
              }}
            >
              {item.label[language]}
            </a>
          ))}
          <button
            onClick={() => scrollToSection('#contact')}
            className="mt-4 px-8 py-4 bg-kath-primary text-white font-body text-sm uppercase tracking-wider rounded-full"
            style={{
              transitionDelay: isMobileMenuOpen ? `${navigationConfig.items.length * 50}ms` : '0ms',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s ease-out',
            }}
          >
            {navigationConfig.ctaText[language]}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
