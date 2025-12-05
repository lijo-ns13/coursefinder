import { ExternalAPIService } from './external-api.service.js';
import { CourseService } from './course.service.js';
import { logger } from '../config/logger.js';

export class DataFetcherService {
  /**
   * Fetch and store courses from external APIs
   * @param {Object} options - Search options
   * @param {string} options.query - Search query (course name or university)
   * @param {string} options.country - Country filter
   * @param {string} options.category - Course category (AI, CS, MBA, etc.)
   * @param {number} options.limit - Maximum number of courses to fetch
   */
  static async fetchAndStoreCourses(options = {}) {
    const { query = '', country = '', category = '', limit = 50 } = options;
    
    try {
      logger.info(`Fetching courses: query=${query}, country=${country}, category=${category}`);
      
      const courses = [];
      
      // Fetch from RapidAPI Universities API
      if (process.env.RAPIDAPI_KEY) {
        try {
          const rapidResults = await ExternalAPIService.searchUniversities(query || category, country);
          
          if (rapidResults && Array.isArray(rapidResults)) {
            for (const uni of rapidResults.slice(0, limit)) {
              const courseData = await this.transformRapidAPIData(uni, category);
              if (courseData) {
                courses.push(courseData);
              }
            }
          }
        } catch (error) {
          logger.error('Error fetching from RapidAPI:', error.message);
        }
      }
      
      // Fetch from OpenAlex API (free, no API key needed)
      if (courses.length < limit) {
        try {
          const openAlexResults = await ExternalAPIService.searchOpenAlex(query || category);
          
          for (const inst of openAlexResults.slice(0, limit - courses.length)) {
            const courseData = await this.transformOpenAlexData(inst, category);
            if (courseData) {
              courses.push(courseData);
            }
          }
        } catch (error) {
          logger.error('Error fetching from OpenAlex:', error.message);
        }
      }
      
      // Fetch from Google Places for additional details
      if (process.env.GOOGLE_PLACES_API_KEY && courses.length > 0) {
        await this.enrichWithGooglePlaces(courses);
      }
      
      // Store courses in database
      const storedCourses = [];
      for (const courseData of courses) {
        try {
          // Check if course already exists
          const existing = await CourseService.findByExternalId(
            courseData.source.externalId,
            courseData.source.api
          );
          
          if (existing) {
            // Update existing course
            const updated = await CourseService.updateById(existing._id, courseData);
            storedCourses.push(updated);
            logger.info(`Updated course: ${courseData.name}`);
          } else {
            // Create new course
            const created = await CourseService.create(courseData);
            storedCourses.push(created);
            logger.info(`Created course: ${courseData.name}`);
          }
        } catch (error) {
          logger.error(`Error storing course ${courseData.name}:`, error.message);
        }
      }
      
      logger.info(`Successfully fetched and stored ${storedCourses.length} courses`);
      return storedCourses;
    } catch (error) {
      logger.error('Error in fetchAndStoreCourses:', error);
      throw error;
    }
  }
  
  /**
   * Transform RapidAPI university data to course format
   */
  static transformRapidAPIData(uniData, category = '') {
    try {
      return {
        name: category ? `${category} Program` : 'General Program',
        university: {
          name: uniData.name || 'Unknown University',
          location: {
            city: uniData.city || '',
            country: uniData.country || '',
            coordinates: uniData.coordinates || {}
          },
          website: uniData.web_pages?.[0] || '',
          ranking: uniData.rank || null,
          acceptanceRate: null // Not available in RapidAPI
        },
        description: `Program at ${uniData.name}`,
        duration: '2-4 years',
        fees: {
          currency: this.getCurrencyForCountry(uniData.country),
          amount: this.estimateFees(uniData.country, category),
          per: 'year'
        },
        requirements: {
          educationLevel: 'degree',
          minMarks: 70,
          ieltsMin: 6.5,
          toeflMin: 80
        },
        category: category || 'General',
        level: 'graduate',
        intake: ['Fall', 'Spring'],
        source: {
          api: 'rapidapi',
          externalId: uniData.id || `${uniData.name}-${Date.now()}`
        },
        metadata: uniData
      };
    } catch (error) {
      logger.error('Error transforming RapidAPI data:', error);
      return null;
    }
  }
  
