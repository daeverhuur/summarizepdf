'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, ReactNode } from 'react';

interface Industry {
  name: string;
  icon: ReactNode;
  teamCount: string;
}

interface DocumentType {
  name: string;
  icon: ReactNode;
  avgTime: string;
  insights: string[];
}

interface RealResult {
  type: string;
  title: string;
  pages: number;
  time: string;
  findings: string[];
  color: string;
}

const industries: Industry[] = [
  {
    name: 'Legal',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 6V12C4 16.5 8 20 12 22C16 20 20 16.5 20 12V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    teamCount: '2,400+ teams'
  },
  {
    name: 'Finance',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    teamCount: '3,100+ teams'
  },
  {
    name: 'Healthcare',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    teamCount: '1,800+ teams'
  },
  {
    name: 'Technology',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    teamCount: '4,200+ teams'
  },
  {
    name: 'Academia',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 12V17C6 17 8 19 12 19C16 19 18 17 18 17V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    teamCount: '2,900+ teams'
  },
  {
    name: 'Consulting',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 8V6C7 5.46957 7.21071 4.96086 7.58579 4.58579C7.96086 4.21071 8.46957 4 9 4H15C15.5304 4 16.0391 4.21071 16.4142 4.58579C16.7893 4.96086 17 5.46957 17 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    teamCount: '1,600+ teams'
  },
  {
    name: 'Government',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M3 21H21M4 18H20M6 18V10M10 18V10M14 18V10M18 18V10M12 2L3 7H21L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    teamCount: '890+ teams'
  },
  {
    name: 'Real Estate',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    teamCount: '1,200+ teams'
  },
];

const documentTypes: DocumentType[] = [
  {
    name: 'Research Papers',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    avgTime: '45 sec',
    insights: ['Extract methodology & findings', 'Identify key citations', 'Summarize conclusions', 'Map data relationships']
  },
  {
    name: 'Legal Contracts',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18v-6l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    avgTime: '38 sec',
    insights: ['Highlight key obligations', 'Extract critical dates', 'Identify liability clauses', 'Summarize terms']
  },
  {
    name: 'Financial Reports',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    avgTime: '52 sec',
    insights: ['Extract key metrics', 'Identify revenue trends', 'Analyze financial health', 'Highlight risks']
  },
  {
    name: 'Technical Docs',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    avgTime: '41 sec',
    insights: ['Map system architecture', 'Extract specifications', 'Identify requirements', 'List dependencies']
  },
  {
    name: 'Meeting Notes',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    avgTime: '28 sec',
    insights: ['Extract action items', 'Identify decisions made', 'List attendees & topics', 'Track follow-ups']
  },
];

const realResults: RealResult[] = [
  {
    type: 'Financial Report',
    title: 'Q3 2024 Earnings Report',
    pages: 45,
    time: '30 sec',
    findings: [
      'Revenue up 23% YoY to $4.2B',
      'Operating margin improved to 18.3%',
      'New product line exceeded targets by 15%',
      'Guidance raised for Q4'
    ],
    color: '#009de0'
  },
  {
    type: 'Research Paper',
    title: 'Climate Impact Study 2024',
    pages: 127,
    time: '45 sec',
    findings: [
      'Global temperatures rose 1.2°C above pre-industrial levels',
      'Arctic ice decreased 13% compared to 2020',
      'Renewable adoption accelerated 40% in developing nations',
      'Recommended policy changes outlined'
    ],
    color: '#7c3aed'
  },
  {
    type: 'Legal Contract',
    title: 'Software License Agreement',
    pages: 32,
    time: '18 sec',
    findings: [
      'License term: 3 years with auto-renewal',
      'Liability cap: $500,000',
      '30-day termination notice required',
      'IP rights remain with licensor'
    ],
    color: '#059669'
  }
];

