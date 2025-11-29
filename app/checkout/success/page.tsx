'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom flex items-center justify-center">
        <div className="max-w-lg w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for subscribing to SummarizePDF. Your premium features are unlocked and ready whenever you are.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="w-full justify-center">
              Go to Dashboard
            </Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Redirecting automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
