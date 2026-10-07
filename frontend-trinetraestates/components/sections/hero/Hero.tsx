"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { propertyService } from "@/services/propertyService";
import { PropertyCardItem } from "@/types/property";
import EnquiryModal from "@/components/modals/EnquiryModal";
import VideoModal from "@/components/modals/VideoModal";
import { NOIDA_SECTORS, SPACE_TYPES, STATS } from "@/lib/constants";

/**
 * Smart Sector Normalizer:
 * Extracts sector tokens and numbers from strings like:
 * "Sector 62", "sec 62", "sec-62", "sector-62", "sector62", "62", "Sector 132", "132", "sec 15", "expressway"
 */
function getSectorNumbers(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const set = new Set<string>();

  // 1. Explicit sector mentions: sec 62, sector 62, sec-62, sector-62, sector62, sec62, sec.62
  const secRegex = /(?:sec|sector|sect|s)[\s\-.]*(\d{1,3}[a-z]?)/gi;
  let match;
  while ((match = secRegex.exec(lower)) !== null) {
    if (match[1]) set.add(match[1].toLowerCase());
  }

  // 2. Standalone numbers between 1 and 200 (Noida commercial sectors are 1 to 168+)
  const tokens = lower.split(/[\s,./\-_]+/);
  tokens.forEach((t) => {
    if (/^\d{1,3}[a-z]?$/.test(t)) {
      const num = parseInt(t, 10);
      if (num >= 1 && num <= 200) {
        set.add(t.toLowerCase());
      }
    }
  });

  return Array.from(set);
}

/**
 * Checks if a property matches a sector query or selected location
 */
function checkSectorMatch(prop: PropertyCardItem, queryOrLocation: string): boolean {
  if (!queryOrLocation) return true;
  const target = queryOrLocation.toLowerCase().trim();
  if (target === "all locations in noida" || target === "all") return true;

  const propSector = (prop.sector || "").toLowerCase();
  const propLocation = (prop.location || "").toLowerCase();
  const propAddress = (prop.address || "").toLowerCase();
  const propLocality = (prop.locality || "").toLowerCase();
  const propTitle = (prop.title || "").toLowerCase();

  const combinedPropText = `${propSector} ${propLocation} ${propAddress} ${propLocality} ${propTitle}`;

  // 1. Direct substring match
  if (
    propSector.includes(target) ||
    target.includes(propSector) ||
    propLocation.includes(target) ||
    target.includes(propLocation) ||
    propAddress.includes(target) ||
    propTitle.includes(target)
  ) {
    return true;
  }

  // 2. Expressway check
  if (target.includes("expressway") || target.includes("express way")) {
    if (
      combinedPropText.includes("expressway") ||
      combinedPropText.includes("express way") ||
      ["125", "126", "132", "135", "136", "142"].some((s) => combinedPropText.includes(s))
    ) {
      return true;
    }
  }

  // 3. Normalized sector number match (e.g. "62" <-> "Sector 62", "sec-62" <-> "Sector 62")
  const targetSectorNumbers = getSectorNumbers(target);
  const propSectorNumbers = getSectorNumbers(combinedPropText);

  if (targetSectorNumbers.length > 0 && propSectorNumbers.length > 0) {
    const hasCommonSector = targetSectorNumbers.some((num) => propSectorNumbers.includes(num));
    if (hasCommonSector) return true;
  }

  return false;
}

/**
 * Hero Section — Ultra-luxury real estate hero banner
 * - Single static hero banner with background image 'herobanner.png'
 * - Real-Time Search & Live Filter Bar (Sector/Location, Property Type, Area, Keywords)
 * - 0ms instant cached MongoDB data connection
 * - Ultra-luxurious floating search HUD with proper z-index stacking above About section
 */
