import mongoose from 'mongoose';
import { logger } from './logger.js';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.warn('MONGODB_URI not set, using default local connection');
      process.env.MONGODB_URI = 'mongodb://localhost:27017/coursefinder';
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection error:', error.message);
    logger.warn('Server will continue but database operations will fail');
    // Don't exit in development - allow server to start
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

