'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Spaces', href: '#spaces' },
  { label: 'Sectors', href: '#sectors' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(12,26,48,0.08)] py-1'
          : 'bg-white py-1.5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[76px]">
          {/* Brand Logo (Visually large while keeping sleek navbar height) */}
          <Link href="/" className="flex items-center group h-full">
            <div className="relative h-16 w-20 sm:h-20 sm:w-28 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/brand-logo.png"
                alt="Noida Office Spaces"
                fill
                sizes="(max-width: 640px) 80px, 112px"
                className="object-contain object-left scale-125 sm:scale-130 origin-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-navy-800 hover:text-gold-600 transition-colors duration-200 tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Admin Portal Quick Link */}
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider text-navy-800 hover:text-gold-600 px-3 py-2 transition-colors flex items-center gap-1.5"
              title="Admin Portal Login"
            >
              <svg
                className="w-3.5 h-3.5 text-gold-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Admin</span>
            </Link>

            {/* Talk to Our Expert Button */}
            <a
              href="tel:+919999999999"
              className="btn-gold text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 tracking-wide"
            >
              <span>Talk to Our Expert</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="text-navy-900 p-2 hover:text-gold-600"
              title="Admin Login"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gold-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-navy-900 hover:text-gold-600 py-1 border-b border-slate-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href="tel:+919999999999"
              className="btn-gold text-center text-sm font-semibold py-3 rounded-full tracking-wide shadow-md"
            >
              Talk to Our Expert →
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs font-semibold uppercase tracking-wider text-navy-700 py-2 hover:text-gold-600"
            >
              Admin Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
