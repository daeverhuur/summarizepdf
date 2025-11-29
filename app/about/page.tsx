'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  const values = [
    {
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI technology to transform how people interact with documents.',
    },
    {
      title: 'User-Centric Design',
      description: 'Every feature is built with our users in mind, ensuring simplicity meets powerful functionality.',
    },
    {
      title: 'Privacy & Security',
      description: 'Your documents are encrypted and secure. We never share your data or use it for training.',
    },
    {
      title: 'Continuous Improvement',
      description: 'We constantly update our AI models and features based on user feedback and latest advancements.',
    },
  ];

  const stats = [
    { value: '50,000+', label: 'Documents Processed' },
    { value: '5,000+', label: 'Active Users' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '10x', label: 'Time Saved' },
  ];

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
              Transforming document workflow with <span className="text-gradient">AI innovation</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              SummarizePDF was born from a simple idea: people shouldn't spend hours reading documents when AI can extract the key insights in seconds.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 text-center">
                Our Mission
              </h2>
              <Card className="p-10">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  We believe everyone deserves access to powerful AI tools that make their work easier and more efficient. In a world drowning in information, we're building the tools that help you extract what matters most.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Whether you're a student tackling research papers, a professional reviewing contracts, or a researcher analyzing literature, SummarizePDF empowers you to work smarter, not harder.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#009de0]/10 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
                Powered by <span className="text-gradient">Advanced AI</span>
              </h2>
              <Card className="p-10">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  We use Google's latest Gemini AI models, known for their exceptional reasoning capabilities and contextual understanding. Our technology doesn't just extract text—it comprehends meaning, identifies relationships, and generates insights.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Combined with advanced OCR, multi-language support, and continuous model improvements, we deliver the most accurate and intelligent document summaries available.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Join thousands of users worldwide
            </h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Experience the future of document processing with AI-powered summaries
            </p>
            <motion.a
              href="/sign-up"
              className="btn-primary inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

