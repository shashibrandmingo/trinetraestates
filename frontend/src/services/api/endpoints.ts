/**
 * Centralized API Endpoints Directory
 * Keep all endpoint paths unified here.
 */
export const ENDPOINTS = {
  HEALTH: '/health',
  OFFICES: {
    LIST: '/offices',
    DETAIL: (id: string) => `/offices/${id}`
  },
  MEDIA: {
    UPLOAD: '/media/upload',
    DELETE: '/media/delete'
  }
} as const;

export default ENDPOINTS;
