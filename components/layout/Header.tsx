'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// Custom brand-aligned icons
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
    <path d="M8 9h12a1 1 0 011 1v12a1 1 0 01-1 1H8a1 1 0 01-1-1V10a1 1 0 011-1z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 13h8M10 16h6M10 19h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 17l3 3m0-3l-3 3" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#009de0" />
        <stop offset="1" stopColor="#00d4ff" />
      </linearGradient>
    </defs>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

export function Header() {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<'transparent' | 'dark' | 'light'>('transparent');
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const { scrollY } = useScroll();
  
  // Dynamic background based on theme and scroll
  const backgroundOpacity = useTransform(
    scrollY, 
    [0, 80], 
    headerTheme === 'transparent' ? [0, 0] : [0, 0.95]
  );
  const darkBackground = useMotionTemplate`rgba(5, 5, 8, ${backgroundOpacity})`;
  const lightBackground = useMotionTemplate`rgba(255, 255, 255, ${backgroundOpacity})`;

  useEffect(() => {
    if (!isHomePage) {
      setHeaderTheme('light');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerHeight = 96; // Approximate header height

      // At the very top - transparent
      if (scrollPosition < 50) {
        setHeaderTheme('transparent');
        return;
      }

      // Find all sections with theme data attributes
      const allSections = document.querySelectorAll('[data-header-theme]');
      
      // Default to light theme (for pages without sections or white backgrounds)
      let currentTheme: 'transparent' | 'dark' | 'light' = 'light';
      let closestSection: Element | null = null;
      let closestDistance = Infinity;

      // Find the section that is currently behind the header
      // We want the section whose top edge is closest to the top of the viewport
      // but still above the header (rect.top <= headerHeight)
      for (const section of Array.from(allSections)) {
        const rect = section.getBoundingClientRect();
        
        // If the section overlaps with the header area
        if (rect.top <= headerHeight && rect.bottom > 0) {
          // Calculate how far the section top is from the viewport top
          const distance = Math.abs(rect.top);
          
          // If this section is closer to the top than our current closest
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
          }
        }
      }

      // If we found a section, use its theme
      if (closestSection) {
        const theme = closestSection.getAttribute('data-header-theme') as 'dark' | 'light';
        currentTheme = theme;
      }

      setHeaderTheme(currentTheme);
    };

    handleScroll(); // Call once on mount to set initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHomePage]);

  const navLinks = [
    { href: '#features', label: 'Features', sectionId: 'features' },
    { href: '#pricing', label: 'Pricing', sectionId: 'pricing' },
  ];

  const scrollToSection = useCallback((sectionId: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('header')?.clientHeight ?? 96;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior,
      });
    }
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (pathname === '/') {
      // Already on home page, just scroll
      scrollToSection(sectionId);
    } else {
      // Navigate to home page with hash
      router.push(`/#${sectionId}`);
    }
  }, [pathname, router, scrollToSection]);

  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const sectionId = window.location.hash.replace('#', '');
      setTimeout(() => {
        scrollToSection(sectionId, 'auto');
      }, 150);
    }
  }, [pathname, scrollToSection]);

  const shouldUseDarkTheme = headerTheme === 'dark' || headerTheme === 'transparent';
  const shouldShowBackground = headerTheme !== 'transparent';
  const headerBackground = shouldUseDarkTheme ? darkBackground : lightBackground;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      className="fixed w-full top-0 z-50 border-b transition-colors duration-300 pt-4"
      style={{
        background: shouldShowBackground ? headerBackground : 'transparent',
        borderColor: shouldShowBackground
          ? shouldUseDarkTheme
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(15,23,42,0.08)'
          : 'transparent',
        backdropFilter: shouldShowBackground ? 'blur(18px)' : 'none',
      }}
    >
      <nav className="container-custom py-5 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 z-10">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <LogoIcon />
            </motion.div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              shouldUseDarkTheme ? 'text-white' : 'text-slate-900'
            }`}>
              Summarize<span className="text-[#009de0]">PDF</span>
            </span>
          </Link>

          {/* Desktop Navigation - Absolutely Centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.sectionId)}
                className={`font-medium transition-colors relative group cursor-pointer py-2 ${
                  shouldUseDarkTheme
                    ? 'text-white/70 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#009de0] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            {isSignedIn && (
              <Link
                href="/dashboard"
                className={`font-medium transition-colors relative group py-2 ${
                  shouldUseDarkTheme
                    ? 'text-white/70 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Dashboard
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#009de0] group-hover:w-full transition-all duration-300" />
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0 z-10">
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10 border-2 border-[#009de0]/50 hover:border-[#009de0] transition-colors',
                  }
                }}
              />
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="primary" size="sm">
                    Start Free
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-lg transition-all flex-shrink-0 ${
              shouldUseDarkTheme
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {mounted && createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                style={{ top: 0 }}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`md:hidden mt-4 pt-4 border-t overflow-hidden relative z-50 ${
                  shouldUseDarkTheme ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col gap-2 pb-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => {
                          handleNavClick(e, link.sectionId);
                          setMobileMenuOpen(false);
                        }}
                        className={`font-medium text-base block py-3 px-4 rounded-xl cursor-pointer transition-all ${
                          shouldUseDarkTheme
                            ? 'text-white/80 hover:text-white hover:bg-white/10 active:bg-white/15'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200'
                        }`}
                      >
                        {link.label}
                      </a>
                    </motion.div>
                  ))}
                  {isSignedIn ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          href="/dashboard"
                          className={`font-medium text-base block py-3 px-4 rounded-xl transition-all ${
                            shouldUseDarkTheme
                              ? 'text-white/80 hover:text-white hover:bg-white/10 active:bg-white/15'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="px-4 pt-2"
                      >
                        <div className={`py-2 px-4 rounded-xl border ${
                          shouldUseDarkTheme ? 'border-white/20' : 'border-slate-200'
                        }`}>
                          <UserButton afterSignOutUrl="/" />
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div 
                      className="flex flex-col gap-3 pt-4 border-t"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        borderColor: shouldUseDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'
                      }}
                    >
                      <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="secondary" 
                          className="w-full font-medium"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="primary" 
                          className="w-full font-medium"
                        >
                          Start Free
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
