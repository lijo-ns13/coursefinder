import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.post('/save-course', UserController.saveCourse);
router.delete('/unsave-course/:courseId', UserController.unsaveCourse);
router.get('/saved-courses', UserController.getSavedCourses);
router.get('/saved-comparisons', UserController.getSavedComparisons);
router.get('/recent-views', UserController.getRecentViews);

export default router;

