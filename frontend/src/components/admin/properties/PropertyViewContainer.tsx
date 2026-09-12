'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PropertyFilterState, PropertyItem, PropertyKPIStats, PropertyStatus } from '@/types/propertyFilter';
import { defaultKPIStats } from '@/data/mockPropertiesList';
import { propertyService } from '@/services/propertyService';
import PropertyKPIHeader from './PropertyKPIHeader';
import PropertyFilterSidebar from './PropertyFilterSidebar';
import { PropertyListingView } from './PropertyListingView';
import { PropertyDetailsModal } from './PropertyDetailsModal';
import { AddPropertyForm } from './AddPropertyForm';
import { BulkImportModal } from './BulkImportModal';
import { clientService } from '@/services/clientService';

const initialFilterState: PropertyFilterState = {
  city: 'All Cities',
  locality: '',
  propertyTypes: [],
  purpose: 'All',
  minArea: '',
  maxArea: '',
  minBudget: '',
  maxBudget: '',
  furnishing: 'All',
  parkingRequired: false,
  floor: 'All',
  amenities: [],
  statuses: [],
};

interface PropertyViewContainerProps {
  isSidebarCollapsed?: boolean;
  externalSearchQuery?: string;
  initialAction?: 'add-property' | 'active' | 'expiring' | 'draft' | 'purge' | null;
  selectedSectorFilter?: string;
}

