'use client';

import React, { useState } from 'react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Office',
    purpose: 'rent',
    city: 'Noida',
    locality: 'Sector 62',
    areaSqFt: 2500,
    rentAmountLakhs: 2.5,
    furnishing: 'furnished',
    floor: '5th Floor',
    parking: '2 Covered Slots',
    ownerName: '',
    contactPhone: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Property listing submitted successfully!');
      if (onSuccess) onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-950 font-heading">
            Add New Property Listing
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Modern Tech Park Hub, Sector 62"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white"
              >
                <option value="Office">Office</option>
                <option value="Co-working">Co-working</option>
                <option value="Commercial Land">Commercial Land</option>
                <option value="Retail Space">Retail Space</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white"
              >
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white"
              >
                <option value="Noida">Noida</option>
                <option value="Greater Noida">Greater Noida</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Locality</label>
              <input
                type="text"
                required
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                placeholder="e.g. Sector 62"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Area (sq.ft) *</label>
              <input
                type="number"
                required
                value={formData.areaSqFt}
                onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rent (₹ Lakhs / mo) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.rentAmountLakhs}
                onChange={(e) => setFormData({ ...formData, rentAmountLakhs: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Rajesh Sharma"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-navy-950 hover:bg-navy-900 text-white shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              {loading ? 'Creating...' : '+ Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
