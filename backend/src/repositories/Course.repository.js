import Course from '../models/Course.model.js';

export class CourseRepository {
  async create(courseData) {
    return await Course.create(courseData);
  }

  async findById(id) {
    return await Course.findById(id);
  }

  async search(query, filters = {}) {
    const searchQuery = {};

    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (filters.universityName) {
      searchQuery['university.name'] = new RegExp(filters.universityName, 'i');
    }

    if (filters.country) {
      searchQuery['university.location.country'] = new RegExp(filters.country, 'i');
    }

    if (filters.category) {
      searchQuery.category = filters.category;
    }

    if (filters.minBudget || filters.maxBudget) {
      searchQuery['fees.amount'] = {};
      if (filters.minBudget) searchQuery['fees.amount'].$gte = filters.minBudget;
      if (filters.maxBudget) searchQuery['fees.amount'].$lte = filters.maxBudget;
    }

    if (filters.level) {
      searchQuery.level = filters.level;
    }

    const courses = await Course.find(searchQuery)
      .limit(filters.limit || 50)
      .sort(filters.sort || { createdAt: -1 });

    return courses;
  }

  async findByExternalId(externalId, api) {
    if (!externalId || !api) return null;
    return await Course.findOne({
      'source.externalId': externalId,
      'source.api': api
    });
  }

  async updateById(id, updateData) {
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getPopularCourses(limit = 10) {
    try {
      // Try to sort by aiFitScore first, fallback to other fields if null
      const courses = await Course.find()
        .sort({ 
          aiFitScore: -1, 
          'university.ranking': 1,
          createdAt: -1 
        })
        .limit(limit);
      return courses;
    } catch (error) {
      // If sorting fails, return courses without sorting
      return await Course.find().limit(limit);
    }
  }

  async getSimilarCourses(courseId, limit = 5) {
    const course = await Course.findById(courseId);
    if (!course) return [];

    return await Course.find({
      _id: { $ne: courseId },
      $or: [
        { category: course.category },
        { 'university.location.country': course.university.location.country },
        { level: course.level }
      ]
    })
      .limit(limit);
  }

  async getAllCourses(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await Course.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getCourseCount() {
    return await Course.countDocuments();
  }
}

