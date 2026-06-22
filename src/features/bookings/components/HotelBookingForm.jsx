import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import { hotelBookingSchema } from "../schema/booking.schema";

const ROOM_CATEGORY_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "deluxe", label: "Deluxe" },
  { value: "suite", label: "Suite" },
  { value: "executive", label: "Executive" },
  { value: "family", label: "Family Room" },
];

const today = new Date().toISOString().slice(0, 10);

/**
 * @param {{ onSubmit: (values: object) => void }} props
 */
export default function HotelBookingForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hotelBookingSchema),
    defaultValues: {
      hotel_name: "",
      room_category: "",
      check_in: "",
      check_out: "",
      number_of_rooms: 1,
    },
  });

  function handleValid(values) {
    onSubmit({ ...values, number_of_rooms: Number(values.number_of_rooms) });
  }

  return (
    <form
      onSubmit={handleSubmit(handleValid)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Input
        label="Hotel"
        placeholder="Hotel name"
        error={errors.hotel_name?.message}
        {...register("hotel_name")}
      />

      <Select
        label="Room category"
        placeholder="Choose a room category"
        options={ROOM_CATEGORY_OPTIONS}
        error={errors.room_category?.message}
        {...register("room_category")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="date"
          label="Check-in"
          min={today}
          error={errors.check_in?.message}
          {...register("check_in")}
        />
        <Input
          type="date"
          label="Check-out"
          min={today}
          error={errors.check_out?.message}
          {...register("check_out")}
        />
      </div>

      <Input
        type="number"
        min={1}
        label="Number of rooms"
        error={errors.number_of_rooms?.message}
        {...register("number_of_rooms", { valueAsNumber: true })}
      />

      <Button type="submit">Continue</Button>
    </form>
  );
}
