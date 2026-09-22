export interface ClientItem {
  _id: string;
  clientId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  clientType: 'Buyer' | 'Tenant' | 'Investor' | 'Corporate';
  status: 'Lead' | 'In Discussion' | 'Site Visit Scheduled' | 'Deal Closed' | 'Cold / Inactive';
  budget?: number;
  requirementSqFt?: number;
  preferredSector?: string;
  propertyId?: string;
  propertyTitle?: string;
  dealAmount?: number;
  commissionEarned?: number;
  paymentMode?: string;
  dealDate?: string;
  notes?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientStats {
  totalClients: number;
  dealsClosed: number;
  activeLeads: number;
  corporateClients: number;
  totalRevenue: number;
  totalVolume: number;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export const clientService = {
  async getClients(params?: {
    search?: string;
    status?: string;
    clientType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ClientItem[]; total: number; pages: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
      if (params?.clientType && params.clientType !== 'all') searchParams.append('clientType', params.clientType);
      if (params?.page) searchParams.append('page', String(params.page));
      if (params?.limit) searchParams.append('limit', String(params.limit));

      const res = await fetch(`${API_BASE}/clients?${searchParams.toString()}`, {
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch clients');
      }

      const json = await res.json();
      return {
        data: json.data || [],
        total: json.total || 0,
        pages: json.pages || 1
      };
    } catch (err) {
      console.error('[clientService] Error fetching clients:', err);
      return { data: [], total: 0, pages: 1 };
    }
  },

  async getClientStats(): Promise<ClientStats> {
    try {
      const res = await fetch(`${API_BASE}/clients/stats`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Failed to fetch client stats');
      const json = await res.json();
      return json.data || {
        totalClients: 0,
        dealsClosed: 0,
        activeLeads: 0,
        corporateClients: 0,
        totalRevenue: 0,
        totalVolume: 0
      };
    } catch (err) {
      console.error('[clientService] Error fetching client stats:', err);
      return {
        totalClients: 0,
        dealsClosed: 0,
        activeLeads: 0,
        corporateClients: 0,
        totalRevenue: 0,
        totalVolume: 0
      };
    }
  },

  async createClient(clientData: Partial<ClientItem>): Promise<ClientItem> {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to save client');
    }

    const json = await res.json();
    return json.data;
  },

  async updateClient(id: string, clientData: Partial<ClientItem>): Promise<ClientItem> {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to update client');
    }

    const json = await res.json();
    return json.data;
  },

  async deleteClient(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  }
};
