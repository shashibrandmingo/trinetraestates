'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { PropertyItem } from '@/types/propertyFilter';
import { propertyService } from '@/services/propertyService';

interface PropertyDetailsModalProps {
  property: PropertyItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const [mounted, setMounted] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [detailData, setDetailData] = useState<PropertyItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const lastFetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch full details on-demand in the background when modal opens (exactly once per card click)
  useEffect(() => {
    setSelectedImageIndex(0);
    if (!isOpen || !property) {
      lastFetchedIdRef.current = null;
      setDetailData(null);
      return;
    }

    const propKey = (property.propertyId || property.id || '').trim();
    if (!propKey) return;

    // Prevent duplicate API call if already fetched or currently loading for this property
    if (lastFetchedIdRef.current === propKey) {
      return;
    }

    lastFetchedIdRef.current = propKey;
    let isSubscribed = true;
    setIsLoadingDetail(true);

    propertyService
      .getPropertyById(propKey)
      .then((fullData) => {
        if (isSubscribed && fullData) {
          setDetailData(fullData);
        }
      })
      .catch((err) => {
        console.warn('Property full details background fetch error:', err);
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingDetail(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, property?.id, property?.propertyId]);

  if (!isOpen || !property || !mounted) return null;

  // Active property data (smoothly merges instant card data + background full details)
  const activeProp: PropertyItem = detailData ? { ...property, ...detailData } : property;

  // Build image list from all images or fallback
  const allImages: string[] =
    activeProp.images && activeProp.images.length > 0
      ? activeProp.images.map((img) => img.url).filter(Boolean)
      : activeProp.imageUrl
      ? [activeProp.imageUrl]
      : ['/images/sample-office.png'];

  const currentImage = allImages[selectedImageIndex] || allImages[0] || '/images/sample-office.png';
  const isSold = activeProp.status === 'Sold';
  const isSoldByMe = activeProp.status === 'Sold by Me';
  const isClosed = isSold || isSoldByMe;

  // Generate ready-to-send instant client pitch for WhatsApp
  const generateClientPitch = (): string => {
    const lines = [
      `🏢 *${activeProp.title}*`,
      `📍 ${activeProp.sector}, ${activeProp.city}${activeProp.buildingName ? ` (${activeProp.buildingName})` : ''}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📐 *Area:* ${activeProp.areaSqFt ? activeProp.areaSqFt.toLocaleString() : 'N/A'} Sq. Ft.${
        activeProp.carpetAreaSqFt ? ` (Carpet: ${activeProp.carpetAreaSqFt.toLocaleString()} sq.ft)` : ''
      }`,
      `💰 *${activeProp.purpose === 'Sale' ? 'Price' : 'Rent'}:* ₹${activeProp.monthlyRentInLakh} Lakh${
        activeProp.purpose === 'Rent' ? '/month' : ''
      } (₹${activeProp.rentPerSqFt || 0}/sq.ft)`,
      `🛋️ *Furnishing:* ${activeProp.furnishing || 'Furnished'}`,
      `🏢 *Floor Level:* ${activeProp.floor || 'Standard'}${activeProp.unitNo ? ` (Unit: ${activeProp.unitNo})` : ''}`,
      `🚗 *Parking:* ${activeProp.parking ? 'Reserved / Available' : 'On Demand'}`,
      activeProp.facing ? `🧭 *Facing:* ${activeProp.facing}` : '',
      activeProp.maintenanceCharge ? `🛠️ *Maintenance:* ₹${activeProp.maintenanceCharge.toLocaleString('en-IN')}/mo` : '',
      activeProp.securityDeposit ? `🔒 *Security Deposit:* ₹${activeProp.securityDeposit.toLocaleString('en-IN')}` : '',
      activeProp.amenities && activeProp.amenities.length > 0
        ? `✨ *Amenities:* ${activeProp.amenities.slice(0, 6).join(', ')}`
        : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `📞 *Contact us for immediate site visit & floor plans:* +91 98119 90055`,
      `Office Space Noida • Verified Commercial Portfolio`
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleCopyPitch = () => {
    const pitch = generateClientPitch();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pitch);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2500);
    }
  };

  const handleCopyId = () => {
    const propId = activeProp.propertyId || activeProp.id;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(propId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const pitch = encodeURIComponent(generateClientPitch());
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/?text=${pitch}`, '_blank');
    }
  };

  // Check if there is genuine closed deal information
  const hasRealDealDetails =
    isClosed &&
    activeProp.dealDetails &&
    (Boolean(activeProp.dealDetails.clientName) ||
      Boolean(activeProp.dealDetails.dealAmount) ||
      (activeProp.dealDetails.soldBy && activeProp.dealDetails.soldBy !== 'None'));

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto font-sans custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner with Property Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 shrink-0 overflow-hidden">
          <Image
            src={currentImage}
            alt={activeProp.title}
            fill
            sizes="(max-width: 768px) 100vw, 680px"
            className={`object-cover transition-opacity duration-300 ${isClosed ? 'filter grayscale-[25%]' : ''}`}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

          {/* Prominent Diagonal SOLD Stamp if closed */}
          {isClosed && (
            <div className="absolute inset-0 bg-slate-950/45 flex items-center justify-center pointer-events-none z-10">
              <div
                className={`transform -rotate-12 border-2 px-6 py-2.5 rounded-xl font-black tracking-widest text-base sm:text-xl uppercase shadow-2xl flex items-center gap-2 ${
                  isSoldByMe
                    ? 'bg-amber-500/95 text-navy-950 border-amber-300'
                    : 'bg-rose-600/95 text-white border-rose-300'
                }`}
              >
                {isSoldByMe ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>SOLD BY ME</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>SOLD OUT</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Top Header Buttons: Close, Loading status & ID */}
          <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-navy-950/80 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center gap-1.5">
                <span>{activeProp.propertyId || activeProp.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Property ID"
                  className="hover:text-gold-400 transition-colors"
                >
                  {copiedId ? '✓' : '📋'}
                </button>
              </span>

              {isLoadingDetail && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-navy-950/70 text-amber-300 backdrop-blur-md border border-white/10 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Syncing full details...
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-navy-950/85 hover:bg-navy-950 text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer border border-white/20"
              title="Close modal (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Badges on Bottom of Image */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/95 text-navy-950 shadow-md">
                {activeProp.purpose}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-gold-500 text-white shadow-md">
                {activeProp.propertyType}
              </span>
              {activeProp.buildingName && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-navy-900/80 text-slate-200 border border-white/10 backdrop-blur-xs">
                  🏢 {activeProp.buildingName}
                </span>
              )}
            </div>

            <span
              className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border shadow-md font-sans ${
                isSoldByMe
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : isSold
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : activeProp.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : activeProp.status === 'Expiring'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {activeProp.status.toUpperCase()} {isClosed ? '• DEAL CLOSED' : `• ${activeProp.daysRemaining}d validity`}
            </span>
          </div>
        </div>

        {/* Thumbnail gallery preview bar if multiple images exist */}
        {allImages.length > 1 && (
          <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto custom-scrollbar bg-slate-100/80 border-b border-slate-200 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mr-1">
              Photos ({allImages.length}):
            </span>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-12 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  selectedImageIndex === idx
                    ? 'border-gold-500 scale-105 shadow-xs'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Section 1: Title, Location & Price Box */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-navy-950 font-heading leading-tight">
                {activeProp.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <svg className="w-3.5 h-3.5 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="font-semibold text-slate-700">{activeProp.sector}, {activeProp.city}</span>
                {activeProp.unitNo && <span className="text-slate-400">• Unit #{activeProp.unitNo}</span>}
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-slate-50/90 p-3 sm:px-4 sm:py-3 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0 min-w-[160px] sm:min-w-[180px] flex flex-col items-center justify-center text-center">
              <span className="text-[10.5px] text-slate-500 uppercase tracking-wider font-bold block font-sans text-center w-full">
                {activeProp.purpose === 'Sale' ? 'Selling Price' : 'Monthly Rent'}
              </span>
              <div className="flex items-baseline justify-center gap-1.5 mt-0.5 w-full">
                <span
                  className={`text-2xl font-bold font-heading text-center ${
                    isClosed ? 'text-slate-400 line-through' : 'text-emerald-700'
                  }`}
                >
                  ₹ {activeProp.monthlyRentInLakh} L
                </span>
                {isClosed && (
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200">
                    CLOSED
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-500 block mt-1 font-sans text-center w-full">
                ₹ {activeProp.rentPerSqFt || 0} / sq.ft
              </span>
            </div>
          </div>

          {/* Section 2: INSTANT CLIENT REPLY TOOLBAR (Broker Superpower!) */}
          <div className="p-3 bg-gradient-to-r from-emerald-50/80 via-white to-gold-50/50 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                💬
              </div>
              <div>
                <span className="text-xs font-bold text-navy-950 block leading-tight">
                  Instant Client Reply Tool
                </span>
                <span className="text-[10.5px] text-slate-500">
                  Ready-to-send pitch with complete property specs formatted for WhatsApp
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-navy-900 border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{copiedPitch ? '✓ Copied!' : '📋 Copy Pitch'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Share WhatsApp</span>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Section 3: Genuine Closed Deal Summary (ONLY IF PROPERTY IS ACTUALLY SOLD) */}
          {hasRealDealDetails && activeProp.dealDetails && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 text-xs shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200/80">
                <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-heading">
                  <span>🏆</span>
                  <span>Closed Deal Information</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  {activeProp.dealDetails.soldBy || 'Sales by Me'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeProp.dealDetails.dealAmount ? (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Deal Amount</span>
                    <strong className="text-emerald-700 font-bold text-sm">
                      ₹{activeProp.dealDetails.dealAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                ) : null}
                {activeProp.dealDetails.clientName ? (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Client / Buyer</span>
                    <strong className="text-navy-950 font-bold text-xs">{activeProp.dealDetails.clientName}</strong>
                  </div>
                ) : null}
                {activeProp.dealDetails.clientPhone ? (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Client Phone</span>
                    <a
                      href={`tel:${activeProp.dealDetails.clientPhone}`}
                      className="text-navy-950 font-semibold text-xs hover:text-blue-600 transition-colors"
                    >
                      {activeProp.dealDetails.clientPhone}
                    </a>
                  </div>
                ) : null}
                {activeProp.dealDetails.soldDate ? (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Closing Date</span>
                    <span className="text-slate-700 font-medium text-xs">
                      {new Date(activeProp.dealDetails.soldDate).toLocaleDateString()}
                    </span>
                  </div>
                ) : null}
              </div>
              {activeProp.dealDetails.notes && (
                <div className="mt-2 pt-2 border-t border-amber-200/60 text-[11px] text-amber-900">
                  <span className="font-bold">Deal Notes: </span>
                  {activeProp.dealDetails.notes}
                </div>
              )}
            </div>
          )}

          {/* Section 4: Key Property Metrics Grid (4 Main Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Area</span>
              <span className="text-sm font-bold text-navy-900 block mt-0.5">
                {activeProp.areaSqFt ? activeProp.areaSqFt.toLocaleString() : 'N/A'} sq.ft
              </span>
              {activeProp.carpetAreaSqFt ? (
                <span className="text-[10px] text-slate-500 block">Carpet: {activeProp.carpetAreaSqFt.toLocaleString()} sq.ft</span>
              ) : null}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Furnishing</span>
              <span className="text-sm font-bold text-navy-900 block mt-0.5">
                {activeProp.furnishing || 'Full'}
              </span>
              <span className="text-[10px] text-slate-500 block">Ready to Move</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Floor Level</span>
              <span className="text-sm font-bold text-navy-900 block mt-0.5">
                {activeProp.floor || 'Middle Floor'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {activeProp.facing ? `Facing: ${activeProp.facing}` : 'Standard View'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Parking</span>
              <span className="text-sm font-bold text-navy-900 block mt-0.5">
                {activeProp.parking ? 'Available' : 'None'}
              </span>
              <span className="text-[10px] text-slate-500 block">Dedicated Space</span>
            </div>
          </div>

          {/* Section 5: Financials & Commercial Terms */}
          <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-2">
            <h4 className="text-[11px] font-bold text-navy-950 uppercase tracking-wider font-heading">
              Commercial Terms & Breakup
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Rent Rate</span>
                <span className="font-bold text-navy-900">₹{activeProp.rentPerSqFt || 0} / sq.ft</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Monthly Amount</span>
                <span className="font-bold text-emerald-700">₹{activeProp.monthlyRentInLakh} Lakh</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Security Deposit</span>
                <span className="font-semibold text-navy-900">
                  {activeProp.securityDeposit ? `₹${activeProp.securityDeposit.toLocaleString('en-IN')}` : '3 - 6 Months'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Maintenance</span>
                <span className="font-semibold text-navy-900">
                  {activeProp.maintenanceCharge ? `₹${activeProp.maintenanceCharge.toLocaleString('en-IN')}/mo` : 'As per Tower'}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Video Tour (if available from full details) */}
          {activeProp.videoUrl && (
            <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  ▶
                </span>
                <div>
                  <span className="text-xs font-bold block">Video Tour Available</span>
                  <span className="text-[10.5px] text-slate-300">Watch full recorded walkthrough for this property</span>
                </div>
              </div>
              <a
                href={activeProp.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                Watch Tour ↗
              </a>
            </div>
          )}

          {/* Section: Documents & Floor Plans (if available from full details) */}
          {activeProp.documents && activeProp.documents.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
              <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px] mb-2 font-heading flex items-center gap-1.5">
                <span>📑</span>
                <span>Attached Documents & Floor Plans ({activeProp.documents.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeProp.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-gold-500 hover:shadow-xs transition-all text-navy-900 group"
                  >
                    <span className="truncate font-medium flex items-center gap-2">
                      <span className="text-base">📄</span>
                      <span className="group-hover:text-gold-600 transition-colors">{doc.name || `Floor Plan #${idx + 1}`}</span>
                    </span>
                    <span className="text-[10px] font-bold text-gold-600 uppercase px-1.5 py-0.5 rounded bg-gold-50">
                      View ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Confidential Landlord / Owner Details (Broker Eyes Only) */}
          {(activeProp.ownerName || activeProp.ownerPhone || activeProp.ownerEmail || activeProp.ownerNotes) && (
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-heading">
                  <span>🔒</span>
                  <span>Confidential Owner & Direct Contact</span>
                </h4>
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Broker Private
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Owner Name</span>
                  <strong className="text-navy-900 font-bold text-xs">
                    {activeProp.ownerName || 'Direct Landlord'}
                  </strong>
                </div>

                {activeProp.ownerPhone ? (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`tel:${activeProp.ownerPhone}`}
                        className="font-bold text-navy-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        📞 {activeProp.ownerPhone}
                      </a>
                      <a
                        href={`https://wa.me/91${activeProp.ownerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded hover:bg-emerald-200"
                        title="Chat with Owner"
                      >
                        WA
                      </a>
                    </div>
                  </div>
                ) : null}

                {activeProp.ownerEmail ? (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Owner Email</span>
                    <span className="text-slate-700 truncate block">{activeProp.ownerEmail}</span>
                  </div>
                ) : null}
              </div>

              {activeProp.ownerNotes && (
                <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-700">
                  <span className="font-bold text-navy-900">Private Internal Notes: </span>
                  {activeProp.ownerNotes}
                </div>
              )}
            </div>
          )}

          {/* Section 7: Amenities & Infrastructure */}
          {activeProp.amenities && activeProp.amenities.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                Amenities & Infrastructure
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeProp.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/90 flex items-center gap-1"
                  >
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: Description */}
          {activeProp.description && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
              <h4 className="font-bold text-navy-900 uppercase text-[10px] tracking-wider mb-1">
                Property Overview
              </h4>
              <p className="leading-relaxed whitespace-pre-line">{activeProp.description}</p>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            <span>Listing ID: </span>
            <strong className="text-navy-900 font-mono">{activeProp.propertyId || activeProp.id}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPitch}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-navy-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            >
              {copiedPitch ? '✓ Pitch Copied' : 'Copy Pitch'}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Share to Client</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
