export type PropertyStatus = 'Active' | 'Expiring' | 'Expired' | 'Sold' | 'Sold by Me' | 'Draft';
export type PropertyType = 'Office' | 'Shop' | 'Warehouse' | 'Land';
export type PropertyPurpose = 'Rent' | 'Sale' | 'Lease';
export type PropertyFurnishing = 'All' | 'Fully Furnished' | 'Semi-Furnished' | 'Bare Shell' | 'Plug & Play';

export interface PropertyItem {
  id: string;
  propertyId?: string;
  slug?: string;
  title: string;
  buildingName?: string;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  city: string;
  sector: string;
  areaSqFt: number;
  monthlyRentInLakh: number;
  rentPerSqFt?: number;
  status: PropertyStatus;
  daysRemaining: number;
  furnishing: PropertyFurnishing;
  parking: boolean;
  floor: string;
  amenities: string[];
  imageUrl?: string;
  images?: Array<{ url: string; isCover?: boolean }>;
  videoUrl?: string;
  documents?: Array<{ name: string; url: string }>;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerNotes?: string;
  carpetAreaSqFt?: number;
  builtUpAreaSqFt?: number;
  superBuiltUpAreaSqFt?: number;
  unitNo?: string;
  address?: string;
  facing?: string;
  securityDeposit?: number;
  maintenanceCharge?: number;
  description?: string;
  internalNotes?: string;
  dataAge?: string;
  availabilityStatus?: string;
  listingDate?: string;
  price?: number;
  createdAt?: string;
  agentName?: string;
  dealDetails?: {
    soldBy?: string;
    dealAmount?: number;
    commissionEarned?: number;
    clientName?: string;
    clientPhone?: string;
    soldDate?: string;
    paymentMode?: string;
    notes?: string;
  };
}

export interface PropertyFilterState {
  city: string;
  locality: string;
  propertyTypes: PropertyType[];
  purpose: PropertyPurpose | 'All';
  minArea: string;
  maxArea: string;
  minBudget: string;
  maxBudget: string;
  furnishing: string;
  parkingRequired: boolean;
  floor: string;
  amenities: string[];
  statuses: PropertyStatus[];
}

export interface PropertyKPIStats {
  total: number;
  active: number;
  expiring: number;
  expired: number;
  sold?: number;
  soldByMe?: number;
}

