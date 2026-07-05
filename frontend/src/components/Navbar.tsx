'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useAppAuth as useAuth, AppUserButton as UserButton, AppSignInButton as SignInButton, AppSignUpButton as SignUpButton } from '@/lib/auth';
import { PremiumButton } from '@/components/ui-custom';
import { Menu, X } from 'lucide-react';

/**
 * Navbar — Persistent, scroll-aware navigation bar with glassmorphism
 * that becomes more opaque as the user scrolls. Includes mobile hamburger menu.
 */
export default function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it Works' },
    { href: '#match-cluster', label: 'Match Cluster' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2">
      <motion.div
        className="max-w-6xl mx-auto rounded-2xl px-6 py-3.5 flex items-center justify-between border border-white/30 transition-colors duration-500"
        animate={{
          backgroundColor: scrolled
            ? 'rgba(255, 255, 255, 0.62)'
            : 'rgba(255, 255, 255, 0.35)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(31, 38, 135, 0.12)'
            : '0 4px 16px rgba(31, 38, 135, 0.06)',
        }}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/25 text-sm"
          >
            C
          </motion.div>
          <span className="font-semibold text-xl tracking-tight">
            Connect<span className="text-primary font-bold">AI</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-foreground/75 hover:text-primary transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoaded && !isSignedIn && (
            <>
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:text-primary transition-colors cursor-pointer px-3 py-1.5">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <PremiumButton className="!px-5 !py-2 !text-sm cursor-pointer">
                  Get Started
                </PremiumButton>
              </SignUpButton>
            </>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link href="/dashboard">
                <PremiumButton className="!px-5 !py-2 !text-sm">
                  Dashboard
                </PremiumButton>
              </Link>
              <UserButton />
            </>
          )}
          {!isLoaded && <div className="w-20 h-8 rounded-full bg-foreground/5 animate-pulse" />}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-white/20 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mt-2 max-w-6xl mx-auto rounded-2xl p-6 flex flex-col gap-4 border border-white/30"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2 border-b border-foreground/5 last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-primary cursor-pointer py-2">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <PremiumButton className="w-full !text-sm cursor-pointer">
                    Get Started
                  </PremiumButton>
                </SignUpButton>
              </>
            )}
            {isLoaded && isSignedIn && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <PremiumButton className="w-full !text-sm">
                  Dashboard
                </PremiumButton>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
