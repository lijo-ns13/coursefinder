import { z } from 'zod';

export const sendOTPSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  })
});

export const verifyOTPSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    otp: z.string().length(6, 'OTP must be 6 digits')
  })
});

