'use client';

import React, { useState, useEffect } from 'react';
import { ClientItem } from '@/services/clientService';

interface AddEditClientModalProps {
  isOpen: boolean;
  client?: ClientItem | null;
  onClose: () => void;
  onSave: (clientData: Partial<ClientItem>) => Promise<void>;
}

export default function AddEditClientModal({
  isOpen,
  client,
  onClose,
  onSave
}: AddEditClientModalProps) {
  const isEditing = !!client;

  const [formData, setFormData] = useState<Partial<ClientItem>>({
    name: '',
    phone: '',
    email: '',
    company: '',
    clientType: 'Buyer',
    status: 'In Discussion',
    budget: 0,
    requirementSqFt: 0,
    preferredSector: '',
    propertyTitle: '',
    dealAmount: 0,
    commissionEarned: 0,
    paymentMode: 'Bank Transfer',
    dealDate: new Date().toISOString().split('T')[0],
    notes: '',
    source: 'Direct Entry'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        email: client.email || '',
        company: client.company || '',
        clientType: client.clientType || 'Buyer',
        status: client.status || 'In Discussion',
        budget: client.budget || 0,
        requirementSqFt: client.requirementSqFt || 0,
        preferredSector: client.preferredSector || '',
        propertyTitle: client.propertyTitle || '',
        dealAmount: client.dealAmount || 0,
        commissionEarned: client.commissionEarned || 0,
        paymentMode: client.paymentMode || 'Bank Transfer',
        dealDate: client.dealDate ? new Date(client.dealDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: client.notes || '',
        source: client.source || 'Direct Entry'
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        clientType: 'Buyer',
        status: 'In Discussion',
        budget: 0,
        requirementSqFt: 0,
        preferredSector: '',
        propertyTitle: '',
        dealAmount: 0,
        commissionEarned: 0,
        paymentMode: 'Bank Transfer',
        dealDate: new Date().toISOString().split('T')[0],
        notes: '',
        source: 'Direct Entry'
      });
    }
    setErrorMsg('');
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErrorMsg('Please enter client name');
      return;
    }
    if (!formData.phone?.trim()) {
      setErrorMsg('Please enter client phone number');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving client. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col font-sans">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isEditing ? 'Edit Client Record' : 'Register New Client'}
              </h2>
              <p className="text-xs text-slate-300">
                {isEditing ? `Update information for ${client?.name}` : 'Store client contacts, requirements & deals'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Personal & Contact Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. client@company.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions Pvt Ltd"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Classification & Status */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Classification & Status</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Type
                </label>
                <select
                  value={formData.clientType || 'Buyer'}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-navy-900"
                >
                  <option value="Buyer">Buyer (Purchaser)</option>
                  <option value="Tenant">Tenant (Leasing)</option>
                  <option value="Investor">Investor</option>
                  <option value="Corporate">Corporate Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead / Deal Status
                </label>
                <select
                  value={formData.status || 'In Discussion'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-navy-900 font-semibold"
                >
                  <option value="In Discussion">In Discussion</option>
                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                  <option value="Lead">Fresh Lead</option>
                  <option value="Deal Closed">Deal Closed (Sales Done)</option>
                  <option value="Cold / Inactive">Cold / Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Sector / Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector 62 / Expressway"
                  value={formData.preferredSector || ''}
                  onChange={(e) => setFormData({ ...formData, preferredSector: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requirement Size (Sq. Ft.)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2500"
                  value={formData.requirementSqFt || ''}
                  onChange={(e) => setFormData({ ...formData, requirementSqFt: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Deal & Revenue Info */}
          <div className="pt-2 border-t border-slate-100 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2.5 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Deal Value & Revenue (Commission)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Name / Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advant Navis Tower B"
                  value={formData.propertyTitle || ''}
                  onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Deal Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 8500000"
                  value={formData.dealAmount || ''}
                  onChange={(e) => setFormData({ ...formData, dealAmount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  Commission / Revenue Earned (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 150000"
                  value={formData.commissionEarned || ''}
                  onChange={(e) => setFormData({ ...formData, commissionEarned: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs border-2 border-emerald-500 bg-emerald-50/30 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-navy-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={formData.paymentMode || 'Bank Transfer'}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-navy-900"
                >
                  <option value="Bank Transfer">RTGS / NEFT / Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI / Online">UPI / Online</option>
                  <option value="Cash / Other">Cash / Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Notes & Review */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client Notes & Review
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Client looking for ready-to-move 50 seats, token given, payment verified..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <span>✓</span>
                  <span>{isEditing ? 'Save Changes' : 'Save Client'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