// Speed Demo Component
function SpeedDemo() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showMetricModal, setShowMetricModal] = useState<string | null>(null);

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

  const scrollToUpload = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

        {/* Metrics Grid - Now Clickable */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="text-center cursor-default">
            <div className="text-2xl md:text-3xl font-bold text-slate-900">247</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Pages Processed</div>
          </div>
          <div
            className="text-center border-x border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors duration-200 rounded-lg -mx-2 px-2 py-1"
            onClick={() => setShowMetricModal('insights')}
          >
            <div className="text-2xl md:text-3xl font-bold text-[#009de0]">12</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Key Insights</div>
          </div>
          <div
            className="text-center cursor-pointer hover:bg-slate-50 transition-colors duration-200 rounded-lg -mx-2 px-2 py-1"
            onClick={() => setShowMetricModal('actions')}
          >
            <div className="text-2xl md:text-3xl font-bold text-[#7c3aed]">3</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Action Items</div>
          </div>
        </div>
      </motion.div>

      {/* Metric Modal */}
      <AnimatePresence>
        {showMetricModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMetricModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                  showMetricModal === 'insights' ? 'from-[#009de0] to-[#0088c7]' : 'from-[#7c3aed] to-[#6d28d9]'
                } flex items-center justify-center`}>
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Want to see {showMetricModal === 'insights' ? 'these insights' : 'these action items'}?
                </h3>
                <p className="text-slate-600 mb-6">
                  Upload your own document and get instant AI-powered analysis
                </p>
              </div>

              <button
                onClick={() => {
                  setShowMetricModal(null);
                  scrollToUpload();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#009de0] to-[#0088c7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Upload Your Document Now
              </button>

              <button
                onClick={() => setShowMetricModal(null)}
                className="w-full mt-3 px-6 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors cursor-pointer"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Document Types Grid
function DocumentTypesGrid() {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-6xl mx-auto"
    >
      <h3 className="text-center text-2xl font-bold text-slate-900 mb-3">
        Supports All Document Types
      </h3>
      <p className="text-center text-slate-600 mb-8">
        Click any document type to see what insights we extract
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {documentTypes.map((doc, index) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            onClick={() => setSelectedDoc(selectedDoc === index ? null : index)}
            className={`bg-white rounded-xl border-2 p-5 text-center cursor-pointer transition-all duration-300 ${
              selectedDoc === index
                ? 'border-[#009de0] shadow-lg scale-105 bg-gradient-to-br from-[#009de0]/5 to-[#7c3aed]/5'
                : 'border-slate-200 hover:border-[#009de0]/50 hover:shadow-md'
            }`}
          >
            <div className={`mb-3 flex justify-center transition-colors duration-300 ${
              selectedDoc === index ? 'text-[#009de0]' : 'text-slate-600'
            }`}>
              {doc.icon}
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">{doc.name}</div>
            <div className="text-xs text-slate-500 font-medium">{doc.avgTime}</div>
          </motion.div>
        ))}
      </div>

      {/* Selected Document Insights */}
      {selectedDoc !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-xl border-2 border-[#009de0]/30 p-6 shadow-lg"
        >
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="text-[#009de0]">{documentTypes[selectedDoc].icon}</div>
            What we extract from {documentTypes[selectedDoc].name}
          </h4>
          <div className="grid md:grid-cols-2 gap-3 mb-5">
            {documentTypes[selectedDoc].insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#009de0] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm text-slate-700">{insight}</span>
              </div>
            ))}
          </div>

          {/* CTA for this document type */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full px-5 py-2.5 bg-gradient-to-r from-[#009de0] to-[#0088c7] text-white font-medium text-sm rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              Try it with your {documentTypes[selectedDoc].name.toLowerCase()}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Real Results Section
function RealResults() {
  const [showResultModal, setShowResultModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-6xl mx-auto"
      >
        <h3 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          See Real Results
        </h3>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          These are actual examples of insights extracted from different document types.
          See the value our AI delivers in seconds.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {realResults.map((result, index) => (
            <motion.div
              key={result.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              onClick={() => setShowResultModal(true)}
              className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer"
            >
              {/* Header with Type Badge */}
              <div
                className="px-6 pt-6 pb-4 border-b border-slate-100"
                style={{
                  background: `linear-gradient(135deg, ${result.color}08 0%, ${result.color}02 100%)`
                }}
              >
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{
                    backgroundColor: `${result.color}15`,
                    color: result.color
                  }}
                >
                  {result.type}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#009de0] transition-colors">
                  {result.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-medium">{result.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-bold" style={{ color: result.color }}>{result.time}</span>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div className="px-6 py-5">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Key Findings
                </h5>
                <ul className="space-y-2.5">
                  {result.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ color: result.color }}
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Badge */}
              <div className="px-6 pb-5">
                <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-900">{result.pages} pages</span>
                    {' → '}
                    <span className="font-bold" style={{ color: result.color }}>{result.time}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResultModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#009de0] to-[#7c3aed] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Try It Yourself
                </h3>
                <p className="text-slate-600 mb-6">
                  Upload your own PDF and get instant insights like these in seconds
                </p>
              </div>

              <button
                onClick={() => {
                  setShowResultModal(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#009de0] to-[#0088c7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Upload Your Own PDF
              </button>

              <button
                onClick={() => setShowResultModal(false)}
                className="w-full mt-3 px-6 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ProofWall() {
  return (
    <section
      data-header-theme="light"
      aria-label="Product speed and capabilities demonstration"
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 cursor-default"
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

        {/* Trusted By - Industry Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <h3 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Trusted by 15,000+ teams across industries
          </h3>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            From legal to healthcare, finance to technology - professionals rely on our platform every day
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="bg-white rounded-xl border-2 border-slate-200 p-6 text-center cursor-default hover:border-[#009de0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-[#009de0] group-hover:scale-110 transition-transform duration-300 flex justify-center mb-3">
                  {industry.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {industry.name}
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                  {industry.teamCount}
                </p>
              </motion.div>
            ))}
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

        {/* Real Results Section */}
        <div className="mb-16">
          <RealResults />
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-[#009de0] to-[#0088c7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
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
