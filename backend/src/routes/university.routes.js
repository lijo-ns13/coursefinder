import express from 'express';
import { UniversityController } from '../controllers/university.controller.js';

const router = express.Router();

router.get('/:universityName', UniversityController.getUniversityDetails);
router.get('/:universityName/courses', UniversityController.getUniversityCourses);

export default router;

