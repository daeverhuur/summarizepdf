'use client';

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />
      
      {/* Animated accent gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#009de0] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#009de0] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#009de0] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse-slow" />
    </div>
  );
}

