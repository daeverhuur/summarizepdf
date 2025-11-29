'use client';

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white" />

      {/* Animated accent gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#009de0] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.05] animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#009de0] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.04] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#009de0] rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.03] animate-pulse-slow" />
    </div>
  );
}

