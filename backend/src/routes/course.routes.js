import express from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { autoFetchIfEmpty } from '../middlewares/auto-fetch.js';

const router = express.Router();

// Auto-fetch if database is empty (only on search/popular endpoints)
router.get('/search', autoFetchIfEmpty, CourseController.searchCourses);
router.get('/popular', autoFetchIfEmpty, CourseController.getPopularCourses);
router.get('/:id', CourseController.getCourseById);

export default router;

