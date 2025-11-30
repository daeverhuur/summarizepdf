'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BillingInterval } from '@/lib/stripe/config';

interface PricingToggleProps {
  billingInterval: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}

export function PricingToggle({ billingInterval, onChange }: PricingToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onChange(billingInterval === 'month' ? 'year' : 'month');
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleButtonClick = (interval: BillingInterval) => {
    if (billingInterval !== interval) {
      setIsAnimating(true);
      onChange(interval);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 mb-12">
      <motion.button
        onClick={() => handleButtonClick('month')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative text-lg font-semibold transition-all duration-300 px-4 py-2 rounded-lg ${
          billingInterval === 'month'
            ? 'text-[#009de0]'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        <AnimatePresence>
          {billingInterval === 'month' && (
            <motion.div
              layoutId="activeBackground"
              className="absolute inset-0 bg-gradient-to-r from-[#009de0]/20 to-[#00d4ff]/20 rounded-lg -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">Monthly</span>
      </motion.button>

      <motion.div
        className="relative w-20 h-10 bg-slate-800/80 border-2 border-slate-700/50 rounded-full cursor-pointer overflow-hidden shadow-xl backdrop-blur-sm"
        onClick={handleToggle}
        whileTap={{ scale: 0.95 }}
        animate={{
          borderColor: isAnimating
            ? '#009de0'
            : billingInterval === 'month'
            ? '#009de0/50'
            : '#009de0',
          boxShadow: isAnimating
            ? '0 0 20px rgba(0, 157, 224, 0.5)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#009de0]/30 to-[#00d4ff]/30"
          animate={{
            opacity: isAnimating ? [0.3, 0.6, 0.3] : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Sliding background */}
        <motion.div
          animate={{
            x: billingInterval === 'month' ? 0 : '100%',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
          }}
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#009de0] to-[#00d4ff] rounded-full m-0.5"
        />

        {/* Ripple effect on click */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* Sliding indicator */}
        <motion.div
          animate={{
            x: billingInterval === 'month' ? 4 : 44,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
          }}
          className="absolute top-1 w-7 h-7 bg-white rounded-full shadow-2xl border-2 border-[#009de0]/30"
        >
          {/* Inner glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white to-slate-100 rounded-full"
            animate={{
              scale: isAnimating ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => handleButtonClick('year')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative text-lg font-semibold transition-all duration-300 px-4 py-2 rounded-lg flex flex-col items-center gap-1 ${
          billingInterval === 'year'
            ? 'text-[#009de0]'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        <AnimatePresence>
          {billingInterval === 'year' && (
            <motion.div
              layoutId="activeBackground"
              className="absolute inset-0 bg-gradient-to-r from-[#009de0]/20 to-[#00d4ff]/20 rounded-lg -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <motion.span
          className="relative z-10 px-2.5 py-0.5 bg-gradient-to-r from-[#009de0] to-[#00d4ff] text-white text-[10px] font-bold rounded-full shadow-lg border border-[#00d4ff]/50"
          animate={{
            scale: billingInterval === 'year' ? [1, 1.1, 1] : 1,
            boxShadow: billingInterval === 'year'
              ? ['0 4px 6px rgba(0, 157, 224, 0.3)', '0 6px 12px rgba(0, 157, 224, 0.5)', '0 4px 6px rgba(0, 157, 224, 0.3)']
              : '0 2px 4px rgba(0, 157, 224, 0.2)',
          }}
          transition={{
            duration: 2,
            repeat: billingInterval === 'year' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          Save 20%
        </motion.span>
        <span className="relative z-10">Yearly</span>
      </motion.button>
    </div>
  );
}
