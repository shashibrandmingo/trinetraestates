import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white pt-14 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden flex-shrink-0 bg-white/10 rounded-lg p-1">
                <Image
                  src="/brand-logo.png"
                  alt="Noida Office Spaces"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-wider text-white">
                  NOIDA
                </span>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-gold-400 uppercase">
                  Office Spaces
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Noida&apos;s premier commercial leasing consultancy providing verified corporate office spaces, IT parks, and tech hubs across Sector 62 and Noida Expressway.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Top Sectors
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link href="#spaces" className="hover:text-gold-400 transition-colors">Sector 62 (IT Hub)</Link></li>
              <li><Link href="#spaces" className="hover:text-gold-400 transition-colors">Sector 132 (Expressway)</Link></li>
              <li><Link href="#spaces" className="hover:text-gold-400 transition-colors">Sector 16 (Film City)</Link></li>
              <li><Link href="#spaces" className="hover:text-gold-400 transition-colors">Sector 125 & 126</Link></li>
            </ul>
          </div>

          {/* Internal Access */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Authorized Portal
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Internal inventory & client requirements management:
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-navy-900 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-white transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Admin Login Portal</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Noida Office Spaces. All rights reserved.</p>
          <p className="text-slate-400">
            Work • Grow • Belong
          </p>
        </div>
      </div>
    </footer>
  );
}
