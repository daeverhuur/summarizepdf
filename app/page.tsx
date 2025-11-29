'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { PricingCard } from '@/components/pricing/PricingCard';
import { PricingToggle } from '@/components/pricing/PricingToggle';
import { PLANS } from '@/lib/stripe/plans';
import { BillingInterval } from '@/lib/stripe/config';
import { TryUploadModal } from '@/components/home/TryUploadModal';
import ParticleBackground from '@/components/home/ParticleBackground';

// Custom icons matching brand guidelines
const ZapIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M17.33 4L6 18h8v10l11.33-14H17.33V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M28 15a11 11 0 01-11 11h-3l-6 4v-4a11 11 0 1120-11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="11" cy="15" r="1.5" fill="currentColor"/>
    <circle cx="17" cy="15" r="1.5" fill="currentColor"/>
    <circle cx="23" cy="15" r="1.5" fill="currentColor"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M4 22v4a2 2 0 002 2h20a2 2 0 002-2v-4M8 12l8-8m0 0l8 8m-8-8v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LibraryIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="6" width="8" height="20" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="13" y="4" width="7" height="22" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 8l6 2v16l-6-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#009de0" : "none"}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          stroke="#009de0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block">
    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 10l3 3 7-7" stroke="#009de0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Small icons for demo card
const ZapIconSmall = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h8v8l10-12h-8V2z" fill="white"/>
  </svg>
);

const ChatIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M21 12a9 9 0 01-9 9h-2.5l-4.5 3v-3A9 9 0 1121 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExportIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M4 16v4a2 2 0 002 2h12a2 2 0 002-2v-4M7 10l5-5m0 0l5 5m-5-5v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 3D PDF Document Component
function FloatingPDF({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        y: [50, 0, -20, -50],
        rotateY: [0, 10, -10, 0],
        rotateX: [-5, 5, -5, 5],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      <div className="w-16 h-20 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg transform perspective-500">
        <div className="h-3 bg-[#009de0]/30 rounded-t-lg" />
        <div className="p-2 space-y-1">
          <div className="h-1 bg-white/20 rounded" />
          <div className="h-1 bg-white/10 rounded w-4/5" />
          <div className="h-1 bg-white/10 rounded w-3/5" />
        </div>
      </div>
    </motion.div>
  );
}

// Animated Counter with Count-up Effect
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      // Parse the numeric value from the string (e.g., "10K" -> 10, "99.9" -> 99.9)
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  const displayValue = value.includes('K') 
    ? `${Math.floor(count)}K` 
    : value.includes('.') 
    ? count.toFixed(1) 
    : Math.floor(count);
  
  return (
    <span ref={ref} className="tabular-nums">
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {isInView ? displayValue : '0'}{suffix}
      </motion.span>
    </span>
  );
}

