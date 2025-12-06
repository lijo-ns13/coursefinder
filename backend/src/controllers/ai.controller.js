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
        category, // Use category if provided
        passedStatus,
        preferences
      } = req.body;

      const userProfile = {
        country,
        educationLevel,
        marks: typeof marks === 'string' ? JSON.parse(marks) : marks,
        ieltsScore,
        budget,
        preferredCourse: preferredCourse || category, // Use category as fallback
        passedStatus,
        preferences: Array.isArray(preferences) ? preferences : []
      };

      // Determine search query and category filter
      // Priority: category > preferredCourse > query search
      const searchQuery = category || preferredCourse || '';
      const categoryFilter = category || preferredCourse || null;

      logger.info(`AI Filter - Search: "${searchQuery}", Category: "${categoryFilter}", Country: "${country}", Budget: ${budget}`);

      // First, check if database has any courses at all
      const totalCoursesInDB = await CourseService.getCourseCount();
      logger.info(`Total courses in database: ${totalCoursesInDB}`);

      // Search courses based on filters - use category for filtering
      let searchFilters = {
        country: country || undefined,
        category: categoryFilter || undefined, // Use category filter properly
        maxBudget: budget ? parseInt(budget) : undefined,
        level: educationLevel || undefined,
        limit: 100 // Increase limit to get more results
      };

      let courses = await CourseService.search(searchQuery, searchFilters);
      
      logger.info(`Found ${courses.length} courses matching filters`);

      // If no courses found with category filter, try without category (broader search)
      if (courses.length === 0 && categoryFilter) {
        logger.info(`No courses found with category filter, trying broader search...`);
        searchFilters = {
          country: country || undefined,
          maxBudget: budget ? parseInt(budget) : undefined,
          level: educationLevel || undefined,
          limit: 100
        };
        courses = await CourseService.search(searchQuery, searchFilters);
        logger.info(`Found ${courses.length} courses in broader search`);
      }

      // If still no courses and database is empty, try fetching from external APIs
      if (courses.length === 0 && totalCoursesInDB === 0) {
        logger.info(`Database is empty, attempting to fetch from external APIs...`);
        try {
          const { DataFetcherService } = await import('../services/data-fetcher.service.js');
          const fetchedCourses = await DataFetcherService.fetchAndStoreCourses({
            query: searchQuery || categoryFilter || 'Engineering',
            category: categoryFilter || 'Engineering',
            country: country || '',
            limit: 30
          });
          
          if (fetchedCourses.length > 0) {
            courses = fetchedCourses;
            logger.info(`Fetched ${courses.length} courses from external APIs`);
            // Retry search with newly fetched courses
            courses = await CourseService.search(searchQuery, searchFilters);
            logger.info(`After fetching, found ${courses.length} courses matching filters`);
          }
        } catch (fetchError) {
          logger.error('Error fetching courses from external APIs:', fetchError.message);
        }
      } else if (courses.length === 0 && totalCoursesInDB > 0) {
        // Database has courses but none match filters - try without category filter
        logger.info(`Database has ${totalCoursesInDB} courses but none match filters, trying without category...`);
        const relaxedFilters = {
          country: country || undefined,
          maxBudget: budget ? parseInt(budget) : undefined,
          level: educationLevel || undefined,
          limit: 50
        };
        courses = await CourseService.search('', relaxedFilters);
        logger.info(`Found ${courses.length} courses with relaxed filters`);
      }

      // Additional client-side filtering if needed
      let filteredCourses = courses;
      
      // Filter by category if provided (case-insensitive) - but only if we have courses
      if (categoryFilter && courses.length > 0) {
        filteredCourses = courses.filter(course => {
          const courseCategory = (course.category || '').toLowerCase();
          const courseName = (course.name || '').toLowerCase();
          const courseDesc = (course.description || '').toLowerCase();
          const filterCategory = categoryFilter.toLowerCase();
          
          return courseCategory.includes(filterCategory) || 
                 courseName.includes(filterCategory) ||
                 courseDesc.includes(filterCategory);
        });
        logger.info(`After category filter: ${filteredCourses.length} courses`);
        
        // If category filter removed all courses, use original courses (show all)
        if (filteredCourses.length === 0 && courses.length > 0) {
          logger.info(`Category filter too strict, using all ${courses.length} courses`);
          filteredCourses = courses;
        }
      }

      if (filteredCourses.length === 0) {
        let message = 'No courses found matching your criteria.';
        if (totalCoursesInDB === 0) {
          message += ' Database appears to be empty. Please seed the database by running: npm run seed-accurate (or npm run seed)';
        } else {
          message += ' Try adjusting your filters or search terms.';
        }
        
        return res.json({
          success: true,
          recommendations: [],
          message,
          debug: {
            searchQuery,
            categoryFilter,
            country,
            totalCoursesInDB,
            totalCoursesFound: courses.length,
            filteredCourses: filteredCourses.length
          }
        });
      }

      // Get AI recommendations (use filtered courses)
      const aiRecommendations = await AIService.filterCourses(userProfile, filteredCourses);

      // Merge AI recommendations with course data
      const recommendations = aiRecommendations.recommendations.map(rec => {
        const course = filteredCourses.find(c => c._id.toString() === rec.courseId);
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
        totalCourses: filteredCourses.length,
        totalSearched: courses.length
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

