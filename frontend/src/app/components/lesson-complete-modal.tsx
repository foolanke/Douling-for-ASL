import { motion } from "motion/react";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

interface LessonCompleteModalProps {
  isOpen: boolean;
  xpEarned: number;
  lessonTitle: string;
  onContinue: () => void;
}

export function LessonCompleteModal({ isOpen, xpEarned, lessonTitle, onContinue }: LessonCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Trophy className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
          <p className="text-gray-600 mb-6">{lessonTitle}</p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                +{xpEarned} XP
              </span>
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Keep up the great work!</span>
            </div>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg font-bold rounded-xl shadow-lg"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
