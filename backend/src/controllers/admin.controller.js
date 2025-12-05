import { UserService } from '../services/user.service.js';
import { CourseService } from '../services/course.service.js';
import { ComparisonService } from '../services/comparison.service.js';
import { logger } from '../config/logger.js';

export class AdminController {
  static async getDashboard(req, res, next) {
    try {
      const userCount = await UserService.getUserCount();
      const courseCount = await CourseService.getCourseCount();
      
      // Get recent users
      const recentUsers = await UserService.getAllUsers(1, 5);
      
      // Get popular courses
      const popularCourses = await CourseService.getPopularCourses(5);

      res.json({
        success: true,
        dashboard: {
          stats: {
            totalUsers: userCount,
            totalCourses: courseCount
          },
          recentUsers,
          popularCourses
        }
      });
    } catch (error) {
      logger.error('Get dashboard error:', error);
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const users = await UserService.getAllUsers(page, limit);
      const totalUsers = await UserService.getUserCount();

      res.json({
        success: true,
        users,
        pagination: {
          page,
          limit,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit)
        }
      });
    } catch (error) {
      logger.error('Get all users error:', error);
      next(error);
    }
  }

  static async getAllCourses(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const courses = await CourseService.getAllCourses(page, limit);
      const totalCourses = await CourseService.getCourseCount();

      res.json({
        success: true,
        courses,
        pagination: {
          page,
          limit,
          total: totalCourses,
          pages: Math.ceil(totalCourses / limit)
        }
      });
    } catch (error) {
      logger.error('Get all courses error:', error);
      next(error);
    }
  }

  static async createCourse(req, res, next) {
    try {
      const courseData = req.body;
      const course = await CourseService.create(courseData);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course
      });
    } catch (error) {
      logger.error('Create course error:', error);
      next(error);
    }
  }

  static async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const course = await CourseService.updateById(id, updateData);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.json({
        success: true,
        message: 'Course updated successfully',
        course
      });
    } catch (error) {
      logger.error('Update course error:', error);
      next(error);
    }
  }

  static async getAllComparisons(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const comparisons = await ComparisonService.getAllComparisons(page, limit);

      res.json({
        success: true,
        comparisons
      });
    } catch (error) {
      logger.error('Get all comparisons error:', error);
      next(error);
    }
  }
}

