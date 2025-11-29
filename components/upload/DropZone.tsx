'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
        isDragging
          ? 'border-[#009de0] bg-gradient-to-br from-[#009de0]/10 via-[#00d4ff]/10 to-purple-500/10 shadow-[0_0_30px_rgba(0,157,224,0.3)]'
          : 'border-slate-300 bg-slate-50 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#009de0]/50 hover:shadow-lg'}`}
    >
      {/* Animated border effect when dragging */}
      {isDragging && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-[#00d4ff]"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center gap-4"
          >
            <FileText className="w-12 h-12 text-[#009de0]" />
            <div className="text-left">
              <p className="font-semibold text-slate-900">{selectedFile.name}</p>
              <p className="text-sm text-slate-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="ml-4 p-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Upload className="w-20 h-20 text-slate-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Drop your PDF here or click to browse
            </h3>
            <p className="text-sm text-slate-500 mb-4">Support for PDFs up to 500 pages</p>

            {/* File type badges */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="px-3 py-1 bg-[#009de0]/10 text-[#009de0] text-xs font-semibold rounded-full border border-[#009de0]/20">
                PDF
              </span>
              <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-medium rounded-full">
                Max 50MB
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
