'use client';

import React, { useState } from 'react';
import { PropertyItem } from '@/types/propertyFilter';

interface RecordSaleModalProps {
  property: PropertyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSale: (property: PropertyItem, dealData: {
    soldBy: 'Me';
    dealAmount: number;
    commissionEarned: number;
    clientName: string;
    clientPhone: string;
    soldDate: string;
    paymentMode: string;
    notes: string;
  }) => Promise<void> | void;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  property,
  isOpen,
  onClose,
  onConfirmSale
}) => {
  const [dealAmount, setDealAmount] = useState<string>('');
  const [commissionEarned, setCommissionEarned] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [soldDate, setSoldDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<string>('Bank Transfer');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill existing deal details if available
  React.useEffect(() => {
    if (property) {
      if (property.dealDetails) {
        setDealAmount(property.dealDetails.dealAmount ? String(property.dealDetails.dealAmount) : '');
        setCommissionEarned(property.dealDetails.commissionEarned ? String(property.dealDetails.commissionEarned) : '');
        setClientName(property.dealDetails.clientName || '');
        setClientPhone(property.dealDetails.clientPhone || '');
        setSoldDate(property.dealDetails.soldDate ? property.dealDetails.soldDate.split('T')[0] : new Date().toISOString().split('T')[0]);
        setPaymentMode(property.dealDetails.paymentMode || 'Bank Transfer');
        setNotes(property.dealDetails.notes || '');
      } else {
        // Default suggestion based on property rent/price
        setDealAmount(property.monthlyRentInLakh ? String(Math.round(property.monthlyRentInLakh * 100000)) : '');
        setCommissionEarned(property.monthlyRentInLakh ? String(Math.round(property.monthlyRentInLakh * 100000 * 0.5)) : '');
        setClientName('');
        setClientPhone('');
        setSoldDate(new Date().toISOString().split('T')[0]);
        setPaymentMode('Bank Transfer');
        setNotes('');
      }
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmSale(property, {
        soldBy: 'Me',
        dealAmount: Number(dealAmount) || 0,
        commissionEarned: Number(commissionEarned) || 0,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        soldDate: soldDate || new Date().toISOString(),
        paymentMode,
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      console.error('Error confirming sale:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Record Deal — Sales by Me
              </h3>
              <p className="text-[11px] text-gold-300 font-sans">
                Record revenue, brokerage commission & client details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Property Context Banner */}
        <div className="px-6 py-3 bg-gold-50/70 border-b border-gold-200/60 flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0">
            <div className="font-bold text-navy-900 truncate text-xs">
              {property.title}
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">
              {property.sector}, {property.city} • {property.areaSqFt?.toLocaleString()} Sq. Ft.
            </div>
          </div>
          {property.propertyId && (
            <span className="px-2 py-0.5 rounded-md bg-white border border-gold-300 text-gold-800 font-mono text-[10px] font-bold shrink-0 shadow-2xs">
              {property.propertyId}
            </span>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Revenue / Commission Highlight Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-gold-50/80 border border-gold-300/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gold-950 uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-gold-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Brokerage / Commission Earned (Sales ka Paisa) *</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500 text-white shadow-2xs">
                Adds to Total Revenue
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gold-800">
                ₹
              </span>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={commissionEarned}
                onChange={(e) => setCommissionEarned(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-gold-400 rounded-xl text-sm font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-slate-400 shadow-2xs"
              />
            </div>
            <p className="text-[10.5px] text-gold-800 font-medium">
              Yeh amount aapke Admin Dashboard ke **Revenue** me directly reflect hoga.
            </p>
          </div>

          {/* Deal Price & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Total Deal / Sale Value (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={dealAmount}
                  onChange={(e) => setDealAmount(e.target.value)}
                  placeholder="e.g. 5000000"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Sold / Closing Date
              </label>
              <input
                type="date"
                value={soldDate}
                onChange={(e) => setSoldDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Client Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Buyer / Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. TechCorp Solutions"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Client Contact / Phone
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Payment Mode
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Bank Transfer', 'Cheque', 'UPI', 'Cash'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`py-1.5 px-2 rounded-lg text-center font-semibold text-[11px] border transition-all cursor-pointer ${
                    paymentMode === mode
                      ? 'bg-navy-900 text-white border-navy-900 shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Deal Review & Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Deal Review & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified deal, agreement registered. Client gave 5-star rating for quick handover."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500 placeholder-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Deal...</span>
                </>
              ) : (
                <>
                  <span>✓ Save Deal & Record Revenue</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
