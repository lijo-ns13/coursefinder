import { CourseService } from '../services/course.service.js';
import { logger } from '../config/logger.js';

export class CourseController {
  static async searchCourses(req, res, next) {
    try {
      const { query, country, category, minBudget, maxBudget, level, limit } = req.query;

      const filters = {
        country,
        category,
        minBudget: minBudget ? parseInt(minBudget) : undefined,
        maxBudget: maxBudget ? parseInt(maxBudget) : undefined,
        level,
        limit: limit ? parseInt(limit) : 50
      };

      const courses = await CourseService.search(query, filters);

      res.json({
        success: true,
        count: courses.length,
        courses
      });
    } catch (error) {
      logger.error('Search courses error:', error);
      next(error);
    }
  }

  static async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseService.findById(id);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Track view if user is authenticated
      if (req.user) {
        await CourseService.addRecentView(req.user.userId, id);
      }

      // Get similar courses
      const similarCourses = await CourseService.getSimilarCourses(id);

      res.json({
        success: true,
        course,
        similarCourses
      });
    } catch (error) {
      logger.error('Get course error:', error);
      next(error);
    }
  }

  static async getPopularCourses(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const courses = await CourseService.getPopularCourses(limit);

      // Return empty array if no courses found (not an error)
      res.json({
        success: true,
        count: courses.length,
        courses: courses || []
      });
    } catch (error) {
      logger.error('Get popular courses error:', error);
      // Return empty array on error instead of 500
      res.json({
        success: true,
        count: 0,
        courses: [],
        message: 'No courses available yet'
      });
    }
  }
}

