import React from 'react';
import { RecentActivityItem, ActivityType } from '@/types/adminDashboard';

interface RecentActivityCardProps {
  activities: RecentActivityItem[];
}

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'PROPERTY_ADDED':
        return (
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/70 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'NEW_LEAD':
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'PROPERTY_SOLD':
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'PROPERTY_RENEWED':
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/70 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50/90 via-white to-emerald-50/25 rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-emerald-300/80 hover:shadow-xs transition-all duration-200">
      <div>
        {/* Header with Activity Radar Icon */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100/90">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-heading text-sm font-bold text-navy-950">
              Recent Activity
            </h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-sans border border-emerald-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Stream
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-4 px-3 text-center rounded-lg bg-white/80 border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-600 font-sans">No recent activity</p>
            <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">
              System events and new listings will stream here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="group flex items-start justify-between gap-2.5 p-2.5 rounded-lg border border-slate-200/70 bg-white/85 hover:bg-white hover:border-emerald-300/80 hover:shadow-2xs transition-all duration-150"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {getActivityIcon(act.type)}
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-navy-900 font-sans group-hover:text-emerald-900 transition-colors truncate block">
                      {act.title}
                    </span>
                    <p className="text-[10.5px] text-slate-500 font-sans mt-0.5 line-clamp-1">
                      {act.description}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100/90 border border-slate-200/60 px-2 py-0.5 rounded-md shrink-0 font-sans">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2.5 mt-2.5 border-t border-slate-100/90 flex items-center justify-between text-[10.5px] text-slate-400 font-sans px-1">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Auto-synchronized with CRM
        </span>
        <span className="text-slate-400">Real-time</span>
      </div>
    </div>
  );
}
