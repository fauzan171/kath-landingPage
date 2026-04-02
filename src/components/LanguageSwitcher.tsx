import { useLanguage, type Language } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

// Menambahkan interface props untuk menerima isScrolled
interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'id', label: 'ID', flag: '🇮🇩' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  const activeIndex = languages.findIndex(l => l.code === language);

  return (
    // Background dan border menyesuaikan kondisi scrolled atau transparan
    <div className={`flex items-center gap-1.5 rounded-full p-1 relative transition-all duration-300 border ${
      isScrolled 
        ? 'bg-[#0F0F0F]/5 border-[#0F0F0F]/10 shadow-inner' 
        : 'bg-white/10 border-white/20 shadow-none'
    }`}>
      
      {/* Icon Globe menyesuaikan warna (Hitam pudar vs Putih pudar) */}
      <Globe className={`w-4 h-4 ml-2 z-10 transition-colors ${
        isScrolled ? 'text-[#0F0F0F]/40 drop-shadow-sm' : 'text-white/70'
      }`} />
      
      <div className="flex relative items-center gap-1">
        
        {/* Indikator Emas Aktif - Dimensi Tetap */}
        <motion.div
          className="absolute h-[28px] bg-[#FFB22C] rounded-full shadow-[0_2px_8px_rgba(255,178,44,0.4)]"
          animate={{
            x: activeIndex === 0 ? 0 : 40, 
            width: 36, 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 450, 
            damping: 30,
          }}
          style={{ zIndex: 0 }} 
        />
        
        {languages.map((lang, index) => {
          const isActive = index === activeIndex;
          
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`relative z-10 flex items-center justify-center w-[36px] h-[28px] rounded-full text-[10px] font-body transition-colors duration-200 ${
                isActive 
                  ? 'text-[#0F0F0F] font-bold' // Teks yang menempel di background emas SELALU hitam
                  : (isScrolled ? 'text-[#0F0F0F]/50 font-medium hover:text-[#0F0F0F]/90' : 'text-white/70 font-medium hover:text-white') // Teks sisanya hitam/putih sesuai scroll
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}