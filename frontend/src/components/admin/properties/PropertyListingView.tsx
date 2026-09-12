'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PropertyItem } from '@/types/propertyFilter';
import { AdminPropertyCard } from './AdminPropertyCard';
import { AdminPropertyTableView } from './AdminPropertyTableView';

interface PropertyListingViewProps {
  properties: PropertyItem[];
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onViewDetails: (property: PropertyItem) => void;
  onEditProperty?: (property: PropertyItem) => void;
  onDuplicateProperty?: (property: PropertyItem) => void;
  onStatusChange?: (property: PropertyItem, newStatus: PropertyItem['status'], dealData?: any) => Promise<void> | void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rentAsc', label: 'Rent: Low to High' },
  { value: 'rentDesc', label: 'Rent: High to Low' },
  { value: 'areaDesc', label: 'Area: Largest First' },
  { value: 'expiryAsc', label: 'Expiring Soonest' },
];

export const PropertyListingView: React.FC<PropertyListingViewProps> = ({
  properties,
  totalCount,
  sortBy,
  onSortChange,
  onViewDetails,
  onEditProperty,
  onDuplicateProperty,
  onStatusChange,
  hasMore = false,
  isLoadingMore = false,
  isLoading = false,
  onLoadMore,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-trigger next 20 items on scroll near bottom
  useEffect(() => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '250px' } // Pre-fetch 250px before bottom
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="flex-1 min-w-0 w-full max-w-full space-y-4">
      {/* Top Bar: Count & View Mode Toggle & Sort */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Showing</span>
          <span className="text-sm font-bold text-navy-950 font-heading">
            {properties.length}
          </span>
          <span className="text-xs text-slate-400">of</span>
          <span className="text-sm font-bold text-navy-950 font-heading">
            {totalCount.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-slate-500">properties</span>
          {hasMore && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ml-1">
              ⚡ Auto-loads 20 on scroll
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher: Table / List vs Grid Cards */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-navy-950 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
              title="Table View (List all data in single view)"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-navy-950 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
              title="Grid Card View"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Cards</span>
            </button>
          </div>

          {/* Custom Luxury Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Sort by:
            </span>
            <div ref={sortDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`text-xs font-semibold text-navy-900 bg-white border rounded-lg px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 ${
                  isSortOpen
                    ? 'border-gold-500 ring-2 ring-gold-100 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title="Change sort order"
              >
                <span className="whitespace-nowrap">{sortOptions.find((o) => o.value === sortBy)?.label || 'Newest First'}</span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isSortOpen ? 'rotate-180 text-gold-600' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Custom Luxury Dropdown Menu */}
              {isSortOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-150">
                  {sortOptions.map((option) => {
                    const isSelected = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onSortChange(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gold-50 text-gold-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-navy-950'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {isLoading ? (
        viewMode === 'table' ? (
          <AdminPropertyTableView
            properties={[]}
            onViewDetails={onViewDetails}
            isLoading={true}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-white border border-slate-200/80 p-4 space-y-3 animate-pulse shadow-sm">
                <div className="w-full h-36 rounded-lg bg-slate-200 skeleton-shimmer" />
                <div className="w-3/4 h-4 rounded bg-slate-200 skeleton-shimmer" />
                <div className="w-1/2 h-3 rounded bg-slate-150 skeleton-shimmer" />
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <div className="w-20 h-3 rounded bg-slate-200 skeleton-shimmer" />
                  <div className="w-16 h-3 rounded bg-slate-200 skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-navy-950 font-heading">No properties found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your filters or search keywords to find the commercial spaces you are looking for.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <AdminPropertyTableView
          properties={properties}
          onViewDetails={onViewDetails}
          onEditProperty={onEditProperty}
          onDuplicateProperty={onDuplicateProperty}
          onStatusChange={onStatusChange}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {properties.map((item) => (
            <AdminPropertyCard
              key={item.id}
              property={item}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel Trigger */}
      <div ref={sentinelRef} className="h-2 w-full pointer-events-none" />

      {/* Infinite Scroll Status / Loading / Manual Load More Button */}
      {isLoadingMore ? (
        <div className="py-4 px-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center gap-2.5 text-xs text-slate-600 font-semibold">
          <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Loading next 20 properties from database...</span>
        </div>
      ) : hasMore ? (
        <div className="py-3.5 px-4 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Loaded <strong className="text-navy-950">{properties.length}</strong> of <strong className="text-navy-950">{totalCount.toLocaleString()}</strong> properties
          </span>
          {onLoadMore && (
            <button
              type="button"
              onClick={onLoadMore}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-navy-950 hover:border-gold-500 hover:text-gold-600 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Load Next 20 More</span>
              <span>↓</span>
            </button>
          )}
        </div>
      ) : properties.length > 0 ? (
        <div className="py-3 text-center text-xs text-slate-400 font-medium">
          ✓ All {totalCount.toLocaleString()} verified properties loaded
        </div>
      ) : null}
    </div>
  );
};
