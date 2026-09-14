'use client';

import React from 'react';
import { PropertyKPIStats, PropertyStatus } from '@/types/propertyFilter';

interface PropertyKPIHeaderProps {
  stats: PropertyKPIStats;
  selectedStatus: PropertyStatus | 'All';
  onSelectStatus: (status: PropertyStatus | 'All') => void;
  onAddProperty: () => void;
  onImportExcel: () => void;
  onExportAll: () => void;
}

export default function PropertyKPIHeader({
  stats,
  selectedStatus,
  onSelectStatus,
  onAddProperty,
  onImportExcel,
  onExportAll
}: PropertyKPIHeaderProps) {
  const kpiItems = [
    {
      id: 'All' as const,
      label: 'TOTAL',
      value: stats.total,
      badgeText: 'All Listings',
      activeClass: 'border-navy-900 ring-2 ring-navy-900/20 bg-slate-50/60 shadow-xs',
      inactiveClass: 'border-slate-200 hover:border-slate-300'
    },
    {
      id: 'Active' as const,
      label: 'ACTIVE',
      value: stats.active,
      badgeText: 'Live & Verified',
      activeClass: 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/30 shadow-xs',
      inactiveClass: 'border-emerald-200/80 hover:border-emerald-400'
    },
    {
      id: 'Expiring' as const,
      label: 'EXPIRING',
      value: stats.expiring,
      badgeText: 'Within 14 Days',
      activeClass: 'border-amber-500 ring-2 ring-amber-500/25 bg-amber-50/30 shadow-xs',
      inactiveClass: 'border-amber-200/80 hover:border-amber-400'
    },
    {
      id: 'Expired' as const,
      label: 'EXPIRED',
      value: stats.expired,
      badgeText: 'Needs Renewal',
      activeClass: 'border-rose-500 ring-2 ring-rose-500/25 bg-rose-50/30 shadow-xs',
      inactiveClass: 'border-rose-200/80 hover:border-rose-400'
    },
    {
      id: 'Sold' as const,
      label: 'SOLD',
      value: (stats.sold || 0) + (stats.soldByMe || 0),
      badgeText: 'Closed Deals',
      activeClass: 'border-slate-800 ring-2 ring-slate-800/25 bg-slate-100 shadow-xs',
      inactiveClass: 'border-slate-200 hover:border-slate-400'
    }
  ];

  return (
    <div className="space-y-2.5 w-full max-w-full">
      {/* Title & Action Buttons Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-slate-200/90">
        <div>
          <h1 className="font-heading text-lg sm:text-xl font-bold text-navy-900 tracking-tight leading-snug">
            Properties
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">
            Manage and search all your property listings • Click any card to filter
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export All to Excel / CSV Button */}
          <button
            type="button"
            onClick={onExportAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border border-slate-200/90 bg-white text-navy-900 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
            title="Download all verified commercial properties in Excel (.csv) format"
          >
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export All (Excel)</span>
          </button>

          {/* Bulk Import Excel / CSV Button */}
          <button
            type="button"
            onClick={onImportExcel}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border border-slate-200/90 bg-white text-navy-900 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
            title="Import 1,000 to 40,000 properties from Excel (.xlsx) or CSV"
          >
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Import Excel</span>
          </button>

          {/* Add Property Single Button */}
          <button
            type="button"
            onClick={onAddProperty}
            className="btn-gold px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs w-fit cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* 5 Compact Interactive KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {kpiItems.map((item) => {
          const isSelected = selectedStatus === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectStatus(item.id)}
              className={`rounded-lg border px-2.5 py-1.5 sm:px-3 sm:py-2 text-left transition-all duration-150 cursor-pointer bg-white group relative flex flex-col justify-between ${
                isSelected ? item.activeClass : item.inactiveClass
              }`}
            >
              {/* Row 1: Label & Filter Tag */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                  {item.label}
                </span>
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.2 rounded bg-navy-900 text-white">
                    <span className="w-1 h-1 rounded-full bg-gold-400 animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                    Filter →
                  </span>
                )}
              </div>

              {/* Row 2: Value & Subtitle Inline */}
              <div className="flex items-baseline justify-between gap-1.5 mt-1">
                <div className="font-heading text-base sm:text-lg font-bold text-navy-900 leading-none">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-sans truncate">
                  {item.badgeText}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
