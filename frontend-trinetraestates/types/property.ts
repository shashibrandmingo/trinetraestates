/**
 * Backend Property / Office Document Types
 */
export interface BackendOfficeLocation {
  city?: string;
  sector?: string;
  locality?: string;
  address?: string;
}

export interface BackendOfficeDoc {
  _id?: string;
  id?: string;
  propertyId?: string;
  slug?: string;
  title: string;
  propertyType?: string;
  category?: string;
  categories?: string[];
  purpose?: "Rent" | "Sale" | "Lease";
  location?: BackendOfficeLocation;
  areaSqFt?: number;
  carpetAreaSqFt?: number;
  builtUpAreaSqFt?: number;
  price?: number;
  monthlyRentInLakh?: number;
  rentPerSqFt?: number;
  status?: "Active" | "Expiring" | "Expired" | "Sold" | "Sold by Me" | "Draft";
  furnishing?: string;
  parking?: string | boolean;
  floor?: string;
  facing?: string;
  amenities?: string[];
  thumbnail?: string;
  imageUrl?: string;
  images?: Array<{ url: string; isCover?: boolean }>;
  dataAge?: string;
  availabilityStatus?: string;
  workstations?: number;
  cabins?: number;
  meetingRooms?: number;
  pantry?: string;
  badge?: string;
  description?: string;
  buildingName?: string;
  metroDistance?: string;
  roadConnectivity?: string;
  towerGrade?: string;
  locationDescription?: string;
  mapEmbedUrl?: string;
  connectivityHighlights?: string[];
  nearbyPlaces?: Array<{
    label: string;
    time: string;
    icon?: string;
  }>;
  overviewHeading?: string;
  overviewDescription?: string;
  createdAt?: string;
}

/**
 * Normalized UI Property Item (used by Featured Cards, Sector Grids)
 */
export interface PropertyCardItem {
  id: string | number;
  title: string;
  sector: string;
  location: string;
  buildingName?: string;
  locality?: string;
  address?: string;
  city?: string;
  badge: string;
  area: string;
  workstations: string;
  cabins: string;
  meetingRooms?: string;
  pantry?: string;
  image: string;
  slug: string;
  purpose?: string;
  propertyType?: string;
  category?: string;
  categories?: string[];
  price?: string;
  priceOnRequest?: boolean;
}
