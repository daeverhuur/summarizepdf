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

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15.27 3h2.27l-4.96 5.67L18.5 17h-4.57l-3.58-4.68L6.26 17H3.98l5.31-6.07L3.5 3h4.69l3.23 4.28L15.27 3zm-.8 12.58h1.26L7.57 4.3H6.21l8.26 11.28z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.04 17.04h-2.96v-4.63c0-1.1-.02-2.53-1.54-2.53-1.54 0-1.78 1.2-1.78 2.45v4.71H7.8V7.5h2.84v1.3h.04c.4-.75 1.36-1.54 2.8-1.54 2.99 0 3.54 1.97 3.54 4.53v5.25zM4.45 6.19a1.72 1.72 0 110-3.43 1.72 1.72 0 010 3.43zm1.48 10.85H2.97V7.5h2.96v9.54zM18.52 0H1.48C.66 0 0 .65 0 1.45v17.1C0 19.35.66 20 1.48 20h17.04c.82 0 1.48-.65 1.48-1.45V1.45C20 .65 19.34 0 18.52 0z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/>
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
      { href: '#', label: 'About' },
      { href: '#', label: 'Blog' },
      { href: '#', label: 'Careers' },
      { href: '#', label: 'Contact' },
    ],
    legal: [
      { href: '#', label: 'Privacy Policy' },
      { href: '#', label: 'Terms of Service' },
      { href: '#', label: 'Cookie Policy' },
      { href: '#', label: 'GDPR' },
    ],
  };

  const socialLinks = [
    { href: '#', icon: TwitterIcon, label: 'Twitter' },
    { href: '#', icon: LinkedInIcon, label: 'LinkedIn' },
    { href: '#', icon: GitHubIcon, label: 'GitHub' },
  ];

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
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs">
              AI-powered PDF summarization to boost your productivity. Extract key insights from any document in seconds.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#009de0] hover:border-[#009de0]/50 hover:bg-[#009de0]/10 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
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
