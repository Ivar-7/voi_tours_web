// TODO: Zod schemas for payment initiation
import { z } from 'zod';

export const mpesaPaymentSchema = z.object({
  phone: z.string().regex(/^\+2547\d{8}$/, 'Enter a valid Safaricom number'),
});

export const stripePaymentSchema = z.object({
  // Card details handled by Stripe Elements — no local schema needed
});
