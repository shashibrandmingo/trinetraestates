'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import OfficeCard from './OfficeCard';
import QuickSearchBar from '../home/QuickSearchBar';
import { sectorsList } from '@/data/sampleOffices';
import { OfficeCardData } from '@/types/office';
import { useDebounce } from '@/hooks/useDebounce';

interface BackendOfficeResponse {
  _id?: string;
  id?: string;
  propertyId?: string;
  title: string;
  propertyType?: string;
  location?: {
    sector?: string;
  };
  areaSqFt?: number;
  builtUpAreaSqFt?: number;
  price?: number;
  rentPerSqFt?: number;
  furnishing?: string;
  metroDistance?: string;
  isFeatured?: boolean;
  images?: Array<{ url: string; isCover?: boolean }>;
}

export default function OfficeGrid() {
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [searchKeyword, setSearchKeyword] = useState('');

  // TanStack Query Cache: Fetch & cache active properties for 5 minutes
  const { data: offices = [], isLoading } = useQuery<OfficeCardData[]>({
    queryKey: ['public-active-offices'],
    queryFn: async () => {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE) return [];

      const res = await fetch(`${API_BASE}/offices?status=Active&limit=24`);
      if (!res.ok) return [];

      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) return [];

      return json.data.map((office: BackendOfficeResponse) => {
        const area = Number(office.areaSqFt) || Number(office.builtUpAreaSqFt) || 1000;
        const price = Number(office.price) || 0;
        const rentPerSqFt =
          Number(office.rentPerSqFt) ||
          (area > 0 && price > 0 ? Math.round(price / area) : 0);
        const coverImg =
          office.images?.find((img) => img.isCover)?.url || office.images?.[0]?.url;

        return {
          id: office._id || office.id || office.propertyId || String(Math.random()),
          title: office.title,
          sector: office.location?.sector || 'Noida',
          areaSqFt: area,
          rentPerSqFt,
          type: office.propertyType || 'Commercial Tech Space',
          furnishing: office.furnishing || 'Full',
          metroDistance: office.metroDistance || 'Near Metro Station',
          isFeatured: office.isFeatured || false,
          imageUrl: coverImg
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  // Debounce search query to prevent unnecessary re-filtering
  const debouncedKeyword = useDebounce(searchKeyword, 200);

  // Fast in-memory memoized search and filter over live offices
  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchSector =
        selectedSector === 'All Sectors' ||
        office.sector.toLowerCase().includes(selectedSector.toLowerCase());

      const matchKeyword =
        !debouncedKeyword.trim() ||
        office.title.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
        office.furnishing.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
        office.sector.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
        office.metroDistance.toLowerCase().includes(debouncedKeyword.toLowerCase());

      return matchSector && matchKeyword;
    });
  }, [offices, selectedSector, debouncedKeyword]);

  const handleResetFilters = () => {
    setSelectedSector('All Sectors');
    setSearchKeyword('');
  };

  return (
    <section id="spaces" className="py-14 sm:py-20 bg-slate-50/60 border-t border-slate-100 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fast Search Bar */}
        <div className="mb-10">
          <QuickSearchBar
            keyword={searchKeyword}
            onKeywordChange={setSearchKeyword}
            selectedSector={selectedSector}
            onSectorChange={setSelectedSector}
          />
        </div>

        {/* Section Header & Sector Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 block mb-1">
              Live Verified Inventory
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900">
              Available Office Spaces
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing <span className="font-semibold text-navy-900">{filteredOffices.length}</span> commercial options matching your criteria
            </p>
          </div>

          {/* Sector Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {sectorsList.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => setSelectedSector(sector)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedSector === sector
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-white text-navy-800 border border-slate-200 hover:border-gold-500 hover:text-gold-600'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid, Loading, or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 h-80 animate-pulse flex flex-col justify-between">
                <div className="h-44 bg-slate-100 rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredOffices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredOffices.map((office) => (
              <OfficeCard key={office.id} office={office} />
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-bold text-navy-900">
              {offices.length === 0 ? 'No Properties Listed Yet' : 'No matching spaces found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 mb-5">
              {offices.length === 0
                ? 'Properties added from the Admin portal will appear here automatically.'
                : `We couldn't find any office space matching "${debouncedKeyword || selectedSector}". Try clearing your search or sector filter.`}
            </p>
            {offices.length > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-gold px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-sm"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
