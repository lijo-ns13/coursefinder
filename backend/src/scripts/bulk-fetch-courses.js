import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import { DataFetcherService } from '../services/data-fetcher.service.js';
import { logger } from '../config/logger.js';

dotenv.config();

async function bulkFetchCourses() {
  try {
    await connectDB();
    logger.info('Connected to MongoDB');

    const targetCount = 1000;
    const categories = ['AI', 'CS', 'MBA', 'Engineering', 'Nursing', 'Medicine', 'Business', 'Law', 'Arts', 'Science'];
    const countries = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IN', 'SG', 'NZ', 'NL', 'IT', 'ES', 'CH', 'JP', 'CN'];
    
    let totalFetched = 0;
    const batchSize = 100; // Fetch 100 per category/country combination

    logger.info(`Starting bulk fetch to reach ${targetCount} courses...`);
    logger.info(`This may take several minutes depending on API rate limits...`);

    // First, try fetching by category and country
    for (const category of categories) {
      if (totalFetched >= targetCount) break;

      for (const country of countries) {
        if (totalFetched >= targetCount) break;

        try {
          logger.info(`[${totalFetched}/${targetCount}] Fetching ${category} courses from ${country}...`);
          const courses = await DataFetcherService.fetchAndStoreCourses({
            category,
            country,
            limit: batchSize
          });

          totalFetched += courses.length;
          logger.info(`✅ Fetched ${courses.length} courses. Total: ${totalFetched}/${targetCount}`);

          // Delay to avoid rate limits (2 seconds between requests)
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          logger.error(`❌ Error fetching ${category} from ${country}:`, error.message);
          // Continue with next combination
        }
      }
    }

    // If we haven't reached target, try fetching without country filter
    if (totalFetched < targetCount) {
      logger.info(`Fetching additional courses without country filter...`);
      for (const category of categories) {
        if (totalFetched >= targetCount) break;
        
        try {
          logger.info(`[${totalFetched}/${targetCount}] Fetching ${category} courses (all countries)...`);
          const courses = await DataFetcherService.fetchAndStoreCourses({
            category,
            limit: batchSize
          });
          
          totalFetched += courses.length;
          logger.info(`✅ Fetched ${courses.length} courses. Total: ${totalFetched}/${targetCount}`);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          logger.error(`❌ Error fetching ${category}:`, error.message);
        }
      }
    }

    // Final attempt: fetch popular courses
    if (totalFetched < targetCount) {
      logger.info(`Fetching popular courses as final attempt...`);
      try {
        const popularCourses = await DataFetcherService.fetchPopularCourses();
        totalFetched += popularCourses.length;
        logger.info(`✅ Fetched ${popularCourses.length} popular courses. Total: ${totalFetched}`);
      } catch (error) {
        logger.error('Error fetching popular courses:', error.message);
      }
    }

    logger.info(`✅ Bulk fetch complete! Total courses: ${totalFetched}`);
    process.exit(0);
  } catch (error) {
    logger.error('Bulk fetch error:', error);
    process.exit(1);
  }
}

bulkFetchCourses();

