import { z } from 'zod';

export const inquirySchema = z.object({
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(10),
  requested_service: z.enum(['safari', 'sgr_transfer', 'flight', 'hotel', 'event', 'delivery']),
  message: z.string().min(20).max(2000),
  // Honeypot — must be empty to pass
  _hp: z.string().max(0, 'Bot detected'),
});