export const PropertyViewContainer: React.FC<PropertyViewContainerProps> = ({
  externalSearchQuery = '',
  initialAction,
  selectedSectorFilter
}) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<PropertyFilterState>(initialFilterState);

  // TanStack Query Cache for Property KPIs (keeps cached across tab switches)
  const { data: cachedKPIs } = useQuery<PropertyKPIStats>({
    queryKey: ['property-kpi-stats'],
    queryFn: () => propertyService.getKPIStats(),
    staleTime: 5 * 60 * 1000,
  });

  const kpiStats = cachedKPIs || defaultKPIStats;
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');

  // Count active non-default filters for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.city && filters.city !== 'Noida') count++;
    if (filters.locality) count++;
    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.purpose !== 'All') count++;
    if (filters.minArea || filters.maxArea) count++;
    if (filters.minBudget || filters.maxBudget) count++;
    if (filters.furnishing !== 'All') count++;
    if (filters.parkingRequired) count++;
    if (filters.statuses.length > 0) count += filters.statuses.length;
    return count;
  }, [filters]);

  // Handle external actions from global search
  useEffect(() => {
    if (initialAction === 'add-property') {
      setViewMode('add');
    } else if (initialAction === 'active') {
      setFilters((prev) => ({ ...prev, statuses: ['Active'] }));
      setViewMode('list');
    } else if (initialAction === 'expiring') {
      setFilters((prev) => ({ ...prev, statuses: ['Expiring'] }));
      setViewMode('list');
    } else if (initialAction === 'draft') {
      setFilters((prev) => ({ ...prev, statuses: ['Draft'] }));
      setViewMode('list');
    }
  }, [initialAction]);

  // Handle external sector filter from global search
  useEffect(() => {
    if (selectedSectorFilter) {
      setFilters((prev) => ({ ...prev, locality: selectedSectorFilter }));
      setViewMode('list');
    }
  }, [selectedSectorFilter]);

  // 300ms debounce for search query to prevent unnecessary API calls on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(externalSearchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(externalSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [externalSearchQuery]);

  // Ref guard to prevent overlapping/duplicate API calls
  const isFetchingRef = useRef(false);

  // Check if URL has ?status=Active / Expiring / Expired on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get('status') as PropertyStatus | null;
      if (statusParam && ['Active', 'Expiring', 'Expired', 'Sold'].includes(statusParam)) {
        setFilters((prev) => ({ ...prev, statuses: [statusParam] }));
      }
    }
  }, []);

  // Memoized query params for properties batch
  const queryParams = useMemo(() => ({
    city: filters.city,
    sector: filters.locality || undefined,
    locality: filters.locality || undefined,
    keyword: debouncedSearch.trim() || undefined,
    propertyType: filters.propertyTypes[0] || undefined,
    purpose: filters.purpose !== 'All' ? filters.purpose : undefined,
    minArea: filters.minArea || undefined,
    maxArea: filters.maxArea || undefined,
    minPrice: filters.minBudget || undefined,
    maxPrice: filters.maxBudget || undefined,
    furnishing: filters.furnishing !== 'All' ? filters.furnishing : undefined,
    parking: filters.parkingRequired ? true : undefined,
    status: filters.statuses[0] || undefined,
    sortBy
  }), [filters, debouncedSearch, sortBy]);

  // TanStack Query Cache: Instant loading from memory cache (No repeat "Loading initial 30 properties..." on tab switch)
  const { data: initialBatch, isLoading: isBatchLoading } = useQuery({
    queryKey: ['admin-properties-batch', queryParams],
    queryFn: () => propertyService.fetchPropertiesBatch({
      skip: 0,
      limit: 30,
      ...queryParams
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Sync state when batch is loaded or retrieved instantly from cache
  useEffect(() => {
    if (initialBatch) {
      setProperties(initialBatch.properties);
      setTotalCount(initialBatch.total);
      setHasMore(initialBatch.hasMore);
    }
  }, [initialBatch]);

  // Show table/grid skeleton loading when fetching initial batch or new filter set
  const isLoading = isBatchLoading;

  // Infinite scroll: Fetch next batch of 20 properties on scroll
  const handleLoadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    try {
      const res = await propertyService.fetchPropertiesBatch({
        skip: properties.length,
        limit: 20, // Next 20 properties on scroll
        city: filters.city,
        sector: filters.locality || undefined,
        locality: filters.locality || undefined,
        keyword: debouncedSearch.trim() || undefined,
        propertyType: filters.propertyTypes[0] || undefined,
        purpose: filters.purpose !== 'All' ? filters.purpose : undefined,
        minArea: filters.minArea || undefined,
        maxArea: filters.maxArea || undefined,
        minPrice: filters.minBudget || undefined,
        maxPrice: filters.maxBudget || undefined,
        furnishing: filters.furnishing !== 'All' ? filters.furnishing : undefined,
        parking: filters.parkingRequired ? true : undefined,
        status: filters.statuses[0] || undefined,
        sortBy
      });

      if (res.properties.length > 0) {
        setProperties((prev) => [...prev, ...res.properties]);
      }
      if (typeof res.total === 'number' && res.total > 0) {
        setTotalCount(res.total);
      }
      setHasMore(res.hasMore);
    } catch (err) {
      console.warn('Could not fetch next properties batch:', err);
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, properties.length, filters, debouncedSearch, sortBy]);

  // Determine current active KPI status
  const currentSelectedStatus: PropertyStatus | 'All' = useMemo(() => {
    if (filters.statuses.length === 1) {
      return filters.statuses[0];
    }
    return 'All';
  }, [filters.statuses]);

  // Click handler for KPI Cards -> Fast dynamic filter
  const handleSelectKPIStatus = (status: PropertyStatus | 'All') => {
    const updatedStatuses: PropertyStatus[] = status === 'All' ? [] : [status];
    setFilters((prev) => ({ ...prev, statuses: updatedStatuses }));

    // Sync URL without full page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (status === 'All') {
        url.searchParams.delete('status');
      } else {
        url.searchParams.set('status', status);
      }
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleFilterChange = (updated: Partial<PropertyFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('status');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleViewDetails = (property: PropertyItem) => {
    setSelectedProperty(property);
    setIsDetailsOpen(true);
  };

  const handleEditProperty = async (property: PropertyItem) => {
    const propId = property.propertyId || property.id;
    if (propId) {
      // Fetch full property data with all real uploaded media
      const full = await propertyService.getPropertyById(propId, true);
      setEditingProperty(full || property);
    } else {
      setEditingProperty(property);
    }
    setViewMode('edit');
  };

  const handleDuplicateProperty = async (property: PropertyItem) => {
    const idToClone = property.id || property.propertyId;
    if (!idToClone) return;

    try {
      const res = await propertyService.duplicateProperty(idToClone);
      if (res.success && res.data) {
        // Place newly duplicated card right at top of properties array
        setProperties((prev) => [res.data!, ...prev]);
        setTotalCount((prev) => prev + 1);
        // Invalidate KPI stats query
        queryClient.invalidateQueries({ queryKey: ['property-kpi-stats'] });
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });
      }
    } catch (err) {
      console.warn('Could not duplicate property:', err);
    }
  };

  const handleStatusChange = async (
    property: PropertyItem,
    newStatus: PropertyItem['status'],
    dealData?: any
  ) => {
    const idToUpdate = property.id || property.propertyId;
    if (!idToUpdate) return;

    try {
      const updated = await propertyService.updatePropertyStatus(idToUpdate, newStatus, dealData);
      if (updated) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === property.id
              ? { ...p, status: newStatus, dealDetails: dealData || p.dealDetails }
              : p
          )
        );
        // Invalidate queries to refresh caches
        queryClient.invalidateQueries({ queryKey: ['admin-properties-batch'] });
        queryClient.invalidateQueries({ queryKey: ['property-kpi-stats'] });
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });

        // Sync client data into CRM if sold by me
        if (newStatus === 'Sold by Me' && dealData?.clientName) {
          clientService.createClient({
            name: dealData.clientName,
            phone: dealData.clientPhone || '9876543210',
            clientType: 'Buyer',
            status: 'Deal Closed',
            propertyId: property.propertyId || property.id,
            propertyTitle: property.title,
            dealAmount: dealData.dealAmount || 0,
            commissionEarned: dealData.commissionEarned || 0,
            paymentMode: dealData.paymentMode || 'Bank Transfer',
            dealDate: dealData.soldDate || new Date().toISOString(),
            notes: dealData.notes || 'Deal closed via Sales by Me',
            source: 'Sales by Me'
          }).then(() => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['client-stats'] });
          }).catch((err) => console.warn('Non-blocking client sync error:', err));
        }
      }
    } catch (err) {
      console.warn('Could not update property status:', err);
    }
  };

  const handleExportAll = () => {
    const url = propertyService.getExportURL(
      currentSelectedStatus !== 'All' ? currentSelectedStatus : undefined,
      filters.locality || undefined
    );
    // Open in new tab or trigger direct download
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <AddPropertyForm
        initialData={viewMode === 'edit' ? editingProperty : null}
        onBack={() => {
          setViewMode('list');
          setEditingProperty(null);
        }}
        onSuccess={() => {
          setViewMode('list');
          setEditingProperty(null);
          queryClient.invalidateQueries({ queryKey: ['admin-properties-batch'] });
          queryClient.invalidateQueries({ queryKey: ['property-kpi-stats'] });
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });
        }}
      />
    );
  }

  return (
    <div className="space-y-3.5 w-full min-w-0 max-w-full">
      {/* Top Header with Interactive Clickable KPIs & Action Buttons */}
      <PropertyKPIHeader
        stats={kpiStats}
        selectedStatus={currentSelectedStatus}
        onSelectStatus={handleSelectKPIStatus}
        onAddProperty={() => {
          setEditingProperty(null);
          setViewMode('add');
        }}
        onImportExcel={() => setIsImportModalOpen(true)}
        onExportAll={handleExportAll}
      />

      {/* Main Layout: Left Filter Sidebar (Desktop) + Right Listings Grid */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full min-w-0 max-w-full">
        {/* Left Filter Sidebar (Desktop only) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <PropertyFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Toggle Button Bar (Phone mode only) */}
        <div className="lg:hidden flex items-center justify-between gap-2.5 w-full bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-navy-950 font-bold text-xs transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter Properties</span>
            {activeFiltersCount > 0 && (
              <span className="text-slate-500 font-medium text-xs">
                ({activeFiltersCount})
              </span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 px-3 py-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Right Listing Grid with Infinite Scroll (30 initial + 20 on scroll) */}
        <PropertyListingView
          properties={properties}
          totalCount={totalCount}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onViewDetails={handleViewDetails}
          onEditProperty={handleEditProperty}
          onDuplicateProperty={handleDuplicateProperty}
          onStatusChange={handleStatusChange}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
        />
      </div>

      {/* Mobile Full-Width Bottom Sheet Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop with Frosted Blur */}
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Modal (Full width on phone, rounded top, max-h-[88vh]) */}
          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl z-10 flex flex-col max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto px-5 py-2 custom-scrollbar">
              <PropertyFilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                onClose={() => setIsMobileFilterOpen(false)}
                isMobile={true}
              />
            </div>

            {/* Sticky Bottom Apply Button */}
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl text-sm font-bold bg-navy-950 text-white shadow-md hover:bg-navy-900 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Show Properties</span>
                {totalCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-500 text-navy-950 text-xs font-bold font-mono">
                    {totalCount} Results
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <PropertyDetailsModal
        property={selectedProperty}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Bulk Import Excel / CSV Modal */}
      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-properties-batch'] });
          queryClient.invalidateQueries({ queryKey: ['property-kpi-stats'] });
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });
        }}
      />
    </div>
  );
};
