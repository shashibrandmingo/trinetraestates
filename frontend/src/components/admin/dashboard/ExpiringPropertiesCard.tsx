'use client';

import React from 'react';
import { ExpiringPropertyItem } from '@/types/adminDashboard';

interface ExpiringPropertiesCardProps {
  properties: ExpiringPropertyItem[];
  onViewProperties?: () => void;
  onSelectProperty?: (property: ExpiringPropertyItem) => void;
}

export default function ExpiringPropertiesCard({
  properties,
  onViewProperties,
  onSelectProperty
}: ExpiringPropertiesCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-rose-300/80 hover:shadow-xs transition-all duration-200">
      <div>
        {/* Header with Luxury Icon & Badge */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100/90">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-100/80 border border-rose-200/80 flex items-center justify-center text-rose-700 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-heading text-sm font-bold text-navy-950">
              Expiring Soon
            </h2>
          </div>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50/90 px-2.5 py-0.5 rounded-full border border-rose-200/70 font-sans">
            Immediate Action
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="py-4 px-3 text-center rounded-lg bg-white border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-600 font-sans">No leases expiring soon</p>
            <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">
              Properties expiring within 15 days will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {properties.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => (onSelectProperty ? onSelectProperty(item) : onViewProperties?.())}
                className="group flex items-center justify-between p-2.5 rounded-lg border border-slate-200/70 bg-white hover:bg-rose-50/50 hover:border-rose-300 hover:shadow-xs transition-all duration-150 gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-navy-900 font-sans truncate group-hover:text-rose-700 transition-colors">
                      {item.towerName}
                    </div>
                    <div className="text-[10.5px] text-slate-500 font-sans mt-0.5 truncate">
                      {item.tenantName} • {item.sector}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 font-sans ${
                      item.daysRemaining <= 2
                        ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                        : item.daysRemaining <= 5
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-gold-50 text-gold-800 border-gold-300'
                    }`}
                  >
                    {item.daysRemaining} Days
                  </span>
                  <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="pt-2.5 mt-2.5 border-t border-slate-100/90">
        <button
          type="button"
          onClick={onViewProperties}
          className="group w-full text-center py-1.5 text-xs font-semibold text-navy-900 hover:text-rose-700 transition-all border border-slate-200/90 hover:border-rose-300 rounded-lg bg-white hover:bg-rose-50/40 font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>View Expiring Properties</span>
          <svg
            className="w-3 h-3 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all"
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
