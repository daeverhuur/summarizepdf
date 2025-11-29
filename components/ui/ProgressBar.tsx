'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  barClassName?: string;
}

export function ProgressBar({
  value,
  max,
  showLabel = true,
  showPercentage = false,
  size = 'md',
  className = '',
  barClassName = ''
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const isComplete = percentage >= 100;

  const getColorClass = () => {
    if (isComplete) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (percentage >= 90) return 'bg-gradient-to-r from-red-500 to-orange-500';
    if (percentage >= 70) return 'bg-gradient-to-r from-yellow-500 to-orange-400';
    return 'bg-gradient-to-r from-[#009de0] to-[#00d4ff]';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-slate-600 mb-3">
          <span className="font-medium">{value} / {max === 999999 ? '∞' : max}</span>
          <span className="font-semibold">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`relative w-full bg-slate-200 rounded-full overflow-hidden shadow-inner ${getSizeClass()}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${getColorClass()} ${barClassName} relative overflow-hidden`}
        >
          {/* Animated gradient shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Percentage label inside the bar */}
        {showPercentage && percentage > 15 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-md">
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Success indicator */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"
              fill="currentColor"
            />
          </svg>
          Complete
        </motion.div>
      )}
    </div>
  );
}
