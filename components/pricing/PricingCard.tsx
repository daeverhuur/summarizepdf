'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { PLANS, PricingTier } from '@/lib/stripe/plans';
import { STRIPE_CONFIG, BillingInterval } from '@/lib/stripe/config';

// Custom icons
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M5 10l3 3 7-7" stroke="#009de0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5-5m0 0l5 5m-5-5v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ApiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M8 3l4 4-4 4M16 3l-4 4 4 4M3 15l4-4 4 4M21 15l-4-4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h8v8l10-12h-8V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LibraryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="10" y="2" width="5" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M17 6l5 2v12l-5-2V6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    { 
      icon: DocumentIcon, 
      label: 'PDFs per day', 
      value: plan.features.pdfsPerDay === 'unlimited' ? 'Unlimited' : plan.features.pdfsPerDay,
      enabled: true 
    },
    { 
      icon: DocumentIcon, 
      label: 'Max pages per PDF', 
      value: plan.features.maxPagesPerPdf,
      enabled: true 
    },
    { 
      icon: ChatIcon, 
      label: 'Chat questions', 
      value: plan.features.chatQuestionsPerDoc === 'unlimited' ? 'Unlimited' : `${plan.features.chatQuestionsPerDoc} per doc`,
      enabled: true 
    },
    { 
      icon: LibraryIcon, 
      label: 'Document library', 
      value: plan.features.documentLibrarySize,
      enabled: true 
    },
    { 
      icon: ExportIcon, 
      label: 'Export formats', 
      value: plan.features.exportFormats,
      enabled: plan.features.exportFormats 
    },
    { 
      icon: ApiIcon, 
      label: 'API access', 
      value: plan.features.apiAccess,
      enabled: plan.features.apiAccess 
    },
    { 
      icon: ZapIcon, 
      label: 'Priority processing', 
      value: plan.features.priorityProcessing,
      enabled: plan.features.priorityProcessing 
    },
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

      <ul className="space-y-3 flex-grow">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          const isBoolean = typeof feature.value === 'boolean';
          const displayValue = isBoolean ? (feature.value ? 'Included' : 'Not included') : feature.value;
          
          return (
            <motion.li 
              key={i} 
              className={`group relative ${!feature.enabled ? 'opacity-40' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: !feature.enabled ? 0.4 : 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                {/* Icon container with gradient background */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  feature.enabled 
                    ? 'bg-[#009de0]/10 text-[#009de0] group-hover:bg-[#009de0]/20' 
                    : 'bg-white/5 text-white/30'
                }`}>
                  <Icon />
                </div>
                
                {/* Feature content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white/90 mb-0.5">
                    {feature.label}
                  </div>
                  <div className={`text-sm font-semibold ${
                    feature.enabled 
                      ? displayValue === 'Unlimited' 
                        ? 'text-[#00d4ff]' 
                        : 'text-white/70'
                      : 'text-white/30'
                  }`}>
                    {displayValue}
                  </div>
                </div>
                
                {/* Status indicator */}
                {isBoolean && (
                  <div className="flex-shrink-0 mt-1">
                    {feature.value ? (
                      <CheckIcon className="text-[#009de0]" />
                    ) : (
                      <CloseIcon className="text-white/20" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Subtle hover effect line */}
              {feature.enabled && (
                <motion.div
                  className="absolute left-0 bottom-0 h-px bg-gradient-to-r from-[#009de0]/0 via-[#009de0]/30 to-[#009de0]/0 w-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
