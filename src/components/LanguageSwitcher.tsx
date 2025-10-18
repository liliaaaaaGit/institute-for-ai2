import React from 'react';
import { Globe } from 'lucide-react';
import { getCurrentLanguage, setLanguage, t, type Language } from '../lib/i18n';

interface LanguageSwitcherProps {
  onLanguageChange?: (lang: Language) => void;
}

export default function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const currentLang = getCurrentLanguage();

  const handleLanguageToggle = () => {
    const newLang: Language = currentLang === 'de' ? 'en' : 'de';
    setLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLanguageToggle();
    }
  };

  return (
    <button
      onClick={handleLanguageToggle}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-ink/80 hover:text-brand-ink transition-colors rounded-lg focus:outline-none focus:shadow-focus"
      aria-label={t('nav.languageSwitch')}
      title={t('nav.languageSwitch')}
    >
      <Globe className="h-4 w-4" stroke="currentColor" strokeWidth="2" />
      <span className="font-semibold">
        {currentLang.toUpperCase()}
      </span>
      <span className="text-brand-ink/40">|</span>
      <span className="text-brand-ink/60">
        {currentLang === 'de' ? 'EN' : 'DE'}
      </span>
    </button>
  );
}