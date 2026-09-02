import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Heart,
  Star,
  Sun,
  Flower2,
  Leaf,
  Cloud,
  Moon,
  Fish,
  Trees,
  Sparkles,
  Flame,
  Music2,
  Compass,
  Play,
  Eye,
  Car,
  Umbrella,
  Armchair,
  Apple,
  Coffee,
  Bird,
  BookOpen,
  Key,
  Bike,
  Plane,
  Shirt,
  Glasses,
  Watch,
  Check,
  X,
  Circle,
  Square,
  Triangle,
  User,
  Crown,
  BookMarked,
  Delete,
  Zap,
} from 'lucide-react';
import Mascot from '../components/Mascot';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';
import soundFx from '../utils/audio';

// =======================================================================
// PALETTES & DATASETS ACROSS ALL 10 LEVELS
// =======================================================================

// 1. Memory Match Palette
const CARD_PALETTE = [
  { id: 'heart', icon: Heart, color: 'from-rose-500 to-pink-600' },
  { id: 'star', icon: Star, color: 'from-amber-400 to-yellow-500' },
  { id: 'sun', icon: Sun, color: 'from-orange-400 to-amber-500' },
  { id: 'flower', icon: Flower2, color: 'from-emerald-400 to-teal-500' },
  { id: 'leaf', icon: Leaf, color: 'from-teal-500 to-emerald-600' },
  { id: 'cloud', icon: Cloud, color: 'from-sky-400 to-blue-500' },
  { id: 'moon', icon: Moon, color: 'from-indigo-500 to-purple-600' },
  { id: 'fish', icon: Fish, color: 'from-cyan-400 to-teal-500' },
];

// 2. Sequence Recall Tiles
const SEQUENCE_TILES = [
  { id: 0, label: 'Teal Garden', color: 'from-[#1E5F60] to-[#2A9D8F]', activeColor: 'bg-[#38b2a3] shadow-[0_0_35px_#2A9D8F]', icon: Leaf },
  { id: 1, label: 'Sage Valley', color: 'from-[#3D8F5A] to-[#8FA876]', activeColor: 'bg-[#a3c988] shadow-[0_0_35px_#8FA876]', icon: Trees },
  { id: 2, label: 'Sunset Coral', color: 'from-[#E76F51] to-[#F4A261]', activeColor: 'bg-[#f7b078] shadow-[0_0_35px_#F4A261]', icon: Flame },
  { id: 3, label: 'Assam Twilight', color: 'from-[#6A4C93] to-[#9B8AA0]', activeColor: 'bg-[#b69fbe] shadow-[0_0_35px_#9B8AA0]', icon: Music2 },
];

// 3. Level 3: Object Recognition Dataset (5 Rounds)
const OBJECT_RECOGNITION_ROUNDS = [
  {
    target: { id: 'apple', label: 'Fresh Apple', icon: Apple },
    distractors: [
      { id: 'car', label: 'Motor Car', icon: Car },
      { id: 'umbrella', label: 'Umbrella', icon: Umbrella },
      { id: 'chair', label: 'Armchair', icon: Armchair },
    ],
  },
  {
    target: { id: 'coffee', label: 'Tea / Coffee Cup', icon: Coffee },
    distractors: [
      { id: 'bird', label: 'Songbird', icon: Bird },
      { id: 'key', label: 'Brass Key', icon: Key },
      { id: 'book', label: 'Story Book', icon: BookOpen },
    ],
  },
  {
    target: { id: 'bicycle', label: 'Village Bicycle', icon: Bike },
    distractors: [
      { id: 'plane', label: 'Aeroplane', icon: Plane },
      { id: 'shirt', label: 'Cotton Shirt', icon: Shirt },
      { id: 'glasses', label: 'Reading Glasses', icon: Glasses },
    ],
  },
  {
    target: { id: 'watch', label: 'Wrist Watch', icon: Watch },
    distractors: [
      { id: 'apple', label: 'Fresh Apple', icon: Apple },
      { id: 'umbrella', label: 'Umbrella', icon: Umbrella },
      { id: 'bird', label: 'Songbird', icon: Bird },
    ],
  },
  {
    target: { id: 'umbrella', label: 'Silk Umbrella', icon: Umbrella },
    distractors: [
      { id: 'chair', label: 'Armchair', icon: Armchair },
      { id: 'key', label: 'Brass Key', icon: Key },
      { id: 'bicycle', label: 'Village Bicycle', icon: Bike },
    ],
  },
];

