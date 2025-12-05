import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/send-otp', authRateLimiter, AuthController.sendOTP);
router.post('/verify-otp', authRateLimiter, AuthController.verifyOTP);
router.get('/me', authenticate, AuthController.getMe);

export default router;

