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
    <footer className="relative bg-white border-t border-slate-200">
      {/* Enhanced gradient accent with border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#009de0]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#009de0]/60 to-transparent" />

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
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Summarize<span className="text-[#009de0]">PDF</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              AI-powered PDF summarization to boost your productivity. Extract key insights from any document in seconds.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-[#009de0] text-sm transition-all duration-200 inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-[#009de0] group-hover:w-full transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-[#009de0] text-sm transition-all duration-200 inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-[#009de0] group-hover:w-full transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-[#009de0] text-sm transition-all duration-200 inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-[#009de0] group-hover:w-full transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-[#009de0] text-sm transition-all duration-200 inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-[#009de0] group-hover:w-full transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {currentYear} SummarizePDF. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#009de0] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#009de0] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#009de0] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
            <span className="text-slate-400 text-xs hidden md:inline">
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
