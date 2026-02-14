import { motion } from "motion/react";

interface PathDecorationsProps {
  totalLessons: number;
}

export function PathDecorations({ totalLessons }: PathDecorationsProps) {
  const clouds = [
    { x: '15%', y: '10%', size: 60, delay: 0 },
    { x: '75%', y: '15%', size: 80, delay: 0.5 },
    { x: '25%', y: '35%', size: 70, delay: 1 },
    { x: '80%', y: '50%', size: 65, delay: 1.5 },
    { x: '10%', y: '70%', size: 75, delay: 2 },
    { x: '85%', y: '85%', size: 70, delay: 2.5 },
  ];

  const stars = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated stars */}
      {stars.map((star, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-yellow-300"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* Clouds */}
      {clouds.map((cloud, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute"
          style={{ left: cloud.x, top: cloud.y }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.6 }}
          transition={{ delay: cloud.delay, duration: 1 }}
        >
          <svg width={cloud.size} height={cloud.size * 0.6} viewBox="0 0 100 60">
            <path
              d="M25,40 Q15,40 15,30 Q15,20 25,20 Q25,10 40,10 Q55,10 55,20 Q65,20 65,30 Q65,40 55,40 Z"
              fill="#1e293b"
              opacity="0.3"
            />
          </svg>
        </motion.div>
      ))}

      {/* Decorative gradient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
}
