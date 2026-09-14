'use client';

import React from 'react';
import { ClientItem } from '@/services/clientService';

interface ClientDetailsModalProps {
  client: ClientItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: ClientItem) => void;
}

export default function ClientDetailsModal({
  client,
  isOpen,
  onClose,
  onEdit
}: ClientDetailsModalProps) {
  if (!isOpen || !client) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Deal Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Site Visit Scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Discussion':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Lead':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/50 flex items-center justify-center text-gold-400 font-bold text-sm">
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">{client.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                  {client.clientId}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {client.company || client.clientType} • Added {new Date(client.createdAt || Date.now()).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Status & Category */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Status</span>
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(client.status)}`}>
                  {client.status}
                </span>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Client Type</span>
              <div className="font-semibold text-navy-900">{client.clientType}</div>
            </div>
          </div>

          {/* Quick Connect Contacts */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Communication & Contact</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500">Phone: </span>
                <span className="font-bold text-navy-900">{client.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${client.phone}`}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-navy-900 hover:bg-slate-100 font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.125-.52-1.823-.755-2.998-2.613-3.089-2.733-.09-.12-.734-.975-.734-1.86s.464-1.32.628-1.503c.164-.183.358-.229.477-.229.12 0 .239.001.343.006.111.005.26-.042.406.309.15.358.508 1.238.553 1.329.045.091.075.197.015.316-.06.12-.09.195-.179.3-.09.105-.189.234-.269.315-.09.091-.184.19-.079.371.105.18.468.772 1.006 1.251.692.617 1.275.808 1.455.898.18.091.285.076.39-.045.105-.12.45-.525.57-.705.12-.18.239-.15.399-.09.16.06 1.018.48 1.197.57.18.09.299.135.343.21.045.075.045.435-.099.84z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
            {client.email && (
              <div>
                <span className="text-slate-500">Email: </span>
                <a href={`mailto:${client.email}`} className="text-navy-900 hover:underline font-semibold">
                  {client.email}
                </a>
              </div>
            )}
          </div>

          {/* Deal & Commission Breakdown (if closed or in progress) */}
          {(client.commissionEarned || client.dealAmount || client.propertyTitle) && (
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Closed Deal / Sales Record</span>
              {client.propertyTitle && (
                <div className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gold-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{client.propertyTitle}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-100">
                <div>
                  <span className="text-slate-500">Deal Value:</span>
                  <div className="font-bold text-navy-900">
                    {client.dealAmount ? `₹${client.dealAmount.toLocaleString('en-IN')}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-emerald-700 font-semibold">Brokerage / Revenue:</span>
                  <div className="font-bold text-emerald-700 text-sm">
                    {client.commissionEarned ? `₹${client.commissionEarned.toLocaleString('en-IN')}` : '₹0'}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Payment Mode: <span className="font-semibold text-navy-900">{client.paymentMode || 'Bank Transfer'}</span> • Date: {client.dealDate ? new Date(client.dealDate).toLocaleDateString('en-IN') : 'N/A'}
              </div>
            </div>
          )}

          {/* Requirements (if looking) */}
          {(client.requirementSqFt || client.budget || client.preferredSector) && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requirement Specs</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px]">Size:</span>
                  <div className="font-semibold text-navy-900">{client.requirementSqFt ? `${client.requirementSqFt.toLocaleString('en-IN')} Sq.Ft.` : '-'}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Budget:</span>
                  <div className="font-semibold text-navy-900">{client.budget ? `₹${client.budget.toLocaleString('en-IN')}` : '-'}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Sector:</span>
                  <div className="font-semibold text-navy-900">{client.preferredSector || 'Any'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Notes & Reviews */}
          {client.notes && (
            <div className="space-y-1">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Notes & Review</span>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 italic">
                &ldquo;{client.notes}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(client);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-gold-500 hover:bg-gold-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Edit Record</span>
          </button>
        </div>
      </div>
    </div>
  );
}
