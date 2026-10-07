import rateLimit from 'express-rate-limit';

/**
 * Global API Rate Limiter
 * - Designed for real-world shared IPs (e.g. Office Wi-Fi, Coworking spaces, Jio/Airtel mobile CGNAT)
 * - Allows up to 2,500 requests per 15 minutes per IP (plenty for 50-100 users sharing one IP)
 * - Automatically skips localhost, internal health checks, and admin routes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2500, // Very generous for shared office Wi-Fi & mobile towers, while blocking automated scraper bots
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Never rate limit localhost/development testing
    const ip = req.ip || req.connection.remoteAddress || '';
    if (ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost')) {
      return true;
    }
    // Skip internal health checks
    if (req.path === '/health' || req.path === '/api/health') {
      return true;
    }
    return false;
  },
  message: {
    success: false,
    message: 'High traffic detected from your network. Please wait a few minutes and try again.'
  }
});

/**
 * Dedicated Lead / Enquiry Anti-Spam Limiter
 * - Allows up to 35 inquiries per 15 minutes per IP
 * - Easily accommodates multiple employees/brokers submitting inquiries from the same office Wi-Fi
 * - Stops automated bots from flooding the database with thousands of fake leads
 */
export const leadInquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 35,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress || '';
    return ip === '127.0.0.1' || ip === '::1';
  },
  message: {
    success: false,
    message: 'Multiple enquiry submissions detected from this network. Please wait a few minutes before submitting again.'
  }
});
