'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { TryUploadModal } from './TryUploadModal';

// Custom brand icons
const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto">
    <path d="M8 32v8a4 4 0 004 4h24a4 4 0 004-4v-8M32 16L24 8m0 0L16 16m8-8v24" 
          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5l5.5 2v4c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7v-4L8 1.5z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8l1.5 1.5L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8.5 1L3 9h4.5l-.5 6L13 7H8.5L9 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M6 4h14l6 6v18a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 4v6h6M10 16h12M10 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Floating 3D Document Component
function Floating3DDocument({ delay, position, size, rotation }: { 
  delay: number; 
  position: { x: string; y: string }; 
  size: number;
  rotation: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, y: 20, rotateX: 45, rotateY: rotation }}
      animate={{ 
        opacity: [0, 0.6, 0.6, 0],
        y: [20, -30, -80, -120],
        rotateX: [45, 35, 25, 15],
        rotateY: [rotation, rotation + 10, rotation + 20, rotation + 30],
        scale: [0.8, 1, 1, 0.9]
      }}
      transition={{ 
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div 
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl"
        style={{ 
          width: size, 
          height: size * 1.3,
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="h-3 bg-gradient-to-r from-[#009de0]/40 to-[#00d4ff]/40 rounded-t-lg" />
        <div className="p-2 space-y-1.5">
          <div className="h-1.5 bg-white/20 rounded w-3/4" />
          <div className="h-1.5 bg-white/15 rounded w-5/6" />
          <div className="h-1.5 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    </motion.div>
  );
}

// Animated Particles
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#009de0] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// 3D Upload Zone
function UploadZone3D({ onFileSelect, isProcessing }: { 
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect behind */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: isDragging 
            ? 'radial-gradient(circle at 50% 50%, rgba(0, 157, 224, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(0, 157, 224, 0.2) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative"
      >
        {/* Main upload card */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging ? 'rgba(0, 212, 255, 0.8)' : 'rgba(255, 255, 255, 0.15)',
          }}
          className={`
            relative overflow-hidden rounded-3xl p-8 md:p-10
            bg-gradient-to-br from-white/10 via-white/5 to-transparent
            backdrop-blur-xl border-2 border-white/15
            shadow-[0_30px_100px_-20px_rgba(0,157,224,0.3)]
            transition-all duration-300
            ${isDragging ? 'shadow-[0_30px_100px_-20px_rgba(0,157,224,0.6)]' : ''}
          `}
        >
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#009de0]/5 via-transparent to-[#7c3aed]/5 rounded-3xl" />

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            id="document-upload-input"
            aria-label="Upload PDF document"
          />

          <div className="relative z-10 text-center">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-8"
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-[#009de0]/30 border-t-[#00d4ff]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-xl font-semibold text-white mb-2">Analyzing your document...</p>
                  <p className="text-white/60">Extracting key insights with AI</p>
                </motion.div>
              ) : selectedFile ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-4"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#009de0] to-[#00d4ff] rounded-2xl flex items-center justify-center text-white">
                    <FileTextIcon />
                  </div>
                  <p className="text-lg font-semibold text-white mb-1 truncate max-w-xs mx-auto">{selectedFile.name}</p>
                  <p className="text-white/60 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Upload icon with animation */}
                  <motion.div
                    className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-colors duration-300 ${
                      isDragging 
                        ? 'bg-gradient-to-br from-[#009de0] to-[#00d4ff] text-white' 
                        : 'bg-white/10 text-[#00d4ff]'
                    }`}
                    animate={isDragging ? {} : { y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <UploadIcon />
                  </motion.div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {isDragging ? 'Release to analyze' : 'Drop your PDF here'}
                  </h3>
                  
                  <p className="text-white/60 mb-6 text-lg">
                    or click to browse files
                  </p>

                  {/* Action button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#009de0] to-[#00d4ff] rounded-2xl font-semibold text-white shadow-[0_20px_50px_-15px_rgba(0,157,224,0.5)] hover:shadow-[0_25px_60px_-15px_rgba(0,157,224,0.6)] transition-shadow"
                  >
                    <span>Choose PDF</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block">
                      <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>

                  {/* File info badges */}
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <span className="px-4 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-full border border-white/10">
                      PDF only
                    </span>
                    <span className="px-4 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-full border border-white/10">
                      Up to 50MB
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#009de0]/20 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#7c3aed]/20 to-transparent rounded-tl-full" />
        </motion.div>

        {/* Floating shadow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gradient-to-r from-transparent via-[#009de0]/20 to-transparent blur-xl" />
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    void file;
    setIsProcessing(true);
    setIsModalOpen(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  }, []);

  return (
    <>
      <section
        id="hero"
        data-header-theme="dark"
        aria-label="Upload PDFs and get AI-powered insights"
        className="relative w-full min-h-screen max-h-screen overflow-hidden bg-gradient-to-b from-[#030508] via-[#050810] to-[#080c14]"
      >
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <motion.div
            className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#009de0]/15 rounded-full blur-[150px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#7c3aed]/15 rounded-full blur-[150px]"
            animate={{
              x: [0, -30, 0],
              y: [0, -50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d4ff]/5 rounded-full blur-[200px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Particle field */}
          <ParticleField />

          {/* Floating documents */}
          <Floating3DDocument delay={0} position={{ x: '10%', y: '20%' }} size={60} rotation={-15} />
          <Floating3DDocument delay={2} position={{ x: '85%', y: '15%' }} size={50} rotation={20} />
          <Floating3DDocument delay={4} position={{ x: '5%', y: '60%' }} size={45} rotation={-10} />
          <Floating3DDocument delay={3} position={{ x: '90%', y: '55%' }} size={55} rotation={15} />
          <Floating3DDocument delay={1} position={{ x: '15%', y: '75%' }} size={40} rotation={-20} />
          <Floating3DDocument delay={5} position={{ x: '80%', y: '75%' }} size={48} rotation={25} />
        </div>

        {/* Main content */}
        <div className="relative z-10 h-screen flex flex-col pt-24 md:pt-28">
          <div className="flex-1 flex items-center">
            <div className="container-custom w-full">
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
                {/* Left: Text content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center lg:text-left order-2 lg:order-1"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4ff]" />
                    </span>
                    <span className="text-sm text-white/80 font-medium">AI-Powered Document Analysis</span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
                  >
                    Read Less.
                    <br />
                    <span className="text-gradient">Know More.</span>
                  </motion.h1>

                  {/* Subheadline */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-xl text-white/60 mb-8 max-w-lg mx-auto lg:mx-0"
                  >
                    Drop any whitepaper, contract, or report. Get highlights, risks, and action items in seconds—powered by AI.
                  </motion.p>

                  {/* Trust badges */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8"
                  >
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-6 h-6 rounded-full bg-[#009de0]/20 flex items-center justify-center text-[#00d4ff]">
                        <CheckIcon />
                      </div>
                      <span>5 free PDFs daily</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-6 h-6 rounded-full bg-[#009de0]/20 flex items-center justify-center text-[#00d4ff]">
                        <ShieldIcon />
                      </div>
                      <span>SOC2-grade privacy</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-6 h-6 rounded-full bg-[#009de0]/20 flex items-center justify-center text-[#00d4ff]">
                        <ZapIcon />
                      </div>
                      <span>Results in seconds</span>
                    </div>
                  </motion.div>

                  {/* Mobile CTA - visible only on smaller screens */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:hidden"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const uploadInput = document.getElementById('document-upload-input') as HTMLInputElement;
                        uploadInput?.click();
                      }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#009de0] to-[#00d4ff] rounded-2xl font-semibold text-white shadow-[0_20px_50px_-15px_rgba(0,157,224,0.5)]"
                    >
                      Upload Your First PDF
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block ml-2">
                        <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </motion.div>

                </motion.div>

                {/* Right: Upload zone */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="order-1 lg:order-2"
                >
                  <UploadZone3D onFileSelect={handleFileSelect} isProcessing={isProcessing} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080c14] to-transparent pointer-events-none" />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center text-white/40 text-xs uppercase tracking-widest"
            >
              <span className="mb-2">Scroll</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#009de0]/50 to-transparent" />
      </section>

      <TryUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
