export interface LeadItem {
  _id: string;
  clientId?: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  clientType?: 'Buyer' | 'Tenant' | 'Investor' | 'Corporate';
  status: 'Lead' | 'In Discussion' | 'Site Visit Scheduled' | 'Deal Closed' | 'Cold / Inactive';
  budget?: number;
  requirementSqFt?: number;
  preferredSector?: string;
  propertyTitle?: string;
  notes?: string;
  source?: string;
  followUpDate?: string;
  siteVisitDetails?: {
    propertyId?: string;
    propertyTitle?: string;
    visitDate?: string;
    remarks?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadFilterParams {
  search?: string;
  status?: string;
  source?: string;
  page?: number;
  limit?: number;
}

export interface LeadStats {
  totalLeads: number;
  inDiscussion: number;
  siteVisitsScheduled: number;
  dealsClosed: number;
  dueFollowUps: number;
  newLeadsToday: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const leadService = {
  /**
   * Fetch aggregated lead statistics for fast card rendering
   */
  async getLeadStats(): Promise<LeadStats> {
    try {
      const res = await fetch(`${API_BASE}/leads/stats`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Failed to fetch lead stats');
      const json = await res.json();
      return json.data || {
        totalLeads: 0,
        inDiscussion: 0,
        siteVisitsScheduled: 0,
        dealsClosed: 0,
        dueFollowUps: 0,
        newLeadsToday: 0
      };
    } catch (err) {
      console.error('[leadService] Error fetching lead stats:', err);
      return {
        totalLeads: 0,
        inDiscussion: 0,
        siteVisitsScheduled: 0,
        dealsClosed: 0,
        dueFollowUps: 0,
        newLeadsToday: 0
      };
    }
  },
  /**
   * Fetch leads with optional search, status filtering, and pagination
   */
  async getLeads(params?: LeadFilterParams): Promise<{ data: LeadItem[]; total: number; pages: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status && params.status !== 'all') {
        searchParams.append('status', params.status);
      }
      if (params?.source && params.source !== 'all') {
        searchParams.append('source', params.source);
      }
      if (params?.page) searchParams.append('page', String(params.page));
      searchParams.append('limit', String(params?.limit || 50));

      const res = await fetch(`${API_BASE}/leads?${searchParams.toString()}`, {
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch leads');
      }

      const json = await res.json();
      return {
        data: json.data || [],
        total: json.total || 0,
        pages: json.pages || 1
      };
    } catch (err) {
      console.error('[leadService] Error fetching leads:', err);
      return { data: [], total: 0, pages: 1 };
    }
  },

  /**
   * Create a new Lead inquiry
   */
  async createLead(leadData: Partial<LeadItem>): Promise<LeadItem> {
    const payload = {
      status: 'Lead',
      clientType: 'Corporate',
      source: 'Direct Call',
      ...leadData
    };

    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to save lead');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Update lead status or details
   */
  async updateLead(id: string, updateData: Partial<LeadItem>): Promise<LeadItem> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to update lead');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Delete lead
   */
  async deleteLead(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  /**
   * Get direct CSV export download link
   */
  getExportCSVUrl(): string {
    return `${API_BASE}/leads/export/csv`;
  }
};
