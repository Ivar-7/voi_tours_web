import { z } from "zod";

export const safariBookingSchema = z.object({
  // Firestore document IDs aren't UUIDs — just require a non-empty id.
  package_id: z.string().min(1, "Select a package."),
  travel_date: z.string().date(),
  party_size: z.number().int().min(1),
});

export const transferBookingSchema = z.object({
  pickup_location: z.string().min(3),
  dropoff_location: z.string().min(3),
  // `local: true` accepts the bare (no UTC offset) value produced by
  // <input type="datetime-local">.
  pickup_time: z.string().datetime({ local: true }),
  vehicle_type: z.string().min(2),
  flight_or_train_number: z.string().optional(),
});

export const deliveryBookingSchema = z.object({
  sender_address: z.string().min(5),
  recipient_name: z.string().min(2),
  recipient_phone: z.string().min(10),
  delivery_address: z.string().min(5),
  parcel_weight_kg: z.number().positive().optional(),
  delivery_instructions: z.string().optional(),
});

export const hotelBookingSchema = z
  .object({
    hotel_name: z.string().min(2),
    room_category: z.string().min(2),
    check_in: z.string().date(),
    check_out: z.string().date(),
    number_of_rooms: z.number().int().min(1),
  })
  .refine((d) => d.check_out > d.check_in, {
    path: ["check_out"],
    message: "Check-out must be after check-in",
  });

export const eventBookingSchema = z.object({
  event_name: z.string().min(2),
  event_type: z.string().min(2),
  venue_name: z.string().min(2),
  event_date: z.string().date(),
  estimated_attendees: z.number().int().min(1),
});
