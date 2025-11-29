'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Upload, CreditCard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
];

export function MobileDashboardNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Get current page title based on pathname
  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-[90px] left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          {currentPage?.label || 'Dashboard'}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 top-[90px]"
            />

            {/* Slide-over Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed left-0 top-[90px] bottom-0 w-64 bg-slate-50 border-r border-slate-200 z-50 overflow-y-auto"
            >
              <nav className="p-4 space-y-2">
                <div className="px-4 pb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Navigation
                  </p>
                </div>

                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#009de0]/20 to-[#00d4ff]/10 text-[#009de0] font-semibold border border-[#009de0]/30'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-14" />
    </>
  );
}
