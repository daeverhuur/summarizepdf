'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Custom icons
const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M42 30v8a4 4 0 01-4 4H10a4 4 0 01-4-4v-8M34 16L24 6m0 0L14 16m10-10v28" 
          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="#009de0"/>
    <path d="M6.5 10l2.5 2.5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L11.5 7.5L17 9L11.5 10.5L10 16L8.5 10.5L3 9L8.5 7.5L10 2Z" fill="#009de0"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block">
    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

interface TryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Stage = 'upload' | 'processing' | 'preview';

// Simulated insights based on common PDF types
const getSimulatedInsights = (fileName: string) => {
  const name = fileName.toLowerCase();
  
  if (name.includes('report') || name.includes('annual')) {
    return [
      'Key financial metrics identified across 12 sections',
      'Revenue and growth trends extracted from charts',
      'Executive summary highlights captured',
      '15+ actionable recommendations found',
    ];
  } else if (name.includes('contract') || name.includes('agreement')) {
    return [
      'Contract terms and conditions summarized',
      'Key obligations for all parties identified',
      'Important dates and deadlines extracted',
      'Risk clauses and liability terms highlighted',
    ];
  } else if (name.includes('research') || name.includes('paper') || name.includes('study')) {
    return [
      'Research methodology and findings summarized',
      'Key conclusions and recommendations extracted',
      'Statistical data and results highlighted',
      'Citations and references catalogued',
    ];
  } else {
    return [
      'Document structure and sections analyzed',
      'Key themes and topics identified',
      'Important points and highlights extracted',
      'Summary ready for your review',
    ];
  }
};

export function TryUploadModal({ isOpen, onClose }: TryUploadModalProps) {
  const [stage, setStage] = useState<Stage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    'Uploading document...',
    'Extracting text content...',
    'Analyzing document structure...',
    'Generating AI summary...',
    'Preparing insights...',
  ];

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStage('upload');
        setFile(null);
        setProgress(0);
        setCurrentStep(0);
      }, 300);
    }
  }, [isOpen]);

  // Simulate processing
  useEffect(() => {
    if (stage === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage('preview');
            return 100;
          }
          
          // Update step based on progress
          const newStep = Math.floor((prev / 100) * processingSteps.length);
          if (newStep !== currentStep && newStep < processingSteps.length) {
            setCurrentStep(newStep);
          }
          
          return prev + 2;
        });
      }, 80);

      return () => clearInterval(interval);
    }
  }, [stage, currentStep, processingSteps.length]);

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

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Store file info in localStorage for after signup
    localStorage.setItem('pendingUpload', JSON.stringify({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      timestamp: Date.now(),
    }));
    
    // Start processing simulation
    setStage('processing');
  };

  const insights = file ? getSimulatedInsights(file.name) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
          >
            <div className="h-full md:h-auto bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#009de0]/20 flex items-center justify-center">
                    <SparkleIcon />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    {stage === 'upload' && 'Try SummarizePDF'}
                    {stage === 'processing' && 'Processing Your PDF'}
                    {stage === 'preview' && 'Your Summary Preview'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* Upload Stage */}
                  {stage === 'upload' && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                          isDragging 
                            ? 'border-[#009de0] bg-[#009de0]/10' 
                            : 'border-white/20 hover:border-[#009de0]/50 bg-white/5'
                        }`}
                      >
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileInput}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="text-white/40 mb-4">
                          <UploadIcon />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Drop your PDF here
                        </h3>
                        <p className="text-white/60 mb-4">or click to browse</p>
                        <p className="text-sm text-white/40">
                          PDF files up to 50MB • No account required
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/50">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon />
                          <span>Free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon />
                          <span>Instant results</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon />
                          <span>Secure & private</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Processing Stage */}
                  {stage === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      {/* File Info */}
                      <div className="inline-flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 mb-8">
                        <div className="text-[#009de0]">
                          <FileIcon />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium text-sm truncate max-w-[200px]">
                            {file?.name}
                          </p>
                          <p className="text-white/50 text-xs">
                            {file && (file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-6">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#009de0] to-[#00d4ff]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-white/60 text-sm">
                          {processingSteps[currentStep]}
                        </p>
                      </div>

                      {/* Animated dots */}
                      <div className="flex items-center justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[#009de0] rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Preview Stage */}
                  {stage === 'preview' && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Success header */}
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.5 }}
                          className="w-16 h-16 bg-[#009de0]/20 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5L20 7" stroke="#009de0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Summary Ready!
                        </h3>
                        <p className="text-white/60 text-sm">
                          We&apos;ve analyzed <span className="text-white font-medium">{file?.name}</span>
                        </p>
                      </div>

                      {/* Preview insights */}
                      <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                          <SparkleIcon />
                          <span className="text-white font-medium">Key Insights Found</span>
                        </div>
                        <div className="space-y-3">
                          {insights.map((insight, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircleIcon />
                              <span className="text-white/70 text-sm">{insight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Locked content teaser */}
                      <div className="relative bg-gradient-to-b from-white/5 to-transparent rounded-xl p-5 mb-6 border border-white/10 overflow-hidden">
                        <div className="absolute inset-0 backdrop-blur-sm bg-[#0a0a0f]/60 flex items-center justify-center z-10">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 text-white/60">
                              <LockIcon />
                            </div>
                            <p className="text-white font-medium mb-1">Full Summary Locked</p>
                            <p className="text-white/50 text-sm">Create a free account to unlock</p>
                          </div>
                        </div>
                        <div className="space-y-2 blur-sm select-none">
                          <div className="h-3 bg-white/10 rounded w-full" />
                          <div className="h-3 bg-white/10 rounded w-5/6" />
                          <div className="h-3 bg-white/10 rounded w-4/5" />
                          <div className="h-3 bg-white/10 rounded w-full" />
                          <div className="h-3 bg-white/10 rounded w-3/4" />
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/sign-up" className="flex-1">
                          <Button variant="glow" size="lg" className="w-full group">
                            Create Free Account
                            <motion.span
                              className="inline-block ml-1"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRightIcon />
                            </motion.span>
                          </Button>
                        </Link>
                        <Link href="/pricing" className="flex-1">
                          <Button variant="secondary" size="lg" className="w-full">
                            View Plans
                          </Button>
                        </Link>
                      </div>

                      <p className="text-center text-white/40 text-xs mt-4">
                        No credit card required • 5 free PDFs per day
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

