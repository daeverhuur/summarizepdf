'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutCancelPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom flex items-center justify-center">
        <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 text-center shadow-2xl shadow-red-500/10">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Payment Cancelled
          </h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            Your payment was cancelled and no charges were made. You can restart checkout whenever it&apos;s convenient.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/pricing">
              <Button size="lg" className="w-full justify-center">
                View Pricing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="w-full justify-center">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