// Magnetic Button Component
function MagneticButton({ children, className = '', href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <Link href={href}>
          <Button variant="glow" size="xl" className={`group ${className}`}>
            {children}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

// Section wrapper with scroll animation
function AnimatedSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function HomePage() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isTryModalOpen, setIsTryModalOpen] = useState(false);
  const [isDraggingOnHero, setIsDraggingOnHero] = useState(false);
  
  const heroRef = useRef(null);
  
  // Handle drag events on the hero demo card
  const handleHeroDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOnHero(true);
  }, []);

  const handleHeroDragLeave = useCallback(() => {
    setIsDraggingOnHero(false);
  }, []);

  const handleHeroDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOnHero(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      // Store file temporarily and open modal
      setIsTryModalOpen(true);
    }
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  const features = [
    {
      icon: ZapIcon,
      title: 'AI Summarization',
      description: 'Get instant bullet points, paragraphs, or detailed summaries powered by GPT-4',
      gradient: 'from-[#009de0] to-[#00d4ff]',
    },
    {
      icon: ChatIcon,
      title: 'Chat with PDFs',
      description: 'Ask questions and get intelligent answers directly from your documents',
      gradient: 'from-[#7c3aed] to-[#a855f7]',
    },
    {
      icon: ExportIcon,
      title: 'Export Anywhere',
      description: 'Download summaries as PDF, Markdown, Word, or share with your team',
      gradient: 'from-[#059669] to-[#10b981]',
    },
    {
      icon: LibraryIcon,
      title: 'Document Library',
      description: 'Organize, search, and access all your summaries in one secure place',
      gradient: 'from-[#ea580c] to-[#f97316]',
    },
  ];

  const stats = [
    { value: '10K', suffix: '+', label: 'Active Users' },
    { value: '500K', suffix: '+', label: 'PDFs Summarized' },
    { value: '99.9', suffix: '%', label: 'Uptime' },
    { value: '4.9', suffix: '/5', label: 'User Rating' },
  ];

  return (
    <div className="relative">

      {/* Hero Section - Optimized for Conversion & SEO */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-[#050508]"
      >
        {/* 3D Particle Background */}
        <div className="absolute inset-0 opacity-40">
          <ParticleBackground />
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Primary gradient orb - more subtle with animation */}
          <motion.div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#009de0]/15 rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7c3aed]/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-20" />
          
          {/* Floating PDFs - repositioned */}
          <FloatingPDF delay={0} className="top-1/4 left-[5%] hidden lg:block" />
          <FloatingPDF delay={2} className="top-1/3 right-[8%] hidden lg:block" />
          <FloatingPDF delay={3} className="bottom-1/3 left-[12%] hidden xl:block" />
        </div>

        <motion.div 
          className="container-custom relative z-10 pt-20 pb-8"
          style={{ y: springY, opacity, scale }}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6 cursor-default"
              >
                <div className="flex -space-x-1.5">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#009de0] to-[#7c3aed] border-2 border-[#050508] flex items-center justify-center text-[8px] font-bold text-white"
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                    >
                      {['S', 'M', 'E', 'J'][i]}
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-white/60">Trusted by <span className="text-white font-semibold">10,000+</span> professionals</span>
              </motion.div>

              {/* H1 - SEO Optimized */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-5 leading-[1.1] tracking-tight"
              >
                <span className="block">AI PDF Summarizer</span>
                <span className="text-gradient text-glow">Instant Insights</span>
              </motion.h1>

              {/* Subheadline - Value Proposition */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Upload any PDF and get <span className="text-white font-medium">AI-powered summaries in seconds</span>.
                Extract key insights, chat with documents, and save hours of reading time.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6"
              >
                <MagneticButton href="/sign-up" className="w-full sm:w-auto">
                  <span className="relative z-10">Start Free — No Card Required</span>
                  <motion.span
                    className="inline-block ml-1 relative z-10"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRightIcon />
                  </motion.span>
                  {/* Animated shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                </MagneticButton>
                <Link
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                >
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto group">
                    See How It Works
                    <motion.span
                      className="inline-block ml-1"
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ↓
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>

              {/* Benefits Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2"
              >
                {['5 free PDFs daily', 'No credit card', '99.9% uptime'].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckIcon />
                    <span>{benefit}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Interactive Try Now Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
              onDragOver={handleHeroDragOver}
              onDragLeave={handleHeroDragLeave}
              onDrop={handleHeroDrop}
            >
              {/* Animated spotlight beam effect */}
              <motion.div
                className="absolute -top-40 left-1/2 -translate-x-1/2 w-[200px] h-[400px] bg-gradient-to-b from-[#009de0]/30 via-[#009de0]/10 to-transparent blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scaleY: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Glow effect behind card */}
              <div className={`absolute inset-0 bg-gradient-to-r from-[#009de0]/30 to-[#7c3aed]/30 blur-3xl rounded-3xl scale-90 transition-opacity duration-300 ${isDraggingOnHero ? 'opacity-60' : 'opacity-40'}`} />
              
              {/* Rotating gradient border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-50"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, #009de0, transparent)',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <div
                onClick={() => setIsTryModalOpen(true)}
                className={`relative bg-white/10 border rounded-2xl p-1 shadow-2xl backdrop-blur-sm cursor-pointer transition-all duration-300 group ${
                  isDraggingOnHero
                    ? 'border-[#009de0] scale-[1.02]'
                    : 'border-white/20 hover:border-[#009de0]/50 hover:scale-[1.01]'
                }`}
              >
                <div className="bg-white/5 rounded-xl overflow-hidden">
                  {/* Mini browser header */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white/5 rounded-md px-3 py-1 text-[10px] text-white/40 font-mono">
                        summarizepdf.com
                      </div>
                    </div>
                  </div>

                  {/* Interactive Upload Zone */}
                  <div className="p-5">
                    {/* Drop Zone */}
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all mb-4 ${
                      isDraggingOnHero
                        ? 'border-[#009de0] bg-[#009de0]/10'
                        : 'border-white/20 group-hover:border-[#009de0]/50 bg-white/5'
                    }`}>
                      <div className="w-12 h-12 rounded-xl bg-[#009de0]/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009de0" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-white font-medium text-sm mb-1">
                        {isDraggingOnHero ? 'Drop your PDF here!' : 'Try it now — Drop PDF here'}
                      </p>
                      <p className="text-white/50 text-xs">or click to upload</p>
                    </div>

                    {/* What you'll get preview */}
                    <div className="space-y-2">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">What you&apos;ll get:</p>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#009de0]/20 flex items-center justify-center shrink-0">
                          <ZapIconSmall />
                        </div>
                        <span>Instant AI summary</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#009de0]/20 flex items-center justify-center shrink-0">
                          <ChatIconSmall />
                        </div>
                        <span>Chat with your document</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#009de0]/20 flex items-center justify-center shrink-0">
                          <ExportIconSmall />
                        </div>
                        <span>Export to any format</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full mt-4 py-3 bg-[#009de0] hover:bg-[#009de0]/90 rounded-lg text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                      <span>Upload Your First PDF</span>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating stats badge with animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white/10 border border-white/20 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm"
              >
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StarIcon filled />
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-white text-sm font-semibold">4.9/5</div>
                  <div className="text-white/40 text-xs">from 2,400+ reviews</div>
                </motion.div>
              </motion.div>
              
              {/* Floating action hint */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1, 1, 0.8],
                  y: [10, 0, 0, -10],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
                className="absolute -top-8 right-1/4 bg-[#009de0] text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg"
              >
                <span className="flex items-center gap-1">
                  👆 Try it now!
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator with enhanced animation */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.2 }}
          onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5 relative overflow-hidden"
            whileHover={{ borderColor: 'rgba(0, 157, 224, 0.5)' }}
          >
            <motion.div
              className="w-1 h-2 bg-white/50 rounded-full"
              animate={{
                y: [0, 12],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[#009de0]/20 blur-md"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <motion.p
            className="text-white/50 text-xs mt-2 text-center"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Scroll
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <AnimatedSection className="py-16 md:py-24 relative overflow-hidden bg-[#050508]">
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#009de0]/5 to-transparent"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
        
        {/* Animated grid lines */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#009de0 1px, transparent 1px), linear-gradient(90deg, #009de0 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                className="text-center group cursor-default"
              >
                <motion.div
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 group-hover:text-gradient transition-all"
                  whileHover={{
                    textShadow: '0 0 20px rgba(0, 157, 224, 0.5)',
                  }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                <div className="text-white/50 font-medium group-hover:text-white/70 transition-colors">{stat.label}</div>
                
                {/* Animated underline on hover */}
                <motion.div
                  className="h-0.5 bg-[#009de0] mt-2 mx-auto"
                  initial={{ width: 0 }}
                  whileHover={{ width: '60%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Transition gradient from dark to light */}
      <div className="h-32 bg-gradient-to-b from-[#050508] to-white" />

      {/* Features Section */}
      <AnimatedSection id="features" className="py-16 md:py-24 relative scroll-mt-24">
        <div className="container-custom">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-[#009de0] font-semibold text-sm uppercase tracking-wider mb-4"
            >
              Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6"
            >
              Everything you need to
              <br />
              <span className="text-gradient">work smarter</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 max-w-2xl mx-auto"
            >
              Powerful AI features to transform how you work with documents
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 } 
                }}
                className="group"
              >
                <div className="glass-card h-full p-8 relative overflow-hidden">
                  {/* Gradient background on hover */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10`}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Animated border glow on hover */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100`}
                    style={{
                      background: `linear-gradient(135deg, transparent 0%, ${feature.gradient.includes('009de0') ? '#009de0' : feature.gradient.includes('7c3aed') ? '#7c3aed' : feature.gradient.includes('059669') ? '#059669' : '#ea580c'}20 50%, transparent 100%)`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-5 relative z-10`}
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                  >
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-slate-900 group-hover:bg-slate-50 transition-colors">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <feature.icon />
                      </motion.div>
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#009de0] transition-colors relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors relative z-10">
                    {feature.description}
                  </p>
                  
                  {/* Animated corner accent */}
                  <motion.div
                    className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-30`}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection id="how-it-works" className="py-16 md:py-24 relative scroll-mt-20">
        <div className="absolute inset-0 dots-pattern opacity-20" />
        <div className="container-custom relative">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-[#009de0] font-semibold text-sm uppercase tracking-wider mb-4"
            >
              How It Works
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6"
            >
              Three simple steps
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Drag and drop your PDF or click to upload any document', icon: '📤' },
              { step: '02', title: 'Process', desc: 'Our AI analyzes and extracts key insights in seconds', icon: '⚡' },
              { step: '03', title: 'Review', desc: 'Get your summary, ask questions, and export anywhere', icon: '✓' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : i === 2 ? 30 : 0, y: i === 1 ? 30 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 } 
                }}
                className="relative group cursor-pointer"
              >
                <div className="glass-card p-8 text-center relative overflow-hidden">
                  {/* Animated background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#009de0]/10 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.div
                    className="text-7xl font-black text-slate-200 absolute top-4 right-4"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  >
                    {item.step}
                  </motion.div>

                  <div className="relative z-10">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#009de0]/20 text-[#009de0] font-bold text-2xl mb-6 group-hover:bg-[#009de0]/30 transition-colors"
                      whileHover={{
                        rotate: [0, -5, 5, -5, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#009de0] transition-colors">{item.title}</h3>
                    <p className="text-slate-500 group-hover:text-slate-700 transition-colors">{item.desc}</p>
                  </div>
                  
                  {/* Animated bottom accent */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#009de0] to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {/* Connector line with animation */}
                {i < 2 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#009de0]/50 to-transparent"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Social Proof Section */}
      <AnimatedSection className="py-16 md:py-24 relative">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-1 mb-6"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <StarIcon filled />
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Trusted by 10,000+ users worldwide
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 text-lg"
            >
              From students to Fortune 500 companies, professionals trust SummarizePDF to save hours every week
            </motion.p>
          </div>

          {/* Testimonial cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah K.', role: 'PhD Researcher', quote: 'This tool has transformed how I review literature. What used to take hours now takes minutes.', avatar: 'S' },
              { name: 'Michael R.', role: 'Legal Analyst', quote: 'Essential for reviewing contracts and legal documents. The accuracy is impressive.', avatar: 'M' },
              { name: 'Emily T.', role: 'Product Manager', quote: 'Perfect for staying on top of industry reports. The chat feature is a game-changer.', avatar: 'E' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                className="glass-card p-6 relative overflow-hidden group cursor-pointer"
              >
                {/* Subtle gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#009de0]/5 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.5 }}
                />
                
                <div className="flex gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    >
                      <StarIcon filled />
                    </motion.div>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic relative z-10 group-hover:text-slate-900 transition-colors">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#009de0] to-[#7c3aed] flex items-center justify-center text-white font-bold"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-[#009de0] transition-colors">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                
                {/* Quote decoration */}
                <motion.div
                  className="absolute top-4 right-4 text-6xl text-[#009de0]/10 font-serif"
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  &ldquo;
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection id="pricing" className="py-16 md:py-24 relative scroll-mt-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-[#009de0] font-semibold text-sm uppercase tracking-wider mb-4"
            >
              Pricing
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6"
            >
              Choose your plan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 max-w-2xl mx-auto"
            >
              Start free and scale as you grow. All plans include our core AI features.
            </motion.p>
          </div>

          <PricingToggle billingInterval={billingInterval} onChange={setBillingInterval} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {(['free', 'starter', 'pro', 'team'] as const).map((tier, i) => (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PricingCard tier={tier} billingInterval={billingInterval} />
              </motion.div>
            ))}
          </div>

          {/* Plan Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 max-w-6xl mx-auto"
          >
            <motion.div
              className="glass-card p-6 text-center hover:border-[#009de0]/50 transition-all duration-300 cursor-pointer pointer-events-auto"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsComparisonOpen(!isComparisonOpen)}
            >
              <div className="flex items-center justify-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900">Compare All Features</h3>
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#009de0]"
                  animate={{ rotate: isComparisonOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </div>
              <p className="text-slate-400 text-sm mt-1">Detailed side-by-side comparison</p>
            </motion.div>

            <AnimatePresence>
              {isComparisonOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.04, 0.62, 0.23, 0.98]
                  }}
                  className="overflow-hidden"
                >
                  <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                <div className="glass-card p-6 overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                          Feature
                        </th>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier, i) => (
                          <motion.th
                            key={tier}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            className={`py-3 px-3 text-center ${
                              PLANS[tier].popular
                                ? 'text-[#009de0] font-bold'
                                : 'text-slate-900 font-semibold'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-base">{PLANS[tier].name}</span>
                              {PLANS[tier].popular && (
                                <span className="text-xs bg-[#009de0]/20 text-[#009de0] px-2 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                          </motion.th>
                        ))}
                      </tr>
                    </thead>
                    <motion.tbody
                      className="divide-y divide-slate-100"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.03
                          }
                        }
                      }}
                    >
                      {/* Pricing */}
                      <motion.tr
                        className="hover:bg-slate-50 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-slate-700 font-medium text-sm">Monthly Price</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            <span className="text-slate-900 font-bold text-base">
                              ${PLANS[tier].price.monthly}
                            </span>
                            <span className="text-slate-400 text-xs">/mo</span>
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr
                        className="hover:bg-slate-50 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-slate-700 font-medium text-sm">Yearly Price</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            <span className="text-slate-900 font-bold text-base">
                              ${PLANS[tier].price.yearly}
                            </span>
                            <span className="text-slate-400 text-xs">/yr</span>
                          </td>
                        ))}
                      </motion.tr>

                      {/* Core Features */}
                      <motion.tr
                        className="bg-slate-50"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td colSpan={5} className="py-2 px-3 text-[#009de0] font-bold text-xs uppercase tracking-wider">
                          Core Features
                        </td>
                      </motion.tr>
                      {[
                        { label: 'PDFs per Day', key: 'pdfsPerDay' as const },
                        { label: 'Max Pages per PDF', key: 'maxPagesPerPdf' as const },
                        { label: 'Chat Questions per Doc', key: 'chatQuestionsPerDoc' as const },
                        { label: 'Document Library Size', key: 'documentLibrarySize' as const },
                      ].map((feature) => (
                        <motion.tr
                          key={feature.key}
                          className="hover:bg-slate-50 transition-colors"
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                        >
                          <td className="py-3 px-3 text-slate-700 font-medium text-sm">{feature.label}</td>
                          {(['free', 'starter', 'pro', 'team'] as const).map((tier) => {
                            const value = PLANS[tier].features[feature.key];
                            return (
                              <td key={tier} className="py-3 px-3 text-center text-slate-700 text-sm">
                                {value === 'unlimited' ? (
                                  <span className="text-[#00d4ff] font-semibold">Unlimited</span>
                                ) : value > 999999 ? (
                                  <span className="text-[#00d4ff] font-semibold">Unlimited</span>
                                ) : feature.key === 'documentLibrarySize' ? (
                                  `${value} docs`
                                ) : (
                                  value
                                )}
                              </td>
                            );
                          })}
                        </motion.tr>
                      ))}

                      {/* Advanced Features */}
                      <motion.tr
                        className="bg-slate-50"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td colSpan={5} className="py-2 px-3 text-[#009de0] font-bold text-xs uppercase tracking-wider">
                          Advanced Features
                        </td>
                      </motion.tr>
                      <motion.tr
                        className="hover:bg-slate-50 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-slate-700 font-medium text-sm">Batch Upload</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.batchUpload ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <svg className="w-4 h-4 text-[#009de0]" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {PLANS[tier].features.batchUploadLimit && (
                                  <span className="text-[10px] text-slate-400">
                                    {PLANS[tier].features.batchUploadLimit} files
                                  </span>
                                )}
                              </div>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr
                        className="hover:bg-slate-50 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-slate-700 font-medium text-sm">Export Formats</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.exportFormats ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <svg className="w-4 h-4 text-[#009de0]" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-[10px] text-slate-400">PDF, MD, DOCX</span>
                              </div>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">API Access</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.apiAccess ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <svg className="w-4 h-4 text-[#009de0]" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {PLANS[tier].features.apiCallsPerMonth && (
                                  <span className="text-[10px] text-slate-400">
                                    {PLANS[tier].features.apiCallsPerMonth.toLocaleString()} calls
                                  </span>
                                )}
                              </div>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">Priority Processing</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.priorityProcessing ? (
                              <svg className="w-4 h-4 text-[#009de0] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>

                      {/* Team & Enterprise Features */}
                      <motion.tr 
                        className="bg-white/5"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td colSpan={5} className="py-2 px-3 text-[#009de0] font-bold text-xs uppercase tracking-wider">
                          Team & Enterprise
                        </td>
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">Team Seats</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center text-white/70 text-sm">
                            {PLANS[tier].features.teamSeats ? (
                              <span className="text-[#009de0] font-semibold">
                                {PLANS[tier].features.teamSeats}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">Shared Library</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.sharedLibrary ? (
                              <svg className="w-4 h-4 text-[#009de0] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">Admin Dashboard</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.adminDashboard ? (
                              <svg className="w-4 h-4 text-[#009de0] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">SSO Integration</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.ssoIntegration ? (
                              <svg className="w-4 h-4 text-[#009de0] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">Custom Branding</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            {PLANS[tier].features.customBranding ? (
                              <svg className="w-4 h-4 text-[#009de0] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </td>
                        ))}
                      </motion.tr>

                      {/* Support */}
                      <motion.tr 
                        className="bg-white/5"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td colSpan={5} className="py-2 px-3 text-[#009de0] font-bold text-xs uppercase tracking-wider">
                          Support
                        </td>
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-white/5 transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <td className="py-3 px-3 text-white/80 font-medium text-sm">Support Level</td>
                        {(['free', 'starter', 'pro', 'team'] as const).map((tier) => (
                          <td key={tier} className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                PLANS[tier].features.support === 'dedicated'
                                  ? 'bg-[#009de0]/20 text-[#009de0]'
                                  : PLANS[tier].features.support === 'priority'
                                  ? 'bg-[#7c3aed]/20 text-[#a855f7]'
                                  : 'bg-white/10 text-white/60'
                              }`}
                            >
                              {PLANS[tier].features.support === 'dedicated'
                                ? 'Dedicated'
                                : PLANS[tier].features.support === 'priority'
                                ? 'Priority'
                                : 'Email'}
                            </span>
                          </td>
                        ))}
                      </motion.tr>
                    </motion.tbody>
                  </table>
                </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Can I cancel anytime?</h4>
                <p className="text-slate-600">Yes! All plans can be cancelled at any time. No long-term commitments required.</p>
              </div>
              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-slate-600">We accept all major credit cards, debit cards, and support payment through Stripe.</p>
              </div>
              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Do you offer refunds?</h4>
                <p className="text-slate-600">Yes, we offer a 30-day money-back guarantee if you&apos;re not satisfied with our service.</p>
              </div>
              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Can I upgrade or downgrade my plan?</h4>
                <p className="text-slate-600">Absolutely! You can upgrade or downgrade your plan at any time from your account settings.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-16 md:py-24 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#009de0]/20 via-[#7c3aed]/20 to-[#009de0]/20" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#009de0]/20 rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#7c3aed]/15 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 bg-slate-100 backdrop-blur-md border border-slate-200 rounded-full px-6 py-3 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#009de0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#009de0]"></span>
              </span>
              <span className="text-sm font-medium text-slate-700">Join 10,000+ professionals</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight"
            >
              Transform how you
              <br />
              <span className="text-gradient text-glow">work with documents</span>
            </motion.h2>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-3 max-w-3xl mx-auto leading-relaxed"
            >
              Save hours every week with AI-powered summarization
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="text-base sm:text-lg text-slate-500 mb-10 max-w-2xl mx-auto"
            >
              No credit card required • 5 free PDFs per day • Cancel anytime
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <MagneticButton href="/sign-up" className="w-full sm:w-auto">
                <span className="relative z-10">Start Free Trial</span>
                <motion.span
                  className="inline-block relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRightIcon />
                </motion.span>
                {/* Animated shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              </MagneticButton>
              <Link href="/pricing">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                  View Pricing Plans
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#009de0]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#009de0]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>99.9% uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#009de0]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>24/7 support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
      {/* Try Upload Modal */}
      <TryUploadModal isOpen={isTryModalOpen} onClose={() => setIsTryModalOpen(false)} />
    </div>
  );
}
