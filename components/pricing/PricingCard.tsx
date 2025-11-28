'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { PLANS, PricingTier } from '@/lib/stripe/plans';
import { STRIPE_CONFIG, BillingInterval } from '@/lib/stripe/config';

// Custom check icon
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M5 10l3 3 7-7" stroke="#009de0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface PricingCardProps {
  tier: PricingTier;
  billingInterval: BillingInterval;
}

export function PricingCard({ tier, billingInterval }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const plan = PLANS[tier];

  const price = billingInterval === 'month' ? plan.price.monthly : plan.price.yearly;
  const savings = billingInterval === 'year' ? Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100) : 0;

  const handleSubscribe = async () => {
    if (tier === 'free') {
      router.push('/sign-up');
      return;
    }

    setLoading(true);
    try {
      const priceId = tier === 'starter'
        ? (billingInterval === 'month' ? STRIPE_CONFIG.products.starter.monthlyPriceId : STRIPE_CONFIG.products.starter.yearlyPriceId)
        : tier === 'pro'
        ? (billingInterval === 'month' ? STRIPE_CONFIG.products.pro.monthlyPriceId : STRIPE_CONFIG.products.pro.yearlyPriceId)
        : (billingInterval === 'month' ? STRIPE_CONFIG.products.team.monthlyPriceId : STRIPE_CONFIG.products.team.yearlyPriceId);

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tier }),
      });

      const { url } = await response.json();

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { label: 'PDFs per day', value: plan.features.pdfsPerDay === 'unlimited' ? 'Unlimited' : plan.features.pdfsPerDay },
    { label: 'Max pages per PDF', value: plan.features.maxPagesPerPdf },
    { label: 'Chat questions', value: plan.features.chatQuestionsPerDoc === 'unlimited' ? 'Unlimited' : `${plan.features.chatQuestionsPerDoc} per doc` },
    { label: 'Document library', value: plan.features.documentLibrarySize },
    { label: 'Export formats', value: plan.features.exportFormats },
    { label: 'API access', value: plan.features.apiAccess },
    { label: 'Priority processing', value: plan.features.priorityProcessing },
  ];

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative bg-[#16161f] rounded-2xl border p-8 h-full flex flex-col ${
        plan.popular 
          ? 'border-[#009de0] shadow-[0_0_30px_rgba(0,157,224,0.2)]' 
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="relative inline-block bg-[#009de0] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Most Popular
              {/* Pulsing ring effect */}
              <motion.span
                className="absolute inset-0 rounded-full bg-[#009de0]"
                animate={{
                  scale: [1, 1.2],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </span>
          </motion.div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>

      <div className="mb-6">
        <span className="text-5xl font-extrabold text-white">${price}</span>
        <span className="text-white/40 ml-1">/{billingInterval === 'month' ? 'mo' : 'yr'}</span>
        {savings > 0 && (
          <span className="ml-3 text-sm text-[#00d4ff] font-semibold">Save {savings}%</span>
        )}
      </div>

      <Button
        variant={plan.popular ? 'glow' : 'secondary'}
        className="w-full mb-8"
        onClick={handleSubscribe}
        isLoading={loading}
      >
        {plan.cta}
      </Button>

      <ul className="space-y-4 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckIcon className="flex-shrink-0 mt-0.5" />
            <span className="text-white/60">
              <span className="text-white/80 font-medium">{feature.label}:</span>{' '}
              {typeof feature.value === 'boolean' ? (feature.value ? 'Yes' : 'No') : feature.value}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
