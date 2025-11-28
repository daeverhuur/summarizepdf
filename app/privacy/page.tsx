'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 28, 2025';

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#009de0]/10 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div 
            className="text-center mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-lg text-white/50">
              Last Updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12">
                <div className="prose prose-invert max-w-none">
                  
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      SummarizePDF ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Service").
                    </p>
                    <p className="text-white/70 leading-relaxed">
                      Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Information You Provide</h3>
                    <p className="text-white/70 leading-relaxed mb-2">We collect information that you provide directly to us, including:</p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4 mb-4">
                      <li>Account information (name, email address, password)</li>
                      <li>Payment information (processed securely through Stripe)</li>
                      <li>Documents and files you upload to the Service</li>
                      <li>Communications with our support team</li>
                      <li>Feedback, survey responses, and other voluntary submissions</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 Automatically Collected Information</h3>
                    <p className="text-white/70 leading-relaxed mb-2">When you use the Service, we automatically collect certain information, including:</p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4 mb-4">
                      <li>Device information (IP address, browser type, operating system)</li>
                      <li>Usage data (pages viewed, features used, time spent on Service)</li>
                      <li>Cookies and similar tracking technologies</li>
                      <li>Log data and analytics information</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                    <p className="text-white/70 leading-relaxed mb-2">We use the collected information for the following purposes:</p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>Providing, maintaining, and improving the Service</li>
                      <li>Processing your documents and generating summaries</li>
                      <li>Managing your account and subscriptions</li>
                      <li>Processing payments and preventing fraud</li>
                      <li>Sending you technical notices, updates, and security alerts</li>
                      <li>Responding to your comments, questions, and customer service requests</li>
                      <li>Analyzing usage patterns and optimizing Service performance</li>
                      <li>Personalizing your experience and improving user satisfaction</li>
                      <li>Complying with legal obligations and enforcing our policies</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">4. Data Processing and AI</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      We use Google's Gemini AI to process and summarize your documents. Your documents are transmitted securely to Google's servers for processing. We do not use your documents to train our AI models or any third-party AI models.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                      Processed documents and generated summaries are stored securely in our database for your access. You can delete your documents at any time from your account.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing and Disclosure</h2>
                    <p className="text-white/70 leading-relaxed mb-2">We may share your information in the following circumstances:</p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li><strong className="text-white">Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., Google for AI processing, Stripe for payments, hosting providers)</li>
                      <li><strong className="text-white">Legal Requirements:</strong> When required by law or to respond to legal process</li>
                      <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                      <li><strong className="text-white">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                    </ul>
                    <p className="text-white/70 leading-relaxed mt-4">
                      We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Regular security assessments and updates</li>
                      <li>Access controls and authentication mechanisms</li>
                      <li>Secure payment processing through Stripe</li>
                    </ul>
                    <p className="text-white/70 leading-relaxed mt-4">
                      However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
                    <p className="text-white/70 leading-relaxed mb-2">You have certain rights regarding your personal information:</p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li><strong className="text-white">Access:</strong> Request access to your personal information</li>
                      <li><strong className="text-white">Correction:</strong> Request correction of inaccurate information</li>
                      <li><strong className="text-white">Deletion:</strong> Request deletion of your information</li>
                      <li><strong className="text-white">Portability:</strong> Request a copy of your data in a portable format</li>
                      <li><strong className="text-white">Objection:</strong> Object to certain processing of your information</li>
                      <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                    </ul>
                    <p className="text-white/70 leading-relaxed mt-4">
                      To exercise these rights, please contact us at privacy@summarizepdf.com.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                    <p className="text-white/70 leading-relaxed">
                      We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
                    <p className="text-white/70 leading-relaxed">
                      Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using the Service, you consent to the transfer of your information to these countries.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
                    <p className="text-white/70 leading-relaxed">
                      The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Privacy Policy</h2>
                    <p className="text-white/70 leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                    </p>
                  </section>

                  <section className="mb-0">
                    <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <p className="text-white/70">
                        <strong className="text-white">Email:</strong> privacy@summarizepdf.com
                      </p>
                    </div>
                  </section>

                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

