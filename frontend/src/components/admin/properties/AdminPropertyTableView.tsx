'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PropertyItem } from '@/types/propertyFilter';
import { RecordSaleModal } from './RecordSaleModal';

interface AdminPropertyTableViewProps {
  properties: PropertyItem[];
  onViewDetails: (property: PropertyItem) => void;
  onEditProperty?: (property: PropertyItem) => void;
  onDuplicateProperty?: (property: PropertyItem) => void;
  onDeleteProperty?: (property: PropertyItem) => void;
  onRenewProperty?: (property: PropertyItem) => void;
  onStatusChange?: (property: PropertyItem, newStatus: PropertyItem['status'], dealData?: any) => Promise<void> | void;
  isLoading?: boolean;
}

export const AdminPropertyTableView: React.FC<AdminPropertyTableViewProps> = ({
  properties,
  onViewDetails,
  onEditProperty,
  onDuplicateProperty,
  onDeleteProperty,
  onRenewProperty,
  onStatusChange,
  isLoading
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeStatusMenuId, setActiveStatusMenuId] = useState<string | null>(null);
  const [saleModalProperty, setSaleModalProperty] = useState<PropertyItem | null>(null);

  React.useEffect(() => {
    const handleDocClick = () => {
      setActiveMenuId(null);
      setActiveStatusMenuId(null);
    };
    if (activeMenuId || activeStatusMenuId) {
      document.addEventListener('click', handleDocClick);
    }
    return () => document.removeEventListener('click', handleDocClick);
  }, [activeMenuId, activeStatusMenuId]);

  const getInitials = (name?: string) => {
    if (!name) return 'DO';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '12 Sep';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '12 Sep';
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return '12 Sep';
    }
  };

  const renderStatusDropdown = (item: PropertyItem) => {
    const isMenuOpen = activeStatusMenuId === item.id;
    const isSoldByMe = item.status === 'Sold by Me';
    const isSoldMarket = item.status === 'Sold';
    const isUnderNegotiation = item.status === 'Expiring';
    const isAvailable = item.status === 'Active' || (!isSoldByMe && !isSoldMarket && !isUnderNegotiation);

    return (
      <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setActiveStatusMenuId(isMenuOpen ? null : item.id)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            isSoldByMe
              ? 'bg-gradient-to-r from-amber-50 to-gold-50 text-gold-900 border-gold-300 ring-1 ring-gold-200'
              : isSoldMarket
              ? 'bg-slate-100 text-slate-700 border-slate-300'
              : isUnderNegotiation
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
          }`}
          title="Click to change status"
        >
          {isSoldByMe ? (
            <>
              <span className="text-[11px]">👑</span>
              <span>Sales by Me</span>
              {item.dealDetails?.commissionEarned ? (
                <span className="text-[9px] px-1 py-0.2 bg-gold-200/80 text-gold-950 rounded font-mono font-bold">
                  ₹{Math.round(item.dealDetails.commissionEarned / 1000)}k
                </span>
              ) : null}
            </>
          ) : isSoldMarket ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>Sales (Market)</span>
            </>
          ) : isUnderNegotiation ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Under Negotiation</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </>
          )}
          <svg
            className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
              isMenuOpen ? 'rotate-180 text-navy-900' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Status Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 sm:left-0 sm:right-auto mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-1 text-left animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
              Select Property Status
            </div>

            {/* 1. Available */}
            <button
              type="button"
              onClick={() => {
                setActiveStatusMenuId(null);
                onStatusChange?.(item, 'Active');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                isAvailable ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Available</span>
              </div>
              {isAvailable && <span className="text-emerald-600 font-bold">✓</span>}
            </button>

            {/* 2. Sales (Market) */}
            <button
              type="button"
              onClick={() => {
                setActiveStatusMenuId(null);
                onStatusChange?.(item, 'Sold', { soldBy: 'Market' });
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                isSoldMarket ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <div className="text-left">
                  <div>Sales (Market)</div>
                  <div className="text-[9px] text-slate-400 font-normal">Sold by another broker</div>
                </div>
              </div>
              {isSoldMarket && <span className="text-slate-600 font-bold">✓</span>}
            </button>

            {/* 3. Sales by Me */}
            <button
              type="button"
              onClick={() => {
                setActiveStatusMenuId(null);
                setSaleModalProperty(item);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                isSoldByMe
                  ? 'bg-gold-100 text-gold-950 shadow-2xs'
                  : 'bg-gold-50/80 text-gold-900 hover:bg-gold-100 border border-gold-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gold-500 text-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-gold-950">Sales by Me</div>
                  <div className="text-[9px] text-gold-700 font-medium">Record revenue & deal ↗</div>
                </div>
              </div>
              {isSoldByMe && <span className="text-gold-700 font-bold">✓</span>}
            </button>

            {/* 4. Under Negotiation */}
            <button
              type="button"
              onClick={() => {
                setActiveStatusMenuId(null);
                onStatusChange?.(item, 'Expiring');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer mt-0.5 ${
                isUnderNegotiation ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Under Negotiation</span>
              </div>
              {isUnderNegotiation && <span className="text-amber-600 font-bold">✓</span>}
            </button>
          </div>
        )}
      </div>
    );
  };

  const getTypeIcon = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('retail') || t.includes('shop')) {
      return {
        bg: 'bg-purple-50 text-purple-600 border-purple-100',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      };
    }
    if (t.includes('commercial')) {
      return {
        bg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      };
    }
    return {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      )
    };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden w-full">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1020px] text-left border-collapse">
          {/* Table Header - Compact single line */}
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
              <th className="py-3 pl-3.5 pr-2">Property</th>
              <th className="py-3 px-2.5">Type / Purpose</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3">Area</th>
              <th className="py-3 px-3">Pricing</th>
              <th className="py-3 px-2.5 text-center">Status</th>
              <th className="py-3 px-2.5">Owner / Source</th>
              <th className="py-3 px-2.5 text-left">Listed On</th>
              <th className="py-3 px-3 text-center sticky right-0 bg-slate-100 z-20 border-l border-slate-200/90 border-b-2 border-b-slate-200/90 shadow-[-6px_0_12px_rgba(0,0,0,0.05)]">Actions</th>
            </tr>
          </thead>

          {/* Table Rows - Elegant spaced rows with clear row separation */}
          <tbody className="divide-y divide-slate-200/80 text-xs">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {/* 1. Property */}
                  <td className="py-3.5 pl-3.5 pr-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0 skeleton-shimmer" />
                      <div className="space-y-1.5 min-w-0">
                        <div className="w-32 sm:w-40 h-3 rounded bg-slate-200 skeleton-shimmer" />
                        <div className="w-16 h-2 rounded bg-slate-150 skeleton-shimmer" />
                      </div>
                    </div>
                  </td>

                  {/* 2. Type & Purpose */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-slate-200 skeleton-shimmer" />
                      <div className="space-y-1">
                        <div className="w-12 h-2.5 rounded bg-slate-200 skeleton-shimmer" />
                        <div className="w-8 h-2 rounded bg-slate-150 skeleton-shimmer" />
                      </div>
                    </div>
                  </td>

                  {/* 3. Location */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="w-20 h-2.5 rounded bg-slate-200 skeleton-shimmer" />
                      <div className="w-12 h-2 rounded bg-slate-150 skeleton-shimmer" />
                    </div>
                  </td>

                  {/* 4. Area */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="w-16 h-3 rounded bg-slate-200 skeleton-shimmer" />
                  </td>

                  {/* 5. Pricing */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="w-16 h-2.5 rounded bg-slate-200 skeleton-shimmer" />
                      <div className="w-12 h-2 rounded bg-slate-150 skeleton-shimmer" />
                    </div>
                  </td>

                  {/* 6. Status Pill */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    <div className="w-20 h-5 rounded-full bg-slate-200 skeleton-shimmer mx-auto" />
                  </td>

                  {/* 7. Owner */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-200 skeleton-shimmer shrink-0" />
                      <div className="w-14 h-2.5 rounded bg-slate-200 skeleton-shimmer" />
                    </div>
                  </td>

                  {/* 8. Listed On */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    <div className="w-12 h-2.5 rounded bg-slate-200 skeleton-shimmer" />
                  </td>

                  {/* 9. Actions */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap sticky right-0 bg-white border-l border-slate-200/90 z-20 shadow-[-6px_0_12px_rgba(0,0,0,0.05)]">
                    <div className="w-4 h-4 rounded bg-slate-200 skeleton-shimmer mx-auto" />
                  </td>
                </tr>
              ))
            ) : (
              properties.map((item, index) => {
                const typeStyle = getTypeIcon(item.propertyType);
                const imageSource = item.imageUrl || '/images/sample-office.png';
                const ownerInitials = getInitials(item.ownerName);
                const isMenuOpen = activeMenuId === item.id;
                const isSold = item.status === 'Sold';
                const isSoldByMe = item.status === 'Sold by Me';
                const isClosed = isSold || isSoldByMe;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onViewDetails(item)}
                    className={`transition-colors group cursor-pointer ${
                      isClosed
                        ? 'bg-slate-50/75 opacity-70 hover:opacity-100'
                        : index % 2 === 1
                        ? 'bg-slate-50/60 hover:bg-blue-50/50'
                        : 'bg-white hover:bg-blue-50/50'
                    }`}
                  >
                  {/* 1. Property */}
                  <td className="py-3.5 pl-3.5 pr-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-2xs">
                        <Image
                          src={imageSource}
                          alt={item.title}
                          fill
                          sizes="36px"
                          unoptimized
                          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                            isClosed ? 'filter grayscale-[35%]' : ''
                          }`}
                        />
                        {isClosed && (
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center pointer-events-none">
                            <span className={`text-[7px] font-black uppercase text-white px-0.5 py-0.2 rounded leading-none ${
                              isSoldByMe ? 'bg-amber-500 text-navy-950' : 'bg-rose-600 text-white'
                            }`}>
                              SOLD
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[145px] xl:max-w-[185px]">
                        <div className="flex items-center gap-1.5">
                          <p className={`font-heading text-xs font-semibold truncate transition-colors leading-snug ${
                            isClosed ? 'text-slate-600 group-hover:text-navy-900' : 'text-navy-950 group-hover:text-blue-600'
                          }`}>
                            {item.title}
                          </p>
                          {isClosed && (
                            <span className={`px-1 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider shrink-0 ${
                              isSoldByMe
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-700 border border-rose-200'
                            }`}>
                              {isSoldByMe ? 'BY ME' : 'SOLD'}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[9.5px] text-slate-500 font-medium truncate mt-0.5">
                          {item.propertyId || `PROP-2026-${index + 100}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Type & Purpose */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${typeStyle.bg}`}
                      >
                        {typeStyle.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-navy-950 text-[11px] capitalize leading-tight">
                          {item.propertyType || 'Office'}
                        </div>
                        <div className="text-[9.5px] text-slate-500 font-medium capitalize leading-tight mt-0.5">
                          {item.purpose || 'Rent'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 3. Location - comfortable spacing without overflowing */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 shrink-0 text-[11px]">📍</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-navy-950 text-[11px] truncate">
                          {item.sector || 'Sector 62'}
                        </div>
                        <div className="text-[9.5px] text-slate-500 font-medium truncate mt-0.5">
                          {item.city || 'Noida'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 4. Area - comfortable spacing without overflowing */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span className="font-semibold text-navy-950 text-xs">
                      {item.areaSqFt ? item.areaSqFt.toLocaleString() : '1,000'} sq.ft.
                    </span>
                  </td>

                  {/* 5. Pricing - comfortable spacing without overflowing */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className={`text-[11px] font-semibold ${isClosed ? 'text-slate-400 line-through' : 'text-navy-950'}`}>
                      ₹ {item.monthlyRentInLakh} L/mo
                    </div>
                    <div className="text-[9.5px] text-slate-500 font-medium mt-0.5">
                      {isClosed ? (
                        <span className={`font-semibold ${isSoldByMe ? 'text-amber-700' : 'text-rose-600'}`}>
                          ● {isSoldByMe ? 'Closed (Me)' : 'Closed'}
                        </span>
                      ) : (
                        `₹ ${item.rentPerSqFt ? item.rentPerSqFt.toLocaleString() : Math.round((item.monthlyRentInLakh * 100000) / (item.areaSqFt || 1000))}/sq.ft.`
                      )}
                    </div>
                  </td>

                  {/* 6. Status Dropdown */}
                  <td className="py-3.5 px-2.5 text-center whitespace-nowrap">
                    {renderStatusDropdown(item)}
                  </td>

                  {/* 7. Owner / Source */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[8.5px] flex items-center justify-center shrink-0">
                        {ownerInitials}
                      </div>
                      <div className="min-w-0 max-w-[110px] xl:max-w-[135px]">
                        <div className="font-semibold text-navy-950 truncate text-[11px]">
                          {item.ownerName || 'Direct Owner'}
                        </div>
                        <div className="text-[9.5px] text-slate-500 font-medium truncate mt-0.5">
                          Direct Owner
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 8. Listed On - Tight natural gap with Actions */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-600 text-[11px]">
                        {formatDate(item.createdAt || item.listingDate)}
                      </span>
                      {!isClosed && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold ${
                            item.daysRemaining <= 0 || item.status === 'Expired'
                              ? 'text-rose-600 bg-rose-50 px-1 rounded'
                              : item.daysRemaining <= 15
                              ? 'text-amber-700 bg-amber-50 px-1 rounded'
                              : 'text-slate-400'
                          }`}>
                            {item.daysRemaining <= 0 || item.status === 'Expired'
                              ? 'Expired'
                              : `${item.daysRemaining}d left`}
                          </span>
                          {(item.daysRemaining <= 15 || item.status === 'Expired') && onRenewProperty && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRenewProperty(item);
                              }}
                              className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded transition-colors cursor-pointer"
                              title="Renew listing (+60 Days)"
                            >
                              Renew ↺
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 9. Actions - Sticky right, 100% solid background so underlying scrolled content cannot bleed through on hover */}
                  <td
                    className={`py-3.5 px-3 text-center relative whitespace-nowrap sticky right-0 transition-colors border-l border-slate-200/90 shadow-[-6px_0_12px_rgba(0,0,0,0.05)] ${
                      isClosed
                        ? 'bg-slate-50 group-hover:bg-slate-100'
                        : index % 2 === 1
                        ? 'bg-slate-50 group-hover:bg-[#f0f7ff]'
                        : 'bg-white group-hover:bg-[#f0f7ff]'
                    } ${
                      isMenuOpen ? 'z-50' : 'z-20'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : item.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isMenuOpen
                            ? 'bg-slate-200 text-navy-950 font-bold'
                            : 'hover:bg-slate-200/80 text-slate-500 hover:text-navy-950'
                        }`}
                        title="More Options"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>

                    {/* Popover Menu - Positioned cleanly on top of all rows */}
                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute right-2 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100 ${
                          index >= properties.length - 2 && properties.length > 2
                            ? 'bottom-8'
                            : 'top-8'
                        }`}
                      >
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewDetails(item);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:text-navy-950 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditProperty?.(item);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:text-amber-700 hover:bg-amber-50/60 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Property</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDuplicateProperty?.(item);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Duplicate Card</span>
                          </button>

                          {onRenewProperty && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onRenewProperty(item);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Renew (+60 Days)</span>
                            </button>
                          )}
                        </div>

                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (typeof window !== 'undefined' && item.propertyId) {
                                navigator.clipboard?.writeText(item.propertyId);
                              }
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-navy-950 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Copy ID ({item.propertyId?.slice(-4) || 'ID'})</span>
                          </button>
                        </div>

                        {onDeleteProperty && (
                          <div className="py-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onDeleteProperty(item);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete Property</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>

      {/* Record Sale Modal for "Sales by Me" */}
      <RecordSaleModal
        property={saleModalProperty}
        isOpen={!!saleModalProperty}
        onClose={() => setSaleModalProperty(null)}
        onConfirmSale={async (prop, dealData) => {
          await onStatusChange?.(prop, 'Sold by Me', dealData);
          setSaleModalProperty(null);
        }}
      />
    </div>
  );
};
