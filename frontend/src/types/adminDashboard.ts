export interface DashboardKPISummary {
  totalProperties: number;
  activeProperties: number;
  expiringSoonProperties: number;
  expiredProperties: number;
  totalLeads: number;
  newLeadsToday: number;
  monthlyRevenue: number;
  monthlyRevenueFormatted: string;
}

export type LeadStatus = 'Hot' | 'Warm' | 'Cold';

export interface LeadItem {
  id: string;
  companyName: string;
  contactPerson: string;
  status: LeadStatus;
  requirementSqFt: number;
  preferredSector: string;
  createdAt: string;
}

export interface ExpiringPropertyItem {
  id: string;
  propertyId?: string;
  towerName: string;
  sector: string;
  daysRemaining: number;
  tenantName: string;
  areaSqFt: number;
}

export interface RecentPropertyItem {
  id: string;
  propertyId?: string;
  towerName: string;
  city: string;
  sector: string;
  areaSqFt: number;
  rentPerSqFt: number;
  status: 'Active' | 'Under Offer' | 'Available';
}

export type ActivityType = 'PROPERTY_ADDED' | 'NEW_LEAD' | 'PROPERTY_SOLD' | 'PROPERTY_RENEWED';

export interface RecentActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardData {
  summary: DashboardKPISummary;
  recentLeads: LeadItem[];
  expiringProperties: ExpiringPropertyItem[];
  recentProperties: RecentPropertyItem[];
  recentActivities: RecentActivityItem[];
}
