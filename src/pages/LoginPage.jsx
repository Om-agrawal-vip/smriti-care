import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Calendar,
  Globe,
  Heart,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage, userProfile, updateProfile } = useApp();
  const { t } = useTranslation();

  const [name, setName] = useState(userProfile?.name || 'Arup Bordoloi');
  const [age, setAge] = useState(userProfile?.age || 72);
  const [language, setLanguage] = useState(selectedLanguage || userProfile?.language || 'English');
  const [caregiver, setCaregiver] = useState(userProfile?.caregiver || '');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  const languageOptions = [
    { id: 'English', label: 'English', native: 'English' },
    { id: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
    { id: 'Assamese', label: 'Assamese', native: 'অসমীয়া' },
    { id: 'Meitei/Manipuri', label: 'Meitei/Manipuri', native: 'ꯃꯤꯇꯩꯂꯣꯟ' },
    { id: 'Mizo', label: 'Mizo', native: 'Mizo ṭawng' },
  ];

  const isValid = name.trim().length > 0 && age > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    updateProfile({
      name: name.trim(),
      age: Number(age),
      language,
      caregiver: caregiver.trim() || 'Not provided',
    });
    setSelectedLanguage(language);

    navigate('/home');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full min-h-[92vh] flex flex-col items-center justify-center px-4 py-8 md:py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[500px] bg-white/70 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/80 shadow-[0_30px_90px_-15px_rgba(30,95,96,0.25)] p-6 sm:p-9 md:p-10 flex flex-col relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50]" />

        {/* Top Bar: Back Arrow & Language Confirmation Pill */}
        <div className="w-full flex items-center justify-between mb-4">
          <motion.button
            type="button"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.08, x: -2 }}
            whileTap={{ scale: 0.94 }}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-teal-800 flex items-center justify-center shadow-sm border border-teal-800/10 transition-colors cursor-pointer"
            title="Back to Language Selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E5F60] text-white text-xs font-bold shadow-sm tracking-wide">
            <Globe className="w-3.5 h-3.5" />
            <span>{language}</span>
          </div>
        </div>

        {/* Decorative Family Care Connection SVG Illustration */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center my-1"
        >
          <div className="w-28 h-20 relative flex items-center justify-center">
            <svg
              viewBox="0 0 120 80"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="elderGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E5F60" />
                  <stop offset="100%" stopColor="#2A9D8F" />
                </linearGradient>
                <linearGradient id="caregiverGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3D8F5A" />
                  <stop offset="100%" stopColor="#8FA876" />
                </linearGradient>
              </defs>

              <circle cx="42" cy="26" r="12" fill="url(#elderGrad)" />
              <path
                d="M 22 66 C 22 48 34 44 42 44 C 50 44 62 48 62 66"
                fill="url(#elderGrad)"
              />

              <circle cx="78" cy="22" r="10" fill="url(#caregiverGrad)" />
              <path
                d="M 62 66 C 62 48 70 42 78 42 C 86 42 98 48 98 66"
                fill="url(#caregiverGrad)"
              />

              <g transform="translate(54, 30)">
                <path
                  d="M 6 3 C 6 3 0 0 0 5 C 0 8.5 6 13 6 13 C 6 13 12 8.5 12 5 C 12 0 6 3 6 3 Z"
                  fill="#E76F51"
                />
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Heading & Subtext */}
        <motion.div variants={itemVariants} className="text-center space-y-1 mb-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] bg-clip-text text-transparent">
            {t('login.heading', "Let's get to know you")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {t('login.subtext', 'This helps us personalize your cognitive journey')}
          </p>
        </motion.div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* 1. Name Field */}
          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">
              {t('login.nameLabel', 'Your Name')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-700">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('login.namePlaceholder', 'e.g. Arup Bordoloi')}
                className="w-full min-h-[58px] pl-12 pr-4 bg-white/65 hover:bg-white/80 focus:bg-white text-slate-800 placeholder-slate-400 font-semibold text-base sm:text-lg rounded-2xl border-2 border-teal-800/20 focus:border-[#2A9D8F] focus:outline-none focus:ring-4 focus:ring-[#2A9D8F]/15 backdrop-blur-md transition-all shadow-sm"
              />
            </div>
          </motion.div>

          {/* 2. Age Field */}
          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">
              {t('login.ageLabel', 'Your Age')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-700">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="number"
                min="40"
                max="120"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t('login.agePlaceholder', 'e.g. 72')}
                className="w-full min-h-[58px] pl-12 pr-4 bg-white/65 hover:bg-white/80 focus:bg-white text-slate-800 placeholder-slate-400 font-semibold text-base sm:text-lg rounded-2xl border-2 border-teal-800/20 focus:border-[#2A9D8F] focus:outline-none focus:ring-4 focus:ring-[#2A9D8F]/15 backdrop-blur-md transition-all shadow-sm"
              />
            </div>
          </motion.div>

          {/* 3. Preferred Language Dropdown */}
          <motion.div variants={itemVariants} className="space-y-1 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">
              {t('login.langLabel', 'Preferred Language')}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="w-full min-h-[58px] pl-12 pr-4 bg-white/65 hover:bg-white/80 text-left text-slate-800 font-semibold text-base sm:text-lg rounded-2xl border-2 border-teal-800/20 focus:border-[#2A9D8F] focus:outline-none focus:ring-4 focus:ring-[#2A9D8F]/15 backdrop-blur-md transition-all shadow-sm flex items-center justify-between cursor-pointer"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-700">
                  <Globe className="w-5 h-5" />
                </div>
                <span>{language}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl border-2 border-teal-800/20 shadow-xl overflow-hidden z-30 py-1.5"
                  >
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setLanguage(opt.id);
                          setSelectedLanguage(opt.id);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left font-semibold text-base flex items-center justify-between transition-colors cursor-pointer ${
                          language === opt.id
                            ? 'bg-teal-50 text-[#1E5F60] font-bold'
                            : 'text-slate-700 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{opt.label}</span>
                          <span className="text-xs text-slate-400">({opt.native})</span>
                        </div>
                        {language === opt.id && (
                          <Check className="w-4 h-4 text-[#1E5F60] stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 4. Caregiver Connect */}
          <motion.div variants={itemVariants} className="space-y-1 pt-1">
            <div className="flex items-center justify-between ml-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {t('login.caregiverLabel', 'Caregiver Connect')}
              </label>
              <span className="text-xs font-semibold text-slate-500">
                {t('login.caregiverSub', 'Optional — family link')}
              </span>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </div>
              <input
                type="text"
                value={caregiver}
                onChange={(e) => setCaregiver(e.target.value)}
                placeholder={t('login.caregiverPlaceholder', "Caregiver's phone or email")}
                className="w-full min-h-[58px] pl-12 pr-4 bg-white/65 hover:bg-white/80 focus:bg-white text-slate-800 placeholder-slate-400 font-semibold text-base sm:text-lg rounded-2xl border-2 border-teal-800/20 focus:border-[#2A9D8F] focus:outline-none focus:ring-4 focus:ring-[#2A9D8F]/15 backdrop-blur-md transition-all shadow-sm"
              />
            </div>
          </motion.div>

          {/* 5. Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              type="submit"
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className={`w-full min-h-[58px] py-4 px-8 rounded-full font-bold text-lg sm:text-xl tracking-wide inline-flex items-center justify-center gap-3 transition-all duration-200 group ${
                isValid
                  ? 'bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white shadow-[0_14px_35px_-6px_rgba(42,157,143,0.5)] cursor-pointer hover:opacity-95'
                  : 'bg-slate-200/80 text-slate-400 border border-slate-300/60 cursor-not-allowed opacity-60 shadow-none'
              }`}
            >
              <span>{t('login.continue', 'Continue to Journey')}</span>
              <ArrowRight
                className={`w-5 h-5 transition-transform duration-200 ${
                  isValid ? 'group-hover:translate-x-1.5' : ''
                }`}
              />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
