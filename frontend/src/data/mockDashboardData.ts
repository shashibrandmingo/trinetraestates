import { DashboardData } from '@/types/adminDashboard';

/**
 * Clean initial dashboard data - no dummy leads, test activities, or fake metrics
 * Real numbers are loaded dynamically from /api/offices/stats and MongoDB
 */
export const initialDashboardData: DashboardData = {
  summary: {
    totalProperties: 0,
    activeProperties: 0,
    expiringSoonProperties: 0,
    expiredProperties: 0,
    totalLeads: 0,
    newLeadsToday: 0,
    monthlyRevenue: 0,
    monthlyRevenueFormatted: '₹0'
  },
  recentLeads: [],
  expiringProperties: [],
  recentProperties: [],
  quickInsights: {
    revenueThisMonth: '₹0',
    avgDealSize: '₹0',
    activeBrokers: 0,
    conversionRate: '0%'
  },
  recentActivities: []
};
