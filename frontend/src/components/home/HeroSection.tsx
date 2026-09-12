import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="pt-28 pb-14 sm:pt-32 sm:pb-20 bg-gradient-to-b from-[#fafbfc] via-white to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-50 border border-gold-200/90 text-xs font-semibold tracking-wider text-gold-800 uppercase mb-5">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
          Verified Corporate Leasing in Noida
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Find Your Ideal Corporate <br className="hidden sm:inline" />
          <span className="text-gold-gradient">Office Space</span> in Noida
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Direct access to prime Grade-A IT parks, furnished commercial towers, and executive business spaces across Noida Sector 62, Sector 132, and the Expressway.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+919999999999"
            className="btn-gold px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide shadow-md w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <span>Talk to Our Expert</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <Link
            href="/login"
            className="px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide border border-slate-200 text-navy-900 hover:border-gold-500 hover:text-gold-600 transition-colors w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Internal Admin Portal</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
