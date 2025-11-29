'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function BlogPage() {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#009de0]/10 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div 
            className="text-center mb-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
              Latest <span className="text-gradient">Insights</span> & Updates
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              News, tips, and best practices for AI-powered document processing
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto">
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-[#009de0]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="text-[#009de0]"
                  >
                    <path d="M12 2v20M2 12h20" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Blog Coming Soon
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  We're working on bringing you valuable content about AI, document processing, productivity tips, and product updates. Stay tuned!
                </p>

                {/* Newsletter Signup */}
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Get notified when we launch
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">
                    Subscribe to our newsletter for product updates and tips
                  </p>
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#009de0]/50 focus:bg-slate-200 transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full btn-primary"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Placeholder Blog Posts Grid */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Upcoming Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: 'How AI is Transforming Document Processing',
                  category: 'AI Technology',
                },
                {
                  title: '10 Productivity Tips for Professionals',
                  category: 'Productivity',
                },
                {
                  title: 'Best Practices for PDF Summarization',
                  category: 'Guides',
                },
              ].map((topic, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full opacity-50 cursor-not-allowed">
                    <div className="text-[#009de0] text-sm font-semibold mb-3">
                      {topic.category}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {topic.title}
                    </h3>
                    <p className="text-slate-500 text-sm">Coming soon...</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

