import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ConfettiProps {
  show: boolean;
  onComplete: () => void;
}

export function Confetti({ show, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * -100 - 50,
        rotation: Math.random() * 360,
        color: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
      }));
      setParticles(newParticles);

      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-sm"
          style={{ backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: particle.x * 8,
            y: particle.y * 8 + 800,
            opacity: 0,
            rotate: particle.rotation * 4,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
