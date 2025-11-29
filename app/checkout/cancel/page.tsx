'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutCancelPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom flex items-center justify-center">
        <div className="max-w-lg w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
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
