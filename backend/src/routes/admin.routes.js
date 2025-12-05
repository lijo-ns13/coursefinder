import express from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

router.get('/dashboard', AdminController.getDashboard);
router.get('/users', AdminController.getAllUsers);
router.get('/courses', AdminController.getAllCourses);
router.post('/courses', AdminController.createCourse);
router.put('/courses/:id', AdminController.updateCourse);
router.get('/comparisons', AdminController.getAllComparisons);

export default router;

