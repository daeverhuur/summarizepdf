'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type CardBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'
>;

interface CardProps extends CardBaseProps {
  hover?: boolean;
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
