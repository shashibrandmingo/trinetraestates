'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import AdminTopNavbar from '@/components/admin/dashboard/AdminTopNavbar';
import AdminSidebar, { SidebarTab } from '@/components/admin/dashboard/AdminSidebar';
import StatCard from '@/components/admin/dashboard/StatCard';
import RevenueCard from '@/components/admin/dashboard/RevenueCard';
import RecentLeadsCard from '@/components/admin/dashboard/RecentLeadsCard';
import ExpiringPropertiesCard from '@/components/admin/dashboard/ExpiringPropertiesCard';
import RecentPropertiesCard from '@/components/admin/dashboard/RecentPropertiesCard';
import RecentActivityCard from '@/components/admin/dashboard/RecentActivityCard';
import DashboardSkeletonLoader from '@/components/admin/dashboard/DashboardSkeletonLoader';
import { PropertyViewContainer } from '@/components/admin/properties/PropertyViewContainer';
import { PropertyDetailsModal } from '@/components/admin/properties/PropertyDetailsModal';
import ClientManagementView from '@/components/admin/clients/ClientManagementView';
import LeadsManagementView from '@/components/admin/leads/LeadsManagementView';
import { adminDashboardService } from '@/services/adminDashboardService';
import { DashboardData } from '@/types/adminDashboard';
import { PropertyItem } from '@/types/propertyFilter';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGlobalProperty, setSelectedGlobalProperty] = useState<PropertyItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('');
  const [initialAction, setInitialAction] = useState<'add-property' | 'active' | 'expiring' | 'draft' | 'purge' | null>(null);

  // Restore active tab from URL query param or localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab') as SidebarTab | null;
      const tabFromStorage = localStorage.getItem('admin_active_tab') as SidebarTab | null;
      const validTabs: SidebarTab[] = ['dashboard', 'properties', 'clients', 'leads'];

      if (tabFromUrl && validTabs.includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      } else if (tabFromStorage && validTabs.includes(tabFromStorage)) {
        setActiveTab(tabFromStorage);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tabFromStorage);
        window.history.replaceState(null, '', url.toString());
      }
    }
  }, []);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Auth Guard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // TanStack Query Cache: Instant loading without repeat fetches when switching tabs
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['admin-dashboard-overview'],
    queryFn: () => adminDashboardService.getDashboardOverview(),
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_active_tab');
    }
    router.push('/login');
  };

  const handlePropertyRedirect = (item?: { towerName?: string; propertyId?: string }) => {
    if (item?.propertyId) {
      setSearchQuery(item.propertyId);
    } else if (item?.towerName) {
      setSearchQuery(item.towerName);
    }
    handleTabChange('properties');
  };

  if (isLoading || !dashboardData) {
    return <DashboardSkeletonLoader />;
  }

  const { summary, recentLeads, expiringProperties, recentProperties, recentActivities } = dashboardData;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#ebebeb] text-navy-900 flex flex-col">
      {/* Top Navbar */}
      <AdminTopNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmitSearch={() => {
          handleTabChange('properties');
        }}
        onSelectProperty={(property) => {
          setSelectedGlobalProperty(property);
          setIsDetailsOpen(true);
        }}
        onSelectSector={(sector) => {
          setActiveSectorFilter(sector);
          handleTabChange('properties');
        }}
        onSelectAction={(action) => {
          setInitialAction(action);
          handleTabChange('properties');
        }}
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Single-Frame Container with Sidebar & Content */}
      <div className="flex flex-1 w-full min-h-0 overflow-hidden relative bg-[#ebebeb]">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={handleLogout}
        />

        {/* Dashboard Dynamic Content View - Blurred on mobile when dropdown is open */}
        <main
          className={`flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden custom-scrollbar px-2.5 sm:px-6 py-2.5 sm:py-4 space-y-3.5 sm:space-y-4 transition-all duration-300 bg-[#ebebeb] ${
            isMobileMenuOpen ? 'blur-[8px] md:blur-none pointer-events-none md:pointer-events-auto' : ''
          }`}
          style={
            isMobileMenuOpen
              ? { filter: 'blur(8px)', WebkitFilter: 'blur(8px)' }
              : undefined
          }
        >
          {/* Welcome Banner */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-slate-200/70">
              <div>
                <h1 className="font-heading text-lg sm:text-xl font-bold text-navy-950 tracking-tight flex items-center gap-1.5">
                  <span>Welcome Back, Admin</span>
                  <span className="text-sm">👋</span>
                </h1>
                <p className="text-[11px] text-slate-500 font-sans">
                  Real-time Noida commercial inventory & CRM overview
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Inventory Active
                </span>
              </div>
            </div>
          )}

          {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-2.5 sm:space-y-3.5">
              {/* Row 1: Properties Stat Cards (2x2 on Mobile, 4x1 on Desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <StatCard
                  label="Properties Total"
                  value={summary.totalProperties}
                  subLabel="Total Registered"
                  variant="blue"
                  onClick={() => handleTabChange('properties')}
                  icon={
                    <svg className="w-3.5 h-3.5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                />
                <StatCard
                  label="Active"
                  value={summary.activeProperties}
                  subLabel="Verified Live"
                  variant="highlight"
                  onClick={() => handleTabChange('properties')}
                  icon={
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <StatCard
                  label="Expiring Soon"
                  value={summary.expiringSoonProperties}
                  subLabel="Within 14 Days"
                  variant="warning"
                  onClick={() => handleTabChange('properties')}
                  icon={
                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <StatCard
                  label="Expired"
                  value={summary.expiredProperties}
                  subLabel="Requires Renewal"
                  variant="danger"
                  onClick={() => handleTabChange('properties')}
                  icon={
                    <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                />
              </div>

              {/* Row 2: Leads & Revenue (2x1 + Full Width on Mobile, 3x1 on Desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                <StatCard
                  label="Leads"
                  value={summary.totalLeads}
                  subLabel="Active Corporate Clients"
                  variant="indigo"
                  onClick={() => handleTabChange('leads')}
                  icon={
                    <svg className="w-3.5 h-3.5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
                <StatCard
                  label="New Leads Today"
                  value={summary.newLeadsToday}
                  subLabel="Fresh Inquiries"
                  variant="teal"
                  onClick={() => handleTabChange('leads')}
                  icon={
                    <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                />
                <div className="col-span-2 lg:col-span-1">
                  <RevenueCard amountFormatted={summary.monthlyRevenueFormatted} />
                </div>
              </div>

              {/* Row 3: Recent Leads & Expiring Soon */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
                <RecentLeadsCard leads={recentLeads} onViewAll={() => handleTabChange('leads')} />
                <ExpiringPropertiesCard
                  properties={expiringProperties}
                  onViewProperties={() => {
                    setSearchQuery('');
                    handleTabChange('properties');
                  }}
                  onSelectProperty={handlePropertyRedirect}
                />
              </div>

              {/* Row 4: Recent Properties & Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
                <RecentPropertiesCard
                  properties={recentProperties}
                  onViewAll={() => {
                    setSearchQuery('');
                    handleTabChange('properties');
                  }}
                  onSelectProperty={handlePropertyRedirect}
                />
                <RecentActivityCard activities={recentActivities} />
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES MANAGEMENT SCREEN (Exact User Wireframe 2) */}
          {activeTab === 'properties' && (
            <PropertyViewContainer
              isSidebarCollapsed={isSidebarCollapsed}
              externalSearchQuery={searchQuery}
              selectedSectorFilter={activeSectorFilter}
              initialAction={initialAction}
            />
          )}

          {/* TAB 3: CLIENTS & SALES CRM */}
          {activeTab === 'clients' && (
            <ClientManagementView />
          )}

          {/* TAB 4: LEADS MANAGEMENT */}
          {activeTab === 'leads' && (
            <LeadsManagementView />
          )}
        </main>
      </div>

      {/* Global Property Details Modal from Omnisearch */}
      <PropertyDetailsModal
        property={selectedGlobalProperty}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
