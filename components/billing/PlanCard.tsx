'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PLANS, PricingTier } from '@/lib/stripe/plans';

interface PlanCardProps {
  tier: PricingTier;
  onManage?: () => void;
  onUpgrade?: () => void;
}

export function PlanCard({ tier, onManage, onUpgrade }: PlanCardProps) {
  const plan = PLANS[tier];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{plan.name}</h3>
          <p className="text-slate-600">Current plan</p>
        </div>
        <Badge variant={tier === 'free' ? 'default' : 'success'}>{tier.toUpperCase()}</Badge>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-extrabold text-slate-900">
          ${plan.price.monthly}
        </span>
        <span className="text-slate-600">/mo</span>
      </div>

      <div className="flex gap-3">
        {tier !== 'free' && onManage && (
          <Button variant="outline" className="flex-1" onClick={onManage}>
            Manage Subscription
          </Button>
        )}
        {tier !== 'team' && onUpgrade && (
          <Button variant="primary" className="flex-1" onClick={onUpgrade}>
            Upgrade Plan
          </Button>
        )}
      </div>
    </Card>
  );
}
