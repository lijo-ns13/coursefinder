import axios from 'axios';
import { logger } from '../config/logger.js';

export class ExternalAPIService {
  // RapidAPI Universities API
  static async searchUniversities(query, country) {
    try {
      const options = {
        method: 'GET',
        url: 'https://universities-and-colleges.p.rapidapi.com/search',
        params: {
          q: query,
          country: country || ''
        },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'universities-and-colleges.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      logger.error('RapidAPI error:', error);
      return [];
    }
  }

  // OpenAlex API for academic institutions
  static async searchOpenAlex(query) {
    try {
      const response = await axios.get('https://api.openalex.org/institutions', {
        params: {
          search: query,
          per_page: 20
        }
      });
      return response.data.results || [];
    } catch (error) {
      logger.error('OpenAlex API error:', error);
      return [];
    }
  }

  // Google Places API for university details
  static async getPlaceDetails(placeId) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,geometry,photos,website,rating,reviews',
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      });
      return response.data.result;
    } catch (error) {
      logger.error('Google Places API error:', error);
      return null;
    }
  }

  static async searchPlaces(query, type = 'university') {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: query,
          type: type,
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      });
      return response.data.results || [];
    } catch (error) {
      logger.error('Google Places search error:', error);
      return [];
    }
  }

  // Fetch course data from multiple sources
  static async fetchCourseData(universityName, courseName, country) {
    const courses = [];

    try {
      // Try RapidAPI first
      const rapidResults = await this.searchUniversities(`${universityName} ${courseName}`, country);
      if (rapidResults && rapidResults.length > 0) {
        rapidResults.forEach(uni => {
          courses.push({
            name: courseName,
            university: {
              name: uni.name || universityName,
              location: {
                city: uni.city || '',
                country: uni.country || country
              },
              website: uni.web_pages?.[0] || ''
            },
            source: {
              api: 'rapidapi',
              externalId: uni.id || ''
            },
            metadata: uni
          });
        });
      }
    } catch (error) {
      logger.error('Error fetching from RapidAPI:', error);
    }

    // If no results, try OpenAlex
    if (courses.length === 0) {
      try {
        const openAlexResults = await this.searchOpenAlex(universityName);
        openAlexResults.forEach(inst => {
          courses.push({
            name: courseName,
            university: {
              name: inst.display_name,
              location: {
                city: inst.city || '',
                country: inst.country_code || country
              },
              website: inst.homepage_url || ''
            },
            source: {
              api: 'openalex',
              externalId: inst.id || ''
            },
            metadata: inst
          });
        });
      } catch (error) {
        logger.error('Error fetching from OpenAlex:', error);
      }
    }

    return courses;
  }
}

