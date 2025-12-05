import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import { DataFetcherService } from '../services/data-fetcher.service.js';
import { logger } from '../config/logger.js';

dotenv.config();

async function fetchLiveData() {
  try {
    await connectDB();
    logger.info('Connected to MongoDB');

    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'popular':
        logger.info('Fetching popular courses...');
        const popularCourses = await DataFetcherService.fetchPopularCourses();
        logger.info(`Fetched ${popularCourses.length} popular courses`);
        break;

      case 'country':
        const country = args[1];
        if (!country) {
          logger.error('Please provide a country code (e.g., US, CA, GB)');
          process.exit(1);
        }
        logger.info(`Fetching courses from ${country}...`);
        const countryCourses = await DataFetcherService.fetchCoursesByCountry(country);
        logger.info(`Fetched ${countryCourses.length} courses from ${country}`);
        break;

      case 'refresh':
        const limit = parseInt(args[1]) || 100;
        logger.info(`Refreshing up to ${limit} existing courses...`);
        const updated = await DataFetcherService.refreshCourses(limit);
        logger.info(`Refreshed ${updated} courses`);
        break;

      case 'search':
        const query = args[1] || '';
        const category = args[2] || '';
        const country = args[3] || '';
        logger.info(`Searching courses: query=${query}, category=${category}, country=${country}`);
        const searchCourses = await DataFetcherService.fetchAndStoreCourses({
          query,
          category,
          country,
          limit: 50
        });
        logger.info(`Fetched ${searchCourses.length} courses`);
        break;

      default:
        logger.info(`
Usage: node fetch-live-data.js <command> [options]

Commands:
  popular                    Fetch popular courses by category
  country <code>             Fetch courses from a specific country (e.g., US, CA, GB)
  refresh [limit]            Refresh existing courses (default: 100)
  search [query] [category] [country]  Search and fetch courses

Examples:
  node fetch-live-data.js popular
  node fetch-live-data.js country US
  node fetch-live-data.js refresh 50
  node fetch-live-data.js search "Computer Science" CS CA
        `);
        process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    logger.error('Error fetching live data:', error);
    process.exit(1);
  }
}

fetchLiveData();

