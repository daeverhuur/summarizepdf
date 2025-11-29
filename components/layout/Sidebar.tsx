'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Upload, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-slate-50 border-r border-slate-200 h-[calc(100vh-90px)] sticky top-[90px] transition-all duration-300 hidden md:block`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-3 border-b border-slate-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-600"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Section Divider */}
      {!isCollapsed && (
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
        </div>
      )}

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                className={`group flex items-center ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } px-4 py-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#009de0]/20 to-[#00d4ff]/10 text-[#009de0] font-semibold border border-[#009de0]/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
