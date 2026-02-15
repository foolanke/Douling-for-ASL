import { motion } from "motion/react";
import { Sprout, Leaf, TrendingUp } from "lucide-react";
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
    <div className="fixed inset-0 bg-[#4A4A48]/60 flex items-center justify-center z-40 p-4">
      <motion.div
        className="bg-[#F1F2EB] rounded-2xl p-8 max-w-md w-full shadow-2xl"
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
          <div className="w-24 h-24 bg-gradient-to-br from-[#566246] to-[#A4C2A5] rounded-full flex items-center justify-center shadow-lg">
            <Sprout className="w-14 h-14 text-[#F1F2EB]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-[#4A4A48] mb-2">Lesson Complete!</h2>
          <p className="text-[#4A4A48]/60 mb-6">{lessonTitle}</p>

          <div className="bg-gradient-to-r from-[#A4C2A5]/20 to-[#566246]/10 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Leaf className="w-6 h-6 text-[#566246]" />
              <span className="text-4xl font-bold text-[#566246]">
                +{xpEarned} XP
              </span>
              <Leaf className="w-6 h-6 text-[#566246]" />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-[#4A4A48]/60">
              <TrendingUp className="w-4 h-4" />
              <span>Your garden is growing!</span>
            </div>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-[#566246] to-[#6b7a55] hover:from-[#4A4A48] hover:to-[#566246] text-[#F1F2EB] py-6 text-lg font-bold rounded-xl shadow-lg"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
