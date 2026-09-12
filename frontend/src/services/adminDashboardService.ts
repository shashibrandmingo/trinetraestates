import { DashboardData } from '@/types/adminDashboard';
import { initialDashboardData } from '@/data/mockDashboardData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const adminDashboardService = {
  /**
   * Fetch real dashboard overview from high-speed aggregated backend API
   * GET /api/dashboard/overview
   */
  getDashboardOverview: async (): Promise<DashboardData> => {
    try {
      if (API_BASE) {
        // Try high-speed aggregated dashboard API first
        try {
          const overviewRes = await fetch(`${API_BASE}/dashboard/overview`, { cache: 'no-store' });
          if (overviewRes.ok) {
            const overviewJson = await overviewRes.json();
            if (overviewJson.success && overviewJson.data) {
              const d = overviewJson.data;
              const summary = d.summary || {};
              const total = summary.totalProperties || 0;
              const active = summary.activeProperties || 0;
              const revenue = summary.monthlyRevenue || 0;
              const revFormatted = summary.monthlyRevenueFormatted || '₹50,000';

              return {
                summary: {
                  totalProperties: total,
                  activeProperties: active,
                  expiringSoonProperties: summary.expiringSoonProperties || 0,
                  expiredProperties: summary.expiredProperties || 0,
                  totalLeads: summary.totalLeads || 0,
                  newLeadsToday: summary.newLeadsToday || 0,
                  monthlyRevenue: revenue,
                  monthlyRevenueFormatted: revFormatted
                },
                recentLeads: d.recentLeads || [],
                expiringProperties: d.expiringProperties || [],
                recentProperties: d.recentProperties || [],
                quickInsights: {
                  revenueThisMonth: revFormatted,
                  avgDealSize: revenue > 0 && active > 0 ? `₹${Math.round(revenue / Math.max(1, active)).toLocaleString('en-IN')}` : '₹0',
                  activeBrokers: 1,
                  conversionRate: total > 0 ? `${Math.round((active / total) * 100)}%` : '0%'
                },
                recentActivities: d.recentActivities || []
              };
            }
          }
        } catch (apiErr) {
          console.warn('Aggregated overview endpoint unreachable, trying fallback...', apiErr);
        }

        // Fallback to individual endpoints if needed
        const [statsRes, officesRes] = await Promise.all([
          fetch(`${API_BASE}/offices/stats`, { cache: 'no-store' }),
          fetch(`${API_BASE}/offices?limit=5`, { cache: 'no-store' })
        ]);

        const statsJson = statsRes.ok ? await statsRes.json() : null;
        const officesJson = officesRes.ok ? await officesRes.json() : null;

        const total = statsJson?.data?.total || 0;
        const active = statsJson?.data?.active || 0;
        const expiring = statsJson?.data?.expiring || 0;
        const expired = statsJson?.data?.expired || 0;
        const totalRevenue = Number(statsJson?.data?.totalRevenue) || 0;
        const soldByMeCount = Number(statsJson?.data?.soldByMe) || 0;

        const formattedRevenue =
          totalRevenue >= 10000000
            ? `₹${(totalRevenue / 10000000).toFixed(2)} Cr`
            : totalRevenue >= 100000
            ? `₹${(totalRevenue / 100000).toFixed(2)} L`
            : `₹${totalRevenue.toLocaleString('en-IN')}`;

        interface RawOfficeDoc {
          _id?: string;
          propertyId?: string;
          title?: string;
          location?: {
            city?: string;
            sector?: string;
          };
          areaSqFt?: number;
          builtUpAreaSqFt?: number;
          rentPerSqFt?: number;
          status?: string;
        }

        const liveProperties = (officesJson?.data || []).map((o: RawOfficeDoc) => ({
          id: o._id || o.propertyId || String(Math.random()),
          towerName: o.title || 'Untitled Property',
          city: o.location?.city || 'Noida',
          sector: o.location?.sector || 'Noida',
          areaSqFt: o.areaSqFt || o.builtUpAreaSqFt || 0,
          rentPerSqFt: o.rentPerSqFt || 0,
          status: o.status || 'Active'
        }));

        return {
          summary: {
            totalProperties: total,
            activeProperties: active,
            expiringSoonProperties: expiring,
            expiredProperties: expired,
            totalLeads: 0,
            newLeadsToday: 0,
            monthlyRevenue: totalRevenue,
            monthlyRevenueFormatted: formattedRevenue
          },
          recentLeads: [],
          expiringProperties: [],
          recentProperties: liveProperties,
          quickInsights: {
            revenueThisMonth: formattedRevenue,
            avgDealSize: totalRevenue > 0 && soldByMeCount > 0 ? `₹${Math.round(totalRevenue / soldByMeCount).toLocaleString('en-IN')}` : '₹0',
            activeBrokers: 1,
            conversionRate: total > 0 ? `${Math.round((soldByMeCount / total) * 100)}%` : '0%'
          },
          recentActivities: []
        };
      }
    } catch (err) {
      console.warn('Could not fetch real admin dashboard data:', err);
    }

    return initialDashboardData;
  },

  invalidateCache: () => {
    // Cache invalidation hook
  }
};

