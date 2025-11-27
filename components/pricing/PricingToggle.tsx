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
      <button
        onClick={() => onChange('month')}
        className={`text-lg font-semibold transition-colors ${
          billingInterval === 'month' ? 'text-slate-900' : 'text-slate-400'
        }`}
      >
        Monthly
      </button>

      <div className="relative w-14 h-7 bg-slate-200 rounded-full cursor-pointer" onClick={() => onChange(billingInterval === 'month' ? 'year' : 'month')}>
        <motion.div
          animate={{ x: billingInterval === 'month' ? 2 : 30 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
        />
      </div>

      <button
        onClick={() => onChange('year')}
        className={`text-lg font-semibold transition-colors ${
          billingInterval === 'year' ? 'text-slate-900' : 'text-slate-400'
        }`}
      >
        Yearly
        <span className="ml-2 text-sm text-green-600 font-semibold">(Save 20%)</span>
      </button>
    </div>
  );
}
