'use client';

import React from 'react';
import Image from 'next/image';
import { PropertyItem } from '@/types/propertyFilter';

interface AdminPropertyCardProps {
  property: PropertyItem;
  onViewDetails: (property: PropertyItem) => void;
}

export const AdminPropertyCard: React.FC<AdminPropertyCardProps> = ({ property, onViewDetails }) => {
  const isSold = property.status === 'Sold';
  const isSoldByMe = property.status === 'Sold by Me';
  const isClosed = isSold || isSoldByMe;

  const getStatusBadge = () => {
    switch (property.status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        );
      case 'Expiring':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            EXPIRING
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            EXPIRED
          </span>
        );
      case 'Sold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white border border-rose-700 shadow-xs">
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            SOLD
          </span>
        );
      case 'Sold by Me':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-navy-950 border border-amber-400 shadow-xs">
            <svg className="w-2.5 h-2.5 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            SOLD BY ME
          </span>
        );
      default:
        return null;
    }
  };

  const getExpiryDisplay = () => {
    if (isSoldByMe) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Closed by Me
        </span>
      );
    }
    if (isSold) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Sold Out
        </span>
      );
    }
    if (property.status === 'Expired' || property.daysRemaining <= 0) {
      return <span className="text-[11px] font-bold text-rose-500">EXPIRED</span>;
    }
    if (property.daysRemaining <= 15) {
      return <span className="text-[11px] font-bold text-amber-600">Expires in {property.daysRemaining} days</span>;
    }
    return <span className="text-[11px] text-slate-500">Expires in {property.daysRemaining} days</span>;
  };

  const imageSource = property.imageUrl || '/images/sample-office.png';

  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden flex flex-col group ${
        isClosed
          ? 'bg-slate-50/85 border-dashed border-slate-300/90 opacity-70 hover:opacity-100 shadow-none hover:shadow-xs'
          : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Background Watermark for Sold properties */}
      {isClosed && (
        <div className="absolute -bottom-4 -right-4 pointer-events-none select-none opacity-[0.04] font-black text-8xl uppercase text-slate-900 -rotate-12 z-0">
          SOLD
        </div>
      )}

      {/* Property Thumbnail */}
      <div className="relative h-40 w-full bg-slate-100 overflow-hidden shrink-0">
        <Image
          src={imageSource}
          alt={property.title}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            isClosed ? 'filter grayscale-[35%] contrast-90' : ''
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Prominent Diagonal SOLD Stamp Overlay */}
        {isClosed && (
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[0.5px] flex items-center justify-center z-10 pointer-events-none">
            <div
              className={`transform -rotate-12 border-2 px-5 py-1.5 rounded-lg font-black tracking-widest text-xs sm:text-sm uppercase shadow-2xl flex items-center gap-1.5 ${
                isSoldByMe
                  ? 'bg-amber-500/95 text-navy-950 border-amber-300'
                  : 'bg-rose-600/95 text-white border-rose-300'
              }`}
            >
              {isSoldByMe ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>SOLD BY ME</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>SOLD OUT</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 z-20">
          {getStatusBadge()}
        </div>
        <div className="absolute top-2.5 right-2.5 bg-navy-950/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-semibold z-20">
          {property.propertyType} • {property.purpose || 'Rent'}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 relative z-1">
        <div>
          {/* Full-width Sold Banner bar */}
          {isClosed && (
            <div
              className={`mb-2 py-1 px-2.5 rounded-lg text-center text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 ${
                isSoldByMe
                  ? 'bg-amber-100 text-amber-900 border border-amber-300/80'
                  : 'bg-rose-100 text-rose-800 border border-rose-300/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{isSoldByMe ? 'OFFICE SOLD BY ME' : 'OFFICE SOLD (MARKET)'}</span>
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-bold font-heading line-clamp-1 transition-colors ${
                isClosed
                  ? 'text-slate-600 group-hover:text-navy-900'
                  : 'text-navy-950 group-hover:text-gold-600'
              }`}
            >
              {property.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{property.sector}, {property.city}</span>
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-200/60 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Area</span>
            <span className={`font-bold ${isClosed ? 'text-slate-600' : 'text-slate-800'}`}>
              {property.areaSqFt.toLocaleString()} sq.ft
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Rent</span>
            {isClosed ? (
              <div className="flex items-center gap-1">
                <span className="font-medium text-slate-400 line-through">₹ {property.monthlyRentInLakh} L</span>
                <span className={`text-[9px] font-bold px-1 rounded ${isSoldByMe ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'}`}>
                  CLOSED
                </span>
              </div>
            ) : (
              <span className="font-bold text-gold-600">₹ {property.monthlyRentInLakh} L / mo</span>
            )}
          </div>
        </div>

        {/* Expiry & CTA */}
        <div className="flex items-center justify-between pt-0.5">
          <div>{getExpiryDisplay()}</div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(property);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              isClosed
                ? 'bg-slate-200/80 text-slate-700 hover:bg-slate-300/80'
                : 'bg-slate-100 text-navy-900 hover:text-gold-600 hover:bg-gold-50/60'
            }`}
          >
            <span>View Details</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
