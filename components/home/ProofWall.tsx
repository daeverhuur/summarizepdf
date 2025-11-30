'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface StatCard {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface CaseStudy {
  name: string;
  role: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    timeBefore: string;
    timeAfter: string;
    timeSaved: string;
    efficiency: string;
  };
  metrics: {
    documents: number;
    hoursSaved: number;
    roi: string;
  };
  quote: string;
  avatar: string;
  featured?: boolean;
}

const stats: StatCard[] = [
  { value: 50000, label: 'Documents Analyzed', suffix: '+' },
  { value: 120000, label: 'Hours Saved', suffix: '+' },
  { value: 98, label: 'Success Rate', suffix: '%' },
  { value: 15000, label: 'Happy Users', suffix: '+' },
];

const caseStudies: CaseStudy[] = [
  {
    name: 'Sarah Chen',
    role: 'Legal Director',
    company: 'Morrison & Associates',
    industry: 'Legal Services',
    challenge: 'Contract review process taking 3+ hours per document',
    solution: 'Implemented AI-powered document analysis for initial review',
    results: {
      timeBefore: '3 hours',
      timeAfter: '15 minutes',
      timeSaved: '2h 45m per contract',
      efficiency: '92% faster',
    },
    metrics: {
      documents: 847,
      hoursSaved: 2329,
      roi: '12x',
    },
    quote: 'SummarizePDF transformed our contract review workflow. What used to take our team an entire afternoon now takes 15 minutes. We\'ve analyzed 847 contracts and saved over 2,300 hours.',
    avatar: 'SC',
    featured: true,
  },
  {
    name: 'Dr. Marcus Rodriguez',
    role: 'Research Lead',
    company: 'MIT Labs',
    industry: 'Academic Research',
    challenge: 'Reviewing 200+ page research papers for literature reviews',
    solution: 'Automated extraction of key findings and methodologies',
    results: {
      timeBefore: '4-6 hours',
      timeAfter: '20 minutes',
      timeSaved: '4h 40m per paper',
      efficiency: '94% faster',
    },
    metrics: {
      documents: 324,
      hoursSaved: 1512,
      roi: '18x',
    },
    quote: 'For our meta-analysis of climate research, we needed to review over 300 papers. SummarizePDF helped us extract key data points in 20 minutes instead of hours. The accuracy is remarkable.',
    avatar: 'MR',
    featured: true,
  },
  {
    name: 'Emily Thompson',
    role: 'Chief Financial Officer',
    company: 'TechVenture Inc',
    industry: 'Technology',
    challenge: 'Quarterly financial reports requiring days of analysis',
    solution: 'Automated financial data extraction and trend analysis',
    results: {
      timeBefore: '3 days',
      timeAfter: '2 hours',
      timeSaved: '22 hours per quarter',
      efficiency: '93% faster',
    },
    metrics: {
      documents: 156,
      hoursSaved: 3432,
      roi: '23x',
    },
    quote: 'Our quarterly board prep went from a 3-day nightmare to a 2-hour task. The AI accurately extracts financial trends, risks, and opportunities that I can present with confidence.',
    avatar: 'ET',
  },
  {
    name: 'David Park',
    role: 'Senior Product Manager',
    company: 'InnovateCo',
    industry: 'Software',
    challenge: 'Processing technical specs and user research documents',
    solution: 'Rapid extraction of feature requirements and user insights',
    results: {
      timeBefore: '2 hours',
      timeAfter: '12 minutes',
      timeSaved: '1h 48m per doc',
      efficiency: '90% faster',
    },
    metrics: {
      documents: 567,
      hoursSaved: 1020,
      roi: '15x',
    },
    quote: 'Product specs, user research, competitive analysis—I process them all with SummarizePDF. It\'s like having a research assistant who never sleeps. Essential for our sprint planning.',
    avatar: 'DP',
  },
];

// Custom animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(startValue + (end - startValue) * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return { count, ref };
}

