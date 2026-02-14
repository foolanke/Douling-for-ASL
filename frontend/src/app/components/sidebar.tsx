import { motion } from "motion/react";
import { Home, BookOpen, Trophy, TrendingUp, Settings, User, Target, Flame, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface SidebarProps {
  streak: number;
  level: number;
  totalXP: number;
  dailyGoal: number;
  completedLessons: number;
  totalLessons: number;
}

export function Sidebar({ streak, level, totalXP, dailyGoal, completedLessons, totalLessons }: SidebarProps) {
  const levelProgress = (totalXP % 100);
  const dailyGoalProgress = Math.min((dailyGoal / 50) * 100, 100);

  const navItems = [
    { icon: Home, label: "Learn", active: true },
    { icon: BookOpen, label: "Practice", active: false },
    { icon: Trophy, label: "Leaderboard", active: false },
    { icon: Target, label: "Goals", active: false },
  ];

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen w-80 bg-slate-900 border-r border-slate-800 z-40 flex flex-col"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* User Profile */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-slate-700"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <User className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Learning User</h3>
            <p className="text-sm text-slate-400">Beginner</p>
          </div>
        </div>

        {/* Level & XP */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-slate-200">Level {level}</span>
              </div>
              <span className="text-xs text-slate-400">{totalXP} XP</span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-slate-800" />
            <p className="text-xs text-slate-400 mt-1.5">{100 - levelProgress} XP to next level</p>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-semibold text-slate-200">{streak} Day Streak</span>
              </div>
              <span className="text-xs text-orange-400 font-bold">🔥</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Keep it up! Don't break the chain</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={`w-full justify-start gap-3 h-12 ${
              item.active
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Daily Goal */}
      <div className="p-6 border-t border-slate-800">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-slate-200">Daily Goal</span>
            </div>
            <span className="text-xs font-bold text-blue-400">{dailyGoal} / 50 XP</span>
          </div>
          <Progress value={dailyGoalProgress} className="h-2 bg-slate-800 mb-2" />
          <p className="text-xs text-slate-400">
            {dailyGoal >= 50 ? "🎉 Completed!" : `${50 - dailyGoal} XP remaining`}
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-slate-800">
        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Button>
      </div>
    </motion.div>
  );
}
