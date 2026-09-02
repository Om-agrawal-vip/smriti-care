import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Minus,
  Sparkles,
  Flame,
  Star,
  Gamepad2,
  BarChart2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

export const ProgressPage = () => {
  const navigate = useNavigate();
  const { userProfile, levelProgress } = useApp();
  const { t } = useTranslation();

  // Completed levels
  const completedLevels = useMemo(() => {
    return levelProgress.filter((lvl) => lvl.completed);
  }, [levelProgress]);

  const hasProgress = completedLevels.length > 0;

  // 1. STATS CALCULATIONS
  const totalLevels = levelProgress.length;
  const completedCount = completedLevels.length;

  const averageAccuracy = useMemo(() => {
    if (completedLevels.length === 0) return 0;
    const total = completedLevels.reduce((acc, curr) => acc + (curr.accuracy || 0), 0);
    return Math.round(total / completedLevels.length);
  }, [completedLevels]);

  const averageTimeString = useMemo(() => {
    if (completedLevels.length === 0) return '--';
    let totalSecs = 0;
    let validCount = 0;

    completedLevels.forEach((lvl) => {
      if (typeof lvl.timeTaken === 'string') {
        if (lvl.timeTaken.includes(':')) {
          const [m, s] = lvl.timeTaken.split(':').map(Number);
          if (!isNaN(m) && !isNaN(s)) {
            totalSecs += m * 60 + s;
            validCount++;
          }
        } else if (lvl.timeTaken.includes('m') || lvl.timeTaken.includes('s')) {
          const mMatch = lvl.timeTaken.match(/(\d+)m/);
          const sMatch = lvl.timeTaken.match(/(\d+)s/);
          const m = mMatch ? parseInt(mMatch[1], 10) : 0;
          const s = sMatch ? parseInt(sMatch[1], 10) : 0;
          totalSecs += m * 60 + s;
          validCount++;
        }
      }
    });

    if (validCount === 0) return '1m 15s';
    const avg = Math.round(totalSecs / validCount);
    const mins = Math.floor(avg / 60);
    const secs = avg % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, [completedLevels]);

  const engagementStatus = useMemo(() => {
    if (completedLevels.length < 3) {
      return { status: t('progress.gettingStarted', 'Getting Started'), icon: TrendingUp, color: 'text-purple-700 bg-purple-50 border-purple-200' };
    }
    const recent3 = completedLevels.slice(-3);
    const earlier = completedLevels.slice(0, -3);

    const recentAvg = recent3.reduce((a, b) => a + (b.accuracy || 0), 0) / recent3.length;
    const earlierAvg =
      earlier.length > 0
        ? earlier.reduce((a, b) => a + (b.accuracy || 0), 0) / earlier.length
        : recentAvg;

    if (recentAvg >= earlierAvg) {
      return { status: t('progress.improving', 'Improving'), icon: TrendingUp, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    } else {
      return { status: t('progress.stable', 'Stable'), icon: Minus, color: 'text-teal-700 bg-teal-50 border-teal-200' };
    }
  }, [completedLevels, t]);

  // 2. CHART DATA
  const chartData = useMemo(() => {
    return completedLevels.map((lvl) => ({
      levelName: `Lvl ${lvl.level}`,
      accuracy: lvl.accuracy || 85,
      score: lvl.score || 0,
      title: lvl.name || `Level ${lvl.level}`,
    }));
  }, [completedLevels]);

  // 3. BADGES EARNED LOGIC
  const badges = useMemo(() => {
    const list = [];
    if (averageAccuracy >= 80 && completedCount >= 1) {
      list.push({
        id: 'accuracy',
        name: 'Great Accuracy!',
        subtext: 'Maintained 80%+ recall precision',
        icon: Trophy,
        color: 'from-amber-400 to-yellow-500 text-amber-950',
      });
    }
    if (completedCount >= 3) {
      list.push({
        id: 'consistent',
        name: 'Consistent Player',
        subtext: 'Completed 3+ cultural memory games',
        icon: Flame,
        color: 'from-orange-500 to-rose-500 text-white',
      });
    }
    if (completedCount >= 5) {
      list.push({
        id: 'halfway',
        name: 'Halfway Journey!',
        subtext: 'Mastered 5 distinct cognitive chapters',
        icon: Star,
        color: 'from-teal-500 to-emerald-600 text-white',
      });
    }
    return list;
  }, [averageAccuracy, completedCount]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border-2 border-teal-800/20 shadow-xl text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1E5F60]">
            {data.title}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xl font-black text-slate-800">
              {data.accuracy}% {t('game.accuracy', 'Accuracy')}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {data.score} {t('game.pts', 'pts')}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const TrendIcon = engagementStatus.icon;

  return (
    <div className="w-full min-h-[92vh] flex flex-col items-center justify-start px-4 py-8 md:py-10 relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/80 shadow-[0_30px_90px_-15px_rgba(30,95,96,0.25)] p-6 sm:p-10 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] via-[#E76F51] to-[#5C9E50]" />

        {/* 1. HEADER SECTION */}
        <motion.div
          variants={itemVariants}
          className="w-full flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80"
        >
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
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] bg-clip-text text-transparent">
              {t('progress.heading', 'Your Progress')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              {t('progress.subtext', "See how your memory is improving")} ({userProfile?.name})
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#1E5F60]/10 flex items-center justify-center text-[#1E5F60]">
            <BarChart2 className="w-5 h-5" />
          </div>
        </motion.div>

        {/* EMPTY STATE */}
        {!hasProgress && (
          <motion.div
            variants={itemVariants}
            className="py-14 px-6 flex flex-col items-center text-center space-y-4 max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-800/20 text-[#1E5F60] flex items-center justify-center shadow-inner">
              <Gamepad2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">
              {t('progress.emptyTitle', 'No levels completed yet')}
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {t('progress.emptySub', 'Start your cognitive journey by playing Level 1.')}
            </p>
            <motion.button
              type="button"
              onClick={() => navigate('/levels')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-4 py-3.5 px-8 rounded-full bg-gradient-to-r from-[#1E5F60] via-[#2A9D8F] to-[#5C9E50] text-white font-bold text-base shadow-lg shadow-teal-900/20 cursor-pointer"
            >
              {t('progress.playNow', 'Play Level 1 Now')}
            </motion.button>
          </motion.div>
        )}

        {/* ACTIVE DASHBOARD (STATS + CHART + BADGES) */}
        {hasProgress && (
          <div className="w-full space-y-8">
            {/* 2. STAT CARDS ROW (4 CARDS) */}
            <motion.div
              id="tour-stats-cards"
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 w-full"
            >
              {/* Card 1: Levels Completed */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/80 border-2 border-teal-800/15 shadow-sm flex flex-col items-center text-center group hover:border-[#2A9D8F] transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center mb-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('progress.levelsCompleted', 'Levels Completed')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                  {completedCount}/{totalLevels}
                </span>
              </div>

              {/* Card 2: Average Accuracy */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/80 border-2 border-teal-800/15 shadow-sm flex flex-col items-center text-center group hover:border-[#2A9D8F] transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('progress.averageAccuracy', 'Average Accuracy')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                  {averageAccuracy}%
                </span>
              </div>

              {/* Card 3: Average Time */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/80 border-2 border-teal-800/15 shadow-sm flex flex-col items-center text-center group hover:border-[#2A9D8F] transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-[#1E5F60] flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-[#1E5F60]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('progress.averageTime', 'Average Time')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                  {averageTimeString}
                </span>
              </div>

              {/* Card 4: Engagement Trend */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/80 border-2 border-teal-800/15 shadow-sm flex flex-col items-center text-center group hover:border-[#2A9D8F] transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-800 flex items-center justify-center mb-2">
                  <TrendIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('progress.cognitiveTrend', 'Cognitive Trend')}
                </span>
                <span className="text-lg sm:text-xl font-black text-slate-800 mt-1">
                  {engagementStatus.status}
                </span>
              </div>
            </motion.div>

            {/* 3. RECHARTS ACCURACY OVER TIME AREA CHART */}
            <motion.div
              id="tour-accuracy-chart"
              variants={itemVariants}
              className="w-full p-5 sm:p-7 rounded-[2.5rem] bg-white/85 backdrop-blur-xl border-2 border-teal-800/20 shadow-lg relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                    {t('progress.accuracyOverTime', 'Accuracy Over Time')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {t('progress.chartSubtitle', 'Performance trend across completed memory levels')}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cognitive Metric</span>
                </div>
              </div>

              {/* Responsive Chart Container */}
              <div className="w-full h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="accuracyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2A9D8F" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#2A9D8F" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="levelName"
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                      tickLine={false}
                      axisLine={false}
                      unit="%"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#1E5F60"
                      strokeWidth={3.5}
                      fillOpacity={1}
                      fill="url(#accuracyAreaGrad)"
                      activeDot={{ r: 7, fill: '#E76F51', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* 4. ACHIEVEMENTS & MILESTONE BADGES */}
            {badges.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 text-left">
                  {t('progress.achievements', 'Achievements & Milestones')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {badges.map((b) => {
                    const BadgeIcon = b.icon;
                    return (
                      <motion.div
                        key={b.id}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="p-4 rounded-2xl bg-white/80 border-2 border-teal-800/15 shadow-sm flex items-center gap-3.5 text-left"
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                          <BadgeIcon className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-800">{b.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{b.subtext}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressPage;
