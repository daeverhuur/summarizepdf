'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PLANS, PricingTier } from '@/lib/stripe/plans';
import { STRIPE_CONFIG, BillingInterval } from '@/lib/stripe/config';

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
    <Card
      hover
      className={`p-8 ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}
    >
      {plan.popular && (
        <div className="mb-4">
          <span className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>

      <div className="mb-6">
        <span className="text-5xl font-extrabold text-slate-900">${price}</span>
        <span className="text-slate-600">/{billingInterval === 'month' ? 'mo' : 'yr'}</span>
        {savings > 0 && (
          <span className="ml-2 text-sm text-green-600 font-semibold">Save {savings}%</span>
        )}
      </div>

      <Button
        variant={plan.popular ? 'primary' : 'outline'}
        className="w-full mb-6"
        onClick={handleSubscribe}
        isLoading={loading}
      >
        {plan.cta}
      </Button>

      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">
              <span className="font-semibold">{feature.label}:</span>{' '}
              {typeof feature.value === 'boolean' ? (feature.value ? 'Yes' : 'No') : feature.value}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
