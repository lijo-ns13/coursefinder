import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // Don't log 404 errors as errors
  if (err.statusCode === 404) {
    logger.info(`404 Not Found: ${req.method} ${req.path}`);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Don't expose stack trace in production
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      path: req.path,
      method: req.method
    })
  });
};

