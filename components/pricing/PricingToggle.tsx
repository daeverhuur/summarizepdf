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
          billingInterval === 'month' ? 'text-white' : 'text-white/40 hover:text-white/60'
        }`}
      >
        Monthly
      </button>

      <div 
        className="relative w-14 h-7 bg-white/10 border border-white/20 rounded-full cursor-pointer pointer-events-auto" 
        onClick={() => onChange(billingInterval === 'month' ? 'year' : 'month')}
      >
        <motion.div
          animate={{ x: billingInterval === 'month' ? 2 : 30 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-[#009de0] rounded-full shadow-[0_0_10px_rgba(0,157,224,0.5)]"
        />
      </div>

      <button
        onClick={() => onChange('year')}
        className={`text-lg font-semibold transition-colors ${
          billingInterval === 'year' ? 'text-white' : 'text-white/40 hover:text-white/60'
        }`}
      >
        Yearly
        <span className="ml-2 text-sm text-[#00d4ff] font-semibold">(Save 20%)</span>
      </button>
    </div>
  );
}
