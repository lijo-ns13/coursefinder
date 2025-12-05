import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service.js';
import { OTPService } from '../services/otp.service.js';
import { logger } from '../config/logger.js';

export class AuthController {
  static async sendOTP(req, res, next) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
      }

      const otpCode = OTPService.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Find or create user
      let user = await UserService.findByPhone(phone);
      
      if (!user) {
        user = await UserService.create({
          phone,
          otp: { code: otpCode, expiresAt }
        });
      } else {
        user = await UserService.updateByPhone(phone, {
          otp: { code: otpCode, expiresAt }
        });
      }

      // Send OTP
      await OTPService.sendOTP(phone, otpCode);

      res.json({
        success: true,
        message: 'OTP sent successfully',
        expiresIn: 600 // seconds
      });
    } catch (error) {
      logger.error('Send OTP error:', error);
      next(error);
    }
  }

  static async verifyOTP(req, res, next) {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({ message: 'Phone and OTP are required' });
      }

      const user = await UserService.findByPhone(phone);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.otp || !user.otp.code) {
        return res.status(400).json({ message: 'OTP not found. Please request a new OTP' });
      }

      if (OTPService.isOTPExpired(user.otp.expiresAt)) {
        return res.status(400).json({ message: 'OTP expired. Please request a new one' });
      }

      if (user.otp.code !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Verify user and clear OTP
      user.isVerified = true;
      user.otp = undefined;
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, phone: user.phone, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        message: 'OTP verified successfully',
        token,
        user: {
          id: user._id,
          phone: user.phone,
          isVerified: user.isVerified,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Verify OTP error:', error);
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await UserService.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          phone: user.phone,
          isVerified: user.isVerified,
          profile: user.profile,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Get me error:', error);
      next(error);
    }
  }
}