export default function Hero() {
  const router = useRouter();

  // ─── DATA STATE ───
  const [properties, setProperties] = useState<PropertyCardItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);

  // ─── FILTER CONTROLS STATE ───
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [area, setArea] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"location" | "type" | "area" | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  // ─── MODAL STATES ───
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const AREA_RANGES = [
    "500 – 1,500 Sq. Ft.",
    "1,500 – 5,000 Sq. Ft.",
    "5,000 – 15,000 Sq. Ft.",
    "15,000+ Sq. Ft.",
  ];

  // ─── FETCH BACKEND PROPERTIES (CACHED WITH 2-MINUTE TTL) ───
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProperties(true);
    propertyService
      .getActiveProperties(50)
      .then((data) => {
        if (isMounted) {
          setProperties(data || []);
          setIsLoadingProperties(false);
        }
      })
      .catch((err) => {
        console.warn("[Hero] Error loading properties:", err);
        if (isMounted) setIsLoadingProperties(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── DYNAMICALLY COMPUTE AVAILABLE SECTORS & PROPERTY TYPES ───
  const availableSectors = useMemo(() => {
    const set = new Set<string>(NOIDA_SECTORS);
    properties.forEach((p) => {
      if (p.sector && p.sector.trim()) {
        set.add(p.sector.trim());
      }
    });
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  }, [properties]);

  const availablePropertyTypes = useMemo(() => {
    const set = new Set<string>(SPACE_TYPES);
    properties.forEach((p) => {
      if (p.category && p.category.trim() && p.category !== "All Properties") {
        set.add(p.category.trim());
      }
      if (p.propertyType && p.propertyType.trim()) {
        set.add(p.propertyType.trim());
      }
    });
    return Array.from(set);
  }, [properties]);

  // ─── REAL-TIME SECTOR, BUILDING & KEYWORD FILTERING ───
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. Location Dropdown Filter
      if (location && location !== "All Locations in Noida") {
        if (!checkSectorMatch(prop, location)) {
          return false;
        }
      }

      // 2. Property Type Dropdown Filter
      if (propertyType && propertyType !== "All Property Types") {
        const target = propertyType.toLowerCase().trim();
        const cat = (prop.category || "").toLowerCase();
        const pType = (prop.propertyType || "").toLowerCase();
        const categories = (prop.categories || []).map((c) => c.toLowerCase());

        const typeMatches =
          cat.includes(target) ||
          target.includes(cat) ||
          pType.includes(target) ||
          target.includes(pType) ||
          categories.some((c) => c.includes(target) || target.includes(c));

        const synonymMatches =
          (target.includes("furnish") && (cat.includes("furnish") || pType.includes("furnish"))) ||
          (target.includes("cowork") && (cat.includes("cowork") || pType.includes("cowork"))) ||
          (target.includes("retail") && (cat.includes("retail") || pType.includes("retail"))) ||
          (target.includes("bare shell") && (cat.includes("unfurnish") || cat.includes("bare") || pType.includes("bare")));

        if (!typeMatches && !synonymMatches) return false;
      }

      // 3. Area Range Filter
      if (area && area !== "Any Size / Area") {
        const rawDigits = (prop.area || "").replace(/[^0-9]/g, "");
        const areaNum = rawDigits ? parseInt(rawDigits, 10) : 0;

        if (areaNum > 0) {
          if (area.includes("500") && area.includes("1,500")) {
            if (areaNum < 500 || areaNum > 1500) return false;
          } else if (area.includes("1,500") && area.includes("5,000")) {
            if (areaNum < 1500 || areaNum > 5000) return false;
          } else if (area.includes("5,000") && area.includes("15,000")) {
            if (areaNum < 5000 || areaNum > 15000) return false;
          } else if (area.includes("15,000+")) {
            if (areaNum < 15000) return false;
          }
        }
      }

      // 4. Real-time Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim();
        const querySectorNums = getSectorNumbers(query);
        const isSectorQuery = querySectorNums.length > 0;

        // If query is specifically a sector query (e.g. "62", "sec 62", "sector 15")
        if (isSectorQuery) {
          const matchesSec = checkSectorMatch(prop, query);
          if (matchesSec) {
            // Check if there are non-sector keywords (e.g. "Pinnacle Sector 15")
            const nonSecTokens = query
              .toLowerCase()
              .replace(/(?:sec|sector|sect|s)[\s\-.]*\d{1,3}[a-z]?/gi, "")
              .replace(/\b\d{1,3}\b/g, "")
              .split(/\s+/)
              .filter((t) => t.length > 1);

            if (nonSecTokens.length === 0) {
              return true; // Exact sector match!
            }
          }
        }

        // Comprehensive keyword search across all fields
        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
        const searchableBlob = [
          prop.title,
          prop.sector,
          prop.location,
          prop.buildingName,
          prop.locality,
          prop.address,
          prop.city,
          prop.category,
          prop.propertyType,
          prop.area,
          prop.workstations,
          prop.cabins,
          prop.badge,
          ...(prop.categories || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const allTokensMatch = tokens.every((token) => {
          const cleanToken = token.replace(/[-_.]/g, " ");
          if (searchableBlob.includes(token)) return true;
          if (cleanToken !== token && cleanToken.split(/\s+/).every((t) => searchableBlob.includes(t))) return true;

          // Check if token represents a sector number
          const tokenSectors = getSectorNumbers(token);
          if (tokenSectors.length > 0 && checkSectorMatch(prop, token)) return true;

          return false;
        });

        if (!allTokensMatch) return false;
      }

      return true;
    });
  }, [properties, location, propertyType, area, searchQuery]);

  const hasActiveFilters = Boolean(location || propertyType || area || searchQuery.trim());

  // ─── RESET FILTERS ───
  const handleResetFilters = useCallback(() => {
    setLocation("");
    setPropertyType("");
    setArea("");
    setSearchQuery("");
    setIsResultsOpen(false);
  }, []);

  // ─── CLOSE DROPDOWNS & RESULTS ON CLICK OUTSIDE OR ESCAPE ───
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsResultsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setIsResultsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ─── FOCUS SEARCH INPUT WHEN EXPANDED ───
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // ─── SCROLL TO FEATURED PROPERTIES & DISPATCH FILTER ───
  const handleViewAllSpaces = useCallback(() => {
    setIsResultsOpen(false);
    const featuredSection = document.getElementById("featured-properties");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("trinetra:filter", {
          detail: {
            category: propertyType,
            location,
            searchQuery,
          },
        })
      );
    }
  }, [propertyType, location, searchQuery]);

  // ─── SEARCH SUBMISSION HANDLER ───
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isResultsOpen) {
      setIsResultsOpen(true);
    } else {
      handleViewAllSpaces();
    }
  };

  return (
    <>

      <section
        className="relative z-30 min-h-screen flex items-center bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bgbanners/herobanner.png')",
          backgroundColor: "var(--color-bg-dark)",
        }}
      >
        {/* ── AMBIENT GRADIENT OVERLAY (Dark gradient for high contrast readability) ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/35 md:from-black/90 md:via-black/70 md:to-transparent pointer-events-none" />

        {/* ── HERO CONTENT WRAPPER ── */}
        <div className="site-container relative z-10 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            
            {/* ── LEFT COLUMN: Main Hero Text & Interactive Filter ── */}
            <div className="xl:col-span-11 space-y-5 sm:space-y-6">
              
              {/* Eyebrow / Subtitle (2 Lines) */}
              <div>
                <p className="section-subtitle items-start">
                  <span className="inline-block w-6 sm:w-7 h-[1.5px] bg-[var(--color-gold)] mt-2 shrink-0" />
                  <span className="leading-tight text-[11px] sm:text-[12px]">
                    PREMIUM SPACES.
                    <br />
                    GREATER POSSIBILITIES.
                  </span>
                </p>
              </div>

              {/* Main H1 Heading (2 Lines — Luxury & Crisp) */}
              <h1 className="font-heading text-[30px] sm:text-[42px] lg:text-[50px] font-medium leading-[1.16] text-white max-w-3xl">
                Find the Perfect
                <br />
                <span className="text-gold font-normal">Office Space</span> in Noida
              </h1>

              {/* Description */}
              <p className="text-body-dark max-w-xl text-[14px] sm:text-[15.5px] leading-relaxed">
                Modern workspaces for growing businesses.
                <br className="hidden sm:block" />
                From startups to enterprises — we help you find a space that fits.
              </p>

              {/* ── LUXURY FLOATING SEARCH FILTER BAR ── */}
              <div ref={filterBarRef} className="pt-2 sm:pt-3 relative z-40">
                <div
                  className={`
                    bg-white rounded-2xl md:rounded-full p-2.5 sm:p-3 md:pl-5 md:pr-2.5
                    shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                    border border-white/20
                    transition-all duration-300 relative z-40
                    ${isSearchExpanded ? "w-full max-w-5xl" : "w-full max-w-4xl"}
                  `}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-2.5 md:gap-3">
                    
                    {/* ── 3 FILTERS IN A SINGLE COMPACT ROW ON MOBILE ── */}
                    <div className="grid grid-cols-3 md:flex md:flex-1 md:items-center divide-x divide-black/10 md:divide-x-0 gap-0.5 sm:gap-1 md:gap-3">
                      
                      {/* Filter 1: Select Location / Sector (Custom Theme Dropdown) */}
                      <div className="relative flex-1 min-w-0 pr-1 md:pr-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdown(activeDropdown === "location" ? null : "location");
                          }}
                          className="w-full flex items-center justify-between gap-1 sm:gap-1.5 md:gap-2 px-1 sm:px-2 py-1 md:px-1 text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 min-w-0">
                            <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-gold)] shrink-0 group-hover:scale-105 transition-transform">
                              <i className="fa-solid fa-location-dot text-[10px] sm:text-[11px] md:text-[12px]" />
                            </span>
                            <div className="min-w-0">
                              <span className="block text-[9px] sm:text-[10px] md:text-[10.5px] font-semibold text-[#141414] uppercase tracking-wider font-sans leading-tight truncate">
                                <span className="hidden md:inline">Select </span>Location
                              </span>
                              {/* Selected sector displayed clearly on desktop */}
                              <span
                                className={`hidden md:block text-[12px] sm:text-[12.5px] truncate font-sans mt-0.5 ${
                                  location
                                    ? "text-[var(--color-gold)] font-medium"
                                    : "text-[#555] font-light"
                                }`}
                              >
                                {location || "Sector, Landmark or Area"}
                              </span>
                              {/* Selected sector displayed on mobile */}
                              {location && (
                                <span className="block md:hidden text-[9px] text-[var(--color-gold)] font-medium truncate leading-tight">
                                  {location}
                                </span>
                              )}
                            </div>
                          </div>
                          <i
                            className={`fa-solid fa-chevron-down text-[8px] sm:text-[8.5px] md:text-[9.5px] text-gray-400 transition-transform duration-200 shrink-0 ${
                              activeDropdown === "location" ? "rotate-180 text-[var(--color-gold)]" : ""
                            }`}
                          />
                        </button>

                        {/* Custom Dark / Gold Theme Dropdown Menu */}
                        {activeDropdown === "location" && (
                          <div className="absolute left-0 top-[calc(100%+8px)] w-56 sm:w-60 max-h-56 overflow-y-auto bg-[#141414] border border-[var(--color-gold-border)] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.7)] p-1.5 z-50 animate-[fadeIn_0.2s_ease-out]">
                            <div
                              onClick={() => {
                                setLocation("");
                                setActiveDropdown(null);
                                setIsResultsOpen(true);
                              }}
                              className="px-2.5 py-1.5 text-xs text-white/70 hover:bg-[var(--color-gold)] hover:text-white rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                            >
                              <span>All Locations in Noida</span>
                              {!location && <i className="fa-solid fa-check text-[10px] text-gold" />}
                            </div>
                            {availableSectors.map((sec) => (
                              <div
                                key={sec}
                                onClick={() => {
                                  setLocation(sec);
                                  setActiveDropdown(null);
                                  setIsResultsOpen(true);
                                }}
                                className={`px-2.5 py-1.5 text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                                  location === sec
                                    ? "bg-[var(--color-gold)] text-white font-medium"
                                    : "text-white/80 hover:bg-[var(--color-gold-light)] hover:text-white"
                                }`}
                              >
                                <span>{sec}</span>
                                {location === sec && <i className="fa-solid fa-check text-[10px]" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Vertical Divider (Desktop) */}
                      <div className="hidden md:block w-[1px] h-7 bg-black/10 shrink-0" />

                      {/* Filter 2: Property Type (Custom Theme Dropdown) */}
                      <div className="relative flex-1 min-w-0 px-1 md:px-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdown(activeDropdown === "type" ? null : "type");
                          }}
                          className="w-full flex items-center justify-between gap-1 sm:gap-1.5 md:gap-2 px-1 sm:px-2 py-1 md:px-1 text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 min-w-0">
                            <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-gold)] shrink-0 group-hover:scale-105 transition-transform">
                              <i className="fa-solid fa-building text-[10px] sm:text-[11px] md:text-[12px]" />
                            </span>
                            <div className="min-w-0">
                              <span className="block text-[9px] sm:text-[10px] md:text-[10.5px] font-semibold text-[#141414] uppercase tracking-wider font-sans leading-tight truncate">
                                <span className="md:hidden">Type</span>
                                <span className="hidden md:inline">Property Type</span>
                              </span>
                              <span
                                className={`hidden md:block text-[12px] sm:text-[12.5px] truncate font-sans mt-0.5 ${
                                  propertyType
                                    ? "text-[var(--color-gold)] font-medium"
                                    : "text-[#555] font-light"
                                }`}
                              >
                                {propertyType || "Office, Coworking..."}
                              </span>
                              {propertyType && (
                                <span className="block md:hidden text-[9px] text-[var(--color-gold)] font-medium truncate leading-tight">
                                  {propertyType}
                                </span>
                              )}
                            </div>
                          </div>
                          <i
                            className={`fa-solid fa-chevron-down text-[8px] sm:text-[8.5px] md:text-[9.5px] text-gray-400 transition-transform duration-200 shrink-0 ${
                              activeDropdown === "type" ? "rotate-180 text-[var(--color-gold)]" : ""
                            }`}
                          />
                        </button>

                        {/* Custom Dark / Gold Theme Dropdown Menu */}
                        {activeDropdown === "type" && (
                          <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-[calc(100%+8px)] w-56 sm:w-60 max-h-56 overflow-y-auto bg-[#141414] border border-[var(--color-gold-border)] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.7)] p-1.5 z-50 animate-[fadeIn_0.2s_ease-out]">
                            <div
                              onClick={() => {
                                setPropertyType("");
                                setActiveDropdown(null);
                                setIsResultsOpen(true);
                              }}
                              className="px-2.5 py-1.5 text-xs text-white/70 hover:bg-[var(--color-gold)] hover:text-white rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                            >
                              <span>All Property Types</span>
                              {!propertyType && <i className="fa-solid fa-check text-[10px] text-gold" />}
                            </div>
                            {availablePropertyTypes.map((type) => (
                              <div
                                key={type}
                                onClick={() => {
                                  setPropertyType(type);
                                  setActiveDropdown(null);
                                  setIsResultsOpen(true);
                                }}
                                className={`px-2.5 py-1.5 text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                                  propertyType === type
                                    ? "bg-[var(--color-gold)] text-white font-medium"
                                    : "text-white/80 hover:bg-[var(--color-gold-light)] hover:text-white"
                                }`}
                              >
                                <span>{type}</span>
                                {propertyType === type && <i className="fa-solid fa-check text-[10px]" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Vertical Divider (Desktop) */}
                      <div className="hidden md:block w-[1px] h-7 bg-black/10 shrink-0" />

                      {/* Filter 3: Area (Sq. Ft.) (Custom Theme Dropdown) */}
                      <div className="relative flex-1 min-w-0 pl-1 md:pl-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdown(activeDropdown === "area" ? null : "area");
                          }}
                          className="w-full flex items-center justify-between gap-1 sm:gap-1.5 md:gap-2 px-1 sm:px-2 py-1 md:px-1 text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 min-w-0">
                            <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-gold)] shrink-0 group-hover:scale-105 transition-transform">
                              <i className="fa-solid fa-vector-square text-[10px] sm:text-[11px] md:text-[12px]" />
                            </span>
                            <div className="min-w-0">
                              <span className="block text-[9px] sm:text-[10px] md:text-[10.5px] font-semibold text-[#141414] uppercase tracking-wider font-sans leading-tight truncate">
                                <span className="md:hidden">Area</span>
                                <span className="hidden md:inline">Area (Sq. Ft.)</span>
                              </span>
                              <span
                                className={`hidden md:block text-[12px] sm:text-[12.5px] truncate font-sans mt-0.5 ${
                                  area
                                    ? "text-[var(--color-gold)] font-medium"
                                    : "text-[#555] font-light"
                                }`}
                              >
                                {area || "Your budget / size"}
                              </span>
                              {area && (
                                <span className="block md:hidden text-[9px] text-[var(--color-gold)] font-medium truncate leading-tight">
                                  {area}
                                </span>
                              )}
                            </div>
                          </div>
                          <i
                            className={`fa-solid fa-chevron-down text-[8px] sm:text-[8.5px] md:text-[9.5px] text-gray-400 transition-transform duration-200 shrink-0 ${
                              activeDropdown === "area" ? "rotate-180 text-[var(--color-gold)]" : ""
                            }`}
                          />
                        </button>

                        {/* Custom Dark / Gold Theme Dropdown Menu */}
                        {activeDropdown === "area" && (
                          <div className="absolute right-0 md:right-auto md:left-0 top-[calc(100%+8px)] w-56 sm:w-60 max-h-56 overflow-y-auto bg-[#141414] border border-[var(--color-gold-border)] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.7)] p-1.5 z-50 animate-[fadeIn_0.2s_ease-out]">
                            <div
                              onClick={() => {
                                setArea("");
                                setActiveDropdown(null);
                                setIsResultsOpen(true);
                              }}
                              className="px-2.5 py-1.5 text-xs text-white/70 hover:bg-[var(--color-gold)] hover:text-white rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                            >
                              <span>Any Size / Area</span>
                              {!area && <i className="fa-solid fa-check text-[10px] text-gold" />}
                            </div>
                            {AREA_RANGES.map((rng) => (
                              <div
                                key={rng}
                                onClick={() => {
                                  setArea(rng);
                                  setActiveDropdown(null);
                                  setIsResultsOpen(true);
                                }}
                                className={`px-2.5 py-1.5 text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                                  area === rng
                                    ? "bg-[var(--color-gold)] text-white font-medium"
                                    : "text-white/80 hover:bg-[var(--color-gold-light)] hover:text-white"
                                }`}
                              >
                                <span>{rng}</span>
                                {area === rng && <i className="fa-solid fa-check text-[10px]" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* ── EXPANDABLE SEARCH BUTTON & INPUT (Contained Inside Pill) ── */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 pt-0.5 md:pt-0 shrink-0">
                      {/* Animated Expanding Input Field */}
                      {isSearchExpanded && (
                        <div className="relative w-full md:w-56 animate-[fadeIn_0.25s_ease-out]">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSearchQuery(val);
                              // Open live results when user types
                              if (val.trim().length > 0) {
                                setIsResultsOpen(true);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSearchSubmit();
                              if (e.key === "Escape") {
                                setIsSearchExpanded(false);
                                setIsResultsOpen(false);
                              }
                            }}
                            placeholder="Sector, building, workstations..."
                            className="w-full bg-[#f4f4f4] border border-gray-300 rounded-full pl-3.5 pr-8 py-2 text-xs text-[#141414] placeholder-gray-400 focus:outline-none focus:border-[var(--color-gold)] font-sans"
                          />
                          {/* Close X Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery("");
                              if (!location && !propertyType && !area) {
                                setIsResultsOpen(false);
                              }
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-[11px] p-0.5 cursor-pointer"
                            aria-label="Clear search input"
                          >
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </div>
                      )}

                      {/* Main Gold Search Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSearchExpanded) {
                            setIsSearchExpanded(true);
                            if (hasActiveFilters) {
                              setIsResultsOpen(true);
                            }
                          } else {
                            handleSearchSubmit();
                          }
                        }}
                        aria-label="Search properties"
                        className="
                          w-full md:w-11 md:h-11 h-9 sm:h-10
                          rounded-xl md:rounded-full
                          bg-[var(--color-gold)] hover:bg-[var(--color-gold-hover)]
                          text-white
                          flex items-center justify-center gap-2
                          shadow-[0_4px_14px_rgba(198,153,96,0.4)]
                          transition-all duration-300 hover:scale-105 cursor-pointer relative
                        "
                      >
                        <i className="fa-solid fa-magnifying-glass text-[12px] sm:text-[13px] md:text-[14px]" />
                        <span className="md:hidden font-medium text-[12px] sm:text-[12.5px]">
                          {hasActiveFilters
                            ? `Search Spaces (${filteredProperties.length})`
                            : "Search Spaces"}
                        </span>

                        {/* Desktop active badge dot */}
                        {hasActiveFilters && (
                          <span className="hidden md:block absolute -top-1 -right-1 w-3 h-3 bg-white text-[var(--color-gold)] rounded-full text-[8px] font-bold border border-[var(--color-gold)]" />
                        )}
                      </button>
                    </div>

                  </div>
                </div>

                {/* ── ULTRA-LUXURY FLOATING SEARCH HUD (COMPACT, SLENDER FONTS, SLEEK LUXURY SPACING) ── */}
                {isResultsOpen && (
                  <div
                    className="
                      absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)]
                      w-[calc(100vw-28px)] sm:w-full max-w-xl sm:max-w-2xl
                      bg-[#121110]/95 backdrop-blur-2xl
                      border border-[#c69960]/30
                      rounded-xl sm:rounded-2xl
                      shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(198,153,96,0.1)]
                      overflow-hidden z-50
                      animate-[fadeIn_0.2s_ease-out]
                      font-sans
                      max-h-[min(310px,46vh)]
                      flex flex-col
                    "
                  >
                    {/* Compact Refined Header */}
                    <div className="px-3 sm:px-3.5 py-1.5 sm:py-2 border-b border-white/10 flex items-center justify-between gap-2.5 bg-gradient-to-r from-[#c69960]/10 via-white/[0.02] to-transparent shrink-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#c69960] to-[#96713e] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <i className="fa-solid fa-building-circle-check text-[9px]" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <div
                              style={{ fontSize: "11px", fontWeight: 500, lineHeight: 1.2 }}
                              className="font-sans text-white/90 tracking-normal truncate"
                            >
                              {hasActiveFilters ? "Matching Workspaces" : "Available Office Spaces"}
                            </div>
                            <span className="text-[8.5px] sm:text-[9px] font-sans px-1.5 py-0.2 rounded-full bg-[#c69960]/15 border border-[#c69960]/25 text-[#deb881] font-normal shrink-0">
                              {filteredProperties.length} {filteredProperties.length === 1 ? "Space" : "Spaces"}
                            </span>
                          </div>
                          <p className="text-[8.5px] sm:text-[9px] text-zinc-400 font-light truncate leading-none mt-0.5">
                            {hasActiveFilters
                              ? "Live verified inventory matching your criteria"
                              : "Verified commercial inventory in Noida"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="text-[9.5px] sm:text-[10px] text-zinc-400 hover:text-[#deb881] transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer font-normal"
                            title="Reset all filters"
                          >
                            <i className="fa-solid fa-rotate-left text-[7.5px]" />
                            <span className="hidden sm:inline">Reset</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsResultsOpen(false)}
                          aria-label="Close search results"
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#c69960] hover:text-white text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <i className="fa-solid fa-xmark text-[9px]" />
                        </button>
                      </div>
                    </div>

                    {/* Compact Active Filter Chips Strip */}
                    {hasActiveFilters && (
                      <div className="px-3 sm:px-3.5 py-1 border-b border-white/5 bg-black/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[9px] shrink-0">
                        <span className="text-zinc-500 shrink-0 text-[8px] uppercase tracking-wider font-mono">
                          Active:
                        </span>
                        {location && (
                          <button
                            type="button"
                            onClick={() => setLocation("")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c69960]/10 hover:bg-red-500/20 text-[#deb881] hover:text-red-300 border border-[#c69960]/20 transition-colors shrink-0 cursor-pointer"
                          >
                            <i className="fa-solid fa-location-dot text-[7px] text-[#c69960]" />
                            <span>{location}</span>
                            <i className="fa-solid fa-xmark text-[7px] ml-0.5 opacity-70" />
                          </button>
                        )}
                        {propertyType && (
                          <button
                            type="button"
                            onClick={() => setPropertyType("")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c69960]/10 hover:bg-red-500/20 text-[#deb881] hover:text-red-300 border border-[#c69960]/20 transition-colors shrink-0 cursor-pointer"
                          >
                            <i className="fa-solid fa-building text-[7px] text-[#c69960]" />
                            <span>{propertyType}</span>
                            <i className="fa-solid fa-xmark text-[7px] ml-0.5 opacity-70" />
                          </button>
                        )}
                        {area && (
                          <button
                            type="button"
                            onClick={() => setArea("")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c69960]/10 hover:bg-red-500/20 text-[#deb881] hover:text-red-300 border border-[#c69960]/20 transition-colors shrink-0 cursor-pointer"
                          >
                            <i className="fa-solid fa-vector-square text-[7px] text-[#c69960]" />
                            <span>{area}</span>
                            <i className="fa-solid fa-xmark text-[7px] ml-0.5 opacity-70" />
                          </button>
                        )}
                        {searchQuery.trim() && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c69960]/10 hover:bg-red-500/20 text-[#deb881] hover:text-red-300 border border-[#c69960]/20 transition-colors shrink-0 cursor-pointer"
                          >
                            <i className="fa-solid fa-magnifying-glass text-[7px] text-[#c69960]" />
                            <span className="max-w-[110px] truncate">&quot;{searchQuery}&quot;</span>
                            <i className="fa-solid fa-xmark text-[7px] ml-0.5 opacity-70" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Scrollable Live Results List (Streamlined & Compact Height, Hidden Scrollbar) */}
                    <div
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                      className="
                        overflow-y-auto flex-1 p-2 space-y-1.5
                        max-h-[170px] sm:max-h-[185px]
                        no-scrollbar scrollbar-none
                        [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0
                      "
                    >
                      {filteredProperties.length > 0 ? (
                        filteredProperties.map((prop) => (
                          <div
                            key={String(prop.id)}
                            onClick={() => {
                              setIsResultsOpen(false);
                              router.push(`/properties/${prop.slug}`);
                            }}
                            className="
                              group relative p-1.5 sm:p-2 rounded-xl
                              bg-white/[0.025] hover:bg-[#c69960]/10
                              border border-white/5 hover:border-[#c69960]/35
                              transition-all duration-200 cursor-pointer
                              flex items-center gap-2.5 sm:gap-3
                            "
                          >
                            {/* Left: Compact Cover Thumbnail */}
                            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-white/10 shadow-xs flex items-center justify-center">
                              {prop.image ? (
                                <Image
                                  src={prop.image}
                                  alt={prop.title}
                                  fill
                                  sizes="50px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <i className="fa-solid fa-building text-zinc-600 text-xs" />
                              )}
                              {prop.badge && (
                                <span className="absolute top-0.5 left-0.5 bg-gradient-to-r from-[#c69960] to-[#b3874f] text-white text-[6px] font-semibold px-1 py-0.2 rounded-full font-sans uppercase tracking-wider shadow-xs">
                                  {prop.badge}
                                </span>
                              )}
                            </div>

                            {/* Center: Details with Slim, Elegant Typography */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {/* Clear Micro Sector Badge */}
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#c69960]/15 border border-[#c69960]/30 text-[#deb881] font-medium text-[8.5px] sm:text-[9px] font-sans">
                                  <i className="fa-solid fa-location-dot text-[7px] text-[#c69960]" />
                                  <span>{prop.sector || prop.location || "Noida"}</span>
                                </span>

                                <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-sans truncate">
                                  {prop.category}
                                </span>
                              </div>

                              {/* Clean Lightweight Title (div tag with explicit small font size and weight) */}
                              <div
                                style={{ fontSize: "11px", fontWeight: 400, lineHeight: 1.3 }}
                                className="font-sans text-white/90 group-hover:text-[#deb881] transition-colors truncate"
                              >
                                {prop.title}
                              </div>

                              {/* Specs Badges */}
                              <div className="flex items-center flex-wrap gap-1 pt-0.5 text-[8px] sm:text-[8.5px] text-zinc-400">
                                <span className="inline-flex items-center gap-1 bg-white/[0.03] px-1.5 py-0.2 rounded border border-white/5">
                                  <i className="fa-solid fa-vector-square text-[#c69960] text-[7.5px]" />
                                  {prop.area}
                                </span>
                                <span className="inline-flex items-center gap-1 bg-white/[0.03] px-1.5 py-0.2 rounded border border-white/5">
                                  <i className="fa-solid fa-users text-[#c69960] text-[7.5px]" />
                                  {prop.workstations}
                                </span>
                                {prop.cabins && (
                                  <span className="inline-flex items-center gap-1 bg-white/[0.03] px-1.5 py-0.2 rounded border border-white/5 hidden sm:inline-flex">
                                    <i className="fa-solid fa-door-open text-[#c69960] text-[7.5px]" />
                                    {prop.cabins}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right: Refined Price & View CTA */}
                            <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch py-0.5">
                              <div>
                                <span
                                  style={{ fontSize: "11px", fontWeight: 600 }}
                                  className="block text-[#deb881] font-sans"
                                >
                                  {prop.price}
                                </span>
                              </div>

                              <div className="inline-flex items-center gap-1 text-[8px] sm:text-[8.5px] text-zinc-400 group-hover:text-white font-normal transition-colors mt-auto">
                                <span className="hidden sm:inline">View</span>
                                <span className="w-3.5 h-3.5 rounded-full bg-white/10 group-hover:bg-[#c69960] group-hover:text-black flex items-center justify-center transition-all duration-200">
                                  <i className="fa-solid fa-arrow-right text-[6.5px]" />
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        /* Empty State */
                        <div className="py-4 px-3 text-center space-y-1.5">
                          <div className="w-7 h-7 rounded-full bg-[#c69960]/20 text-[#deb881] flex items-center justify-center mx-auto text-xs">
                            <i className="fa-solid fa-magnifying-glass-location" />
                          </div>
                          <div>
                            <div
                              style={{ fontSize: "11px", fontWeight: 500 }}
                              className="font-sans text-white"
                            >
                              No Office Spaces Match Your Exact Filter
                            </div>
                            <p className="text-[9px] sm:text-[9.5px] text-zinc-400 max-w-sm mx-auto mt-0.5 font-light leading-relaxed">
                              We have off-market workspaces in Sector 62, 132, 15, and Expressway. Let our advisors assist you.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleResetFilters}
                              className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[9.5px] sm:text-[10px] font-normal transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-rotate-left mr-1 text-[8px]" />
                              Clear Filters
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsResultsOpen(false);
                                setIsEnquiryOpen(true);
                              }}
                              className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#c69960] to-[#b3874f] hover:from-[#d4a970] hover:to-[#c69960] text-white text-[9.5px] sm:text-[10px] font-medium shadow-xs transition-all cursor-pointer"
                            >
                              <i className="fa-solid fa-paper-plane mr-1 text-[8px]" />
                              Custom Requirement
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Compact Results Footer */}
                    {filteredProperties.length > 0 && (
                      <div className="px-3 sm:px-3.5 py-1.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[9px] text-zinc-400 shrink-0">
                        <span className="hidden sm:inline text-[8.5px] font-light">
                          Trinetra Estates • Verified Commercial Inventory
                        </span>
                        <button
                          type="button"
                          onClick={handleViewAllSpaces}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-white hover:text-[#deb881] font-normal text-[9px] transition-colors cursor-pointer group"
                        >
                          <span>Browse in Featured Grid</span>
                          <i className="fa-solid fa-arrow-down text-[7.5px] group-hover:translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── STATS COUNTER ROW (100% Screen Fitted, Zero Slider/Scroll) ── */}
              <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-7 lg:gap-10 pt-2 sm:pt-4 w-full max-w-xl">
                {STATS.map((stat, idx) => (
                  <React.Fragment key={stat.label}>
                    <div className="flex-1 sm:flex-initial text-left min-w-0">
                      <h4 className="text-[17px] sm:text-[22px] lg:text-[26px] font-medium text-gold leading-none font-heading">
                        {stat.value}
                      </h4>
                      <p className="text-white/80 text-[10px] sm:text-[12px] lg:text-[13px] mt-1 sm:mt-1.5 font-light leading-tight sm:whitespace-nowrap">
                        {stat.label}
                      </p>
                    </div>
                    {idx < STATS.length - 1 && (
                      <div className="w-[1px] h-5 sm:h-7 bg-white/20 shrink-0 self-center mx-0.5 sm:mx-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* ── WATCH OUR STORY WITH SUB-TAG UNDERNEATH ── */}
              <div className="space-y-2 pt-1.5 sm:pt-2">
                {/* Play Button triggering Video Modal */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    aria-label="Watch Our Story"
                    className="inline-flex items-center gap-2.5 sm:gap-3 group cursor-pointer text-white/90 hover:text-white transition-colors"
                  >
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/30 group-hover:border-[var(--color-gold)] bg-black/40 flex items-center justify-center text-white group-hover:text-[var(--color-gold)] group-hover:scale-110 transition-all duration-300 shadow-[0_0_12px_rgba(198,153,96,0.25)]">
                      <i className="fa-solid fa-play text-[10px] ml-0.5" />
                    </span>
                    <span className="text-[12.5px] sm:text-[13px] font-medium tracking-wide">
                      Watch Our Story
                    </span>
                  </button>
                </div>

                {/* Sub-tag Directly Underneath */}
                <p className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase font-sans text-white/45 flex items-center">
                  <span className="inline-block w-4 h-[1px] bg-[var(--color-gold)] mr-2" />
                  TRUSTED REAL ESTATE PARTNER IN NOIDA
                </p>
              </div>

            </div>

          </div>

          {/* ── UPPER RIGHT BRAND PILLARS (Cleanly visible in glass window view) ── */}
          <div className="hidden xl:flex absolute top-44 lg:top-48 xl:top-52 right-10 lg:right-16 xl:right-24 z-20 flex-col items-center text-center space-y-2.5 text-white/90 tracking-[0.28em] text-[11px] sm:text-[11.5px] uppercase font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] pointer-events-none">
            <span>WORK</span>
            <span>GROW</span>
            <span>CONNECT</span>
            <span>BELONG</span>
            <span className="w-8 h-[1.5px] bg-[var(--color-gold)] mt-2 inline-block" />
          </div>

        </div>
      </section>

      {/* ── VIDEO STORY MODAL (Ultra-Luxury Responsive Video Modal) ── */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="Our Story • Trinetra Estates"
        subtitle="Commercial Excellence in Noida"
        videoSrc="/videos/our-story.mp4"
        instagramUrl="https://www.instagram.com/reel/DdFKpL0T0Gm/"
        instagramEmbedUrl="https://www.instagram.com/reel/DdFKpL0T0Gm/embed/"
      />

      {/* ── CUSTOM ENQUIRY MODAL (Triggered when no exact space or for tailored search) ── */}
      {isEnquiryOpen && (
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          title="Looking for a Specific Office Space?"
          subtitle="Share your requirement and our commercial experts will get back with tailored options."
          initialPreferredLocation={location}
          initialLookingFor={propertyType}
        />
      )}
    </>
  );
}
