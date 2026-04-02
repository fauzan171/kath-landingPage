import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

// Menggunakan path alias @/ agar tidak error (pastikan alias ini sesuai dengan settinganmu)
import { navigationConfig } from '@/config'; 
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* WADAH UTAMA - Light Pill Style (Putih Blur) */}
        <div 
          className={`pointer-events-auto w-full max-w-5xl h-14 md:h-[64px] rounded-full px-4 md:px-6 flex items-center justify-between bg-white/95 backdrop-blur-md border border-[#0F0F0F]/10 transition-all duration-300 ${
            isScrolled ? 'shadow-lg shadow-[#0F0F0F]/5 translate-y-0' : 'shadow-md translate-y-2'
          }`}
        >
          
          {/* 1. KIRI: LOGO */}
          <div className="flex-1 flex items-center justify-start">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="flex items-center gap-2 group"
            >
              {/* Jika menggunakan gambar logo dari config */}
              {/* <img
                src={navigationConfig.logo}
                alt={navigationConfig.logoAlt}
                className="h-6 md:h-7 object-contain transition-all duration-300 group-hover:scale-105"
              /> */}
              {/* Teks Logo: Warna Gelap */}
              <span className="font-display font-bold text-lg md:text-xl text-[#0F0F0F] tracking-widest uppercase">
                KATH
              </span>
            </a>
          </div>

          {/* 2. TENGAH: MENU DESKTOP (Gaya Kapsul) */}
          <div className="hidden lg:flex shrink-0 items-center justify-center gap-2 px-4">
            {navigationConfig.items.map((item) => (
              <a
                key={item.label.id}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                // Efek Hover: Background abu-abu muda, teks menjadi lebih gelap
                className="font-body text-[13px] font-semibold text-[#0F0F0F]/70 hover:text-[#0F0F0F] hover:bg-gray-100/80 px-5 py-2.5 rounded-full transition-all duration-300"
              >
                {item.label[language]}
              </a>
            ))}
          </div>

          {/* 3. KANAN: LANG & BUTTON */}
          <div className="flex-1 flex items-center justify-end gap-3">
            
            {/* Tampilan Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Mengirimkan isScrolled=true agar komponen switcher berasumsi background-nya selalu terang */}
              <LanguageSwitcher isScrolled={true} /> 
              
              <button
                onClick={() => scrollToSection('#contact')}
                // Tombol Kuning Khas Kodemu
                className="px-6 h-[38px] flex items-center justify-center bg-[#FFB22C] hover:bg-[#e59f27] text-[#0F0F0F] font-body font-bold text-[12px] uppercase tracking-wider rounded-full shadow-md shadow-[#FFB22C]/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {navigationConfig.ctaText[language]}
              </button>
            </div>

            {/* Tampilan Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher isScrolled={true} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                // Tombol menu mobile warna terang
                className="w-9 h-9 flex items-center justify-center rounded-full text-[#0F0F0F] bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay - Warna Terang */}
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
            className="mt-6 w-full max-w-[200px] h-12 flex items-center justify-center bg-[#FFB22C] hover:bg-[#e59f27] text-[#0F0F0F] font-body font-bold text-sm uppercase tracking-wider rounded-full shadow-lg shadow-[#FFB22C]/20"
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