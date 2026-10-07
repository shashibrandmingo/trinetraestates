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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Amenity definitions with icons (matching frontend-trinetraestates icon map) ───
const ALL_AMENITIES_WITH_ICONS = [
  { name: 'Central Air Conditioning', icon: 'fa-solid fa-snowflake' },
  { name: '100% Power Backup', icon: 'fa-solid fa-bolt' },
  { name: 'High-Speed Elevators', icon: 'fa-solid fa-elevator' },
  { name: 'Wet / Dry Pantry', icon: 'fa-solid fa-mug-saucer' },
  { name: 'Fire Fighting System', icon: 'fa-solid fa-fire-extinguisher' },
  { name: '24/7 CCTV Monitoring', icon: 'fa-solid fa-video' },
  { name: '24x7 Security Guard', icon: 'fa-solid fa-shield-halved' },
  { name: 'Ample Parking', icon: 'fa-solid fa-square-parking' },
  { name: 'Service / Goods Lift', icon: 'fa-solid fa-elevator' },
  { name: '24/7 Water Supply', icon: 'fa-solid fa-droplet' },
  { name: 'High-Speed WiFi', icon: 'fa-solid fa-wifi' },
  { name: 'Visitor Lounge Area', icon: 'fa-solid fa-concierge-bell' },
  { name: 'Professional Facility Team', icon: 'fa-solid fa-screwdriver-wrench' },
  { name: 'Server & UPS Room', icon: 'fa-solid fa-server' },
  { name: 'Modern Restrooms', icon: 'fa-solid fa-restroom' },
  { name: 'CAM Facility', icon: 'fa-solid fa-screwdriver-wrench' },
  { name: 'Well-Maintained Common Areas', icon: 'fa-solid fa-building-circle-check' },
  { name: 'EV Charging Station', icon: 'fa-solid fa-charging-station' },
  { name: 'Conference / Meeting Room', icon: 'fa-solid fa-people-roof' },
  { name: 'Housekeeping', icon: 'fa-solid fa-broom' },
];

const ALL_AMENITIES = ALL_AMENITIES_WITH_ICONS.map((a) => a.name);

// ─── Reusable Card & Header components (must stay outside component to prevent re-mounting on typing) ───
const SectionCard = ({ id, hasError, children }: { id?: string; hasError?: boolean; children: React.ReactNode }) => (
  <div
    id={id}
    className={`bg-white rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 ${
      hasError ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200/80'
    }`}
  >
    {children}
  </div>
);

const SectionHeader = ({ icon, title, badge, hint }: { icon: string; title: string; badge?: React.ReactNode; hint?: string }) => (
  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
        <i className={`${icon} text-sm`} />
      </div>
      <div>
        <h2 className="font-bold text-[#141414] text-sm tracking-tight">{title}</h2>
        {hint && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{hint}</p>}
      </div>
    </div>
    {badge}
  </div>
);

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
    {children}{required && <span className="text-[#c69960] ml-0.5">*</span>}
  </label>
);

const inputCls = (hasErr?: boolean) =>
  `w-full bg-white border rounded-xl px-3.5 py-2.5 text-[13px] text-[#141414] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c69960]/30 focus:border-[#c69960] transition-all ${
    hasErr ? 'border-red-400 bg-red-50/20' : 'border-gray-200 hover:border-gray-300'
  }`;

