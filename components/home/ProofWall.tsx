'use client';

import { motion } from 'framer-motion';
import { FileText, Clock, TrendingUp } from 'lucide-react';

interface ProofCard {
  type: string;
  icon: React.ReactNode;
  pages: number;
  insights: number;
  timeSaved: string;
  category: string;
  gradient: string;
}

const proofCards: ProofCard[] = [
  {
    type: 'Legal Contract',
    icon: <FileText className="w-6 h-6" />,
    pages: 47,
    insights: 23,
    timeSaved: '2.5 hours',
    category: 'Legal',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    type: 'Research Paper',
    icon: <FileText className="w-6 h-6" />,
    pages: 28,
    insights: 15,
    timeSaved: '1.5 hours',
    category: 'Research',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    type: 'Financial Report',
    icon: <TrendingUp className="w-6 h-6" />,
    pages: 156,
    insights: 67,
    timeSaved: '5 hours',
    category: 'Finance',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    type: 'Technical Manual',
    icon: <FileText className="w-6 h-6" />,
    pages: 89,
    insights: 42,
    timeSaved: '3 hours',
    category: 'Technical',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    type: 'Academic Thesis',
    icon: <FileText className="w-6 h-6" />,
    pages: 234,
    insights: 98,
    timeSaved: '8 hours',
    category: 'Academic',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    type: 'Business Plan',
    icon: <FileText className="w-6 h-6" />,
    pages: 62,
    insights: 31,
    timeSaved: '2 hours',
    category: 'Business',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export function ProofWall() {
  return (
    <section data-header-theme="light" aria-label="Customer success stories" className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#009de0]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            See What Others{' '}
            <span className="text-gradient">Discovered</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real transformations from PDFs to insights across different industries
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {proofCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -12,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              {/* Card */}
              <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                    {card.category}
                  </span>
                </div>

                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>

                {/* Card Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {card.type}
                </h3>

                {/* Stats Grid */}
                <div className="space-y-3">
                  {/* Pages to Insights */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Transformation</span>
                    <span className="text-sm font-bold text-slate-900">
                      {card.pages} pages → {card.insights} insights
                    </span>
                  </div>

                  {/* Time Saved */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#009de0]/10 to-[#7c3aed]/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#009de0]" />
                      <span className="text-sm text-slate-600">Time Saved</span>
                    </div>
                    <span className="text-sm font-bold text-[#009de0]">
                      {card.timeSaved}
                    </span>
                  </div>
                </div>

                {/* Hover gradient effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 blur-xl`} />
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 text-lg">
            Join thousands of professionals transforming their workflow
          </p>
        </motion.div>
      </div>
    </section>
  );
}
