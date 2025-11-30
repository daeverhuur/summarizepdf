'use client';

import { motion } from 'framer-motion';

export function TransformationWave() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Diagonal gradient line */}
      <div className="absolute inset-0 transform-gpu">
        <motion.div
          className="absolute w-1 h-[150%] top-[-25%] left-[65%] origin-center"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #009de0 20%, #7c3aed 80%, transparent 100%)',
            transform: 'rotate(-25deg)',
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute w-8 h-[150%] top-[-25%] left-[calc(65%-1rem)] origin-center blur-xl"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 157, 224, 0.4) 20%, rgba(124, 58, 237, 0.4) 80%, transparent 100%)',
            transform: 'rotate(-25deg)',
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scaleX: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Particle stream */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#009de0] to-[#7c3aed]"
          style={{
            left: `calc(65% - ${i * 2}px)`,
            top: '-20px',
          }}
          animate={{
            y: ['0vh', '120vh'],
            x: [0, -i * 15],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + i * 0.5,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Additional particle dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `calc(65% + ${Math.sin(i * 2) * 30}px)`,
            top: `${20 + i * 15}%`,
            background: i % 2 === 0 ? '#009de0' : '#7c3aed',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
