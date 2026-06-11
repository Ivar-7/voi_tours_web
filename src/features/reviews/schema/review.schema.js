import { z } from "zod";

export const reviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10).max(2000),
    package_id: z.string().uuid().optional(),
    destination_id: z.string().uuid().optional(),
  })
  .refine((d) => !!(d.package_id || d.destination_id), {
    message: "A package or destination target is required",
  });
