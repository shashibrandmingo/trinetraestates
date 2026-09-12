'use client';

import React from 'react';
import { sectorsList } from '@/data/sampleOffices';

interface QuickSearchBarProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  selectedSector: string;
  onSectorChange: (val: string) => void;
}

export default function QuickSearchBar({
  keyword,
  onKeywordChange,
  selectedSector,
  onSectorChange
}: QuickSearchBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_-6px_rgba(12,26,48,0.08)] border border-slate-200/90 p-3 sm:p-4 transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Sector Quick Dropdown */}
        <div className="w-full sm:w-52 relative flex-shrink-0">
          <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
            Sector Location
          </label>
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-navy-900 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 cursor-pointer"
          >
            {sectorsList.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Instant Keyword Input */}
        <div className="w-full relative flex-grow">
          <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
            Building / Tower / Keyword
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Search by tower name, e.g., 'Corenthum', 'Stellar', 'Furnished'..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 text-navy-900 text-xs sm:text-sm rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => onKeywordChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-navy-900"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
