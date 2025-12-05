import { UserService } from '../services/user.service.js';
import { CourseService } from '../services/course.service.js';
import { ComparisonService } from '../services/comparison.service.js';
import { logger } from '../config/logger.js';

export class UserController {
  static async getProfile(req, res, next) {
    try {
      const user = await UserService.findById(req.user.userId);
      
      res.json({
        success: true,
        user: {
          id: user._id,
          phone: user.phone,
          profile: user.profile,
          savedCourses: user.savedCourses,
          savedComparisons: user.savedComparisons,
          recentViews: user.recentViews
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { profile } = req.body;
      const user = await UserService.updateById(req.user.userId, { profile });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          profile: user.profile
        }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      next(error);
    }
  }

  static async saveCourse(req, res, next) {
    try {
      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
      }

      await UserService.addSavedCourse(req.user.userId, courseId);

      res.json({
        success: true,
        message: 'Course saved successfully'
      });
    } catch (error) {
      logger.error('Save course error:', error);
      next(error);
    }
  }

  static async unsaveCourse(req, res, next) {
    try {
      const { courseId } = req.params;

      await UserService.removeSavedCourse(req.user.userId, courseId);

      res.json({
        success: true,
        message: 'Course unsaved successfully'
      });
    } catch (error) {
      logger.error('Unsave course error:', error);
      next(error);
    }
  }

  static async getSavedCourses(req, res, next) {
    try {
      const user = await UserService.findById(req.user.userId);
      
      res.json({
        success: true,
        courses: user.savedCourses || []
      });
    } catch (error) {
      logger.error('Get saved courses error:', error);
      next(error);
    }
  }

  static async getSavedComparisons(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const comparisons = await ComparisonService.findByUser(req.user.userId, page, limit);

      res.json({
        success: true,
        comparisons
      });
    } catch (error) {
      logger.error('Get saved comparisons error:', error);
      next(error);
    }
  }

  static async getRecentViews(req, res, next) {
    try {
      const user = await UserService.findById(req.user.userId);
      
      res.json({
        success: true,
        recentViews: user.recentViews || []
      });
    } catch (error) {
      logger.error('Get recent views error:', error);
      next(error);
    }
  }
}

