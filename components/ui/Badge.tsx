'use client';

import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30',
    warning: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30',
    error: 'bg-red-500/10 text-red-600 border border-red-500/30',
    info: 'bg-[#009de0]/10 text-[#009de0] border border-[#009de0]/30',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
