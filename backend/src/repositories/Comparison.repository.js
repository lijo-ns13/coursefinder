import Comparison from '../models/Comparison.model.js';

export class ComparisonRepository {
  async create(comparisonData) {
    return await Comparison.create(comparisonData);
  }

  async findById(id) {
    return await Comparison.findById(id)
      .populate('course1')
      .populate('course2')
      .populate('user');
  }

  async findByUser(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await Comparison.find({ user: userId })
      .populate('course1')
      .populate('course2')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getAllComparisons(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await Comparison.find()
      .populate('course1')
      .populate('course2')
      .populate('user')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
}

