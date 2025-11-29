'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { PlanCard } from '@/components/billing/PlanCard';
import { UsageMeter } from '@/components/billing/UsageMeter';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const subscription = useQuery(api.subscriptions.get);
  const usage = useQuery(api.usage.getUserUsage);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
    }
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Billing & Usage</h1>
        <p className="text-slate-600 text-lg">Manage your subscription and track usage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-1">
          {user && (
            <PlanCard
              tier={user.tier}
              onManage={subscription ? handleManageSubscription : undefined}
              onUpgrade={user.tier !== 'team' ? handleUpgrade : undefined}
            />
          )}
        </div>

        {/* Usage Stats */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Current Usage</h2>

            {usage ? (
              <div>
                <UsageMeter
                  label="Documents Processed"
                  current={usage.usage.documentsProcessed || 0}
                  limit={usage.limits.documentsPerDay === -1 ? 'unlimited' : usage.limits.documentsPerDay}
                  unit="PDFs"
                />
                <UsageMeter
                  label="Pages Processed"
                  current={usage.usage.pagesProcessed || 0}
                  limit={usage.limits.maxPages === -1 ? 'unlimited' : usage.limits.maxPages}
                  unit="pages"
                />
                <UsageMeter
                  label="Chat Questions"
                  current={usage.usage.questionsAsked || 0}
                  limit={usage.limits.questionsPerDocument === -1 ? 'unlimited' : usage.limits.questionsPerDocument}
                  unit="questions"
                />
                {usage.limits.apiCalls > 0 && (
                  <UsageMeter
                    label="API Calls"
                    current={usage.usage.apiCalls || 0}
                    limit={usage.limits.apiCalls === -1 ? 'unlimited' : usage.limits.apiCalls}
                    unit="calls"
                  />
                )}
              </div>
            ) : (
              <p className="text-slate-600">Loading usage data...</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
