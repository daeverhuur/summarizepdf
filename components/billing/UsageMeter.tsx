'use client';

import { ProgressBar } from '@/components/ui/ProgressBar';

interface UsageMeterProps {
  label: string;
  current: number;
  limit: number | 'unlimited';
  unit?: string;
}

export function UsageMeter({ label, current, limit, unit = '' }: UsageMeterProps) {
  if (limit === 'unlimited') {
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900 mb-2">{label}</h4>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="text-2xl font-bold">{current}</span>
          <span>{unit}</span>
          <span className="ml-auto text-green-600 font-semibold">Unlimited</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="font-semibold text-slate-900 mb-2">{label}</h4>
      <ProgressBar value={current} max={limit as number} />
    </div>
  );
}
