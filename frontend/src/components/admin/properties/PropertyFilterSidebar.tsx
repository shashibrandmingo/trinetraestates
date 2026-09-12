'use client';

import React from 'react';
import { PropertyFilterState, PropertyType, PropertyPurpose, PropertyStatus } from '@/types/propertyFilter';
import { RoundedSelect } from '@/components/common/RoundedSelect';

interface PropertyFilterSidebarProps {
  filters: PropertyFilterState;
  onFilterChange: (updated: Partial<PropertyFilterState>) => void;
  onResetFilters: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function PropertyFilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  onClose,
  isMobile = false
}: PropertyFilterSidebarProps) {
  const propertyTypeOptions: PropertyType[] = ['Office', 'Shop', 'Warehouse', 'Land'];
  const purposeOptions: (PropertyPurpose | 'All')[] = ['All', 'Rent', 'Sale', 'Lease'];
  const statusOptions: PropertyStatus[] = ['Active', 'Expired', 'Sold'];

  const togglePropertyType = (type: PropertyType) => {
    const exists = filters.propertyTypes.includes(type);
    const updated = exists
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type];
    onFilterChange({ propertyTypes: updated });
  };

  const toggleStatus = (status: PropertyStatus) => {
    const exists = filters.statuses.includes(status);
    const updated = exists
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ statuses: updated });
  };

  return (
    <aside
      className={
        isMobile
          ? 'w-full space-y-4 text-xs text-navy-900 font-sans pb-2'
          : 'w-full lg:w-64 bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-4 flex-shrink-0 text-xs text-navy-900 font-sans lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar'
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <h2 className="font-heading text-xs sm:text-sm font-bold text-navy-900 uppercase tracking-wider">
          Filters
        </h2>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-gold-600 hover:text-gold-700 underline cursor-pointer"
          >
            Reset All
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Location
        </label>
        <RoundedSelect
          value={filters.city}
          onChange={(val) => onFilterChange({ city: val })}
          options={['All Cities', 'Noida', 'Gurgaon', 'Delhi']}
        />

        <input
          type="text"
          placeholder="Locality / Sector..."
          value={filters.locality}
          onChange={(e) => onFilterChange({ locality: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
        />
      </div>

      {/* Property Type */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Property Type
        </label>
        <div className="space-y-1">
          {propertyTypeOptions.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer text-slate-700 select-none py-0.5">
              <input
                type="checkbox"
                checked={filters.propertyTypes.includes(type)}
                onChange={() => togglePropertyType(type)}
                className="w-3.5 h-3.5 rounded text-gold-600 focus:ring-gold-500 border-slate-300 cursor-pointer"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Purpose
        </label>
        <div className="flex flex-wrap gap-1">
          {purposeOptions.map((pur) => (
            <button
              key={pur}
              type="button"
              onClick={() => onFilterChange({ purpose: pur })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                filters.purpose === pur
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {pur}
            </button>
          ))}
        </div>
      </div>

      {/* Area Range */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Area (Sq. Ft.)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minArea}
            onChange={(e) => onFilterChange({ minArea: e.target.value })}
            className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
          <span className="text-slate-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxArea}
            onChange={(e) => onFilterChange({ maxArea: e.target.value })}
            className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Budget (₹ Lakh / mo)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minBudget}
            onChange={(e) => onFilterChange({ minBudget: e.target.value })}
            className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
          <span className="text-slate-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxBudget}
            onChange={(e) => onFilterChange({ maxBudget: e.target.value })}
            className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Furnishing */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Furnishing
        </label>
        <RoundedSelect
          value={filters.furnishing}
          onChange={(val) => onFilterChange({ furnishing: val })}
          options={['All', 'Fully Furnished', 'Semi-Furnished', 'Bare Shell', 'Plug & Play']}
        />
      </div>

      {/* Parking & Floor */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
          <input
            type="checkbox"
            checked={filters.parkingRequired}
            onChange={(e) => onFilterChange({ parkingRequired: e.target.checked })}
            className="w-3.5 h-3.5 rounded text-gold-600 focus:ring-gold-500 border-slate-300 cursor-pointer"
          />
          <span className="font-semibold text-[11px]">Parking Required</span>
        </label>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Floor
          </label>
          <RoundedSelect
            value={filters.floor}
            onChange={(val) => onFilterChange({ floor: val })}
            options={['All', 'Ground Floor', 'Middle Floor', 'High Floor', 'Top Floor']}
          />
        </div>
      </div>


      {/* Status */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Status
        </label>
        <div className="space-y-1">
          {statusOptions.map((st) => (
            <label key={st} className="flex items-center gap-2 cursor-pointer text-slate-700 select-none py-0.5">
              <input
                type="checkbox"
                checked={filters.statuses.includes(st)}
                onChange={() => toggleStatus(st)}
                className="w-3.5 h-3.5 rounded text-gold-600 focus:ring-gold-500 border-slate-300 cursor-pointer"
              />
              <span>{st}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button (Desktop only, mobile has sticky footer) */}
      {!isMobile && (
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
          >
            [ Reset Filters ]
          </button>
        </div>
      )}
    </aside>
  );
}
