'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  title: string;
  content: string;
}

interface SummaryViewerProps {
  content: string;
  sections?: Section[];
  format: 'bullet' | 'paragraph' | 'detailed';
}

export function SummaryViewer({ content, sections, format }: SummaryViewerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'sections'>('summary');
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const sectionList = sections ?? [];
  const hasSections = sectionList.length > 0;
  const previewSections = hasSections ? sectionList.slice(0, 3) : [];

  const getPreviewText = (text: string) => {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= 320) {
      return normalized;
    }
    return `${normalized.slice(0, 320).trim()}...`;
  };

  return (
    <div className="bg-[#16161f] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header with tabs */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'summary'
                ? 'bg-[#009de0] text-white shadow-lg shadow-[#009de0]/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Summary
          </button>
          {hasSections && (
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'sections'
                  ? 'bg-[#009de0] text-white shadow-lg shadow-[#009de0]/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sections ({sections.length})
            </button>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'summary' ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="prose prose-invert max-w-none"
            >
              <div className={`text-white/80 leading-relaxed ${
                format === 'bullet' ? 'space-y-2' : 'space-y-4'
              }`}>
                {content.split('\n').map((line, i) => {
                  if (!line.trim()) return null;

                  // Handle bullet points
                  if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                    return (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <span className="text-[#00d4ff] mt-1.5">•</span>
                        <span>{line.replace(/^[•\-*]\s*/, '')}</span>
                      </div>
                    );
                  }

                  // Handle headings (lines ending with :)
                  if (line.trim().endsWith(':') && line.length < 100) {
                    return (
                      <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-3 first:mt-0">
                        {line}
                      </h3>
                    );
                  }

                  return <p key={i}>{line}</p>;
                })}
              </div>

              {previewSections.length > 0 && (
                <div className="mt-10 border-t border-white/5 pt-6">
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Section Breakdown</h3>
                      <p className="text-sm text-white/50">
                        Snapshot of the most important sections from the analysis
                      </p>
                    </div>
                    {hasSections && sectionList.length > previewSections.length && (
                      <button
                        onClick={() => setActiveTab('sections')}
                        className="text-sm text-[#00d4ff] hover:text-white transition-colors"
                      >
                        View all sections →
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {previewSections.map((section, index) => (
                      <div
                        key={`${section.title}-${index}`}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-[#00d4ff]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#009de0]/20 text-[#00d4ff] font-semibold flex items-center justify-center">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{section.title}</p>
                            <p className="text-xs text-white/50">Section {index + 1}</p>
                          </div>
                        </div>
                        <p className="text-sm text-white/70 mt-3 leading-relaxed">
                          {getPreviewText(section.content)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="sections"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {sections?.map((section, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <h3 className="font-semibold text-white">{section.title}</h3>
                    {expandedSections.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-white/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-white/70 leading-relaxed border-t border-white/5 pt-4">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
