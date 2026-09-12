'use client';

import React, { useState } from 'react';
import { addOfficeSchema } from '@/validations/addOfficeSchema';
import { OfficeCardData } from '@/types/office';

interface AddOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOffice: (newOffice: OfficeCardData) => void;
}

export default function AddOfficeModal({ isOpen, onClose, onAddOffice }: AddOfficeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    sector: 'Sector 62',
    areaSqFt: '',
    rentPerSqFt: '',
    furnishing: 'Fully Furnished (Workstations + Cabins)',
    metroDistance: 'Walking distance to Metro',
    isFeatured: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = addOfficeSchema.safeParse({
      title: formData.title,
      sector: formData.sector,
      areaSqFt: Number(formData.areaSqFt),
      rentPerSqFt: Number(formData.rentPerSqFt),
      furnishing: formData.furnishing,
      metroDistance: formData.metroDistance,
      isFeatured: formData.isFeatured
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const newRecord: OfficeCardData = {
      id: `off-${Date.now()}`,
      title: result.data.title,
      sector: result.data.sector,
      areaSqFt: result.data.areaSqFt,
      rentPerSqFt: result.data.rentPerSqFt,
      type: 'Commercial Office Space',
      furnishing: result.data.furnishing,
      metroDistance: result.data.metroDistance,
      isFeatured: result.data.isFeatured
    };

    onAddOffice(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy-900">Add New Office Space</h2>
            <p className="text-xs text-slate-500 mt-0.5">Register property to live Noida inventory</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-navy-900 text-lg p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1">
              Tower / Office Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Corenthum Tower B, Stellar IT Park"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
            />
            {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1">
                Sector Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sector 62, Sector 132"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
              />
              {errors.sector && <p className="text-[11px] text-red-500 mt-1">{errors.sector}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1">
                Area (Sq. Ft.) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 4500"
                value={formData.areaSqFt}
                onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
              />
              {errors.areaSqFt && <p className="text-[11px] text-red-500 mt-1">{errors.areaSqFt}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1">
                Rent / Sq. Ft. (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 65"
                value={formData.rentPerSqFt}
                onChange={(e) => setFormData({ ...formData, rentPerSqFt: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
              />
              {errors.rentPerSqFt && <p className="text-[11px] text-red-500 mt-1">{errors.rentPerSqFt}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1">
                Metro Proximity
              </label>
              <input
                type="text"
                placeholder="e.g. 500m from Metro"
                value={formData.metroDistance}
                onChange={(e) => setFormData({ ...formData, metroDistance: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1">
              Furnishing Details *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fully Furnished (45 Workstations, 2 Cabins)"
              value={formData.furnishing}
              onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
            />
            <label htmlFor="isFeatured" className="text-xs font-medium text-slate-700 cursor-pointer">
              Mark as Featured Office Space
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-md"
            >
              Save to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
