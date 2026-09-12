import { PropertyItem, PropertyKPIStats } from '@/types/propertyFilter';

/**
 * Clean initial property list - empty by default (no dummy data)
 * Real properties are loaded from MongoDB /api/offices
 */
export const initialPropertyList: PropertyItem[] = [];

export const defaultKPIStats: PropertyKPIStats = {
  total: 0,
  active: 0,
  expiring: 0,
  expired: 0,
  sold: 0,
  soldByMe: 0
};

