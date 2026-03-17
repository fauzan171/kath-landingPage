import { useLanguage, type Language } from '../contexts/LanguageContext';
import { Globe } from '../icons';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'id', label: 'ID', flag: '🇮🇩' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  return (
    <div className="flex items-center gap-1 bg-kath-bg-section/80 backdrop-blur-sm rounded-full p-1 border border-kath-primary/20">
      <Globe className="w-3.5 h-3.5 text-kath-primary ml-2" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-2.5 py-1 text-xs font-body rounded-full transition-all duration-300 ${
            language === lang.code
              ? 'bg-kath-primary text-white font-medium'
              : 'text-kath-text-secondary hover:text-kath-text-primary'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
