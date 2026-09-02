import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AppTutorialGuide from './AppTutorialGuide';

export const Layout = ({ children }) => {
  const location = useLocation();
  const { soundEnabled, toggleSound, openOverviewModal } = useApp();

  return (
    <div className="min-h-screen w-full text-slate-800 flex flex-col justify-center items-center relative overflow-hidden selection:bg-[#4A7C7C]/30">
      {/* Top Right Floating Controls (Guide / Tutorial + Sound Toggle) */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2.5">
        {/* Interactive App Guide / Tutorial Button */}
        <motion.button
          id="tour-guide-btn"
          type="button"
          onClick={openOverviewModal}
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          className="px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-teal-900 backdrop-blur-xl border-2 border-teal-800/20 shadow-md flex items-center gap-2 cursor-pointer transition-all group"
          title="App Tutorial & Guide (उपयोग गाइड)"
        >
          <div className="w-5 h-5 rounded-full bg-[#1E5F60] text-white flex items-center justify-center text-xs font-black">
            ?
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline text-[#1E5F60] group-hover:text-teal-700">
            Guide / ट्यूटोरियल
          </span>
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-amber-400"
          />
        </motion.button>

        {/* Floating Sound On/Off Toggle */}
        <motion.button
          id="tour-sound-btn"
          type="button"
          onClick={toggleSound}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="p-2.5 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-teal-800 backdrop-blur-xl border-2 border-teal-800/15 shadow-md flex items-center justify-center cursor-pointer transition-colors"
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-[#1E5F60]" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </motion.button>
      </div>

      {/* 
        =======================================================================
        1. VIBRANT LIVING AURORA MESH CANVAS
        =======================================================================
      */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#FAF5EE] via-[#F0F7F4] to-[#FBF0E8]">
        {/* Blob 1: Deep Ocean Teal (#1E5F60) - Top Left drifting */}
        <motion.div
          animate={{
            x: [-60, 120, 30, -90, -60],
            y: [-40, 80, 140, 20, -40],
            scale: [1, 1.25, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#1E5F60] to-[#2E8B8B] opacity-50 blur-[90px] transform-gpu"
        />

        {/* Blob 2: Lush Tropical Sage & Emerald (#489E68) - Bottom Right */}
        <motion.div
          animate={{
            x: [50, -130, -30, 90, 50],
            y: [30, -90, -140, -40, 30],
            scale: [1, 1.2, 0.88, 1.18, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: 1,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-36 -right-32 w-[750px] h-[750px] rounded-full bg-gradient-to-bl from-[#3D8F5A] via-[#7CBF6B] to-[#4A937D] opacity-55 blur-[100px] transform-gpu"
        />

        {/* Blob 3: Radiant Sunset Coral & Gold (#F37055) - Top Right */}
        <motion.div
          animate={{
            x: [40, -100, -160, 50, 40],
            y: [-30, 70, -20, 80, -30],
            scale: [1, 1.3, 1.05, 0.92, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            delay: 0.5,
            ease: 'easeInOut',
          }}
          className="absolute -top-24 right-[5%] w-[620px] h-[620px] rounded-full bg-gradient-to-br from-[#F37055] via-[#F89C58] to-[#FFD166] opacity-50 blur-[90px] transform-gpu"
        />

        {/* Blob 4: Mystical Assam Dusk Violet & Indigo (#6A4C93) - Bottom Left */}
        <motion.div
          animate={{
            x: [-40, 90, 140, -40, -40],
            y: [50, -50, 40, -80, 50],
            scale: [1, 1.18, 1.28, 0.95, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            delay: 2,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-24 left-[8%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#6A4C93] via-[#8B5FBF] to-[#5390D9] opacity-45 blur-[95px] transform-gpu"
        />

        {/* Floating Center Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#2A9D8F] via-[#E76F51] to-[#E9C46A] opacity-40 blur-[110px] transform-gpu"
        />

        {/* 
          =======================================================================
          2. NORTH EAST INDIAN GEOMETRIC TEXTILE / WEAVE MOTIF SVG PATTERN (4-6% OPACITY)
          =======================================================================
        */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none stroke-[#1E5F60] opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="ne-weave-motif" width="56" height="56" patternUnits="userSpaceOnUse">
              <polygon points="28,2 54,28 28,54 2,28" fill="none" strokeWidth="1.5" />
              <polygon points="28,12 44,28 28,44 12,28" fill="none" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="28" y1="22" x2="28" y2="34" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="28" x2="34" y2="28" strokeWidth="1.5" strokeLinecap="round" />
              <polyline points="0,6 6,0 12,0" fill="none" strokeWidth="1" />
              <polyline points="56,6 50,0 44,0" fill="none" strokeWidth="1" />
              <polyline points="0,50 6,56 12,56" fill="none" strokeWidth="1" />
              <polyline points="56,50 50,56 44,56" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ne-weave-motif)" />
        </svg>

        {/* Subtle Film Grain Noise Texture */}
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col justify-center items-center z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1 flex flex-col items-center justify-center"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Interactive App Tutorial & Onboarding Guide */}
      <AppTutorialGuide />
    </div>
  );
};

export default Layout;
