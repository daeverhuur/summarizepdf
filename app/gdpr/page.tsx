'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function GDPRPage() {
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
              GDPR <span className="text-gradient">Compliance</span>
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      The General Data Protection Regulation (GDPR) is a European Union regulation that protects the privacy and personal data of EU citizens. At SummarizePDF, we are committed to GDPR compliance and protecting the rights of all our users, regardless of location.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      This page explains how we comply with GDPR requirements and what rights you have under GDPR regarding your personal data.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Legal Basis for Processing</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Under GDPR, we must have a legal basis to process your personal data. We process your data based on:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                      <li><strong className="text-slate-900">Consent:</strong> You have given clear consent for us to process your personal data for specific purposes</li>
                      <li><strong className="text-slate-900">Contract:</strong> Processing is necessary to fulfill a contract with you</li>
                      <li><strong className="text-slate-900">Legal Obligation:</strong> Processing is necessary to comply with the law</li>
                      <li><strong className="text-slate-900">Legitimate Interests:</strong> Processing is necessary for our legitimate interests or those of a third party, unless your interests override</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Your Rights Under GDPR</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Under GDPR, you have the following rights regarding your personal data:
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.1 Right to Access</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You have the right to request copies of your personal data. We may charge a small fee for this service.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.2 Right to Rectification</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.3 Right to Erasure</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You have the right to request that we erase your personal data, under certain conditions (also known as the "right to be forgotten").
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.4 Right to Restrict Processing</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You have the right to request that we restrict the processing of your personal data, under certain conditions.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.5 Right to Data Portability</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.6 Right to Object</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You have the right to object to our processing of your personal data, under certain conditions.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">3.7 Rights Related to Automated Decision Making</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How to Exercise Your Rights</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      To exercise any of your GDPR rights, please contact us using the information provided at the end of this page. We will respond to your request within one month.
                    </p>
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-6">
                      <p className="text-slate-700 mb-2">
                        <strong className="text-slate-900">Required Information:</strong> When submitting a request, please provide:
                      </p>
                      <ul className="list-disc list-inside text-white/60 space-y-1 ml-4 text-sm">
                        <li>Your full name and email address associated with your account</li>
                        <li>A clear description of the right you wish to exercise</li>
                        <li>Any additional information that helps us locate your data</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data We Collect</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      We collect and process the following categories of personal data:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                      <li><strong className="text-slate-900">Identity Data:</strong> Name, username, and account identifiers</li>
                      <li><strong className="text-slate-900">Contact Data:</strong> Email address</li>
                      <li><strong className="text-slate-900">Financial Data:</strong> Payment card details (processed securely by Stripe)</li>
                      <li><strong className="text-slate-900">Technical Data:</strong> IP address, browser type, device information</li>
                      <li><strong className="text-slate-900">Usage Data:</strong> Information about how you use our Service</li>
                      <li><strong className="text-slate-900">Content Data:</strong> Documents you upload and generated summaries</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Processing Activities</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      We process your personal data for the following purposes:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
                        <p className="text-slate-900 font-semibold mb-2">Service Provision</p>
                        <p className="text-slate-600 text-sm">To provide, maintain, and improve the document summarization service</p>
                        <p className="text-slate-500 text-xs mt-2">Legal Basis: Contract Performance, Legitimate Interests</p>
                      </div>
                      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
                        <p className="text-slate-900 font-semibold mb-2">Account Management</p>
                        <p className="text-slate-600 text-sm">To create and manage your user account and subscriptions</p>
                        <p className="text-slate-500 text-xs mt-2">Legal Basis: Contract Performance, Consent</p>
                      </div>
                      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
                        <p className="text-slate-900 font-semibold mb-2">Communication</p>
                        <p className="text-slate-600 text-sm">To send service-related communications and respond to inquiries</p>
                        <p className="text-slate-500 text-xs mt-2">Legal Basis: Contract Performance, Legitimate Interests</p>
                      </div>
                      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
                        <p className="text-slate-900 font-semibold mb-2">Analytics & Improvement</p>
                        <p className="text-slate-600 text-sm">To analyze usage and improve service quality</p>
                        <p className="text-slate-500 text-xs mt-2">Legal Basis: Legitimate Interests, Consent</p>
                      </div>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Retention</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      We retain your personal data only for as long as necessary to fulfill the purposes outlined in our Privacy Policy. Specific retention periods include:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                      <li><strong className="text-slate-900">Account Data:</strong> Retained while your account is active, deleted within 30 days of account closure</li>
                      <li><strong className="text-slate-900">Document Data:</strong> Retained until you delete them or close your account</li>
                      <li><strong className="text-slate-900">Payment Records:</strong> Retained for 7 years for tax and accounting purposes</li>
                      <li><strong className="text-slate-900">Usage Logs:</strong> Retained for 12 months for security and analytics</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Data Transfers</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Your personal data may be transferred to and processed in countries outside the European Economic Area (EEA). When we transfer your data, we ensure appropriate safeguards are in place, including:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                      <li>Standard Contractual Clauses approved by the European Commission</li>
                      <li>Adequacy decisions recognizing equivalent data protection</li>
                      <li>Binding Corporate Rules for transfers within corporate groups</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Data Security</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Regular security assessments and penetration testing</li>
                      <li>Access controls and authentication mechanisms</li>
                      <li>Employee training on data protection</li>
                      <li>Incident response and breach notification procedures</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Data Breach Notification</h2>
                    <p className="text-slate-700 leading-relaxed">
                      In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify you and the relevant supervisory authority within 72 hours of becoming aware of the breach, as required by GDPR.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Supervisory Authority</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      You have the right to lodge a complaint with a supervisory authority if you believe we have violated your data protection rights. EU residents can contact their local data protection authority.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      However, we would appreciate the opportunity to address your concerns before you approach a supervisory authority, so please contact us first.
                    </p>
                  </section>

                  <section className="mb-0">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Information</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      For any questions about GDPR compliance or to exercise your rights, please contact our Data Protection Officer:
                    </p>
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-6">
                      <p className="text-slate-700 mb-2">
                        <strong className="text-slate-900">Data Protection Officer</strong>
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Email:</strong> dpo@summarizepdf.com
                      </p>
                      <p className="text-slate-700 mt-2">
                        <strong className="text-slate-900">Alternative Contact:</strong> privacy@summarizepdf.com
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

