'use client';

import React from 'react';
import { LeadItem, LeadStatus } from '@/types/adminDashboard';

interface RecentLeadsCardProps {
  leads: LeadItem[];
  onViewAll?: () => void;
}

export default function RecentLeadsCard({ leads, onViewAll }: RecentLeadsCardProps) {
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'Hot':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Warm':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Cold':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50/90 via-white to-amber-50/25 rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-amber-300/80 hover:shadow-xs transition-all duration-200">
      <div>
        {/* Header with Luxury Icon & Badge */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100/90">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-100/80 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="font-heading text-sm font-bold text-navy-950">
              Recent Leads
            </h2>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50/90 px-2.5 py-0.5 rounded-full border border-amber-200/70 font-sans">
            Live Enquiries
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="py-4 px-3 text-center rounded-lg bg-white/80 border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-600 font-sans">No new leads yet</p>
            <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">
              Enquiries from visitors will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="group flex items-center justify-between p-2.5 rounded-lg border border-slate-200/70 bg-white/85 hover:bg-white hover:border-amber-300/80 hover:shadow-2xs transition-all duration-150 gap-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-navy-900 font-sans truncate group-hover:text-amber-900 transition-colors">
                      {lead.companyName}
                    </div>
                    <div className="text-[10.5px] text-slate-500 font-sans mt-0.5 truncate">
                      {lead.requirementSqFt.toLocaleString()} Sq. Ft. • {lead.preferredSector}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 font-sans ${getStatusBadge(
                    lead.status
                  )}`}
                >
                  {lead.status === 'Hot' ? '🔥 Hot' : lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="pt-2.5 mt-2.5 border-t border-slate-100/90">
        <button
          type="button"
          onClick={onViewAll}
          className="group w-full text-center py-1.5 text-xs font-semibold text-navy-900 hover:text-amber-700 transition-all border border-slate-200/90 hover:border-amber-300 rounded-lg bg-white hover:bg-amber-50/40 font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>View All Leads</span>
          <svg
            className="w-3 h-3 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all"
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
