'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyItem } from '@/types/propertyFilter';
import { propertyService } from '@/services/propertyService';
import { SidebarTab } from './AdminSidebar';

interface AdminTopNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProperty?: (property: PropertyItem) => void;
  onSelectSector?: (sector: string) => void;
  onSelectAction?: (action: 'add-property' | 'active' | 'expiring' | 'draft' | 'purge') => void;
  onSubmitSearch?: (query: string) => void;
  activeTab?: SidebarTab;
  onSelectTab?: (tab: SidebarTab) => void;
  onLogout?: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onCloseMobileMenu?: () => void;
}

const desktopPlaceholders = [
  'Search by Tower, Building, or Sector 62...',
  'Search by Property ID (e.g. PROP-2026)...',
  'Search by Owner Name or Contact...',
  'Search verified spaces in Sector 62, 132, 16...',
  'Search Rent, Sale, Bare Shell, Plug & Play...'
];

const mobilePlaceholders = [
  'Search properties...',
  'Search sector, tower...',
  'Search Property ID...',
  'Search offices, shops...',
  'Search by owner...'
];

type SearchCategory = 'all' | 'properties' | 'sectors' | 'owners' | 'actions';

export default function AdminTopNavbar({
  searchQuery,
  onSearchChange,
  onSelectProperty,
  onSelectSector,
  onSelectAction,
  onSubmitSearch,
  activeTab = 'dashboard',
  onSelectTab,
  onLogout,
  isMobileMenuOpen: externalIsMobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu
}: AdminTopNavbarProps) {
  const [internalIsMobileMenuOpen, setInternalIsMobileMenuOpen] = useState(false);
  const isMobileMenuOpen = externalIsMobileMenuOpen !== undefined ? externalIsMobileMenuOpen : internalIsMobileMenuOpen;
  const toggleMobileMenu = onToggleMobileMenu || (() => setInternalIsMobileMenuOpen((prev) => !prev));
  const closeMobileMenu = onCloseMobileMenu || (() => setInternalIsMobileMenuOpen(false));

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [searchResults, setSearchResults] = useState<{
    properties: PropertyItem[];
    sectors: string[];
    owners: Array<{
      ownerName: string;
      ownerPhone?: string;
      propertyTitle: string;
      propertyId?: string;
    }>;
  }>({
    properties: [],
    sectors: [],
    owners: []
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const [contourPath, setContourPath] = useState<string>('');

  // Dynamically compute the path following the exact red line drawn by the user:
  // Starts at left baseline -> curves UP before search bar -> travels across TOP of search bar -> curves DOWN after search bar -> runs along right baseline to end
  useEffect(() => {
    const updateContour = () => {
      if (!headerRef.current) return;
      const hRect = headerRef.current.getBoundingClientRect();
      const w = Math.round(hRect.width);
      const yBase = 63; // 1px inside the 64px header

      if (searchWrapRef.current) {
        const sRect = searchWrapRef.current.getBoundingClientRect();
        const sLeft = Math.round(sRect.left - hRect.left);
        const sRight = Math.round(sRect.right - hRect.left);
        const sTop = Math.max(Math.round(sRect.top - hRect.top) - 1, 8);
        const sHeight = Math.round(sRect.height);
        const r = Math.min(Math.round(sHeight / 2), 18);

        const d = `M 0,${yBase} ` +
          `L ${Math.max(sLeft - 36, 0)},${yBase} ` +
          `C ${sLeft - 16},${yBase} ${sLeft - 6},${sTop + r + 6} ${sLeft},${sTop + r} ` +
          `A ${r} ${r} 0 0 1 ${sLeft + r},${sTop} ` +
          `L ${sRight - r},${sTop} ` +
          `A ${r} ${r} 0 0 1 ${sRight},${sTop + r} ` +
          `C ${sRight + 6},${sTop + r + 6} ${sRight + 16},${yBase} ${sRight + 36},${yBase} ` +
          `L ${w},${yBase}`;

        setContourPath(d);
      } else {
        setContourPath(`M 0,${yBase} L ${w},${yBase}`);
      }
    };

    updateContour();
    window.addEventListener('resize', updateContour);
    const t = setTimeout(updateContour, 250);
    return () => {
      window.removeEventListener('resize', updateContour);
      clearTimeout(t);
    };
  }, []);

  // Rotating placeholder cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % desktopPlaceholders.length);
        setIsFading(false);
      }, 350);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Global Ctrl + K / Cmd + K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live Debounced Search against MongoDB API
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults({ properties: [], sectors: [], owners: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await propertyService.searchGlobal(q);
        setSearchResults(results);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Quick action options
  const quickActions = useMemo(
    () => [
      { id: 'add-property' as const, label: '+ Add New Property', desc: 'Create & publish new commercial listing', icon: '✨' },
      { id: 'active' as const, label: 'View Active Inventory', desc: 'Filter verified active spaces', icon: '🟢' },
      { id: 'expiring' as const, label: 'View Expiring Soon', desc: 'Leases requiring immediate renewal', icon: '🟡' },
      { id: 'draft' as const, label: 'View Saved Drafts', desc: 'Unpublished drafts in progress', icon: '📝' }
    ],
    []
  );

  // Filtered lists based on selected category tab
  const displayedProperties = useMemo(() => {
    if (activeCategory === 'all' || activeCategory === 'properties') {
      return searchResults.properties;
    }
    return [];
  }, [activeCategory, searchResults.properties]);

  const displayedSectors = useMemo(() => {
    if (activeCategory === 'all' || activeCategory === 'sectors') {
      if (!searchQuery.trim()) {
        return ['Sector 62', 'Sector 132', 'Sector 16', 'Sector 125', 'Sector 63'];
      }
      return searchResults.sectors;
    }
    return [];
  }, [activeCategory, searchQuery, searchResults.sectors]);

  const displayedOwners = useMemo(() => {
    if (activeCategory === 'all' || activeCategory === 'owners') {
      return searchResults.owners;
    }
    return [];
  }, [activeCategory, searchResults.owners]);

  const displayedActions = useMemo(() => {
    if (activeCategory === 'all' || activeCategory === 'actions') {
      const q = searchQuery.toLowerCase();
      if (!q) return quickActions;
      return quickActions.filter(
        (a) => a.label.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
      );
    }
    return [];
  }, [activeCategory, searchQuery, quickActions]);

  const totalResultsCount =
    searchResults.properties.length +
    searchResults.sectors.length +
    searchResults.owners.length +
    displayedActions.length;

  const handleSelectPropertyItem = useCallback((prop: PropertyItem) => {
    setIsOpen(false);
    onSelectProperty?.(prop);
  }, [onSelectProperty]);

  const handleSelectSectorItem = useCallback((sector: string) => {
    setIsOpen(false);
    onSearchChange(sector);
    onSelectSector?.(sector);
  }, [onSearchChange, onSelectSector]);

  const handleSelectActionItem = useCallback((actionId: 'add-property' | 'active' | 'expiring' | 'draft' | 'purge') => {
    setIsOpen(false);
    onSelectAction?.(actionId);
  }, [onSelectAction]);

  return (
    <header
      ref={headerRef}
      className="relative bg-white/95 backdrop-blur-md z-40 overflow-visible shadow-xs"
    >
      {/* Dynamic Animated Laser & Glowing Comet following the exact user red line contour */}
      {contourPath && (
        <svg
          className="absolute inset-0 w-full h-16 pointer-events-none z-30 overflow-visible"
          width="100%"
          height="64"
        >
          <defs>
            {/* Ambient track guide gradient */}
            <linearGradient id="userRedLineTrack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#d4af37" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#d4af37" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.3" />
            </linearGradient>

            {/* Glowing comet head filter */}
            <filter id="cometGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint elegant contour line showing the track */}
          <path
            d={contourPath}
            fill="none"
            stroke="url(#userRedLineTrack)"
            strokeWidth="1.2"
            opacity="0.35"
          />
        </svg>
      )}

      <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Clean Brand Logo */}
        <Link href="/" className="flex items-center group py-1" aria-label="Noida Office Spaces">
          <div className="relative h-11 w-11 sm:h-[58px] sm:w-[58px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/brand-logo.png"
              alt="Noida Office Spaces"
              fill
              sizes="(max-width: 640px) 44px, 58px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Center: Global Omnisearch Bar with Running Golden Border */}
        <div ref={searchWrapRef} className="flex-1 max-w-md relative mx-1 sm:mx-4 min-w-0">
          <div className="relative p-[1.5px] rounded-full overflow-hidden shadow-xs hover:shadow-md transition-all">
            {/* Running Gold Glowing Border Beam */}
            <div className="absolute inset-0 rounded-full animate-gold-flow" />

            {/* Inner White Container */}
            <div className="relative bg-white rounded-full flex items-center w-full px-2.5 sm:px-3.5 py-1.5 border border-slate-100/80">
              <svg
                className="w-3.5 h-3.5 text-gold-500 shrink-0 mr-1.5 sm:mr-2.5 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <div className="relative flex-grow flex items-center h-6 min-w-0">
                {/* Dynamic Rotating Animated Placeholder Text */}
                {!searchQuery && !isFocused && (
                  <span
                    className={`absolute left-0 right-2 pointer-events-none text-[11px] sm:text-xs text-slate-400 font-sans whitespace-nowrap truncate transition-all duration-300 ${
                      isFading ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
                    }`}
                  >
                    <span className="sm:hidden">{mobilePlaceholders[placeholderIndex % mobilePlaceholders.length]}</span>
                    <span className="hidden sm:inline">{desktopPlaceholders[placeholderIndex % desktopPlaceholders.length]}</span>
                  </span>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => {
                    setIsFocused(true);
                    setIsOpen(true);
                  }}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setIsOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setIsOpen(false);
                      inputRef.current?.blur();
                      onSubmitSearch?.(searchQuery);
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setIsOpen(false);
                      inputRef.current?.blur();
                    }
                  }}
                  placeholder={isFocused ? 'Search properties...' : ''}
                  className="w-full bg-transparent text-xs text-navy-900 focus:outline-none placeholder-slate-300 font-sans pr-2 sm:pr-12"
                />
              </div>

              {/* Loading indicator */}
              {isSearching && (
                <div className="w-3.5 h-3.5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mr-1.5 shrink-0" />
              )}

              {/* Clear button */}
              {searchQuery && !isSearching && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    inputRef.current?.focus();
                  }}
                  className="text-slate-400 hover:text-navy-900 transition-colors text-xs font-bold p-1 mr-1"
                  title="Clear search"
                >
                  ✕
                </button>
              )}

              {/* Keyboard Shortcut Pill */}
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Luxury Dropdown Popup with 100% Solid White Background */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="fixed sm:absolute top-16 sm:top-full left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-auto sm:w-[560px] max-w-[96vw] bg-white rounded-2xl border border-slate-200 shadow-[0_25px_60px_rgba(15,23,42,0.25)] z-50 overflow-hidden"
              style={{ backgroundColor: '#ffffff' }}
            >
              {/* Filter Tabs Header */}
              <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold">
                {(
                  [
                    { id: 'all', label: `All (${totalResultsCount})` },
                    { id: 'properties', label: `🏢 Properties (${searchResults.properties.length})` },
                    { id: 'sectors', label: `📍 Sectors (${displayedSectors.length})` },
                    { id: 'owners', label: `👤 Owners (${searchResults.owners.length})` },
                    { id: 'actions', label: `⚡ Actions (${displayedActions.length})` }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                      activeCategory === tab.id
                        ? 'bg-navy-900 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Results Content with solid white background */}
              <div
                className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-slate-100 p-2 space-y-2 bg-white"
                style={{ backgroundColor: '#ffffff' }}
              >
                {/* 1. PROPERTIES RESULTS */}
                {displayedProperties.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                      Properties & Suites ({displayedProperties.length})
                    </div>
                    <div className="space-y-1 mt-0.5">
                      {displayedProperties.map((prop) => (
                        <div
                          key={prop.id}
                          onClick={() => handleSelectPropertyItem(prop)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-gold-50/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                              🏢
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-heading text-xs font-bold text-navy-900 truncate group-hover:text-gold-700">
                                  {prop.title}
                                </span>
                                {prop.propertyId && (
                                  <span className="font-mono text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-semibold shrink-0">
                                    {prop.propertyId}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                {prop.sector} • {prop.areaSqFt.toLocaleString()} Sq. Ft. • ₹{prop.monthlyRentInLakh} L/mo
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                              prop.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : prop.status === 'Expiring'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {prop.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. SECTORS / LOCATIONS */}
                {displayedSectors.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                      Prime Locations & Sectors ({displayedSectors.length})
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 mt-0.5">
                      {displayedSectors.map((sector) => (
                        <div
                          key={sector}
                          onClick={() => handleSelectSectorItem(sector)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 hover:bg-gold-50 border border-slate-200/70 hover:border-gold-300 transition-all cursor-pointer group"
                        >
                          <span className="text-sm shrink-0">📍</span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-navy-900 group-hover:text-gold-700 block truncate">
                              {sector}
                            </span>
                            <span className="text-[9px] text-slate-400 block truncate">
                              Filter inventory in {sector}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. OWNERS & CONTACTS */}
                {displayedOwners.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                      Owners & Landlords ({displayedOwners.length})
                    </div>
                    <div className="space-y-1 mt-0.5">
                      {displayedOwners.map((owner, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setIsOpen(false);
                            onSearchChange(owner.ownerName);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center font-bold text-[11px]">
                              {owner.ownerName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-navy-900">
                                {owner.ownerName}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Property: {owner.propertyTitle}
                              </div>
                            </div>
                          </div>

                          {owner.ownerPhone && (
                            <a
                              href={`tel:${owner.ownerPhone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                            >
                              📞 {owner.ownerPhone}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. QUICK ACTIONS */}
                {displayedActions.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                      Quick System Shortcuts
                    </div>
                    <div className="space-y-1 mt-0.5">
                      {displayedActions.map((action) => (
                        <div
                          key={action.id}
                          onClick={() => handleSelectActionItem(action.id)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-gold-50/70 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm shrink-0">{action.icon}</span>
                            <div>
                              <div className="text-xs font-bold text-navy-900 group-hover:text-gold-700">
                                {action.label}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {action.desc}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-400 group-hover:text-navy-900">
                            →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NO RESULTS FALLBACK */}
                {searchQuery.trim() &&
                  displayedProperties.length === 0 &&
                  displayedSectors.length === 0 &&
                  displayedOwners.length === 0 &&
                  displayedActions.length === 0 &&
                  !isSearching && (
                    <div className="p-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg mb-2">
                        🔍
                      </div>
                      <h4 className="text-xs font-bold text-navy-900">
                        No matches found for &quot;{searchQuery}&quot;
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                        Try searching by exact Property ID (PROP-2026), Sector name (Sector 62), or building name.
                      </p>
                    </div>
                  )}
              </div>

              {/* Bottom Footer Info Bar */}
              <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    inputRef.current?.blur();
                    onSubmitSearch?.(searchQuery);
                  }}
                  className="flex items-center gap-1.5 text-navy-900 hover:text-gold-700 font-semibold transition-colors group cursor-pointer"
                >
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[9px] shadow-xs group-hover:border-gold-400 group-hover:text-gold-700">
                    Enter ↵
                  </kbd>
                  <span>to search entire inventory</span>
                </button>
                <span className="text-gold-700 font-bold tracking-wider uppercase text-[9px] hidden sm:inline">
                  Enterprise Omnisearch • MongoDB Live
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Mobile Three-Dot Navigation Menu & Desktop Spacer */}
        <div className="relative flex items-center flex-shrink-0">
          {/* Mobile Three-Dot Navigation Trigger (Visible only on mobile screens) */}
          <div className="md:hidden relative">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`w-11 h-11 rounded-xl border transition-all duration-150 flex items-center justify-center cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                isMobileMenuOpen
                  ? 'bg-navy-950 text-white border-navy-900 shadow-md'
                  : 'bg-white text-navy-900 border-slate-200/90 hover:bg-slate-50'
              }`}
              aria-label="Navigation Menu"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2.2" />
                <circle cx="12" cy="12" r="2.2" />
                <circle cx="12" cy="19" r="2.2" />
              </svg>
            </button>

            {/* Mobile Full-Width Dropdown Sheet with Animation */}
            {isMobileMenuOpen && (
              <>
                {/* Backdrop with rich frosted blur for rest of the screen */}
                <div
                  className="fixed inset-0 top-16 z-40 bg-navy-950/50 backdrop-blur-md transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                  onClick={closeMobileMenu}
                />

                <div className="fixed top-16 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xl rounded-b-2xl px-4 py-3 animate-drawer-down font-sans">
                  {/* Subtle top gold stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600" />

                  {/* Header Bar */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-navy-900">
                        Admin Navigation
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={closeMobileMenu}
                      className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Close menu"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* 4 Main Nav Tabs in 2-Column Responsive Luxury Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Dashboard */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab?.('dashboard');
                        closeMobileMenu();
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        activeTab === 'dashboard'
                          ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-sm ring-2 ring-gold-400/20'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        activeTab === 'dashboard' ? 'bg-navy-900 text-gold-400' : 'bg-white text-navy-800 border border-slate-200/60'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-4a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
                        </svg>
                      </div>
                      <span className="truncate">Dashboard</span>
                    </button>

                    {/* Properties */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab?.('properties');
                        closeMobileMenu();
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        activeTab === 'properties'
                          ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-sm ring-2 ring-gold-400/20'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        activeTab === 'properties' ? 'bg-navy-900 text-gold-400' : 'bg-white text-navy-800 border border-slate-200/60'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="truncate">Properties</span>
                    </button>

                    {/* Clients */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab?.('clients');
                        closeMobileMenu();
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        activeTab === 'clients'
                          ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-sm ring-2 ring-gold-400/20'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        activeTab === 'clients' ? 'bg-navy-900 text-gold-400' : 'bg-white text-navy-800 border border-slate-200/60'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <span className="truncate">Clients CRM</span>
                    </button>

                    {/* Leads */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab?.('leads');
                        closeMobileMenu();
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        activeTab === 'leads'
                          ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-sm ring-2 ring-gold-400/20'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        activeTab === 'leads' ? 'bg-navy-900 text-gold-400' : 'bg-white text-navy-800 border border-slate-200/60'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="truncate">Leads CRM</span>
                    </button>
                  </div>

                  {/* Sign Out Row */}
                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Admin Session Active
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        onLogout?.();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop Spacer */}
          <div className="w-6 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
