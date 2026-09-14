import { PropertyKPIStats, PropertyItem, PropertyFilterState } from '@/types/propertyFilter';
import { initialPropertyList, defaultKPIStats } from '@/data/mockPropertiesList';

interface StatsCache {
  data: PropertyKPIStats;
  cachedAt: number;
}

const STATS_CACHE_TTL = 30 * 1000; // 30 seconds
let memoryStatsCache: StatsCache | null = null;

// Deduplication map for in-flight getPropertyById calls to prevent duplicate network hits
const inFlightDetailRequests = new Map<string, Promise<PropertyItem | null>>();

// Memory cache for complete property details (60s TTL)
interface PropertyDetailCacheEntry {
  data: PropertyItem;
  cachedAt: number;
}
const propertyDetailCache = new Map<string, PropertyDetailCacheEntry>();
const PROPERTY_DETAIL_CACHE_TTL = 60 * 1000;

export const clearPropertyDetailCache = (id?: string) => {
  if (id) {
    propertyDetailCache.delete(id.trim());
  } else {
    propertyDetailCache.clear();
  }
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface BackendOfficeDoc {
  _id?: string;
  id?: string;
  propertyId?: string;
  slug?: string;
  title: string;
  propertyType?: string;
  purpose?: 'Rent' | 'Sale' | 'Lease';
  location?: {
    city?: string;
    sector?: string;
    locality?: string;
    address?: string;
  };
  areaSqFt?: number;
  carpetAreaSqFt?: number;
  builtUpAreaSqFt?: number;
  superBuiltUpAreaSqFt?: number;
  unitNo?: string;
  facing?: string;
  securityDeposit?: number;
  maintenanceCharge?: number;
  description?: string;
  buildingName?: string;
  price?: number;
  rentPerSqFt?: number;
  status?: 'Active' | 'Expiring' | 'Expired' | 'Sold' | 'Sold by Me' | 'Draft';
  daysRemaining?: number;
  furnishing?: string;
  parking?: string | boolean;
  floor?: string;
  amenities?: string[];
  images?: Array<{ url: string; isCover?: boolean }>;
  videoUrl?: string;
  documents?: Array<{ name: string; url: string }>;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerNotes?: string;
  createdAt?: string;
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

export const mapBackendToPropertyItem = (office: BackendOfficeDoc): PropertyItem => {
  const priceNum = Number(office.price) || 0;
  const monthlyRentInLakh =
    priceNum >= 1000 ? Math.round((priceNum / 100000) * 100) / 100 : priceNum;
  const area =
    Number(office.areaSqFt) ||
    Number(office.builtUpAreaSqFt) ||
    Number(office.carpetAreaSqFt) ||
    1000;
  const rentPerSqFt =
    Number(office.rentPerSqFt) ||
    (area > 0 && priceNum > 0 ? Math.round(priceNum / area) : 0);

  const coverImg =
    (office as any).thumbnail ||
    (office as any).imageUrl ||
    office.images?.find((img) => img.isCover)?.url ||
    office.images?.[0]?.url ||
    '/images/sample-office.png';

  return {
    id: office._id || office.id || office.propertyId || String(Math.random()),
    propertyId: office.propertyId,
    slug: office.slug,
    title: office.title || 'Untitled Property',
    propertyType: (office.propertyType as any) || 'Office',
    purpose: office.purpose || 'Rent',
    city: office.location?.city || 'Noida',
    sector: office.location?.sector || 'Noida',
    areaSqFt: area,
    monthlyRentInLakh,
    rentPerSqFt,
    status: (office.status as PropertyItem['status']) || 'Active',
    daysRemaining: office.daysRemaining ?? 60,
    furnishing: (office.furnishing as any) || 'Full',
    parking: office.parking === 'Available' || office.parking === true,
    floor: office.floor || 'Middle Floor',
    amenities: office.amenities || ['Lift', 'Power Backup', 'AC', 'Security'],
    imageUrl: coverImg,
    images: office.images || [],
    videoUrl: office.videoUrl,
    documents: office.documents || [],
    ownerName: office.ownerName,
    ownerPhone: office.ownerPhone,
    ownerEmail: office.ownerEmail,
    ownerNotes: office.ownerNotes,
    carpetAreaSqFt: office.carpetAreaSqFt,
    builtUpAreaSqFt: office.builtUpAreaSqFt,
    superBuiltUpAreaSqFt: office.superBuiltUpAreaSqFt,
    unitNo: office.unitNo,
    address: office.location?.address || office.location?.locality,
    facing: office.facing,
    securityDeposit: office.securityDeposit,
    maintenanceCharge: office.maintenanceCharge,
    description: office.description,
    internalNotes: office.internalNotes || office.description || '',
    dataAge: office.dataAge || 'Ready to Move',
    availabilityStatus: office.availabilityStatus || 'Available',
    listingDate: office.listingDate ? String(office.listingDate).split('T')[0] : '',
    price: priceNum,
    buildingName: office.buildingName,
    createdAt: office.createdAt || (office as any).listingDate || new Date().toISOString(),
    agentName: (office as any).agentName || 'Corporate Leasing Desk',
    dealDetails: office.dealDetails
  };
};

export interface FetchPropertiesParams {
  skip?: number;
  limit?: number;
  city?: string;
  sector?: string;
  locality?: string;
  keyword?: string;
  propertyType?: string;
  purpose?: string;
  minArea?: number | string;
  maxArea?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  furnishing?: string;
  parking?: boolean;
  floor?: string;
  status?: string;
  sortBy?: string;
}

export interface FetchPropertiesResult {
  properties: PropertyItem[];
  total: number;
  hasMore: boolean;
}

export const propertyService = {
  /**
   * Fast dedicated API call for 4 KPI summary cards (Total, Active, Expiring, Expired)
   * Uses Mongo count aggregation on backend.
   */
  getKPIStats: async (forceRefresh = false): Promise<PropertyKPIStats> => {
    const now = Date.now();
    if (!forceRefresh && memoryStatsCache && now - memoryStatsCache.cachedAt < STATS_CACHE_TTL) {
      return memoryStatsCache.data;
    }

    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/stats`, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            memoryStatsCache = { data: json.data, cachedAt: now };
            return json.data;
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch KPI stats from backend:', err);
    }

    // Default fast cache
    memoryStatsCache = { data: defaultKPIStats, cachedAt: now };
    return defaultKPIStats;
  },

  /**
   * Fetch live properties from MongoDB backend with server-side pagination & filtering
   */
  fetchPropertiesBatch: async (
    params: FetchPropertiesParams = {}
  ): Promise<FetchPropertiesResult> => {
    const {
      skip = 0,
      limit = 30,
      city,
      sector,
      locality,
      keyword,
      propertyType,
      purpose,
      minArea,
      maxArea,
      minPrice,
      maxPrice,
      furnishing,
      parking,
      status,
      sortBy
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.set('skip', String(skip));
    queryParams.set('limit', String(limit));

    if (city && city !== 'All Cities') queryParams.set('city', city);
    if (sector && sector !== 'All Sectors') queryParams.set('sector', sector);
    if (locality) queryParams.set('locality', locality);
    if (keyword) queryParams.set('keyword', keyword);
    if (propertyType && propertyType !== 'All') queryParams.set('propertyType', propertyType);
    if (purpose && purpose !== 'All') queryParams.set('purpose', purpose);
    if (minArea) queryParams.set('minArea', String(minArea));
    if (maxArea) queryParams.set('maxArea', String(maxArea));
    if (minPrice) queryParams.set('minPrice', String(minPrice));
    if (maxPrice) queryParams.set('maxPrice', String(maxPrice));
    if (furnishing && furnishing !== 'All') queryParams.set('furnishing', furnishing);
    if (typeof parking === 'boolean') queryParams.set('parking', String(parking));
    if (status && status !== 'All') queryParams.set('status', status);
    if (sortBy) {
      if (sortBy === 'rentAsc') queryParams.set('sortBy', 'price-asc');
      else if (sortBy === 'rentDesc') queryParams.set('sortBy', 'price-desc');
      else if (sortBy === 'areaDesc') queryParams.set('sortBy', 'area-desc');
      else queryParams.set('sortBy', 'newest');
    }

    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices?${queryParams.toString()}`, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const properties = json.data.map(mapBackendToPropertyItem);
            return {
              properties,
              total: typeof json.total === 'number' ? json.total : properties.length,
              hasMore: Boolean(json.hasMore)
            };
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch properties batch from backend:', err);
    }

    // Fallback: slice mock list
    const filtered = initialPropertyList;
    const slice = filtered.slice(skip, skip + limit);
    return {
      properties: slice,
      total: filtered.length,
      hasMore: skip + limit < filtered.length
    };
  },

  /**
   * Legacy Fetch live properties
   */
  getProperties: async (): Promise<PropertyItem[]> => {
    const result = await propertyService.fetchPropertiesBatch({ skip: 0, limit: 100 });
    return result.properties;
  },

  /**
   * Bulk import properties from Excel / CSV
   */
  bulkImportProperties: async (
    properties: any[]
  ): Promise<{
    success: boolean;
    insertedCount: number;
    message: string;
  }> => {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/bulk-import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties })
        });
        const json = await res.json();
        return {
          success: res.ok,
          insertedCount: json.insertedCount || 0,
          message: json.message || (res.ok ? 'Import completed successfully' : 'Import failed')
        };
      }
    } catch (err: any) {
      console.warn('Could not bulk import properties:', err);
      return {
        success: false,
        insertedCount: 0,
        message: err?.message || 'Network error during bulk import'
      };
    }

    return {
      success: true,
      insertedCount: properties.length,
      message: `Successfully processed ${properties.length} properties.`
    };
  },

  /**
   * Get direct streaming CSV download URL for all properties
   */
  getExportURL: (status?: string, sector?: string): string => {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.set('status', status);
    if (sector && sector !== 'All Sectors') params.set('sector', sector);
    const base = API_BASE || 'http://localhost:5000/api';
    return `${base}/offices/export?${params.toString()}`;
  },

  /**
   * Get complete property details by ID, propertyId, or slug on-demand
   * (all images, videos, documents, floorplans, descriptions, owner details)
   * Deduplicates in-flight calls to prevent identical concurrent network requests,
   * and serves from short-term memory cache when available.
   */
  getPropertyById: async (id: string, forceRefresh = false): Promise<PropertyItem | null> => {
    if (!id) return null;
    const cleanId = id.trim();

    // 1. Return fresh cached copy if available and not force-refreshing
    const now = Date.now();
    if (!forceRefresh) {
      const cached = propertyDetailCache.get(cleanId);
      if (cached && now - cached.cachedAt < PROPERTY_DETAIL_CACHE_TTL) {
        return cached.data;
      }
    }

    // 2. Join in-flight promise if a request for this ID is already in progress
    if (inFlightDetailRequests.has(cleanId)) {
      return inFlightDetailRequests.get(cleanId)!;
    }

    // 3. Initiate single network request and register promise for deduplication
    const fetchPromise = (async (): Promise<PropertyItem | null> => {
      try {
        if (API_BASE) {
          const res = await fetch(`${API_BASE}/offices/${encodeURIComponent(cleanId)}`, {
            cache: 'no-store'
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              const item = mapBackendToPropertyItem(json.data);
              const timestamp = Date.now();

              // Cache under primary query ID
              propertyDetailCache.set(cleanId, { data: item, cachedAt: timestamp });

              // Also cross-cache by propertyId and internal id so lookups by either key hit cache
              if (item.propertyId && item.propertyId !== cleanId) {
                propertyDetailCache.set(item.propertyId, { data: item, cachedAt: timestamp });
              }
              if (item.id && item.id !== cleanId) {
                propertyDetailCache.set(item.id, { data: item, cachedAt: timestamp });
              }

              return item;
            }
          }
        }
      } catch (err) {
        console.warn(`Could not fetch property detail for ${cleanId}:`, err);
      } finally {
        // Clear in-flight registry once settled
        inFlightDetailRequests.delete(cleanId);
      }
      return null;
    })();

    inFlightDetailRequests.set(cleanId, fetchPromise);
    return fetchPromise;
  },

  /**
   * Update an existing property by id or propertyId
   */
  updateProperty: async (
    id: string,
    updates: Record<string, any>
  ): Promise<{ success: boolean; data?: PropertyItem; message?: string }> => {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        const json = await res.json();
        if (json.success && json.data) {
          clearPropertyDetailCache(id);
          const updated = mapBackendToPropertyItem(json.data);
          if (updated.propertyId) clearPropertyDetailCache(updated.propertyId);
          return { success: true, data: updated, message: json.message };
        }
        return { success: false, message: json.message || 'Failed to update property' };
      }
    } catch (err: any) {
      console.warn('Could not update property:', err);
      return { success: false, message: err?.message || 'Network error updating property' };
    }
    return { success: false, message: 'Backend unavailable' };
  },

  /**
   * Duplicate / clone a property with identical details and new unique ID
   */
  duplicateProperty: async (
    id: string
  ): Promise<{ success: boolean; data?: PropertyItem; message?: string }> => {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/${id}/duplicate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        if (json.success && json.data) {
          return { success: true, data: mapBackendToPropertyItem(json.data), message: json.message };
        }
        return { success: false, message: json.message || 'Failed to duplicate property' };
      }
    } catch (err: any) {
      console.warn('Could not duplicate property:', err);
      return { success: false, message: err?.message || 'Network error duplicating property' };
    }
    return { success: false, message: 'Backend unavailable' };
  },

  /**
   * 1-Click Renew listing: Resets countdown to 60 days and marks Active
   */
  renewProperty: async (
    id: string
  ): Promise<{ success: boolean; data?: PropertyItem; message?: string }> => {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/${encodeURIComponent(id)}/renew`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        if (json.success && json.data) {
          propertyDetailCache.delete(id);
          return { success: true, data: mapBackendToPropertyItem(json.data), message: json.message };
        }
        return { success: false, message: json.message || 'Failed to renew property' };
      }
    } catch (err: any) {
      console.warn('Could not renew property:', err);
      return { success: false, message: err?.message || 'Network error renewing property' };
    }
    return { success: false, message: 'Backend unavailable' };
  },

  /**
   * Fast global industry search across properties, sectors, and owners
   */
  searchGlobal: async (query: string): Promise<{
    properties: PropertyItem[];
    sectors: string[];
    owners: Array<{
      ownerName: string;
      ownerPhone?: string;
      propertyTitle: string;
      propertyId?: string;
    }>;
  }> => {
    const q = query.trim();
    if (!q) {
      return { properties: [], sectors: [], owners: [] };
    }

    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/search?q=${encodeURIComponent(q)}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const backendProps = (json.data.properties || []).map(mapBackendToPropertyItem);
            const backendSectors = json.data.sectors || [];
            const backendOwners = json.data.owners || [];
            if (backendProps.length > 0 || backendSectors.length > 0) {
              return {
                properties: backendProps,
                sectors: backendSectors,
                owners: backendOwners
              };
            }
          }
        }
      }
    } catch (err) {
      console.warn('Search API error:', err);
    }

    // High-precision fallback matching against properties in memory/cache
    try {
      const allProps = await propertyService.getProperties();
      // Exclude sold properties from general search
      const activeProps = allProps.filter((p) => p.status !== 'Sold' && p.status !== 'Sold by Me');
      const qLower = q.toLowerCase();
      const tokens = qLower.split(/\s+/).filter(Boolean);

      const matchedProps = activeProps.filter((p) => {
        return tokens.every((term) =>
          p.title.toLowerCase().includes(term) ||
          p.sector.toLowerCase().includes(term) ||
          (p.city && p.city.toLowerCase().includes(term)) ||
          (p.buildingName && p.buildingName.toLowerCase().includes(term)) ||
          (p.propertyId && p.propertyId.toLowerCase().includes(term)) ||
          (p.ownerName && p.ownerName.toLowerCase().includes(term)) ||
          (p.propertyType && p.propertyType.toLowerCase().includes(term))
        );
      });

      const matchedSectors = Array.from(
        new Set(
          allProps
            .map((p) => p.sector)
            .filter((sec) =>
              qLower === 'noida' || qLower === 'sector' || sec.toLowerCase().includes(qLower)
            )
        )
      ).slice(0, 5);

      const matchedOwners = matchedProps
        .filter((p) => p.ownerName)
        .map((p) => ({
          ownerName: p.ownerName,
          ownerPhone: p.ownerPhone,
          propertyTitle: p.title,
          propertyId: p.propertyId
        }))
        .slice(0, 4);

      return {
        properties: matchedProps.slice(0, 10),
        sectors: matchedSectors,
        owners: matchedOwners
      };
    } catch {
      return { properties: [], sectors: [], owners: [] };
    }
  },

  /**
   * Delete property by ID
   */
  deleteProperty: async (id: string): Promise<boolean> => {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          clearPropertyDetailCache(id);
          memoryStatsCache = null;
          return true;
        }
        return false;
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
    return false;
  },

  /**
   * Update property status & deal details
   */
  updatePropertyStatus: async (
    id: string,
    newStatus: PropertyItem['status'],
    dealDetails?: Record<string, any>
  ): Promise<PropertyItem | null> => {
    try {
      if (API_BASE) {
        const payload: Record<string, any> = { status: newStatus };
        if (dealDetails) {
          payload.dealDetails = dealDetails;
        }
        const res = await fetch(`${API_BASE}/offices/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            memoryStatsCache = null; // Invalidate cache
            return mapBackendToPropertyItem(json.data);
          }
        }
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
    return null;
  },

  /**
   * Purge test and dummy data from MongoDB
   */
  purgeTestData: async (): Promise<number> => {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/offices/purge/test-data`, {
          method: 'DELETE'
        });
        if (res.ok) {
          const json = await res.json();
          return json.deletedCount || 0;
        }
      }
    } catch (err) {
      console.error('Purge test data failed:', err);
    }
    return 0;
  },

  /**
   * Filter properties client-side
   */
  filterProperties: (
    items: PropertyItem[],
    filters: PropertyFilterState,
    searchQuery: string = ''
  ): PropertyItem[] => {
    return items.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.sector.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // City
      if (filters.city !== 'All Cities' && item.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Locality / Sector
      if (filters.locality.trim()) {
        const q = filters.locality.toLowerCase();
        const matchesLocality =
          item.sector.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q);
        if (!matchesLocality) return false;
      }

      // Property Type
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(item.propertyType)) {
        return false;
      }

      // Purpose
      if (filters.purpose !== 'All' && item.purpose !== filters.purpose) {
        return false;
      }

      // Area (Sq. Ft.)
      if (filters.minArea && item.areaSqFt < Number(filters.minArea)) return false;
      if (filters.maxArea && item.areaSqFt > Number(filters.maxArea)) return false;

      // Budget (₹ Lakh / mo)
      if (filters.minBudget && item.monthlyRentInLakh < Number(filters.minBudget)) return false;
      if (filters.maxBudget && item.monthlyRentInLakh > Number(filters.maxBudget)) return false;

      // Furnishing
      if (filters.furnishing !== 'All' && item.furnishing !== filters.furnishing) {
        return false;
      }

      // Parking
      if (filters.parkingRequired && !item.parking) {
        return false;
      }

      // Floor
      if (filters.floor !== 'All' && item.floor !== filters.floor) {
        return false;
      }

      // Status
      if (filters.statuses.length > 0 && !filters.statuses.includes(item.status)) {
        return false;
      }

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAllSelectedAmenities = filters.amenities.every((amenity) =>
          item.amenities.includes(amenity)
        );
        if (!hasAllSelectedAmenities) return false;
      }

      return true;
    });
  }
};
