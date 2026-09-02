import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Bell,
  Mic,
  MicOff,
  TrendingUp,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  Volume2,
  Send,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Mascot from '../components/Mascot';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';
import voiceAssistant from '../utils/voiceAssistant';
import soundFx from '../utils/audio';

export const HomePage = () => {
  const navigate = useNavigate();
  const { userProfile, levelProgress } = useApp();
  const { t, langCode } = useTranslation();

  const [activeModal, setActiveModal] = useState(null); // 'reminders' | 'voice' | null

  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [manualInput, setManualInput] = useState('');

  // Determine time-based greeting & icon
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { text: t('home.goodMorning', 'Good Morning'), icon: Sun };
    } else if (hour < 17) {
      return { text: t('home.goodAfternoon', 'Good Afternoon'), icon: Sunset };
    } else {
      return { text: t('home.goodEvening', 'Good Evening'), icon: Moon };
    }
  };

  const greeting = getGreetingData();
  const GreetingIcon = greeting.icon;

  const mockReminders = [
    {
      id: 1,
      title: 'Morning Wellness & Water',
      time: '9:00 AM',
      note: 'Hydration & daily vitamins',
      done: true,
    },
    {
      id: 2,
      title: 'Family Video Call with Ananya',
      time: '5:00 PM',
      note: 'Catch up with daughter & grandchildren',
      done: false,
    },
    {
      id: 3,
      title: 'Evening Tea Garden Memory Walk',
      time: '6:30 PM',
      note: '15 mins gentle walking & recap',
      done: false,
    },
  ];

  // Initialize Voice Assistant Language
  useEffect(() => {
    voiceAssistant.setLanguage(langCode === 'hi' ? 'hi' : 'en');
  }, [langCode]);

  // Handle Voice Assistant Trigger
  const handleStartVoice = () => {
    soundFx.playTap();
    setTranscript('');
    setAssistantReply('');
    setIsListening(true);

    voiceAssistant.startListening({
      onStart: () => setIsListening(true),
      onResult: ({ transcript: text, isFinal }) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 0) {
          executeVoiceQuery(text);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setAssistantReply(
          langCode === 'hi'
            ? 'माइक्रोफ़ोन एक्सेस नहीं मिला। आप नीचे टाइप कर सकते हैं।'
            : 'Could not access microphone. You can type your request below.'
        );
      },
      onEnd: () => setIsListening(false),
    });
  };

  const handleStopVoice = () => {
    soundFx.playTap();
    voiceAssistant.stopListening();
    setIsListening(false);
    if (transcript.trim().length > 0) {
      executeVoiceQuery(transcript);
    }
  };

  // Process user command and speak back
  const executeVoiceQuery = (queryText) => {
    const result = voiceAssistant.processCommand({
      query: queryText,
      userProfile,
      levelProgress,
      langCode,
    });

    setAssistantReply(result.reply);
    setIsListening(false);
    setIsSpeaking(true);

    const speechLang = langCode === 'hi' ? 'hi-IN' : 'en-IN';
    voiceAssistant.speak(result.reply, speechLang, () => {
      setIsSpeaking(false);
      // Optional Action Execution after assistant finishes speaking
      if (result.action === 'NAVIGATE_PROGRESS') {
        setTimeout(() => navigate('/progress'), 800);
      } else if (result.action === 'NAVIGATE_LEVELS') {
        setTimeout(() => navigate('/levels'), 800);
      } else if (result.action === 'SHOW_REMINDERS') {
        setTimeout(() => setActiveModal('reminders'), 800);
      }
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    executeVoiceQuery(manualInput);
    setManualInput('');
  };

  const quickPrompts = [
    { label: langCode === 'hi' ? '📊 मेरा स्कोर क्या है?' : "📊 What's my score?", query: 'score' },
    { label: langCode === 'hi' ? '🎮 खेल शुरू करें' : "🎮 Play today's game", query: 'play game' },
    { label: langCode === 'hi' ? '⏰ आज के रिमाइंडर' : "⏰ Today's reminders", query: 'reminders' },
    { label: langCode === 'hi' ? '👋 नमस्ते' : '👋 Hello Smriti', query: 'hello' },
  ];

  return (
    <div className="w-full min-h-[92vh] flex flex-col items-center justify-center px-4 py-8 md:py-12 relative">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/80 shadow-[0_30px_90px_-15px_rgba(30,95,96,0.25)] p-6 sm:p-10 md:p-12 flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

        {/* 1. PERSONALIZED GREETING SECTION */}
        <div className="space-y-3 max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1E5F60] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-teal-900/20 max-w-full">
            <GreetingIcon className="w-4 h-4 text-[#FFD166] flex-shrink-0" />
            <span className="leading-tight break-words">{greeting.text}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] bg-clip-text text-transparent pb-1">
            {t('home.welcomeBack', 'Welcome back')}, {userProfile?.name?.split(' ')[0] || 'Friend'}!
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-700 font-semibold leading-relaxed">
            {t('home.readyMessage', "Ready for today's cultural memory exercise?")}
          </p>
        </div>

        {/* 2. MAIN "LET'S START" HERO CARD */}
        <div className="relative my-4 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-[#1E5F60] via-[#2A9D8F] to-[#E76F51] opacity-50 blur-xl -z-10 pointer-events-none"
          />

          <motion.button
            id="tour-start-game"
            type="button"
            onClick={() => {
              soundFx.playTap();
              navigate('/levels');
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-52 h-52 sm:w-60 sm:h-60 rounded-[2.5rem] bg-gradient-to-br from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white p-5 shadow-[0_20px_50px_-8px_rgba(30,95,96,0.45)] border-2 border-white/40 flex flex-col items-center justify-center gap-3 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-white text-white ml-1" />
            </div>

            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide drop-shadow-sm leading-tight break-words px-2 text-center">
              {t('home.letsStart', "Let's Start")}
            </span>
          </motion.button>
        </div>

        {/* 3. SECONDARY OPTIONS ROW (3 CARDS) */}
        <div className="mt-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Reminders */}
          <motion.button
            id="tour-reminders-card"
            type="button"
            onClick={() => {
              soundFx.playTap();
              setActiveModal('reminders');
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="min-h-[115px] p-4 sm:p-5 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-xl border-2 border-teal-800/20 hover:border-[#2A9D8F] shadow-sm flex flex-col items-center justify-center text-center relative transition-all group cursor-pointer"
          >
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#E76F51]/15 text-[#E76F51] border border-[#E76F51]/30 text-xs font-extrabold leading-normal">
              {t('home.remindersToday', '2 today')}
            </span>

            <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/15 text-[#1E5F60] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-bold text-slate-800 leading-snug break-words">
              {t('home.reminders', 'Reminders')}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 leading-tight break-words">
              {t('home.remindersSub', 'Daily health & calls')}
            </span>
          </motion.button>

          {/* Card 2: Voice Assistance (Real Speech-to-Speech) */}
          <motion.button
            id="tour-voice-card"
            type="button"
            onClick={() => {
              soundFx.playTap();
              setActiveModal('voice');
              setTranscript('');
              setAssistantReply('');
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="min-h-[115px] p-4 sm:p-5 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-xl border-2 border-teal-800/20 hover:border-[#2A9D8F] shadow-sm flex flex-col items-center justify-center text-center relative transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-800 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform flex-shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-bold text-slate-800 leading-snug break-words">
              {t('home.voiceAssistance', 'Voice Assistant')}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 leading-tight break-words">
              {t('home.voiceSub', 'Real multilingual AI speech')}
            </span>
          </motion.button>

          {/* Card 3: My Progress */}
          <motion.button
            id="tour-progress-card"
            type="button"
            onClick={() => {
              soundFx.playTap();
              navigate('/progress');
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="min-h-[115px] p-4 sm:p-5 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-xl border-2 border-teal-800/20 hover:border-[#2A9D8F] shadow-sm flex flex-col items-center justify-center text-center relative transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-bold text-slate-800 leading-snug break-words">
              {t('home.myProgress', 'My Progress')}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 leading-tight break-words">
              {t('home.myProgressSub', 'Stats & cognitive score')}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* 4. SMALL MASCOT COMPANION (BOTTOM-RIGHT) */}
      <motion.div
        id="tour-mascot"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="fixed bottom-6 right-6 hidden md:flex items-center gap-2.5 bg-white/85 backdrop-blur-xl py-2 px-4 rounded-full border-2 border-teal-800/20 shadow-lg z-20 max-w-xs"
      >
        <Mascot size={55} mood="idle" />
        <div className="flex flex-col text-left pr-1 leading-tight">
          <span className="text-xs font-black text-slate-800 break-words">{t('home.companionTitle', 'Smriti Owl')}</span>
          <span className="text-[10px] font-bold text-[#2A9D8F] break-words">{t('home.companionReady', 'Ready to Play!')}</span>
        </div>
      </motion.div>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal === 'reminders' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[2rem] border-2 border-teal-800/20 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/20 text-[#1E5F60] flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{t('home.reminders', 'Daily Reminders')}</h3>
                    <p className="text-xs font-semibold text-slate-500">Gentle schedule for {userProfile?.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 space-y-3">
                {mockReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      rem.done
                        ? 'bg-slate-50/80 border-slate-200 opacity-70'
                        : 'bg-teal-50/60 border-teal-800/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {rem.done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Clock className="w-5 h-5 text-[#2A9D8F] flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className={`text-base font-bold ${rem.done ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {rem.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">{rem.note}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-900 bg-teal-100/80 px-2.5 py-1 rounded-full text-center">
                      {rem.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3.5 px-6 rounded-full bg-[#1E5F60] text-white font-bold text-base hover:bg-[#2A9D8F] transition-colors shadow-md cursor-pointer"
                >
                  {t('home.closeReminders', 'Close Reminders')}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 🌟 REAL WORKING SMRITI VOICE ASSISTANT MODAL 🌟 */}
        {activeModal === 'voice' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border-2 border-white shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 via-[#2A9D8F] to-[#E76F51]" />

              {/* Close Button */}
              <div className="w-full flex items-center justify-between pb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Cognitive Voice</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    voiceAssistant.stopListening();
                    setActiveModal(null);
                  }}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Central Interactive Microphone with Wave Ripples */}
              <div className="relative my-6 flex items-center justify-center">
                {isListening && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-28 h-28 rounded-full bg-purple-500/30"
                    />
                    <motion.div
                      animate={{ scale: [1, 2.3, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                      className="absolute w-28 h-28 rounded-full bg-[#2A9D8F]/25"
                    />
                  </>
                )}

                <motion.button
                  type="button"
                  onClick={isListening ? handleStopVoice : handleStartVoice}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 relative z-10 ${
                    isListening
                      ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-red-500/30 ring-4 ring-rose-300'
                      : isSpeaking
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-teal-500/30 ring-4 ring-teal-200'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/30'
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-11 h-11 animate-pulse" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-11 h-11 animate-bounce" />
                  ) : (
                    <Mic className="w-11 h-11" />
                  )}
                </motion.button>
              </div>

              {/* Status Header */}
              <h3 className="text-2xl font-black text-slate-800">
                {isListening
                  ? langCode === 'hi' ? 'सुन रही हूँ... बोलिए' : 'Listening... Speak now'
                  : isSpeaking
                  ? langCode === 'hi' ? 'स्मृति बोल रही है...' : 'Smriti is speaking...'
                  : langCode === 'hi' ? 'स्मृति आवाज़ सहायक' : 'Smriti Voice Assistant'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                {isListening
                  ? langCode === 'hi' ? 'बोलने के बाद रुकें या माइक पर टैप करें' : 'Speak naturally or tap mic when done'
                  : langCode === 'hi' ? 'माइक पर टैप करें या नीचे दिए विकल्प चुनें' : 'Tap the microphone or choose a quick prompt'}
              </p>

              {/* Realtime Transcript Display */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-700 text-sm font-semibold max-w-md w-full text-left"
                >
                  <span className="text-xs font-black uppercase text-slate-400 block mb-1">
                    {langCode === 'hi' ? 'आपने कहा:' : 'You said:'}
                  </span>
                  "{transcript}"
                </motion.div>
              )}

              {/* Assistant Reply Card */}
              {assistantReply && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-[#2A9D8F]/30 text-teal-950 text-sm sm:text-base font-bold text-left max-w-md w-full shadow-sm flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1E5F60] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div className="leading-snug">
                    <span className="text-xs font-black text-[#1E5F60] uppercase block mb-0.5">
                      Smriti Care
                    </span>
                    {assistantReply}
                  </div>
                </motion.div>
              )}

              {/* Quick Action Prompt Chips */}
              <div className="mt-5 w-full">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2 text-left">
                  {langCode === 'hi' ? 'त्वरित प्रश्न / Quick Prompts:' : 'Quick Prompts:'}
                </span>
                <div className="flex flex-wrap gap-2 justify-start">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundFx.playTap();
                        setTranscript(p.label);
                        executeVoiceQuery(p.query);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-teal-50 border border-teal-800/15 hover:border-[#2A9D8F] text-xs font-bold text-slate-700 hover:text-teal-900 transition-colors shadow-sm cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Input Fallback Form */}
              <form onSubmit={handleManualSubmit} className="mt-4 w-full flex items-center gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder={
                    langCode === 'hi'
                      ? 'या यहाँ टाइप करें (उदा. मेरा स्कोर)...'
                      : 'Or type here (e.g. play game)...'
                  }
                  className="flex-1 min-h-[44px] px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#2A9D8F] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="min-h-[44px] px-4 rounded-xl bg-[#1E5F60] hover:bg-[#2A9D8F] disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
