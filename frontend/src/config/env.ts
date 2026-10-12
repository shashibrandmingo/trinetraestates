import { getApiBaseUrl, getSiteUrl } from './apiConfig';

/**
 * Environment Variable Accessor
 * Proxies to centralized apiConfig to ensure reliable resolution on both client and server.
 */
export const env = {
  get API_URL(): string {
    return getApiBaseUrl();
  },
  get SITE_URL(): string {
    return getSiteUrl();
  },
  get ADS_CLIENT_ID(): string {
    return process.env.NEXT_PUBLIC_ADS_CLIENT_ID || '';
  }
};