// 4. Level 4: Pattern Completion Dataset (4 Rounds)
const PATTERN_ROUNDS = [
  {
    sequence: [
      { id: 1, label: 'Sun', icon: Sun, color: 'bg-amber-100 text-amber-700 border-amber-300' },
      { id: 2, label: 'Moon', icon: Moon, color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
      { id: 3, label: 'Sun', icon: Sun, color: 'bg-amber-100 text-amber-700 border-amber-300' },
      { id: 4, label: 'Moon', icon: Moon, color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
    ],
    correct: { id: 'sun', label: 'Sun', icon: Sun, color: 'bg-amber-100 text-amber-700 border-amber-300' },
    options: [
      { id: 'moon', label: 'Moon', icon: Moon, color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
      { id: 'sun', label: 'Sun', icon: Sun, color: 'bg-amber-100 text-amber-700 border-amber-300' },
      { id: 'star', label: 'Star', icon: Star, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    ],
  },
  {
    sequence: [
      { id: 1, label: 'Leaf', icon: Leaf, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
      { id: 2, label: 'Flower', icon: Flower2, color: 'bg-rose-100 text-rose-700 border-rose-300' },
      { id: 3, label: 'Leaf', icon: Leaf, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
      { id: 4, label: 'Flower', icon: Flower2, color: 'bg-rose-100 text-rose-700 border-rose-300' },
    ],
    correct: { id: 'leaf', label: 'Leaf', icon: Leaf, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    options: [
      { id: 'leaf', label: 'Leaf', icon: Leaf, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
      { id: 'flower', label: 'Flower', icon: Flower2, color: 'bg-rose-100 text-rose-700 border-rose-300' },
      { id: 'cloud', label: 'Cloud', icon: Cloud, color: 'bg-sky-100 text-sky-700 border-sky-300' },
    ],
  },
  {
    sequence: [
      { id: 1, label: 'Circle', icon: Circle, color: 'bg-teal-100 text-teal-700 border-teal-300' },
      { id: 2, label: 'Square', icon: Square, color: 'bg-orange-100 text-orange-700 border-orange-300' },
      { id: 3, label: 'Triangle', icon: Triangle, color: 'bg-purple-100 text-purple-700 border-purple-300' },
      { id: 4, label: 'Circle', icon: Circle, color: 'bg-teal-100 text-teal-700 border-teal-300' },
      { id: 5, label: 'Square', icon: Square, color: 'bg-orange-100 text-orange-700 border-orange-300' },
    ],
    correct: { id: 'triangle', label: 'Triangle', icon: Triangle, color: 'bg-purple-100 text-purple-700 border-purple-300' },
    options: [
      { id: 'square', label: 'Square', icon: Square, color: 'bg-orange-100 text-orange-700 border-orange-300' },
      { id: 'triangle', label: 'Triangle', icon: Triangle, color: 'bg-purple-100 text-purple-700 border-purple-300' },
      { id: 'circle', label: 'Circle', icon: Circle, color: 'bg-teal-100 text-teal-700 border-teal-300' },
    ],
  },
  {
    sequence: [
      { id: 1, label: 'Flame', icon: Flame, color: 'bg-red-100 text-red-700 border-red-300' },
      { id: 2, label: 'Sparkle', icon: Sparkles, color: 'bg-amber-100 text-amber-700 border-amber-300' },
      { id: 3, label: 'Flame', icon: Flame, color: 'bg-red-100 text-red-700 border-red-300' },
      { id: 4, label: 'Sparkle', icon: Sparkles, color: 'bg-amber-100 text-amber-700 border-amber-300' },
    ],
    correct: { id: 'flame', label: 'Flame', icon: Flame, color: 'bg-red-100 text-red-700 border-red-300' },
    options: [
      { id: 'sparkle', label: 'Sparkle', icon: Sparkles, color: 'bg-amber-100 text-amber-700 border-amber-300' },
      { id: 'flame', label: 'Flame', icon: Flame, color: 'bg-red-100 text-red-700 border-red-300' },
      { id: 'heart', label: 'Heart', icon: Heart, color: 'bg-rose-100 text-rose-700 border-rose-300' },
    ],
  },
];

// 5. Level 5: Word Recall Dataset
const WORD_RECALL_DATA = {
  shownWords: ['Tea Garden', 'Brahmaputra', 'Bihu Dance', 'Silk Saree', 'Morning Mist'],
  decoyWords: ['Motorcycle', 'Desert Sand', 'Snow Mountain'],
};

// 6. Level 6: Odd One Out Dataset (5 Rounds)
const ODD_ONE_OUT_ROUNDS = [
  {
    categoryHint: 'Fruits vs Vehicle',
    oddId: 'car',
    items: [
      { id: 'apple', label: 'Apple', icon: Apple, color: 'from-rose-500 to-pink-600' },
      { id: 'car', label: 'Motor Car', icon: Car, color: 'from-blue-600 to-indigo-600', isOdd: true },
      { id: 'cherry', label: 'Berry', icon: Heart, color: 'from-red-500 to-rose-600' },
      { id: 'sun', label: 'Orange', icon: Sun, color: 'from-amber-400 to-orange-500' },
    ],
  },
  {
    categoryHint: 'Nature / Greenery vs Device',
    oddId: 'watch',
    items: [
      { id: 'leaf', label: 'Green Leaf', icon: Leaf, color: 'from-emerald-500 to-teal-600' },
      { id: 'flower', label: 'Flower', icon: Flower2, color: 'from-pink-500 to-rose-600' },
      { id: 'tree', label: 'Tea Tree', icon: Trees, color: 'from-green-600 to-emerald-700' },
      { id: 'watch', label: 'Digital Watch', icon: Watch, color: 'from-slate-600 to-slate-800', isOdd: true },
    ],
  },
  {
    categoryHint: 'Sky & Weather vs Furniture',
    oddId: 'chair',
    items: [
      { id: 'cloud', label: 'Rain Cloud', icon: Cloud, color: 'from-sky-400 to-blue-500' },
      { id: 'moon', label: 'Crescent Moon', icon: Moon, color: 'from-indigo-500 to-purple-600' },
      { id: 'chair', label: 'Wooden Chair', icon: Armchair, color: 'from-amber-700 to-amber-900', isOdd: true },
      { id: 'star', label: 'Night Star', icon: Star, color: 'from-amber-400 to-yellow-500' },
    ],
  },
  {
    categoryHint: 'Music & Celebration vs Key',
    oddId: 'key',
    items: [
      { id: 'music', label: 'Bihu Tune', icon: Music2, color: 'from-purple-500 to-indigo-600' },
      { id: 'sparkles', label: 'Festival Light', icon: Sparkles, color: 'from-yellow-400 to-amber-500' },
      { id: 'flame', label: 'Lamp Flame', icon: Flame, color: 'from-red-500 to-orange-500' },
      { id: 'key', label: 'Brass Key', icon: Key, color: 'from-slate-600 to-slate-700', isOdd: true },
    ],
  },
  {
    categoryHint: 'Water / River vs Bicycle',
    oddId: 'bike',
    items: [
      { id: 'fish', label: 'River Fish', icon: Fish, color: 'from-cyan-400 to-teal-500' },
      { id: 'compass', label: 'Boat Compass', icon: Compass, color: 'from-blue-600 to-teal-700' },
      { id: 'bike', label: 'Bicycle', icon: Bike, color: 'from-orange-500 to-rose-600', isOdd: true },
      { id: 'cloud', label: 'River Mist', icon: Cloud, color: 'from-sky-400 to-blue-500' },
    ],
  },
];

// 7. Level 7: Number Memory Dataset (3 Rounds: 4, 5, 6 digits)
const NUMBER_MEMORY_ROUNDS = [
  { digits: [3, 7, 1, 9] },
  { digits: [6, 2, 8, 4, 1] },
  { digits: [5, 9, 3, 7, 2, 8] },
];

// 8. Level 8: Face-Name Match Dataset (4 Avatar-Name Pairs)
const FACE_NAME_PAIRS = [
  { id: 'p1', name: 'Priya', color: 'from-[#1E5F60] to-[#2A9D8F]', ring: 'ring-[#2A9D8F]' },
  { id: 'p2', name: 'Raju', color: 'from-[#E76F51] to-[#F4A261]', ring: 'ring-[#F4A261]' },
  { id: 'p3', name: 'Ananya', color: 'from-[#6A4C93] to-[#9B8AA0]', ring: 'ring-[#9B8AA0]' },
  { id: 'p4', name: 'Bikram', color: 'from-[#3D8F5A] to-[#8FA876]', ring: 'ring-[#8FA876]' },
];

// 9. Level 9: Story Recall Dataset (Story + 3 Questions)
const STORY_RECALL_DATA = {
  text: "Meera went to the Guwahati morning market. She bought 3 ripe mangoes and a packet of fresh Assam tea. On her way home, it started raining, so she stopped at a cozy tea stall to stay dry.",
  questions: [
    {
      q: 'What did Meera buy at the market?',
      options: ['3 ripe mangoes & Assam tea', 'Apples & fresh bread', 'Rice & sweet bananas'],
      correct: 0,
    },
    {
      q: 'How many mangoes did she buy?',
      options: ['5 mangoes', '3 mangoes', '2 mangoes'],
      correct: 1,
    },
    {
      q: 'Where did she stop when it started raining?',
      options: ['Under a banyan tree', 'At a cozy tea stall', 'At the bus stand'],
      correct: 1,
    },
  ],
};

// =======================================================================
// MAIN GAMEPAGE COMPONENT
// =======================================================================
export const GamePage = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { levelProgress, updateLevelProgress } = useApp();
  const { t } = useTranslation();

  const currentLevel = Math.min(Math.max(parseInt(levelId, 10) || 1, 1), 10);

  // Exact 10-Level Mapping
  const gameType = useMemo(() => {
    switch (currentLevel) {
      case 1:
        return 'memory_match';
      case 2:
        return 'sequence_recall';
      case 3:
        return 'object_recognition';
      case 4:
        return 'pattern_completion';
      case 5:
        return 'word_recall';
      case 6:
        return 'odd_one_out';
      case 7:
        return 'number_memory';
      case 8:
        return 'face_name';
      case 9:
        return 'story_recall';
      case 10:
        return 'boss_challenge';
      default:
        return 'memory_match';
    }
  }, [currentLevel]);

  const currentLevelInfo = levelProgress.find((lvl) => lvl.level === currentLevel) || {
    name: `Level ${currentLevel} Quest`,
  };

  // -------------------------------------------------------------
  // SHARED STATS (Score, Mistakes, Accuracy, Running Timer)
  // -------------------------------------------------------------
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  // Running Timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isLevelComplete) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isLevelComplete]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const liveAccuracy = useMemo(() => {
    if (totalAttempts === 0) return 100;
    const correctAttempts = Math.max(totalAttempts - mistakes, 0);
    const acc = Math.round((correctAttempts / totalAttempts) * 100);
    return Math.max(Math.min(acc, 100), 0);
  }, [totalAttempts, mistakes]);

  // Handle Game Completion
  const handleGameComplete = (finalScore, finalAttempts, finalMistakes) => {
    setIsTimerRunning(false);
    setIsLevelComplete(true);
    soundFx.playVictory();

    const timeString = formatTime(secondsElapsed);
    const safeAttempts = Math.max(finalAttempts, 1);
    const finalAccuracy = Math.max(
      Math.min(Math.round(((safeAttempts - finalMistakes) / safeAttempts) * 100), 100),
      60
    );

    updateLevelProgress(currentLevel, {
      score: finalScore,
      accuracy: finalAccuracy,
      timeTaken: timeString,
      mistakes: finalMistakes,
      completed: true,
    });
  };

  // -------------------------------------------------------------
  // LEVEL 1: MEMORY MATCH LOGIC
  // -------------------------------------------------------------
  const [matchCards, setMatchCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isMatchBusy, setIsMatchBusy] = useState(false);

  useEffect(() => {
    if (gameType === 'memory_match') {
      const pairCount = 3;
      const selected = CARD_PALETTE.slice(0, pairCount);
      const deck = [];
      selected.forEach((item, idx) => {
        deck.push({ id: `${item.id}-1`, icon: item.icon, color: item.color, group: idx });
        deck.push({ id: `${item.id}-2`, icon: item.icon, color: item.color, group: idx });
      });
      setMatchCards(deck.sort(() => Math.random() - 0.5));
      setFlippedIndices([]);
      setMatchedPairs([]);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);
    }
  }, [currentLevel, gameType]);

  const handleMatchCardClick = (index) => {
    if (isMatchBusy || isLevelComplete) return;
    if (flippedIndices.includes(index) || matchedPairs.includes(matchCards[index].group)) return;

    soundFx.playTap();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsMatchBusy(true);
      setTotalAttempts((prev) => prev + 1);
      const [first, second] = newFlipped;

      if (matchCards[first].group === matchCards[second].group) {
        soundFx.playSuccess();
        setMatchedPairs((prev) => {
          const updated = [...prev, matchCards[first].group];
          const totalPairs = matchCards.length / 2;
          if (updated.length === totalPairs) {
            handleGameComplete(score + 10, totalAttempts + 1, mistakes);
          }
          return updated;
        });
        setScore((prev) => prev + 10);
        setFlippedIndices([]);
        setIsMatchBusy(false);
      } else {
        soundFx.playMistake();
        setMistakes((prev) => prev + 1);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsMatchBusy(false);
        }, 800);
      }
    }
  };

  // -------------------------------------------------------------
  // LEVEL 2: SEQUENCE RECALL LOGIC
  // -------------------------------------------------------------
  const [seqSequence, setSeqSequence] = useState([]);
  const [seqStep, setSeqStep] = useState(0);
  const [seqPhase, setSeqPhase] = useState('watching');
  const [seqActiveTile, setSeqActiveTile] = useState(null);
  const [seqShakingTile, setSeqShakingTile] = useState(null);

  useEffect(() => {
    if (gameType === 'sequence_recall') {
      const len = 3;
      const genSeq = Array.from({ length: len }, () => Math.floor(Math.random() * 4));
      setSeqSequence(genSeq);
      setSeqStep(0);
      setSeqPhase('watching');
      setSeqActiveTile(null);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);

      let step = 0;
      const timer = setInterval(() => {
        if (step < genSeq.length) {
          setSeqActiveTile(genSeq[step]);
          soundFx.playTap();
          setTimeout(() => setSeqActiveTile(null), 550);
          step++;
        } else {
          clearInterval(timer);
          setTimeout(() => setSeqPhase('playing'), 400);
        }
      }, 900);

      return () => clearInterval(timer);
    }
  }, [currentLevel, gameType]);

  const handleSeqTileClick = (tileId) => {
    if (seqPhase !== 'playing' || isLevelComplete) return;
    setTotalAttempts((prev) => prev + 1);
    setSeqActiveTile(tileId);
    soundFx.playTap();
    setTimeout(() => setSeqActiveTile(null), 250);

    if (tileId === seqSequence[seqStep]) {
      const nextStep = seqStep + 1;
      setSeqStep(nextStep);
      if (nextStep === seqSequence.length) {
        soundFx.playSuccess();
        setSeqPhase('done');
        handleGameComplete(45, totalAttempts + 1, mistakes);
      }
    } else {
      soundFx.playMistake();
      setMistakes((prev) => prev + 1);
      setSeqShakingTile(tileId);
      setTimeout(() => setSeqShakingTile(null), 400);
    }
  };

  // -------------------------------------------------------------
  // LEVEL 3: OBJECT RECOGNITION LOGIC (5 Rounds)
  // -------------------------------------------------------------
  const [objRound, setObjRound] = useState(0);
  const [objPhase, setObjPhase] = useState('showing');
  const [objOptions, setObjOptions] = useState([]);
  const [objSelectedId, setObjSelectedId] = useState(null);
  const [objTimerPercent, setObjTimerPercent] = useState(100);

  useEffect(() => {
    if (gameType === 'object_recognition') {
      setObjRound(0);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);
      startObjectRound(0);
    }
  }, [currentLevel, gameType]);

  const startObjectRound = (roundIdx) => {
    if (roundIdx >= OBJECT_RECOGNITION_ROUNDS.length) {
      handleGameComplete(50, totalAttempts, mistakes);
      return;
    }
    const currentData = OBJECT_RECOGNITION_ROUNDS[roundIdx];
    const choices = [currentData.target, ...currentData.distractors].sort(() => Math.random() - 0.5);
    setObjOptions(choices);
    setObjPhase('showing');
    setObjSelectedId(null);
    setObjTimerPercent(100);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(100 - (elapsed / 3000) * 100, 0);
      setObjTimerPercent(remaining);
      if (elapsed >= 3000) {
        clearInterval(interval);
        setObjPhase('choosing');
      }
    }, 50);
  };

  const handleObjectChoice = (choiceId) => {
    if (objPhase !== 'choosing' || isLevelComplete) return;
    soundFx.playTap();
    setTotalAttempts((prev) => prev + 1);
    setObjSelectedId(choiceId);
    setObjPhase('feedback');

    const currentTarget = OBJECT_RECOGNITION_ROUNDS[objRound].target.id;
    const isCorrect = choiceId === currentTarget;

    if (isCorrect) {
      soundFx.playSuccess();
      setScore((prev) => prev + 10);
    } else {
      soundFx.playMistake();
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      const nextRound = objRound + 1;
      if (nextRound < OBJECT_RECOGNITION_ROUNDS.length) {
        setObjRound(nextRound);
        startObjectRound(nextRound);
      } else {
        handleGameComplete((isCorrect ? score + 10 : score), totalAttempts + 1, (isCorrect ? mistakes : mistakes + 1));
      }
    }, 1200);
  };

  // -------------------------------------------------------------
  // LEVEL 4: PATTERN COMPLETION LOGIC (4 Rounds)
  // -------------------------------------------------------------
  const [patternRound, setPatternRound] = useState(0);
  const [patternSelected, setPatternSelected] = useState(null);
  const [patternFeedback, setPatternFeedback] = useState(null);

  useEffect(() => {
    if (gameType === 'pattern_completion') {
      setPatternRound(0);
      setPatternSelected(null);
      setPatternFeedback(null);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);
    }
  }, [currentLevel, gameType]);

  const handlePatternChoice = (optionId) => {
    if (patternFeedback || isLevelComplete) return;
    soundFx.playTap();
    setTotalAttempts((prev) => prev + 1);
    setPatternSelected(optionId);

    const correctId = PATTERN_ROUNDS[patternRound].correct.id;
    const isCorrect = optionId === correctId;

    if (isCorrect) {
      soundFx.playSuccess();
      setPatternFeedback('correct');
      setScore((prev) => prev + 12);
    } else {
      soundFx.playMistake();
      setPatternFeedback('wrong');
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      setPatternFeedback(null);
      setPatternSelected(null);
      const nextRound = patternRound + 1;
      if (nextRound < PATTERN_ROUNDS.length) {
        setPatternRound(nextRound);
      } else {
        handleGameComplete((isCorrect ? score + 12 : score), totalAttempts + 1, (isCorrect ? mistakes : mistakes + 1));
      }
    }, 1100);
  };

  // -------------------------------------------------------------
  // LEVEL 5: WORD RECALL LOGIC
  // -------------------------------------------------------------
  const [wordPhase, setWordPhase] = useState('memorizing');
  const [wordIndex, setWordIndex] = useState(0);
  const [shuffledWordGrid, setShuffledWordGrid] = useState([]);
  const [userSelectedWords, setUserSelectedWords] = useState([]);

  useEffect(() => {
    if (gameType === 'word_recall') {
      setWordPhase('memorizing');
      setWordIndex(0);
      setUserSelectedWords([]);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);

      const allWords = [...WORD_RECALL_DATA.shownWords, ...WORD_RECALL_DATA.decoyWords].sort(
        () => Math.random() - 0.5
      );
      setShuffledWordGrid(allWords);

      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        if (idx < WORD_RECALL_DATA.shownWords.length) {
          setWordIndex(idx);
          soundFx.playTap();
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setWordPhase('recalling');
          }, 600);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentLevel, gameType]);

  const handleWordToggle = (word) => {
    if (wordPhase !== 'recalling') return;
    soundFx.playTap();
    setUserSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleWordSubmit = () => {
    if (wordPhase !== 'recalling') return;
    setWordPhase('reviewed');

    let correctCount = 0;
    let wrongCount = 0;

    userSelectedWords.forEach((word) => {
      if (WORD_RECALL_DATA.shownWords.includes(word)) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    if (wrongCount === 0 && correctCount > 0) {
      soundFx.playSuccess();
    } else if (wrongCount > 0) {
      soundFx.playMistake();
    }

    const calculatedScore = Math.max(correctCount * 10 - wrongCount * 5, 10);
    setScore(calculatedScore);
    setMistakes(wrongCount);
    setTotalAttempts(userSelectedWords.length || 5);

    setTimeout(() => {
      handleGameComplete(calculatedScore, userSelectedWords.length || 5, wrongCount);
    }, 1800);
  };

  // -------------------------------------------------------------
  // LEVEL 6: ODD ONE OUT LOGIC (5 Rounds)
  // -------------------------------------------------------------
  const [oddRound, setOddRound] = useState(0);
  const [oddSelectedId, setOddSelectedId] = useState(null);
  const [oddFeedback, setOddFeedback] = useState(null);

  useEffect(() => {
    if (gameType === 'odd_one_out') {
      setOddRound(0);
      setOddSelectedId(null);
      setOddFeedback(null);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);
    }
  }, [currentLevel, gameType]);

  const handleOddChoice = (item) => {
    if (oddFeedback || isLevelComplete) return;
    soundFx.playTap();
    setTotalAttempts((prev) => prev + 1);
    setOddSelectedId(item.id);

    const isCorrect = item.isOdd === true;

    if (isCorrect) {
      soundFx.playSuccess();
      setOddFeedback('correct');
      setScore((prev) => prev + 10);
    } else {
      soundFx.playMistake();
      setOddFeedback('wrong');
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      setOddFeedback(null);
      setOddSelectedId(null);
      const next = oddRound + 1;
      if (next < ODD_ONE_OUT_ROUNDS.length) {
        setOddRound(next);
      } else {
        handleGameComplete((isCorrect ? score + 10 : score), totalAttempts + 1, (isCorrect ? mistakes : mistakes + 1));
      }
    }, 1200);
  };

  // -------------------------------------------------------------
  // LEVEL 7: NUMBER MEMORY LOGIC (3 Rounds: 4, 5, 6 Digits)
  // -------------------------------------------------------------
  const [numRound, setNumRound] = useState(0);
  const [numPhase, setNumPhase] = useState('showing'); // 'showing' | 'input' | 'feedback'
  const [numDisplayDigit, setNumDisplayDigit] = useState(null);
  const [numUserEntry, setNumUserEntry] = useState('');
  const [numFeedback, setNumFeedback] = useState(null); // 'correct' | 'wrong'

  useEffect(() => {
    if (gameType === 'number_memory') {
      setNumRound(0);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);
      startNumberRound(0);
    }
  }, [currentLevel, gameType]);

  const startNumberRound = (roundIdx) => {
    if (roundIdx >= NUMBER_MEMORY_ROUNDS.length) {
      handleGameComplete(45, totalAttempts, mistakes);
      return;
    }
    const digits = NUMBER_MEMORY_ROUNDS[roundIdx].digits;
    setNumPhase('showing');
    setNumUserEntry('');
    setNumFeedback(null);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < digits.length) {
        setNumDisplayDigit(digits[idx]);
        soundFx.playTap();
        setTimeout(() => setNumDisplayDigit(null), 700);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setNumPhase('input'), 400);
      }
    }, 1000);
  };

  const handleNumKeypad = (digit) => {
    if (numPhase !== 'input') return;
    soundFx.playTap();
    const maxLen = NUMBER_MEMORY_ROUNDS[numRound].digits.length;
    if (numUserEntry.length < maxLen) {
      setNumUserEntry((prev) => prev + digit);
    }
  };

  const handleNumClear = () => {
    if (numPhase === 'input') {
      soundFx.playTap();
      setNumUserEntry('');
    }
  };

  const handleNumBackspace = () => {
    if (numPhase === 'input') {
      soundFx.playTap();
      setNumUserEntry((prev) => prev.slice(0, -1));
    }
  };

  const handleNumSubmit = () => {
    if (numPhase !== 'input' || numUserEntry.length === 0) return;
    soundFx.playTap();
    setTotalAttempts((prev) => prev + 1);

    const targetNum = NUMBER_MEMORY_ROUNDS[numRound].digits.join('');
    const isCorrect = numUserEntry === targetNum;

    if (isCorrect) {
      soundFx.playSuccess();
      setNumFeedback('correct');
      setScore((prev) => prev + 15);
    } else {
      soundFx.playMistake();
      setNumFeedback('wrong');
      setMistakes((prev) => prev + 1);
    }
    setNumPhase('feedback');

    setTimeout(() => {
      const nextRound = numRound + 1;
      if (nextRound < NUMBER_MEMORY_ROUNDS.length) {
        setNumRound(nextRound);
        startNumberRound(nextRound);
      } else {
        handleGameComplete((isCorrect ? score + 15 : score), totalAttempts + 1, (isCorrect ? mistakes : mistakes + 1));
      }
    }, 1500);
  };

  // -------------------------------------------------------------
  // LEVEL 8: FACE-NAME MATCH LOGIC (4 Avatars)
  // -------------------------------------------------------------
  const [facePhase, setFacePhase] = useState('memorizing'); // 'memorizing' | 'matching'
  const [faceMemorizeIdx, setFaceMemorizeIdx] = useState(0);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [selectedNameId, setSelectedNameId] = useState(null);
  const [matchedFaceIds, setMatchedFaceIds] = useState([]);
  const [shuffledNames, setShuffledNames] = useState([]);

  useEffect(() => {
    if (gameType === 'face_name') {
      setFacePhase('memorizing');
      setFaceMemorizeIdx(0);
      setSelectedAvatarId(null);
      setSelectedNameId(null);
      setMatchedFaceIds([]);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);

      setShuffledNames([...FACE_NAME_PAIRS].sort(() => Math.random() - 0.5));

      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        if (idx < FACE_NAME_PAIRS.length) {
          setFaceMemorizeIdx(idx);
          soundFx.playTap();
        } else {
          clearInterval(interval);
          setTimeout(() => setFacePhase('matching'), 500);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentLevel, gameType]);

  const handleAvatarSelect = (id) => {
    if (facePhase !== 'matching' || matchedFaceIds.includes(id)) return;
    soundFx.playTap();
    setSelectedAvatarId(id);
    if (selectedNameId) {
      checkFaceMatch(id, selectedNameId);
    }
  };

  const handleNameSelect = (id) => {
    if (facePhase !== 'matching' || matchedFaceIds.includes(id)) return;
    soundFx.playTap();
    setSelectedNameId(id);
    if (selectedAvatarId) {
      checkFaceMatch(selectedAvatarId, id);
    }
  };

  const checkFaceMatch = (avatarId, nameId) => {
    setTotalAttempts((prev) => prev + 1);
    if (avatarId === nameId) {
      // Correct match!
      soundFx.playSuccess();
      setMatchedFaceIds((prev) => {
        const updated = [...prev, avatarId];
        if (updated.length === FACE_NAME_PAIRS.length) {
          handleGameComplete(score + 12, totalAttempts + 1, mistakes);
        }
        return updated;
      });
      setScore((prev) => prev + 12);
      setSelectedAvatarId(null);
      setSelectedNameId(null);
    } else {
      // Wrong match
      soundFx.playMistake();
      setMistakes((prev) => prev + 1);
      setTimeout(() => {
        setSelectedAvatarId(null);
        setSelectedNameId(null);
      }, 400);
    }
  };

  // -------------------------------------------------------------
  // LEVEL 9: STORY RECALL LOGIC (Story + 3 Questions)
  // -------------------------------------------------------------
  const [storyPhase, setStoryPhase] = useState('reading'); // 'reading' | 'answering'
  const [storyQuestionIdx, setStoryQuestionIdx] = useState(0);
  const [storySelectedOpt, setStorySelectedOpt] = useState(null);
  const [storyFeedback, setStoryFeedback] = useState(null);

  useEffect(() => {
    if (gameType === 'story_recall') {
      setStoryPhase('reading');
      setStoryQuestionIdx(0);
      setStorySelectedOpt(null);
      setStoryFeedback(null);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(true);

      const timer = setTimeout(() => {
        setStoryPhase('answering');
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [currentLevel, gameType]);

  const handleStoryAnswer = (optIndex) => {
    if (storyPhase !== 'answering' || storyFeedback || isLevelComplete) return;
    soundFx.playTap();
    setTotalAttempts((prev) => prev + 1);
    setStorySelectedOpt(optIndex);

    const isCorrect = optIndex === STORY_RECALL_DATA.questions[storyQuestionIdx].correct;

    if (isCorrect) {
      soundFx.playSuccess();
      setStoryFeedback('correct');
      setScore((prev) => prev + 15);
    } else {
      soundFx.playMistake();
      setStoryFeedback('wrong');
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      setStoryFeedback(null);
      setStorySelectedOpt(null);
      const nextQ = storyQuestionIdx + 1;
      if (nextQ < STORY_RECALL_DATA.questions.length) {
        setStoryQuestionIdx(nextQ);
      } else {
        handleGameComplete((isCorrect ? score + 15 : score), totalAttempts + 1, (isCorrect ? mistakes : mistakes + 1));
      }
    }, 1300);
  };

  // -------------------------------------------------------------
  // LEVEL 10: BOSS LEVEL — MIXED CHALLENGE LOGIC
  // -------------------------------------------------------------
  const [bossIntro, setBossIntro] = useState(true);
  const [bossMiniStep, setBossMiniStep] = useState(1); // 1 to 4 mini-trials
  // Mini 1: 2-pair memory match
  const [bossMatchFlipped, setBossMatchFlipped] = useState([]);
  const [bossMatchPairs, setBossMatchPairs] = useState([]);
  // Mini 2: 3-digit number recall
  const [bossNumPhase, setBossNumPhase] = useState('showing');
  const [bossNumDigit, setBossNumDigit] = useState(null);
  const [bossNumInput, setBossNumInput] = useState('');
  // Mini 3: Odd one out
  const [bossOddSelected, setBossOddSelected] = useState(null);
  // Mini 4: Word recall
  const [bossWordSelected, setBossWordSelected] = useState([]);

  useEffect(() => {
    if (gameType === 'boss_challenge') {
      setBossIntro(true);
      setBossMiniStep(1);
      setScore(0);
      setMistakes(0);
      setTotalAttempts(0);
      setSecondsElapsed(0);
      setIsLevelComplete(false);
      setIsTimerRunning(false);
    }
  }, [currentLevel, gameType]);

  const startBossGame = () => {
    soundFx.playTap();
    setBossIntro(false);
    setIsTimerRunning(true);
    setBossMiniStep(1);
  };

  // Boss Mini 1 Handle
  const handleBossMatchCard = (idx) => {
    if (bossMatchFlipped.includes(idx) || bossMatchPairs.includes(idx % 2)) return;
    soundFx.playTap();
    const newFlip = [...bossMatchFlipped, idx];
    setBossMatchFlipped(newFlip);

    if (newFlip.length === 2) {
      setTotalAttempts((p) => p + 1);
      const [c1, c2] = newFlip;
      if (c1 % 2 === c2 % 2) {
        soundFx.playSuccess();
        setBossMatchPairs((p) => [...p, c1 % 2]);
        setScore((p) => p + 15);
        setBossMatchFlipped([]);
        if (bossMatchPairs.length + 1 === 2) {
          setTimeout(() => advanceBossMini(2), 600);
        }
      } else {
        soundFx.playMistake();
        setMistakes((p) => p + 1);
        setTimeout(() => setBossMatchFlipped([]), 700);
      }
    }
  };

  // Boss Mini 2 Handle
  const startBossNumber = () => {
    setBossNumPhase('showing');
    setBossNumInput('');
    const digits = [7, 2, 9];
    let dIdx = 0;
    const interval = setInterval(() => {
      if (dIdx < digits.length) {
        setBossNumDigit(digits[dIdx]);
        soundFx.playTap();
        setTimeout(() => setBossNumDigit(null), 600);
        dIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBossNumPhase('input'), 400);
      }
    }, 900);
  };

  const handleBossNumSubmit = () => {
    soundFx.playTap();
    setTotalAttempts((p) => p + 1);
    if (bossNumInput === '729') {
      soundFx.playSuccess();
      setScore((p) => p + 15);
    } else {
      soundFx.playMistake();
      setMistakes((p) => p + 1);
    }
    setTimeout(() => advanceBossMini(3), 600);
  };

  // Boss Mini 3 Handle
  const handleBossOddChoice = (isOdd) => {
    soundFx.playTap();
    setTotalAttempts((p) => p + 1);
    if (isOdd) {
      soundFx.playSuccess();
      setScore((p) => p + 15);
    } else {
      soundFx.playMistake();
      setMistakes((p) => p + 1);
    }
    setTimeout(() => advanceBossMini(4), 600);
  };

  // Boss Mini 4 Handle
  const handleBossWordSubmit = () => {
    soundFx.playTap();
    setTotalAttempts((p) => p + 1);
    const correct = bossWordSelected.includes('Majuli') && bossWordSelected.includes('Tea');
    if (correct) {
      soundFx.playSuccess();
      setScore((p) => p + 20);
    } else {
      soundFx.playMistake();
      setMistakes((p) => p + 1);
    }
    handleGameComplete(score + (correct ? 20 : 10), totalAttempts + 1, mistakes);
  };

  const advanceBossMini = (nextStep) => {
    setBossMiniStep(nextStep);
    if (nextStep === 2) startBossNumber();
  };

  // Confetti particles for quick initial blast
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: `confetti-${i}`,
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.7) * 450,
      rotate: Math.random() * 360,
      scale: Math.random() * 0.7 + 0.6,
      color: ['#1E5F60', '#2A9D8F', '#E76F51', '#FFD166', '#8FA876', '#9B8AA0'][i % 6],
    }));
  }, []);

  // Festive Falling Ribbon Streamers (20 distributed pieces drifting & tumbling)
  const ribbonStreamers = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const startX = Math.random() * 92 + 4; // 4% to 96%
      const swayAmount = (Math.random() * 45 + 25) * (Math.random() > 0.5 ? 1 : -1);
      const duration = Math.random() * 1.4 + 2.6; // 2.6s to 4.0s
      const delay = Math.random() * 0.5; // 0 to 500ms
      const width = Math.random() * 4 + 8; // 8px to 12px
      const height = Math.random() * 12 + 30; // 30px to 42px
      const color = ['#1E5F60', '#2A9D8F', '#E76F51', '#FFD166', '#8FA876', '#6A4C93'][i % 6];
      const rotateDeg = (Math.random() * 360 + 360) * (Math.random() > 0.5 ? 1 : -1);

      return {
        id: `ribbon-${i}`,
        startX,
        swayAmount,
        duration,
        delay,
        width,
        height,
        color,
        rotateDeg,
      };
    });
  }, []);

  return (
    <div className="w-full min-h-[92vh] flex flex-col items-center justify-start px-4 py-6 md:py-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/80 shadow-[0_30px_90px_-15px_rgba(30,95,96,0.25)] p-5 sm:p-8 md:p-10 flex flex-col items-center relative overflow-hidden"
      >
        {/* Top Rainbow Accent Strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

        {/* 1. SHARED TOP BAR */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <motion.button
              type="button"
              onClick={() => navigate('/levels')}
              whileHover={{ scale: 1.08, x: -2 }}
              whileTap={{ scale: 0.94 }}
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-teal-800 flex items-center justify-center shadow-sm border border-teal-800/10 transition-colors cursor-pointer"
              title="Back to Levels Map"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1E5F60] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-sm">
                {t('game.level', 'Level')} {currentLevel}
              </div>
              <span className="hidden md:inline-block text-sm font-bold text-slate-700">
                {currentLevelInfo.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-teal-800/15 shadow-sm text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{score} {t('game.pts', 'pts')}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/60">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>{liveAccuracy}%</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 text-teal-900 border border-teal-200/60">
              <Clock className="w-4 h-4 text-[#1E5F60]" />
              <span className="font-mono">{formatTime(secondsElapsed)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-900 border border-rose-200/60">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{mistakes}</span>
            </div>
          </div>
        </div>

        {/* 2. LEVEL HEADERS & ROUND PROGRESS */}
        <div className="text-center space-y-1.5 mb-6">
          {gameType === 'number_memory' && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-extrabold text-xs mb-1">
              <span>Digit Round {numRound + 1} of {NUMBER_MEMORY_ROUNDS.length} ({NUMBER_MEMORY_ROUNDS[numRound]?.digits.length} Digits)</span>
            </div>
          )}
          {gameType === 'face_name' && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 font-extrabold text-xs mb-1">
              <span>{facePhase === 'memorizing' ? `Memorize Friend ${faceMemorizeIdx + 1} of 4` : `${matchedFaceIds.length} of 4 Friends Matched`}</span>
            </div>
          )}
          {gameType === 'story_recall' && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs mb-1">
              <span>{storyPhase === 'reading' ? 'Read Carefully' : `Question ${storyQuestionIdx + 1} of 3`}</span>
            </div>
          )}
          {gameType === 'boss_challenge' && !bossIntro && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs mb-1">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Boss Trial {bossMiniStep} of 4</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] bg-clip-text text-transparent">
            {gameType === 'memory_match' && 'Memory Card Match'}
            {gameType === 'sequence_recall' && 'Cultural Sequence Recall'}
            {gameType === 'object_recognition' && 'Object Memory Recall'}
            {gameType === 'pattern_completion' && 'Pattern Sequence Completion'}
            {gameType === 'word_recall' && 'Word Memory Journey'}
            {gameType === 'odd_one_out' && 'Odd One Out Challenge'}
            {gameType === 'number_memory' && 'Number Sequence Recall'}
            {gameType === 'face_name' && 'Friend Face & Name Recall'}
            {gameType === 'story_recall' && 'Market Story Recall'}
            {gameType === 'boss_challenge' && 'Grand Finale: Mixed Mastery'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {gameType === 'number_memory' && (numPhase === 'showing' ? '👀 Memorize the numbers flashing on screen...' : '👉 Enter the exact number sequence using the keypad!')}
            {gameType === 'face_name' && (facePhase === 'memorizing' ? '👀 Memorize each friend’s face and name...' : '👉 Tap an avatar, then tap their matching name!')}
            {gameType === 'story_recall' && (storyPhase === 'reading' ? '📖 Read the short story and remember the details...' : '👉 Answer the question based on what you read!')}
            {gameType === 'boss_challenge' && '🏆 Complete 4 rapid mini-challenges to master the memory journey!'}
          </p>
        </div>

        {/* =============================================================
            GAME 1: MEMORY MATCH (LEVEL 1)
        ============================================================= */}
        {gameType === 'memory_match' && (
          <div className="w-full flex items-center justify-center my-2">
            <div className="grid grid-cols-3 gap-3.5 sm:gap-4 p-2 w-full max-w-xl">
              {matchCards.map((card, index) => {
                const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.group);
                const isMatched = matchedPairs.includes(card.group);
                const Icon = card.icon;

                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    onClick={() => handleMatchCardClick(index)}
                    whileHover={!isFlipped ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!isFlipped ? { scale: 0.95 } : {}}
                    className={`aspect-square min-h-[90px] sm:min-h-[115px] rounded-2xl sm:rounded-3xl relative transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center border-2 ${
                      isMatched
                        ? 'bg-gradient-to-br from-[#1E5F60] to-[#2A9D8F] border-emerald-400 text-white shadow-emerald-500/20'
                        : isFlipped
                        ? `bg-gradient-to-br ${card.color} border-white text-white shadow-lg`
                        : 'bg-white/85 hover:bg-white border-teal-800/20 hover:border-[#2A9D8F] text-[#1E5F60]'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isFlipped ? (
                        <motion.div
                          key="front"
                          initial={{ rotateY: -90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          exit={{ rotateY: 90, opacity: 0 }}
                          className="flex flex-col items-center justify-center"
                        >
                          <Icon className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2] drop-shadow-md" />
                          {isMatched && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-800/15">
                          <Sparkles className="w-5 h-5 text-[#2A9D8F]" />
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* =============================================================
            GAME 2: SEQUENCE RECALL (LEVEL 2)
        ============================================================= */}
        {gameType === 'sequence_recall' && (
          <div className="w-full flex flex-col items-center justify-center my-3">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg p-2">
              {SEQUENCE_TILES.map((tile) => {
                const isActive = seqActiveTile === tile.id;
                const isShaking = seqShakingTile === tile.id;
                const TileIcon = tile.icon;

                return (
                  <motion.button
                    key={tile.id}
                    type="button"
                    onClick={() => handleSeqTileClick(tile.id)}
                    animate={isShaking ? { x: [-10, 10, -8, 8, 0] } : isActive ? { scale: [1, 1.08, 1] } : {}}
                    whileHover={seqPhase === 'playing' ? { scale: 1.04, y: -2 } : {}}
                    whileTap={seqPhase === 'playing' ? { scale: 0.96 } : {}}
                    className={`min-h-[120px] sm:min-h-[140px] p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer relative overflow-hidden shadow-lg ${
                      isActive
                        ? `${tile.activeColor} border-white text-white scale-105 z-20`
                        : `bg-gradient-to-br ${tile.color} border-white/40 text-white hover:opacity-95`
                    }`}
                  >
                    <TileIcon className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md stroke-[2.2]" />
                    <span className="text-base sm:text-lg font-black tracking-wide drop-shadow-sm">
                      {tile.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* =============================================================
            GAME 3: OBJECT RECOGNITION (LEVEL 3)
        ============================================================= */}
        {gameType === 'object_recognition' && (
          <div className="w-full flex flex-col items-center justify-center my-2 max-w-xl">
            {objPhase === 'showing' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full flex flex-col items-center justify-center py-6 space-y-5"
              >
                {(() => {
                  const target = OBJECT_RECOGNITION_ROUNDS[objRound].target;
                  const TargetIcon = target.icon;
                  return (
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[2.5rem] bg-gradient-to-br from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] p-1.5 shadow-[0_20px_50px_rgba(30,95,96,0.35)] flex items-center justify-center">
                      <div className="w-full h-full rounded-[2.3rem] bg-white flex flex-col items-center justify-center gap-3 p-4">
                        <TargetIcon className="w-20 h-20 text-[#1E5F60] stroke-[2.2]" />
                        <span className="text-xl font-black text-slate-800 tracking-tight">
                          {target.label}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="w-48 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    style={{ width: `${objTimerPercent}%` }}
                    className="h-full bg-gradient-to-r from-[#2A9D8F] to-[#E76F51] rounded-full transition-all duration-75"
                  />
                </div>
              </motion.div>
            )}

            {objPhase !== 'showing' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full grid grid-cols-2 gap-4 p-2">
                {objOptions.map((opt) => {
                  const isSelected = objSelectedId === opt.id;
                  const isTarget = opt.id === OBJECT_RECOGNITION_ROUNDS[objRound].target.id;
                  const OptIcon = opt.icon;

                  let cardStyle = 'bg-white/80 hover:bg-white text-slate-800 border-teal-800/20 hover:border-[#2A9D8F]';
                  if (objPhase === 'feedback') {
                    if (isTarget) cardStyle = 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30 scale-102';
                    else if (isSelected && !isTarget) cardStyle = 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30';
                  }

                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      onClick={() => handleObjectChoice(opt.id)}
                      whileHover={objPhase === 'choosing' ? { scale: 1.04, y: -2 } : {}}
                      whileTap={objPhase === 'choosing' ? { scale: 0.96 } : {}}
                      className={`min-h-[120px] p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${cardStyle}`}
                    >
                      <OptIcon className="w-10 h-10 stroke-[2.2]" />
                      <span className="text-base font-bold tracking-tight">{opt.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}

        {/* =============================================================
            GAME 4: PATTERN COMPLETION (LEVEL 4)
        ============================================================= */}
        {gameType === 'pattern_completion' && (
          <div className="w-full flex flex-col items-center justify-center my-3 max-w-2xl space-y-7">
            <div className="w-full p-4 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-xl border-2 border-teal-800/20 shadow-sm flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {PATTERN_ROUNDS[patternRound].sequence.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div key={idx} className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center shadow-sm ${item.color}`}>
                    <ItemIcon className="w-8 h-8 stroke-[2.2]" />
                  </div>
                );
              })}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-dashed border-[#E76F51] bg-orange-50/80 text-[#E76F51] flex items-center justify-center font-black text-2xl animate-pulse shadow-sm">
                ?
              </div>
            </div>

            <div className="w-full flex flex-col items-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose the matching shape:</span>
              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap w-full">
                {PATTERN_ROUNDS[patternRound].options.map((opt) => {
                  const isSelected = patternSelected === opt.id;
                  const isCorrect = opt.id === PATTERN_ROUNDS[patternRound].correct.id;
                  const OptIcon = opt.icon;

                  let style = 'bg-white/85 hover:bg-white text-slate-800 border-teal-800/20 hover:border-[#2A9D8F]';
                  if (patternFeedback) {
                    if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30 scale-105';
                    else if (isSelected && !isCorrect) style = 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30';
                  }

                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      onClick={() => handlePatternChoice(opt.id)}
                      whileHover={!patternFeedback ? { scale: 1.08, y: -2 } : {}}
                      whileTap={!patternFeedback ? { scale: 0.94 } : {}}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md transition-all ${style}`}
                    >
                      <OptIcon className="w-8 h-8 stroke-[2.2]" />
                      <span className="text-xs font-bold">{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            GAME 5: WORD RECALL (LEVEL 5)
        ============================================================= */}
        {gameType === 'word_recall' && (
          <div className="w-full flex flex-col items-center justify-center my-3 max-w-xl">
            {wordPhase === 'memorizing' && (
              <motion.div key={wordIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white flex flex-col items-center justify-center shadow-xl border-2 border-white/40 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FFD166] mb-2">Word {wordIndex + 1} of 5</span>
                  <span className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">"{WORD_RECALL_DATA.shownWords[wordIndex]}"</span>
                </div>
              </motion.div>
            )}

            {wordPhase !== 'memorizing' && (
              <div className="w-full flex flex-col items-center space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                  {shuffledWordGrid.map((word) => {
                    const isSelected = userSelectedWords.includes(word);
                    const isShownWord = WORD_RECALL_DATA.shownWords.includes(word);
                    let cardClass = isSelected
                      ? 'bg-gradient-to-r from-[#1E5F60] to-[#2A9D8F] text-white border-transparent shadow-md'
                      : 'bg-white/80 hover:bg-white text-slate-800 border-teal-800/20';

                    if (wordPhase === 'reviewed') {
                      if (isShownWord && isSelected) cardClass = 'bg-emerald-500 text-white border-emerald-400 font-black';
                      else if (!isShownWord && isSelected) cardClass = 'bg-rose-500 text-white border-rose-400 font-black';
                      else if (isShownWord && !isSelected) cardClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                    }

                    return (
                      <motion.button
                        key={word}
                        type="button"
                        onClick={() => handleWordToggle(word)}
                        whileHover={wordPhase === 'recalling' ? { scale: 1.02 } : {}}
                        whileTap={wordPhase === 'recalling' ? { scale: 0.98 } : {}}
                        className={`min-h-[64px] p-4 rounded-2xl border-2 font-bold text-base sm:text-lg flex items-center justify-between cursor-pointer transition-all shadow-sm ${cardClass}`}
                      >
                        <span>{word}</span>
                        {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
                      </motion.button>
                    );
                  })}
                </div>

                {wordPhase === 'recalling' && (
                  <button
                    type="button"
                    onClick={handleWordSubmit}
                    disabled={userSelectedWords.length === 0}
                    className={`py-4 px-10 rounded-full font-bold text-lg text-white shadow-lg transition-all cursor-pointer ${
                      userSelectedWords.length > 0
                        ? 'bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] hover:opacity-95 shadow-teal-900/20'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    Submit ({userSelectedWords.length} Selected)
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* =============================================================
            GAME 6: ODD ONE OUT (LEVEL 6)
        ============================================================= */}
        {gameType === 'odd_one_out' && (
          <div className="w-full flex flex-col items-center justify-center my-3 max-w-xl space-y-6">
            <div className="grid grid-cols-2 gap-4 w-full p-2">
              {ODD_ONE_OUT_ROUNDS[oddRound].items.map((item) => {
                const isSelected = oddSelectedId === item.id;
                const isOdd = item.isOdd === true;
                const ItemIcon = item.icon;

                let cardStyle = 'bg-white/80 hover:bg-white text-slate-800 border-teal-800/20 hover:border-[#2A9D8F]';
                if (oddFeedback) {
                  if (isOdd) cardStyle = 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30 scale-103';
                  else if (isSelected && !isOdd) cardStyle = 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30';
                }

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => handleOddChoice(item)}
                    whileHover={!oddFeedback ? { scale: 1.04, y: -2 } : {}}
                    whileTap={!oddFeedback ? { scale: 0.96 } : {}}
                    className={`min-h-[120px] sm:min-h-[135px] p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-md ${cardStyle}`}
                  >
                    <ItemIcon className="w-10 h-10 stroke-[2.2]" />
                    <span className="text-base font-bold tracking-tight">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* =============================================================
            GAME 7: NUMBER MEMORY (LEVEL 7)
        ============================================================= */}
        {gameType === 'number_memory' && (
          <div className="w-full flex flex-col items-center justify-center my-3 max-w-md space-y-5">
            {/* Display / Flashing Phase */}
            {numPhase === 'showing' && (
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[2.5rem] bg-gradient-to-br from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] p-1.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-[2.3rem] bg-white flex items-center justify-center">
                  <span className="text-7xl sm:text-8xl font-black text-[#1E5F60] tracking-tight">
                    {numDisplayDigit !== null ? numDisplayDigit : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Input Phase with Keypad */}
            {numPhase !== 'showing' && (
              <div className="w-full flex flex-col items-center space-y-4">
                {/* Number Display Row */}
                <div className={`w-full min-h-[68px] p-4 rounded-2xl border-2 flex items-center justify-center text-3xl font-black tracking-widest shadow-inner ${
                  numFeedback === 'correct'
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : numFeedback === 'wrong'
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-white/90 text-slate-800 border-teal-800/25'
                }`}>
                  {numUserEntry || '_ _ _ _'}
                </div>

                {/* Numeric Keypad Grid */}
                <div className="grid grid-cols-3 gap-2.5 w-full">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleNumKeypad(num.toString())}
                      className="min-h-[56px] rounded-2xl bg-white/80 hover:bg-white text-2xl font-black text-slate-800 border-2 border-teal-800/15 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleNumClear}
                    className="min-h-[56px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-600 border border-slate-300 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumKeypad('0')}
                    className="min-h-[56px] rounded-2xl bg-white/80 hover:bg-white text-2xl font-black text-slate-800 border-2 border-teal-800/15 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleNumBackspace}
                    className="min-h-[56px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-600 border border-slate-300 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNumSubmit}
                  disabled={numUserEntry.length === 0}
                  className="w-full min-h-[54px] rounded-full bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white font-bold text-lg shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  Submit Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* =============================================================
            GAME 8: FACE-NAME MATCH (LEVEL 8)
        ============================================================= */}
        {gameType === 'face_name' && (
          <div className="w-full flex flex-col items-center justify-center my-3 max-w-xl space-y-6">
            {/* Phase 1: Memorizing Avatars & Names */}
            {facePhase === 'memorizing' && (
              <motion.div
                key={faceMemorizeIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm p-8 rounded-[2.5rem] bg-white/90 backdrop-blur-xl border-2 border-teal-800/20 shadow-xl flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${FACE_NAME_PAIRS[faceMemorizeIdx].color} text-white flex items-center justify-center shadow-lg`}>
                  <User className="w-12 h-12 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-800">{FACE_NAME_PAIRS[faceMemorizeIdx].name}</span>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Family Friend</p>
                </div>
              </motion.div>
            )}

            {/* Phase 2: Matching Avatars to Names */}
            {facePhase === 'matching' && (
              <div className="w-full space-y-6">
                {/* 4 Avatars Row */}
                <div className="flex justify-center gap-3 sm:gap-5 flex-wrap">
                  {FACE_NAME_PAIRS.map((avatar) => {
                    const isMatched = matchedFaceIds.includes(avatar.id);
                    const isSelected = selectedAvatarId === avatar.id;

                    return (
                      <motion.button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar.id)}
                        whileHover={!isMatched ? { scale: 1.08, y: -2 } : {}}
                        className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full border-3 flex items-center justify-center transition-all cursor-pointer relative shadow-md ${
                          isMatched
                            ? 'bg-emerald-500 text-white border-emerald-300 opacity-60'
                            : isSelected
                            ? `bg-gradient-to-br ${avatar.color} text-white border-white ring-4 ${avatar.ring}`
                            : `bg-gradient-to-br ${avatar.color} text-white border-white/60 hover:opacity-95`
                        }`}
                      >
                        <User className="w-9 h-9 stroke-[2.2]" />
                        {isMatched && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm border border-white">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* 4 Names Row */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  {shuffledNames.map((item) => {
                    const isMatched = matchedFaceIds.includes(item.id);
                    const isSelected = selectedNameId === item.id;

                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => handleNameSelect(item.id)}
                        whileHover={!isMatched ? { scale: 1.02 } : {}}
                        className={`min-h-[58px] p-3.5 rounded-2xl border-2 font-black text-lg flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                          isMatched
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 opacity-60'
                            : isSelected
                            ? 'bg-gradient-to-r from-[#1E5F60] to-[#2A9D8F] text-white border-transparent shadow-md'
                            : 'bg-white/80 hover:bg-white text-slate-800 border-teal-800/20'
                        }`}
                      >
                        <span>{item.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================================================
            GAME 9: STORY RECALL (LEVEL 9)
        ============================================================= */}
        {gameType === 'story_recall' && (
          <div className="w-full flex flex-col items-center justify-center my-3 max-w-xl space-y-6">
            {/* Reading Story Phase */}
            {storyPhase === 'reading' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full p-6 sm:p-8 rounded-[2.5rem] bg-white/90 backdrop-blur-xl border-2 border-teal-800/20 shadow-xl text-left space-y-4">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm uppercase tracking-wider">
                  <BookMarked className="w-4 h-4" />
                  <span>Morning in Guwahati</span>
                </div>
                <p className="text-xl sm:text-2xl text-slate-800 font-semibold leading-relaxed">
                  "{STORY_RECALL_DATA.text}"
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStoryPhase('answering')}
                    className="py-2.5 px-6 rounded-full bg-[#1E5F60] text-white text-sm font-bold shadow-md hover:bg-[#2A9D8F] transition-colors cursor-pointer"
                  >
                    I'm Ready for Questions →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Answering Questions Phase */}
            {storyPhase === 'answering' && (
              <div className="w-full space-y-5">
                <div className="p-5 rounded-2xl bg-white/90 border-2 border-teal-800/20 shadow-sm text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                    {STORY_RECALL_DATA.questions[storyQuestionIdx].q}
                  </h3>
                </div>

                <div className="space-y-3 w-full">
                  {STORY_RECALL_DATA.questions[storyQuestionIdx].options.map((opt, optIdx) => {
                    const isSelected = storySelectedOpt === optIdx;
                    const isCorrect = optIdx === STORY_RECALL_DATA.questions[storyQuestionIdx].correct;

                    let optStyle = 'bg-white/80 hover:bg-white text-slate-800 border-teal-800/20 hover:border-[#2A9D8F]';
                    if (storyFeedback) {
                      if (isCorrect) optStyle = 'bg-emerald-500 text-white border-emerald-400 font-black';
                      else if (isSelected && !isCorrect) optStyle = 'bg-rose-500 text-white border-rose-400 font-black';
                    }

                    return (
                      <motion.button
                        key={optIdx}
                        type="button"
                        onClick={() => handleStoryAnswer(optIdx)}
                        whileHover={!storyFeedback ? { scale: 1.02, x: 4 } : {}}
                        className={`w-full min-h-[58px] p-4 rounded-2xl border-2 font-bold text-base sm:text-lg flex items-center justify-between text-left transition-all cursor-pointer shadow-sm ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {storyFeedback && isCorrect && <Check className="w-5 h-5" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================================================
            GAME 10: BOSS LEVEL — MIXED CHALLENGE (LEVEL 10)
        ============================================================= */}
        {gameType === 'boss_challenge' && (
          <div className="w-full flex flex-col items-center justify-center my-2 max-w-xl">
            {/* Special Boss Intro Screen */}
            {bossIntro && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1E5F60] via-[#2A9D8F] to-[#E76F51] text-white flex flex-col items-center text-center shadow-2xl border-2 border-white/40 space-y-5"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/40"
                >
                  <Crown className="w-12 h-12 text-[#FFD166]" />
                </motion.div>

                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFD166]">
                    Final Mastery Level
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black mt-1">
                    North East Grand Journey
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 mt-2 font-medium">
                    Test your memory across 4 rapid trials: Card Match, Number Recall, Odd One Out, and Word Recall!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startBossGame}
                  className="py-4 px-10 rounded-full bg-white text-[#1E5F60] font-black text-xl shadow-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <span>Start Boss Challenge</span>
                </button>
              </motion.div>
            )}

            {/* Boss Mini 1: Rapid 2-pair Match */}
            {!bossIntro && bossMiniStep === 1 && (
              <div className="w-full space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trial 1: Rapid 2-Pair Match</span>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  {[0, 1, 2, 3].map((idx) => {
                    const isFlipped = bossMatchFlipped.includes(idx) || bossMatchPairs.includes(idx % 2);
                    const Icon = idx % 2 === 0 ? Sun : Flower2;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleBossMatchCard(idx)}
                        className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-3xl font-bold shadow-md cursor-pointer transition-all ${
                          isFlipped ? 'bg-gradient-to-br from-[#1E5F60] to-[#2A9D8F] text-white border-white' : 'bg-white text-[#1E5F60] border-teal-800/20'
                        }`}
                      >
                        {isFlipped ? <Icon className="w-10 h-10" /> : '?'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Boss Mini 2: 3-digit Number Recall */}
            {!bossIntro && bossMiniStep === 2 && (
              <div className="w-full space-y-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trial 2: 3-Digit Recall</span>
                {bossNumPhase === 'showing' ? (
                  <div className="w-40 h-40 rounded-3xl bg-[#1E5F60] text-white text-6xl font-black flex items-center justify-center mx-auto shadow-xl">
                    {bossNumDigit !== null ? bossNumDigit : ''}
                  </div>
                ) : (
                  <div className="space-y-4 max-w-xs mx-auto">
                    <input
                      type="text"
                      maxLength={3}
                      value={bossNumInput}
                      onChange={(e) => setBossNumInput(e.target.value)}
                      placeholder="Enter 3 digits"
                      className="w-full p-4 rounded-2xl bg-white border-2 border-teal-800/30 text-2xl font-black text-center"
                    />
                    <button
                      type="button"
                      onClick={handleBossNumSubmit}
                      className="w-full py-3 rounded-full bg-[#1E5F60] text-white font-bold"
                    >
                      Next Trial →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Boss Mini 3: Odd One Out */}
            {!bossIntro && bossMiniStep === 3 && (
              <div className="w-full space-y-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trial 3: Find the Odd Item</span>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <button type="button" onClick={() => handleBossOddChoice(false)} className="p-4 rounded-2xl bg-white border-2 border-teal-800/20 font-bold">Apple</button>
                  <button type="button" onClick={() => handleBossOddChoice(true)} className="p-4 rounded-2xl bg-white border-2 border-teal-800/20 font-bold">Motor Car (Odd)</button>
                  <button type="button" onClick={() => handleBossOddChoice(false)} className="p-4 rounded-2xl bg-white border-2 border-teal-800/20 font-bold">Orange</button>
                  <button type="button" onClick={() => handleBossOddChoice(false)} className="p-4 rounded-2xl bg-white border-2 border-teal-800/20 font-bold">Banana</button>
                </div>
              </div>
            )}

            {/* Boss Mini 4: 2-Word Recall */}
            {!bossIntro && bossMiniStep === 4 && (
              <div className="w-full space-y-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trial 4: Select 2 NE Heritage Words</span>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {['Majuli', 'Desert', 'Tea', 'Snow'].map((w) => {
                    const sel = bossWordSelected.includes(w);
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setBossWordSelected((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]))}
                        className={`p-4 rounded-2xl border-2 font-bold ${sel ? 'bg-[#1E5F60] text-white' : 'bg-white text-slate-800 border-teal-800/20'}`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={handleBossWordSubmit}
                  className="py-3 px-8 rounded-full bg-gradient-to-r from-[#1E5F60] to-[#E76F51] text-white font-bold"
                >
                  Finish Boss Level 🏆
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* =======================================================================
          SHARED LEVEL COMPLETION MODAL (WITH CONFETTI BURST & FALLING STREAMERS)
      ======================================================================= */}
      <AnimatePresence>
        {isLevelComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-md overflow-hidden">
            {/* 1. Full-Screen Falling Ribbon Streamers (2.6s - 4.0s with sway & tumble) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
              {ribbonStreamers.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{
                    top: -60,
                    left: `${r.startX}%`,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                  }}
                  animate={{
                    y: '115vh',
                    x: [0, r.swayAmount, -r.swayAmount, r.swayAmount * 0.6, 0],
                    rotate: r.rotateDeg,
                    opacity: [0, 1, 1, 0.95, 0],
                  }}
                  transition={{
                    duration: r.duration,
                    delay: r.delay,
                    ease: 'easeInOut',
                  }}
                  style={{
                    backgroundColor: r.color,
                    width: `${r.width}px`,
                    height: `${r.height}px`,
                  }}
                  className="absolute rounded-md shadow-md"
                />
              ))}
            </div>

            {/* 2. Central Quick Confetti Burst */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-40">
              {confettiParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y + 200,
                    scale: p.scale,
                    opacity: [1, 1, 0],
                    rotate: p.rotate + 360,
                  }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  style={{ backgroundColor: p.color }}
                  className="absolute w-3.5 h-3.5 rounded-sm shadow-md"
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border-2 border-white shadow-2xl p-6 sm:p-9 flex flex-col items-center text-center relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

              {/* Mascot & Trophy Celebration */}
              <motion.div
                initial={{ scale: 0, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 18, delay: 0.15 }}
                className="relative flex items-center justify-center mb-3"
              >
                <Mascot size={currentLevel === 10 ? 105 : 88} mood="happy" />
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#FFD166] text-slate-900 flex items-center justify-center shadow-md border-2 border-white">
                  {currentLevel === 10 ? <Crown className="w-5 h-5 fill-slate-900" /> : <Trophy className="w-4 h-4 fill-slate-900" />}
                </div>
              </motion.div>

              <h3 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] bg-clip-text text-transparent">
                {currentLevel === 10 ? t('game.championTitle', 'Memory Champion! 🏆') : t('game.levelComplete', 'Level Complete!')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1 mb-6">
                {currentLevel === 10
                  ? t('game.championSub', 'Incredible accomplishment! You completed the Grand North East Journey!')
                  : t('game.completeSub', 'Splendid memory recall! Your cognitive reflexes are sharpening.')}
              </p>

              {/* 2x2 Final Stats Grid */}
              <div className="grid grid-cols-2 gap-3 w-full mb-7">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" /> {t('game.score', 'Score')}
                  </span>
                  <span className="text-2xl font-black text-amber-900 mt-0.5">
                    {score} {t('game.pts', 'pts')}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-emerald-600" /> {t('game.accuracy', 'Accuracy')}
                  </span>
                  <span className="text-2xl font-black text-emerald-900 mt-0.5">
                    {liveAccuracy}%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1E5F60]" /> {t('game.time', 'Time')}
                  </span>
                  <span className="text-2xl font-black text-teal-900 font-mono mt-0.5">
                    {formatTime(secondsElapsed)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> {t('game.mistakes', 'Mistakes')}
                  </span>
                  <span className="text-2xl font-black text-rose-900 mt-0.5">
                    {mistakes}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={() => navigate('/levels')}
                  className="flex-1 min-h-[52px] py-3.5 px-6 rounded-full bg-white/80 hover:bg-white text-slate-800 font-bold text-base border-2 border-teal-800/20 shadow-sm transition-colors cursor-pointer"
                >
                  {t('game.backToMap', 'Back to Map')}
                </button>

                {currentLevel === 10 ? (
                  <button
                    type="button"
                    onClick={() => navigate('/progress')}
                    className="flex-1 min-h-[52px] py-3.5 px-6 rounded-full font-bold text-base text-white bg-gradient-to-r from-amber-500 via-[#E76F51] to-[#1E5F60] shadow-lg shadow-amber-600/30 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{t('game.viewFullProgress', 'View Full Progress 🏆')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/game/${currentLevel + 1}`)}
                    className="flex-1 min-h-[52px] py-3.5 px-6 rounded-full font-bold text-base text-white bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{t('game.nextLevel', 'Next Level')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePage;