export const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onBack, onSuccess, initialData }) => {
  const isEditMode = Boolean(initialData);

  const [propertyId] = useState(() => initialData?.propertyId || `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  const getInitialFormData = (data?: PropertyItem | null) => {
    let priceInLakh = '';
    if (data?.monthlyRentInLakh) {
      priceInLakh = String(data.monthlyRentInLakh);
    } else if (data?.price) {
      const p = Number(data.price);
      priceInLakh = p >= 1000 ? String(Math.round((p / 100000) * 100) / 100) : String(p);
    }

    const initialCategories: string[] = Array.isArray((data as any)?.categories) && (data as any).categories.length > 0
      ? (data as any).categories.map((c: any) => String(c).trim()).filter(Boolean)
      : ((data as any)?.category?.trim() ? [(data as any).category.trim()] : []);

    return {
      title: data?.title || '',
      propertyType: data?.propertyType || 'Office',
      category: initialCategories[0] || '',
      categories: initialCategories,
      purpose: data?.purpose || 'Rent',
      city: data?.city || 'Noida',
      sector: data?.sector || '',
      locality: data?.sector || '',
      address: data?.address || (data?.buildingName ? `${data.buildingName}, ${data.sector}` : ''),
      buildingName: data?.buildingName || '',
      floor: data?.floor || '',
      unitNo: data?.unitNo || '',
      carpetAreaSqFt: data?.carpetAreaSqFt ? String(data.carpetAreaSqFt) : (data?.areaSqFt ? String(Math.round(data.areaSqFt * 0.8)) : ''),
      builtUpAreaSqFt: data?.builtUpAreaSqFt ? String(data.builtUpAreaSqFt) : (data?.areaSqFt ? String(data.areaSqFt) : ''),
      superBuiltUpAreaSqFt: data?.superBuiltUpAreaSqFt ? String(data.superBuiltUpAreaSqFt) : '',
      furnishing: data?.furnishing === 'Fully Furnished' ? 'Full' : (data?.furnishing === 'Semi-Furnished' ? 'Semi' : (data?.furnishing || 'Full')),
      parking: typeof data?.parking === 'boolean' ? (data.parking ? 'Available' : 'No Parking') : (data?.parking || 'Available'),
      facing: data?.facing || 'North-East',
      availabilityStatus: data?.availabilityStatus || (data?.status === 'Active' ? 'Available' : 'Under Negotiation'),
      dataAge: data?.dataAge || 'Ready to Move',
      listingDate: data?.listingDate ? String(data.listingDate).split('T')[0] : new Date().toISOString().split('T')[0],
      workstations: data?.workstations !== undefined && data?.workstations !== null && data?.workstations !== 0 ? String(data.workstations) : '',
      cabins: data?.cabins !== undefined && data?.cabins !== null && data?.cabins !== 0 ? String(data.cabins) : '',
      meetingRooms: data?.meetingRooms !== undefined && data?.meetingRooms !== null && data?.meetingRooms !== 0 ? String(data.meetingRooms) : '',
      badge: data?.badge || 'FEATURED',
      sellingPrice: priceInLakh,
      securityDeposit: data?.securityDeposit !== undefined && data.securityDeposit !== null ? String(data.securityDeposit) : '',
      maintenanceCharge: data?.maintenanceCharge !== undefined && data.maintenanceCharge !== null ? String(data.maintenanceCharge) : '',
      ownerName: data?.ownerName || '',
      ownerPhone: data?.ownerPhone || '',
      ownerEmail: data?.ownerEmail || '',
      ownerNotes: data?.ownerNotes || '',
      videoUrl: data?.videoUrl || '',
      description: data?.description || '',
      overviewHeading: (data as any)?.overviewHeading || '',
      overviewDescription: (data as any)?.overviewDescription || '',
      locationDescription: (data as any)?.locationDescription || '',
      mapEmbedUrl: (data as any)?.mapEmbedUrl || '',
      metroDistance: (data as any)?.metroDistance || '',
      roadConnectivity: (data as any)?.roadConnectivity || '',
      internalNotes: data?.internalNotes || data?.description || '',
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(initialData));

  // ─── Dynamic Connectivity Points (add/remove freely) ─────────────────────
  // Saved as connectivityHighlights[] array to backend
  const getInitialConnectivityPoints = (data?: PropertyItem | null): string[] => {
    const existing = (data as any)?.connectivityHighlights;
    if (Array.isArray(existing) && existing.length > 0) return existing;
    // Backward compat: build from old single fields
    const points: string[] = [];
    if ((data as any)?.metroDistance) points.push((data as any).metroDistance);
    if ((data as any)?.roadConnectivity) points.push((data as any).roadConnectivity);
    // Always start with at least 3 empty slots for new property
    while (points.length < 3) points.push('');
    return points;
  };
  const [connectivityPoints, setConnectivityPoints] = useState<string[]>(() =>
    getInitialConnectivityPoints(initialData)
  );

  const addConnectivityPoint = () => setConnectivityPoints((prev) => [...prev, '']);
  const removeConnectivityPoint = (idx: number) =>
    setConnectivityPoints((prev) => prev.filter((_, i) => i !== idx));
  const updateConnectivityPoint = (idx: number, val: string) =>
    setConnectivityPoints((prev) => prev.map((p, i) => (i === idx ? val : p)));

  // ─── Nearby Places (Column 3 on Frontend) ──────────────────────────────────
  interface NearbyPlaceItem {
    label: string;
    time: string;
    icon?: string;
  }
  const getInitialNearbyPlaces = (data?: PropertyItem | null): NearbyPlaceItem[] => {
    const existing = (data as any)?.nearbyPlaces;
    if (Array.isArray(existing) && existing.length > 0) return existing;
    return [
      { label: '', time: '', icon: 'fa-solid fa-train-subway' },
      { label: '', time: '', icon: 'fa-solid fa-road' },
      { label: '', time: '', icon: 'fa-solid fa-building' },
      { label: '', time: '', icon: 'fa-solid fa-road-bridge' },
      { label: '', time: '', icon: 'fa-solid fa-plane-departure' }
    ];
  };
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaceItem[]>(() =>
    getInitialNearbyPlaces(initialData)
  );
  const addNearbyPlace = () =>
    setNearbyPlaces((prev) => [...prev, { label: '', time: '', icon: 'fa-solid fa-location-dot' }]);
  const removeNearbyPlace = (idx: number) =>
    setNearbyPlaces((prev) => prev.filter((_, i) => i !== idx));
  const updateNearbyPlace = (idx: number, field: 'label' | 'time' | 'icon', val: string) =>
    setNearbyPlaces((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );

  const [errorSections, setErrorSections] = useState<string[]>([]);

  // ─── Available Showcase Categories / Tabs ─────────────────────────────────
  const [availableCategories, setAvailableCategories] = useState<string[]>(() => {
    const defaults = [
      'Furnished Offices',
      'Unfurnished Offices',
      'Coworking Spaces',
      'Managed Offices',
      'Retail Spaces',
      'Commercial Land',
      'IT / Tech Park',
      'Warehouse Space',
    ];
    const initialCats: string[] = Array.isArray((initialData as any)?.categories)
      ? (initialData as any).categories
      : ((initialData as any)?.category ? [(initialData as any).category] : []);

    const merged = [...defaults];
    initialCats.forEach((c) => {
      const clean = String(c).trim();
      if (clean && !merged.includes(clean)) merged.push(clean);
    });
    return merged;
  });
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const toggleCategory = (catName: string) => {
    setFormData((prev: any) => {
      const existing: string[] = Array.isArray(prev.categories)
        ? prev.categories
        : (prev.category ? [prev.category] : []);
      const isSelected = existing.includes(catName);
      const updated = isSelected
        ? existing.filter((c) => c !== catName)
        : [...existing, catName];
      return {
        ...prev,
        categories: updated,
        category: updated[0] || '',
      };
    });
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (!availableCategories.includes(trimmed)) {
      setAvailableCategories((prev) => [...prev, trimmed]);
    }
    // Automatically add to selected categories array as well
    setFormData((prev: any) => {
      const existing: string[] = Array.isArray(prev.categories)
        ? prev.categories
        : (prev.category ? [prev.category] : []);
      const updated = existing.includes(trimmed) ? existing : [...existing, trimmed];
      return {
        ...prev,
        categories: updated,
        category: updated[0] || '',
      };
    });
    setCustomCategoryInput('');
    addToast('success', `Category "${trimmed}" added and selected!`);
  };

  const [documents, setDocuments] = useState<UploadedDocument[]>(() => {
    if (initialData?.documents && initialData.documents.length > 0) {
      return initialData.documents.map((d, idx) => ({ id: `doc-${idx}`, name: d.name, size: 'Attached' }));
    }
    return [];
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() => {
    if (initialData?.amenities && initialData.amenities.length > 0) {
      return initialData.amenities;
    }
    return ['Central Air Conditioning', '100% Power Backup', 'High-Speed Elevators', 'Wet / Dry Pantry', 'Fire Fighting System', '24/7 CCTV Monitoring'];
  });

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) => prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]);
  };

  const [images, setImages] = useState<UploadedImage[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      const hasExplicitCover = initialData.images.some((img) => typeof img !== 'string' && img.isCover);
      return initialData.images.map((img, idx) => ({
        id: `img-${idx}`,
        url: typeof img === 'string' ? img : img.url,
        isCover: hasExplicitCover ? (typeof img !== 'string' ? Boolean(img.isCover) : false) : idx === 0
      }));
    }
    if (initialData?.imageUrl && initialData.imageUrl !== '/images/sample-office.png') {
      return [{ id: 'img-cover', url: initialData.imageUrl, isCover: true }];
    }
    return [];
  });

  useEffect(() => {
    if (!initialData) return;
    setFormData(getInitialFormData(initialData));
    if (initialData.amenities && initialData.amenities.length > 0) {
      setSelectedAmenities(initialData.amenities);
    }
    if (initialData.images && initialData.images.length > 0) {
      const hasExplicitCover = initialData.images.some((img) => typeof img !== 'string' && img.isCover);
      setImages(initialData.images.map((img, idx) => ({
        id: `img-${idx}`,
        url: typeof img === 'string' ? img : img.url,
        isCover: hasExplicitCover ? (typeof img !== 'string' ? Boolean(img.isCover) : false) : idx === 0
      })));
    } else if (initialData.imageUrl && initialData.imageUrl !== '/images/sample-office.png') {
      setImages([{ id: 'img-cover', url: initialData.imageUrl, isCover: true }]);
    }
    if (initialData.documents && initialData.documents.length > 0) {
      setDocuments(initialData.documents.map((d, idx) => ({ id: `doc-${idx}`, name: d.name, size: 'Attached' })));
    }
    if ((initialData as any)?.connectivityHighlights || (initialData as any)?.metroDistance || (initialData as any)?.roadConnectivity) {
      setConnectivityPoints(getInitialConnectivityPoints(initialData));
    }
    if ((initialData as any)?.nearbyPlaces && (initialData as any).nearbyPlaces.length > 0) {
      setNearbyPlaces(getInitialNearbyPlaces(initialData));
    }
    if (initialData.videoUrl) {
      setVideoUrl(initialData.videoUrl);
      const nameOnly = initialData.videoUrl.split('/').pop() || initialData.videoUrl;
      setVideoName(nameOnly);
    }
  }, [initialData?.id, initialData?.propertyId, initialData?.images?.length]);

  const [videoUrl, setVideoUrl] = useState<string>(initialData?.videoUrl || '');
  const [videoName, setVideoName] = useState<string | null>(
    initialData?.videoUrl ? (initialData.videoUrl.split('/').pop() || initialData.videoUrl) : null
  );
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => { setToasts((prev) => prev.filter((t) => t.id !== id)); }, 4500);
  };

  const removeToast = (id: string) => { setToasts((prev) => prev.filter((t) => t.id !== id)); };

  const handleFieldChange = (field: string, value: string, section?: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (section && errorSections.includes(section)) {
      setErrorSections((prev) => prev.filter((s) => s !== section));
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newDocs: UploadedDocument[] = Array.from(files).map((f) => ({
      id: Date.now().toString() + Math.random(), name: f.name, size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
    addToast('success', `${files.length} document(s) attached`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    let pendingCount = files.length;
    setIsImagesLoading(true);
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, { id: Date.now().toString() + Math.random(), url: reader.result as string, isCover: prev.length === 0 }]);
        }
        pendingCount -= 1;
        if (pendingCount === 0) { setIsImagesLoading(false); addToast('success', `${files.length} image(s) ready`); }
      };
      reader.onerror = () => {
        pendingCount -= 1;
        if (pendingCount === 0) setIsImagesLoading(false);
        addToast('error', `Failed to read image: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetCoverImage = (id: string) => {
    setImages((prev) => prev.map((img) => ({ ...img, isCover: img.id === id })));
    addToast('info', 'Cover image updated');
  };

  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated;
    });
  };

  const [draggedImgIdx, setDraggedImgIdx] = useState<number | null>(null);
  const handleDragStart = (idx: number) => { setDraggedImgIdx(idx); };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedImgIdx === null || draggedImgIdx === idx) return;
    handleMoveImage(draggedImgIdx, idx);
    setDraggedImgIdx(idx);
  };
  const handleDragEnd = () => { setDraggedImgIdx(null); };
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) { filtered[0].isCover = true; }
      return filtered;
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 250 * 1024 * 1024) { addToast('error', 'Video file is too large (Maximum allowed: 250MB)'); return; }
    setVideoName(file.name);
    setIsVideoUploading(true);
    addToast('info', `Uploading & processing video (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('video', file);
      const res = await fetch(`${API_BASE}/upload/video`, { method: 'POST', body: uploadFormData });
      const data = await res.json();
      if (res.ok && data.url) { setVideoUrl(data.url); addToast('success', data.message || 'Video uploaded and ready'); }
      else { throw new Error(data.message || 'Failed to upload video'); }
    } catch (err: any) {
      addToast('error', err.message || 'Video upload failed. Please try again.');
    } finally { setIsVideoUploading(false); }
  };

  const handleRemoveVideo = async () => {
    const currentVideo = videoUrl;
    setVideoName(null);
    setVideoUrl('');
    if (videoInputRef.current) videoInputRef.current.value = '';

    // If file was freshly uploaded to disk, clean it up immediately
    if (currentVideo && currentVideo.startsWith('/uploads/')) {
      try {
        await fetch(`${API_BASE}/upload`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentVideo })
        });
      } catch (_) {}
    }

    addToast('info', 'Video removed');
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    const messages: string[] = [];
    if (!formData.title.trim()) { errors.push('overview'); messages.push('Property Name is required'); }
    if (!formData.sector.trim()) { if (!errors.includes('overview')) errors.push('overview'); messages.push('Location / Sector is required'); }
    if (!formData.carpetAreaSqFt || Number(formData.carpetAreaSqFt) <= 0) { errors.push('keydetails'); messages.push('Valid Carpet Area (sq.ft.) is required'); }
    if (!formData.builtUpAreaSqFt || Number(formData.builtUpAreaSqFt) <= 0) { if (!errors.includes('keydetails')) errors.push('keydetails'); messages.push('Valid Built-up Area (sq.ft.) is required'); }
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) { errors.push('pricing'); messages.push('Selling / Rent Price is required'); }
    if (!formData.ownerName.trim()) { errors.push('owner'); messages.push('Owner Name is required'); }
    if (!formData.ownerPhone.trim() || formData.ownerPhone.trim().length < 10) { if (!errors.includes('owner')) errors.push('owner'); messages.push('Valid 10-digit Owner Phone is required'); }
    setErrorSections(errors);
    if (errors.length > 0) {
      addToast('error', messages[0] || 'Please complete highlighted sections');
      const firstSection = document.getElementById(`section-${errors[0]}`);
      if (firstSection) firstSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (status: 'Active' | 'Draft' = 'Active') => {
    if (isImagesLoading) { addToast('warning', 'Please wait until images finish loading before saving.'); return; }
    if (isVideoUploading) { addToast('warning', 'Please wait until the video finishes uploading.'); return; }
    if (!validateForm()) return;
    setIsSubmitting(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const selectedCats: string[] = Array.isArray(formData.categories) && formData.categories.length > 0
      ? formData.categories.filter((c: any) => typeof c === 'string' && c.trim()).map((c: any) => c.trim())
      : (formData.category?.trim() ? [formData.category.trim()] : []);

    const payload = {
      title: formData.title.trim(),
      propertyType: formData.propertyType,
      category: selectedCats[0] || '',
      categories: selectedCats,
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
      workstations: Number(formData.workstations) || 0,
      cabins: Number(formData.cabins) || 0,
      meetingRooms: Number(formData.meetingRooms) || 0,
      badge: formData.badge || 'FEATURED',
      price: Number(formData.sellingPrice),
      securityDeposit: Number(formData.securityDeposit || 0),
      maintenanceCharge: Number(formData.maintenanceCharge || 0),
      description: formData.description.trim(),
      overviewHeading: formData.overviewHeading.trim(),
      overviewDescription: formData.overviewDescription.trim(),
      amenities: selectedAmenities,
      locationDescription: formData.locationDescription.trim(),
      mapEmbedUrl: formData.mapEmbedUrl.trim(),
      metroDistance: connectivityPoints.filter(Boolean)[0] || '',
      roadConnectivity: connectivityPoints.filter(Boolean)[1] || '',
      connectivityHighlights: connectivityPoints.filter(Boolean),
      nearbyPlaces: nearbyPlaces.filter((p) => p.label.trim() !== ''),
      ownerName: formData.ownerName.trim(),
      ownerPhone: formData.ownerPhone.trim(),
      ownerEmail: formData.ownerEmail.trim(),
      ownerNotes: formData.ownerNotes.trim(),
      documents: documents.map((d) => ({ name: d.name, url: '/documents/' + d.name })),
      imageUrl: (images.find((img) => img.isCover) || images[0])?.url || '',
      thumbnail: (images.find((img) => img.isCover) || images[0])?.url || '',
      images: images.map((img) => ({ url: img.url, isCover: img.id === (images.find((i) => i.isCover) || images[0])?.id })),
      videoUrl: videoUrl || formData.videoUrl || '',
      internalNotes: formData.internalNotes.trim(),
      status
    };

    try {
      if (API_BASE) {
        const url = isEditMode ? `${API_BASE}/offices/${initialData?.id || initialData?.propertyId}` : `${API_BASE}/offices`;
        const method = isEditMode ? 'PUT' : 'POST';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || (isEditMode ? 'Failed to update property' : 'Failed to publish property'));
      }
      addToast('success', isEditMode ? `Property "${formData.title}" updated successfully!` : `Property "${formData.title}" ${status === 'Draft' ? 'saved as draft' : 'published successfully'}!`);
      setTimeout(() => { onSuccess(); }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (isEditMode ? 'Failed to update property' : 'Failed to publish property');
      addToast('error', message);
    } finally { setIsSubmitting(false); }
  };

  const hasOverviewErr = errorSections.includes('overview');
  const hasKeyDetailsErr = errorSections.includes('keydetails');
  const hasPricingErr = errorSections.includes('pricing');
  const hasOwnerErr = errorSections.includes('owner');

  return (
    <div className="w-full pb-16 font-sans">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* ── MAIN FORM BODY ── */}
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── TOP HEADER CARD ── */}
        <div className="bg-white rounded-2xl border border-gray-200/80 px-6 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-all cursor-pointer hover:border-[#c69960] hover:text-[#c69960] active:scale-95"
              title="Back to Properties"
            >
              <i className="fa-solid fa-arrow-left text-xs" />
            </button>
            <div>
              <h1 className="font-bold text-[#141414] text-lg tracking-tight">
                {isEditMode ? 'Edit Property' : 'Add New Property'}
              </h1>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                {isEditMode ? `Editing ${propertyId}` : 'Fill all sections below to publish a new listing'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isEditMode && (
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#fdfaf5] text-[#c69960] border border-[#f5ecde]">
                {propertyId}
              </span>
            )}
            {!isEditMode && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('Draft')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
              >
                Save Draft
              </button>
            )}
            <button
              type="button"
              disabled={isSubmitting || isImagesLoading || isVideoUploading}
              onClick={() => handleSubmit('Active')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-60 inline-flex items-center gap-1.5 shadow-sm hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, #c69960, #deb881)' }}
            >
              <i className="fa-solid fa-check text-[10px]" />
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Property' : 'Publish Listing')}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            SECTION 1 — OVERVIEW
            (Mirrors: Title, Location, Description on details page)
        ══════════════════════════════════════════════ */}
        <SectionCard id="section-overview" hasError={hasOverviewErr}>
          <SectionHeader
            icon="fa-solid fa-house-circle-check"
            title="Overview"
            hint="Shown as the main title, location & description on the property page"
            badge={hasOverviewErr ? (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Required fields missing
              </span>
            ) : undefined}
          />
          <div className="p-6 space-y-5">
            {/* Row 1: Property ID + Property Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 p-3.5 bg-[#fdfaf5] border border-[#f5ecde] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Property ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-sm text-[#141414]">{propertyId}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#f5ecde] text-[#c69960]">Auto</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel required>Property Name / Title</FieldLabel>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value, 'overview')}
                  placeholder="e.g. Express Trade Tower, Ground Floor, Sector 132, Noida"
                  className={inputCls(hasOverviewErr && !formData.title.trim())}
                />
                <p className="text-[11px] text-gray-400 mt-1">This appears as the main H1 heading on the property details page</p>
              </div>
            </div>

            {/* Row 2: Property Type + Purpose + Availability Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel required>Property Type</FieldLabel>
                <RoundedSelect
                  value={formData.propertyType}
                  onChange={(val) => handleFieldChange('propertyType', val, 'overview')}
                  options={['Office', 'Co-working', 'Commercial Land', 'Retail Space', 'Warehouse', 'Shop']}
                />
              </div>
              <div>
                <FieldLabel required>Purpose</FieldLabel>
                <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200">
                  {(['Rent', 'Sale', 'Lease'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleFieldChange('purpose', p, 'overview')}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        formData.purpose === p
                          ? 'text-white shadow-sm'
                          : 'text-gray-600 hover:text-[#141414] hover:bg-white/60'
                      }`}
                      style={formData.purpose === p ? { background: 'linear-gradient(135deg, #c69960, #deb881)' } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Availability Status</FieldLabel>
                <RoundedSelect
                  value={formData.availabilityStatus}
                  onChange={(val) => handleFieldChange('availabilityStatus', val)}
                  options={['Available', 'Under Offer', 'Leased', 'Under Negotiation']}
                />
              </div>
            </div>

            {/* Row 2b: Website Showcase Category / Tab (Controls Dynamic Tabs on Website) */}
            <div className="p-4 bg-[#fdfaf5] border border-[#f5ecde] rounded-2xl space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-layer-group text-[#c69960] text-xs" />
                  <span className="text-xs font-bold text-[#141414]">Website Showcase Categories / Tabs</span>
                  <span className="text-[10px] text-gray-400 font-normal hidden sm:inline">(Select one or multiple categories to showcase this property under)</span>
                </div>
                {Array.isArray(formData.categories) && formData.categories.length > 0 ? (
                  <span className="text-[11px] text-gray-700 bg-white px-2.5 py-1 rounded-full border border-[#f5ecde] shadow-xs flex items-center gap-1.5">
                    <span className="text-gray-500">Selected ({formData.categories.length}):</span>
                    <strong className="text-[#c69960] font-bold">{formData.categories.join(', ')}</strong>
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">Auto-detect from Furnishing &amp; Type</span>
                )}
              </div>

              {/* Multi-Select Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {availableCategories.map((sug) => {
                  const isSelected = Array.isArray(formData.categories)
                    ? formData.categories.includes(sug)
                    : formData.category === sug;
                  return (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => toggleCategory(sug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#c69960] text-white shadow-xs font-semibold scale-[1.02]'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-[#c69960] hover:text-[#c69960]'
                      }`}
                    >
                      {isSelected && <i className="fa-solid fa-check text-[10px]" />}
                      <span>{sug}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explicit "+ Add Category" Input Row */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    placeholder="Type new category name (e.g. Penthouse Offices, Studio Hub, Independent Tower)..."
                    className={`${inputCls()} bg-white text-xs`}
                  />
                  {customCategoryInput && (
                    <button
                      type="button"
                      onClick={() => setCustomCategoryInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                      title="Clear text"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  disabled={!customCategoryInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#c69960] hover:bg-[#b3874f] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                >
                  <i className="fa-solid fa-plus text-[11px]" />
                  <span>+ Add Category</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>
                  Tip: You can select <strong>multiple categories</strong>! This property will appear under every selected tab on the live website.
                </span>
                {Array.isArray(formData.categories) && formData.categories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, categories: [], category: '' }))}
                    className="text-gray-500 hover:text-red-500 underline ml-2 shrink-0 cursor-pointer"
                  >
                    Clear All (Reset to Auto)
                  </button>
                )}
              </div>
            </div>

            {/* Row 3: Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel required>Sector / Location</FieldLabel>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => handleFieldChange('sector', e.target.value, 'overview')}
                  placeholder="e.g. Sector 132"
                  className={inputCls(hasOverviewErr && !formData.sector.trim())}
                />
              </div>
              <div>
                <FieldLabel>Building Name</FieldLabel>
                <input
                  type="text"
                  value={formData.buildingName}
                  onChange={(e) => handleFieldChange('buildingName', e.target.value)}
                  placeholder="e.g. Express Trade Tower"
                  className={inputCls()}
                />
              </div>
              <div>
                <FieldLabel>Full Address</FieldLabel>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  onFocus={() => {
                    if (!formData.address && (formData.buildingName || formData.sector)) {
                      const autoAddr = [formData.buildingName, formData.sector, 'Noida'].filter(Boolean).join(', ');
                      handleFieldChange('address', autoAddr);
                    }
                  }}
                  placeholder="e.g. Express Trade Tower, Sector 132, Noida"
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Row 4: Property Description (Short Summary) */}
            <div>
              <FieldLabel>Short Property Description</FieldLabel>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="e.g. A premium commercial workspace located at Express Trade Tower, Sector 132, Noida. Equipped with modern infrastructure, high-speed elevators, 100% power backup, and seamless connectivity."
                className={`${inputCls()} resize-y`}
              />
              <p className="text-[11px] text-gray-400 mt-1">Shown in the top summary card below the title</p>
            </div>

            {/* Row 4b: Overview Section Narrative Story (Heading + Content) */}
            <div className="p-4 bg-[#fdfaf5] border border-[#f5ecde] rounded-2xl space-y-3.5">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-pen-nib text-[#c69960] text-xs" />
                <span className="text-xs font-bold text-[#141414]">Overview Tab — Story &amp; Description</span>
                <span className="text-[10px] text-gray-400 font-normal">(Shown in the Overview tab next to image slider)</span>
              </div>

              <div>
                <FieldLabel>Overview Section Heading</FieldLabel>
                <input
                  type="text"
                  value={formData.overviewHeading}
                  onChange={(e) => handleFieldChange('overviewHeading', e.target.value)}
                  placeholder={`e.g. A Premium Workspace in the Heart of ${formData.sector || 'Noida'}'s Business Hub`}
                  className={inputCls()}
                />
              </div>

              <div>
                <FieldLabel>Overview Section Detailed Content</FieldLabel>
                <textarea
                  rows={4}
                  value={formData.overviewDescription}
                  onChange={(e) => handleFieldChange('overviewDescription', e.target.value)}
                  placeholder={`e.g. Located in the iconic ${formData.buildingName || 'tower'}, this office space offers a modern, functional design suitable for businesses of all sizes. The tower is known for its premium infrastructure, excellent connectivity, and vibrant business ecosystem.\n\nWith a thoughtfully designed layout, natural light, and access to top-notch facilities, this space provides a professional environment to help your business grow.`}
                  className={`${inputCls()} resize-y`}
                />
                <p className="text-[11px] text-gray-400 mt-1">Enter your custom narrative story. You can use multiple paragraphs.</p>
              </div>
            </div>

            {/* Row 5: Badge + Listing Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel>Listing Badge</FieldLabel>
                <RoundedSelect
                  value={formData.badge}
                  onChange={(val) => handleFieldChange('badge', val)}
                  options={['FEATURED', 'READY TO MOVE', 'HOT LISTING', 'PREMIUM', 'GRADE A', 'EXCLUSIVE']}
                />
              </div>
              <div>
                <FieldLabel>Data Age</FieldLabel>
                <input
                  type="text"
                  value={formData.dataAge}
                  onChange={(e) => handleFieldChange('dataAge', e.target.value)}
                  placeholder="e.g. Ready to Move, 0-2 Years"
                  className={inputCls()}
                />
              </div>
              <div>
                <FieldLabel>Listing Date</FieldLabel>
                <input
                  type="date"
                  value={formData.listingDate}
                  onChange={(e) => handleFieldChange('listingDate', e.target.value)}
                  className={`${inputCls()} cursor-pointer`}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 2 — KEY DETAILS
            (Mirrors: Key Details grid on details page — Property Type, Building,
             Location, Area, Workstations, Cabins, Pantry, Furnishing)
        ══════════════════════════════════════════════ */}
        <SectionCard id="section-keydetails" hasError={hasKeyDetailsErr}>
          <SectionHeader
            icon="fa-solid fa-table-cells-large"
            title="Key Details"
            hint="Shown in the Key Details grid section — matches each card on the property page"
            badge={hasKeyDetailsErr ? (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Required fields missing
              </span>
            ) : undefined}
          />
          <div className="p-6 space-y-5">

            {/* Live preview strip — mirrors the frontend Key Details section */}
            <div className="bg-[#fdfaf5] border border-[#f5ecde] rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#c69960] mb-3">
                Preview — How it appears on property page
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: 'fa-solid fa-building-circle-check', label: 'Property Type', val: formData.propertyType || 'Office' },
                  { icon: 'fa-solid fa-building', label: 'Building', val: formData.buildingName || '—' },
                  { icon: 'fa-solid fa-location-dot', label: 'Location', val: formData.sector ? `${formData.sector}, Noida` : '—' },
                  { icon: 'fa-solid fa-vector-square', label: 'Total Area', val: formData.builtUpAreaSqFt ? `${Number(formData.builtUpAreaSqFt).toLocaleString('en-IN')} Sq. Ft.` : '—' },
                  { icon: 'fa-solid fa-users', label: 'Workstations', val: formData.workstations || 'Auto-calculated' },
                  { icon: 'fa-regular fa-id-badge', label: 'Cabin', val: formData.cabins ? `${formData.cabins} Private Cabin${Number(formData.cabins) > 1 ? 's' : ''}` : 'Auto-calculated' },
                  { icon: 'fa-solid fa-mug-saucer', label: 'Pantry', val: '1 Pantry' },
                  { icon: 'fa-solid fa-couch', label: 'Furnishing', val: formData.furnishing || 'Full' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className={`${item.icon} text-xs`} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-gray-400 block">{item.label}</span>
                      <strong className="text-[11px] text-[#141414] font-bold block truncate">{item.val}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Area Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel required>Carpet Area (sq.ft.)</FieldLabel>
                <input
                  type="number"
                  value={formData.carpetAreaSqFt}
                  onChange={(e) => handleFieldChange('carpetAreaSqFt', e.target.value, 'keydetails')}
                  placeholder="e.g. 1800"
                  className={inputCls(hasKeyDetailsErr && (!formData.carpetAreaSqFt || Number(formData.carpetAreaSqFt) <= 0))}
                />
              </div>
              <div>
                <FieldLabel required>Built-up Area (sq.ft.)</FieldLabel>
                <input
                  type="number"
                  value={formData.builtUpAreaSqFt}
                  onChange={(e) => handleFieldChange('builtUpAreaSqFt', e.target.value, 'keydetails')}
                  placeholder="e.g. 2200"
                  className={inputCls(hasKeyDetailsErr && (!formData.builtUpAreaSqFt || Number(formData.builtUpAreaSqFt) <= 0))}
                />
              </div>
              <div>
                <FieldLabel>Super Built-up Area (sq.ft.)</FieldLabel>
                <input
                  type="number"
                  value={formData.superBuiltUpAreaSqFt}
                  onChange={(e) => handleFieldChange('superBuiltUpAreaSqFt', e.target.value)}
                  placeholder="e.g. 2800"
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Workstations / Cabins / Meeting Rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <FieldLabel>Workstations</FieldLabel>
                <input
                  type="number"
                  value={formData.workstations}
                  onChange={(e) => handleFieldChange('workstations', e.target.value)}
                  placeholder="Auto if blank"
                  className={inputCls()}
                />
                <p className="text-[10px] text-gray-400 mt-1">Auto = Area ÷ 65</p>
              </div>
              <div>
                <FieldLabel>Cabins</FieldLabel>
                <input
                  type="number"
                  value={formData.cabins}
                  onChange={(e) => handleFieldChange('cabins', e.target.value)}
                  placeholder="Auto if blank"
                  className={inputCls()}
                />
                <p className="text-[10px] text-gray-400 mt-1">Auto = Area ÷ 1200</p>
              </div>
              <div>
                <FieldLabel>Meeting Rooms</FieldLabel>
                <input
                  type="number"
                  value={formData.meetingRooms}
                  onChange={(e) => handleFieldChange('meetingRooms', e.target.value)}
                  placeholder="Auto if blank"
                  className={inputCls()}
                />
              </div>
              <div>
                <FieldLabel>Floor</FieldLabel>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => handleFieldChange('floor', e.target.value)}
                  placeholder="e.g. 5th Floor"
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Furnishing / Parking / Facing / Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <FieldLabel>Furnishing</FieldLabel>
                <RoundedSelect
                  value={formData.furnishing}
                  onChange={(val) => handleFieldChange('furnishing', val)}
                  options={[
                    { value: 'Full', label: 'Fully Furnished' },
                    { value: 'Semi', label: 'Semi-Furnished' },
                    { value: 'Bare Shell', label: 'Bare Shell' },
                    { value: 'Plug & Play', label: 'Plug & Play' }
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Parking</FieldLabel>
                <input
                  type="text"
                  value={formData.parking}
                  onChange={(e) => handleFieldChange('parking', e.target.value)}
                  placeholder="e.g. 2 Covered Slots"
                  className={inputCls()}
                />
              </div>
              <div>
                <FieldLabel>Facing</FieldLabel>
                <RoundedSelect
                  value={formData.facing}
                  onChange={(val) => handleFieldChange('facing', val)}
                  options={['North-East', 'North', 'East', 'West', 'South']}
                />
              </div>
              <div>
                <FieldLabel>Unit No.</FieldLabel>
                <input
                  type="text"
                  value={formData.unitNo}
                  onChange={(e) => handleFieldChange('unitNo', e.target.value)}
                  placeholder="e.g. Suite 502"
                  className={inputCls()}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 3 — AMENITIES & FACILITIES
            (Mirrors: Amenity icon cards on details page)
        ══════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader
            icon="fa-solid fa-star"
            title="Amenities & Facilities"
            hint="Each selected amenity appears as an icon card on the property page"
            badge={
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#c69960] bg-[#fdfaf5] border border-[#f5ecde] px-2.5 py-1 rounded-full">
                  {selectedAmenities.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAmenities(ALL_AMENITIES)}
                  className="text-[10.5px] font-bold text-[#141414] bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAmenities([])}
                  className="text-[10.5px] font-bold text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            }
          />

          <div className="p-6">
            {/* Live preview of selected amenity cards */}
            {selectedAmenities.length > 0 && (
              <div className="mb-5 p-4 bg-[#fdfaf5] border border-[#f5ecde] rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#c69960] mb-3">
                  Preview — How it appears on property page
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2.5">
                  {selectedAmenities.map((name, idx) => {
                    const def = ALL_AMENITIES_WITH_ICONS.find((a) => a.name === name);
                    const icon = def?.icon || 'fa-solid fa-circle-check';
                    return (
                      <div key={idx} className="p-3 rounded-2xl border border-[#edf0f5] bg-white flex flex-col items-center text-center">
                        <div className="text-[#c69960] mb-2"><i className={`${icon} text-xl`} /></div>
                        <span className="text-[10px] font-semibold text-gray-800 leading-tight">{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All amenity toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ALL_AMENITIES_WITH_ICONS.map(({ name, icon }) => {
                const isChecked = selectedAmenities.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleAmenity(name)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      isChecked
                        ? 'border-[#c69960]/60 bg-[#fdfaf5] shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isChecked ? 'bg-[#c69960] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <i className={`${icon} text-sm`} />
                    </div>
                    <span className={`text-xs font-semibold leading-tight ${isChecked ? 'text-[#141414]' : 'text-gray-600'}`}>
                      {name}
                    </span>
                    {isChecked && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-[#c69960] flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-check text-white text-[8px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 4 — LOCATION & CONNECTIVITY
            (Mirrors: Location & Connectivity section on details page)
        ══════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader
            icon="fa-solid fa-location-dot"
            title="Location & Connectivity"
            hint="Manage property description, interactive Google Map, connectivity checkmarks and nearby places"
          />
          <div className="p-6 space-y-5">

            {/* Live Preview — matches frontend checkmark list */}
            <div className="bg-[#fdfaf5] border border-[#f5ecde] rounded-2xl p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#c69960] mb-3">
                Preview — Checkmarks shown on property page
              </p>
              {/* Auto point: sector */}
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-circle-check text-[#c69960] text-sm shrink-0" />
                <span className="text-xs text-gray-700">
                  Located in {formData.sector ? `${formData.sector}, Noida` : <span className="text-gray-400 italic">Fill Sector in Overview section</span>}
                </span>
              </div>
              {/* Dynamic points preview */}
              {connectivityPoints.filter(Boolean).map((pt, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <i className="fa-solid fa-circle-check text-[#c69960] text-sm shrink-0" />
                  <span className="text-xs text-gray-700">{pt}</span>
                </div>
              ))}
              {connectivityPoints.filter(Boolean).length === 0 && (
                <p className="text-xs text-gray-400 italic pl-6">Add connectivity points below to see them here</p>
              )}
            </div>

            {/* ── 1. LOCATION INTRO PARAGRAPH (Column 1 Top) ── */}
            <div>
              <FieldLabel>Location Description / Summary</FieldLabel>
              <textarea
                rows={3}
                value={formData.locationDescription}
                onChange={(e) => handleFieldChange('locationDescription', e.target.value)}
                placeholder={`e.g. ${formData.buildingName || 'This property'} is one of Noida's most sought-after commercial destinations in ${formData.sector || 'Noida'}, offering excellent metro and road connectivity, and proximity to major business hubs, corporate offices, and lifestyle amenities.`}
                className={inputCls()}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Paragraph shown on the left side above checkmarks. Enter your custom text here. (If left empty, a clean default text will be displayed).
              </p>
            </div>

            {/* ── 2. GOOGLE MAPS EMBED URL (Column 2 Middle) ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel>Google Maps Embed URL</FieldLabel>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <i className="fa-solid fa-bolt text-[9px]" />
                  Auto-synced with Sector &amp; Building
                </span>
              </div>
              <div className="relative">
                <i className="fa-solid fa-map-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c69960] text-xs" />
                <input
                  type="text"
                  value={formData.mapEmbedUrl}
                  onChange={(e) => handleFieldChange('mapEmbedUrl', e.target.value)}
                  placeholder={
                    formData.sector || formData.buildingName
                      ? `Auto-map active: ${[formData.buildingName, formData.sector, 'Noida'].filter(Boolean).join(', ')} (or paste custom embed link)`
                      : "Paste custom embed link, or fill Sector/Building in Overview to auto-fetch map"
                  }
                  className={`pl-9.5 ${inputCls()}`}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {formData.mapEmbedUrl.trim() ? (
                  <span className="text-emerald-600 font-medium">✓ Custom Google Maps link applied.</span>
                ) : (
                  <span>
                    By default, map auto-loads for: <strong className="text-gray-700">{[formData.buildingName, formData.sector, 'Noida'].filter(Boolean).join(', ') || 'Noida'}</strong>. You can paste a custom embed link anytime if you want a specific pin.
                  </span>
                )}
              </p>
            </div>

            {/* ── 3. CONNECTIVITY HIGHLIGHTS / CHECKMARKS (Column 1 Bottom) ── */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>Connectivity Highlights (Checkmarks)</FieldLabel>
                  <p className="text-[11px] text-gray-400">Each filled point appears as a ✓ checkmark on the property page</p>
                </div>
                <button
                  type="button"
                  onClick={addConnectivityPoint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border hover:shadow-sm"
                  style={{ color: '#c69960', borderColor: '#f5ecde', background: '#fdfaf5' }}
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Add Point
                </button>
              </div>

              <div className="space-y-2.5">
                {connectivityPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-circle-check text-[#c69960] text-xs" />
                    </div>
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => updateConnectivityPoint(idx, e.target.value)}
                      placeholder={
                        idx === 0 ? 'e.g. 5 mins walk to Sector 52 Metro Station'
                        : idx === 1 ? 'e.g. Direct access to NH-24 & DND Expressway'
                        : idx === 2 ? 'e.g. Close to Sector 18 commercial hub'
                        : 'e.g. Add another connectivity point...'
                      }
                      className={`flex-1 ${inputCls()}`}
                    />
                    {connectivityPoints.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeConnectivityPoint(idx)}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-300 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer shrink-0"
                        title="Remove this point"
                      >
                        <i className="fa-solid fa-xmark text-[10px]" />
                      </button>
                    ) : (
                      <div className="w-7 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── 4. NEARBY PLACES (Column 3 Right) ── */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>Nearby Places (Right Column)</FieldLabel>
                  <p className="text-[11px] text-gray-400">Add destinations with estimated travel times (e.g. Metro Station, 5 mins)</p>
                </div>
                <button
                  type="button"
                  onClick={addNearbyPlace}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border hover:shadow-sm"
                  style={{ color: '#c69960', borderColor: '#f5ecde', background: '#fdfaf5' }}
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Add Nearby Place
                </button>
              </div>

              <div className="space-y-2.5">
                {nearbyPlaces.map((place, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    {/* Place Name */}
                    <div className="flex-1 relative">
                      <i className={`${place.icon || 'fa-solid fa-location-dot'} absolute left-3 top-1/2 -translate-y-1/2 text-[#c69960] text-xs`} />
                      <input
                        type="text"
                        value={place.label}
                        onChange={(e) => updateNearbyPlace(idx, 'label', e.target.value)}
                        placeholder={
                          idx === 0 ? 'e.g. Noida Metro Station'
                          : idx === 1 ? 'e.g. NH-24 / Expressways'
                          : idx === 2 ? 'e.g. Sector 18 Commercial Hub'
                          : idx === 3 ? 'e.g. DND Flyway (Delhi Connect)'
                          : idx === 4 ? 'e.g. IGI Airport & Jewar Airport'
                          : 'Place Name...'
                        }
                        className={`pl-8 ${inputCls()}`}
                      />
                    </div>

                    {/* Travel Time */}
                    <div className="w-32 sm:w-40 relative">
                      <i className="fa-regular fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="text"
                        value={place.time}
                        onChange={(e) => updateNearbyPlace(idx, 'time', e.target.value)}
                        placeholder="e.g. 5 mins"
                        className={`pl-8 ${inputCls()}`}
                      />
                    </div>

                    {/* Remove */}
                    {nearbyPlaces.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeNearbyPlace(idx)}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-300 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer shrink-0"
                        title="Remove place"
                      >
                        <i className="fa-solid fa-xmark text-[10px]" />
                      </button>
                    ) : (
                      <div className="w-7 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 5 — PROPERTY IMAGES
        ══════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader
            icon="fa-solid fa-images"
            title="Property Images"
            hint="First image (Cover ★) shown as main gallery photo. Drag to reorder."
          />
          <div className="p-6 space-y-4">
            <input type="file" ref={imgInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />

            {images.length === 0 ? (
              <div
                onClick={() => imgInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-[#c69960]/50 hover:bg-[#fdfaf5] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center mx-auto mb-3 text-[#c69960]">
                  <i className="fa-solid fa-cloud-arrow-up text-2xl" />
                </div>
                <p className="text-sm font-bold text-[#141414]">Upload Property Photos</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Multiple files allowed. First image = Cover.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`relative h-28 rounded-2xl border overflow-hidden group bg-gray-100 cursor-grab active:cursor-grabbing transition-all select-none ${
                        img.isCover ? 'border-[#c69960] ring-2 ring-[#c69960]/30' : 'border-gray-200'
                      }`}
                    >
                      <Image src={img.url} alt="Uploaded preview" fill sizes="120px" unoptimized className="object-cover pointer-events-none" />
                      {img.isCover && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg text-[#141414] text-[9px] font-bold shadow-sm flex items-center gap-1 z-10" style={{ background: 'linear-gradient(135deg, #c69960, #deb881)' }}>
                          ★ Cover
                        </span>
                      )}
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[8.5px] font-mono z-10">#{idx + 1}</span>
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-1.5 z-20">
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button type="button" onClick={() => handleMoveImage(idx, idx - 1)} className="w-5 h-5 rounded bg-white/20 hover:bg-white text-white hover:text-gray-900 text-[10px] flex items-center justify-center cursor-pointer transition-colors">←</button>
                            )}
                            {idx < images.length - 1 && (
                              <button type="button" onClick={() => handleMoveImage(idx, idx + 1)} className="w-5 h-5 rounded bg-white/20 hover:bg-white text-white hover:text-gray-900 text-[10px] flex items-center justify-center cursor-pointer transition-colors">→</button>
                            )}
                          </div>
                          <button type="button" onClick={() => handleRemoveImage(img.id)} className="w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[10px] flex items-center justify-center cursor-pointer transition-colors">✕</button>
                        </div>
                        {!img.isCover ? (
                          <button type="button" onClick={() => handleSetCoverImage(img.id)} className="w-full py-1 rounded-lg text-[#141414] text-[10px] font-bold cursor-pointer text-center" style={{ background: 'linear-gradient(135deg, #c69960, #deb881)' }}>
                            ★ Set as Cover
                          </button>
                        ) : (
                          <span className="text-[9.5px] text-[#deb881] font-semibold">Main Cover Image</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => imgInputRef.current?.click()}
                    className="h-28 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#c69960]/50 hover:bg-[#fdfaf5] transition-all text-gray-400 hover:text-[#c69960]"
                  >
                    <span className="text-2xl leading-none mb-1">+</span>
                    <span className="text-[11px] font-bold">Add More</span>
                  </div>
                </div>
                {isImagesLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#c69960] font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#c69960] animate-ping" />
                    Loading images...
                  </div>
                )}
              </>
            )}
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 6 — PROPERTY VIDEO
        ══════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader icon="fa-solid fa-circle-play" title="Property Video" hint="Optional — Upload a video tour or paste a YouTube/Vimeo link" />
          <div className="p-6 space-y-4">
            <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/mp4,video/quicktime,video/webm" className="hidden" />

            {videoName || videoUrl ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-circle-play text-green-600 text-lg" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-green-900 block truncate">{videoName || 'Attached Video Tour'}</span>
                    {isVideoUploading ? (
                      <span className="text-xs text-green-700 font-medium animate-pulse flex items-center gap-1.5 mt-0.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        Uploading & processing on VPS...
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 block mt-0.5">{videoUrl.startsWith('http') ? 'External Link' : 'Stored on VPS'} • Ready to play</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {videoUrl && !isVideoUploading && (
                    <a href={videoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-green-700 bg-white hover:bg-green-50 border border-green-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
                      Preview ↗
                    </a>
                  )}
                  <button type="button" disabled={isVideoUploading} onClick={handleRemoveVideo} className="text-xs font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
                    Remove ✕
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => videoInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#c69960]/50 hover:bg-[#fdfaf5] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center mx-auto mb-3 text-[#c69960]">
                  <i className="fa-solid fa-circle-play text-2xl" />
                </div>
                <p className="text-sm font-bold text-[#141414]">Upload Property Video</p>
                <p className="text-xs text-gray-400 mt-1">MP4 / MOV / WebM (Max 250MB)</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium shrink-0">Or paste YouTube / video link:</span>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl.startsWith('http') ? videoUrl : ''}
                onChange={(e) => { const val = e.target.value.trim(); setVideoUrl(val); setVideoName(val ? 'External Video Link' : null); }}
                className={`flex-1 ${inputCls()}`}
              />
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 7 — PRICING
        ══════════════════════════════════════════════ */}
        <SectionCard id="section-pricing" hasError={hasPricingErr}>
          <SectionHeader
            icon="fa-solid fa-indian-rupee-sign"
            title="Pricing"
            hint="Monthly rent or selling price in Lakhs (₹)"
            badge={hasPricingErr ? (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Required
              </span>
            ) : undefined}
          />
          <div className="p-6 space-y-4">
            <div>
              <FieldLabel required>
                {formData.purpose === 'Sale' ? 'Total Selling Price (₹ Lakhs)' : 'Monthly Rent / Lease Price (₹ Lakhs)'}
              </FieldLabel>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#c69960] font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.1"
                  value={formData.sellingPrice}
                  onChange={(e) => handleFieldChange('sellingPrice', e.target.value, 'pricing')}
                  placeholder="2.5"
                  className={`${inputCls(hasPricingErr && (!formData.sellingPrice || Number(formData.sellingPrice) <= 0))} pl-9`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Security Deposit (₹)</FieldLabel>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 text-xs">₹</span>
                  <input type="number" value={formData.securityDeposit} onChange={(e) => handleFieldChange('securityDeposit', e.target.value)} placeholder="500000" className={`${inputCls()} pl-9`} />
                </div>
              </div>
              <div>
                <FieldLabel>Maintenance Charge (₹ / mo)</FieldLabel>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 text-xs">₹</span>
                  <input type="number" value={formData.maintenanceCharge} onChange={(e) => handleFieldChange('maintenanceCharge', e.target.value)} placeholder="15000" className={`${inputCls()} pl-9`} />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 8 — OWNER INFORMATION
        ══════════════════════════════════════════════ */}
        <SectionCard id="section-owner" hasError={hasOwnerErr}>
          <SectionHeader
            icon="fa-solid fa-user-tie"
            title="Owner Information"
            hint="Internal only — not shown on the public property page"
            badge={hasOwnerErr ? (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Required
              </span>
            ) : undefined}
          />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Owner Name</FieldLabel>
              <input type="text" value={formData.ownerName} onChange={(e) => handleFieldChange('ownerName', e.target.value, 'owner')} placeholder="e.g. Sunil Agarwal" className={inputCls(hasOwnerErr && !formData.ownerName.trim())} />
            </div>
            <div>
              <FieldLabel required>Owner Phone (10 Digits)</FieldLabel>
              <input type="tel" value={formData.ownerPhone} onChange={(e) => handleFieldChange('ownerPhone', e.target.value, 'owner')} placeholder="9811023456" className={inputCls(hasOwnerErr && (!formData.ownerPhone.trim() || formData.ownerPhone.trim().length < 10))} />
            </div>
            <div>
              <FieldLabel>Owner Email</FieldLabel>
              <input type="email" value={formData.ownerEmail} onChange={(e) => handleFieldChange('ownerEmail', e.target.value)} placeholder="sunil@example.com" className={inputCls()} />
            </div>
            <div>
              <FieldLabel>Owner Notes</FieldLabel>
              <input type="text" value={formData.ownerNotes} onChange={(e) => handleFieldChange('ownerNotes', e.target.value)} placeholder="e.g. Prefers MNC corporate tenants only" className={inputCls()} />
            </div>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 9 — DOCUMENTS
        ══════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader icon="fa-solid fa-file-pdf" title="Documents" hint="Optional — Upload property brochure, floor plan, NOC etc." />
          <div className="p-6 space-y-3">
            <input type="file" ref={docInputRef} onChange={handleDocUpload} multiple accept=".pdf,.doc,.docx" className="hidden" />
            <div onClick={() => docInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#c69960]/50 hover:bg-[#fdfaf5] transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center mx-auto mb-2 text-[#c69960]">
                <i className="fa-solid fa-cloud-arrow-up text-lg" />
              </div>
              <p className="text-sm font-bold text-[#141414]">Upload Documents</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — up to 25MB</p>
            </div>
            {documents.length > 0 && (
              <div className="space-y-1.5">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <i className="fa-solid fa-file-pdf text-red-500" />
                      <span className="font-semibold text-[#141414] truncate">{doc.name}</span>
                      <span className="text-[10px] text-gray-400">({doc.size})</span>
                    </div>
                    <button type="button" onClick={() => setDocuments(documents.filter((d) => d.id !== doc.id))} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer font-bold ml-2">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════════
            SECTION 10 — INTERNAL NOTES
        ══════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader icon="fa-solid fa-note-sticky" title="Internal Notes" hint="Private notes — not shown on the public property page" />
          <div className="p-6">
            <textarea
              rows={3}
              value={formData.internalNotes}
              onChange={(e) => handleFieldChange('internalNotes', e.target.value)}
              placeholder="Add internal notes about this property (e.g. lease terms, negotiation buffer, inspection dates, client preferences)..."
              className={`${inputCls()} resize-y`}
            />
          </div>
        </SectionCard>

        {/* ── BOTTOM ACTION BUTTONS ── */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button type="button" onClick={onBack} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
            Cancel
          </button>
          {!isEditMode && (
            <button type="button" disabled={isSubmitting} onClick={() => handleSubmit('Draft')} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50">
              Save Draft
            </button>
          )}
          <button
            type="button"
            disabled={isSubmitting || isImagesLoading || isVideoUploading}
            onClick={() => handleSubmit('Active')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all inline-flex items-center gap-2 ${
              isImagesLoading || isVideoUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
            }`}
            style={{ background: 'linear-gradient(135deg, #c69960, #deb881)' }}
          >
            <i className="fa-solid fa-check text-xs" />
            {isSubmitting ? 'Saving Property...' : isImagesLoading ? '⏳ Images Loading...' : isVideoUploading ? '⏳ Video Uploading...' : (isEditMode ? 'Update Property' : 'Publish Listing')}
          </button>
        </div>
      </div>
    </div>
  );
};
