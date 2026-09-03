import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Gamepad2,
  Mic,
  Bell,
  TrendingUp,
  Volume2,
  VolumeX,
  Globe,
  Layers,
  Award,
  BookOpen,
  PartyPopper,
  Flame,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Mascot from './Mascot';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';
import soundFx from '../utils/audio';
import voiceAssistant from '../utils/voiceAssistant';

// Multi-language complete tutorial translations (100% Pure Clean English & Regional Translations)
const TUTORIAL_I18N = {
  en: {
    guideTitle: 'Smriti Guide',
    stepOf: 'Step {current} of {total}',
    completeTourBadge: 'Tour Completed! 🌟',
    btnStartTour: 'Start Guided Tour 🚀',
    btnSkip: 'Skip',
    btnBack: 'Back',
    btnNext: 'Next',
    btnDone: 'Finish Tour 🎉',
    btnListenVoice: 'Listen Audio',
    btnSpeaking: 'Speaking...',
    welcomePopupTitle: 'Welcome! Would you like a 1-minute interactive tour?',
    welcomePopupDesc:
      'Learn how to easily play cultural memory games, track progress, and use the multilingual voice assistant!',
    clickHereBadge: '👉 Click Here',
    manualTitle: 'SmritiCare Complete User Manual',
    manualSub: 'Interactive guide & usage instructions for new members',
    tabQuick: '🌟 Quick Start',
    tabGames: '🎮 Games & Levels',
    tabVoice: '🎙️ Voice AI',
    tabReminders: '⏰ Reminders',
    tabProgress: '📊 Progress',
    liveTourBtn: '🎯 Start Live Arrow Tour',
    closeBtn: 'Close',
    steps: [
      {
        id: 'welcome',
        targetId: null,
        page: '/',
        title: 'Welcome to SmritiCare!',
        desc: 'This platform is thoughtfully designed for cognitive wellness, brain training, and memory care rooted in cultural heritage. Let’s take a 1-minute guided tour!',
        speech: 'Welcome to SmritiCare! Let us take a quick 1-minute guided tour to explore how to use the app.',
        arrowDirection: 'center',
      },
      {
        id: 'language',
        targetId: 'tour-language-selector',
        page: '/',
        title: '1. Select Preferred Language',
        desc: 'Choose your native language (English, Hindi, Assamese, Manipuri, Mizo). The entire app, voice cues, and games will adapt instantly.',
        speech: 'First, select your preferred language. The entire app will adapt to your choice.',
        arrowDirection: 'down',
        action: (navigate) => navigate('/home'),
      },
      {
        id: 'start-game',
        targetId: 'tour-start-game',
        page: '/home',
        title: '2. "Let\'s Start" - Play Daily Memory Games',
        desc: 'Tap this big button to open the level map and start today’s tailored cognitive workout!',
        speech: 'Tap the Let’s Start button to open the level map and start today’s brain exercise.',
        arrowDirection: 'up',
      },
      {
        id: 'reminders',
        targetId: 'tour-reminders-card',
        page: '/home',
        title: '3. Daily Medication & Care Reminders',
        desc: 'Keep track of scheduled medications, hydration alerts, doctor visits, and family video calls.',
        speech: 'Here you can check your daily medication schedules and family call reminders.',
        arrowDirection: 'up',
      },
      {
        id: 'voice',
        targetId: 'tour-voice-card',
        page: '/home',
        title: '4. AI Multilingual Voice Assistant',
        desc: 'Tap the mic to talk with Smriti in your language! Ask "What is my score?", "Play game", or "Reminders".',
        speech: 'Use the AI Voice Assistant to speak naturally with Smriti without typing anything.',
        arrowDirection: 'up',
      },
      {
        id: 'progress',
        targetId: 'tour-progress-card',
        page: '/home',
        title: '5. Progress & Cognitive Accuracy Card',
        desc: 'View daily memory accuracy %, recall speeds, milestones, and unlockable achievement badges.',
        speech: 'Check your memory accuracy graphs, scores, and achievement medals here.',
        arrowDirection: 'up',
        action: (navigate) => navigate('/levels'),
      },
      {
        id: 'levels-path',
        targetId: 'tour-levels-path',
        page: '/levels',
        title: '6. 10 Cultural Levels & Grand Finale',
        desc: 'Journey through 10 unique North East cultural stages with milestones at Level 5 and Level 10!',
        speech: 'Explore 10 cultural stages with milestone crowns at Level 5 and Level 10. You are all set!',
        arrowDirection: 'down',
      },
    ],
    manual: {
      quickTitle: '🎯 SmritiCare Purpose & Overview',
      quickDesc:
        'SmritiCare is an AI-powered cognitive care platform designed for seniors and individuals experiencing memory challenges. It combines culturally rooted memory exercises, scheduled medication alerts, and speech recognition to enhance brain agility and mental focus.',
      quickSteps: [
        {
          title: '1. Select Language',
          desc: 'Choose your preferred language to adapt the entire application, games, and voice instructions.',
        },
        {
          title: "2. Tap 'Let's Start'",
          desc: 'Play daily tailored memory games designed to improve recall precision and cognitive speed.',
        },
        {
          title: '3. Multilingual Voice Assistant',
          desc: 'Speak directly to Smriti using your microphone to get scores, reminders, or play games without typing.',
        },
        {
          title: '4. Track Progress & Medals',
          desc: 'Monitor cognitive improvements, accuracy percentages, and unlock milestone achievement badges.',
        },
      ],
      gamesTitle: '🎮 10 Cultural Memory Stages',
      gamesDesc:
        "Journey through 10 unique cognitive chapters rooted in North East India's rich heritage:",
      levels: [
        {
          level: 'Level 1',
          name: 'Tea Garden Memory Match',
          desc: 'Visual recall of tea leaves, gardens, and harvesting patterns',
          isMilestone: false,
        },
        {
          level: 'Level 2',
          name: 'Bihu Rhythm Patterns',
          desc: 'Auditory and rhythm sequence recall',
          isMilestone: false,
        },
        {
          level: 'Level 5',
          name: 'Brahmaputra Story Echoes',
          desc: 'Narrative recall and milestone crown challenge',
          isMilestone: true,
        },
        {
          level: 'Level 10',
          name: 'North East Grand Journey',
          desc: 'Grand Finale mastering all cognitive skills',
          isMilestone: true,
        },
      ],
      voiceTitle: '🎙️ Multilingual AI Voice Assistant',
      voiceDesc:
        'Tap the microphone on the Home page to speak naturally. You can ask:',
      voicePrompts: [
        'What is my score today?',
        "Play today's memory game",
        'Show my daily reminders',
        'Hello Smriti, how are you?',
      ],
      remindersTitle: '⏰ Daily Medication & Routine Reminders',
      remindersDesc:
        'Easily manage scheduled medications, hydration alerts, doctor consultations, and scheduled family check-in calls.',
      remindersTip:
        '💡 Caregiver Benefit: Completed reminders get marked with a green checkmark so family members know medications have been taken on time.',
      progressTitle: '📊 Cognitive Scores & Accuracy Analytics',
      progressDesc:
        'The Progress page calculates your average accuracy percentage, recall reaction time, and awards milestone achievement medals.',
    },
  },

  hi: {
    guideTitle: 'स्मृति गाइड',
    stepOf: 'कदम {current} / {total}',
    completeTourBadge: 'ट्यूटोरियल पूरा हुआ! 🌟',
    btnStartTour: 'ट्यूटोरियल शुरू करें 🚀',
    btnSkip: 'छोड़ें',
    btnBack: 'पिछला',
    btnNext: 'अगला',
    btnDone: 'समाप्त करें 🎉',
    btnListenVoice: 'आवाज़ में सुनें',
    btnSpeaking: 'बोल रही है...',
    welcomePopupTitle: 'नमस्ते! क्या आप 1-मिनट का ऐप ट्यूटोरियल देखना चाहेंगे?',
    welcomePopupDesc:
      'सीखें कि कैसे आसानी से सांस्कृतिक मेमोरी गेम्स खेलें, स्कोर देखें और AI आवाज़ सहायक का उपयोग करें!',
    clickHereBadge: '👉 यहाँ देखें',
    manualTitle: 'स्मृतिकेयर सम्पूर्ण उपयोग गाइड',
    manualSub: 'नए सदस्यों व परिवारों के लिए इंटरएक्टिव मार्गदर्शिका',
    tabQuick: '🌟 त्वरित शुरुआत',
    tabGames: '🎮 गेम्स व लेवल्स',
    tabVoice: '🎙️ वॉइस AI',
    tabReminders: '⏰ रिमाइंडर्स',
    tabProgress: '📊 प्रोग्रेस',
    liveTourBtn: '🎯 लाइव एरो ट्यूटोरियल शुरू करें',
    closeBtn: 'बंद करें',
    steps: [
      {
        id: 'welcome',
        targetId: null,
        page: '/',
        title: 'स्मृतिकेयर में आपका स्वागत है!',
        desc: 'यह ऐप याददाश्त, ध्यान और मानसिक स्वास्थ्य को मजबूत बनाए रखने के लिए बनाया गया है। आइए 1 मिनट में समझें इसे कैसे इस्तेमाल करना है!',
        speech: 'स्मृतिकेयर में आपका स्वागत है! आइए एक मिनट के टूर में समझें कि ऐप को कैसे इस्तेमाल करना है।',
        arrowDirection: 'center',
      },
      {
        id: 'language',
        targetId: 'tour-language-selector',
        page: '/',
        title: '1. अपनी भाषा चुनें',
        desc: 'अपनी पसंदीदा भाषा (हिन्दी, English, Assamese, Manipuri, Mizo) चुनें। पूरा ऐप उसी भाषा में चलेगा।',
        speech: 'सबसे पहले अपनी पसंदीदा भाषा चुनें। पूरा ऐप आपकी चुनी भाषा में चलेगा।',
        arrowDirection: 'down',
        action: (navigate) => navigate('/home'),
      },
      {
        id: 'start-game',
        targetId: 'tour-start-game',
        page: '/home',
        title: '2. "Let\'s Start" - आज का खेल शुरू करें',
        desc: 'इस बड़े बटन पर क्लिक करके आप सीधे आज के दिमागी कसरत और मेमोरी गेम्स पर जा सकते हैं।',
        speech: 'लेट्स स्टार्ट बटन दबाकर आज के मेमोरी गेम्स और दिमागी कसरत शुरू करें।',
        arrowDirection: 'up',
      },
      {
        id: 'reminders',
        targetId: 'tour-reminders-card',
        page: '/home',
        title: '3. दैनिक रिमाइंडर्स',
        desc: 'यहाँ से आप दवाइयों का समय, डॉक्टर विज़िट, और परिवार से बात करने के अलर्ट्स देख सकते हैं।',
        speech: 'यहाँ आप दैनिक दवाइयों का समय और ज़रूरी रिमाइंडर्स देख सकते हैं।',
        arrowDirection: 'up',
      },
      {
        id: 'voice',
        targetId: 'tour-voice-card',
        page: '/home',
        title: '4. AI वॉइस असिस्टेंट (बोलकर चलाएं)',
        desc: 'माइक दबाकर बोलें: "मेरा स्कोर क्या है?", "खेल शुरू करो" या "दवाइयों का समय बताओ"। ऐप खुद बोलकर उत्तर देगा!',
        speech: 'माइक दबाकर आप बिना टाइप किए सीधे अपनी आवाज़ में स्मृति से बात कर सकते हैं।',
        arrowDirection: 'up',
      },
      {
        id: 'progress',
        targetId: 'tour-progress-card',
        page: '/home',
        title: '5. प्रोग्रेस व स्कोर कार्ड',
        desc: 'यहाँ आपकी रोजाना की याददाश्त, सटीकता (Accuracy %), और मिले हुए मेडल्स का पूरा ग्राफ रहता है।',
        speech: 'यहाँ अपनी याददाश्त का स्कोर, एक्यूरेसी ग्राफ और मेडल्स देखें।',
        arrowDirection: 'up',
        action: (navigate) => navigate('/levels'),
      },
      {
        id: 'levels-path',
        targetId: 'tour-levels-path',
        page: '/levels',
        title: '6. 10 सांस्कृतिक लेवल्स व माइलस्टोन्स',
        desc: 'चाय बागान, बिहू, माजुली द्वीप जैसे 10 खूबसूरत अध्यायों को खेलें। 5वें और 10वें लेवल पर विशेष क्राउन है!',
        speech: 'पूर्वोत्तर भारत के 10 सुंदर लेवल्स खेलें। लेवल 5 और 10 पर स्पेशल क्राउन है।',
        arrowDirection: 'down',
      },
    ],
    manual: {
      quickTitle: '🎯 स्मृतिकेयर का मुख्य उद्देश्य',
      quickDesc:
        'स्मृतिकेयर बुजुर्गों और याददाश्त संबंधी चुनौतियों का सामना कर रहे व्यक्तियों के लिए खास AI-संचालित प्लेटफॉर्म है।',
      quickSteps: [
        {
          title: '1. भाषा चुनें',
          desc: 'अपनी मनपसंद भाषा चुनें ताकि पूरा ऐप आपकी अपनी भाषा में चले।',
        },
        {
          title: "2. 'Let's Start' दबाएं",
          desc: 'रोज़ाना 10-15 मिनट का खेल खेलें जिससे याददाश्त सक्रिय रहे।',
        },
        {
          title: '3. वॉइस असिस्टेंट का उपयोग',
          desc: 'माइक पर बोलकर सीधे जानकारी या गेम शुरू करें।',
        },
        {
          title: '4. प्रोग्रेस रिपोर्ट देखें',
          desc: 'सटीकता (Accuracy %) और मेडल का ग्राफ देखें।',
        },
      ],
      gamesTitle: '🎮 10 सांस्कृतिक मेमोरी लेवल्स',
      gamesDesc: 'पूर्वोत्तर भारत की संस्कृति पर आधारित 10 दिमागी गेम्स:',
      levels: [
        {
          level: 'Level 1',
          name: 'चाय बागान मेमोरी मैच',
          desc: 'चाय पत्तियों और प्राकृतिक दृश्यों की याददाश्त',
          isMilestone: false,
        },
        {
          level: 'Level 2',
          name: 'बिहू ताल और ध्वनि पैटर्न',
          desc: 'पारंपरिक संगीत ताल का स्मरण',
          isMilestone: false,
        },
        {
          level: 'Level 5',
          name: 'ब्रह्मपुत्र कथा स्मृति (क्राउन माइलस्टोन)',
          desc: 'कहानियों और घटनाओं का अनुक्रम',
          isMilestone: true,
        },
        {
          level: 'Level 10',
          name: 'ग्रैंड नॉर्थ-ईस्ट जर्नी (ग्रैंड फिनाले)',
          desc: 'सम्पूर्ण दिमागी कौशल का अंतिम अध्याय',
          isMilestone: true,
        },
      ],
      voiceTitle: '🎙️ AI वॉइस असिस्टेंट',
      voiceDesc: 'माइक दबाकर आप निम्नलिखित पूछ सकते हैं:',
      voicePrompts: [
        'स्मृति, मेरा स्कोर क्या है?',
        'आज का खेल शुरू करो',
        'दवाइयों का समय क्या है?',
        'नमस्ते स्मृति',
      ],
      remindersTitle: '⏰ दैनिक रिमाइंडर्स',
      remindersDesc: 'दवाइयों और डॉक्टर के समय का पूरा ध्यान रखें।',
      remindersTip:
        '💡 टिप: दवा लेने के बाद रिमाइंडर पर टिक मार्क लग जाता है।',
      progressTitle: '📊 प्रोग्रेस रिपोर्ट',
      progressDesc: 'मेमोरी एक्यूरेसी ग्राफ और लगातार खेलने के मेडल्स देखें।',
    },
  },

  as: {
    guideTitle: 'স্মৃতি গাইড',
    stepOf: 'পদক্ষেপ {current} / {total}',
    completeTourBadge: 'টিউটৰিয়েল সমাপ্ত হ’ল! 🌟',
    btnStartTour: 'টিউটৰিয়েল আৰম্ভ কৰক 🚀',
    btnSkip: 'বাদ দিয়ক',
    btnBack: 'পূৰ্বৱৰ্তী',
    btnNext: 'পৰৱৰ্তী',
    btnDone: 'সমাপ্ত কৰক 🎉',
    btnListenVoice: 'অডিঅ’ শুনক',
    btnSpeaking: 'কৈ আছে...',
    welcomePopupTitle: 'নমস্কাৰ! আপুনি ১ মিনিটৰ নিৰ্দেশনা চাব বিচাৰেনে?',
    welcomePopupDesc:
      'সাংস্কৃতিক স্মৃতি খেলসমূহ কেনেকৈ খেলিব লাগে আৰু ভয়েচ এছিষ্টেণ্ট কেনেকৈ ব্যৱহাৰ কৰিব লাগে জানক!',
    clickHereBadge: '👉 ইয়াত ক্লিক কৰক',
    manualTitle: 'স্মৃতিকিয়াৰ ব্যৱহাৰ গাইড',
    manualSub: 'নতুন সদস্যৰ বাবে নিৰ্দেশাৱলী',
    tabQuick: '🌟 আৰম্ভণি',
    tabGames: '🎮 খেল আৰু স্তৰ',
    tabVoice: '🎙️ ভইচ এআই',
    tabReminders: '⏰ ৰিমাইণ্ডাৰ',
    tabProgress: '📊 অগ্ৰগতি',
    liveTourBtn: '🎯 লাইভ তীৰ ট্যুৰ আৰম্ভ কৰক',
    closeBtn: 'বন্ধ কৰক',
    steps: [
      {
        id: 'welcome',
        targetId: null,
        page: '/',
        title: 'স্মৃতিকিয়াৰলৈ স্বাগতম!',
        desc: 'এই এপটো স্মৃতি আৰু মনোযোগ বৃদ্ধিৰ বাবে তৈয়াৰ কৰা হৈছে। আহক ১ মিনিটত শিকোঁ!',
        speech: 'স্মৃতিকিয়াৰলৈ আপোনাক স্বাগতম! আহক এপটো কেনেকৈ ব্যৱহাৰ কৰিব লাগে শিকোঁ।',
        arrowDirection: 'center',
      },
      {
        id: 'language',
        targetId: 'tour-language-selector',
        page: '/',
        title: '১. ভাষা বাছনি কৰক',
        desc: 'আপোনাৰ মাতৃভাষা বাছনি কৰক। সমগ্ৰ এপটো আপোনাৰ ভাষাত চলিব।',
        speech: 'প্ৰথমে আপোনাৰ পছন্দৰ ভাষা বাছনি কৰক।',
        arrowDirection: 'down',
        action: (navigate) => navigate('/home'),
      },
      {
        id: 'start-game',
        targetId: 'tour-start-game',
        page: '/home',
        title: '২. "Let\'s Start" - খেল আৰম্ভ কৰক',
        desc: 'এই বুটামত ক্লিক কৰি পোনে পোনে স্মৃতি খেল আৰম্ভ কৰক।',
        speech: 'লেটছ ষ্টাৰ্ট বুটাম টিপি আজিৰ স্মৃতি খেল আৰম্ভ কৰক।',
        arrowDirection: 'up',
      },
      {
        id: 'reminders',
        targetId: 'tour-reminders-card',
        page: '/home',
        title: '৩. দৈনিক ৰিমাইণ্ডাৰ',
        desc: 'ঔষধৰ সময় আৰু পৰিয়ালৰ যোগাযোগৰ জাননী চাওক।',
        speech: 'ইয়াত ঔষধৰ সময় আৰু জাননীসমূহ পাব।',
        arrowDirection: 'up',
      },
      {
        id: 'voice',
        targetId: 'tour-voice-card',
        page: '/home',
        title: '৪. এআই ভইচ এছিষ্টেণ্ট',
        desc: 'মাইক টিপি কথা কওক: "মোৰ নম্বৰ কিমান?", "খেল আৰম্ভ কৰক"।',
        speech: 'মাইক টিপি আপুনি পোনপটীয়াকৈ স্মৃতিৰ লগত কথা পাতিব পাৰে।',
        arrowDirection: 'up',
      },
      {
        id: 'progress',
        targetId: 'tour-progress-card',
        page: '/home',
        title: '৫. অগ্ৰগতিৰ বিৱৰণ',
        desc: 'দৈনিক স্মৃতিৰ উন্নতি আৰু মেডেলৰ তালিকা চাওক।',
        speech: 'ইয়াত আপোনাৰ স্মৃতিৰ অগ্ৰগতি আৰু মেডেল চাওক।',
        arrowDirection: 'up',
        action: (navigate) => navigate('/levels'),
      },
      {
        id: 'levels-path',
        targetId: 'tour-levels-path',
        page: '/levels',
        title: '৬. ১০ টা সাংস্কৃতিক স্তৰ',
        desc: 'চাহ বাগিচা, বিহু, মাজুলীৰ ১০ টা স্তৰ উপভোগ কৰক!',
        speech: 'উত্তৰ-পূৰ্বাঞ্চলৰ ১০ টা সুন্দৰ স্তৰ খেলক আৰু উপভোগ কৰক।',
        arrowDirection: 'down',
      },
    ],
  },

  mni: {
    guideTitle: 'স্মৃতি গাইদ',
    stepOf: 'স্তপ {current} / {total}',
    completeTourBadge: 'তুতোরিএল লোইরে! 🌟',
    btnStartTour: 'তুতোরিএল হৌদোকউ 🚀',
    btnSkip: 'থাদোকউ',
    btnBack: 'তুংলোইবা',
    btnNext: 'মখা তাবা',
    btnDone: 'লোইশিনবা 🎉',
    btnListenVoice: 'খোন্থোক তাউ',
    btnSpeaking: 'ঙাংলি...',
    welcomePopupTitle: 'খুরুমজরি! মিনিত ১ গী তুতোরিএল য়েংবা পাম্বিব্রা?',
    welcomePopupDesc: 'স্মৃতিক্যের এপসি করম্না শীজিন্নগদগে খঙমিনসি!',
    clickHereBadge: '👉 মফমসিদা ক্লিক তৌউ',
    manualTitle: 'স্মৃতিক্যের শীজিন্নবগী গাইদ',
    manualSub: 'অনৌবা মীওইশিংগী লম্বী তাকপা',
    tabQuick: '🌟 হৌদোকপা',
    tabGames: '🎮 শান্নপোৎ',
    tabVoice: '🎙️ ভোইস এআই',
    tabReminders: '⏰ নীংশিংবা',
    tabProgress: '📊 চাওখৎপা',
    liveTourBtn: '🎯 লাইভ তেন তুতোরিএল',
    closeBtn: 'থিংশিনবা',
    steps: [
      {
        id: 'welcome',
        targetId: null,
        page: '/',
        title: 'স্মৃতিক্যেরদা তরাম্না ওকচরি!',
        desc: 'পুখল অমসুং নীংশিংবা ফগৎনবা শেম্বা এপনি। হৌজিক খঙমিনসি!',
        speech: 'স্মৃতিক্যেরদা তরাম্না ওকচরি! এপসি করম্না শীজিন্নগদগে খঙমিনসি।',
        arrowDirection: 'center',
      },
      {
        id: 'language',
        targetId: 'tour-language-selector',
        page: '/',
        title: '১. লোন খনবীয়ু',
        desc: 'নহাক্কী পাম্বা লোন খনবীয়ু। এপসি অপাম্বা লোনদা চৎকনি।',
        speech: 'অহানবদা অপাম্বা লোন খনসি।',
        arrowDirection: 'down',
        action: (navigate) => navigate('/home'),
      },
      {
        id: 'start-game',
        targetId: 'tour-start-game',
        page: '/home',
        title: '২. "Let\'s Start" - শান্নবা হৌউ',
        desc: 'বটনসি নম্বীরগা নীংশিং শান্নপোৎ হৌদোকউ।',
        speech: 'বটনসি নম্বীরগা শান্নবা হৌদোকউ।',
        arrowDirection: 'up',
      },
      {
        id: 'reminders',
        targetId: 'tour-reminders-card',
        page: '/home',
        title: '৩. নুমিৎ খুদিংগী নীংশিংবা',
        desc: 'হিদাক চাবগী মতম অমসুং নোতিস য়েংউ।',
        speech: 'হিদাক চাবগী মতমশিং মসিদা য়েংউ।',
        arrowDirection: 'up',
      },
      {
        id: 'voice',
        targetId: 'tour-voice-card',
        page: '/home',
        title: '৪. এআই ভোইস এসিস্তেন্ত',
        desc: 'মাইক নম্বীরগা স্মৃতিগা ৱারী শাউ।',
        speech: 'মাইক নম্বীরগা স্মৃতিগা ৱারী শাউ।',
        arrowDirection: 'up',
      },
      {
        id: 'progress',
        targetId: 'tour-progress-card',
        page: '/home',
        title: '৫. চাওখৎপগী চার্ত',
        desc: 'নীংশিংবা ফগৎলকপগী স্কোর য়েংউ।',
        speech: 'স্কোর অমসুং মেদলশিং মসিদা য়েংউ।',
        arrowDirection: 'up',
        action: (navigate) => navigate('/levels'),
      },
      {
        id: 'levels-path',
        targetId: 'tour-levels-path',
        page: '/levels',
        title: '৬. থাক ১০ গী শান্নপোৎ',
        desc: 'নর্থ ইষ্টকী তোঙান তোঙানবা থাক ১০ শান্নউ!',
        speech: 'থাক ১০ শান্নদুনা নুংঙাইবা লৌউ।',
        arrowDirection: 'down',
      },
    ],
  },

  lus: {
    guideTitle: 'Smriti Kaihhruaina',
    stepOf: 'Step {current} / {total}',
    completeTourBadge: 'Tour i zo ta! 🌟',
    btnStartTour: 'Inzirna Ṭan Rawh 🚀',
    btnSkip: 'Kan Rawh',
    btnBack: 'Hnunglam',
    btnNext: 'Hmalawm',
    btnDone: 'Zo Ta 🎉',
    btnListenVoice: 'Aw Ngaihthlak',
    btnSpeaking: 'Sawi Mek...',
    welcomePopupTitle: 'Chibai! Minit 1 chhung app hman dan zir i duh em?',
    welcomePopupDesc:
      'Hriatrengna tihhmasawnna games leh aw hmanga biak theihna zir rawh le!',
    clickHereBadge: '👉 Hetah Hmet Rawh',
    manualTitle: 'SmritiCare Hman Dan Bu',
    manualSub: 'Member tharte tana inkaihhruaina kimchang',
    tabQuick: '🌟 Bulṭanna',
    tabGames: '🎮 Games & Levels',
    tabVoice: '🎙️ Aw AI',
    tabReminders: '⏰ Hriattirna',
    tabProgress: '📊 Hmasawnna',
    liveTourBtn: '🎯 Thal Kaihhruaina Ṭan Rawh',
    closeBtn: 'Khar Rawh',
    steps: [
      {
        id: 'welcome',
        targetId: null,
        page: '/',
        title: 'SmritiCare-ah Kan Lo Lawm A Che!',
        desc: 'He app hi thluak leh hriatrengna tichak tura siam a ni. Minit 1 chhungin i zir ang le!',
        speech: 'SmritiCare-ah kan lo lawm a che. App hman dan i zir ho ang le.',
        arrowDirection: 'center',
      },
      {
        id: 'language',
        targetId: 'tour-language-selector',
        page: '/',
        title: '1. Tawng Thlan Tur',
        desc: 'I duhber ṭawng thlang rawh. App pum hi i ṭawng thlanna angin a inthlak ang.',
        speech: 'I ṭawng hman duhber thlang hmasa rawh le.',
        arrowDirection: 'down',
        action: (navigate) => navigate('/home'),
      },
      {
        id: 'start-game',
        targetId: 'tour-start-game',
        page: '/home',
        title: '2. "Let\'s Start" - Games Ṭan Rawh',
        desc: 'He button lian tak hmet hian vawiin games i khel nghal thei ang.',
        speech: 'Let’s Start button hmetin games khel ṭan rawh le.',
        arrowDirection: 'up',
      },
      {
        id: 'reminders',
        targetId: 'tour-reminders-card',
        page: '/home',
        title: '3. Damdawi Hriattirna',
        desc: 'Damdawi ei hun leh chhungte biak hun hriattirna hetah a awm.',
        speech: 'Damdawi ei hun leh hriattirnate hetah a en theih e.',
        arrowDirection: 'up',
      },
      {
        id: 'voice',
        targetId: 'tour-voice-card',
        page: '/home',
        title: '4. AI Aw Ṭanpuitu',
        desc: 'Mic hmetin Smriti be rawh: "Ka score engzat nge?", "Game ṭan rawh".',
        speech: 'Mic hmetin Smriti aw ngeiin i be thei e.',
        arrowDirection: 'up',
      },
      {
        id: 'progress',
        targetId: 'tour-progress-card',
        page: '/home',
        title: '5. Hmasawnna Enna',
        desc: 'I hriatrengna ṭhat chhoh dan leh medal lakte en rawh.',
        speech: 'I hmasawnna leh medal dawnte hetah en rawh le.',
        arrowDirection: 'up',
        action: (navigate) => navigate('/levels'),
      },
      {
        id: 'levels-path',
        targetId: 'tour-levels-path',
        page: '/levels',
        title: '6. Level 10 Cultural Games',
        desc: 'North East hmun hmingthang 10 hmangin thluak tichak rawh!',
        speech: 'Level 10 thleng hlim takin khel ang che.',
        arrowDirection: 'down',
      },
    ],
  },
};

