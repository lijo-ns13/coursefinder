import { UserRepository } from '../repositories/User.repository.js';

// Create repository instance
const userRepository = new UserRepository();

export class UserService {
  static async findByPhone(phone) {
    return await userRepository.findByPhone(phone);
  }

  static async create(userData) {
    return await userRepository.create(userData);
  }

  static async updateById(id, updateData) {
    return await userRepository.updateById(id, updateData);
  }

  static async updateByPhone(phone, updateData) {
    return await userRepository.updateByPhone(phone, updateData);
  }

  static async findById(id) {
    return await userRepository.findById(id);
  }

  static async addSavedCourse(userId, courseId) {
    return await userRepository.addSavedCourse(userId, courseId);
  }

  static async removeSavedCourse(userId, courseId) {
    return await userRepository.removeSavedCourse(userId, courseId);
  }

  static async addSavedComparison(userId, comparisonData) {
    return await userRepository.addSavedComparison(userId, comparisonData);
  }

  static async addRecentView(userId, courseId) {
    return await userRepository.addRecentView(userId, courseId);
  }

  static async getAllUsers(page, limit) {
    return await userRepository.getAllUsers(page, limit);
  }

  static async getUserCount() {
    return await userRepository.getUserCount();
  }
}

