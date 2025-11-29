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
}

export function Card({ 
  hover = false, 
  variant = 'default',
  className = '', 
  children, 
  ...props 
}: CardProps) {
  const Component = hover ? motion.div : 'div';
  
  const variants = {
    default: 'bg-white border-slate-200',
    glass: 'bg-white/80 backdrop-blur-xl border-slate-200',
    glow: 'bg-white border-[#009de0]/30 shadow-[0_0_20px_rgba(0,157,224,0.1)]',
  };

  const motionProps = hover ? {
    whileHover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05), 0 0 30px rgba(0, 157, 224, 0.15)',
      borderColor: 'rgba(0, 157, 224, 0.4)',
    },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  } : {};

  return (
    <Component
      className={`rounded-2xl border transition-colors p-6 ${variants[variant]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
