import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const Mascot = ({
  size = 80,
  mood = 'idle', // 'idle' | 'happy' | 'thinking'
  waving = false,
  className = '',
}) => {
  // Eye variations based on mood
  const renderEyes = () => {
    if (mood === 'happy') {
      return (
        <g>
          {/* Left Happy Curved Eye Arc */}
          <path
            d="M 33 46 Q 40 38 47 46"
            stroke="#1A3838"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Happy Curved Eye Arc */}
          <path
            d="M 53 46 Q 60 38 67 46"
            stroke="#1A3838"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cute pink cheek blushes */}
          <ellipse cx="30" cy="52" rx="4" ry="2.5" fill="#E76F51" opacity="0.6" />
          <ellipse cx="70" cy="52" rx="4" ry="2.5" fill="#E76F51" opacity="0.6" />
        </g>
      );
    }

    if (mood === 'thinking') {
      return (
        <g>
          {/* Left Eye White */}
          <circle cx="40" cy="46" r="9" fill="white" stroke="#1E5F60" strokeWidth="1.5" />
          {/* Pupil looking top-right */}
          <circle cx="43" cy="43" r="4.5" fill="#1A3838" />
          <circle cx="45" cy="41" r="1.5" fill="white" />

          {/* Right Eye White */}
          <circle cx="60" cy="46" r="9" fill="white" stroke="#1E5F60" strokeWidth="1.5" />
          {/* Pupil looking top-right */}
          <circle cx="63" cy="43" r="4.5" fill="#1A3838" />
          <circle cx="65" cy="41" r="1.5" fill="white" />
        </g>
      );
    }

    // Default 'idle' with occasional slow blink animation
    return (
      <motion.g
        animate={{
          scaleY: [1, 1, 0.1, 1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          times: [0, 0.9, 0.94, 0.98, 1],
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '50px 46px' }}
      >
        {/* Left Eye */}
        <circle cx="40" cy="46" r="9" fill="white" stroke="#1E5F60" strokeWidth="1.5" />
        <circle cx="40" cy="46" r="4.5" fill="#1A3838" />
        <circle cx="42" cy="44" r="1.5" fill="white" />

        {/* Right Eye */}
        <circle cx="60" cy="46" r="9" fill="white" stroke="#1E5F60" strokeWidth="1.5" />
        <circle cx="60" cy="46" r="4.5" fill="#1A3838" />
        <circle cx="62" cy="44" r="1.5" fill="white" />
      </motion.g>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Happy Sparkle Particles */}
      {mood === 'happy' && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], y: [-5, -20] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-3 -right-2 text-amber-500 pointer-events-none"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], y: [-5, -18] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.7 }}
            className="absolute -top-2 -left-2 text-emerald-500 pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </>
      )}

      {/* Thinking Thought Bubbles */}
      {mood === 'thinking' && (
        <motion.div
          animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-4 -right-3 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-full border border-teal-800/20 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E5F60] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#5C9E50] animate-bounce" style={{ animationDelay: '300ms' }} />
        </motion.div>
      )}

      {/* Main Mascot Floating Container */}
      <motion.div
        animate={
          mood === 'happy'
            ? {
                y: [0, -10, 0],
                rotate: [-3, 3, -3],
              }
            : {
                y: [0, -5, 0],
              }
        }
        transition={{
          duration: mood === 'happy' ? 1.6 : 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-full h-full flex items-center justify-center filter drop-shadow-md"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Body Teal-to-Sage Gradient */}
            <linearGradient id="owlBodyGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E5F60" />
              <stop offset="50%" stopColor="#2A9D8F" />
              <stop offset="100%" stopColor="#5C9E50" />
            </linearGradient>

            {/* Belly Soft Cream Gradient */}
            <linearGradient id="owlBellyGrad" x1="30" y1="45" x2="70" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EAF4F0" />
            </linearGradient>

            {/* Wing Gradient */}
            <linearGradient id="owlWingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#174A4B" />
              <stop offset="100%" stopColor="#257E73" />
            </linearGradient>
          </defs>

          {/* Ear Tufts on Head */}
          <path d="M 28 28 L 20 12 L 36 22 Z" fill="#1E5F60" stroke="#174A4B" strokeWidth="1" />
          <path d="M 72 28 L 80 12 L 64 22 Z" fill="#1E5F60" stroke="#174A4B" strokeWidth="1" />

          {/* Feet */}
          <ellipse cx="40" cy="88" rx="6" ry="3.5" fill="#E76F51" />
          <ellipse cx="60" cy="88" rx="6" ry="3.5" fill="#E76F51" />

          {/* Left Wing */}
          <motion.path
            d="M 20 48 C 14 55 14 68 22 75 C 24 68 24 55 20 48 Z"
            fill="url(#owlWingGrad)"
            animate={
              waving
                ? {
                    rotate: [0, -25, 0, -25, 0],
                  }
                : {}
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '22px 50px' }}
          />

          {/* Right Wing */}
          <path
            d="M 80 48 C 86 55 86 68 78 75 C 76 68 76 55 80 48 Z"
            fill="url(#owlWingGrad)"
          />

          {/* Owl Body */}
          <circle cx="50" cy="52" r="36" fill="url(#owlBodyGrad)" stroke="#174A4B" strokeWidth="1.5" />

          {/* Chest / Belly Feathers (Soft Cream) */}
          <ellipse cx="50" cy="62" rx="22" ry="19" fill="url(#owlBellyGrad)" />

          {/* Small Decorative Breast Chevron Pattern */}
          <path d="M 45 60 L 50 64 L 55 60" stroke="#2A9D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
          <path d="M 43 68 L 50 73 L 57 68" stroke="#2A9D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />

          {/* Eyes (Dynamically Rendered per mood) */}
          {renderEyes()}

          {/* Orange Beak */}
          <polygon points="50,50 44,57 56,57" fill="#E76F51" />
          <polygon points="50,57 46,55 54,55" fill="#D95D39" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Mascot;
