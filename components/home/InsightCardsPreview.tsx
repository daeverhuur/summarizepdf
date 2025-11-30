'use client';

import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, FileText } from 'lucide-react';

interface InsightCardsPreviewProps {
  isProcessing?: boolean;
}

export function InsightCardsPreview({ isProcessing = false }: InsightCardsPreviewProps) {
  const cards = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Key Findings',
      description: 'Extract important insights automatically',
      color: 'from-[#009de0] to-[#00d4ff]',
      delay: 0,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Summary Preview',
      description: 'Get comprehensive summaries instantly',
      color: 'from-[#7c3aed] to-[#a855f7]',
      delay: 0.2,
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Chat Ready',
      description: 'Ask questions about your document',
      color: 'from-[#009de0] to-[#7c3aed]',
      delay: 0.4,
    },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto" aria-label="Preview of AI-generated insights">
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#009de0] rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <span className="text-slate-700 font-medium">Processing...</span>
            </div>
            <p className="text-sm text-slate-500">Analyzing your document</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, x: -30, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{
              duration: 0.8,
              delay: card.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              scale: 1.05,
              x: -10,
              transition: { duration: 0.3 },
            }}
            className="relative"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Glass-morphism card */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-xl overflow-hidden group">
              {/* Gradient accent on left */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${card.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

              {/* Content */}
              <div className="flex items-start gap-4 ml-2">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    {card.title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  duration: 2,
                  delay: card.delay + 1,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              />

              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5 blur-xl`} />
              </div>
            </div>

            {/* Floating animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Background glow orbs */}
      <div className="absolute top-1/4 -right-12 w-32 h-32 bg-[#009de0]/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-8 w-24 h-24 bg-[#7c3aed]/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />
    </div>
  );
}
