import { CourseRepository } from '../repositories/Course.repository.js';
import { ExternalAPIService } from './external-api.service.js';
import { logger } from '../config/logger.js';

// Create repository instance
const courseRepository = new CourseRepository();

export class CourseService {
  static async search(query, filters) {
    return await courseRepository.search(query, filters);
  }

  static async findById(id) {
    return await courseRepository.findById(id);
  }

  static async create(courseData) {
    return await courseRepository.create(courseData);
  }

  static async getPopularCourses(limit) {
    return await courseRepository.getPopularCourses(limit);
  }

  static async getSimilarCourses(courseId) {
    return await courseRepository.getSimilarCourses(courseId);
  }

  static async fetchAndStoreCourse(universityName, courseName, country) {
    try {
      // Check if course already exists
      const existing = await courseRepository.findByExternalId(
        `${universityName}-${courseName}`,
        'manual'
      );

      if (existing) {
        return existing;
      }

      // Fetch from external APIs using DataFetcherService
      const { DataFetcherService } = await import('./data-fetcher.service.js');
      const courses = await DataFetcherService.fetchAndStoreCourses({
        query: `${universityName} ${courseName}`,
        country,
        limit: 1
      });

      if (courses.length === 0) {
        // Create a basic course entry if no external data found
        const courseData = {
          name: courseName,
          university: {
            name: universityName,
            location: {
              country: country || 'Unknown'
            }
          },
          source: {
            api: 'manual',
            externalId: `${universityName}-${courseName}`
          }
        };
        return await courseRepository.create(courseData);
      }

      return courses[0];
    } catch (error) {
      logger.error('Fetch and store course error:', error);
      throw error;
    }
  }

  static async addRecentView(userId, courseId) {
    const { UserService } = await import('./user.service.js');
    return await UserService.addRecentView(userId, courseId);
  }

  static async getAllCourses(page, limit) {
    return await courseRepository.getAllCourses(page, limit);
  }

  static async getCourseCount() {
    return await courseRepository.getCourseCount();
  }

  static async findByExternalId(externalId, api) {
    return await courseRepository.findByExternalId(externalId, api);
  }

  static async updateById(id, updateData) {
    return await courseRepository.updateById(id, updateData);
  }
}

