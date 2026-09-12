'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ToastMessage, ToastContainer } from '@/components/common/Toast';
import { RoundedSelect } from '@/components/common/RoundedSelect';
import { PropertyItem } from '@/types/propertyFilter';

interface AddPropertyFormProps {
  onBack: () => void;
  onSuccess: () => void;
  initialData?: PropertyItem | null;
}

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
}

interface UploadedImage {
  id: string;
  url: string;
  isCover: boolean;
}

export const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onBack, onSuccess, initialData }) => {
  const isEditMode = Boolean(initialData);

  // Property ID
  const [propertyId] = useState(() => initialData?.propertyId || `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  
  // Form state initialized with initialData if editing
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    propertyType: initialData?.propertyType || 'Office',
    purpose: initialData?.purpose || 'Rent',
    city: initialData?.city || 'Noida',
    sector: initialData?.sector || 'Sector 62',
    locality: initialData?.sector || '',
    address: initialData?.buildingName ? `${initialData.buildingName}, ${initialData.sector}` : '',
    buildingName: initialData?.buildingName || '',
    floor: initialData?.floor || 'Middle Floor',
    unitNo: '',
    carpetAreaSqFt: initialData?.areaSqFt ? String(Math.round(initialData.areaSqFt * 0.8)) : '',
    builtUpAreaSqFt: initialData?.areaSqFt ? String(initialData.areaSqFt) : '',
    superBuiltUpAreaSqFt: initialData?.areaSqFt ? String(Math.round(initialData.areaSqFt * 1.2)) : '',
    furnishing: initialData?.furnishing || 'Full',
    parking: initialData?.parking ? 'Available' : 'No Parking',
    facing: 'North-East',
    availabilityStatus: initialData?.status === 'Active' ? 'Available' : 'Under Negotiation',
    dataAge: 'Ready to Move',
    listingDate: new Date().toISOString().split('T')[0],
    sellingPrice: initialData?.monthlyRentInLakh ? String(Math.round(initialData.monthlyRentInLakh * 100000)) : '',
    securityDeposit: initialData?.monthlyRentInLakh ? String(Math.round(initialData.monthlyRentInLakh * 200000)) : '',
    maintenanceCharge: '5000',
    ownerName: initialData?.ownerName || '',
    ownerPhone: initialData?.ownerPhone || '',
    ownerEmail: '',
    ownerNotes: '',
    videoUrl: '',
    internalNotes: '',
  }));

  // Track sections with validation errors ('basic' | 'area' | 'pricing' | 'owner')
  const [errorSections, setErrorSections] = useState<string[]>([]);

  // Uploaded media states - clean empty list by default
  const [documents, setDocuments] = useState<UploadedDocument[]>(() => {
    if (initialData?.documents && initialData.documents.length > 0) {
      return initialData.documents.map((d, idx) => ({
        id: `doc-${idx}`,
        name: d.name,
        size: 'Attached'
      }));
    }
    return [];
  });

  const [images, setImages] = useState<UploadedImage[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map((img, idx) => ({
        id: `img-${idx}`,
        url: typeof img === 'string' ? img : img.url,
        isCover: img.isCover || idx === 0
      }));
    }
    if (initialData?.imageUrl && initialData.imageUrl !== '/images/sample-office.png') {
      return [{ id: 'img-cover', url: initialData.imageUrl, isCover: true }];
    }
    return [{ id: 'img-1', url: '/images/sample-office.png', isCover: true }];
  });

  // Sync real images and documents when initialData loads/updates
  useEffect(() => {
    if (!initialData) return;
    if (initialData.images && initialData.images.length > 0) {
      setImages(
        initialData.images.map((img, idx) => ({
          id: `img-${idx}`,
          url: typeof img === 'string' ? img : img.url,
          isCover: img.isCover || idx === 0
        }))
      );
    } else if (initialData.imageUrl && initialData.imageUrl !== '/images/sample-office.png') {
      setImages([{ id: 'img-cover', url: initialData.imageUrl, isCover: true }]);
    }

    if (initialData.documents && initialData.documents.length > 0) {
      setDocuments(
        initialData.documents.map((d, idx) => ({
          id: `doc-${idx}`,
          name: d.name,
          size: 'Attached'
        }))
      );
    }
    if (initialData.videoUrl) setVideoName(initialData.videoUrl);
  }, [initialData?.id, initialData?.propertyId, initialData?.images?.length]);

  const [videoName, setVideoName] = useState<string | null>(initialData?.videoUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Toast helpers
  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Clear section error on user typing
  const handleFieldChange = (field: string, value: string, section?: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (section && errorSections.includes(section)) {
      setErrorSections((prev) => prev.filter((s) => s !== section));
    }
  };

  // Document file selection
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newDocs: UploadedDocument[] = Array.from(files).map((f) => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
    addToast('success', `${files.length} document(s) attached`);
  };

  // Image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + Math.random(),
              url: reader.result as string,
              isCover: prev.length === 0
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    addToast('success', `${files.length} image(s) uploaded`);
  };

  // Set Cover Image
  const handleSetCoverImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === id
      }))
    );
    addToast('info', 'Cover image updated');
  };

  // Remove Image
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  // Video file selection
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setVideoName(files[0].name);
    addToast('success', `Video attached: ${files[0].name}`);
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: string[] = [];
    const messages: string[] = [];

    // Basic Info Check
    if (!formData.title.trim()) {
      errors.push('basic');
      messages.push('Property Name is required');
    }
    if (!formData.sector.trim()) {
      if (!errors.includes('basic')) errors.push('basic');
      messages.push('Location / Sector is required');
    }

    // Area Details Check
    if (!formData.carpetAreaSqFt || Number(formData.carpetAreaSqFt) <= 0) {
      if (!errors.includes('area')) errors.push('area');
      messages.push('Valid Carpet Area (sq.ft.) is required');
    }
    if (!formData.builtUpAreaSqFt || Number(formData.builtUpAreaSqFt) <= 0) {
      if (!errors.includes('area')) errors.push('area');
      messages.push('Valid Built-up Area (sq.ft.) is required');
    }

    // Pricing Check
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) {
      if (!errors.includes('pricing')) errors.push('pricing');
      messages.push('Selling / Rent Price is required');
    }

    // Owner Info Check
    if (!formData.ownerName.trim()) {
      if (!errors.includes('owner')) errors.push('owner');
      messages.push('Owner Name is required');
    }
    if (!formData.ownerPhone.trim() || formData.ownerPhone.trim().length < 10) {
      if (!errors.includes('owner')) errors.push('owner');
      messages.push('Valid 10-digit Owner Phone is required');
    }

    setErrorSections(errors);

    if (errors.length > 0) {
      addToast('error', messages[0] || 'Please complete highlighted sections in red');
      const firstSection = document.getElementById(`section-${errors[0]}`);
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  // Submit Handler
  const handleSubmit = async (status: 'Active' | 'Draft' = 'Active') => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    const payload = {
      title: formData.title.trim(),
      propertyType: formData.propertyType,
      purpose: formData.purpose,
      location: {
        city: formData.city,
        sector: formData.sector.trim(),
        locality: formData.locality.trim() || formData.sector.trim(),
        address: formData.address.trim() || `${formData.buildingName || ''} ${formData.sector}`.trim() || `${formData.sector}, ${formData.city}`
      },
      buildingName: formData.buildingName.trim(),
      floor: formData.floor,
      unitNo: formData.unitNo.trim(),
      carpetAreaSqFt: Number(formData.carpetAreaSqFt) || 1000,
      builtUpAreaSqFt: Number(formData.builtUpAreaSqFt) || 1200,
      superBuiltUpAreaSqFt: Number(formData.superBuiltUpAreaSqFt || 0),
      furnishing: formData.furnishing,
      parking: formData.parking,
      facing: formData.facing,
      availabilityStatus: formData.availabilityStatus,
      dataAge: formData.dataAge,
      listingDate: formData.listingDate,
      price: Number(formData.sellingPrice),
      securityDeposit: Number(formData.securityDeposit || 0),
      maintenanceCharge: Number(formData.maintenanceCharge || 0),
      ownerName: formData.ownerName.trim(),
      ownerPhone: formData.ownerPhone.trim(),
      ownerEmail: formData.ownerEmail.trim(),
      ownerNotes: formData.ownerNotes.trim(),
      documents: documents.map((d) => ({ name: d.name, url: '/documents/' + d.name })),
      images: images.map((img) => ({ url: img.url, isCover: img.isCover })),
      videoUrl: videoName || formData.videoUrl,
      internalNotes: formData.internalNotes.trim(),
      status
    };

    try {
      if (API_BASE) {
        const url = isEditMode
          ? `${API_BASE}/offices/${initialData?.id || initialData?.propertyId}`
          : `${API_BASE}/offices`;
        const method = isEditMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || (isEditMode ? 'Failed to update property' : 'Failed to publish property'));
        }
      }

      addToast(
        'success',
        isEditMode
          ? `Property "${formData.title}" updated successfully!`
          : `Property "${formData.title}" ${status === 'Draft' ? 'saved as draft' : 'published successfully'}!`
      );
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (isEditMode ? 'Failed to update property' : 'Failed to publish property');
      addToast('error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 text-navy-900 pb-12 w-full">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition-colors mb-1 cursor-pointer"
          >
            ← Properties
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-navy-950 tracking-tight">
              {isEditMode ? 'Edit Property' : 'Add New Property'}
            </h1>
            {isEditMode && (
              <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {propertyId}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            {isEditMode
              ? 'Update listing specifications, pricing, owner contacts and photos'
              : 'Add complete property information below'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditMode && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Draft')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              Save Draft
            </button>
          )}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Active')}
            className="btn-gold px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            {isSubmitting
              ? (isEditMode ? 'Updating...' : 'Publishing...')
              : (isEditMode ? 'Update Property' : 'Publish')}
          </button>
        </div>
      </div>

      <div className="space-y-5 w-full">
        {/* CARD 1: BASIC INFORMATION */}
        <section
          id="section-basic"
          className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs space-y-4 transition-all duration-300 ${
            errorSections.includes('basic')
              ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-rose-500/10'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900">
              Basic Information
            </h2>
            {errorSections.includes('basic') && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Required fields missing
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Auto Generated Property ID */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Property ID
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono font-bold text-sm text-navy-900">{propertyId}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-200/70 text-slate-600">
                  Auto Generated
                </span>
              </div>
            </div>

            {/* Property Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Property Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value, 'basic')}
                placeholder="e.g. ABC Tower Executive Suite"
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errorSections.includes('basic') && !formData.title.trim()
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 focus:ring-gold-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Property Type *
              </label>
              <RoundedSelect
                value={formData.propertyType}
                onChange={(val) => handleFieldChange('propertyType', val, 'basic')}
                options={['Office', 'Co-working', 'Commercial Land', 'Retail Space', 'Warehouse', 'Shop']}
              />
            </div>

            {/* Purpose: Rent / Sale / Lease */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Purpose *
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                {(['Rent', 'Sale', 'Lease'] as const).map((p) => {
                  const isSelected = formData.purpose === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleFieldChange('purpose', p, 'basic')}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-navy-900 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-navy-900 hover:bg-white/60'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.sector}
                onChange={(e) => handleFieldChange('sector', e.target.value, 'basic')}
                placeholder="e.g. Sector 62, Cyber City, Connaught Place"
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errorSections.includes('basic') && !formData.sector.trim()
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 focus:ring-gold-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Building Name
              </label>
              <input
                type="text"
                value={formData.buildingName}
                onChange={(e) => handleFieldChange('buildingName', e.target.value)}
                placeholder="e.g. Stellar IT Park"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Floor
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => handleFieldChange('floor', e.target.value)}
                placeholder="e.g. 5th Floor"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Unit No.
              </label>
              <input
                type="text"
                value={formData.unitNo}
                onChange={(e) => handleFieldChange('unitNo', e.target.value)}
                placeholder="e.g. Suite 502"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>
        </section>

        {/* CARD 2: AREA DETAILS */}
        <section
          id="section-area"
          className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs space-y-4 transition-all duration-300 ${
            errorSections.includes('area')
              ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-rose-500/10'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900">
              Area Details
            </h2>
            {errorSections.includes('area') && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Required fields missing
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Carpet Area * (sq.ft.)
              </label>
              <input
                type="number"
                required
                value={formData.carpetAreaSqFt}
                onChange={(e) => handleFieldChange('carpetAreaSqFt', e.target.value, 'area')}
                placeholder="2000"
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 ${
                  errorSections.includes('area') && (!formData.carpetAreaSqFt || Number(formData.carpetAreaSqFt) <= 0)
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 focus:ring-gold-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Built-up Area * (sq.ft.)
              </label>
              <input
                type="number"
                required
                value={formData.builtUpAreaSqFt}
                onChange={(e) => handleFieldChange('builtUpAreaSqFt', e.target.value, 'area')}
                placeholder="2500"
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 ${
                  errorSections.includes('area') && (!formData.builtUpAreaSqFt || Number(formData.builtUpAreaSqFt) <= 0)
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 focus:ring-gold-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Super Built-up Area (sq.ft.)
              </label>
              <input
                type="number"
                value={formData.superBuiltUpAreaSqFt}
                onChange={(e) => handleFieldChange('superBuiltUpAreaSqFt', e.target.value)}
                placeholder="3000"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>
        </section>

        {/* CARD 3: PROPERTY DETAILS */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
          <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-slate-100 pb-2">
            Property Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Furnishing *
              </label>
              <RoundedSelect
                value={formData.furnishing}
                onChange={(val) => handleFieldChange('furnishing', val)}
                options={[
                  { value: 'Full', label: 'Full (Fully Furnished)' },
                  { value: 'Semi', label: 'Semi-Furnished' },
                  { value: 'Bare Shell', label: 'Bare Shell' },
                  { value: 'Plug & Play', label: 'Plug & Play' }
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Parking
              </label>
              <input
                type="text"
                value={formData.parking}
                onChange={(e) => handleFieldChange('parking', e.target.value)}
                placeholder="e.g. 2 Covered Slots"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Facing
              </label>
              <RoundedSelect
                value={formData.facing}
                onChange={(val) => handleFieldChange('facing', val)}
                options={['North-East', 'North', 'East', 'West', 'South']}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Availability Status *
              </label>
              <RoundedSelect
                value={formData.availabilityStatus}
                onChange={(val) => handleFieldChange('availabilityStatus', val)}
                options={['Available', 'Under Offer', 'Leased']}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Data Age / Age
              </label>
              <input
                type="text"
                value={formData.dataAge}
                onChange={(e) => handleFieldChange('dataAge', e.target.value)}
                placeholder="e.g. 0-2 Years"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Listing Date
              </label>
              <input
                type="date"
                value={formData.listingDate}
                onChange={(e) => handleFieldChange('listingDate', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* CARD 4: PRICING */}
        <section
          id="section-pricing"
          className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs space-y-4 transition-all duration-300 ${
            errorSections.includes('pricing')
              ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-rose-500/10'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900">
              Pricing
            </h2>
            {errorSections.includes('pricing') && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Required fields missing
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              {formData.purpose === 'Sale' ? 'Total Selling Price * (₹ Lakhs)' : 'Monthly Rent / Lease Price * (₹ Lakhs)'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-600 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="0.1"
                required
                value={formData.sellingPrice}
                onChange={(e) => handleFieldChange('sellingPrice', e.target.value, 'pricing')}
                placeholder="2.5"
                className={`w-full bg-white border rounded-xl pl-9 pr-4 py-2.5 text-xs text-navy-900 font-bold focus:outline-none focus:ring-1 ${
                  errorSections.includes('pricing') && (!formData.sellingPrice || Number(formData.sellingPrice) <= 0)
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 focus:ring-gold-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Security Deposit (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => handleFieldChange('securityDeposit', e.target.value)}
                  placeholder="500000"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Maintenance (₹ / mo)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  value={formData.maintenanceCharge}
                  onChange={(e) => handleFieldChange('maintenanceCharge', e.target.value)}
                  placeholder="15000"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CARD 5: OWNER INFORMATION */}
        <section
          id="section-owner"
          className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs space-y-4 transition-all duration-300 ${
            errorSections.includes('owner')
              ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-rose-500/10'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900">
              Owner Information
            </h2>
            {errorSections.includes('owner') && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Required fields missing
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => handleFieldChange('ownerName', e.target.value, 'owner')}
                placeholder="e.g. Sunil Agarwal"
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 ${
                  errorSections.includes('owner') && !formData.ownerName.trim()
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 focus:ring-gold-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Owner Phone * (10 Digits)
              </label>
              <input
                type="tel"
                required
                value={formData.ownerPhone}
                onChange={(e) => handleFieldChange('ownerPhone', e.target.value, 'owner')}
                placeholder="9811023456"
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 ${
                  errorSections.includes('owner') && (!formData.ownerPhone.trim() || formData.ownerPhone.trim().length < 10)
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/10'
                    : 'border-slate-200 focus:ring-gold-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => handleFieldChange('ownerEmail', e.target.value)}
                placeholder="sunil@example.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Owner Notes
              </label>
              <input
                type="text"
                value={formData.ownerNotes}
                onChange={(e) => handleFieldChange('ownerNotes', e.target.value)}
                placeholder="e.g. Prefers MNC corporate tenants only"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>
        </section>

        {/* CARD 6: DOCUMENTS */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900">
              Documents
            </h2>
            <span className="text-[11px] text-slate-400">Upload property documents</span>
          </div>

          <input
            type="file"
            ref={docInputRef}
            onChange={handleDocUpload}
            multiple
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          <div
            onClick={() => docInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-gold-400 hover:bg-gold-50/10 transition-colors"
          >
            <span className="text-2xl block mb-1">📄</span>
            <span className="text-xs font-bold text-navy-900 block">
              Drag & Drop Documents or <span className="text-gold-600 underline">Browse Files</span>
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">PDF, DOC, DOCX up to 25MB</span>
          </div>

          {documents.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-400">📄</span>
                    <span className="font-semibold text-navy-900 truncate">{doc.name}</span>
                    <span className="text-[10px] text-slate-400">({doc.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocuments(documents.filter((d) => d.id !== doc.id))}
                    className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer text-xs font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CARD 7: PROPERTY IMAGES */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900">
                Property Images
              </h2>
              <span className="text-[10px] text-slate-400">Upload multiple property images • ★ = Cover Image</span>
            </div>
          </div>

          <input
            type="file"
            ref={imgInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="hidden"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative h-28 rounded-xl border border-slate-200 overflow-hidden group bg-slate-100"
              >
                <Image src={img.url} alt="Uploaded preview" fill sizes="120px" className="object-cover" />
                
                {/* Cover badge */}
                {img.isCover && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-gold-500 text-white text-[9px] font-bold shadow-xs flex items-center gap-0.5">
                    ★ Cover
                  </span>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCoverImage(img.id)}
                      className="px-2 py-1 rounded bg-white text-navy-950 text-[10px] font-bold hover:bg-gold-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Set Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center hover:bg-rose-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Add Images Box */}
            <div
              onClick={() => imgInputRef.current?.click()}
              className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-400 hover:bg-gold-50/10 transition-colors text-slate-400 hover:text-gold-600"
            >
              <span className="text-2xl leading-none mb-1">+</span>
              <span className="text-[11px] font-bold">Add Images</span>
            </div>
          </div>
        </section>

        {/* CARD 8: PROPERTY VIDEO */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
          <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-slate-100 pb-2">
            Property Video
          </h2>

          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoUpload}
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
          />

          <div
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-gold-400 hover:bg-gold-50/10 transition-colors"
          >
            <span className="text-2xl block mb-1">🎥</span>
            <span className="text-xs font-bold text-navy-900 block">
              {videoName ? (
                <span className="text-emerald-600">Attached: {videoName}</span>
              ) : (
                <>Upload Property Video or <span className="text-gold-600 underline">Browse Video</span></>
              )}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">MP4 / MOV / WebM</span>
          </div>
        </section>

        {/* CARD 9: INTERNAL NOTES */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
          <h2 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-slate-100 pb-2">
            Notes
          </h2>

          <textarea
            rows={3}
            value={formData.internalNotes}
            onChange={(e) => handleFieldChange('internalNotes', e.target.value)}
            placeholder="Add internal notes about this property (e.g. lease terms, negotiation buffer, inspection dates)..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-y"
          />
        </section>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Active')}
            className="btn-gold px-8 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer"
          >
            {isSubmitting ? 'Saving Property...' : 'Save Property'}
          </button>
        </div>
      </div>
    </div>
  );
};
