'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, max, showLabel = true, className = '', barClassName = '' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClass = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-[#009de0] to-[#00d4ff]';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-slate-600 mb-3">
          <span>{value} / {max === 999999 ? '∞' : max}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${getColorClass()} ${barClassName}`}
        />
      </div>
    </div>
  );
}
