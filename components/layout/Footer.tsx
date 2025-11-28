'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Custom brand-aligned icons
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#footer-logo-gradient)" />
    <path d="M8 9h12a1 1 0 011 1v12a1 1 0 01-1 1H8a1 1 0 01-1-1V10a1 1 0 011-1z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 13h8M10 16h6M10 19h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 17l3 3m0-3l-3 3" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="footer-logo-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#009de0" />
        <stop offset="1" stopColor="#00d4ff" />
      </linearGradient>
    </defs>
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/features/pdf-summarization', label: 'PDF Summarization' },
      { href: '/features/chat-with-pdf', label: 'Chat with PDF' },
    ],
    resources: [
      { href: '/features/ai-summarization', label: 'Features' },
      { href: '/use-cases/students', label: 'Use Cases' },
      { href: '/industries/legal-professionals', label: 'For Legal' },
      { href: '/industries/academia-education', label: 'For Academia' },
    ],
    company: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
      { href: '/contact', label: 'Contact' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/cookie-policy', label: 'Cookie Policy' },
      { href: '/gdpr', label: 'GDPR' },
    ],
  };

  return (
    <footer className="relative bg-[#050508] border-t border-white/5">
      {/* Gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#009de0]/50 to-transparent" />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8 md:gap-10 mb-10 md:mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <LogoIcon />
              </motion.div>
              <span className="text-xl font-bold text-white tracking-tight">
                Summarize<span className="text-[#009de0]">PDF</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              AI-powered PDF summarization to boost your productivity. Extract key insights from any document in seconds.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm text-center md:text-left">
            © {currentYear} SummarizePDF. All rights reserved.
          </p>
          <div className="flex items-center justify-center md:justify-end">
            <span className="text-white/20 text-xs">
              Made with{' '}
              <span className="text-[#009de0]">♥</span>
              {' '}for productivity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
