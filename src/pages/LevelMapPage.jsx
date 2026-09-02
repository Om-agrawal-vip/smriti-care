import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Star,
  Crown,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

export const LevelMapPage = () => {
  const navigate = useNavigate();
  const { levelProgress } = useApp();
  const { t } = useTranslation();

  const completedCount = levelProgress.filter((lvl) => lvl.completed).length;

  const nodeOffsets = [-26, 0, 28, 34, 0, -34, -28, 0, 26, 0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.3, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 22,
      },
    },
  };

  return (
    <div className="w-full min-h-[92vh] flex flex-col items-center justify-start px-4 py-8 md:py-10 relative">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/80 shadow-[0_30px_90px_-15px_rgba(30,95,96,0.25)] p-6 sm:p-10 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

        {/* 1. HEADER SECTION */}
        <div className="w-full flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
          <motion.button
            type="button"
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.08, x: -2 }}
            whileTap={{ scale: 0.94 }}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-teal-800 flex items-center justify-center shadow-sm border border-teal-800/10 transition-colors cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] bg-clip-text text-transparent">
              {t('levelMap.heading', 'Choose Your Level')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {t('levelMap.subtext', 'Complete levels to strengthen your memory')}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#1E5F60] text-white text-xs sm:text-sm font-extrabold shadow-sm">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD166]" />
            <span>{completedCount}/{levelProgress.length}</span>
          </div>
        </div>

        {/* 2. WINDING LEVEL MAP PATH */}
        <div className="w-full relative py-6 flex flex-col items-center">
          <svg
            className="absolute top-8 left-0 w-full h-[1260px] pointer-events-none -z-0"
            viewBox="0 0 400 1260"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="
                M 100 40 
                C 100 100, 200 130, 200 180 
                C 200 230, 310 260, 310 320 
                C 310 380, 330 420, 330 470 
                C 330 520, 200 560, 200 610 
                C 200 660, 70 700, 70 750 
                C 70 800, 90 840, 90 890 
                C 90 940, 200 970, 200 1020 
                C 200 1070, 300 1100, 300 1150 
                C 300 1200, 200 1220, 200 1250
              "
              stroke="#2A9D8F"
              strokeWidth="16"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />
            <path
              d="
                M 100 40 
                C 100 100, 200 130, 200 180 
                C 200 230, 310 260, 310 320 
                C 310 380, 330 420, 330 470 
                C 330 520, 200 560, 200 610 
                C 200 660, 70 700, 70 750 
                C 70 800, 90 840, 90 890 
                C 90 940, 200 970, 200 1020 
                C 200 1070, 300 1100, 300 1150 
                C 300 1200, 200 1220, 200 1250
              "
              stroke="#1E5F60"
              strokeWidth="4"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating Decorative Elements Along the Road */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[220px] left-[15%] text-amber-500/40 pointer-events-none"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[620px] right-[15%] text-teal-600/40 pointer-events-none"
          >
            <Star className="w-7 h-7 fill-current" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-[920px] left-[18%] text-rose-500/35 pointer-events-none"
          >
            <Flame className="w-7 h-7" />
          </motion.div>

          {/* 10 Level Nodes */}
          <motion.div
            id="tour-levels-path"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col gap-12 sm:gap-14 items-center z-10"
          >
            {levelProgress.map((lvl, index) => {
              const isMilestone = lvl.level === 5 || lvl.level === 10;
              const isCompleted = lvl.completed;
              const xOffset = nodeOffsets[index] || 0;

              return (
                <motion.div
                  key={lvl.level}
                  variants={nodeVariants}
                  style={{
                    transform: `translateX(${xOffset}%)`,
                  }}
                  className="flex flex-col items-center group relative"
                >
                  {isMilestone && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-6 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 text-xs font-black shadow-md uppercase tracking-wider"
                    >
                      <Crown className="w-3.5 h-3.5 fill-current" />
                      <span>{lvl.level === 10 ? t('levelMap.grandFinale', 'Grand Finale') : t('levelMap.milestone', 'Milestone')}</span>
                    </motion.div>
                  )}

                  <motion.button
                    type="button"
                    onClick={() => navigate(`/game/${lvl.level}`)}
                    whileHover={{ scale: 1.12, y: -4 }}
                    whileTap={{ scale: 0.94 }}
                    className={`relative flex items-center justify-center rounded-full font-black cursor-pointer transition-all duration-200 ${
                      isMilestone
                        ? 'w-22 h-22 sm:w-24 sm:h-24 text-2xl sm:text-3xl'
                        : 'w-18 h-18 sm:w-20 sm:h-20 text-xl sm:text-2xl'
                    } ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white shadow-[0_12px_28px_-4px_rgba(42,157,143,0.55)] border-3 border-white/80 ring-4 ring-[#2A9D8F]/25'
                        : 'bg-white/80 hover:bg-white text-[#1E5F60] border-3 border-teal-800/30 hover:border-[#2A9D8F] shadow-md backdrop-blur-md'
                    }`}
                  >
                    {isCompleted && (
                      <motion.div
                        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -inset-2 rounded-full bg-[#2A9D8F]/30 blur-md -z-10"
                      />
                    )}

                    <span>{lvl.level}</span>

                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FFD166] text-slate-900 flex items-center justify-center shadow-md border-2 border-white">
                        <Star className="w-3.5 h-3.5 fill-slate-900" />
                      </div>
                    )}
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mt-2.5 px-3 py-1 rounded-xl bg-white/85 backdrop-blur-md border border-teal-800/15 shadow-sm text-center max-w-[200px]"
                  >
                    <span className="block text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                      {lvl.name}
                    </span>
                    {isCompleted && (
                      <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        {t('levelMap.completedBadge', 'Completed')}
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelMapPage;
