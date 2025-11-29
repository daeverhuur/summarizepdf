'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function CareersPage() {
  const benefits = [
    {
      title: 'Remote-First Culture',
      description: 'Work from anywhere in the world with flexible hours',
    },
    {
      title: 'Competitive Compensation',
      description: 'Industry-leading salaries and equity packages',
    },
    {
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness stipend',
    },
    {
      title: 'Learning & Development',
      description: 'Annual education budget and conference attendance',
    },
    {
      title: 'Latest Technology',
      description: 'Work with cutting-edge AI and modern tech stack',
    },
    {
      title: 'Impactful Work',
      description: 'Build products used by thousands of users daily',
    },
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We embrace new ideas and push the boundaries of what\'s possible with AI',
    },
    {
      title: 'Transparency',
      description: 'Open communication and honest feedback at all levels',
    },
    {
      title: 'User Focus',
      description: 'Every decision starts with how it benefits our users',
    },
    {
      title: 'Collaboration',
      description: 'We work together, support each other, and celebrate wins as a team',
    },
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
              Join our <span className="text-gradient">mission</span> to transform document processing
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Build the future of AI-powered productivity tools with a passionate, talented team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12 text-center">
              Our Culture & Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
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

      {/* Benefits Section */}
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
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12 text-center">
              Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full">
                    <div className="w-12 h-12 bg-[#009de0]/10 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-6 h-6 bg-[#009de0] rounded-full" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Openings Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12 text-center">
              Current Openings
            </h2>
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
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  No Open Positions Right Now
                </h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  We're not actively hiring at the moment, but we're always interested in meeting talented people who are passionate about AI and productivity tools.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">
                    Interested in future opportunities?
                  </h4>
                  <p className="text-slate-600 text-sm mb-6">
                    Send us your resume and tell us about yourself. We'll reach out when a position matches your skills.
                  </p>
                  <a
                    href="mailto:careers@summarizepdf.com"
                    className="inline-block btn-primary"
                  >
                    Email Us Your Resume
                  </a>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
                Our Tech Stack
              </h2>
              <Card className="p-10">
                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  We work with modern, cutting-edge technologies that make development enjoyable and efficient.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Next.js', 'TypeScript', 'React', 'Convex', 'Google Gemini AI', 'Tailwind CSS', 'Stripe'].map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

