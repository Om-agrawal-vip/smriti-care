import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from './translations';

// Map various representation formats to translation keys
const normalizeLangCode = (lang) => {
  if (!lang) return 'en';
  const l = lang.toLowerCase().trim();
  if (l.includes('hi') || l.includes('hindi') || l.includes('हिन्दी')) return 'hi';
  if (l.includes('as') || l.includes('assam') || l.includes('অসমীয়া')) return 'as';
  if (l.includes('mni') || l.includes('manipuri') || l.includes('meitei') || l.includes('মৈতৈ')) return 'mni';
  if (l.includes('lus') || l.includes('mizo')) return 'lus';
  return 'en';
};

export const useTranslation = () => {
  const { selectedLanguage, userProfile } = useApp();

  const langCode = useMemo(() => {
    return normalizeLangCode(selectedLanguage || userProfile?.language || 'en');
  }, [selectedLanguage, userProfile?.language]);

  const t = (key, fallback = '') => {
    if (!key) return fallback;

    const parts = key.split('.');
    
    // 1. Try selected language
    let current = translations[langCode];
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }

    if (current !== undefined && typeof current === 'string') {
      return current;
    }

    // 2. Fallback to English
    let enCurrent = translations.en;
    for (const part of parts) {
      if (enCurrent && typeof enCurrent === 'object' && part in enCurrent) {
        enCurrent = enCurrent[part];
      } else {
        enCurrent = undefined;
        break;
      }
    }

    if (enCurrent !== undefined && typeof enCurrent === 'string') {
      return enCurrent;
    }

    // 3. Fallback to passed fallback or key itself
    return fallback || key;
  };

  return { t, langCode };
};

export default useTranslation;
