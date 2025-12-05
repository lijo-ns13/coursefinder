import { DataFetcherService } from '../services/data-fetcher.service.js';
import { logger } from '../config/logger.js';

export class DataFetcherController {
  /**
   * Fetch and store courses from external APIs
   * POST /api/data/fetch
   */
  static async fetchCourses(req, res, next) {
    try {
      const { query, country, category, limit } = req.body;
      
      const courses = await DataFetcherService.fetchAndStoreCourses({
        query,
        country,
        category,
        limit: limit || 50
      });
      
      res.json({
        success: true,
        message: `Fetched and stored ${courses.length} courses`,
        count: courses.length,
        courses
      });
    } catch (error) {
      logger.error('Fetch courses error:', error);
      next(error);
    }
  }
  
  /**
   * Fetch popular courses by category
   * POST /api/data/fetch-popular
   */
  static async fetchPopularCourses(req, res, next) {
    try {
      const courses = await DataFetcherService.fetchPopularCourses();
      
      res.json({
        success: true,
        message: `Fetched ${courses.length} popular courses`,
        count: courses.length,
        courses
      });
    } catch (error) {
      logger.error('Fetch popular courses error:', error);
      next(error);
    }
  }
  
  /**
   * Fetch courses by country
   * POST /api/data/fetch-by-country
   */
  static async fetchCoursesByCountry(req, res, next) {
    try {
      const { country, limit } = req.body;
      
      if (!country) {
        return res.status(400).json({ message: 'Country is required' });
      }
      
      const courses = await DataFetcherService.fetchCoursesByCountry(country, limit);
      
      res.json({
        success: true,
        message: `Fetched ${courses.length} courses from ${country}`,
        count: courses.length,
        courses
      });
    } catch (error) {
      logger.error('Fetch courses by country error:', error);
      next(error);
    }
  }
  
  /**
   * Refresh existing courses with fresh data
   * POST /api/data/refresh
   */
  static async refreshCourses(req, res, next) {
    try {
      const { limit } = req.body;
      
      const updated = await DataFetcherService.refreshCourses(limit || 100);
      
      res.json({
        success: true,
        message: `Refreshed ${updated} courses`,
        updated
      });
    } catch (error) {
      logger.error('Refresh courses error:', error);
      next(error);
    }
  }
}

