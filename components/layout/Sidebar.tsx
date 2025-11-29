'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Upload, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-[calc(100vh-90px)] sticky top-[90px]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
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
    </aside>
  );
}
