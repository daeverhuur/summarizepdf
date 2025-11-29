'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type CardBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'
>;

interface CardProps extends CardBaseProps {
  hover?: boolean;
  variant?: 'default' | 'glass' | 'glow';
  size?: 'compact' | 'default' | 'spacious';
}

export function Card({
  hover = false,
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const Component = hover ? motion.div : 'div';

  const variants = {
    default: 'bg-white border-slate-200 border-t-2 border-t-slate-100',
    glass: 'bg-white/80 backdrop-blur-xl border-slate-200',
    glow: 'bg-white border-[#009de0]/30 shadow-[0_0_20px_rgba(0,157,224,0.1)]',
  };

  const sizes = {
    compact: 'p-4',
    default: 'p-6',
    spacious: 'p-8',
  };

  const motionProps = hover ? {
    whileHover: {
      y: -8,
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08), 0 0 30px rgba(0, 157, 224, 0.15)',
      borderColor: 'rgba(0, 157, 224, 0.4)',
    },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as any }
  } : {};

  return (
    <Component
      className={`rounded-2xl border transition-colors will-change-transform ${variants[variant]} ${sizes[size]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
