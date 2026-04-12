import { useState, useEffect } from 'react';
import { navigationConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) { 
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-4 md:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* WADAH UTAMA - Transisi dari transparan ke putih */}
        <div 
          className={`pointer-events-auto w-full max-w-5xl h-14 md:h-[56px] rounded-full px-4 md:px-6 flex items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-md border border-[#0F0F0F]/10 shadow-lg shadow-[#0F0F0F]/5' 
              : 'bg-transparent border-transparent shadow-none'
          }`}
        >
          
          {/* 1. KIRI: LOGO */}
          <div className="flex-1 flex items-center justify-start">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="flex items-center gap-2 group"
            >
              <img
                src={navigationConfig.logo}
                alt={navigationConfig.logoAlt}
                className="h-9 md:h-11 object-contain transition-all duration-300 group-hover:scale-105"
              />
              {/* Teks Logo: Putih saat transparan, Hitam saat di-scroll */}
              <span className={`font-display font-bold text-lg md:text-xl transition-colors hidden sm:block group-hover:text-[#FFB22C] ${
                isScrolled ? 'text-[#0F0F0F]' : 'text-white'
              }`}>
                KATH
              </span>
            </a>
          </div>

          {/* 2. TENGAH: MENU DESKTOP */}
          <div className="hidden lg:flex shrink-0 items-center justify-center gap-5 xl:gap-7 px-4">
            {navigationConfig.items.map((item) => (
              <a
                key={item.label.id}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                // Teks Menu: Putih saat transparan, Hitam saat di-scroll
                className={`font-body text-[11px] md:text-xs font-semibold tracking-wider hover:text-[#FFB22C] transition-colors relative group py-1.5 ${
                  isScrolled ? 'text-[#0F0F0F]/80' : 'text-white/90'
                }`}
              >
                {item.label[language]}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#FFB22C] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* 3. KANAN: LANG & BUTTON */}
          <div className="flex-1 flex items-center justify-end gap-3">
            
            {/* Tampilan Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher isScrolled={isScrolled} />
              <button
                onClick={() => scrollToSection('#contact')}
                className="w-[110px] xl:w-[120px] h-[34px] xl:h-[36px] flex items-center justify-center bg-[#FFB22C] hover:bg-[#e59f27] text-[#0F0F0F] font-body font-bold text-[10px] xl:text-[11px] uppercase tracking-wider rounded-full shadow-md shadow-[#FFB22C]/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {navigationConfig.ctaText[language]}
              </button>
            </div>

            {/* Tampilan Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher isScrolled={isScrolled} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                // Icon Menu Mobile: Putih saat transparan, Hitam saat di-scroll
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors border ${
                  isScrolled 
                    ? 'text-[#0F0F0F] bg-[#0F0F0F]/5 hover:bg-[#0F0F0F]/10 border-[#0F0F0F]/10' 
                    : 'text-white bg-white/10 hover:bg-white/20 border-white/20'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
          {navigationConfig.items.map((item, index) => (
            <a
              key={item.label.id}
              href={item.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
              className="font-display text-2xl font-semibold text-[#0F0F0F] hover:text-[#FFB22C] transition-colors"
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
            className="mt-6 w-full max-w-[200px] h-12 flex items-center justify-center bg-[#FFB22C] hover:bg-[#e59f27] text-[#0F0F0F] font-body font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#FFB22C]/20"
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