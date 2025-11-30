import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per 15 minutes (disabled in development)
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.',
  },
  skip: () => process.env.NODE_ENV === 'development', // Skip in development
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Authentication rate limiter
 * 5 requests per 15 minutes (disabled in development)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 5, // High limit in dev
  message: {
    error: 'Too Many Requests',
    message: 'Çok fazla deneme yaptınız, lütfen daha sonra tekrar deneyin.',
  },
  skip: () => process.env.NODE_ENV === 'development', // Skip in development
});

/**
 * Upload endpoint rate limiter
 * 20 requests per 15 minutes
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: 'Too Many Requests',
    message: 'Too many upload requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
