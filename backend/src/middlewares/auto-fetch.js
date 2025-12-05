import { DataFetcherService } from '../services/data-fetcher.service.js';
import { CourseService } from '../services/course.service.js';
import { logger } from '../config/logger.js';

/**
 * Middleware to automatically fetch courses if database is empty
 */
export const autoFetchIfEmpty = async (req, res, next) => {
  try {
    const courseCount = await CourseService.getCourseCount();
    
    if (courseCount === 0) {
      logger.info('Database is empty, fetching initial courses...');
      
      // Fetch popular courses in the background
      DataFetcherService.fetchPopularCourses()
        .then(() => {
          logger.info('Initial courses fetched successfully');
        })
        .catch((error) => {
          logger.error('Error auto-fetching courses:', error);
        });
    }
  } catch (error) {
    logger.error('Error checking course count:', error);
  }
  
  next();
};

