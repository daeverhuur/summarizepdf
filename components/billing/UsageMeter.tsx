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
      <div className="mb-8">
        <h4 className="font-semibold text-white mb-3">{label}</h4>
        <div className="flex items-center gap-2 text-white/60">
          <span className="text-2xl font-bold text-white">{current}</span>
          <span>{unit}</span>
          <span className="ml-auto text-[#00d4ff] font-semibold">Unlimited</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h4 className="font-semibold text-white mb-3">{label}</h4>
      <ProgressBar value={current} max={limit as number} />
    </div>
  );
}