// Custom Icon Components
function DocumentIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 3L6.5 5L8.5 5.5L6.5 6L6 8L5.5 6L3.5 5.5L5.5 5L6 3Z" fill="currentColor"/>
      <path d="M18 16L18.5 18L20.5 18.5L18.5 19L18 21L17.5 19L15.5 18.5L17.5 18L18 16Z" fill="currentColor"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ProofWall() {
  return (
    <section 
      data-header-theme="light" 
      aria-label="Customer success stories and case studies" 
      className="relative py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50"
    >
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-[#009de0]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-gradient-to-br from-[#009de0]/15 to-[#7c3aed]/20 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,157,224,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,157,224,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-[#009de0]/10 text-[#009de0] text-sm font-semibold rounded-full border border-[#009de0]/20">
              Real Results · Real Impact
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Proven Success Stories from{' '}
            <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See how professionals are saving thousands of hours and transforming their workflows with measurable results
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const { count, ref } = useCountUp(stat.value);
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-8 text-center hover:border-[#009de0]/50 transition-all duration-300 hover:shadow-xl overflow-hidden">
                  {/* Background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009de0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                      {stat.prefix}{count.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-sm md:text-base text-slate-600 font-medium">
                      {stat.label}
                    </div>
                  </div>

                  {/* Accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009de0] to-[#7c3aed] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Featured Case Studies */}
        <div className="space-y-8 mb-12">
          {caseStudies.filter(cs => cs.featured).map((caseStudy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <div className="relative bg-white border-2 border-slate-200 rounded-3xl overflow-hidden hover:border-[#009de0]/50 transition-all duration-500 hover:shadow-2xl">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#009de0]/5 via-transparent to-[#7c3aed]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 p-8 lg:p-12">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Person & Company Info */}
                    <div className="lg:col-span-1 flex flex-col">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009de0] to-[#0088c7] text-white flex items-center justify-center text-xl font-bold shadow-lg">
                          {caseStudy.avatar}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">
                            {caseStudy.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-1">
                            {caseStudy.role}
                          </p>
                          <p className="text-sm font-semibold text-[#009de0]">
                            {caseStudy.company}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                            {caseStudy.industry}
                          </span>
                        </div>
                      </div>

                      {/* Challenge */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <TargetIcon />
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                            The Challenge
                          </h4>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {caseStudy.challenge}
                        </p>
                      </div>

                      {/* Solution */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <SparklesIcon />
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                            The Solution
                          </h4>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {caseStudy.solution}
                        </p>
                      </div>
                    </div>

                    {/* Middle Column - Before/After & Results */}
                    <div className="lg:col-span-1 flex flex-col justify-center">
                      {/* Before/After Comparison */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <ClockIcon />
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                            Time Impact
                          </h4>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Before */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 font-medium">Before:</span>
                            <span className="text-lg font-bold text-slate-400 line-through">
                              {caseStudy.results.timeBefore}
                            </span>
                          </div>
                          
                          {/* Arrow */}
                          <div className="flex justify-center">
                            <div className="text-[#009de0]">
                              <ArrowRightIcon />
                            </div>
                          </div>
                          
                          {/* After */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 font-medium">After:</span>
                            <span className="text-2xl font-bold text-[#009de0]">
                              {caseStudy.results.timeAfter}
                            </span>
                          </div>

                          {/* Efficiency Badge */}
                          <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 font-medium">Efficiency Gain:</span>
                              <span className="px-3 py-1 bg-gradient-to-r from-[#009de0] to-[#7c3aed] text-white text-sm font-bold rounded-full">
                                {caseStudy.results.efficiency}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#009de0]/10 rounded-xl p-4 text-center border border-[#009de0]/20">
                          <div className="text-2xl font-bold text-[#009de0] mb-1">
                            {caseStudy.metrics.documents}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            Documents
                          </div>
                        </div>
                        <div className="bg-[#009de0]/10 rounded-xl p-4 text-center border border-[#009de0]/20">
                          <div className="text-2xl font-bold text-[#009de0] mb-1">
                            {caseStudy.metrics.hoursSaved.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            Hours Saved
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#009de0]/10 to-[#7c3aed]/10 rounded-xl p-4 text-center border border-[#009de0]/20">
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#009de0] to-[#7c3aed] bg-clip-text text-transparent mb-1">
                            {caseStudy.metrics.roi}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            ROI
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Quote & Impact */}
                    <div className="lg:col-span-1 flex flex-col justify-center">
                      <div className="relative">
                        {/* Quote marks */}
                        <div className="absolute -top-4 -left-2 text-6xl text-[#009de0]/20 font-serif leading-none">
                          "
                        </div>
                        
                        <blockquote className="relative text-slate-700 text-lg leading-relaxed mb-6 pl-6">
                          {caseStudy.quote}
                        </blockquote>

                        {/* Impact Highlight */}
                        <div className="bg-gradient-to-br from-[#009de0]/5 to-[#7c3aed]/5 rounded-xl p-6 border border-[#009de0]/20">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUpIcon />
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                              Total Impact
                            </h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Time Saved per Task:</span>
                              <span className="text-base font-bold text-[#009de0]">
                                {caseStudy.results.timeSaved}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Total Hours Saved:</span>
                              <span className="text-base font-bold text-[#009de0]">
                                {caseStudy.metrics.hoursSaved.toLocaleString()}h
                              </span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-slate-200">
                              <div className="text-xs text-slate-500 text-center">
                                Based on {caseStudy.metrics.documents} documents processed
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#009de0] to-[#7c3aed] text-white text-xs font-bold rounded-full shadow-lg">
                    FEATURED
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Case Studies - Compact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-16">
          {caseStudies.filter(cs => !cs.featured).map((caseStudy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#009de0]/5 via-transparent to-[#7c3aed]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header with avatar and info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#009de0] to-[#7c3aed] text-white flex items-center justify-center text-lg font-bold shadow-lg">
                      {caseStudy.avatar}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {caseStudy.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {caseStudy.role}
                      </p>
                      <p className="text-sm text-[#009de0] font-semibold">
                        {caseStudy.company}
                      </p>
                    </div>
                  </div>

                  {/* Results highlight */}
                  <div className="bg-gradient-to-r from-[#009de0]/10 to-[#7c3aed]/10 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Time Before</div>
                        <div className="text-lg font-bold text-slate-400 line-through">
                          {caseStudy.results.timeBefore}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Time After</div>
                        <div className="text-lg font-bold text-[#009de0]">
                          {caseStudy.results.timeAfter}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/50 flex justify-between items-center">
                      <span className="text-xs text-slate-600">Efficiency:</span>
                      <span className="px-3 py-1 bg-white text-[#009de0] text-xs font-bold rounded-full">
                        {caseStudy.results.efficiency}
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-slate-700 text-base leading-relaxed mb-6 flex-grow">
                    "{caseStudy.quote}"
                  </blockquote>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-900 mb-1">
                        {caseStudy.metrics.documents}
                      </div>
                      <div className="text-xs text-slate-600">
                        Docs
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#009de0] mb-1">
                        {caseStudy.metrics.hoursSaved.toLocaleString()}h
                      </div>
                      <div className="text-xs text-slate-600">
                        Saved
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold bg-gradient-to-r from-[#009de0] to-[#7c3aed] bg-clip-text text-transparent mb-1">
                        {caseStudy.metrics.roi}
                      </div>
                      <div className="text-xs text-slate-600">
                        ROI
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover accent border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-[#009de0] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA with emphasis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center gap-6 p-10 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-3xl shadow-xl max-w-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#009de0] to-[#7c3aed] rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-3">
                Ready to Write Your Success Story?
              </p>
              <p className="text-lg text-slate-600 mb-2">
                Join 15,000+ professionals saving thousands of hours
              </p>
              <p className="text-sm text-slate-500">
                Average time savings: <span className="text-[#009de0] font-bold">23.5 hours per week</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#009de0] to-[#0088c7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              Start Your Free Trial
              <ArrowRightIcon />
            </motion.button>
            <p className="text-xs text-slate-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
