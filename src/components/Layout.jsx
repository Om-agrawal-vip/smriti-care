import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AppTutorialGuide from './AppTutorialGuide';

export const Layout = ({ children }) => {
  const location = useLocation();
  const { soundEnabled, toggleSound, openOverviewModal } = useApp();

  return (
    <div className="min-h-screen w-full text-slate-800 flex flex-col items-center relative overflow-x-hidden selection:bg-[#4A7C7C]/30 bg-[#FAF5EE]">
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
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
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
        1. VIBRANT LIVING AURORA MESH CANVAS (HIGH PERFORMANCE, ZERO BLINK)
        =======================================================================
      */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#FAF5EE] via-[#F0F7F4] to-[#FBF0E8]">
        {/* Blob 1: Deep Ocean Teal (#1E5F60) */}
        <div
          className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full radial-blob-teal opacity-45 transform-gpu animate-float-slow"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Blob 2: Lush Tropical Sage & Emerald (#489E68) */}
        <div
          className="absolute -bottom-28 -right-24 w-[650px] h-[650px] rounded-full radial-blob-sage opacity-50 transform-gpu animate-float-reverse"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Blob 3: Radiant Sunset Coral & Gold (#F37055) */}
        <div
          className="absolute -top-16 right-[10%] w-[520px] h-[520px] rounded-full radial-blob-coral opacity-40 transform-gpu animate-pulse-gentle"
          style={{ willChange: 'opacity' }}
        />

        {/* Blob 4: Mystical Assam Dusk Violet & Indigo (#6A4C93) */}
        <div
          className="absolute -bottom-16 left-[10%] w-[550px] h-[550px] rounded-full radial-blob-purple opacity-35 transform-gpu animate-float-slow"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* 
          =======================================================================
          2. NORTH EAST INDIAN GEOMETRIC TEXTILE / WEAVE MOTIF SVG PATTERN (4-6% OPACITY)
          =======================================================================
        */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none stroke-[#1E5F60] opacity-[0.04]"
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
      </div>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full flex-1 flex flex-col items-center justify-start"
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
