import { AIService } from '../services/ai.service.js';
import { CourseService } from '../services/course.service.js';
import { ComparisonService } from '../services/comparison.service.js';
import { logger } from '../config/logger.js';

export class AIController {
  static async filterCourses(req, res, next) {
    try {
      const {
        country,
        educationLevel,
        marks,
        ieltsScore,
        budget,
        preferredCourse,
        passedStatus,
        preferences
      } = req.body;

      const userProfile = {
        country,
        educationLevel,
        marks: typeof marks === 'string' ? JSON.parse(marks) : marks,
        ieltsScore,
        budget,
        preferredCourse,
        passedStatus,
        preferences: Array.isArray(preferences) ? preferences : []
      };

      // Search courses based on filters
      const courses = await CourseService.search(preferredCourse, {
        country,
        category: preferredCourse,
        maxBudget: budget
      });

      if (courses.length === 0) {
        return res.json({
          success: true,
          recommendations: [],
          message: 'No courses found matching your criteria'
        });
      }

      // Get AI recommendations
      const aiRecommendations = await AIService.filterCourses(userProfile, courses);

      // Merge AI recommendations with course data
      const recommendations = aiRecommendations.recommendations.map(rec => {
        const course = courses.find(c => c._id.toString() === rec.courseId);
        if (!course) return null;

        return {
          course,
          acceptanceProbability: rec.acceptanceProbability,
          fitScore: rec.fitScore,
          justification: rec.justification,
          strengths: rec.strengths
        };
      }).filter(Boolean);

      res.json({
        success: true,
        recommendations,
        totalCourses: courses.length
      });
    } catch (error) {
      logger.error('AI filter error:', error);
      next(error);
    }
  }

  static async compareCourses(req, res, next) {
    try {
      const { courseId1, courseId2 } = req.body;

      if (!courseId1 || !courseId2) {
        return res.status(400).json({ message: 'Both course IDs are required' });
      }

      const course1 = await CourseService.findById(courseId1);
      const course2 = await CourseService.findById(courseId2);

      if (!course1 || !course2) {
        return res.status(404).json({ message: 'One or both courses not found' });
      }

      const userProfile = req.user ? await import('../services/user.service.js').then(m => m.UserService.findById(req.user.userId)) : null;

      // Get AI comparison
      let aiAnalysis;
      try {
        aiAnalysis = await AIService.compareCourses(
          course1.toObject(),
          course2.toObject(),
          userProfile?.profile || {}
        );
      } catch (error) {
        logger.error('AI comparison failed, using fallback:', error.message);
        // Use fallback comparison
        aiAnalysis = {
          comparison: {
            fees: `Course 1: ${course1.fees?.currency} ${course1.fees?.amount || 'N/A'}. Course 2: ${course2.fees?.currency} ${course2.fees?.amount || 'N/A'}`,
            ranking: `Course 1: Rank #${course1.university?.ranking || 'N/A'}. Course 2: Rank #${course2.university?.ranking || 'N/A'}`,
            acceptanceRate: `Course 1: ${course1.university?.acceptanceRate || 'N/A'}%. Course 2: ${course2.university?.acceptanceRate || 'N/A'}%`,
            courseContent: 'Both courses offer comprehensive curriculum.',
            jobOutcomes: `Course 1: ${course1.jobOutcomes?.averageSalary || 'N/A'} avg salary. Course 2: ${course2.jobOutcomes?.averageSalary || 'N/A'} avg salary`,
            companyTieUps: 'Both universities have strong industry connections.',
            campusLife: `Course 1: ${course1.university?.location?.country}. Course 2: ${course2.university?.location?.country}`,
            roiScore: 'Both offer good return on investment.',
            visaSuccessRate: 'Both have good visa success rates.'
          },
          verdict: course1.university?.ranking < course2.university?.ranking 
            ? `${course1.university?.name} is ranked higher.`
            : `${course2.university?.name} is ranked higher.`,
          recommendation: 'Consider your preferences for location, budget, and career goals.'
        };
      }

      // Save comparison if user is authenticated
      let comparison = null;
      if (req.user) {
        comparison = await ComparisonService.create({
          user: req.user.userId,
          course1: courseId1,
          course2: courseId2,
          aiAnalysis
        });
      }

      res.json({
        success: true,
        comparison: {
          course1,
          course2,
          aiAnalysis
        },
        saved: !!comparison
      });
    } catch (error) {
      logger.error('AI compare error:', error);
      next(error);
    }
  }

  static async getRecommendations(req, res, next) {
    try {
      const userProfile = req.body;

      // Search courses
      const courses = await CourseService.search(userProfile.preferredCourse, {
        country: userProfile.country,
        category: userProfile.preferredCourse,
        maxBudget: userProfile.budget
      });

      const recommendations = await AIService.generateRecommendations(userProfile, courses);

      res.json({
        success: true,
        recommendations
      });
    } catch (error) {
      logger.error('Get recommendations error:', error);
      next(error);
    }
  }
}

