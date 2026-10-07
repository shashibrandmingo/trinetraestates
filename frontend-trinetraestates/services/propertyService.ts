import { BackendOfficeDoc, PropertyCardItem } from "@/types/property";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const BACKEND_HOST = API_BASE.replace(/\/api$/, "");

const BADGES = ["FEATURED", "READY TO MOVE", "HOT LISTING", "PREMIUM", "GRADE A", "EXCLUSIVE"];

// ─── IN-MEMORY CACHE (2-MINUTE TTL) FOR INSTANT 0ms RESPONSES ────────────────
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

// In-memory cache for active properties array
let activePropertiesCache: CacheEntry<PropertyCardItem[]> | null = null;

// In-memory cache for individual property details keyed by lowercase slug/id
const propertyDetailsCache = new Map<string, CacheEntry<BackendOfficeDoc>>();

export function resolvePropertyImage(rawUrl?: string): string {
  if (!rawUrl || rawUrl.trim() === "" || rawUrl === "/images/sample-office.png") {
    return "";
  }
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("data:")) {
    return rawUrl;
  }
  if (rawUrl.startsWith("/uploads/")) {
    return `${BACKEND_HOST}${rawUrl}`;
  }
  if (rawUrl.startsWith("uploads/")) {
    return `${BACKEND_HOST}/${rawUrl}`;
  }
  if (rawUrl.startsWith("/")) {
    return rawUrl;
  }
  return `${BACKEND_HOST}/${rawUrl}`;
}

