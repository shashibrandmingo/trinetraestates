'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { leadService, LeadItem } from '@/services/leadService';

const LEAD_SOURCES = [
  'Direct Call',
  'Website Enquiry',
  '99acres',
  'MagicBricks',
  'Reference',
  'Walk-in'
];

const LEAD_STAGES: { value: LeadItem['status']; label: string; dotColor: string; badgeClass: string }[] = [
  { value: 'Lead', label: 'Lead', dotColor: 'bg-blue-500', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100' },
  { value: 'In Discussion', label: 'In Discussion', dotColor: 'bg-amber-500', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100' },
  { value: 'Site Visit Scheduled', label: 'Site Visit', dotColor: 'bg-purple-500', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100' },
  { value: 'Deal Closed', label: 'Deal Closed', dotColor: 'bg-emerald-500', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100' },
  { value: 'Cold / Inactive', label: 'Inactive', dotColor: 'bg-slate-400', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' },
];

/** Luxury custom dropdown for Lead Stage / Status */
function LeadStatusSelect({
  status,
  onChange,
  align = 'left'
}: {
  status: LeadItem['status'];
  onChange: (newStatus: LeadItem['status']) => void;
  align?: 'left' | 'right' | 'center';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentStage = LEAD_STAGES.find((s) => s.value === status) || LEAD_STAGES[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center justify-between gap-1.5 cursor-pointer shadow-2xs ${currentStage.badgeClass} ${
          isOpen ? 'ring-2 ring-navy-900/10' : ''
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${currentStage.dotColor}`} />
        <span>{currentStage.label}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-1.5 w-40 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${
            align === 'center'
              ? 'left-1/2 -translate-x-1/2'
              : align === 'right'
              ? 'right-0'
              : 'left-0'
          }`}
        >
          <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Change Stage
          </div>
          {LEAD_STAGES.map((st) => {
            const isSelected = st.value === status;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => {
                  onChange(st.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 text-navy-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${st.dotColor}`} />
                  <span>{st.label}</span>
                </div>
                {isSelected && <span className="text-navy-900 font-bold text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Luxury custom dropdown for Lead Source Filter */
function LeadSourceSelect({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const allSourceOptions = [
    { value: 'all', label: 'All Sources' },
    ...LEAD_SOURCES.map((s) => ({ value: s, label: s }))
  ];

  const selectedLabel = allSourceOptions.find((o) => o.value === value)?.label || 'All Sources';

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 text-xs font-semibold border rounded-lg bg-white transition-all flex items-center justify-between gap-2 cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-navy-900 ring-2 ring-navy-900/10 text-navy-900'
            : 'border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180 text-navy-900' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-44 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto custom-scrollbar">
          <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Filter by Source
          </div>
          {allSourceOptions.map((opt) => {
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
                  isSelected
                    ? 'bg-slate-100 text-navy-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-navy-900'
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

export default function LeadsManagementView() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [onlyDueFollowUps, setOnlyDueFollowUps] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Notepad & Follow-Up Modal State
  const [activeNotepadLead, setActiveNotepadLead] = useState<LeadItem | null>(null);
  const [notepadText, setNotepadText] = useState('');
  const [followUpDateInput, setFollowUpDateInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // 2. Property Matcher & Pitch Modal State
  const [pitchLead, setPitchLead] = useState<LeadItem | null>(null);
  const [matchedProperties, setMatchedProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [customPitchText, setCustomPitchText] = useState('');
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // 3. Site Visit Scheduler Modal State
  const [visitLead, setVisitLead] = useState<LeadItem | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitTower, setVisitTower] = useState('');
  const [visitRemarks, setVisitRemarks] = useState('');
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);

  // New Lead Form State
  const [newLead, setNewLead] = useState<Partial<LeadItem>>({
    name: '',
    phone: '',
    email: '',
    company: '',
    requirementSqFt: 0,
    preferredSector: 'Sector 62',
    budget: 0,
    status: 'Lead',
    source: 'Direct Call',
    followUpDate: '',
    notes: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sourceFilter, onlyDueFollowUps]);

  // Dedicated fast stats query (separate from paginated table rows)
  const { data: leadStats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => leadService.getLeadStats(),
    staleTime: 5 * 60 * 1000
  });

  // TanStack Query: cached fetching
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['admin-leads', search, statusFilter, sourceFilter, currentPage, pageSize],
    queryFn: () =>
      leadService.getLeads({
        search,
        status: statusFilter === 'due' ? 'all' : statusFilter,
        source: sourceFilter,
        page: currentPage,
        limit: pageSize
      }),
    staleTime: 2 * 60 * 1000
  });

  const rawLeads = leadsData?.data || [];
  const totalRecords = leadsData?.total || 0;
  const totalPages = Math.max(1, leadsData?.pages || 1);

  // Filter due follow-ups if tab selected
  const todayStr = new Date().toISOString().slice(0, 10);
  const leads = onlyDueFollowUps
    ? rawLeads.filter(
        (l) => l.followUpDate && new Date(l.followUpDate).toISOString().slice(0, 10) <= todayStr
      )
    : rawLeads;

  const dueCount = leadStats?.dueFollowUps ?? rawLeads.filter(
    (l) => l.followUpDate && new Date(l.followUpDate).toISOString().slice(0, 10) <= todayStr
  ).length;

  // Quick Status Update
  const handleStatusChange = async (id: string, newStatus: LeadItem['status']) => {
    try {
      if (newStatus === 'Site Visit Scheduled') {
        const targetLead = leads.find((l) => l._id === id);
        if (targetLead) {
          handleOpenVisitScheduler(targetLead);
          return;
        }
      }

      await leadService.updateLead(id, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });
      showToast(`Lead status updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) {
      alert('Name and Phone are required');
      return;
    }

    try {
      await leadService.createLead(newLead);
      setIsAddModalOpen(false);
      setNewLead({
        name: '',
        phone: '',
        email: '',
        company: '',
        requirementSqFt: 0,
        preferredSector: 'Sector 62',
        budget: 0,
        status: 'Lead',
        source: 'Direct Call',
        followUpDate: '',
        notes: ''
      });
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });
      showToast('New lead registered successfully');
    } catch (err) {
      alert('Failed to create lead');
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string, name: string) => {
    if (!window.confirm(`Delete lead "${name}"?`)) return;
    try {
      await leadService.deleteLead(id);
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });
      showToast('Lead deleted');
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  // 1. Notepad Modal Handlers
  const handleOpenNotepad = (lead: LeadItem) => {
    setActiveNotepadLead(lead);
    setNotepadText(lead.notes || '');
    setFollowUpDateInput(
      lead.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 10) : ''
    );
  };

  const handleSaveNote = async () => {
    if (!activeNotepadLead) return;
    setIsSavingNote(true);
    try {
      await leadService.updateLead(activeNotepadLead._id, {
        notes: notepadText.trim(),
        followUpDate: followUpDateInput ? new Date(followUpDateInput).toISOString() : undefined
      });
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      showToast(`Notes & Follow-up saved for ${activeNotepadLead.name}`);
      setActiveNotepadLead(null);
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleAppendQuickSnippet = (snippet: string) => {
    const timestamp = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const formatted = `[${timestamp}] ${snippet}\n`;
    setNotepadText((prev) => (prev ? `${prev.trim()}\n${formatted}` : formatted));
  };

  const handleSetQuickFollowUpDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFollowUpDateInput(d.toISOString().slice(0, 10));
  };

  // 2. Property Matcher & Pitch Handlers
  const handleOpenPitchModal = async (lead: LeadItem) => {
    setPitchLead(lead);
    setIsLoadingMatches(true);
    setSelectedProperty(null);
    setCustomPitchText('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const sectorQuery = lead.preferredSector ? `&sector=${encodeURIComponent(lead.preferredSector)}` : '';
      const res = await fetch(`${apiBase}/offices?status=Active${sectorQuery}&limit=6`);
      const json = await res.json();
      const props = json.data || [];
      setMatchedProperties(props);

      if (props.length > 0) {
        generatePitch(lead, props[0]);
      } else {
        // Fallback pitch without specific property
        setCustomPitchText(
          `Namaste ${lead.name} Ji! 🙏\n\nRegarding your office space requirement in ${lead.preferredSector || 'Noida'}:\nWe have verified commercial properties matching your criteria (${lead.requirementSqFt ? `${lead.requirementSqFt} Sq.Ft` : 'Corporate Office'}).\n\nWould you like to review the floor plans and schedule a site visit this week?\n\nCommercial Advisory Team\nOffice Space Noida`
        );
      }
    } catch (err) {
      console.error('Error fetching property matches:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const generatePitch = (lead: LeadItem, prop: any) => {
    setSelectedProperty(prop);
    const rentFormatted = prop.monthlyRentInLakh
      ? `₹${prop.monthlyRentInLakh} Lakh/mo`
      : prop.price
      ? `₹${prop.price.toLocaleString('en-IN')}/mo`
      : 'Competitive';
    const rateFormatted = prop.rentPerSqFt ? `₹${prop.rentPerSqFt}/sq.ft` : '';

    const text = `Namaste ${lead.name} Ji! 🙏\n\nAs discussed regarding your requirement for commercial office space in ${lead.preferredSector || 'Noida'}:\n\n🏢 *Property:* ${prop.title}\n📍 *Location:* ${prop.location?.sector || prop.sector || 'Noida'}\n📐 *Area:* ${prop.areaSqFt ? `${prop.areaSqFt.toLocaleString()} Sq.Ft` : 'As requested'}\n💰 *Rent:* ${rentFormatted} ${rateFormatted ? `(${rateFormatted})` : ''}\n✨ *Status:* Ready-to-Move Corporate Space\n\nWould you be available for a site inspection this week?\n\nBest regards,\nCommercial Advisory Team\nOffice Space Noida`;

    setCustomPitchText(text);
  };

  // 3. Site Visit Scheduler Handlers
  const handleOpenVisitScheduler = (lead: LeadItem) => {
    setVisitLead(lead);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setVisitDate(tomorrow.toISOString().slice(0, 10));
    setVisitTime('11:30 AM');
    setVisitTower(lead.siteVisitDetails?.propertyTitle || (lead as any).propertyTitle || `${lead.preferredSector || 'Sector 62'} Commercial Tower`);
    setVisitRemarks(lead.notes || '');
  };

  const handleConfirmVisit = async () => {
    if (!visitLead || !visitDate || !visitTower) {
      alert('Please fill visit date and property');
      return;
    }

    setIsSchedulingVisit(true);
    try {
      await leadService.updateLead(visitLead._id, {
        status: 'Site Visit Scheduled',
        siteVisitDetails: {
          propertyTitle: visitTower,
          visitDate: new Date(visitDate).toISOString(),
          remarks: visitRemarks
        }
      });
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-overview'] });
      showToast(`Site visit scheduled for ${visitLead.name}`);

      // Open WhatsApp confirmation pass
      const waMsg = `*SITE VISIT CONFIRMED* 🏢\n\nDear ${visitLead.name},\nYour commercial property visit is confirmed:\n\n📍 *Building:* ${visitTower}\n📅 *Date & Time:* ${new Date(visitDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at ${visitTime}\n👤 *Host:* Commercial Leasing Desk\n\nPlease let us know if you need parking assistance upon arrival.\n\nOffice Space Noida`;
      const cleanPhone = visitLead.phone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');

      setVisitLead(null);
    } catch (err) {
      alert('Failed to schedule visit');
    } finally {
      setIsSchedulingVisit(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Lead':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'In Discussion':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Site Visit Scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Deal Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Cold / Inactive':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case '99acres':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'MagicBricks':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Website Enquiry':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Reference':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Direct Call':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-3.5 sm:space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2 bg-navy-950 text-white rounded-lg shadow-lg border border-gold-400 text-xs font-semibold flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          {toastMessage}
        </div>
      )}

      {/* Top Header & Action Row - Matching Client CRM */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-2.5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-navy-900 tracking-tight">
              Leads & Inquiries
            </h1>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 font-bold whitespace-nowrap">
              {leadStats?.totalLeads ?? totalRecords ?? rawLeads.length} Records
            </span>
            {dueCount > 0 && (
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                {dueCount} Due Today
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">
            Manage prospects, follow-up timelines, WhatsApp pitches & site visit schedules
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Export CSV */}
          <a
            href={leadService.getExportCSVUrl()}
            download
            className="flex-1 sm:flex-none justify-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
            title="Download full leads list as Excel/CSV"
          >
            <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </a>

          {/* Add New Lead (Gold gradient button matching Client CRM) */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap active:scale-98"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon - Matching Client CRM Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Total Leads */}
        <div className="bg-white py-2.5 px-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3 transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100/80">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Leads</div>
            <div className="text-lg font-bold text-navy-900 leading-tight">
              {leadStats?.totalLeads ?? totalRecords ?? rawLeads.length}
            </div>
            <div className="text-[10px] text-slate-500 truncate">Registered Prospects</div>
          </div>
        </div>

        {/* Card 2: Due Follow-ups */}
        <div className={`py-2.5 px-3.5 rounded-xl border shadow-2xs flex items-center gap-3 transition-all ${
          dueCount > 0
            ? 'bg-rose-50/60 border-rose-200/90 hover:border-rose-300'
            : 'bg-white border-slate-200/90 hover:border-slate-300'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
            dueCount > 0 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-100/80'
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className={`text-[10px] font-bold uppercase tracking-wider ${dueCount > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
              Due Follow-ups
            </div>
            <div className={`text-lg font-bold leading-tight ${dueCount > 0 ? 'text-rose-700' : 'text-navy-900'}`}>
              {dueCount}
            </div>
            <div className={`text-[10px] truncate ${dueCount > 0 ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
              {dueCount > 0 ? 'Action Required Today' : 'All Clear'}
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
            <div className="text-lg font-bold text-navy-900 leading-tight">
              {leadStats?.inDiscussion ?? rawLeads.filter((l) => l.status === 'In Discussion').length}
            </div>
            <div className="text-[10px] text-slate-500 truncate">Active Negotiations</div>
          </div>
        </div>

        {/* Card 4: Site Visits / Deals Closed */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white py-2.5 px-3.5 rounded-xl border border-emerald-200/90 shadow-2xs flex items-center gap-3 transition-all hover:border-emerald-300">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Closed / Visits</div>
            <div className="text-lg font-bold text-emerald-700 leading-tight">
              {leadStats
                ? ((leadStats.siteVisitsScheduled || 0) + (leadStats.dealsClosed || 0))
                : rawLeads.filter((l) => l.status === 'Site Visit Scheduled' || l.status === 'Deal Closed').length}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold truncate">Visits & Closures</div>
          </div>
        </div>
      </div>

      {/* Filter and Live Search Controls - matching Client CRM layout */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-2xs">
        {/* Search Bar */}
        <div className="relative flex-1 w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prospect name, phone, company..."
            className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none text-navy-900"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs & Source Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0 max-w-full">
            {[
              { id: 'all', label: 'All' },
              { id: 'due', label: `Due (${dueCount})` },
              { id: 'Lead', label: 'New' },
              { id: 'In Discussion', label: 'In Discussion' },
              { id: 'Site Visit Scheduled', label: 'Site Visit' },
              { id: 'Deal Closed', label: 'Closed' },
              { id: 'Cold / Inactive', label: 'Inactive' }
            ].map((tab) => {
              const isSelected = tab.id === 'due' ? onlyDueFollowUps : !onlyDueFollowUps && statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === 'due') {
                      setOnlyDueFollowUps(true);
                    } else {
                      setOnlyDueFollowUps(false);
                      setStatusFilter(tab.id);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-navy-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Lead Source Filter */}
          <LeadSourceSelect value={sourceFilter} onChange={setSourceFilter} />
        </div>
      </div>

      {/* Leads List / Table */}
      {isLoading ? (
        <div className="py-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading leads data...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-heading text-sm font-bold text-navy-900">No leads found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'Try clearing search filters to see all inquiries.' : 'Click "Add New Lead" above to record a new client enquiry.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Lead Cards View (Phone Mode) */}
          <div className="md:hidden space-y-3">
            {leads.map((lead) => {
              const isFollowUpDue =
                lead.followUpDate &&
                new Date(lead.followUpDate).toISOString().slice(0, 10) <= todayStr;
              const isFollowUpOverdue =
                lead.followUpDate &&
                new Date(lead.followUpDate).toISOString().slice(0, 10) < todayStr;
              const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

              return (
                <div
                  key={lead._id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 space-y-3 transition-shadow hover:shadow-xs"
                >
                  {/* Card Header: Name + Source & Stage Dropdown */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-navy-950 text-sm">{lead.name}</span>
                        {lead.source && (
                          <span className={`text-[9.5px] font-semibold px-1.5 py-0.2 rounded border ${getSourceBadge(lead.source)}`}>
                            {lead.source}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {lead.company || 'Corporate Client'}
                      </div>
                    </div>

                    {/* Stage Dropdown */}
                    <LeadStatusSelect
                      status={lead.status}
                      onChange={(newStatus) => handleStatusChange(lead._id, newStatus)}
                      align="right"
                    />
                  </div>

                  {/* Contact & Location Box */}
                  <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-100 space-y-2 text-xs">
                    {/* Contact Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="font-bold text-navy-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{lead.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/91${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp Chat"
                          className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-300 hover:bg-emerald-200 transition-colors flex items-center gap-0.5"
                        >
                          <span>WA</span>
                        </a>
                      </div>

                      {/* Sector Badge */}
                      <span className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 inline-flex items-center gap-1 shrink-0">
                        <svg className="w-3 h-3 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{lead.preferredSector || 'Noida'}</span>
                      </span>
                    </div>

                    {/* Requirement & Budget Row */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
                      <span className="text-slate-600">
                        Req:{' '}
                        <strong className="text-navy-900 font-semibold">
                          {lead.requirementSqFt ? `${lead.requirementSqFt.toLocaleString()} Sq. Ft.` : 'Flexible Area'}
                        </strong>
                      </span>
                      {lead.budget ? (
                        <span className="text-emerald-700 font-semibold">
                          Budget: ₹{lead.budget.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No budget set</span>
                      )}
                    </div>
                  </div>

                  {/* Follow-Up Timeline & Note Preview */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      {lead.followUpDate ? (
                        <button
                          type="button"
                          onClick={() => handleOpenNotepad(lead)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isFollowUpOverdue
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isFollowUpDue
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                          title="Click to reschedule follow-up"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isFollowUpDue ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`}></span>
                          <span>Follow-up: {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenNotepad(lead)}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span>+ Set follow-up date</span>
                        </button>
                      )}
                    </div>

                    {/* Note Snippet */}
                    {lead.notes?.trim() && (
                      <button
                        type="button"
                        onClick={() => handleOpenNotepad(lead)}
                        className="text-[10.5px] text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 max-w-[180px] truncate cursor-pointer"
                        title={lead.notes}
                      >
                        <span className="shrink-0">📝</span>
                        <span className="truncate italic">{lead.notes}</span>
                      </button>
                    )}
                  </div>

                  {/* Mobile Quick Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenPitchModal(lead)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Pitch</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenNotepad(lead)}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        lead.notes?.trim()
                          ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <svg className={`w-3.5 h-3.5 ${lead.notes?.trim() ? 'text-amber-700' : 'text-slate-500'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Notes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead._id, lead.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 cursor-pointer shrink-0"
                      title="Delete Lead"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View - Matching Client CRM */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 font-heading">
                  <tr>
                    <th className="py-2.5 px-4">Prospect & Company</th>
                    <th className="py-2.5 px-4">Contact Info</th>
                    <th className="py-2.5 px-4">Requirement</th>
                    <th className="py-2.5 px-4">Preferred Sector</th>
                    <th className="py-2.5 px-4">Follow-Up</th>
                    <th className="py-2.5 px-4 text-center">Stage / Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {leads.map((lead) => {
                    const initials = lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LD';
                    const isFollowUpDue =
                      lead.followUpDate &&
                      new Date(lead.followUpDate).toISOString().slice(0, 10) <= todayStr;
                    const isFollowUpOverdue =
                      lead.followUpDate &&
                      new Date(lead.followUpDate).toISOString().slice(0, 10) < todayStr;
                    const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';

                    return (
                      <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Prospect Name, Initials Avatar & Source Tag */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-navy-900 text-xs">{lead.name}</span>
                                {lead.source && (
                                  <span className={`text-[9.5px] font-semibold px-1.5 py-0.2 rounded border ${getSourceBadge(lead.source)}`}>
                                    {lead.source}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10.5px] text-slate-500 truncate">{lead.company || 'Corporate Client'}</div>

                              {/* Note Snippet */}
                              {lead.notes?.trim() && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenNotepad(lead)}
                                  className="mt-1 text-[10px] text-amber-900 bg-amber-50/90 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200/80 cursor-pointer flex items-center gap-1.5 transition-colors max-w-[200px] text-left"
                                  title="Click to view/edit note"
                                >
                                  <svg className="w-3 h-3 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span className="truncate italic font-medium">{lead.notes}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              className="font-semibold text-navy-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{lead.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/91${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              title="WhatsApp Chat"
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                            >
                              WA
                            </a>
                          </div>
                          {lead.email && <div className="text-[10.5px] text-slate-400 mt-0.5">{lead.email}</div>}
                        </td>

                        {/* Requirement */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-navy-900">
                            {lead.requirementSqFt ? `${lead.requirementSqFt.toLocaleString()} Sq. Ft.` : 'Flexible Area'}
                          </div>
                          {lead.budget ? (
                            <div className="text-[10.5px] text-emerald-700 font-semibold">
                              Budget: ₹{lead.budget.toLocaleString('en-IN')}
                            </div>
                          ) : (
                            <div className="text-[10.5px] text-slate-400 italic">No budget set</div>
                          )}
                        </td>

                        {/* Sector */}
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 inline-flex items-center gap-1">
                            <svg className="w-3 h-3 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span>{lead.preferredSector || 'Noida'}</span>
                          </span>
                        </td>

                        {/* Feature 1: Follow-Up Column */}
                        <td className="py-3 px-4">
                          {lead.followUpDate ? (
                            <button
                              type="button"
                              onClick={() => handleOpenNotepad(lead)}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                                isFollowUpOverdue
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                  : isFollowUpDue
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                              }`}
                              title="Click to reschedule follow-up"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isFollowUpDue ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`}></span>
                              <span>{new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenNotepad(lead)}
                              className="text-[10.5px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                            >
                              + Set date
                            </button>
                          )}
                        </td>

                        {/* Status Dropdown (Centered) */}
                        <td className="py-3 px-4 text-center">
                          <LeadStatusSelect
                            status={lead.status}
                            onChange={(newStatus) => handleStatusChange(lead._id, newStatus)}
                            align="center"
                          />
                        </td>

                        {/* Actions: Pitch, Notepad, Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Feature 2: Match & Pitch Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenPitchModal(lead)}
                              className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Auto-match property and prepare WhatsApp pitch"
                            >
                              <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span className="text-[11px] font-bold">Pitch</span>
                            </button>

                            {/* Notepad Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenNotepad(lead)}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                lead.notes?.trim()
                                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-navy-900'
                              }`}
                              title={lead.notes?.trim() ? 'View / Edit Notes' : 'Add Notepad Note'}
                            >
                              <svg className={`w-3.5 h-3.5 ${lead.notes?.trim() ? 'text-amber-700' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="text-[11px] font-medium">
                                {lead.notes?.trim() ? 'Notes' : 'Note'}
                              </span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead._id, lead.name)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title="Delete Lead"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                  <span>leads</span>
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
          </div>
        </>
      )}

      {/* 1. Lead Notepad & Follow-Up Modal */}
      {activeNotepadLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-4 h-4 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-navy-950 flex items-center gap-1.5">
                    Lead Notepad & Follow-Up
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {activeNotepadLead.name} • {activeNotepadLead.company || 'Corporate Client'} ({activeNotepadLead.phone})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveNotepadLead(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-base leading-none transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3.5 font-sans">
              {/* Feature 1: Next Follow-Up Date Picker */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-navy-900 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Next Follow-Up Date:</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetQuickFollowUpDays(1)}
                      className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickFollowUpDays(3)}
                      className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      In 3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickFollowUpDays(7)}
                      className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Next Week
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  value={followUpDateInput}
                  onChange={(e) => setFollowUpDateInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-navy-900 focus:outline-none focus:border-navy-900 cursor-pointer"
                />
              </div>

              {/* Quick Stamp Shortcuts */}
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Quick Stamp Shortcuts</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Called - Call back tomorrow',
                    'Site Visit Scheduled',
                    'Budget Discussion Done',
                    'Shared Proposal on WhatsApp',
                    'Decision pending from Director'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAppendQuickSnippet(preset)}
                      className="text-[10.5px] font-medium bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-2 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-navy-900">
                    Client Remarks / Discussion Notes:
                  </label>
                  {notepadText && (
                    <button
                      type="button"
                      onClick={() => setNotepadText('')}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  rows={5}
                  value={notepadText}
                  onChange={(e) => setNotepadText(e.target.value)}
                  placeholder="e.g. Looking for 3000-5000 sq.ft near Advant Navis, Sector 142. Budget 3-4 Lakhs/mo. Wants fully furnished floor with MD cabin. Follow up on Tuesday at 3 PM..."
                  className="w-full bg-amber-50/20 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl p-3 text-xs text-navy-950 font-sans placeholder-slate-400 leading-relaxed outline-none"
                  autoFocus
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10.5px] text-slate-400">
                  {notepadText.length} characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveNotepadLead(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingNote}
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>{isSavingNote ? 'Saving...' : 'Save Note'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Feature 2: Auto-Match Property & WhatsApp Pitch Modal */}
      {pitchLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                  <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-navy-950 flex items-center gap-1.5">
                    Match Property & 1-Click WhatsApp Pitch
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Pitch to {pitchLead.name} • Req: {pitchLead.requirementSqFt || 'Any'} Sq.Ft in {pitchLead.preferredSector || 'Noida'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPitchLead(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-base leading-none transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-4 font-sans text-xs">
              {/* Matched Properties Carousel / List */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Top Matched Properties in {pitchLead.preferredSector || 'Noida'}
                </label>

                {isLoadingMatches ? (
                  <div className="py-4 text-center text-slate-400">Finding matching office spaces...</div>
                ) : matchedProperties.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-center border border-slate-200">
                    No active office in {pitchLead.preferredSector || 'this sector'}. A general commercial proposal template is ready below.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {matchedProperties.map((prop) => {
                      const isSelected = selectedProperty?._id === prop._id;
                      return (
                        <div
                          key={prop._id}
                          onClick={() => generatePitch(pitchLead, prop)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-400'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-navy-950 text-xs truncate">{prop.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {prop.location?.sector || prop.sector || 'Noida'} • {prop.areaSqFt ? `${prop.areaSqFt.toLocaleString()} Sq.Ft` : 'Office'}
                          </div>
                          <div className="text-emerald-700 font-bold text-xs mt-1">
                            {prop.monthlyRentInLakh ? `₹${prop.monthlyRentInLakh} L/mo` : 'Price on Call'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pitch Preview & Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-navy-900">
                    WhatsApp Message Preview:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(customPitchText);
                      showToast('Pitch text copied to clipboard!');
                    }}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Copy Text</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={customPitchText}
                  onChange={(e) => setCustomPitchText(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl p-3 text-xs text-navy-950 font-sans leading-relaxed outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  Ready to send to {pitchLead.phone}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPitchLead(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanPhone = pitchLead.phone.replace(/[^0-9]/g, '');
                      const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(customPitchText)}`;
                      window.open(url, '_blank');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send on WhatsApp</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Feature 4: Site Visit Scheduler Modal */}
      {visitLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                  <svg className="w-4 h-4 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-navy-950">
                    Schedule Site Inspection
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {visitLead.name} ({visitLead.phone})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVisitLead(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-base leading-none transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3 font-sans text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property / Tower to Visit *</label>
                <input
                  type="text"
                  required
                  value={visitTower}
                  onChange={(e) => setVisitTower(e.target.value)}
                  placeholder="e.g. Candor TechSpace Tower B, Sector 62"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visit Date *</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visit Time *</label>
                  <input
                    type="text"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Notes / Client Key Concerns</label>
                <textarea
                  rows={2}
                  value={visitRemarks}
                  onChange={(e) => setVisitRemarks(e.target.value)}
                  placeholder="e.g. Client's Architect will also join. Need key to 4th floor cabin."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-200 text-[11px] text-purple-900 leading-relaxed">
                Confirming will set status to <b>Site Visit Scheduled</b> and open WhatsApp to send a confirmed Visit Pass directly to the client.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVisitLead(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSchedulingVisit}
                  onClick={handleConfirmVisit}
                  className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1"
                >
                  <span>{isSchedulingVisit ? 'Scheduling...' : 'Confirm & Send Pass'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading text-sm font-bold text-navy-950">Add New Lead Inquiry</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prospect Name *</label>
                <input
                  type="text"
                  required
                  value={newLead.name || ''}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newLead.phone || ''}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newLead.company || ''}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    placeholder="e.g. TechCorp Ltd"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requirement (Sq. Ft.)</label>
                  <input
                    type="number"
                    value={newLead.requirementSqFt || ''}
                    onChange={(e) => setNewLead({ ...newLead, requirementSqFt: Number(e.target.value) })}
                    placeholder="e.g. 3000"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Sector</label>
                  <input
                    type="text"
                    value={newLead.preferredSector || ''}
                    onChange={(e) => setNewLead({ ...newLead, preferredSector: e.target.value })}
                    placeholder="e.g. Sector 62"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900"
                  />
                </div>
              </div>

              {/* Feature 3: Source Selection & Next Follow-Up Date in Create Form */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={newLead.source || 'Direct Call'}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900 bg-white cursor-pointer"
                  >
                    {LEAD_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Next Follow-Up</label>
                  <input
                    type="date"
                    value={newLead.followUpDate || ''}
                    onChange={(e) => setNewLead({ ...newLead, followUpDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Requirement Details</label>
                <textarea
                  rows={2}
                  value={newLead.notes || ''}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="Need furnished office with 40 seats..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
