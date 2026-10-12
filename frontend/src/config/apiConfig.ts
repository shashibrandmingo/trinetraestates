/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GLOBAL API & DOMAIN CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralizes all backend endpoints and public site URLs using environment
 * variables (NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SITE_URL).
 * 
 * Ensures seamless deployment across Vercel, VPS, Docker, or AWS without
 * any manual URL editing.
 */

export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    // In browser, if env is absent, default to same hostname with port 5000
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const getBackendHost = (): string => {
  const apiBase = getApiBaseUrl();
  return apiBase.replace(/\/api$/, '');
};

export const getSiteUrl = (): string => {
  const envSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (envSite && envSite.trim()) {
    return envSite.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://officespaceinnoida.com';
};
