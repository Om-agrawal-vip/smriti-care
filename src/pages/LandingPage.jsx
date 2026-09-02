import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ArrowRight, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage } = useApp();
  const { t } = useTranslation();

  const languages = [
    {
      id: 'English',
      name: 'English',
      native: 'English',
    },
    {
      id: 'Hindi',
      name: 'Hindi',
      native: 'हिन्दी',
    },
    {
      id: 'Assamese',
      name: 'Assamese',
      native: 'অসমীয়া',
    },
    {
      id: 'Meitei/Manipuri',
      name: 'Meitei/Manipuri',
      native: 'ꯃꯤꯇꯩꯂꯣꯟ',
    },
    {
      id: 'Mizo',
      name: 'Mizo',
      native: 'Mizo ṭawng',
    },
  ];

  const handleLanguageSelect = (langId) => {
    setSelectedLanguage(langId);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigate('/login');
    }
  };

  return (
    <div className="w-full min-h-[92vh] flex flex-col items-center justify-center px-4 py-8 md:py-12">
      {/* Central Glassmorphic Hero Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/80 shadow-[0_30px_90px_-15px_rgba(30,95,96,0.25)] p-6 sm:p-10 md:p-14 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Subtle Top Rainbow Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#8B5FBF]" />

        {/* 1. ANIMATED "MEMORY CONSTELLATION" HERO CENTERPIECE */}
        <div className="relative mb-6 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] opacity-50 blur-xl pointer-events-none"
          />

          <motion.div
            animate={{ y: [0, -6, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 -right-3 text-[#E76F51] pointer-events-none"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="absolute -bottom-2 -left-3 text-[#2A9D8F] pointer-events-none"
          >
            <Star className="w-4 h-4 fill-current" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute top-2 -left-4 text-[#FFD166] pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>

          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-white/95 via-white/85 to-teal-50/80 backdrop-blur-2xl border-2 border-white shadow-[0_16px_36px_-6px_rgba(30,95,96,0.3)] flex items-center justify-center p-3 relative overflow-hidden group">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="brainStrokeGrad" x1="10" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1E5F60" />
                  <stop offset="50%" stopColor="#2A9D8F" />
                  <stop offset="100%" stopColor="#5C9E50" />
                </linearGradient>

                <linearGradient id="synapseGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2A9D8F" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#E76F51" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2A9D8F" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <path
                d="M 48 20 C 36 18, 22 26, 20 38 C 18 48, 23 54, 21 62 C 19 70, 28 80, 38 80 C 44 80, 48 76, 48 74"
                stroke="url(#brainStrokeGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 52 20 C 64 18, 78 26, 80 38 C 82 48, 77 54, 79 62 C 81 70, 72 80, 62 80 C 56 80, 52 76, 52 74"
                stroke="url(#brainStrokeGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 50 24 L 50 72"
                stroke="#1E5F60"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                strokeLinecap="round"
                opacity="0.4"
              />

              <line x1="33" y1="34" x2="67" y2="34" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="33" y1="34" x2="30" y2="52" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="67" y1="34" x2="70" y2="52" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="30" y1="52" x2="50" y2="48" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="70" y1="52" x2="50" y2="48" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="30" y1="52" x2="38" y2="68" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="70" y1="52" x2="62" y2="68" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="50" y1="48" x2="50" y2="68" stroke="url(#synapseGrad)" strokeWidth="1.5" />
              <line x1="38" y1="68" x2="62" y2="68" stroke="url(#synapseGrad)" strokeWidth="1.5" />

              <motion.circle
                cx="33"
                cy="34"
                r="3.5"
                fill="#2A9D8F"
                animate={{ r: [3, 4.5, 3], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx="33" cy="34" r="1.5" fill="white" />

              <motion.circle
                cx="67"
                cy="34"
                r="3.5"
                fill="#E76F51"
                animate={{ r: [3, 4.5, 3], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
              <circle cx="67" cy="34" r="1.5" fill="white" />

              <motion.circle
                cx="50"
                cy="48"
                r="4.2"
                fill="#FFD166"
                animate={{ r: [3.5, 5.5, 3.5], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
              />
              <circle cx="50" cy="48" r="2" fill="white" />

              <motion.circle
                cx="30"
                cy="52"
                r="3.5"
                fill="#5C9E50"
                animate={{ r: [3, 4.5, 3], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
              />
              <circle cx="30" cy="52" r="1.5" fill="white" />

              <motion.circle
                cx="70"
                cy="52"
                r="3.5"
                fill="#2A9D8F"
                animate={{ r: [3, 4.5, 3], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              />
              <circle cx="70" cy="52" r="1.5" fill="white" />

              <motion.circle
                cx="38"
                cy="68"
                r="3.5"
                fill="#1E5F60"
                animate={{ r: [3, 4.5, 3], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
              />
              <circle cx="38" cy="68" r="1.5" fill="white" />

              <motion.circle
                cx="62"
                cy="68"
                r="3.5"
                fill="#E76F51"
                animate={{ r: [3, 4.5, 3], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              />
              <circle cx="62" cy="68" r="1.5" fill="white" />
            </svg>
          </div>
        </div>

        {/* 2. BADGE PILL (Flexible width with extra padding) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1E5F60] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-teal-900/20 max-w-full"
        >
          <Sparkles className="w-4 h-4 fill-white flex-shrink-0" />
          <span className="break-words leading-tight">{t('landing.badgeText', 'COGNITIVE CARE PLATFORM')}</span>
        </motion.div>

        {/* 3. HEADING: Responsive text size with generous line height */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] bg-clip-text text-transparent pb-1 max-w-3xl"
        >
          {t('landing.heading', 'SmritiCare')}
        </motion.h1>

        {/* 4. TAGLINE */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-3 text-base sm:text-lg md:text-xl text-slate-700 font-semibold leading-relaxed max-w-2xl mx-auto"
        >
          {t('landing.tagline', "AI-powered memory care, rooted in North East India's heritage")}
        </motion.p>

        {/* 5. LANGUAGE SELECTION SECTION (Flexible Responsive Grid) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          className="mt-8 w-full max-w-4xl flex flex-col items-center"
        >
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-2">
            <span>{t('landing.chooseLanguage', 'Choose your language')}</span>
          </h2>

          <div
            id="tour-language-selector"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full"
          >
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.id;

              return (
                <motion.button
                  key={lang.id}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.id)}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                  className={`min-h-[105px] p-4 rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer border-2 text-center group ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#1E5F60] via-[#2A9D8F] to-[#458C73] text-white border-transparent shadow-[0_12px_28px_-4px_rgba(42,157,143,0.45)] ring-2 ring-[#2A9D8F]/30'
                      : 'bg-white/75 hover:bg-white/90 text-slate-800 border-teal-700/20 hover:border-teal-700/50 shadow-sm backdrop-blur-xl'
                  }`}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white text-[#1E5F60] flex items-center justify-center shadow-md"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Globe
                    className={`w-5 h-5 mb-1.5 transition-colors duration-200 ${
                      isSelected ? 'text-white' : 'text-teal-700 group-hover:text-teal-800'
                    }`}
                  />

                  <span className="text-base font-bold tracking-tight leading-snug break-words">
                    {lang.name}
                  </span>

                  {lang.native && (
                    <span
                      className={`text-xs font-medium mt-0.5 transition-colors leading-tight break-words ${
                        isSelected ? 'text-white/90' : 'text-slate-500'
                      }`}
                    >
                      {lang.native}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* 6. CONTINUE BUTTON (Flexible natural growth, padding-based sizing) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="mt-8 sm:mt-10 w-full flex flex-col items-center"
        >
          <motion.button
            id="tour-continue-btn"
            type="button"
            onClick={handleContinue}
            disabled={!selectedLanguage}
            whileHover={selectedLanguage ? { scale: 1.03 } : {}}
            whileTap={selectedLanguage ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            className={`min-h-[56px] min-w-[200px] py-4 px-10 rounded-full font-bold text-lg sm:text-xl tracking-wide inline-flex items-center justify-center gap-3 transition-all duration-200 group leading-snug break-words ${
              selectedLanguage
                ? 'bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white shadow-[0_14px_35px_-6px_rgba(42,157,143,0.5)] cursor-pointer hover:opacity-95'
                : 'bg-slate-200/80 text-slate-400 border border-slate-300/60 cursor-not-allowed opacity-60 shadow-none'
            }`}
          >
            <span>{t('landing.continue', 'Continue')}</span>
            <ArrowRight
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                selectedLanguage ? 'group-hover:translate-x-1.5' : ''
              }`}
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