  /**
   * Transform OpenAlex institution data to course format
   */
  static transformOpenAlexData(instData, category = '') {
    try {
      return {
        name: category ? `${category} Program` : 'Research Program',
        university: {
          name: instData.display_name || 'Unknown University',
          location: {
            city: instData.city || '',
            country: instData.country_code || '',
            coordinates: {}
          },
          website: instData.homepage_url || '',
          ranking: null,
          acceptanceRate: null
        },
        description: `Program at ${instData.display_name}`,
        duration: '2-4 years',
        fees: {
          currency: this.getCurrencyForCountry(instData.country_code),
          amount: this.estimateFees(instData.country_code, category),
          per: 'year'
        },
        requirements: {
          educationLevel: 'degree',
          minMarks: 75,
          ieltsMin: 7.0,
          toeflMin: 90
        },
        category: category || 'Research',
        level: 'graduate',
        intake: ['Fall'],
        source: {
          api: 'openalex',
          externalId: instData.id || `${instData.display_name}-${Date.now()}`
        },
        metadata: instData
      };
    } catch (error) {
      logger.error('Error transforming OpenAlex data:', error);
      return null;
    }
  }
  
  /**
   * Enrich courses with Google Places data
   */
  static async enrichWithGooglePlaces(courses) {
    for (const course of courses) {
      try {
        if (!course.university?.name) continue;
        
        const places = await ExternalAPIService.searchPlaces(
          `${course.university.name} ${course.university.location.city}`
        );
        
        if (places && places.length > 0) {
          const place = places[0];
          
          // Update location coordinates
          if (place.geometry?.location) {
            course.university.location.coordinates = {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            };
          }
          
          // Get detailed place info
          if (place.place_id) {
            const details = await ExternalAPIService.getPlaceDetails(place.place_id);
            if (details) {
              course.university.website = details.website || course.university.website;
              course.university.rating = details.rating || null;
              if (details.photos && details.photos.length > 0) {
                course.images = details.photos.slice(0, 3).map(photo => 
                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
                );
              }
            }
          }
        }
      } catch (error) {
        logger.error(`Error enriching course ${course.name} with Google Places:`, error.message);
      }
    }
  }
  
  /**
   * Get currency code for country
   */
  static getCurrencyForCountry(countryCode) {
    const currencyMap = {
      'US': 'USD',
      'CA': 'CAD',
      'GB': 'GBP',
      'AU': 'AUD',
      'IN': 'INR',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'NL': 'EUR',
      'CH': 'CHF',
      'JP': 'JPY',
      'CN': 'CNY',
      'SG': 'SGD',
      'NZ': 'NZD'
    };
    
    return currencyMap[countryCode?.toUpperCase()] || 'USD';
  }
  
  /**
   * Estimate fees based on country and category
   */
  static estimateFees(countryCode, category) {
    const baseFees = {
      'US': { 'AI': 50000, 'CS': 45000, 'MBA': 70000, 'Nursing': 35000, 'default': 40000 },
      'CA': { 'AI': 35000, 'CS': 30000, 'MBA': 50000, 'Nursing': 25000, 'default': 30000 },
      'GB': { 'AI': 30000, 'CS': 28000, 'MBA': 45000, 'Nursing': 20000, 'default': 25000 },
      'AU': { 'AI': 40000, 'CS': 35000, 'MBA': 55000, 'Nursing': 30000, 'default': 35000 },
      'default': { 'AI': 30000, 'CS': 25000, 'MBA': 40000, 'Nursing': 20000, 'default': 25000 }
    };
    
    const country = countryCode?.toUpperCase() || 'default';
    const fees = baseFees[country] || baseFees['default'];
    return fees[category] || fees['default'];
  }
  
  /**
   * Fetch popular courses by category
   */
  static async fetchPopularCourses() {
    const categories = ['AI', 'CS', 'MBA', 'Engineering', 'Nursing'];
    const allCourses = [];
    
    for (const category of categories) {
      try {
        const courses = await this.fetchAndStoreCourses({
          category,
          limit: 10
        });
        allCourses.push(...courses);
      } catch (error) {
        logger.error(`Error fetching ${category} courses:`, error.message);
      }
    }
    
    return allCourses;
  }
  
  /**
   * Fetch courses by country
   */
  static async fetchCoursesByCountry(country, limit = 20) {
    return await this.fetchAndStoreCourses({
      country,
      limit
    });
  }
  
  /**
   * Update existing courses with fresh data
   */
  static async refreshCourses(limit = 100) {
    try {
      const courses = await CourseService.getAllCourses(1, limit);
      let updated = 0;
      
      for (const course of courses) {
        try {
          if (course.source?.api === 'rapidapi' && course.source?.externalId) {
            // Re-fetch from RapidAPI
            const freshData = await ExternalAPIService.searchUniversities(
              course.university?.name || '',
              course.university?.location?.country || ''
            );
            
            if (freshData && freshData.length > 0) {
              const updatedData = this.transformRapidAPIData(freshData[0], course.category);
              if (updatedData) {
                await CourseService.updateById(course._id, updatedData);
                updated++;
              }
            }
          }
        } catch (error) {
          logger.error(`Error refreshing course ${course._id}:`, error.message);
        }
      }
      
      logger.info(`Refreshed ${updated} courses`);
      return updated;
    } catch (error) {
      logger.error('Error refreshing courses:', error);
      throw error;
    }
  }
}

