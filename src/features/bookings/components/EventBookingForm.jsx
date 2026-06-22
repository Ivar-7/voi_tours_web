import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import { eventBookingSchema } from "../schema/booking.schema";

const EVENT_TYPE_OPTIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "conference", label: "Conference" },
  { value: "corporate_retreat", label: "Corporate Retreat" },
  { value: "birthday", label: "Birthday" },
  { value: "cultural", label: "Cultural Event" },
  { value: "other", label: "Other" },
];

const today = new Date().toISOString().slice(0, 10);

/**
 * @param {{ onSubmit: (values: object) => void }} props
 */
export default function EventBookingForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventBookingSchema),
    defaultValues: {
      event_name: "",
      event_type: "",
      venue_name: "",
      event_date: "",
      estimated_attendees: 1,
    },
  });

  function handleValid(values) {
    onSubmit({
      ...values,
      estimated_attendees: Number(values.estimated_attendees),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleValid)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Input
        label="Event name"
        placeholder="e.g. Amara & Jomo's Wedding"
        error={errors.event_name?.message}
        {...register("event_name")}
      />

      <Select
        label="Event type"
        placeholder="Choose an event type"
        options={EVENT_TYPE_OPTIONS}
        error={errors.event_type?.message}
        {...register("event_type")}
      />

      <Input
        label="Venue"
        placeholder="Venue name"
        error={errors.venue_name?.message}
        {...register("venue_name")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="date"
          label="Event date"
          min={today}
          error={errors.event_date?.message}
          {...register("event_date")}
        />
        <Input
          type="number"
          min={1}
          label="Estimated attendees"
          error={errors.estimated_attendees?.message}
          {...register("estimated_attendees", { valueAsNumber: true })}
        />
      </div>

      <Button type="submit">Continue</Button>
    </form>
  );
}
