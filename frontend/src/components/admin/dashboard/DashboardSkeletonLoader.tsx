'use client';

import React from 'react';
import Image from 'next/image';

export default function DashboardSkeletonLoader() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient Luxury Background Auras */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gold-200/25 blur-3xl pointer-events-none" />

      {/* Main Centered Loader Box */}
      <div className="flex flex-col items-center justify-center relative z-10 animate-fade-in">
        {/* Animated Circular Rotating Ring around Brand Logo */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-5">
          {/* Outer Rotating Circular Spinner Ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-200/80 border-t-gold-500 border-r-gold-400 animate-spin" />

          {/* Secondary Soft Pulse Ring */}
          <div className="absolute -inset-2 rounded-full border border-gold-300/30 animate-ping opacity-25" />

          {/* Centered Brand Logo Box */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-2.5 shadow-md border border-gold-200/90 flex items-center justify-center relative z-10 ring-4 ring-gold-50/70">
            <div className="relative w-full h-full">
              <Image
                src="/brand-logo.png"
                alt="Noida Office Spaces"
                fill
                sizes="72px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Brand Name & Clean Loading Status */}
        <div className="text-center space-y-1.5">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-navy-950 tracking-tight">
            Noida Office Spaces
          </h2>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-50/90 border border-gold-200/80 text-[11px] font-semibold text-gold-800 shadow-2xs font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span>Loading Inventory...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
