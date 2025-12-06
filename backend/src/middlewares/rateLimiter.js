import rateLimit from 'express-rate-limit';

// Disable rate limiting in development
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

if (isDevelopment) {
  console.log('⚠️  Rate limiting DISABLED in development mode');
}

// Dummy middleware that does nothing in development
const noLimit = (req, res, next) => next();

export const rateLimiter = isDevelopment 
  ? noLimit
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });

export const authRateLimiter = isDevelopment
  ? noLimit
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5, // limit auth endpoints to 5 requests per windowMs
      message: 'Too many authentication attempts, please try again later.',
    });

