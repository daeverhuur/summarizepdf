'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { DocumentUploadStack } from './DocumentUploadStack';
import { InsightCardsPreview } from './InsightCardsPreview';
import { TryUploadModal } from './TryUploadModal';
import { CheckCircle, Shield } from 'lucide-react';

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block">
    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block">
    <path d="M6.5 4.5l9 5.5-9 5.5V4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { scrollYProgress } = useScroll();
  const glowParallax = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const purpleParallax = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const cardParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const handleFileSelect = (file: File) => {
    void file;
    setIsProcessing(true);
    setIsModalOpen(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  const triggerUpload = () => {
    if (typeof document === 'undefined') return;
    const uploadInput = document.getElementById('document-upload-input') as HTMLInputElement | null;
    uploadInput?.click();
  };

  return (
    <>
      <section
        id="hero"
        aria-label="Transform your PDFs into insights"
        className="relative flex min-h-screen lg:max-h-screen w-full items-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24 pb-10 md:pt-32 text-white"
      >
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
                backgroundSize: '42px 42px',
              }}
            />
          </div>
          <motion.div
            aria-hidden="true"
            className="absolute top-10 right-16 w-96 h-96 bg-[#009de0]/25 rounded-full blur-3xl"
            style={{ y: glowParallax }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-6 left-24 w-80 h-80 bg-[#7c3aed]/25 rounded-full blur-3xl"
            style={{ y: purpleParallax }}
          />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full">
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 py-6 md:px-8 lg:py-8">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              {/* Copy + CTA column */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h1 className="text-4xl leading-tight md:text-6xl lg:text-[3.8rem] lg:leading-[1.05] font-semibold tracking-tight">
                    Read Less.<br className="hidden lg:block" />{' '}
                    <span className="text-gradient">Know More.</span>
                  </h1>
                  <p className="text-lg text-slate-300 md:text-xl max-w-xl">
                    Drop in any whitepaper, contract, or report. SummarizePDF surfaces the highlights,
                    risks, and action items before your coffee cools down.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.div
                    className="flex flex-col gap-3 sm:flex-row"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.15, duration: 0.7 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      onClick={triggerUpload}
                      className="group flex-1 rounded-2xl bg-[#009de0] px-8 py-4 text-lg font-semibold text-white shadow-[0_15px_40px_rgba(0,157,224,0.35)] transition hover:bg-[#00b5ff]"
                    >
                      Upload your first PDF
                      <motion.span
                        className="ml-2 inline-block"
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRightIcon />
                      </motion.span>
                    </motion.button>

                    <Button
                      variant="secondary"
                      size="xl"
                      className="flex-1 border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                      onClick={() => setIsModalOpen(true)}
                      aria-label="Watch product demo video"
                    >
                      <PlayIcon />
                      Watch 50s demo
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex flex-wrap items-center gap-3 text-sm text-slate-200"
                  >
                    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                      <CheckCircle className="h-4 w-4 text-[#00d4ff]" />
                      5 free PDFs / day
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                      <Shield className="h-4 w-4 text-[#00d4ff]" />
                      SOC2-grade privacy
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Product surface column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
                style={{ y: cardParallax }}
              >
                <div className="absolute -top-8 -right-6 hidden lg:block">
                  <div className="animate-pulse rounded-full bg-[#00d4ff]/20 px-4 py-2 text-xs font-semibold text-[#00d4ff] shadow-[0_0_40px_rgba(0,212,255,0.35)]">
                    New real-time insights
                  </div>
                </div>

                <div className="relative rounded-[32px] border border-white/15 bg-white/5 p-5 sm:p-6 lg:p-8 shadow-[0_30px_80px_rgba(5,8,20,0.4)] backdrop-blur-xl">
                  <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#009de0]/15 via-transparent to-[#7c3aed]/25 opacity-70 blur-3xl" />
                  <div className="relative flex flex-col gap-6 xl:flex-row xl:items-stretch">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-center justify-center xl:flex-1">
                      <div className="w-full max-w-sm">
                        <DocumentUploadStack onFileSelect={handleFileSelect} />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5 flex items-center justify-center xl:flex-1">
                      <div className="w-full max-w-sm">
                        <InsightCardsPreview isProcessing={isProcessing} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll progress accent */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 hidden md:block">
          <motion.div
            className="h-[3px] w-full origin-left bg-gradient-to-r from-[#00d4ff] via-[#7c3aed] to-transparent"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        {/* Scroll indicator for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 md:hidden"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center text-xs uppercase tracking-[0.2em] text-slate-400"
          >
            Scroll
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="mt-1">
              <path d="M10 5v10m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <TryUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