const LANGUAGES_LIST = [
  { id: 'English', code: 'en', name: 'English', native: 'English' },
  { id: 'Hindi', code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { id: 'Assamese', code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { id: 'Meitei/Manipuri', code: 'mni', name: 'Meitei/Manipuri', native: 'ꯃꯤꯇꯩꯂꯣꯟ' },
  { id: 'Mizo', code: 'lus', name: 'Mizo', native: 'Mizo ṭawng' },
];

export const AppTutorialGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { langCode } = useTranslation();
  const {
    selectedLanguage,
    setSelectedLanguage,
    isTourOpen,
    tourStep,
    nextTourStep,
    prevTourStep,
    closeTour,
    startInteractiveTour,
    isOverviewModalOpen,
    openOverviewModal,
    closeOverviewModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState('welcome');
  const [hasPromptedNewUser, setHasPromptedNewUser] = useState(false);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [tourCompletedCheer, setTourCompletedCheer] = useState(false);

  // Active locale strings dictionary
  const currentLangCode = useMemo(() => {
    return TUTORIAL_I18N[langCode] ? langCode : 'en';
  }, [langCode]);

  const strings = useMemo(() => {
    return TUTORIAL_I18N[currentLangCode] || TUTORIAL_I18N.en;
  }, [currentLangCode]);

  const tourSteps = strings.steps;
  const currentStepData = tourSteps[tourStep] || tourSteps[0];

  // First-time prompt trigger
  useEffect(() => {
    const seen = localStorage.getItem('smriticare_new_user_tour_seen');
    if (!seen && !hasPromptedNewUser) {
      const timer = setTimeout(() => {
        setShowWelcomePrompt(true);
        setHasPromptedNewUser(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasPromptedNewUser]);

  // Update target rect coordinates & position
  useEffect(() => {
    if (!isTourOpen) {
      setTargetRect(null);
      setIsNarrating(false);
      return;
    }

    const currentStep = tourSteps[tourStep];
    if (!currentStep) return;

    if (currentStep.page && location.pathname !== currentStep.page) {
      navigate(currentStep.page);
    }

    const updateRect = () => {
      if (!currentStep.targetId) {
        setTargetRect(null);
        return;
      }
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          rawTop: rect.top,
          rawLeft: rect.left,
        });
      } else {
        setTargetRect(null);
      }
    };

    // Scroll into view gently only ONCE when step changes
    const initialTimer = setTimeout(() => {
      if (currentStep.targetId) {
        const el = document.getElementById(currentStep.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      updateRect();
    }, 200);

    let resizeThrottleTimer = null;
    const throttledUpdateRect = () => {
      if (!resizeThrottleTimer) {
        resizeThrottleTimer = setTimeout(() => {
          resizeThrottleTimer = null;
          updateRect();
        }, 100);
      }
    };

    window.addEventListener('resize', throttledUpdateRect, { passive: true });
    window.addEventListener('scroll', throttledUpdateRect, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      if (resizeThrottleTimer) clearTimeout(resizeThrottleTimer);
      window.removeEventListener('resize', throttledUpdateRect);
      window.removeEventListener('scroll', throttledUpdateRect);
    };
  }, [isTourOpen, tourStep, location.pathname, tourSteps]);

  // Voice Narration trigger for step
  const handleVoiceNarration = () => {
    if (isNarrating) {
      voiceAssistant.stopSpeaking();
      setIsNarrating(false);
      return;
    }

    soundFx.playTap();
    setIsNarrating(true);

    const speechText = currentStepData.speech || currentStepData.desc;
    const speechLang = currentLangCode === 'hi' ? 'hi-IN' : 'en-IN';

    voiceAssistant.speak(speechText, speechLang, () => {
      setIsNarrating(false);
    });
  };

  const handleNext = () => {
    soundFx.playTap();
    if (isNarrating) {
      voiceAssistant.stopSpeaking();
      setIsNarrating(false);
    }

    if (currentStepData.action) {
      currentStepData.action(navigate);
    }

    if (tourStep < tourSteps.length - 1) {
      nextTourStep();
    } else {
      // Tour Finished
      soundFx.playVictory();
      setTourCompletedCheer(true);
      localStorage.setItem('smriticare_new_user_tour_seen', 'true');
      setTimeout(() => {
        setTourCompletedCheer(false);
        closeTour();
        navigate('/'); // Return to first page
      }, 2200);
    }
  };

  const handlePrev = () => {
    soundFx.playTap();
    if (isNarrating) {
      voiceAssistant.stopSpeaking();
      setIsNarrating(false);
    }
    if (tourStep > 0) {
      prevTourStep();
    }
  };

  const handleClose = () => {
    soundFx.playTap();
    if (isNarrating) {
      voiceAssistant.stopSpeaking();
      setIsNarrating(false);
    }
    localStorage.setItem('smriticare_new_user_tour_seen', 'true');
    closeTour();
    navigate('/'); // Return to first page
  };

  const handleLanguageChangeInTour = (langId) => {
    soundFx.playTap();
    setSelectedLanguage(langId);
  };

  return (
    <>
      {/* 
        ========================================================================
        1. FIRST-TIME USER INVITATION POPUP (MULTILINGUAL)
        ========================================================================
      */}
      <AnimatePresence>
        {showWelcomePrompt && !isTourOpen && !isOverviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border-3 border-teal-800/20 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

              <div className="my-2">
                <Mascot size={92} mood="happy" waving={true} />
              </div>

              {/* Language Switcher bar on welcome card */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 my-2">
                {LANGUAGES_LIST.map((l) => {
                  const isSel = (selectedLanguage || 'English') === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleLanguageChangeInTour(l.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#1E5F60] text-white shadow-sm ring-1 ring-[#2A9D8F]'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {l.native}
                    </button>
                  );
                })}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight mt-1">
                {strings.welcomePopupTitle}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-semibold mt-2.5 leading-relaxed">
                {strings.welcomePopupDesc}
              </p>

              <div className="mt-6 w-full flex flex-col sm:flex-row items-center gap-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    localStorage.setItem('smriticare_new_user_tour_seen', 'true');
                    setShowWelcomePrompt(false);
                    startInteractiveTour();
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white font-extrabold text-base shadow-lg shadow-teal-900/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{strings.btnStartTour}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    localStorage.setItem('smriticare_new_user_tour_seen', 'true');
                    setShowWelcomePrompt(false);
                  }}
                  className="w-full sm:w-auto py-3 px-5 rounded-full text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors cursor-pointer"
                >
                  {strings.btnSkip}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ========================================================================
        2. LIVE SPOTLIGHT & GAME-STYLE BOUNCING ARROW WALKTHROUGH
        ========================================================================
      */}
      <AnimatePresence>
        {isTourOpen && (
          <div className="fixed inset-0 z-[120] pointer-events-none">
            {/* Dimmed Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] pointer-events-auto"
              onClick={handleClose}
            />

            {/* Target Element Highlighted with Radar Pulse Ring */}
            {targetRect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  top: targetRect.rawTop - 8,
                  left: targetRect.rawLeft - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                }}
                className="fixed rounded-3xl border-3 border-[#FFD166] shadow-[0_0_40px_rgba(255,209,102,0.9)] pointer-events-none z-[125] ring-8 ring-[#FFD166]/20"
              >
                {/* Radar Waves */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.85, 0, 0.85] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-3xl border-2 border-[#FFD166]"
                />

                {/* Floating "👉 Click Here" Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-black text-xs shadow-lg uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{strings.clickHereBadge}</span>
                </motion.div>
              </motion.div>
            )}

            {/* ANIMATED BOUNCING NEON 3D ARROW POINTER */}
            {targetRect && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: [0, -14, 0],
                }}
                transition={{
                  y: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
                style={{
                  top:
                    currentStepData.arrowDirection === 'down'
                      ? targetRect.rawTop - 68
                      : targetRect.rawTop + targetRect.height + 12,
                  left: targetRect.rawLeft + targetRect.width / 2 - 24,
                }}
                className="fixed z-[130] pointer-events-none flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 text-slate-900 flex items-center justify-center shadow-[0_0_25px_rgba(255,209,102,0.95)] border-2 border-white ring-4 ring-amber-400/40">
                  <ArrowRight
                    className={`w-7 h-7 stroke-[3.5] transform ${
                      currentStepData.arrowDirection === 'down'
                        ? 'rotate-90'
                        : '-rotate-90'
                    }`}
                  />
                </div>
              </motion.div>
            )}

            {/* FLOATING INTERACTIVE TUTORIAL CARD WITH MASCOT & AUDIO */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 sm:w-[500px] bg-white/95 backdrop-blur-2xl rounded-[2.2rem] border-3 border-teal-800/30 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.45)] p-5 sm:p-6 z-[140] pointer-events-auto overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

              {/* Top Header: Mascot + Live Language Switcher + Audio Narration + Close */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 flex items-center justify-center -my-2">
                    <Mascot size={52} mood={isNarrating ? 'happy' : 'idle'} waving={isNarrating} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5F60] block leading-none">
                      {strings.guideTitle}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {strings.stepOf
                        .replace('{current}', tourStep + 1)
                        .replace('{total}', tourSteps.length)}
                    </span>
                  </div>
                </div>

                {/* Quick Language Switcher dropdown & Audio Narration button */}
                <div className="flex items-center gap-1.5">
                  {/* Language Selector in Tour */}
                  <select
                    value={selectedLanguage || 'English'}
                    onChange={(e) => handleLanguageChangeInTour(e.target.value)}
                    className="py-1 px-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                    title="Change Tutorial Language"
                  >
                    {LANGUAGES_LIST.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.native}
                      </option>
                    ))}
                  </select>

                  {/* Audio Voice Narration Button */}
                  <button
                    type="button"
                    onClick={handleVoiceNarration}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      isNarrating
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-teal-50 text-[#1E5F60] border-teal-200 hover:bg-teal-100'
                    }`}
                    title={isNarrating ? strings.btnSpeaking : strings.btnListenVoice}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    title={strings.closeBtn}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Middle: Content & Speech Bubble */}
              <div className="py-3.5 space-y-2 text-left">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-tight">
                  {currentStepData.title}
                </h3>

                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                  {currentStepData.desc}
                </p>

                {/* Voice narration indicator bar */}
                {isNarrating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-2 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4 text-[#1E5F60] animate-bounce" />
                    <span>{strings.btnSpeaking}</span>
                  </motion.div>
                )}
              </div>

              {/* Bottom Row: Navigation Controls & Step Dots */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={tourStep === 0}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{strings.btnBack}</span>
                </button>

                {/* Step Dots indicator */}
                <div className="flex items-center gap-1">
                  {tourSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === tourStep
                          ? 'w-6 bg-[#1E5F60]'
                          : idx < tourStep
                          ? 'w-2 bg-emerald-500'
                          : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="py-2.5 px-3 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {strings.btnSkip}
                  </button>

                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {tourStep === tourSteps.length - 1
                        ? strings.btnDone
                        : strings.btnNext}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ========================================================================
        3. TOUR COMPLETED CELEBRATION MODAL WITH CONFETTI XP BADGE
        ========================================================================
      */}
      <AnimatePresence>
        {tourCompletedCheer && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border-3 border-amber-400 p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-rose-500 to-teal-500" />

              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center shadow-xl mb-3"
              >
                <PartyPopper className="w-10 h-10" />
              </motion.div>

              <h2 className="text-3xl font-black text-slate-800">
                {strings.completeTourBadge}
              </h2>

              <p className="text-sm font-semibold text-slate-600 mt-2">
                You’re all set to begin your cognitive care journey!
              </p>

              <div className="mt-4 px-4 py-2 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Tutorial Master Badge Unlocked! 🎖️</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ========================================================================
        4. FULL USER MANUAL & HOW-TO GUIDE MODAL (WITH LIVE LANGUAGE SWITCHING)
        ========================================================================
      */}
      <AnimatePresence>
        {isOverviewModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-3xl max-h-[90vh] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border-3 border-teal-800/20 shadow-2xl flex flex-col relative overflow-hidden text-left"
            >
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

              {/* Modal Header */}
              <div className="p-6 sm:p-7 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1E5F60] text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                      {strings.manualTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                      {strings.manualSub}
                    </p>
                  </div>
                </div>

                {/* Header Controls: Language switcher pills + Close */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {LANGUAGES_LIST.map((l) => {
                      const isSel = (selectedLanguage || 'English') === l.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => handleLanguageChangeInTour(l.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#1E5F60] text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {l.native}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={closeOverviewModal}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Interactive Tabs Row */}
              <div className="px-6 pt-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none border-b border-slate-100 bg-slate-50/50">
                {[
                  { id: 'welcome', label: strings.tabQuick, icon: Sparkles },
                  { id: 'games', label: strings.tabGames, icon: Gamepad2 },
                  { id: 'voice', label: strings.tabVoice, icon: Mic },
                  { id: 'reminders', label: strings.tabReminders, icon: Bell },
                  { id: 'progress', label: strings.tabProgress, icon: TrendingUp },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        soundFx.playTap();
                        setActiveTab(tab.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1E5F60] text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700">
                {activeTab === 'welcome' && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/80 border-2 border-teal-800/15">
                      <h3 className="text-lg font-black text-[#1E5F60] mb-1">
                        {strings.manual?.quickTitle || '🎯 SmritiCare Purpose & Overview'}
                      </h3>
                      <p className="text-sm font-semibold leading-relaxed text-slate-700">
                        {strings.manual?.quickDesc || strings.steps[0]?.desc}
                      </p>
                    </div>

                    <h4 className="text-base font-black text-slate-800 pt-2">
                      ✨ Easy Step-by-Step Overview:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(strings.manual?.quickSteps || []).map((step, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold">
                          <span className="font-black text-[#1E5F60] block mb-1">{step.title}</span>
                          {step.desc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'games' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800">
                      {strings.manual?.gamesTitle || '🎮 10 Cultural Memory Stages'}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      {strings.manual?.gamesDesc || strings.steps[6]?.desc}
                    </p>
                    <ul className="space-y-2 text-xs font-bold text-slate-700">
                      {(strings.manual?.levels || []).map((lvl, idx) => (
                        <li
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            lvl.isMilestone
                              ? 'bg-amber-50/75 border-amber-800/20'
                              : 'bg-teal-50/70 border-teal-800/10'
                          }`}
                        >
                          {lvl.isMilestone ? (
                            <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          )}
                          <span>
                            <strong>{lvl.level}:</strong> {lvl.name} — <span className="font-normal text-slate-600">{lvl.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800">
                      {strings.manual?.voiceTitle || '🎙️ Multilingual AI Voice Assistant'}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      {strings.manual?.voiceDesc || 'Tap the microphone to speak naturally:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                      {(strings.manual?.voicePrompts || [
                        'What is my score today?',
                        "Play today's memory game",
                        'Show my daily reminders',
                        'Hello Smriti',
                      ]).map((prompt, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-purple-50 text-purple-950 border border-purple-200">
                          "{prompt}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reminders' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800">
                      {strings.manual?.remindersTitle || '⏰ Daily Medication & Routine Reminders'}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      {strings.manual?.remindersDesc}
                    </p>
                    {strings.manual?.remindersTip && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs font-semibold">
                        {strings.manual.remindersTip}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'progress' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800">
                      {strings.manual?.progressTitle || '📊 Cognitive Scores & Accuracy Analytics'}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      {strings.manual?.progressDesc}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    closeOverviewModal();
                    startInteractiveTour();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto py-3 px-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>{strings.liveTourBtn}</span>
                </motion.button>

                <button
                  type="button"
                  onClick={closeOverviewModal}
                  className="py-2.5 px-6 rounded-full bg-[#1E5F60] text-white font-bold text-xs sm:text-sm hover:bg-[#2A9D8F] transition-colors cursor-pointer"
                >
                  {strings.closeBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppTutorialGuide;
