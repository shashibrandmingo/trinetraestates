'use client';

import React from 'react';
import { RecentPropertyItem } from '@/types/adminDashboard';

interface RecentPropertiesCardProps {
  properties: RecentPropertyItem[];
  onViewAll?: () => void;
  onSelectProperty?: (property: RecentPropertyItem) => void;
}

// Cleans up repetitive "(Copy) (Copy)..." in titles so it looks clean and executive
const cleanTowerName = (title: string): string => {
  if (!title) return 'Commercial Office Space';
  const copyMatches = title.match(/\(Copy\)/gi);
  if (copyMatches && copyMatches.length > 1) {
    return title.replace(/(\s*\(Copy\))+/gi, ` (v${copyMatches.length})`).trim();
  }
  return title.trim();
};

export default function RecentPropertiesCard({
  properties,
  onViewAll,
  onSelectProperty
}: RecentPropertiesCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50/90 via-white to-blue-50/30 rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-blue-300/80 hover:shadow-xs transition-all duration-200">
      <div>
        {/* Header with Luxury Icon & Badge */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100/90">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-100/80 border border-blue-200/80 flex items-center justify-center text-blue-700 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="font-heading text-sm font-bold text-navy-950">
              Recent Properties
            </h2>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50/90 px-2.5 py-0.5 rounded-full border border-blue-200/70 font-sans flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            NCR Inventory
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="py-4 px-3 text-center rounded-lg bg-white/80 border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-600 font-sans">No properties listed yet</p>
            <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">
              Click &quot;+ Add Property&quot; to create the first listing
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {properties.slice(0, 5).map((prop) => {
              const displayName = cleanTowerName(prop.towerName);
              const sectorOrCity = prop.sector && prop.sector !== 'Noida' ? prop.sector : prop.city || 'Noida';

              return (
                <div
                  key={prop.id}
                  title={prop.towerName}
                  onClick={() => (onSelectProperty ? onSelectProperty(prop) : onViewAll?.())}
                  className="group flex items-center justify-between p-2.5 rounded-lg border border-slate-200/70 bg-white/85 hover:bg-blue-50/50 hover:border-blue-300 hover:shadow-xs transition-all duration-150 gap-2.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Property Icon */}
                    <div className="w-7 h-7 rounded-lg bg-slate-100/90 text-navy-800 group-hover:bg-blue-600 group-hover:text-white border border-slate-200/60 flex items-center justify-center shrink-0 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h.01M9 15h.01M15 11h.01M15 15h.01" />
                      </svg>
                    </div>

                    {/* Title and Specs */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-navy-900 font-sans truncate max-w-[200px] sm:max-w-[260px] group-hover:text-blue-700 transition-colors">
                        {displayName}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-sans mt-0.5">
                        <span>{prop.areaSqFt ? prop.areaSqFt.toLocaleString() : '0'} Sq. Ft.</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">
                          ₹{prop.rentPerSqFt || 0}/sq.ft
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location / Sector Badge + Navigation Arrow */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-navy-50/80 text-navy-900 border border-navy-150/70 font-sans flex items-center gap-1 group-hover:bg-blue-100 group-hover:text-blue-900 group-hover:border-blue-200 transition-colors">
                      <svg className="w-2.5 h-2.5 text-navy-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {sectorOrCity}
                    </span>
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="pt-2.5 mt-2.5 border-t border-slate-100/90">
        <button
          type="button"
          onClick={onViewAll}
          className="group w-full text-center py-1.5 text-xs font-semibold text-navy-900 hover:text-blue-700 transition-all border border-slate-200/90 hover:border-blue-300 rounded-lg bg-white hover:bg-blue-50/40 font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>View All Properties</span>
          <svg
            className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
