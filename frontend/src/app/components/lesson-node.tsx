import { motion } from "motion/react";
import { Lock, Check, BookOpen, Crown, Target, Sprout } from "lucide-react";

interface LessonNodeProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    type: 'lesson' | 'checkpoint' | 'achievement';
    xp: number;
  };
  status: 'locked' | 'unlocked' | 'completed';
  position: 'left' | 'center' | 'right';
  onClick: () => void;
  index: number;
}

const iconMap = {
  lesson: BookOpen,
  checkpoint: Target,
  achievement: Crown,
};

const typeColors = {
  lesson: {
    completed: 'bg-gradient-to-br from-[#A4C2A5] to-[#566246]',
    unlocked: 'bg-gradient-to-br from-[#566246] to-[#6b7a55]',
    locked: 'bg-gradient-to-br from-[#4A4A48] to-[#3a3a38]',
  },
  checkpoint: {
    completed: 'bg-gradient-to-br from-[#A4C2A5] to-[#566246]',
    unlocked: 'bg-gradient-to-br from-[#8b6914] to-[#c9a96e]',
    locked: 'bg-gradient-to-br from-[#4A4A48] to-[#3a3a38]',
  },
  achievement: {
    completed: 'bg-gradient-to-br from-[#c9a96e] to-[#8b6914]',
    unlocked: 'bg-gradient-to-br from-[#c9a96e] to-[#d4a373]',
    locked: 'bg-gradient-to-br from-[#4A4A48] to-[#3a3a38]',
  },
};

export function LessonNode({ lesson, status, position, onClick, index }: LessonNodeProps) {
  const Icon = iconMap[lesson.type];

  const isClickable = status === 'unlocked';

  const getColor = () => {
    return typeColors[lesson.type][status];
  };

  const positionMap = {
    left: { offsetX: -120, align: 'items-start' },
    center: { offsetX: 0, align: 'items-center' },
    right: { offsetX: 120, align: 'items-end' },
  };

  const { offsetX, align } = positionMap[position];

  const getBorderGlow = () => {
    if (status === 'unlocked' && lesson.type === 'checkpoint') {
      return 'shadow-[0_0_25px_rgba(164,194,165,0.4)]';
    }
    if (status === 'unlocked' && lesson.type === 'achievement') {
      return 'shadow-[0_0_25px_rgba(201,169,110,0.4)]';
    }
    if (status === 'completed') {
      return 'shadow-[0_0_20px_rgba(164,194,165,0.3)]';
    }
    return 'shadow-xl';
  };

  return (
    <motion.div
      className={`flex flex-col ${align} gap-3 relative z-10`}
      style={{ marginLeft: offsetX }}
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.button
        onClick={isClickable ? onClick : undefined}
        className={`
          relative w-28 h-28 rounded-full
          ${getColor()}
          ${getBorderGlow()}
          flex items-center justify-center
          border-[6px] border-[#4A4A48]/50
          ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
          transition-all duration-200
        `}
        whileHover={isClickable ? { scale: 1.15, rotate: 5 } : {}}
        whileTap={isClickable ? { scale: 0.9 } : {}}
        disabled={!isClickable}
        animate={status === 'unlocked' ? {
          y: [0, -10, 0],
        } : {}}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* Outer glow ring for unlocked lessons */}
        {status === 'unlocked' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: lesson.type === 'achievement'
                ? 'radial-gradient(circle, rgba(201,169,110,0.25) 0%, transparent 70%)'
                : lesson.type === 'checkpoint'
                ? 'radial-gradient(circle, rgba(164,194,165,0.25) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(86,98,70,0.3) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <Icon className="w-14 h-14 text-[#F1F2EB] drop-shadow-lg" strokeWidth={2.5} />

        {status === 'completed' && (
          <motion.div
            className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#A4C2A5] to-[#566246] rounded-full flex items-center justify-center border-4 border-[#3a3a38] shadow-xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Check className="w-7 h-7 text-[#F1F2EB]" strokeWidth={3} />
          </motion.div>
        )}

        {status === 'locked' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#4A4A48]/60 rounded-full backdrop-blur-sm">
            <Lock className="w-12 h-12 text-[#D8DAD3]/50 drop-shadow-lg" />
          </div>
        )}

        {/* XP Badge */}
        {status !== 'locked' && (
          <motion.div
            className="absolute -bottom-3 bg-[#3a3a38] rounded-full px-4 py-1.5 shadow-xl border-2 border-[#566246]/40"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08 + 0.3 }}
          >
            <div className="flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#A4C2A5]" />
              <span className="text-sm font-bold text-[#A4C2A5]">{lesson.xp}</span>
            </div>
          </motion.div>
        )}
      </motion.button>

      <motion.div
        className="text-center max-w-[150px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.08 + 0.2 }}
      >
        <h3 className="font-bold text-base text-[#F1F2EB] mb-1">{lesson.title}</h3>
        <p className="text-xs text-[#D8DAD3]/50">{lesson.description}</p>
      </motion.div>
    </motion.div>
  );
}
