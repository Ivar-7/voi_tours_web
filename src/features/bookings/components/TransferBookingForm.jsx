import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import { transferBookingSchema } from "../schema/booking.schema";

const VEHICLE_OPTIONS = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV / 4x4" },
  { value: "van", label: "Van" },
  { value: "minibus", label: "Minibus" },
  { value: "coach", label: "Coach" },
];

/**
 * Shared form for both `sgr_transfer` and `flight` booking types.
 *
 * @param {{ onSubmit: (values: object) => void, type?: string }} props
 */
export default function TransferBookingForm({ onSubmit, type = "sgr_transfer" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transferBookingSchema),
    defaultValues: {
      pickup_location: "",
      dropoff_location: "",
      pickup_time: "",
      vehicle_type: "",
      flight_or_train_number: "",
    },
  });

  const isFlight = type === "flight";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Input
        label="Pickup location"
        placeholder={isFlight ? "JKIA Terminal 1A" : "Nairobi SGR Terminus"}
        error={errors.pickup_location?.message}
        {...register("pickup_location")}
      />
      <Input
        label="Drop-off location"
        placeholder="Hotel, residence, or office"
        error={errors.dropoff_location?.message}
        {...register("dropoff_location")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="datetime-local"
          label="Pickup time"
          error={errors.pickup_time?.message}
          {...register("pickup_time")}
        />
        <Select
          label="Vehicle type"
          placeholder="Choose a vehicle"
          options={VEHICLE_OPTIONS}
          error={errors.vehicle_type?.message}
          {...register("vehicle_type")}
        />
      </div>

      <Input
        label={isFlight ? "Flight number" : "Flight / train number"}
        hint="Optional — helps us track delays."
        placeholder={isFlight ? "KQ100" : "SGR Madaraka Express"}
        error={errors.flight_or_train_number?.message}
        {...register("flight_or_train_number")}
      />

      <Button type="submit">Continue</Button>
    </form>
  );
}
