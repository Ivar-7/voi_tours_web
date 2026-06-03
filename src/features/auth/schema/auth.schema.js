// TODO: Zod schemas for auth forms
// loginSchema: { email, password }
// registerSchema: { full_name, email, phone, password, confirm_password, tier }
// forgotPasswordSchema: { email }

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  confirm_password: z.string(),
  tier: z.enum(['citizen', 'resident', 'international']),
}).refine((d) => d.password === d.confirm_password, {
  path: ['confirm_password'],
  message: 'Passwords do not match',
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
