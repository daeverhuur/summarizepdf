'use client';

import { motion } from 'framer-motion';
import { BillingInterval } from '@/lib/stripe/config';

interface PricingToggleProps {
  billingInterval: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}

export function PricingToggle({ billingInterval, onChange }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <motion.button
        onClick={() => onChange('month')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`text-lg font-semibold transition-all ${
          billingInterval === 'month' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        Monthly
      </motion.button>

      <div
        className="relative w-16 h-8 bg-slate-800 border-2 border-slate-700 rounded-full cursor-pointer pointer-events-auto transition-all hover:border-slate-600 shadow-lg"
        onClick={() => onChange(billingInterval === 'month' ? 'year' : 'month')}
      >
        {/* Sliding background */}
        <motion.div
          animate={{
            x: billingInterval === 'month' ? 0 : '100%',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#009de0] to-[#00d4ff] rounded-full m-0.5"
        />

        {/* Sliding indicator */}
        <motion.div
          animate={{ x: billingInterval === 'month' ? 2 : 34 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-xl border-2 border-slate-600"
        />
      </div>

      <motion.button
        onClick={() => onChange('year')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`text-lg font-semibold transition-all flex items-center gap-2 ${
          billingInterval === 'year' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        Yearly
        <motion.span
          className="px-2 py-0.5 bg-gradient-to-r from-[#00d4ff] to-purple-500 text-white text-xs font-bold rounded-full"
          animate={{
            scale: billingInterval === 'year' ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: billingInterval === 'year' ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          Save 20%
        </motion.span>
      </motion.button>
    </div>
  );
}
