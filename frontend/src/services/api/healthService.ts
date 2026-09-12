import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from './endpoints';

export interface HealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
  uptime: number;
}

export const healthService = {
  checkHealth: async (): Promise<HealthResponse> => {
    return apiClient.get<unknown, HealthResponse>(ENDPOINTS.HEALTH);
  }
};
