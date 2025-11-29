'use client';

import dynamic from 'next/dynamic';
import { Header } from './Header';
import { Footer } from './Footer';
import type { ReactNode } from 'react';

const ParticleBackground = dynamic(
  () => import('@/components/home/ParticleBackground'),
  { ssr: false }
);

type AppShellProps = {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showParticleBackground?: boolean;
  mainClassName?: string;
};

export function AppShell({
  children,
  showHeader = true,
  showFooter = true,
  showParticleBackground = true,
  mainClassName = '',
}: AppShellProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-[-20%] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#009de0]/[0.06] blur-[160px]"
        />
        <div
          className="absolute right-[-10%] bottom-[-5%] h-[500px] w-[500px] rounded-full bg-[#7c3aed]/[0.05] blur-[160px]"
        />
        <div
          className="absolute left-[-10%] bottom-0 h-[450px] w-[450px] rounded-full bg-[#00d4ff]/[0.05] blur-[160px]"
        />
      </div>

      {showParticleBackground && (
        <div className="pointer-events-none absolute inset-0 opacity-30 overflow-hidden">
          <ParticleBackground />
        </div>
      )}

      {showHeader && (
        <div className="relative z-20">
          <Header />
        </div>
      )}

      <main className={`relative z-10 ${mainClassName}`}>{children}</main>

      {showFooter && (
        <div className="relative z-20">
          <Footer />
        </div>
      )}
    </div>
  );
}
