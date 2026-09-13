'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientService, ClientItem, ClientStats } from '@/services/clientService';
import AddEditClientModal from './AddEditClientModal';
import ClientDetailsModal from './ClientDetailsModal';

const CLIENT_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'Buyer', label: 'Buyers' },
  { value: 'Tenant', label: 'Tenants' },
  { value: 'Investor', label: 'Investors' },
  { value: 'Corporate', label: 'Corporate' }
];

function ClientTypeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const label = CLIENT_TYPE_OPTIONS.find((o) => o.value === value)?.label || 'All Types';

  return (
    <div ref={ref} className="relative inline-block select-none text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1 text-xs font-semibold border rounded-lg bg-white transition-all flex items-center justify-between gap-1.5 cursor-pointer shadow-2xs ${
          isOpen ? 'border-navy-900 ring-2 ring-navy-900/10 text-navy-900' : 'border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <span>{label}</span>
        <svg className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-navy-900' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          {CLIENT_TYPE_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected ? 'bg-slate-100 text-navy-950 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="text-navy-900 font-bold text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ClientManagementView() {
  const queryClient = useQueryClient();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingClient, setViewingClient] = useState<ClientItem | null>(null);

  // Notification / feedback toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  // TanStack Query Cache: Instant loading without repeat fetches when switching tabs
  const { data: clientsRes, isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients', searchQuery, statusFilter, typeFilter, currentPage, pageSize],
    queryFn: () =>
      clientService.getClients({
        search: searchQuery,
        status: statusFilter,
        clientType: typeFilter,
        page: currentPage,
        limit: pageSize
      }),
    staleTime: 3 * 60 * 1000,
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery<ClientStats>({
    queryKey: ['client-stats'],
    queryFn: () => clientService.getClientStats(),
    staleTime: 5 * 60 * 1000,
  });

  const clients = clientsRes?.data || [];
  const totalRecords = clientsRes?.total || 0;
  const totalPages = Math.max(1, clientsRes?.pages || 1);
  const stats = statsData || null;
  const isLoading = isClientsLoading || isStatsLoading;

  // Handle Save Client (Add or Edit)
  const handleSaveClient = async (formData: Partial<ClientItem>) => {
    if (editingClient?._id) {
      await clientService.updateClient(editingClient._id, formData);
      showToast('Client details updated successfully');
    } else {
      await clientService.createClient(formData);
      showToast('New client registered successfully');
    }
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    queryClient.invalidateQueries({ queryKey: ['client-stats'] });
  };

  // Handle Delete Client
  const handleDeleteClient = async (client: ClientItem) => {
    if (!window.confirm(`Are you sure you want to delete client record for "${client.name}"?`)) {
      return;
    }
    try {
      await clientService.deleteClient(client._id);
      showToast('Client record deleted');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-stats'] });
    } catch (err) {
      alert('Failed to delete client');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!clients.length) return;
    const headers = ['Client ID', 'Name', 'Phone', 'Email', 'Company', 'Type', 'Status', 'Property Title', 'Deal Amount', 'Commission Earned', 'Notes'];
    const rows = clients.map(c => [
      c.clientId || '',
      `"${c.name || ''}"`,
      c.phone || '',
      c.email || '',
      `"${c.company || ''}"`,
      c.clientType || '',
      c.status || '',
      `"${c.propertyTitle || ''}"`,
      c.dealAmount || 0,
      c.commissionEarned || 0,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Clients_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format currency helpers
  const formatCurrency = (val?: number) => {
    if (!val || val === 0) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Deal Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Site Visit Scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Discussion':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Lead':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2.5 bg-navy-950 text-white border border-gold-400/50 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-slide-in">
          <span className="text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-2.5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-navy-900 tracking-tight">
              Client Directory & Sales
            </h1>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-gold-50 border border-gold-300/80 text-navy-950 font-bold whitespace-nowrap">
              {clients.length} Records
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">
            Manage buyers, tenant inquiries, closed sales & revenue
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!clients.length}
            className="flex-1 sm:flex-none justify-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 whitespace-nowrap cursor-pointer"
            title="Download CSV report"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>

          {/* Add Client Button */}
          <button
            type="button"
            onClick={() => {
              setEditingClient(null);
              setIsAddEditOpen(true);
            }}
            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap active:scale-98"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon - Sleek & Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Clients */}
        <div className="bg-white py-2.5 px-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3 transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100/80">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Clients</div>
            <div className="text-lg font-bold text-navy-900 leading-tight">{stats?.totalClients || clients.length}</div>
            <div className="text-[10px] text-slate-500 truncate">Corporate & Direct</div>
          </div>
        </div>

        {/* Card 2: Deals Closed & Revenue */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white py-2.5 px-3.5 rounded-xl border border-emerald-200/90 shadow-2xs flex items-center gap-3 transition-all hover:border-emerald-300">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Deals Closed</div>
            <div className="text-lg font-bold text-emerald-700 leading-tight">{stats?.dealsClosed || 0}</div>
            <div className="text-[10px] text-emerald-600 font-semibold truncate">
              Rev: {formatCurrency(stats?.totalRevenue)}
            </div>
          </div>
        </div>

        {/* Card 3: In Discussion */}
        <div className="bg-white py-2.5 px-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3 transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100/80">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Discussion</div>
            <div className="text-lg font-bold text-navy-900 leading-tight">{stats?.activeLeads || 0}</div>
            <div className="text-[10px] text-slate-500 truncate">Site Visits & Offers</div>
          </div>
        </div>

        {/* Card 4: Corporate Accounts */}
        <div className="bg-white py-2.5 px-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3 transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-100/80">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Corporate Accounts</div>
            <div className="text-lg font-bold text-navy-900 leading-tight">{stats?.corporateClients || 0}</div>
            <div className="text-[10px] text-slate-500 truncate">Enterprise Tenants</div>
          </div>
        </div>
      </div>

      {/* Filter and Live Search Controls */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-2xs">
        {/* Search Bar (Only control visible on mobile, expanded full-width) */}
        <div className="relative flex-1 w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search client name, phone, company, property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-navy-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills & Type Dropdown (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            {[
              {
                id: 'all',
                label: 'All Status',
                icon: null
              },
              {
                id: 'Deal Closed',
                label: 'Deal Closed',
                icon: (
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )
              },
              {
                id: 'In Discussion',
                label: 'In Discussion',
                icon: (
                  <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
              {
                id: 'Site Visit Scheduled',
                label: 'Site Visit',
                icon: (
                  <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                id: 'Lead',
                label: 'Fresh Lead',
                icon: (
                  <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white text-navy-950 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Client Type Dropdown */}
          <ClientTypeSelect value={typeFilter} onChange={setTypeFilter} />
        </div>
      </div>

      {/* Clients Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full mb-2"></div>
            <p>Loading client database...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-2.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-navy-900">No Client Records Found</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'Get started by adding your first client or recording a "Sales by Me" deal.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingClient(null);
                setIsAddEditOpen(true);
              }}
              className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-bold text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Client</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Client Name & Info</th>
                  <th className="py-2.5 px-4">Contact</th>
                  <th className="py-2.5 px-4">Type & Sector</th>
                  <th className="py-2.5 px-4">Deal / Property</th>
                  <th className="py-2.5 px-4 text-right">Commission / Revenue</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => {
                  const initials = client.name ? client.name.slice(0, 2).toUpperCase() : 'CL';
                  const cleanPhone = client.phone ? client.phone.replace(/[^0-9]/g, '') : '';

                  return (
                    <tr key={client._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Client Name & ID */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setViewingClient(client);
                                setIsDetailsOpen(true);
                              }}
                              className="font-bold text-navy-900 hover:text-gold-600 text-left transition-colors cursor-pointer"
                            >
                              {client.name}
                            </button>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span>{client.clientId}</span>
                              {client.company && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-600 font-medium truncate max-w-[120px]">
                                    {client.company}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact with Call & WhatsApp SVG buttons */}
                      <td className="py-2.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-navy-900 flex items-center gap-1.5">
                            <span>{client.phone}</span>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat on WhatsApp"
                                className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-emerald-200/60"
                              >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.125-.52-1.823-.755-2.998-2.613-3.089-2.733-.09-.12-.734-.975-.734-1.86s.464-1.32.628-1.503c.164-.183.358-.229.477-.229.12 0 .239.001.343.006.111.005.26-.042.406.309.15.358.508 1.238.553 1.329.045.091.075.197.015.316-.06.12-.09.195-.179.3-.09.105-.189.234-.269.315-.09.091-.184.19-.079.371.105.18.468.772 1.006 1.251.692.617 1.275.808 1.455.898.18.091.285.076.39-.045.105-.12.45-.525.57-.705.12-.18.239-.15.399-.09.16.06 1.018.48 1.197.57.18.09.299.135.343.21.045.075.045.435-.099.84z"/>
                                </svg>
                              </a>
                            )}
                            {client.phone && (
                              <a
                                href={`tel:${client.phone}`}
                                title="Call directly"
                                className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 hover:bg-navy-900 hover:text-white flex items-center justify-center transition-colors border border-slate-200"
                              >
                                <svg className="w-3 h-3 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              </a>
                            )}
                          </div>
                          {client.email && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              {client.email}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Type & Sector */}
                      <td className="py-2.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-navy-900">{client.clientType}</span>
                          <div className="text-[11px] text-slate-400">
                            {client.preferredSector || 'Noida Any'}
                            {client.requirementSqFt ? ` • ${client.requirementSqFt} sq.ft.` : ''}
                          </div>
                        </div>
                      </td>

                      {/* Deal / Property with SVG Building Icon */}
                      <td className="py-2.5 px-4">
                        {client.propertyTitle ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-navy-900 truncate max-w-[180px] flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="truncate">{client.propertyTitle}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Deal: <span className="font-bold text-navy-900">{formatCurrency(client.dealAmount)}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No deal linked yet</span>
                        )}
                      </td>

                      {/* Commission / Revenue */}
                      <td className="py-3.5 px-4 text-right">
                        {client.commissionEarned && client.commissionEarned > 0 ? (
                          <div className="inline-block text-right">
                            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              +{formatCurrency(client.commissionEarned)}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                              {client.paymentMode || 'Received'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-mono">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(client.status)}`}>
                          {client.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => {
                              setViewingClient(client);
                              setIsDetailsOpen(true);
                            }}
                            title="View Full Profile"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingClient(client);
                              setIsAddEditOpen(true);
                            }}
                            title="Edit Client"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-gold-600 hover:bg-gold-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClient(client)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalRecords > 0 && (
            <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500 font-medium flex items-center gap-1.5">
                <span>Showing</span>
                <span className="font-bold text-navy-950 font-heading">
                  {Math.min((currentPage - 1) * pageSize + 1, totalRecords)}
                </span>
                <span>to</span>
                <span className="font-bold text-navy-950 font-heading">
                  {Math.min(currentPage * pageSize, totalRecords)}
                </span>
                <span>of</span>
                <span className="font-bold text-navy-950 font-heading">
                  {totalRecords.toLocaleString()}
                </span>
                <span>clients</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Rows per page selector */}
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <span className="hidden sm:inline">Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-navy-950 font-bold focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer text-xs"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Previous / Next & Page Numbers */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-navy-950 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    Previous
                  </button>

                  <div className="px-2 font-bold text-navy-950">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-navy-950 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        )}
      </div>

      {/* Add / Edit Modal */}
      <AddEditClientModal
        isOpen={isAddEditOpen}
        client={editingClient}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
      />

      {/* View Details Modal */}
      <ClientDetailsModal
        isOpen={isDetailsOpen}
        client={viewingClient}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingClient(null);
        }}
        onEdit={(client) => {
          setEditingClient(client);
          setIsAddEditOpen(true);
        }}
      />
    </div>
  );
}
