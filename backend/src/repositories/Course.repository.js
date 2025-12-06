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
    const andConditions = [];

    // Category filter - prioritize this, make it simple and reliable
    if (filters.category) {
      const categoryRegex = new RegExp(filters.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      // Primary: exact category match, Secondary: name/description contains
      andConditions.push({
        $or: [
          { category: categoryRegex },
          { name: categoryRegex },
          { description: categoryRegex }
        ]
      });
    }

    // Text search (only if no category filter or as additional filter)
    if (query && query.trim()) {
      const queryRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      if (!filters.category) {
        // If no category, use text search as primary
        searchQuery.$or = [
          { name: queryRegex },
          { description: queryRegex },
          { 'university.name': queryRegex },
          { category: queryRegex }
        ];
      } else {
        // If category exists, add text search to andConditions
        andConditions.push({
          $or: [
            { name: queryRegex },
            { description: queryRegex },
            { 'university.name': queryRegex }
          ]
        });
      }
    }

    // University name filter
    if (filters.universityName) {
      searchQuery['university.name'] = new RegExp(filters.universityName, 'i');
    }

    // Country filter
    if (filters.country) {
      searchQuery['university.location.country'] = new RegExp(filters.country, 'i');
    }

    // Budget filters
    if (filters.minBudget || filters.maxBudget) {
      searchQuery['fees.amount'] = {};
      if (filters.minBudget) searchQuery['fees.amount'].$gte = filters.minBudget;
      if (filters.maxBudget) searchQuery['fees.amount'].$lte = filters.maxBudget;
    }

    // Level filter
    if (filters.level) {
      searchQuery.level = filters.level;
    }

    // Combine all conditions
    let finalQuery = searchQuery;
    if (andConditions.length > 0) {
      if (Object.keys(searchQuery).length > 0) {
        finalQuery = {
          $and: [
            searchQuery,
            ...andConditions
          ]
        };
      } else {
        finalQuery = andConditions.length === 1 ? andConditions[0] : { $and: andConditions };
      }
    }

    // If no filters at all, return all courses
    const hasFilters = Object.keys(finalQuery).length > 0;
    
    const courses = await Course.find(hasFilters ? finalQuery : {})
      .limit(filters.limit || 100)
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

