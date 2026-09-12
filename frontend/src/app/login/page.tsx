import React from 'react';
import type { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Operations Login | Noida Office Spaces',
  description: 'Internal corporate login for Noida Office Spaces administration and inventory management.'
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fafbfc] flex flex-col justify-center relative overflow-hidden py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient Luxury Background Auras */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-gold-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-navy-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center relative z-10">
        
        {/* Mobile Header: Visible only on mobile before the login form */}
        <div className="lg:hidden text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-200/80 text-[10.5px] font-semibold tracking-wider text-gold-800 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
            Internal Real Estate Operations
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight leading-snug">
            Manage Prime Commercial <span className="text-gold-gradient">Inventory</span>
          </h1>
        </div>

        {/* Desktop Left Narrative: Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200/80 text-xs font-semibold tracking-wider text-gold-800 uppercase">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
            Internal Real Estate Operations
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
            Manage Prime Commercial <span className="text-gold-gradient">Inventory</span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-lg">
            Dedicated portal for managing client inquiries, sector-wise office availability, verified lease rates, and corporate listings across Sector 62, Sector 132, and Noida Expressway.
          </p>

          {/* Key Metric Badges */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-md">
            <div>
              <div className="font-heading text-xl sm:text-2xl font-bold text-navy-900">50+</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">IT Towers</div>
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl font-bold text-navy-900">Sector 62</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Hub Focus</div>
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl font-bold text-navy-900">100%</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Verified</div>
            </div>
          </div>
        </div>

        {/* Login Form: Displayed right after heading on mobile, right column on desktop */}
        <div className="lg:col-span-6 w-full">
          <AdminLoginForm />
        </div>

        {/* Mobile Narrative & Metrics: Displayed BELOW login form on mobile */}
        <div className="lg:hidden text-center space-y-4 pt-1 max-w-md mx-auto w-full">
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated portal for managing client inquiries, sector-wise office availability, verified lease rates, and corporate listings across Sector 62, Sector 132, and Noida Expressway.
          </p>
          <div className="grid grid-cols-3 gap-2.5 border-t border-slate-200/80 pt-3">
            <div className="p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="font-heading text-base font-bold text-navy-900">50+</div>
              <div className="text-[9.5px] font-medium text-slate-500 uppercase tracking-wider">IT Towers</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="font-heading text-base font-bold text-navy-900">Sector 62</div>
              <div className="text-[9.5px] font-medium text-slate-500 uppercase tracking-wider">Hub Focus</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="font-heading text-base font-bold text-navy-900">100%</div>
              <div className="text-[9.5px] font-medium text-slate-500 uppercase tracking-wider">Verified</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
