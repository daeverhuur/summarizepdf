'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

type ButtonBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'
>;

interface ButtonProps extends ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow' | 'white' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => {
    const baseStyles = `
      font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-3
      relative overflow-hidden cursor-pointer select-none
      focus-visible:ring-2 focus-visible:ring-[#009de0] focus-visible:ring-offset-2 focus-visible:outline-none
    `;

    const variants = {
      primary: `
        bg-[#009de0] text-white
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
        before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
        hover:shadow-[0_10px_40px_rgba(0,157,224,0.4)] hover:scale-[1.02]
        active:scale-[0.98]
      `,
      secondary: `
        bg-slate-100 text-slate-900 border border-slate-200
        backdrop-blur-sm
        hover:bg-slate-200 hover:border-slate-300
        active:scale-[0.98]
      `,
      outline: `
        border-2 border-[#009de0]/50 text-[#009de0]
        hover:bg-[#009de0]/10 hover:border-[#009de0]
        active:scale-[0.98]
      `,
      ghost: `
        text-slate-700
        hover:bg-slate-100 hover:text-slate-900
        active:scale-[0.98]
      `,
      glow: `
        bg-[#009de0] text-white
        shadow-[0_0_20px_rgba(0,157,224,0.5),inset_0_0_20px_rgba(0,157,224,0.1)]
        hover:shadow-[0_0_40px_rgba(0,157,224,0.6),inset_0_0_30px_rgba(0,157,224,0.15)] hover:scale-[1.02]
        animate-[glow-pulse_3s_ease-in-out_infinite]
        active:scale-[0.98]
      `,
      white: `
        bg-white text-slate-900 border border-slate-200
        hover:bg-slate-50
        active:scale-[0.98]
      `,
      icon: `
        bg-transparent text-slate-700
        hover:bg-slate-100
        active:scale-[0.98]
        p-2
      `,
    };

    const sizes = {
      sm: 'px-5 py-2.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -2 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </>
        ) : children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