export const propertyService = {
  /**
   * Clear in-memory caches (useful after adding or editing properties)
   */
  clearPropertyCache: () => {
    activePropertiesCache = null;
    propertyDetailsCache.clear();
  },

  /**
   * Fetch active commercial properties from MongoDB backend (Cached for 2 minutes)
   */
  getActiveProperties: async (limit = 50, forceRefresh = false): Promise<PropertyCardItem[]> => {
    // 1. Check in-memory cache first (0ms instantaneous response!)
    const now = Date.now();
    if (!forceRefresh && activePropertiesCache && (now - activePropertiesCache.timestamp < CACHE_TTL_MS)) {
      return activePropertiesCache.data.slice(0, limit);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const queryLimit = Math.max(limit, 50);

      const res = await fetch(`${API_BASE}/offices?status=Active&limit=${queryLimit}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch properties: ${res.status}`);
      }

      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mappedList: PropertyCardItem[] = json.data.map((office: BackendOfficeDoc, idx: number) => {
          const areaNum = Number(office.areaSqFt || office.builtUpAreaSqFt || office.carpetAreaSqFt || 0);
          const rawSector = office.location?.sector || office.location?.locality || office.location?.address || "";
          const sector = rawSector.trim();
          const location = sector;
          const buildingName = (office.buildingName || "").trim();
          const locality = (office.location?.locality || "").trim();
          const address = (office.location?.address || "").trim();
          const city = (office.location?.city || "Noida").trim();

          // Use explicit admin specs or realistic defaults calculated from area
          const workstations = office.workstations && office.workstations > 0
            ? office.workstations
            : (areaNum > 0 ? Math.max(4, Math.round(areaNum / 65)) : 10);

          const cabins = office.cabins && office.cabins > 0
            ? office.cabins
            : (areaNum > 0 ? Math.max(1, Math.round(areaNum / 1200)) : 1);

          const meetingRooms = office.meetingRooms && office.meetingRooms > 0
            ? office.meetingRooms
            : Math.max(1, Math.floor(cabins / 2));

          const badge = office.badge && office.badge.trim() !== ""
            ? office.badge.toUpperCase()
            : (office.dataAge && office.dataAge !== "Ready to Move"
              ? office.dataAge.toUpperCase()
              : office.availabilityStatus && office.availabilityStatus !== "Available"
              ? office.availabilityStatus.toUpperCase()
              : BADGES[idx % BADGES.length]);

          // Clean title
          const title = (office.title || "Office Space").replace(/\s*\(Copy\)+/gi, "").trim();

          // 1. Pick designated cover image from images array if marked isCover, else thumbnail/imageUrl/first image
          let rawImg = "";
          if (office.images && Array.isArray(office.images) && office.images.length > 0) {
            const coverObj = office.images.find((im) => typeof im === "object" && im.isCover);
            if (coverObj && coverObj.url) {
              rawImg = coverObj.url;
            } else {
              const first = office.images[0];
              rawImg = typeof first === "string" ? first : first?.url || "";
            }
          }
          if (!rawImg) {
            rawImg = office.thumbnail || office.imageUrl || "";
          }

          const img = resolvePropertyImage(rawImg);

          // Property Category Mapping: Support multiple categories from office.categories array or office.category
          const explicitList: string[] = [];
          if (office.category && office.category.trim()) {
            explicitList.push(office.category.trim());
          }
          if (office.categories && Array.isArray(office.categories)) {
            office.categories.forEach((cat) => {
              if (cat && typeof cat === "string" && cat.trim() && !explicitList.includes(cat.trim())) {
                explicitList.push(cat.trim());
              }
            });
          }

          const pType = (office.propertyType || "").toLowerCase();
          const furnishing = (office.furnishing || "").toLowerCase();

          let propertyType = explicitList[0] || "Furnished Offices";
          const categories: string[] = ["All Properties"];

          if (explicitList.length > 0) {
            explicitList.forEach((cat) => {
              if (!categories.includes(cat)) {
                categories.push(cat);
              }
            });
            if (explicitList.some((c) => c.toLowerCase().includes("furnished")) && !categories.includes("Managed Offices")) {
              categories.push("Managed Offices");
            }
          } else {
            if (pType.includes("retail") || pType.includes("shop")) {
              propertyType = "Retail Spaces";
              categories.push("Retail Spaces");
            } else if (pType.includes("co-working") || pType.includes("coworking")) {
              propertyType = "Coworking Spaces";
              categories.push("Coworking Spaces");
            } else if (
              furnishing.includes("bare shell") ||
              furnishing.includes("unfurnished") ||
              furnishing.includes("semi")
            ) {
              propertyType = "Unfurnished Offices";
              categories.push("Unfurnished Offices");
            } else {
              propertyType = "Furnished Offices";
              categories.push("Furnished Offices", "Managed Offices");
            }
          }

          // Format price (retained in data layer for future display)
          let priceStr = "Price on Request";
          const rawPrice = office.monthlyRentInLakh !== undefined && office.monthlyRentInLakh !== null && Number(office.monthlyRentInLakh) > 0
            ? Number(office.monthlyRentInLakh)
            : Number(office.price || 0);

          if (rawPrice > 0) {
            if (rawPrice >= 100000) {
              priceStr = `₹ ${(rawPrice / 100000).toFixed(2)} L / mo`;
            } else if (rawPrice >= 1000) {
              priceStr = `₹ ${(rawPrice / 1000).toFixed(0)} K / mo`;
            } else if (rawPrice <= 100) {
              // Stored as Lakhs (e.g. 0.8 -> ₹ 0.8 L / mo, 1.76 -> ₹ 1.76 L / mo)
              priceStr = `₹ ${rawPrice} L / mo`;
            } else {
              priceStr = `₹ ${rawPrice.toLocaleString("en-IN")} / mo`;
            }
          }

          // Generate clean unique slug
          const slug = office.slug || (office.propertyId ? office.propertyId.toLowerCase() : `office-${idx + 1}`);

          return {
            id: office._id || office.propertyId || idx + 1,
            title,
            sector,
            location,
            buildingName,
            locality,
            address,
            city,
            badge,
            area: areaNum > 0 ? `${areaNum.toLocaleString("en-IN")} Sq. Ft.` : "Area on Request",
            workstations: `${workstations} Workstations`,
            cabins: `${cabins} ${cabins === 1 ? "Cabin" : "Cabins"}`,
            meetingRooms: `${meetingRooms} Meeting Room${meetingRooms > 1 ? "s" : ""}`,
            pantry: "Pantry Area",
            image: img,
            slug,
            category: propertyType,
            propertyType,
            categories,
            price: priceStr,
            priceOnRequest: !office.price || Number(office.price) <= 0,
          };
        });

        // Store active list in in-memory cache
        activePropertiesCache = {
          data: mappedList,
          timestamp: Date.now(),
        };

        return mappedList.slice(0, limit);
      }
      return [];
    } catch (err) {
      console.warn("[PropertyService] Backend properties fetch bypassed:", err);
      // Fallback to cache if available
      if (activePropertiesCache && activePropertiesCache.data.length > 0) {
        return activePropertiesCache.data.slice(0, limit);
      }
      return [];
    }
  },

  /**
   * Fetch a single property full details by slug or propertyId (Cached for 2 minutes)
   */
  getPropertyBySlugOrId: async (slugOrId: string, forceRefresh = false): Promise<BackendOfficeDoc | null> => {
    if (!slugOrId) return null;
    const cacheKey = slugOrId.toLowerCase().trim();
    const now = Date.now();

    // 1. Check in-memory cache first (0ms instantaneous response!)
    if (!forceRefresh && propertyDetailsCache.has(cacheKey)) {
      const entry = propertyDetailsCache.get(cacheKey)!;
      if (now - entry.timestamp < CACHE_TTL_MS) {
        return entry.data;
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${API_BASE}/offices/${slugOrId}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return null;
      }

      const json = await res.json();
      if (json.success && json.data) {
        const doc = json.data as BackendOfficeDoc;
        // Fix image URLs inside doc
        if (doc.thumbnail) {
          doc.thumbnail = resolvePropertyImage(doc.thumbnail);
        }
        if (doc.imageUrl) {
          doc.imageUrl = resolvePropertyImage(doc.imageUrl);
        }
        if (doc.images && Array.isArray(doc.images)) {
          // Sort images so that the Cover image is always first (index 0)
          const sorted = [...doc.images].sort((a, b) => {
            const aCover = typeof a === "object" && a.isCover ? 1 : 0;
            const bCover = typeof b === "object" && b.isCover ? 1 : 0;
            return bCover - aCover;
          });

          doc.images = sorted
            .map((im) => {
              const url = typeof im === "string" ? im : im.url;
              const isCover = typeof im === "object" ? !!im.isCover : false;
              return {
                url: resolvePropertyImage(url),
                isCover,
              };
            })
            .filter((im) => Boolean(im.url));
        }

        // Cache document in memory under cacheKey, slug, propertyId, and _id
        const entry: CacheEntry<BackendOfficeDoc> = {
          data: doc,
          timestamp: Date.now(),
        };
        propertyDetailsCache.set(cacheKey, entry);
        if (doc.slug) propertyDetailsCache.set(doc.slug.toLowerCase().trim(), entry);
        if (doc.propertyId) propertyDetailsCache.set(doc.propertyId.toLowerCase().trim(), entry);
        if (doc._id) propertyDetailsCache.set(String(doc._id).toLowerCase().trim(), entry);

        return doc;
      }
      return null;
    } catch (err) {
      console.warn("[PropertyService] Single property fetch bypassed:", err);
      if (propertyDetailsCache.has(cacheKey)) {
        return propertyDetailsCache.get(cacheKey)!.data;
      }
      return null;
    }
  },
};

