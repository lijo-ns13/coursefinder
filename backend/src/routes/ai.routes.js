import express from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/filter', AIController.filterCourses);
router.post('/compare', authenticate, AIController.compareCourses);
router.post('/recommend', AIController.getRecommendations);

export default router;

