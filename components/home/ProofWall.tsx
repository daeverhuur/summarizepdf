'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, ReactNode } from 'react';

interface CompanyLogo {
  name: string;
  initials: string;
}

interface DocumentType {
  name: string;
  icon: string;
  avgTime: string;
}

interface Capability {
  title: string;
  description: string;
  icon: ReactNode;
}

const companyLogos: CompanyLogo[] = [
  { name: 'TechCorp', initials: 'TC' },
  { name: 'InnovateLabs', initials: 'IL' },
  { name: 'Morrison & Associates', initials: 'MA' },
  { name: 'MIT Labs', initials: 'ML' },
  { name: 'TechVenture Inc', initials: 'TV' },
  { name: 'InnovateCo', initials: 'IC' },
  { name: 'GlobalTech', initials: 'GT' },
  { name: 'NextGen Solutions', initials: 'NS' },
  { name: 'DataFirst', initials: 'DF' },
  { name: 'CloudWorks', initials: 'CW' },
  { name: 'SmartDocs', initials: 'SD' },
  { name: 'ProAnalytics', initials: 'PA' },
];

const documentTypes: DocumentType[] = [
  { name: 'Research Papers', icon: '📄', avgTime: '45 sec' },
  { name: 'Legal Contracts', icon: '⚖️', avgTime: '38 sec' },
  { name: 'Financial Reports', icon: '📊', avgTime: '52 sec' },
  { name: 'Technical Docs', icon: '⚙️', avgTime: '41 sec' },
  { name: 'Meeting Notes', icon: '📝', avgTime: '28 sec' },
];

// Speed Demo Component
function SpeedDemo() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analyzing 247 pages...',
    'Extracting key points...',
    'Generating summary...',
    'Complete!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 33) setCurrentStep(0);
    else if (progress < 66) setCurrentStep(1);
    else if (progress < 100) setCurrentStep(2);
    else setCurrentStep(3);
  }, [progress]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-8 md:p-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009de0] to-[#7c3aed] flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Processing Document</h3>
              <p className="text-sm text-slate-500">Annual_Report_2024.pdf</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#009de0]">~30s</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Avg. Time</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#009de0] to-[#7c3aed]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <motion.div
              animate={{ rotate: progress < 100 ? 360 : 0 }}
              transition={{ duration: 1, repeat: progress < 100 ? Infinity : 0, ease: "linear" }}
              className="w-4 h-4"
            >
              {progress < 100 ? (
                <svg className="w-4 h-4 text-[#009de0]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </motion.div>
            <span className="text-sm font-medium text-slate-700">{steps[currentStep]}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-slate-900">247</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Pages Processed</div>
          </div>
          <div className="text-center border-x border-slate-200">
            <div className="text-2xl md:text-3xl font-bold text-[#009de0]">12</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Key Insights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#7c3aed]">3</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Action Items</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Document Types Grid
function DocumentTypesGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto"
    >
      <h3 className="text-center text-lg font-semibold text-slate-700 mb-6">
        Supports All Document Types
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {documentTypes.map((doc, index) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="bg-white rounded-xl border-2 border-slate-200 p-4 text-center hover:border-[#009de0]/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-3xl mb-2">{doc.icon}</div>
            <div className="font-semibold text-slate-900 text-sm mb-1">{doc.name}</div>
            <div className="text-xs text-slate-500 font-medium">{doc.avgTime}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Capabilities Grid
function CapabilitiesGrid() {
  const capabilities: Capability[] = [
    {
      title: 'Multi-language Support',
      description: 'Summarize PDFs in 50+ languages',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M5 8L10 3M10 3L15 8M10 3V15M3 12L8 17M8 17L13 12M8 17L8 5M15 12L20 17M20 17L20 5M20 17L16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'Smart Extraction',
      description: 'Tables, charts, and data automatically parsed',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M9 17V7M9 17H3M9 17H15M9 7H3M9 7H15M15 17V7M15 17H21M15 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'Secure Processing',
      description: 'Your documents are never stored',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="grid md:grid-cols-3 gap-6">
        {capabilities.map((capability, index) => (
          <motion.div
            key={capability.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-[#009de0]/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#009de0]/10 to-[#7c3aed]/10 flex items-center justify-center mb-4 text-[#009de0]">
              {capability.icon}
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{capability.title}</h4>
            <p className="text-sm text-slate-600">{capability.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function ProofWall() {
  return (
    <section
      data-header-theme="light"
      aria-label="Product speed and capabilities demonstration"
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50"
    >
      {/* Simple Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#009de0]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-gradient-to-br from-[#009de0]/5 to-[#7c3aed]/10 rounded-full blur-3xl" />
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Lightning Fast.{' '}
            <span className="text-gradient">Incredibly Powerful.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Process hundreds of pages in seconds. Extract insights instantly.
          </p>
        </motion.div>

        {/* Trusted By - Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Trusted by Teams at Leading Companies
          </p>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

            <div className="flex overflow-hidden">
              <div className="flex animate-marquee hover:[animation-play-state:paused]">
                {companyLogos.map((company, index) => (
                  <div
                    key={`logo-1-${index}`}
                    className="flex-shrink-0 mx-4 md:mx-6 w-28 md:w-32 h-16 md:h-20 flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white hover:border-[#009de0]/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    title={company.name}
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-400 hover:text-[#009de0] transition-colors duration-300">
                      {company.initials}
                    </span>
                  </div>
                ))}
                {companyLogos.map((company, index) => (
                  <div
                    key={`logo-2-${index}`}
                    className="flex-shrink-0 mx-4 md:mx-6 w-28 md:w-32 h-16 md:h-20 flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white hover:border-[#009de0]/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    title={company.name}
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-400 hover:text-[#009de0] transition-colors duration-300">
                      {company.initials}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Speed Demo */}
        <div className="mb-20">
          <SpeedDemo />
        </div>

        {/* Document Types Grid */}
        <div className="mb-20">
          <DocumentTypesGrid />
        </div>

        {/* Capabilities Grid */}
        <div className="mb-16">
          <CapabilitiesGrid />
        </div>

        {/* Simple CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-[#009de0] to-[#0088c7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <span>See It in Action</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
