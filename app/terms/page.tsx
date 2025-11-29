'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function TermsOfServicePage() {
  const lastUpdated = 'November 28, 2025';

  return (
    <div className="pt-32">

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
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-lg text-slate-600">
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
                <div className="prose prose-slate max-w-none">
                  
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      By accessing and using SummarizePDF ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      We reserve the right to update and change these Terms of Service by posting updates and changes to the Service. You are advised to check the Terms of Service from time to time for any updates or changes.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      SummarizePDF provides an AI-powered document summarization service that allows users to upload PDF documents and receive automated summaries. The Service includes:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                      <li>PDF document upload and processing</li>
                      <li>AI-generated summaries in various formats</li>
                      <li>Document storage and management</li>
                      <li>Chat functionality with documents</li>
                      <li>Export and sharing capabilities</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.1 Account Creation</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.2 Account Security</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You are responsible for safeguarding your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.3 Account Termination</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We reserve the right to suspend or terminate your account if we determine, in our sole discretion, that you have violated these Terms of Service or engaged in fraudulent or illegal activities.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use</h2>
                    <p className="text-slate-700 leading-relaxed mb-2">You agree not to use the Service to:</p>
                    <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                      <li>Upload documents you do not have legal rights to process</li>
                      <li>Violate any laws, regulations, or third-party rights</li>
                      <li>Upload malicious code, viruses, or harmful content</li>
                      <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                      <li>Interfere with or disrupt the Service or servers</li>
                      <li>Use automated systems to access the Service without permission</li>
                      <li>Resell or commercially exploit the Service without authorization</li>
                      <li>Upload content that is illegal, harmful, threatening, abusive, or offensive</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Content and Intellectual Property</h2>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">5.1 Your Content</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You retain all rights to the documents and content you upload to the Service ("Your Content"). By uploading Your Content, you grant us a limited license to process, store, and display Your Content solely for the purpose of providing the Service to you.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">5.2 Our Intellectual Property</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      The Service, including its software, design, text, graphics, and other content (excluding Your Content), is owned by SummarizePDF and is protected by copyright, trademark, and other intellectual property laws.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">5.3 Generated Summaries</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You own the AI-generated summaries produced from Your Content. However, you acknowledge that similar summaries may be generated for other users from similar source documents.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Payment and Subscriptions</h2>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">6.1 Pricing</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Certain features of the Service require payment of fees. All fees are in U.S. dollars and are non-refundable except as required by law or as explicitly stated in our refund policy.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">6.2 Billing</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Subscription fees are billed in advance on a monthly or annual basis. Your subscription will automatically renew unless you cancel before the renewal date.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">6.3 Changes to Pricing</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We may change our pricing from time to time. Price changes will not affect your current billing cycle but will apply to subsequent billing periods. We will provide you with advance notice of any price changes.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Disclaimers and Limitations of Liability</h2>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">7.1 Service Availability</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">7.2 AI-Generated Content</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      While we strive for accuracy, AI-generated summaries may contain errors or omissions. You should review summaries for accuracy and not rely solely on them for critical decisions.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">7.3 Limitation of Liability</h3>
                    <p className="text-slate-700 leading-relaxed">
                      To the maximum extent permitted by law, SummarizePDF shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Indemnification</h2>
                    <p className="text-slate-700 leading-relaxed">
                      You agree to indemnify and hold harmless SummarizePDF and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from your use of the Service or violation of these Terms.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Dispute Resolution</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, rather than in court.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      You agree to waive any right to a jury trial or to participate in a class action lawsuit.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Governing Law</h2>
                    <p className="text-slate-700 leading-relaxed">
                      These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Severability</h2>
                    <p className="text-slate-700 leading-relaxed">
                      If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                    </p>
                  </section>

                  <section className="mb-0">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Information</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-6">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Email:</strong> legal@summarizepdf.com
                      </p>
                    </div>
                  </section>

                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

