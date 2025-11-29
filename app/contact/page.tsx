'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@summarizepdf.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      title: 'Sales Inquiries',
      description: 'Questions about plans and pricing',
      contact: 'sales@summarizepdf.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: 'General Inquiries',
      description: 'Any other questions or feedback',
      contact: 'hello@summarizepdf.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
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
              Get in <span className="text-gradient">touch</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
              {contactMethods.map((method, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full text-center">
                    <div className="w-14 h-14 bg-[#009de0]/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#009de0]">
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{method.description}</p>
                    <a
                      href={`mailto:${method.contact}`}
                      className="text-[#009de0] hover:text-[#00d4ff] transition-colors font-medium"
                    >
                      {method.contact}
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
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
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">
                Send us a message
              </h2>
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-slate-900 font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#009de0]/50 focus:bg-slate-200 transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-slate-900 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#009de0]/50 focus:bg-slate-200 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-slate-900 font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#009de0]/50 focus:bg-slate-200 transition-all"
                    >
                      <option value="" className="bg-white">Select a subject</option>
                      <option value="support" className="bg-white">Technical Support</option>
                      <option value="sales" className="bg-white">Sales Inquiry</option>
                      <option value="feedback" className="bg-white">Feedback</option>
                      <option value="partnership" className="bg-white">Partnership</option>
                      <option value="other" className="bg-white">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-slate-900 font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#009de0]/50 focus:bg-slate-200 transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Send Message
                  </button>
                </form>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">
                Quick Answers
              </h2>
              <div className="space-y-4">
                {[
                  {
                    question: 'What are your support hours?',
                    answer: 'Our support team typically responds within 24 hours on business days. Premium and Team plan users receive priority support.',
                  },
                  {
                    question: 'Do you offer phone support?',
                    answer: 'Currently, we provide support via email. For urgent issues, Premium and Team plan users can request priority assistance.',
                  },
                  {
                    question: 'How can I report a bug?',
                    answer: 'Please email support@summarizepdf.com with a detailed description of the issue, including steps to reproduce it and any error messages.',
                  },
                ].map((faq, i) => (
                  <Card key={i} className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-slate-600">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

