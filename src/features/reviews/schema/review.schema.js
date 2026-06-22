import { z } from "zod";

export const reviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10).max(2000),
    // Firestore document IDs aren't UUIDs — just require a non-empty id.
    package_id: z.string().min(1).optional(),
    destination_id: z.string().min(1).optional(),
  })
  .refine((d) => !!(d.package_id || d.destination_id), {
    message: "A package or destination target is required",
  });
