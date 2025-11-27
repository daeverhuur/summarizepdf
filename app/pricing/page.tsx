'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingCard } from '@/components/pricing/PricingCard';
import { PricingToggle } from '@/components/pricing/PricingToggle';
import { BillingInterval, PricingTier } from '@/lib/stripe/config';

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');

  const tiers: PricingTier[] = ['free', 'starter', 'pro', 'team'];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Start free, upgrade anytime.
            </p>
          </div>

          <PricingToggle billingInterval={billingInterval} onChange={setBillingInterval} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {tiers.map((tier) => (
              <PricingCard key={tier} tier={tier} billingInterval={billingInterval} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
