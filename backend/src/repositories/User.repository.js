import User from '../models/User.model.js';

export class UserRepository {
  async findByPhone(phone) {
    return await User.findOne({ phone });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async updateByPhone(phone, updateData) {
    return await User.findOneAndUpdate({ phone }, updateData, { new: true });
  }

  async findById(id) {
    return await User.findById(id).populate('savedCourses').populate('savedComparisons.course1 savedComparisons.course2');
  }

  async addSavedCourse(userId, courseId) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedCourses: courseId } },
      { new: true }
    );
  }

  async removeSavedCourse(userId, courseId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { savedCourses: courseId } },
      { new: true }
    );
  }

  async addSavedComparison(userId, comparisonData) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { savedComparisons: comparisonData } },
      { new: true }
    );
  }

  async addRecentView(userId, courseId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          recentViews: {
            $each: [{ course: courseId, viewedAt: new Date() }],
            $slice: -20 // Keep only last 20 views
          }
        }
      },
      { new: true }
    );
  }

  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await User.find()
      .select('-otp')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getUserCount() {
    return await User.countDocuments();
  }
}

