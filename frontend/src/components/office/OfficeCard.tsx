import React from 'react';
import { OfficeCardData } from '@/types/office';

interface OfficeCardProps {
  office: OfficeCardData;
}

export default function OfficeCard({ office }: OfficeCardProps) {
  const approxRentInLakh = ((office.areaSqFt * office.rentPerSqFt) / 100000).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-gold-400/80 shadow-sm hover:shadow-[0_12px_30px_-6px_rgba(12,26,48,0.12)] transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Card Header & Badges */}
      <div className="p-6 pb-4 flex-grow">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold-50 border border-gold-200 text-gold-800">
            {office.sector}
          </span>
          {office.isFeatured && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-navy-900 text-white">
              Featured
            </span>
          )}
        </div>

        <h3 className="font-heading text-lg sm:text-xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors leading-snug">
          {office.title}
        </h3>

        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{office.metroDistance}</span>
        </p>

        {/* Specifications Box */}
        <div className="grid grid-cols-2 gap-3 mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Super Area</span>
            <span className="font-semibold text-navy-900">{office.areaSqFt.toLocaleString()} Sq. Ft.</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Rent Rate</span>
            <span className="font-semibold text-gold-600">₹{office.rentPerSqFt} / Sq. Ft.</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-200/50">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Configuration</span>
            <span className="font-medium text-slate-700 truncate block">{office.furnishing}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Approx Rent</span>
          <span className="font-heading text-sm sm:text-base font-bold text-navy-900">
            ₹{approxRentInLakh} Lakh / mo
          </span>
        </div>

        <a
          href="tel:+919999999999"
          className="btn-gold text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 shadow-sm"
        >
          <span>Enquire</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
