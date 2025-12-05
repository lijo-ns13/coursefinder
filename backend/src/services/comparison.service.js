import { ComparisonRepository } from '../repositories/Comparison.repository.js';
import { UserService } from './user.service.js';

// Create repository instance
const comparisonRepository = new ComparisonRepository();

export class ComparisonService {
  static async create(comparisonData) {
    const comparison = await comparisonRepository.create(comparisonData);
    
    // Add to user's saved comparisons
    if (comparisonData.user) {
      await UserService.addSavedComparison(comparisonData.user, {
        course1: comparisonData.course1,
        course2: comparisonData.course2,
        createdAt: new Date()
      });
    }

    return comparison;
  }

  static async findById(id) {
    return await comparisonRepository.findById(id);
  }

  static async findByUser(userId, page, limit) {
    return await comparisonRepository.findByUser(userId, page, limit);
  }

  static async getAllComparisons(page, limit) {
    return await comparisonRepository.getAllComparisons(page, limit);
  }
}

