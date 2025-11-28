'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function CookiePolicyPage() {
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
              Cookie <span className="text-gradient">Policy</span>
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
                    <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our Service.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                      SummarizePDF uses cookies and similar tracking technologies to improve the functionality of our Service, analyze usage patterns, and enhance user experience.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Essential Cookies</h3>
                    <p className="text-white/70 leading-relaxed mb-4">
                      These cookies are necessary for the Service to function properly. They enable core functionality such as security, authentication, and accessibility. The Service cannot function properly without these cookies, and they can only be disabled by changing your browser preferences.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                      <p className="text-white/60 text-sm"><strong className="text-white">Examples:</strong> Session cookies, authentication tokens, security cookies</p>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 Functional Cookies</h3>
                    <p className="text-white/70 leading-relaxed mb-4">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and region. They may be set by us or by third-party providers whose services we use.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                      <p className="text-white/60 text-sm"><strong className="text-white">Examples:</strong> User preferences, language settings, theme preferences</p>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.3 Analytics Cookies</h3>
                    <p className="text-white/70 leading-relaxed mb-4">
                      These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. This helps us improve the Service and understand which features are most useful.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                      <p className="text-white/60 text-sm"><strong className="text-white">Examples:</strong> Google Analytics, usage statistics, page view tracking</p>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.4 Marketing Cookies</h3>
                    <p className="text-white/70 leading-relaxed mb-4">
                      These cookies track your browsing habits to deliver advertising that is more relevant to you and your interests. They remember that you have visited our website and share this information with advertisers.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-sm"><strong className="text-white">Examples:</strong> Advertising cookies, retargeting pixels, conversion tracking</p>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      We use services from trusted third parties that may also set cookies on your device. These third parties include:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li><strong className="text-white">Google Analytics:</strong> To analyze website traffic and user behavior</li>
                      <li><strong className="text-white">Stripe:</strong> For secure payment processing</li>
                      <li><strong className="text-white">Clerk:</strong> For authentication and user management</li>
                      <li><strong className="text-white">Convex:</strong> For backend database and real-time functionality</li>
                    </ul>
                    <p className="text-white/70 leading-relaxed mt-4">
                      These third parties have their own privacy policies, and we encourage you to review them.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">4. How We Use Cookies</h2>
                    <p className="text-white/70 leading-relaxed mb-2">We use cookies for the following purposes:</p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>To authenticate users and prevent fraudulent use of accounts</li>
                      <li>To remember your preferences and settings</li>
                      <li>To analyze how you use the Service and improve functionality</li>
                      <li>To provide personalized content and recommendations</li>
                      <li>To measure the effectiveness of our marketing campaigns</li>
                      <li>To ensure the security and proper functioning of the Service</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">5. Managing Cookies</h2>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.1 Browser Settings</h3>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. However, please note that disabling essential cookies may affect the functionality of the Service.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.2 How to Manage Cookies in Common Browsers</h3>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4 mb-4">
                      <li><strong className="text-white">Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                      <li><strong className="text-white">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                      <li><strong className="text-white">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                      <li><strong className="text-white">Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.3 Opt-Out Links</h3>
                    <p className="text-white/70 leading-relaxed mb-4">
                      You can opt out of certain third-party cookies:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li><strong className="text-white">Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#009de0] hover:text-[#00d4ff]">Google Analytics Opt-out Browser Add-on</a></li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">6. Cookie Duration</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Cookies can be "session" cookies or "persistent" cookies:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li><strong className="text-white">Session Cookies:</strong> These are temporary and are deleted when you close your browser</li>
                      <li><strong className="text-white">Persistent Cookies:</strong> These remain on your device until they expire or you delete them. They help us recognize you when you return to the Service</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">7. Updates to This Policy</h2>
                    <p className="text-white/70 leading-relaxed">
                      We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We encourage you to review this page periodically for the latest information on our use of cookies.
                    </p>
                  </section>

                  <section className="mb-0">
                    <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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

