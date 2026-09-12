/**
 * Strict Environment Variable Validation
 * Enforces pure configuration from .env without hidden hardcoded localhost fallbacks.
 */

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[CONFIG ERROR] Missing required environment variable: "${key}". Check your frontend .env file.`
    );
  }
  return value;
};

export const env = {
  get API_URL(): string {
    return getRequiredEnv('NEXT_PUBLIC_API_URL');
  },
  get SITE_URL(): string {
    return getRequiredEnv('NEXT_PUBLIC_SITE_URL');
  },
  get ADS_CLIENT_ID(): string {
    return getRequiredEnv('NEXT_PUBLIC_ADS_CLIENT_ID');
  }
};
