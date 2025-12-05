import express from 'express';
import { DataFetcherController } from '../controllers/data-fetcher.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

router.post('/fetch', DataFetcherController.fetchCourses);
router.post('/fetch-popular', DataFetcherController.fetchPopularCourses);
router.post('/fetch-by-country', DataFetcherController.fetchCoursesByCountry);
router.post('/refresh', DataFetcherController.refreshCourses);

export default router;

