import { useLanguage, type Language } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'id', label: 'ID', flag: '🇮🇩' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  return (
    <div className="flex items-center gap-1 bg-kath-black/50 backdrop-blur-sm rounded-full p-1 border border-kath-white/10">
      <Globe className="w-3.5 h-3.5 text-kath-gold ml-2" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-2.5 py-1 text-xs font-body rounded-full transition-all duration-300 ${
            language === lang.code
              ? 'bg-kath-gold text-kath-black font-medium'
              : 'text-kath-white/70 hover:text-kath-white'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
