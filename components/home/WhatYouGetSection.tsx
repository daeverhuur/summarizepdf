'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function WhatYouGetSection() {
  const [activeTab, setActiveTab] = useState<'summary' | 'insights' | 'chat'>('summary');

  return (
    <section 
      data-header-theme="light"
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#009de0]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7c3aed]/5 rounded-full blur-[150px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block text-[#009de0] font-semibold text-sm uppercase tracking-wider mb-4"
          >
            See It In Action
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Your PDFs, <span className="text-gradient">transformed instantly</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Upload any document and watch as our AI extracts summaries, insights, and answers in seconds
          </p>
        </motion.div>

        {/* Product Demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { id: 'summary' as const, label: 'AI Summary', icon: '📄' },
              { id: 'insights' as const, label: 'Key Insights', icon: '💡' },
              { id: 'chat' as const, label: 'Chat Interface', icon: '💬' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#009de0] text-white shadow-lg shadow-[#009de0]/30'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Interface Mockup */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-4 py-1.5 text-sm text-slate-500 ml-4">
                app.summarizepdf.ai/documents/marketing-report.pdf
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 min-h-[500px]">
              {/* Summary Tab */}
              {activeTab === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Document Header */}
                  <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                    <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-[#009de0] to-[#00d4ff] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      PDF
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        Q3 Marketing Report.pdf
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>📄 24 pages</span>
                        <span>⚡ Processed in 12s</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          ✓ Complete
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-slate-900">Executive Summary</h4>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
                          Copy
                        </button>
                        <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
                          Export
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200">
                      <div className="space-y-3 text-slate-700">
                        <p className="flex gap-3">
                          <span className="text-[#009de0] font-bold">•</span>
                          <span>Q3 marketing campaigns drove 42% increase in qualified leads with total revenue growth of $2.3M</span>
                        </p>
                        <p className="flex gap-3">
                          <span className="text-[#009de0] font-bold">•</span>
                          <span>Social media engagement increased 156% through influencer partnerships and video content strategy</span>
                        </p>
                        <p className="flex gap-3">
                          <span className="text-[#009de0] font-bold">•</span>
                          <span>Email marketing automation reduced cost-per-acquisition by 38% while maintaining conversion rates</span>
                        </p>
                        <p className="flex gap-3">
                          <span className="text-[#009de0] font-bold">•</span>
                          <span>Key recommendation: Allocate additional $500K budget to highest-performing channels for Q4</span>
                        </p>
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {[
                        { title: 'Campaign Results', pages: 'Pages 3-8' },
                        { title: 'Budget Analysis', pages: 'Pages 9-14' },
                        { title: 'Q4 Strategy', pages: 'Pages 15-20' },
                      ].map((section, i) => (
                        <div
                          key={i}
                          className="p-4 border border-slate-200 rounded-lg hover:border-[#009de0] hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="font-semibold text-slate-900 mb-1">{section.title}</div>
                          <div className="text-sm text-slate-500">{section.pages}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Insights Tab */}
              {activeTab === 'insights' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h4 className="text-2xl font-bold text-slate-900 mb-6">Key Insights Extracted</h4>
                  
                  <div className="space-y-4">
                    {[
                      {
                        type: 'Finding',
                        color: 'emerald',
                        icon: '📊',
                        title: 'Revenue Growth Acceleration',
                        content: 'Q3 revenue exceeded targets by 28%, driven primarily by enterprise client acquisitions in the EMEA region.',
                      },
                      {
                        type: 'Recommendation',
                        color: 'blue',
                        icon: '💡',
                        title: 'Strategic Investment Opportunity',
                        content: 'Data suggests doubling down on video content and influencer partnerships could yield 3x ROI in Q4.',
                      },
                      {
                        type: 'Warning',
                        color: 'amber',
                        icon: '⚠️',
                        title: 'Budget Constraints Identified',
                        content: 'Current trajectory will exceed annual marketing budget by 12% unless adjustments are made to lower-performing channels.',
                      },
                      {
                        type: 'Statistic',
                        color: 'purple',
                        icon: '📈',
                        title: 'Customer Acquisition Cost',
                        content: 'CAC decreased from $142 to $88 (-38%) while lifetime value increased by 22%, significantly improving unit economics.',
                      },
                    ].map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border-l-4 border-slate-200 hover:border-[#009de0] p-5 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`text-3xl`}>{insight.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 bg-${insight.color}-50 text-${insight.color}-700 rounded-full text-xs font-semibold uppercase`}>
                                {insight.type}
                              </span>
                              <h5 className="font-bold text-slate-900">{insight.title}</h5>
                            </div>
                            <p className="text-slate-600">{insight.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-2xl font-bold text-slate-900 mb-6">Chat with Your Document</h4>
                  
                  <div className="space-y-4 mb-6">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-[#009de0] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-lg">
                        <p className="font-medium">What were the main reasons for the revenue increase?</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm max-w-2xl">
                        <p className="mb-3">
                          Based on the document, there were three primary drivers of the revenue increase:
                        </p>
                        <ol className="space-y-2 mb-3 list-decimal list-inside">
                          <li><strong>Enterprise client acquisitions</strong> - New contracts with Fortune 500 companies added $1.2M in recurring revenue <span className="text-[#009de0] font-semibold">(Page 5)</span></li>
                          <li><strong>Product upsells</strong> - Existing customers upgraded to premium tiers, contributing $800K <span className="text-[#009de0] font-semibold">(Page 7)</span></li>
                          <li><strong>International expansion</strong> - EMEA region growth exceeded projections by 35% <span className="text-[#009de0] font-semibold">(Page 9)</span></li>
                        </ol>
                        <p className="text-sm text-slate-600 italic">The report also mentions improved sales team efficiency as a contributing factor.</p>
                      </div>
                    </div>

                    {/* User Follow-up */}
                    <div className="flex justify-end">
                      <div className="bg-[#009de0] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-lg">
                        <p className="font-medium">What's recommended for Q4 budget allocation?</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm max-w-2xl">
                        <p>
                          The report recommends allocating an additional <strong>$500K to video content and influencer partnerships</strong> for Q4, as these channels showed the highest ROI at 3:1 <span className="text-[#009de0] font-semibold">(Page 18)</span>. 
                          
                          It also suggests reducing spend on traditional display advertising by 25% to stay within budget constraints.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Questions */}
                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-sm text-slate-600 mb-3 font-semibold">Suggested follow-up questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'What are the top performing channels?',
                        'Show me the CAC trends',
                        'What risks were identified?',
                        'Compare Q2 vs Q3 performance'
                      ].map((q, i) => (
                        <button
                          key={i}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-700 hover:border-[#009de0] hover:text-[#009de0] transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Ask anything about this document..."
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#009de0] focus:ring-2 focus:ring-[#009de0]/20"
                      />
                      <button className="px-6 py-3 bg-[#009de0] text-white rounded-xl font-semibold hover:bg-[#0086bd] transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          {[
            { icon: '⚡', text: 'Instant Processing' },
            { icon: '🎯', text: 'High Accuracy' },
            { icon: '📤', text: 'Multiple Export Formats' },
            { icon: '🔒', text: 'Enterprise Security' },
          ].map((feature, i) => (
            <div
              key={i}
              className="px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-medium hover:border-[#009de0] hover:shadow-md transition-all"
            >
              <span className="mr-2">{feature.icon}</span>
              {feature.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
