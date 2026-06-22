import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@shared/components/ui/Input";
import Textarea from "@shared/components/ui/Textarea";
import Button from "@shared/components/ui/Button";
import { deliveryBookingSchema } from "../schema/booking.schema";

/**
 * @param {{ onSubmit: (values: object) => void }} props
 */
export default function DeliveryBookingForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deliveryBookingSchema),
    defaultValues: {
      sender_address: "",
      recipient_name: "",
      recipient_phone: "",
      delivery_address: "",
      parcel_weight_kg: "",
      delivery_instructions: "",
    },
  });

  function handleValid(values) {
    onSubmit({
      ...values,
      parcel_weight_kg: values.parcel_weight_kg
        ? Number(values.parcel_weight_kg)
        : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleValid)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Input
        label="Sender address"
        error={errors.sender_address?.message}
        {...register("sender_address")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Recipient name"
          error={errors.recipient_name?.message}
          {...register("recipient_name")}
        />
        <Input
          label="Recipient phone"
          placeholder="07XXXXXXXX"
          error={errors.recipient_phone?.message}
          {...register("recipient_phone")}
        />
      </div>

      <Input
        label="Delivery address"
        error={errors.delivery_address?.message}
        {...register("delivery_address")}
      />

      <Input
        type="number"
        min={0}
        step="0.1"
        label="Parcel weight (kg)"
        hint="Optional"
        error={errors.parcel_weight_kg?.message}
        {...register("parcel_weight_kg")}
      />

      <Textarea
        label="Delivery instructions"
        hint="Optional"
        rows={3}
        error={errors.delivery_instructions?.message}
        {...register("delivery_instructions")}
      />

      <Button type="submit">Continue</Button>
    </form>
  );
}
