'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';

interface DocumentUploadStackProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DocumentUploadStack({ onFileSelect, disabled = false }: DocumentUploadStackProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <div className="hero-perspective relative w-full max-w-md mx-auto">
      {/* Input for file selection */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        id="document-upload-input"
        aria-label="Upload PDF document to analyze"
      />

      {/* 3D Document Stack */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => !disabled && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative"
        aria-label="PDF upload drop zone"
      >
        {/* Document 3 (Back) */}
        <motion.div
          className="document-3d absolute top-6 left-6 right-6 h-72 bg-white rounded-xl shadow-xl border border-slate-200"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: isDragging ? 8 : 14,
            rotateY: isDragging ? -8 : -20,
            translateZ: -30,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-xl" />
          <div className="p-6 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
        </motion.div>

        {/* Document 2 (Middle) */}
        <motion.div
          className="document-3d absolute top-3 left-3 right-3 h-72 bg-white rounded-xl shadow-xl border border-slate-200"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: isDragging ? 6 : 10,
            rotateY: isDragging ? 6 : 10,
            translateZ: -15,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-xl" />
          <div className="p-6 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-4/5" />
          </div>
        </motion.div>

        {/* Document 1 (Front - Active Drop Zone) */}
        <motion.div
          className={`document-3d relative h-72 bg-white rounded-xl shadow-2xl border-2 transition-all duration-300 cursor-pointer ${
            isDragging
              ? 'border-[#009de0] shadow-[0_0_40px_rgba(0,157,224,0.4)]'
              : isHovering
              ? 'border-[#009de0]/50 shadow-[0_0_20px_rgba(0,157,224,0.2)]'
              : 'border-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: isDragging ? 0 : isHovering ? 8 : 10,
            rotateY: isDragging ? 0 : isHovering ? -8 : -15,
            translateY: isDragging ? -10 : isHovering ? -20 : 0,
            translateZ: isHovering ? 15 : 0,
            scale: isHovering ? 1.05 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Document Header */}
          <div className={`h-12 bg-gradient-to-r rounded-t-xl transition-all duration-300 ${
            isDragging || isHovering
              ? 'from-[#009de0] to-[#00d4ff]'
              : 'from-slate-100 to-slate-200'
          }`} />

          {/* Document Content */}
          <div className="p-8 flex flex-col items-center justify-center h-[calc(100%-3rem)]">
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center w-full"
                >
                  <FileText className="w-16 h-16 text-[#009de0] mb-4" />
                  <p className="font-semibold text-slate-900 text-center mb-1 truncate max-w-full px-4">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={clearFile}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  {/* Upload Icon */}
                  <motion.div
                    animate={isHovering ? { y: [-4, 0, -4] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-4"
                  >
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto">
                      <path
                        d="M56 40v12a4 4 0 01-4 4H12a4 4 0 01-4-4V40M42 20L32 10m0 0L22 20m10-10v32"
                        stroke={isDragging || isHovering ? "#009de0" : "#94a3b8"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Drop PDF Here
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    or click to browse files
                  </p>

                  {/* Format badges */}
                  <div className="flex items-center justify-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                      isDragging || isHovering
                        ? 'bg-[#009de0] text-white'
                        : 'bg-[#009de0]/10 text-[#009de0] border border-[#009de0]/20'
                    }`}>
                      PDF
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      Up to 50MB
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Glow effect when dragging */}
          {isDragging && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 157, 224, 0.3)',
                  '0 0 40px rgba(0, 157, 224, 0.5)',
                  '0 0 20px rgba(0, 157, 224, 0.3)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>

      {/* Floating animation */}
      <style jsx>{`
        @keyframes document-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .document-3d {
          animation: document-float 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .document-3d {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
