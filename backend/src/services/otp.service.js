import twilio from 'twilio';
import { logger } from '../config/logger.js';

// Initialize Twilio client only if credentials are available
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    logger.warn('Failed to initialize Twilio client:', error.message);
  }
}

export class OTPService {
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(phoneNumber, otpCode) {
    try {
      // In development or if Twilio is not configured, log OTP instead of sending SMS
      if (process.env.NODE_ENV === 'development' || !client || !process.env.TWILIO_PHONE_NUMBER) {
        logger.info(`OTP for ${phoneNumber}: ${otpCode}`);
        logger.info('Twilio not configured or in dev mode - OTP logged to console');
        return { success: true, message: 'OTP sent (dev mode - check console)' };
      }

      await client.messages.create({
        body: `Your CourseFinder verification code is: ${otpCode}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      logger.error('OTP send error:', error);
      // Fallback to dev mode if Twilio fails
      logger.info(`OTP for ${phoneNumber}: ${otpCode} (fallback mode)`);
      return { success: true, message: 'OTP sent (fallback mode - check console)' };
    }
  }

  static isOTPExpired(expiresAt) {
    return new Date() > new Date(expiresAt);
  }
}

