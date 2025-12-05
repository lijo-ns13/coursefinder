import { CourseService } from '../services/course.service.js';
import { logger } from '../config/logger.js';

export class UniversityController {
  /**
   * Get all courses from a specific university
   * GET /api/universities/:universityName/courses
   */
  static async getUniversityCourses(req, res, next) {
    try {
      const { universityName } = req.params;
      const decodedName = decodeURIComponent(universityName);

      const courses = await CourseService.search('', {
        universityName: decodedName
      });

      if (courses.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No courses found for this university'
        });
      }

      // Get university info from first course
      const universityInfo = courses[0].university;

      res.json({
        success: true,
        university: universityInfo,
        count: courses.length,
        courses
      });
    } catch (error) {
      logger.error('Get university courses error:', error);
      next(error);
    }
  }

  /**
   * Get university details
   * GET /api/universities/:universityName
   */
  static async getUniversityDetails(req, res, next) {
    try {
      const { universityName } = req.params;
      const decodedName = decodeURIComponent(universityName);

      const courses = await CourseService.search('', {
        universityName: decodedName
      });

      if (courses.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'University not found'
        });
      }

      const universityInfo = courses[0].university;
      
      // Aggregate statistics
      const stats = {
        totalCourses: courses.length,
        categories: [...new Set(courses.map(c => c.category))],
        averageFees: courses.reduce((sum, c) => sum + (c.fees?.amount || 0), 0) / courses.length,
        averageAcceptanceRate: courses.reduce((sum, c) => sum + (c.university?.acceptanceRate || 0), 0) / courses.length,
        averageSalary: courses.reduce((sum, c) => sum + (c.jobOutcomes?.averageSalary || 0), 0) / courses.filter(c => c.jobOutcomes?.averageSalary).length
      };

      res.json({
        success: true,
        university: universityInfo,
        stats,
        courses
      });
    } catch (error) {
      logger.error('Get university details error:', error);
      next(error);
    }
  }
}

