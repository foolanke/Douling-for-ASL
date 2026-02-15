import { motion } from "motion/react";
import { useState } from "react";
import { Home, Settings, Target, Flame, User, BookOpen, ChevronLeft, ChevronRight, X, Leaf, TreePine } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface SidebarProps {
  streak: number;
  level: number;
  totalXP: number;
  dailyGoal: number;
  completedLessons: number;
  totalLessons: number;
  dictionary: { word: string; videoPath: string }[];
}

export function Sidebar({ streak, level, totalXP, dailyGoal, completedLessons, totalLessons, dictionary }: SidebarProps) {
  const levelProgress = (totalXP % 100);
  const dailyGoalProgress = Math.min((dailyGoal / 50) * 100, 100);
  const [dictIndex, setDictIndex] = useState(0);
  const [isDictOpen, setIsDictOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<'level' | 'streak' | 'goal' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
    <motion.div
      className="fixed left-0 top-0 h-screen w-80 bg-[#3a3a38] border-r border-[#566246]/30 z-40 flex flex-col"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Decorative vine along top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A4C2A5]/40 to-transparent" />

      {/* Profile */}
      <div className="p-6 border-b border-[#566246]/20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-gradient-to-br from-[#566246] to-[#A4C2A5] rounded-full flex items-center justify-center shadow-lg border-3 border-[#4A4A48]">
            <User className="w-10 h-10 text-[#F1F2EB]" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-[#F1F2EB]">Learner</h3>
            <p className="text-sm text-[#D8DAD3]/70">Level {level} · {totalXP} XP</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 border-b border-[#566246]/20">
        <Button
          variant="default"
          className="w-full justify-start gap-4 h-14 text-base bg-gradient-to-r from-[#566246] to-[#6b7a55] text-[#F1F2EB] shadow-lg border border-[#A4C2A5]/20"
        >
          <Home className="w-6 h-6" />
          <span className="font-medium">Learn</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 h-14 text-base text-[#D8DAD3]/70 hover:text-[#F1F2EB] hover:bg-[#566246]/20"
          onClick={() => { setDictIndex(-1); setIsDictOpen(true); }}
        >
          <BookOpen className="w-6 h-6" />
          <span className="font-medium">Dictionary</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 h-14 text-base text-[#D8DAD3]/70 hover:text-[#F1F2EB] hover:bg-[#566246]/20"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="w-6 h-6" />
          <span className="font-medium">Settings</span>
        </Button>
      </nav>

      {/* Stats Cards - fill remaining space evenly */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        {/* Level & XP */}
        <motion.div
          className="flex-1 bg-gradient-to-br from-[#566246]/20 to-[#A4C2A5]/10 rounded-xl p-5 border border-[#A4C2A5]/15 cursor-pointer flex flex-col justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpandedCard('level')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Leaf className="w-6 h-6 text-[#A4C2A5]" />
              <span className="text-base font-semibold text-[#F1F2EB]">Level {level}</span>
            </div>
            <span className="text-sm text-[#D8DAD3]/60">{totalXP} XP</span>
          </div>
          <Progress value={levelProgress} className="h-2.5" />
          <p className="text-sm text-[#D8DAD3]/60 mt-2">{100 - levelProgress} XP to next level</p>
        </motion.div>

        {/* Streak */}
        <motion.div
          className="flex-1 bg-gradient-to-br from-[#8b6914]/15 to-[#c9a96e]/10 rounded-xl p-5 border border-[#c9a96e]/15 cursor-pointer flex flex-col justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpandedCard('streak')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-[#c9a96e]" />
              <span className="text-base font-semibold text-[#F1F2EB]">{streak} Day Streak</span>
            </div>
            <span className="text-sm text-[#c9a96e] font-bold">~</span>
          </div>
          <p className="text-sm text-[#D8DAD3]/60 mt-1">Keep tending the garden</p>
        </motion.div>

        {/* Daily Goal */}
        <motion.div
          className="flex-1 bg-gradient-to-br from-[#A4C2A5]/10 to-[#566246]/15 rounded-xl p-5 border border-[#566246]/20 cursor-pointer flex flex-col justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpandedCard('goal')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-[#A4C2A5]" />
              <span className="text-base font-semibold text-[#F1F2EB]">Daily Goal</span>
            </div>
            <span className="text-sm font-bold text-[#A4C2A5]">{dailyGoal} / 50 XP</span>
          </div>
          <Progress value={dailyGoalProgress} className="h-2.5 mb-2" />
          <p className="text-sm text-[#D8DAD3]/60">
            {dailyGoal >= 50 ? "Harvest complete!" : `${50 - dailyGoal} XP remaining`}
          </p>
        </motion.div>
      </div>

      {/* Decorative bottom vine */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#566246]/30 to-transparent" />
    </motion.div>

    {/* Dictionary Overlay */}
    {isDictOpen && (
      <div className="fixed inset-0 z-50 bg-[#4A4A48]/85 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-[#3a3a38] rounded-2xl border border-[#566246]/30 shadow-2xl w-full max-w-4xl max-h-[85vh] mx-4 p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#A4C2A5]" />
              <h2 className="text-xl font-bold text-[#F1F2EB]">Dictionary</h2>
              <span className="text-sm text-[#D8DAD3]/50 ml-2">{dictionary.length} words</span>
            </div>
            <button
              onClick={() => { setIsDictOpen(false); setDictIndex(-1); }}
              className="text-[#D8DAD3]/50 hover:text-[#F1F2EB] transition p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {dictionary.length === 0 ? (
            <p className="text-[#D8DAD3]/50 text-center py-12">
              Complete lessons to add words here!
            </p>
          ) : dictIndex >= 0 ? (
            <>
              <button
                onClick={() => setDictIndex(-1)}
                className="flex items-center gap-1 text-sm text-[#D8DAD3]/60 hover:text-[#F1F2EB] transition mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to all words
              </button>

              <div className="bg-[#4A4A48] rounded-xl overflow-hidden mb-6">
                <video
                  key={dictIndex}
                  src={dictionary[dictIndex].videoPath}
                  controls
                  autoPlay
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              </div>

              <p className="text-center text-3xl font-bold text-[#A4C2A5] mb-6">
                {dictionary[dictIndex].word}
              </p>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setDictIndex(i => (i - 1 + dictionary.length) % dictionary.length)}
                  className="text-[#D8DAD3]/50 hover:text-[#F1F2EB] transition p-2 rounded-lg hover:bg-[#566246]/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-sm text-[#D8DAD3]/50">
                  {dictIndex + 1} / {dictionary.length}
                </span>
                <button
                  onClick={() => setDictIndex(i => (i + 1) % dictionary.length)}
                  className="text-[#D8DAD3]/50 hover:text-[#F1F2EB] transition p-2 rounded-lg hover:bg-[#566246]/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="overflow-y-auto flex-1 -mx-2">
              <div className="grid grid-cols-3 gap-3 px-2">
                {dictionary.map((entry, i) => (
                  <button
                    key={i}
                    onClick={() => setDictIndex(i)}
                    className="bg-gradient-to-br from-[#566246]/15 to-[#A4C2A5]/10 rounded-xl p-4 border border-[#A4C2A5]/15 hover:border-[#A4C2A5]/40 transition text-left"
                  >
                    <p className="text-base font-semibold text-[#A4C2A5]">{entry.word}</p>
                    <p className="text-xs text-[#D8DAD3]/40 mt-1">Tap to review</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Settings Overlay */}
    {isSettingsOpen && (
      <div className="fixed inset-0 z-50 bg-[#4A4A48]/85 backdrop-blur-sm flex items-center justify-center">
        <motion.div
          className="bg-[#3a3a38] rounded-2xl border border-[#566246]/30 shadow-2xl w-full max-w-2xl mx-4 p-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="flex items-center justify-between mb-6 border-b border-[#566246]/20 pb-4">
            <div className="flex items-center gap-3">
              <Settings className="w-7 h-7 text-[#A4C2A5]" />
              <h2 className="text-2xl font-bold text-[#F1F2EB]">Settings</h2>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-[#D8DAD3]/50 hover:text-[#F1F2EB] transition p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#F1F2EB] mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-[#A4C2A5]" />
                Account
              </h3>
              <div className="space-y-3 ml-7">
                <div className="flex items-center justify-between p-3 bg-[#4A4A48]/40 rounded-lg hover:bg-[#4A4A48]/60 transition cursor-pointer">
                  <span className="text-sm text-[#D8DAD3]">Edit Profile</span>
                  <ChevronRight className="w-4 h-4 text-[#D8DAD3]/40" />
                </div>
                <div className="flex items-center justify-between p-3 bg-[#4A4A48]/40 rounded-lg hover:bg-[#4A4A48]/60 transition cursor-pointer">
                  <span className="text-sm text-[#D8DAD3]">Change Password</span>
                  <ChevronRight className="w-4 h-4 text-[#D8DAD3]/40" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#F1F2EB] mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#A4C2A5]" />
                Learning Preferences
              </h3>
              <div className="space-y-3 ml-7">
                <div className="flex items-center justify-between p-3 bg-[#4A4A48]/40 rounded-lg">
                  <span className="text-sm text-[#D8DAD3]">Daily Goal</span>
                  <span className="text-sm text-[#A4C2A5] font-semibold">50 XP</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#4A4A48]/40 rounded-lg">
                  <span className="text-sm text-[#D8DAD3]">Reminder Notifications</span>
                  <div className="w-10 h-6 bg-[#566246] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-[#F1F2EB] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#F1F2EB] mb-3 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-[#A4C2A5]" />
                Appearance
              </h3>
              <div className="space-y-3 ml-7">
                <div className="flex items-center justify-between p-3 bg-[#4A4A48]/40 rounded-lg hover:bg-[#4A4A48]/60 transition cursor-pointer">
                  <span className="text-sm text-[#D8DAD3]">Theme</span>
                  <span className="text-sm text-[#D8DAD3]/50">Forest</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#4A4A48]/40 rounded-lg hover:bg-[#4A4A48]/60 transition cursor-pointer">
                  <span className="text-sm text-[#D8DAD3]">Language</span>
                  <span className="text-sm text-[#D8DAD3]/50">English</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}

    {/* Stats Card Overlay */}
    {expandedCard && (
      <div className="fixed inset-0 z-50 bg-[#4A4A48]/85 backdrop-blur-sm flex items-center justify-center">
        <motion.div
          className="bg-[#3a3a38] rounded-2xl border border-[#566246]/30 shadow-2xl w-full max-w-md mx-4 p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setExpandedCard(null)}
              className="text-[#D8DAD3]/50 hover:text-[#F1F2EB] transition p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {expandedCard === 'level' && (
            <div className="text-center">
              <Leaf className="w-16 h-16 text-[#A4C2A5] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#F1F2EB] mb-2">Level {level}</h2>
              <p className="text-lg text-[#D8DAD3]/60 mb-6">{totalXP} Total XP</p>
              <Progress value={levelProgress} className="h-4 mb-3" />
              <p className="text-sm text-[#D8DAD3]/60">{100 - levelProgress} XP to reach Level {level + 1}</p>
            </div>
          )}

          {expandedCard === 'streak' && (
            <div className="text-center">
              <Flame className="w-16 h-16 text-[#c9a96e] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#F1F2EB] mb-2">{streak} Day Streak</h2>
              <p className="text-lg text-[#D8DAD3]/60 mb-6">The garden grows stronger each day.</p>
              <div className="flex justify-center gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i < streak
                        ? 'bg-[#566246]/40 border border-[#A4C2A5]/40 text-[#A4C2A5]'
                        : 'bg-[#4A4A48]/40 border border-[#4A4A48] text-[#D8DAD3]/30'
                    }`}
                  >
                    {i < streak ? <Leaf className="w-4 h-4" /> : i + 1}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#D8DAD3]/40 mt-4">Last 7 days</p>
            </div>
          )}

          {expandedCard === 'goal' && (
            <div className="text-center">
              <Target className="w-16 h-16 text-[#A4C2A5] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#F1F2EB] mb-2">Daily Goal</h2>
              <p className="text-lg text-[#D8DAD3]/60 mb-6">{dailyGoal} / 50 XP today</p>
              <Progress value={dailyGoalProgress} className="h-4 mb-3" />
              <p className="text-sm text-[#D8DAD3]/60">
                {dailyGoal >= 50
                  ? "Harvest complete! Well done."
                  : `${50 - dailyGoal} XP remaining — keep growing!`}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    )}
    </>
  );
}
