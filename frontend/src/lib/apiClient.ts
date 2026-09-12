import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/config/env';

/**
 * Centralized API Client
 * Consumes API base URL strictly from environment variables without hardcoded fallbacks.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token or trace ID here when authentication is implemented
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const errorData = error.response?.data as { message?: string } | undefined;
    const formattedError = {
      status: error.response?.status,
      message: errorData?.message || error.message || 'An unexpected API error occurred'
    };
    return Promise.reject(formattedError);
  }
);

export default apiClient;
