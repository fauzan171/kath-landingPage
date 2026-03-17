import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (id: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => {
      const newLang = prev === 'id' ? 'en' : 'id';
      document.documentElement.lang = newLang;
      return newLang;
    });
  }, []);

  // Helper function to get text based on current language
  const t = useCallback((id: string, en: string) => {
    return language === 'id' ? id : en;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
